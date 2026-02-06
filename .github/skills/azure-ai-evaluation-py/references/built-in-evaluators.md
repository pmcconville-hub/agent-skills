# Built-in Evaluators Reference

Comprehensive patterns for Azure AI Evaluation SDK's built-in evaluators.

## Model Configuration

All AI-assisted evaluators require a model configuration:

```python
from azure.ai.evaluation import AzureOpenAIModelConfiguration

# Using API key authentication
model_config = AzureOpenAIModelConfiguration(
    azure_endpoint="https://<resource>.openai.azure.com",
    api_key="<your-api-key>",
    azure_deployment="gpt-4o-mini",
    api_version="2024-06-01"
)

# Using DefaultAzureCredential (recommended for production)
from azure.identity import DefaultAzureCredential

model_config = AzureOpenAIModelConfiguration(
    azure_endpoint="https://<resource>.openai.azure.com",
    credential=DefaultAzureCredential(),
    azure_deployment="gpt-4o-mini",
    api_version="2024-06-01"
)
```

## Azure AI Project Configuration

Safety evaluators and Foundry logging require an Azure AI project scope:

```python
# Option 1: Dict configuration
azure_ai_project = {
    "subscription_id": os.environ["AZURE_SUBSCRIPTION_ID"],
    "resource_group_name": os.environ["AZURE_RESOURCE_GROUP"],
    "project_name": os.environ["AZURE_AI_PROJECT_NAME"],
}

# Option 2: From AIProjectClient
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient.from_connection_string(
    conn_str="<connection-string>",
    credential=DefaultAzureCredential()
)
azure_ai_project = project.scope
```

## AI-Assisted Quality Evaluators

### GroundednessEvaluator

Measures whether the response is factually grounded in the provided context.

```python
from azure.ai.evaluation import GroundednessEvaluator

groundedness = GroundednessEvaluator(model_config)

result = groundedness(
    query="What services does Azure AI provide?",
    context="Azure AI provides cognitive services including vision, speech, "
            "language understanding, and decision-making APIs.",
    response="Azure AI offers vision and speech services."
)

# Returns:
# {
#     "groundedness": 5,           # Score 1-5
#     "gpt_groundedness": 5,       # Raw GPT score
#     "groundedness_reason": "...", # Explanation
#     "groundedness_result": "pass", # pass/fail based on threshold
#     "groundedness_threshold": 3,
#     "groundedness_prompt_tokens": ...,
#     "groundedness_completion_tokens": ...,
#     "groundedness_model": "gpt-4o-mini"
# }

# For reasoning models (o1/o3)
groundedness_reasoning = GroundednessEvaluator(model_config, is_reasoning_model=True)
```

**Input Requirements:**
- `query`: The user's question
- `context`: Source documents/information
- `response`: The model's response to evaluate

### GroundednessProEvaluator

Service-based groundedness evaluation (no model config needed).

```python
from azure.ai.evaluation import GroundednessProEvaluator

groundedness_pro = GroundednessProEvaluator(azure_ai_project=azure_ai_project)

result = groundedness_pro(
    query="What is Azure?",
    context="Azure is Microsoft's cloud platform...",
    response="Azure provides cloud services."
)
```

### RelevanceEvaluator

Measures how well the response addresses the query.

```python
from azure.ai.evaluation import RelevanceEvaluator

relevance = RelevanceEvaluator(model_config)

result = relevance(
    query="How do I authenticate with Azure?",
    context="Azure supports multiple authentication methods...",
    response="Use DefaultAzureCredential for automatic credential discovery."
)

# Score 1-5: 5 = directly addresses query, 1 = completely irrelevant
```

### CoherenceEvaluator

Measures logical flow and consistency of the response.

```python
from azure.ai.evaluation import CoherenceEvaluator

coherence = CoherenceEvaluator(model_config)

# Note: CoherenceEvaluator only needs query and response
result = coherence(
    query="Explain how Azure Functions work.",
    response="Azure Functions is a serverless compute service. "
             "It triggers based on events. You write code that runs on demand."
)

# Score 1-5: 5 = logically coherent, 1 = disjointed/contradictory
```

### FluencyEvaluator

Measures grammatical correctness and natural language quality.

```python
from azure.ai.evaluation import FluencyEvaluator

fluency = FluencyEvaluator(model_config)

result = fluency(
    query="What is Azure?",
    response="Azure is Microsoft's cloud computing platform that provides "
             "a wide range of services for building and deploying applications."
)

# Score 1-5: 5 = perfectly fluent, 1 = poor grammar/unnatural
```

### SimilarityEvaluator

