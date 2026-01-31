# Skill Evaluation Test Harness

## Quick Start

```bash
cd tests
pnpm install
pnpm harness --list                              # List available skills
pnpm harness azure-ai-agents-py --mock --verbose # Run evaluation
pnpm test                                        # Run unit tests
```

## Overview

A TypeScript test framework for evaluating AI-generated code against acceptance criteria defined in skill files.

**Workflow:**
1. Load acceptance criteria from `.github/skills/<skill>/references/acceptance-criteria.md`
2. Run test scenarios from `tests/scenarios/<skill>/scenarios.yaml`
3. Generate code using GitHub Copilot SDK (or mock responses)
4. Evaluate code against correct/incorrect patterns
5. Report results via console, markdown, or JSON

## Architecture

```
tests/
├── harness/
│   ├── types.ts              # Type definitions
│   ├── criteria-loader.ts    # Parses acceptance-criteria.md
│   ├── evaluator.ts          # Validates code against patterns
│   ├── copilot-client.ts     # Wraps Copilot SDK (with mock fallback)
│   ├── runner.ts             # Main CLI runner
│   ├── ralph-loop.ts         # Iterative improvement loop
│   ├── feedback-builder.ts   # LLM-actionable feedback generator
│   ├── index.ts              # Package exports
│   └── reporters/
│       ├── console.ts        # Pretty console output
│       └── markdown.ts       # Markdown report generation
│
├── scenarios/
│   └── <skill-name>/
│       └── scenarios.yaml    # Test scenarios for the skill
│
├── fixtures/                 # Test fixtures
├── package.json              # Dependencies (pnpm)
├── tsconfig.json             # TypeScript config
└── vitest.config.ts          # Test configuration
```

## CLI Usage

```bash
# Basic usage
pnpm harness <skill-name>

# Options
pnpm harness azure-ai-agents-py \
    --mock                  # Use mock responses (no Copilot SDK)
    --verbose               # Show detailed output
    --filter basic          # Filter scenarios by name/tag
    --output json           # Output format (text/json)
    --output-file report.json

# Ralph Loop (iterative improvement)
pnpm harness azure-ai-agents-py \
    --ralph                 # Enable iterative improvement
    --max-iterations 5      # Max iterations per scenario
    --threshold 80          # Quality threshold (0-100)
```

## Ralph Loop

The Ralph Loop enables iterative code improvement by re-generating code until quality thresholds are met:

```
Generate → Evaluate → Analyze → Re-generate (with feedback)
    ↑                                    │
    └────────────────────────────────────┘
         (Loop until threshold met)
```

**Stop conditions:**
- Quality threshold met (default: 80)
- Perfect score (100)
- Max iterations reached (default: 5)
- No improvement between iterations
- Score regression

## Programmatic Usage

```typescript
import {
  AcceptanceCriteriaLoader,
  CodeEvaluator,
  SkillEvaluationRunner,
  RalphLoopController,
  createRalphConfig,
} from './harness';

// Simple evaluation
const loader = new AcceptanceCriteriaLoader();
const criteria = loader.load('azure-ai-agents-py');
const evaluator = new CodeEvaluator(criteria);

const result = evaluator.evaluate(code, 'my-test');
console.log(`Score: ${result.score}`);

// Full runner
const runner = new SkillEvaluationRunner({ useMock: true });
const summary = await runner.run('azure-ai-agents-py');

// With Ralph Loop
const ralphSummary = await runner.runWithLoop('azure-ai-agents-py', undefined, {
  maxIterations: 5,
  qualityThreshold: 80,
});
```

## Adding Tests for a New Skill

### 1. Create Acceptance Criteria

Create `.github/skills/<skill-name>/references/acceptance-criteria.md`:

```markdown
# Acceptance Criteria: skill-name

## Imports

### ✅ Correct
\`\`\`python
from azure.ai.mymodule import MyClient
\`\`\`

### ❌ Incorrect
\`\`\`python
from azure.ai.mymodule.models import MyClient  # Wrong location
\`\`\`
```

### 2. Create Test Scenarios

Create `tests/scenarios/<skill-name>/scenarios.yaml`:

```yaml
config:
  model: gpt-4
  max_tokens: 2000
  temperature: 0.3

scenarios:
  - name: basic_usage
    prompt: |
      Create a basic example using the SDK.
    expected_patterns:
      - "DefaultAzureCredential"
    forbidden_patterns:
      - "hardcoded-endpoint"
    tags:
      - basic
    mock_response: |
      from azure.identity import DefaultAzureCredential
      # ... working example
```

### 3. Run Tests

```bash
pnpm harness <skill-name> --mock --verbose
pnpm test
```

## Evaluation Scoring

| Factor | Impact |
|--------|--------|
| Syntax error | -100 |
| Incorrect pattern found | -15 each |
| Error finding | -20 each |
| Warning finding | -5 each |
| Correct pattern matched | +5 each |

A result **passes** if it has no error-severity findings.

## Test Coverage

**127 skills with 1128 test scenarios**

| Language | Skills | Scenarios |
|----------|--------|-----------|
| Core | 5 | 40 |
| Python | 41 | 358 |
| .NET | 29 | 296 |
| TypeScript | 24 | 255 |
| Java | 28 | 179 |

```bash
pnpm harness --list  # See all available skills
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No skills found | Check `acceptance-criteria.md` exists in `references/` |
| Copilot SDK unavailable | Use `--mock` flag |
| Tests fail with real Copilot | Mock responses are hand-crafted; review criteria flexibility |
