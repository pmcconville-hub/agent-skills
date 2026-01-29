# Agent Skills

Skills, prompts, and MCP configurations for AI coding agents working with Azure SDKs and Microsoft AI Foundry.

> **Blog post:** [Context-Driven Development: Agent Skills for Microsoft Foundry and Azure](https://devblogs.microsoft.com/all-things-azure/context-driven-development-agent-skills-for-microsoft-foundry-and-azure/)

![Context-Driven Development Architecture](https://raw.githubusercontent.com/microsoft/agent-skills/main/.github/assets/agent-skills-image.png)

---

Coding agents like [Copilot CLI](https://github.com/features/copilot/cli) are powerful, but they lack domain knowledge about your SDKs. The patterns are already in their weights from pretraining. All you need is the right activation context to surface them.

This repo provides that context: 127 skills for Azure and Microsoft Foundry development.

> [!IMPORTANT]
> **Use skills selectively.** Loading all skills causes context rot: diluted attention, wasted tokens, conflated patterns. Only copy skills essential for your current project.

---

## Quick Start

```bash
npx skills add microsoft/agent-skills
```

Select the skills you need from the wizard. Skills are installed to `.github/skills/` and auto-discovered by VS Code Copilot.

<details>
<summary>Manual installation</summary>

```bash
# Clone and copy specific skills
git clone https://github.com/microsoft/agent-skills.git
cp -r agent-skills/.github/skills/cosmos-db-python-skill your-project/.github/skills/

# Or use symlinks for multi-project setups
ln -s /path/to/agent-skills/.github/skills/mcp-builder /path/to/your-project/.github/skills/mcp-builder

# Share skills across different agent configs in the same repo
ln -s ../.github/skills .opencode/skills
ln -s ../.github/skills .claude/skills
```

</details>

---

## Skill Catalog

### Core Skills (Auto-discovered)

> Location: `.github/skills/` • 16 skills

| Category | Skills |
|----------|--------|
| **AI Foundry** | [foundry-sdk-python](.github/skills/foundry-sdk-python/), [foundry-iq-python](.github/skills/foundry-iq-python/), [azure-ai-agents-python](.github/skills/azure-ai-agents-python/), [agent-framework-azure-hosted-agents](.github/skills/agent-framework-azure-hosted-agents/) |
| **AI Services** | [azure-ai-search-python](.github/skills/azure-ai-search-python/), [azure-ai-voicelive](.github/skills/azure-ai-voicelive/) |
| **Backend** | [fastapi-router](.github/skills/fastapi-router/), [pydantic-models](.github/skills/pydantic-models/), [cosmos-db-python-skill](.github/skills/cosmos-db-python-skill/) |
| **Infrastructure** | [azd-deployment](.github/skills/azd-deployment/), [azure-resourcemanager-mysql-dotnet](.github/skills/azure-resourcemanager-mysql-dotnet/), [azure-resourcemanager-postgresql-dotnet](.github/skills/azure-resourcemanager-postgresql-dotnet/) |
| **Tooling** | [skill-creator](.github/skills/skill-creator/), [mcp-builder](.github/skills/mcp-builder/), [github-issue-creator](.github/skills/github-issue-creator/) |
| **Other** | [podcast-generation](.github/skills/podcast-generation/) |

### Extended Catalog (Copy as needed)

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

- **Prompts**: Reusable templates (`.prompt.md`) for code reviews, component creation
- **Agents**: Persona definitions (`.agent.md`) for backend, frontend, planner roles
- **[Context7](https://context7.com/microsoft/agent-skills)**: Indexed Foundry docs (weekly sync)

---

## Contributing

- Add new skills for Azure SDKs
- Improve existing prompts and agents
- Share MCP server configurations

---

## License

MIT