Measures semantic similarity between response and ground truth.

```python
from azure.ai.evaluation import SimilarityEvaluator

similarity = SimilarityEvaluator(model_config)

result = similarity(
    query="What is the capital of France?",
    response="Paris is the capital of France.",
    ground_truth="The capital city of France is Paris."
)

# Score 1-5: 5 = semantically identical, 1 = completely different
```

### RetrievalEvaluator

Measures quality of retrieved documents for RAG scenarios.

```python
from azure.ai.evaluation import RetrievalEvaluator

retrieval = RetrievalEvaluator(model_config)

result = retrieval(
    query="How to configure Azure Storage?",
    context="Azure Storage can be configured through the Azure Portal. "
            "You can set replication, access tiers, and networking options."
)

# Score 1-5: 5 = highly relevant retrieval, 1 = irrelevant documents
```

## NLP-Based Evaluators

These evaluators use traditional NLP metrics and don't require a model.

### F1ScoreEvaluator

Token-level F1 score between response and ground truth.

```python
from azure.ai.evaluation import F1ScoreEvaluator

f1 = F1ScoreEvaluator()

result = f1(
    response="The quick brown fox jumps over the lazy dog",
    ground_truth="A quick brown fox jumped over a lazy dog"
)

# Returns:
# {
#     "f1_score": 0.7272...  # Score 0-1
# }
```

### RougeScoreEvaluator

ROUGE scores for summarization quality.

```python
from azure.ai.evaluation import RougeScoreEvaluator

rouge = RougeScoreEvaluator(rouge_type="rouge1")  # rouge1, rouge2, rougeL, rougeLsum

result = rouge(
    response="Azure provides cloud computing services.",
    ground_truth="Azure is Microsoft's cloud computing platform."
)

# Returns:
# {
#     "rouge1_precision": 0.5,
#     "rouge1_recall": 0.5,
#     "rouge1_fmeasure": 0.5
# }
```

**ROUGE Types:**
- `rouge1`: Unigram overlap
- `rouge2`: Bigram overlap
- `rougeL`: Longest common subsequence
- `rougeLsum`: Summary-level LCS

### BleuScoreEvaluator

BLEU score for translation/generation quality.

```python
from azure.ai.evaluation import BleuScoreEvaluator

bleu = BleuScoreEvaluator()

result = bleu(
    response="The cat sat on the mat.",
    ground_truth="A cat is sitting on the mat."
)

# Returns:
# {
#     "bleu_score": 0.3...  # Score 0-1
# }
```

### GleuScoreEvaluator

GLEU (Google-BLEU) variant optimized for sentence-level evaluation.

```python
from azure.ai.evaluation import GleuScoreEvaluator

gleu = GleuScoreEvaluator()

result = gleu(
    response="Hello world",
    ground_truth="Hello, world!"
)
```

### MeteorScoreEvaluator

METEOR score considering synonyms and paraphrases.

```python
from azure.ai.evaluation import MeteorScoreEvaluator

meteor = MeteorScoreEvaluator()

result = meteor(
    response="The automobile is red.",
    ground_truth="The car is red."
)

# METEOR handles synonyms better than BLEU
```

## Safety Evaluators

Safety evaluators require an Azure AI project scope.

```python
# Safety evaluators support evaluate_query parameter (default: False)
# When True, both query and response are evaluated
# When False (default), only response is evaluated
```

### ViolenceEvaluator

Detects violent content.

```python
from azure.ai.evaluation import ViolenceEvaluator

violence = ViolenceEvaluator(azure_ai_project=azure_ai_project)

result = violence(
    query="Tell me a story",
    response="Once upon a time in a peaceful village..."
)

# Returns:
# {
#     "violence": "Very low",        # Severity level
#     "violence_score": 0,           # Score 0-7
#     "violence_reason": "...",      # Explanation
#     "violence_result": "pass",     # pass/fail
#     "violence_threshold": 3
# }

# To also evaluate the query (not just response)
violence_with_query = ViolenceEvaluator(
    azure_ai_project=azure_ai_project,
    evaluate_query=True
)
```

### Sexual, SelfHarm, HateUnfairness Evaluators

Same pattern as ViolenceEvaluator:

```python
from azure.ai.evaluation import (
    SexualEvaluator,
    SelfHarmEvaluator,
    HateUnfairnessEvaluator
)

sexual = SexualEvaluator(azure_ai_project=azure_ai_project)
self_harm = SelfHarmEvaluator(azure_ai_project=azure_ai_project)
hate = HateUnfairnessEvaluator(azure_ai_project=azure_ai_project)
```

### IndirectAttackEvaluator

