---
name: azure-ai-evaluation-py
description: |
  Azure AI Evaluation SDK for Python. Use for evaluating generative AI applications with quality, safety, agent, and custom evaluators.
  Triggers: "azure-ai-evaluation", "evaluators", "GroundednessEvaluator", "evaluate", "AI quality metrics", "RedTeam", "agent evaluation".
package: azure-ai-evaluation
---

# Azure AI Evaluation SDK for Python

Assess generative AI application performance with built-in quality, safety, agent evaluators, Azure OpenAI graders, and custom evaluators.

## Installation

```bash
pip install azure-ai-evaluation

# With red team support
pip install azure-ai-evaluation[redteam]
```

## Environment Variables

```bash
# For AI-assisted evaluators
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com
AZURE_OPENAI_API_KEY=<your-api-key>
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini

# For Foundry project integration
AIPROJECT_CONNECTION_STRING=<your-connection-string>
```

## Built-in Evaluators

### Quality Evaluators (AI-Assisted)

```python
from azure.ai.evaluation import (
    GroundednessEvaluator,
    GroundednessProEvaluator,  # Service-based groundedness
    RelevanceEvaluator,
    CoherenceEvaluator,
    FluencyEvaluator,
    SimilarityEvaluator,
    RetrievalEvaluator
)

# Initialize with Azure OpenAI model config
model_config = {
    "azure_endpoint": os.environ["AZURE_OPENAI_ENDPOINT"],
    "api_key": os.environ["AZURE_OPENAI_API_KEY"],
    "azure_deployment": os.environ["AZURE_OPENAI_DEPLOYMENT"]
}

groundedness = GroundednessEvaluator(model_config)
relevance = RelevanceEvaluator(model_config)
coherence = CoherenceEvaluator(model_config)

# For reasoning models (o1/o3), use is_reasoning_model parameter
groundedness_reasoning = GroundednessEvaluator(model_config, is_reasoning_model=True)
```

### Quality Evaluators (NLP-based)

```python
from azure.ai.evaluation import (
    F1ScoreEvaluator,
    RougeScoreEvaluator,
    BleuScoreEvaluator,
    GleuScoreEvaluator,
    MeteorScoreEvaluator
)

f1 = F1ScoreEvaluator()
rouge = RougeScoreEvaluator()
bleu = BleuScoreEvaluator()
```

### Safety Evaluators

```python
from azure.ai.evaluation import (
    ViolenceEvaluator,
    SexualEvaluator,
    SelfHarmEvaluator,
    HateUnfairnessEvaluator,
    IndirectAttackEvaluator,
    ProtectedMaterialEvaluator,
    CodeVulnerabilityEvaluator,
    UngroundedAttributesEvaluator
)

# Project scope for safety evaluators
azure_ai_project = {
    "subscription_id": os.environ["AZURE_SUBSCRIPTION_ID"],
    "resource_group_name": os.environ["AZURE_RESOURCE_GROUP"],
    "project_name": os.environ["AZURE_AI_PROJECT_NAME"],
}

violence = ViolenceEvaluator(azure_ai_project=azure_ai_project)
sexual = SexualEvaluator(azure_ai_project=azure_ai_project)
code_vuln = CodeVulnerabilityEvaluator(azure_ai_project=azure_ai_project)

# Control whether queries are evaluated (default: False, only response evaluated)
violence_with_query = ViolenceEvaluator(azure_ai_project=azure_ai_project, evaluate_query=True)
```

### Agent Evaluators

```python
from azure.ai.evaluation import (
    IntentResolutionEvaluator,
    ResponseCompletenessEvaluator,
    TaskAdherenceEvaluator,
    ToolCallAccuracyEvaluator
)

intent = IntentResolutionEvaluator(model_config)
completeness = ResponseCompletenessEvaluator(model_config)
task_adherence = TaskAdherenceEvaluator(model_config)
tool_accuracy = ToolCallAccuracyEvaluator(model_config)
```

## Single Row Evaluation

```python
from azure.ai.evaluation import GroundednessEvaluator

groundedness = GroundednessEvaluator(model_config)

result = groundedness(
    query="What is Azure AI?",
    context="Azure AI is Microsoft's AI platform...",
    response="Azure AI provides AI services and tools."
)

print(f"Groundedness score: {result['groundedness']}")
print(f"Reason: {result['groundedness_reason']}")
```

## Batch Evaluation with evaluate()

