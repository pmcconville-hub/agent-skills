# Agent Skills

Skills, prompts, and MCP configurations for AI coding agents working with Azure SDKs and Microsoft AI Foundry.

> **Blog post:** [Context-Driven Development: Agent Skills for Microsoft Foundry and Azure](https://devblogs.microsoft.com/all-things-azure/context-driven-development-agent-skills-for-microsoft-foundry-and-azure/)

![Context-Driven Development Architecture](https://raw.githubusercontent.com/microsoft/agent-skills/main/assets/agent-skills-image.png)

---

## What is This?

Modern coding agents (GitHub Copilot, Claude Code, Codex) are powerful but lack domain-specific knowledge. This repo provides the "onboarding guides" that turn general-purpose agents into Azure SDK experts.

**Context-driven development** = Right context → Right time → Better output.

> [!IMPORTANT]
> **Use skills selectively.** Loading all skills causes context rot—diluted attention, wasted tokens, conflated patterns. Only copy skills essential for your current project.

---

## Quick Start

```bash
# Copy a skill to your project
cp -r skills/python/messaging/servicebus /path/to/your-project/.github/skills/

# VS Code Copilot: Auto-discovered from .github/skills/
# Claude: Reference SKILL.md in project instructions
```

---

## Skill Catalog

### Core Skills — Auto-discovered

> Location: `.github/skills/` • 16 skills

| Category | Skills |
|----------|--------|
| **AI Foundry** | [foundry-sdk-python](.github/skills/foundry-sdk-python/), [foundry-iq-python](.github/skills/foundry-iq-python/), [azure-ai-agents-python](.github/skills/azure-ai-agents-python/), [agent-framework-azure-hosted-agents](.github/skills/agent-framework-azure-hosted-agents/) |
| **AI Services** | [azure-ai-search-python](.github/skills/azure-ai-search-python/), [azure-ai-voicelive](.github/skills/azure-ai-voicelive/) |
| **Backend** | [fastapi-router](.github/skills/fastapi-router/), [pydantic-models](.github/skills/pydantic-models/), [cosmos-db-python-skill](.github/skills/cosmos-db-python-skill/) |
| **Infrastructure** | [azd-deployment](.github/skills/azd-deployment/), [azure-resourcemanager-mysql-dotnet](.github/skills/azure-resourcemanager-mysql-dotnet/), [azure-resourcemanager-postgresql-dotnet](.github/skills/azure-resourcemanager-postgresql-dotnet/) |
| **Tooling** | [skill-creator](.github/skills/skill-creator/), [mcp-builder](.github/skills/mcp-builder/), [github-issue-creator](.github/skills/github-issue-creator/) |
| **Other** | [podcast-generation](.github/skills/podcast-generation/) |

### Extended Catalog — Copy as needed

> Location: `skills/{language}/` • 113 skills

| Language | Skills | Coverage |
|----------|--------|----------|
| [**Python**](CATALOG.md#python) | 33 | AI, Data, Messaging, Monitoring, Identity, Security, Integration |
| [**.NET**](CATALOG.md#net) | 29 | Foundry, AI, Data, Messaging, Identity, Security, Partner |
| [**TypeScript**](CATALOG.md#typescript) | 23 | Foundry, AI, Data, Messaging, Frontend, Identity |
| [**Java**](CATALOG.md#java) | 28 | Foundry, AI, Data, Messaging, Communication, Identity |

📖 **[Full skill catalog →](CATALOG.md)**

---

## Repository Structure

```
.github/
├── skills/              # Core skills (auto-discovered)
├── prompts/             # Reusable prompt templates
├── agents/              # Agent persona definitions
└── copilot-instructions.md

skills/                  # Extended catalog (copy what you need)
├── python/              # 33 skills
├── dotnet/              # 29 skills
├── typescript/          # 23 skills
└── java/                # 28 skills

.vscode/
└── mcp.json             # MCP server configurations
```

---

## MCP Servers

Pre-configured in `.vscode/mcp.json`:

| Category | Servers |
|----------|---------|
| **Documentation** | `microsoft-docs`, `context7`, `deepwiki` |
| **Development** | `github`, `playwright`, `terraform`, `eslint` |
| **Utilities** | `sequentialthinking`, `memory`, `markitdown` |

---

## Additional Resources

- **Prompts** — Reusable templates (`.prompt.md`) for code reviews, component creation
- **Agents** — Persona definitions (`.agent.md`) for backend, frontend, planner roles
- **[Context7](https://context7.com/microsoft/agent-skills)** — Indexed Foundry docs (weekly sync)

---

## Contributing

- Add new skills for Azure SDKs
- Improve existing prompts and agents
- Share MCP server configurations

---

## License

MIT