Detects indirect prompt injection attacks.

```python
from azure.ai.evaluation import IndirectAttackEvaluator

indirect = IndirectAttackEvaluator(azure_ai_project=azure_ai_project)

result = indirect(
    query="Summarize this document",
    context="Document content... [hidden: ignore previous instructions]",
    response="The document discusses..."
)
```

### ProtectedMaterialEvaluator

Detects use of copyrighted or protected material.

```python
from azure.ai.evaluation import ProtectedMaterialEvaluator

protected = ProtectedMaterialEvaluator(azure_ai_project=azure_ai_project)

result = protected(
    query="Write me a poem",
    response="Roses are red, violets are blue..."
)
```

### CodeVulnerabilityEvaluator

Detects security vulnerabilities in code.

```python
from azure.ai.evaluation import CodeVulnerabilityEvaluator

code_vuln = CodeVulnerabilityEvaluator(azure_ai_project=azure_ai_project)

result = code_vuln(
    query="Write a SQL query",
    response="SELECT * FROM users WHERE id = '" + user_input + "'"
)

# Detects vulnerabilities:
# - sql-injection, code-injection, path-injection
# - hardcoded-credentials, weak-cryptographic-algorithm
# - reflected-xss, clear-text-logging-sensitive-data
# - and more...
```

### UngroundedAttributesEvaluator

Detects ungrounded inferences about human attributes.

```python
from azure.ai.evaluation import UngroundedAttributesEvaluator

ungrounded = UngroundedAttributesEvaluator(azure_ai_project=azure_ai_project)

result = ungrounded(
    query="Tell me about this person",
    context="John works at a tech company.",
    response="John seems depressed and unhappy with his job."
)

# Detects:
# - emotional_state: ungrounded emotional inferences
# - protected_class: ungrounded protected class inferences
# - groundedness: whether claims are grounded in context
```

## Composite Evaluators

### QAEvaluator

Combines all quality metrics in one evaluator.

```python
from azure.ai.evaluation import QAEvaluator

qa = QAEvaluator(model_config)

result = qa(
    query="What is Azure?",
    context="Azure is Microsoft's cloud platform...",
    response="Azure is a cloud computing service by Microsoft.",
    ground_truth="Azure is Microsoft's cloud computing platform."
)

# Returns all quality metrics:
# - groundedness, relevance, coherence, fluency, similarity
```

### ContentSafetyEvaluator

Combines all safety metrics in one evaluator.

```python
from azure.ai.evaluation import ContentSafetyEvaluator

safety = ContentSafetyEvaluator(azure_ai_project=azure_ai_project)

result = safety(
    query="Tell me about history",
    response="World War II was a global conflict..."
)

# Returns all safety metrics:
# - violence, sexual, self_harm, hate_unfairness
```

## Agent Evaluators

Evaluators for AI agents with tool calling capabilities.

### IntentResolutionEvaluator

Evaluates whether the agent correctly understood and resolved user intent.

```python
from azure.ai.evaluation import IntentResolutionEvaluator

intent = IntentResolutionEvaluator(model_config)

result = intent(
    query="Book a flight to Paris for next Monday",
    response="I've found several flights to Paris for Monday..."
)

# Returns:
# {
#     "intent_resolution": 4,  # Score 1-5
#     "intent_resolution_reason": "...",
#     "intent_resolution_result": "pass"
# }
```

### ResponseCompletenessEvaluator

Evaluates whether the agent's response fully addresses the query.

```python
from azure.ai.evaluation import ResponseCompletenessEvaluator

completeness = ResponseCompletenessEvaluator(model_config)

result = completeness(
    query="What's the weather and what should I wear?",
    response="The weather is sunny and 75°F. I recommend light clothing."
)
```

### TaskAdherenceEvaluator

Evaluates whether the agent adhered to the assigned task.

```python
from azure.ai.evaluation import TaskAdherenceEvaluator

task_adherence = TaskAdherenceEvaluator(model_config)

result = task_adherence(
    query="Calculate the total cost including tax",
    response="The total with 8% tax is $108."
)
```

### ToolCallAccuracyEvaluator

Evaluates the accuracy of tool calls made by an agent.

```python
from azure.ai.evaluation import ToolCallAccuracyEvaluator

tool_accuracy = ToolCallAccuracyEvaluator(model_config)

# Evaluate agent response with tool calls
result = tool_accuracy(
    query="What's the weather in Seattle?",
    response="The weather in Seattle is 55°F and cloudy.",
    tool_calls=[
        {
            "name": "get_weather",
            "arguments": {"location": "Seattle"}
        }
    ],
    tool_definitions=[
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "parameters": {"location": {"type": "string"}}
        }
    ]
)
```