```python
from azure.ai.evaluation import evaluate

result = evaluate(
    data="test_data.jsonl",
    evaluators={
        "groundedness": groundedness,
        "relevance": relevance,
        "coherence": coherence
    },
    evaluator_config={
        "default": {
            "column_mapping": {
                "query": "${data.query}",
                "context": "${data.context}",
                "response": "${data.response}"
            }
        }
    },
    # Optional: Add tags for experiment tracking
    tags={"experiment": "v1", "model": "gpt-4o"}
)

print(result["metrics"])
```

## Composite Evaluators

```python
from azure.ai.evaluation import QAEvaluator, ContentSafetyEvaluator

# All quality metrics in one
qa_evaluator = QAEvaluator(model_config)

# All safety metrics in one
safety_evaluator = ContentSafetyEvaluator(azure_ai_project=azure_ai_project)

result = evaluate(
    data="data.jsonl",
    evaluators={
        "qa": qa_evaluator,
        "content_safety": safety_evaluator
    }
)
```

## Azure OpenAI Graders

Use grader classes for structured evaluation via Azure OpenAI's grading API:

```python
from azure.ai.evaluation import (
    AzureOpenAILabelGrader,
    AzureOpenAIStringCheckGrader,
    AzureOpenAITextSimilarityGrader,
    AzureOpenAIScoreModelGrader,
    AzureOpenAIPythonGrader
)

# Label grader for classification
label_grader = AzureOpenAILabelGrader(
    model_config=model_config,
    labels=["positive", "negative", "neutral"],
    passing_labels=["positive"]
)

# Score model grader with custom threshold
score_grader = AzureOpenAIScoreModelGrader(
    model_config=model_config,
    pass_threshold=0.7
)

# Use graders as evaluators in evaluate()
result = evaluate(
    data="data.jsonl",
    evaluators={
        "sentiment": label_grader,
        "quality": score_grader
    }
)
```

## Evaluate Application Target

```python
from azure.ai.evaluation import evaluate
from my_app import chat_app  # Your application

result = evaluate(
    data="queries.jsonl",
    target=chat_app,  # Callable that takes query, returns response
    evaluators={
        "groundedness": groundedness
    },
    evaluator_config={
        "default": {
            "column_mapping": {
                "query": "${data.query}",
                "context": "${outputs.context}",
                "response": "${outputs.response}"
            }
        }
    }
)
```

## Custom Evaluators

### Code-Based

```python
from azure.ai.evaluation import evaluator

@evaluator
def word_count_evaluator(response: str) -> dict:
    return {"word_count": len(response.split())}

# Use in evaluate()
result = evaluate(
    data="data.jsonl",
    evaluators={"word_count": word_count_evaluator}
)
```

### Class-Based with Initialization

```python
class DomainSpecificEvaluator:
    def __init__(self, domain_terms: list[str], threshold: float = 0.5):
        self.domain_terms = [t.lower() for t in domain_terms]
        self.threshold = threshold
    
    def __call__(self, response: str) -> dict:
        response_lower = response.lower()
        matches = sum(1 for term in self.domain_terms if term in response_lower)
        score = matches / len(self.domain_terms) if self.domain_terms else 0
        return {
            "domain_relevance": score,
            "passes_threshold": score >= self.threshold
        }

# Usage
domain_eval = DomainSpecificEvaluator(domain_terms=["azure", "cloud", "api"])
```

### Prompt-Based with Azure OpenAI

```python
from openai import AzureOpenAI
import json

class PromptBasedEvaluator:
    def __init__(self, model_config: dict):
        self.client = AzureOpenAI(
            azure_endpoint=model_config["azure_endpoint"],
            api_key=model_config.get("api_key"),
            api_version="2024-06-01"
        )
        self.deployment = model_config["azure_deployment"]
    
    def __call__(self, query: str, response: str) -> dict:
        prompt = f"Rate this response 1-5 for helpfulness. Query: {query}, Response: {response}. Return JSON: {{\"score\": <int>}}"
        completion = self.client.chat.completions.create(
            model=self.deployment,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            response_format={"type": "json_object"}
        )
        result = json.loads(completion.choices[0].message.content)
        return {"helpfulness": result["score"]}
```

## Log to Foundry Project

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient.from_connection_string(
    conn_str=os.environ["AIPROJECT_CONNECTION_STRING"],
    credential=DefaultAzureCredential()
)

result = evaluate(
    data="data.jsonl",
    evaluators={"groundedness": groundedness},
    azure_ai_project=project.scope,  # Logs results to Foundry
    tags={"version": "1.0", "experiment": "baseline"}
)