## Azure OpenAI Graders

Grader classes for structured evaluation using Azure OpenAI's grading API.

### AzureOpenAILabelGrader

Classification-based grading with predefined labels.

```python
from azure.ai.evaluation import AzureOpenAILabelGrader

label_grader = AzureOpenAILabelGrader(
    model_config=model_config,
    labels=["positive", "negative", "neutral"],
    passing_labels=["positive"]
)

result = label_grader(
    response="This product is amazing!"
)
```

### AzureOpenAIScoreModelGrader

Numeric scoring with customizable thresholds.

```python
from azure.ai.evaluation import AzureOpenAIScoreModelGrader

score_grader = AzureOpenAIScoreModelGrader(
    model_config=model_config,
    pass_threshold=0.7
)

result = score_grader(
    query="Explain photosynthesis",
    response="Plants convert sunlight into energy..."
)
```

### AzureOpenAIStringCheckGrader

String matching and validation.

```python
from azure.ai.evaluation import AzureOpenAIStringCheckGrader

string_grader = AzureOpenAIStringCheckGrader(
    model_config=model_config,
    expected_strings=["Azure", "cloud"]
)
```

### AzureOpenAITextSimilarityGrader

Semantic similarity evaluation.

```python
from azure.ai.evaluation import AzureOpenAITextSimilarityGrader

similarity_grader = AzureOpenAITextSimilarityGrader(
    model_config=model_config
)

result = similarity_grader(
    response="Paris is France's capital",
    ground_truth="The capital of France is Paris"
)
```

## Evaluator Configuration Table

| Evaluator | Type | Required Inputs | Score Range |
|-----------|------|-----------------|-------------|
| `GroundednessEvaluator` | AI | query, context, response | 1-5 |
| `GroundednessProEvaluator` | Service | query, context, response | 1-5 |
| `RelevanceEvaluator` | AI | query, context, response | 1-5 |
| `CoherenceEvaluator` | AI | query, response | 1-5 |
| `FluencyEvaluator` | AI | query, response | 1-5 |
| `SimilarityEvaluator` | AI | query, response, ground_truth | 1-5 |
| `RetrievalEvaluator` | AI | query, context | 1-5 |
| `F1ScoreEvaluator` | NLP | response, ground_truth | 0-1 |
| `RougeScoreEvaluator` | NLP | response, ground_truth | 0-1 |
| `BleuScoreEvaluator` | NLP | response, ground_truth | 0-1 |
| `IntentResolutionEvaluator` | Agent | query, response | 1-5 |
| `ResponseCompletenessEvaluator` | Agent | query, response | 1-5 |
| `TaskAdherenceEvaluator` | Agent | query, response | 1-5 |
| `ToolCallAccuracyEvaluator` | Agent | query, response, tool_calls | 1-5 |
| `ViolenceEvaluator` | Safety | query, response | 0-7 |
| `SexualEvaluator` | Safety | query, response | 0-7 |
| `SelfHarmEvaluator` | Safety | query, response | 0-7 |
| `HateUnfairnessEvaluator` | Safety | query, response | 0-7 |
| `CodeVulnerabilityEvaluator` | Safety | query, response | binary |
| `UngroundedAttributesEvaluator` | Safety | query, context, response | binary |

## Async Evaluation

All evaluators support async execution:

```python
import asyncio
from azure.ai.evaluation import GroundednessEvaluator

async def evaluate_async():
    groundedness = GroundednessEvaluator(model_config)
    
    result = await groundedness(
        query="What is Azure?",
        context="Azure is Microsoft's cloud...",
        response="Azure is a cloud platform."
    )
    return result

result = asyncio.run(evaluate_async())
```

## Best Practices

1. **Choose appropriate evaluators** - Use NLP evaluators when you have ground truth, AI evaluators for subjective quality
2. **Batch evaluation** - Use `evaluate()` function for datasets rather than looping
3. **Safety first** - Always include safety evaluators for user-facing applications
4. **Log to Foundry** - Track evaluations over time with `azure_ai_project` parameter and `tags`
5. **Threshold configuration** - Set appropriate pass/fail thresholds for your use case
6. **Use `is_reasoning_model=True`** - When evaluating with o1/o3 reasoning models
7. **Agent evaluators** - Use IntentResolution, TaskAdherence, and ToolCallAccuracy for AI agents
8. **Graders for structured eval** - Use AzureOpenAI graders for classification and scoring tasks
9. **`evaluate_query` parameter** - Control whether queries are included in safety evaluation