print(f"View results: {result['studio_url']}")
```

## Red Team Adversarial Testing

```python
from azure.ai.evaluation.red_team import RedTeam, AttackStrategy
from azure.identity import DefaultAzureCredential

red_team = RedTeam(
    azure_ai_project=azure_ai_project,
    credential=DefaultAzureCredential()
)

# Run adversarial scan against your application
result = await red_team.scan(
    target=my_chat_app,  # Your application callable
    risk_categories=["violence", "hate_unfairness", "sexual", "self_harm"],
    attack_strategies=[
        AttackStrategy.DIRECT,
        AttackStrategy.MultiTurn,
        AttackStrategy.Crescendo
    ],
    attack_success_thresholds={"violence": 3, "hate_unfairness": 3}
)

print(f"Attack success rate: {result.attack_success_rate}")
```

## Multimodal Evaluation

```python
from azure.ai.evaluation import ContentSafetyEvaluator

safety = ContentSafetyEvaluator(azure_ai_project=azure_ai_project)

# Evaluate conversations with images
conversation = {
    "messages": [
        {"role": "user", "content": [
            {"type": "text", "text": "Describe this image"},
            {"type": "image_url", "image_url": {"url": "https://example.com/image.jpg"}}
        ]},
        {"role": "assistant", "content": [
            {"type": "text", "text": "The image shows..."}
        ]}
    ]
}

result = safety(conversation=conversation)
```

## Evaluator Reference

| Evaluator | Type | Metrics |
|-----------|------|---------|
| `GroundednessEvaluator` | AI | groundedness (1-5) |
| `GroundednessProEvaluator` | Service | groundedness (1-5) |
| `RelevanceEvaluator` | AI | relevance (1-5) |
| `CoherenceEvaluator` | AI | coherence (1-5) |
| `FluencyEvaluator` | AI | fluency (1-5) |
| `SimilarityEvaluator` | AI | similarity (1-5) |
| `RetrievalEvaluator` | AI | retrieval (1-5) |
| `F1ScoreEvaluator` | NLP | f1_score (0-1) |
| `RougeScoreEvaluator` | NLP | rouge scores |
| `BleuScoreEvaluator` | NLP | bleu_score (0-1) |
| `IntentResolutionEvaluator` | Agent | intent_resolution (1-5) |
| `ResponseCompletenessEvaluator` | Agent | response_completeness (1-5) |
| `TaskAdherenceEvaluator` | Agent | task_adherence (1-5) |
| `ToolCallAccuracyEvaluator` | Agent | tool_call_accuracy (1-5) |
| `ViolenceEvaluator` | Safety | violence (0-7) |
| `SexualEvaluator` | Safety | sexual (0-7) |
| `SelfHarmEvaluator` | Safety | self_harm (0-7) |
| `HateUnfairnessEvaluator` | Safety | hate_unfairness (0-7) |
| `CodeVulnerabilityEvaluator` | Safety | code vulnerabilities |
| `UngroundedAttributesEvaluator` | Safety | ungrounded attributes |
| `QAEvaluator` | Composite | All quality metrics |
| `ContentSafetyEvaluator` | Composite | All safety metrics |

## Best Practices

1. **Use composite evaluators** for comprehensive assessment
2. **Map columns correctly** — mismatched columns cause silent failures
3. **Log to Foundry** for tracking and comparison across runs with `tags`
4. **Create custom evaluators** for domain-specific metrics
5. **Use NLP evaluators** when you have ground truth answers
6. **Safety evaluators require** Azure AI project scope
7. **Batch evaluation** is more efficient than single-row loops
8. **Use graders** for structured evaluation with Azure OpenAI's grading API
9. **Agent evaluators** for AI agents with tool calls
10. **RedTeam scanning** for adversarial safety testing before deployment
11. **Use `is_reasoning_model=True`** when evaluating with o1/o3 models

## Reference Files

| File | Contents |
|------|----------|
| [references/built-in-evaluators.md](references/built-in-evaluators.md) | Detailed patterns for AI-assisted, NLP-based, Safety, and Agent evaluators with configuration tables |
| [references/custom-evaluators.md](references/custom-evaluators.md) | Creating code-based and prompt-based custom evaluators, testing patterns |
| [scripts/run_batch_evaluation.py](scripts/run_batch_evaluation.py) | CLI tool for running batch evaluations with quality, safety, agent, and custom evaluators |
