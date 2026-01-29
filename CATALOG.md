# Skill Catalog

Extended skills organized by language. Copy to your project's `.github/skills/` as needed.

```bash
cp -r skills/python/messaging/servicebus /path/to/your-project/.github/skills/
```

---

## Python

> 33 skills in `skills/python/`

### Foundry

| Skill | Package | Description |
|-------|---------|-------------|
| [contentsafety](skills/python/foundry/contentsafety/) | `azure-ai-contentsafety` | Content moderation and safety |
| [contentunderstanding](skills/python/foundry/contentunderstanding/) | `azure-ai-contentunderstanding` | Document and media understanding |
| [evaluation](skills/python/foundry/evaluation/) | `azure-ai-evaluation` | AI model evaluation and metrics |

### AI

| Skill | Package | Description |
|-------|---------|-------------|
| [inference](skills/python/ai/inference/) | `azure-ai-inference` | Azure AI Model Inference for chat, embeddings |
| [ml](skills/python/ai/ml/) | `azure-ai-ml` | Azure Machine Learning SDK v2 |
| [textanalytics](skills/python/ai/textanalytics/) | `azure-ai-textanalytics` | Text Analytics — NER, sentiment, key phrases |
| [transcription](skills/python/ai/transcription/) | `azure-cognitiveservices-speech` | Speech-to-text transcription |
| [translation-document](skills/python/ai/translation-document/) | `azure-ai-translation-document` | Document translation (batch) |
| [translation-text](skills/python/ai/translation-text/) | `azure-ai-translation-text` | Text translation API |
| [vision-imageanalysis](skills/python/ai/vision-imageanalysis/) | `azure-ai-vision-imageanalysis` | Image analysis, captions, tags, objects |

### Data

| Skill | Package | Description |
|-------|---------|-------------|
| [blob](skills/python/data/blob/) | `azure-storage-blob` | Blob storage operations, containers, SAS tokens |
| [cosmos](skills/python/data/cosmos/) | `azure-cosmos` | Cosmos DB NoSQL API operations |
| [datalake](skills/python/data/datalake/) | `azure-storage-file-datalake` | Data Lake Storage Gen2, hierarchical namespace |
| [fileshare](skills/python/data/fileshare/) | `azure-storage-file-share` | Azure Files SMB shares |
| [queue](skills/python/data/queue/) | `azure-storage-queue` | Queue storage for async messaging |
| [tables](skills/python/data/tables/) | `azure-data-tables` | Azure Tables / Cosmos DB Table API |

### Search

| Skill | Package | Description |
|-------|---------|-------------|
| [documents](skills/python/search/documents/) | `azure-search-documents` | Azure AI Search indexing and querying |

### Messaging

| Skill | Package | Description |
|-------|---------|-------------|
| [eventgrid](skills/python/messaging/eventgrid/) | `azure-eventgrid` | Event Grid publishing and consumption |
| [eventhub](skills/python/messaging/eventhub/) | `azure-eventhub` | Event Hubs streaming data ingestion |
| [servicebus](skills/python/messaging/servicebus/) | `azure-servicebus` | Service Bus queues, topics, subscriptions |
| [webpubsub-service](skills/python/messaging/webpubsub-service/) | `azure-messaging-webpubsubservice` | Web PubSub real-time messaging (server-side) |

### Monitoring

| Skill | Package | Description |
|-------|---------|-------------|
| [ingestion](skills/python/monitoring/ingestion/) | `azure-monitor-ingestion` | Custom logs ingestion via DCR |
| [opentelemetry](skills/python/monitoring/opentelemetry/) | `azure-monitor-opentelemetry` | OpenTelemetry auto-instrumentation |
| [opentelemetry-exporter](skills/python/monitoring/opentelemetry-exporter/) | `azure-monitor-opentelemetry-exporter` | Manual OpenTelemetry export |
| [query](skills/python/monitoring/query/) | `azure-monitor-query` | Log Analytics and Metrics queries |

### Identity

| Skill | Package | Description |
|-------|---------|-------------|
| [azure-identity](skills/python/identity/azure-identity/) | `azure-identity` | DefaultAzureCredential, managed identity, service principals |

### Security

| Skill | Package | Description |
|-------|---------|-------------|
| [keyvault](skills/python/security/keyvault/) | `azure-keyvault-*` | Key Vault secrets, keys, certificates |

### Integration

| Skill | Package | Description |
|-------|---------|-------------|
| [appconfiguration](skills/python/integration/appconfiguration/) | `azure-appconfiguration` | App Configuration key-values, feature flags |
| [apicenter](skills/python/integration/apicenter/) | `azure-mgmt-apicenter` | API Center for API inventory management |
| [apimanagement](skills/python/integration/apimanagement/) | `azure-mgmt-apimanagement` | API Management services, APIs, products |

### Compute

| Skill | Package | Description |
|-------|---------|-------------|
| [botservice](skills/python/compute/botservice/) | `azure-mgmt-botservice` | Azure Bot Service management |
| [fabric](skills/python/compute/fabric/) | `azure-mgmt-fabric` | Microsoft Fabric capacity management |

### Container

| Skill | Package | Description |
|-------|---------|-------------|
| [containerregistry](skills/python/container/containerregistry/) | `azure-containerregistry` | Container Registry operations |

---

## .NET

> 29 skills in `skills/dotnet/`

### Foundry

| Skill | Package | Description |
|-------|---------|-------------|
| [agents-persistent](skills/dotnet/foundry/agents-persistent/) | `Azure.AI.Agents.Persistent` | Persistent Azure AI Foundry agents |
| [document-intelligence](skills/dotnet/foundry/document-intelligence/) | `Azure.AI.DocumentIntelligence` | Document analysis, extraction, custom models |
| [projects](skills/dotnet/foundry/projects/) | `Azure.AI.Projects` | Azure AI Projects SDK for Foundry |
| [voicelive](skills/dotnet/foundry/voicelive/) | `Azure.AI.VoiceLive` | Real-time voice AI |

### AI

| Skill | Package | Description |
|-------|---------|-------------|
| [inference](skills/dotnet/ai/inference/) | `Azure.AI.Inference` | Azure AI Model Inference for chat, embeddings |
| [openai](skills/dotnet/ai/openai/) | `Azure.AI.OpenAI` | Azure OpenAI SDK for GPT, DALL-E, embeddings |
| [weightsandbiases](skills/dotnet/ai/weightsandbiases/) | `Azure.ResourceManager.WeightsAndBiases` | ML experiment tracking via Azure |

### Data

| Skill | Package | Description |
|-------|---------|-------------|
| [cosmosdb](skills/dotnet/data/cosmosdb/) | `Azure.ResourceManager.CosmosDB` | Cosmos DB account, database, container management |
| [fabric](skills/dotnet/data/fabric/) | `Azure.ResourceManager.Fabric` | Microsoft Fabric capacity management |
| [mysql](skills/dotnet/data/mysql/) | `Azure.ResourceManager.MySql` | Azure Database for MySQL Flexible Server |
| [postgresql](skills/dotnet/data/postgresql/) | `Azure.ResourceManager.PostgreSql` | Azure Database for PostgreSQL Flexible Server |
| [redis](skills/dotnet/data/redis/) | `Azure.ResourceManager.Redis` | Azure Cache for Redis management |
| [sql](skills/dotnet/data/sql/) | `Azure.ResourceManager.Sql` | Azure SQL Database, servers, elastic pools |

### Search

| Skill | Package | Description |
|-------|---------|-------------|
| [documents](skills/dotnet/search/documents/) | `Azure.Search.Documents` | Azure AI Search — vector, hybrid, semantic search |

### Messaging

| Skill | Package | Description |
|-------|---------|-------------|
| [eventgrid](skills/dotnet/messaging/eventgrid/) | `Azure.Messaging.EventGrid` | Event Grid for event-driven architectures |
| [eventhubs](skills/dotnet/messaging/eventhubs/) | `Azure.Messaging.EventHubs` | Event Hubs for streaming data ingestion |
| [servicebus](skills/dotnet/messaging/servicebus/) | `Azure.Messaging.ServiceBus` | Service Bus for enterprise messaging |

### Monitoring

| Skill | Package | Description |
|-------|---------|-------------|
| [applicationinsights](skills/dotnet/monitoring/applicationinsights/) | `Azure.ResourceManager.ApplicationInsights` | Application Insights telemetry and diagnostics |

### Identity

| Skill | Package | Description |
|-------|---------|-------------|
| [azure-identity](skills/dotnet/identity/azure-identity/) | `Azure.Identity` | DefaultAzureCredential, managed identity |
| [authentication-events](skills/dotnet/identity/authentication-events/) | `Microsoft.Azure.WebJobs.Extensions.AuthenticationEvents` | Entra ID authentication event handlers |

### Security

| Skill | Package | Description |
|-------|---------|-------------|
| [keyvault](skills/dotnet/security/keyvault/) | `Azure.Security.KeyVault.Keys` | Key Vault for keys, secrets, certificates |

### Integration

| Skill | Package | Description |
|-------|---------|-------------|
| [apicenter](skills/dotnet/integration/apicenter/) | `Azure.ResourceManager.ApiCenter` | Azure API Center for API inventory |
| [apimanagement](skills/dotnet/integration/apimanagement/) | `Azure.ResourceManager.ApiManagement` | Azure API Management services |

### Location

| Skill | Package | Description |
|-------|---------|-------------|
| [maps](skills/dotnet/location/maps/) | `Azure.Maps.*` | Azure Maps geocoding, routing, search |

### Compute

| Skill | Package | Description |
|-------|---------|-------------|
| [botservice](skills/dotnet/compute/botservice/) | `Azure.ResourceManager.BotService` | Azure Bot Service management |
| [durabletask](skills/dotnet/compute/durabletask/) | `Azure.ResourceManager.DurableTask` | Durable Task Scheduler for orchestrations |
| [playwright](skills/dotnet/compute/playwright/) | `Microsoft.Playwright.Testing` | Azure Playwright Testing for browser automation |

### Partner

| Skill | Package | Description |
|-------|---------|-------------|
| [arize-ai-observability-eval](skills/dotnet/partner/arize-ai-observability-eval/) | `Azure.ResourceManager.Arize` | Arize AI observability & evaluation |
| [mongodbatlas](skills/dotnet/partner/mongodbatlas/) | `Azure.ResourceManager.MongoCluster` | MongoDB Atlas via Azure Marketplace |

---

## TypeScript

> 23 skills in `skills/typescript/`

### Foundry

| Skill | Package | Description |
|-------|---------|-------------|
| [agents](skills/typescript/foundry/agents/) | `@azure/ai-agents` | Azure AI Agents — CRUD, threads, streaming, tools |
| [projects](skills/typescript/foundry/projects/) | `@azure/ai-projects` | Azure AI Projects SDK for Foundry |
| [contentsafety](skills/typescript/foundry/contentsafety/) | `@azure-rest/ai-content-safety` | Content moderation and safety |
| [document-intelligence](skills/typescript/foundry/document-intelligence/) | `@azure-rest/ai-document-intelligence` | Document analysis, extraction |
| [voicelive](skills/typescript/foundry/voicelive/) | `@azure/ai-voicelive` | Real-time voice AI with WebSocket |
| [nextgen-frontend](skills/typescript/foundry/nextgen-frontend/) | — | NextGen Design System UI patterns |

### AI

| Skill | Package | Description |
|-------|---------|-------------|
| [inference](skills/typescript/ai/inference/) | `@azure-rest/ai-inference` | Azure AI Model Inference for chat, embeddings |
| [translation](skills/typescript/ai/translation/) | `@azure-rest/ai-translation-text` | Text and document translation |

### Data

| Skill | Package | Description |
|-------|---------|-------------|
| [cosmosdb](skills/typescript/data/cosmosdb/) | `@azure/cosmos` | Cosmos DB NoSQL — CRUD, queries, bulk ops |
| [blob](skills/typescript/data/blob/) | `@azure/storage-blob` | Blob storage — upload, download, containers |
| [queue](skills/typescript/data/queue/) | `@azure/storage-queue` | Queue storage for async messaging |
| [fileshare](skills/typescript/data/fileshare/) | `@azure/storage-file-share` | Azure Files SMB shares |

### Search

| Skill | Package | Description |
|-------|---------|-------------|
| [documents](skills/typescript/search/documents/) | `@azure/search-documents` | Azure AI Search — vector, hybrid, semantic |

### Messaging

| Skill | Package | Description |
|-------|---------|-------------|
| [servicebus](skills/typescript/messaging/servicebus/) | `@azure/service-bus` | Service Bus queues, topics, subscriptions |
| [eventhubs](skills/typescript/messaging/eventhubs/) | `@azure/event-hubs` | Event Hubs streaming data ingestion |
| [webpubsub](skills/typescript/messaging/webpubsub/) | `@azure/web-pubsub` | Web PubSub real-time messaging |

### Monitoring

| Skill | Package | Description |
|-------|---------|-------------|
| [opentelemetry](skills/typescript/monitoring/opentelemetry/) | `@azure/monitor-opentelemetry` | OpenTelemetry auto-instrumentation |

### Identity

| Skill | Package | Description |
|-------|---------|-------------|
| [azure-identity](skills/typescript/identity/azure-identity/) | `@azure/identity` | DefaultAzureCredential, managed identity |

### Security

| Skill | Package | Description |
|-------|---------|-------------|
| [keyvault](skills/typescript/security/keyvault/) | `@azure/keyvault-keys` | Key Vault for keys, secrets, certificates |

### Integration

| Skill | Package | Description |
|-------|---------|-------------|
| [appconfiguration](skills/typescript/integration/appconfiguration/) | `@azure/app-configuration` | App Configuration key-values, feature flags |

### Compute

| Skill | Package | Description |
|-------|---------|-------------|
| [playwright](skills/typescript/compute/playwright/) | `@azure/microsoft-playwright-testing` | Azure Playwright Testing |

### Frontend

| Skill | Description |
|-------|-------------|
| [zustand-store](skills/typescript/frontend/zustand-store/) | Zustand stores with TypeScript and subscribeWithSelector |
| [react-flow-node](skills/typescript/frontend/react-flow-node/) | React Flow custom nodes with TypeScript |

---

## Java

> 28 skills in `skills/java/`

### Foundry

| Skill | Package | Description |
|-------|---------|-------------|
| [agents](skills/java/foundry/agents/) | `azure-ai-agents` | Azure AI Agents — CRUD, threads, streaming, tools |
| [agents-persistent](skills/java/foundry/agents-persistent/) | `azure-ai-agents-persistent` | Persistent Azure AI Foundry agents |
| [inference](skills/java/foundry/inference/) | `azure-ai-inference` | Azure AI Model Inference for chat, embeddings |
| [projects](skills/java/foundry/projects/) | `azure-ai-projects` | Azure AI Projects SDK for Foundry |
| [voicelive](skills/java/foundry/voicelive/) | `azure-ai-voicelive` | Real-time voice AI with WebSocket |

### AI

| Skill | Package | Description |
|-------|---------|-------------|
| [anomalydetector](skills/java/ai/anomalydetector/) | `azure-ai-anomalydetector` | Anomaly detection for time-series data |
| [contentsafety](skills/java/ai/contentsafety/) | `azure-ai-contentsafety` | Content moderation and safety |
| [formrecognizer](skills/java/ai/formrecognizer/) | `azure-ai-formrecognizer` | Document analysis and extraction |
| [vision-imageanalysis](skills/java/ai/vision-imageanalysis/) | `azure-ai-vision-imageanalysis` | Image analysis, captions, tags, objects |

### Data

| Skill | Package | Description |
|-------|---------|-------------|
| [blob](skills/java/data/blob/) | `azure-storage-blob` | Blob storage operations, containers |
| [cosmos](skills/java/data/cosmos/) | `azure-cosmos` | Cosmos DB NoSQL API |
| [tables](skills/java/data/tables/) | `azure-data-tables` | Azure Tables / Cosmos DB Table API |

### Messaging

| Skill | Package | Description |
|-------|---------|-------------|
| [eventgrid](skills/java/messaging/eventgrid/) | `azure-messaging-eventgrid` | Event Grid publishing and consumption |
| [eventhubs](skills/java/messaging/eventhubs/) | `azure-messaging-eventhubs` | Event Hubs streaming data ingestion |
| [webpubsub](skills/java/messaging/webpubsub/) | `azure-messaging-webpubsub` | Web PubSub real-time messaging |

### Communication

| Skill | Package | Description |
|-------|---------|-------------|
| [callautomation](skills/java/communication/callautomation/) | `azure-communication-callautomation` | Call Automation for voice/video |
| [callingserver](skills/java/communication/callingserver/) | `azure-communication-callingserver` | Calling Server (deprecated) |
| [chat](skills/java/communication/chat/) | `azure-communication-chat` | Chat threads, messages, participants |
| [common](skills/java/communication/common/) | `azure-communication-common` | Communication identity and tokens |
| [sms](skills/java/communication/sms/) | `azure-communication-sms` | SMS messaging |

### Monitoring

| Skill | Package | Description |
|-------|---------|-------------|
| [ingestion](skills/java/monitoring/ingestion/) | `azure-monitor-ingestion` | Custom logs ingestion via DCR |
| [opentelemetry-exporter](skills/java/monitoring/opentelemetry-exporter/) | `azure-monitor-opentelemetry-exporter` | OpenTelemetry export (deprecated) |
| [query](skills/java/monitoring/query/) | `azure-monitor-query` | Log Analytics and Metrics queries |

### Identity

| Skill | Package | Description |
|-------|---------|-------------|
| [azure-identity](skills/java/identity/azure-identity/) | `azure-identity` | DefaultAzureCredential, managed identity |

### Security

| Skill | Package | Description |
|-------|---------|-------------|
| [keyvault-keys](skills/java/security/keyvault-keys/) | `azure-security-keyvault-keys` | Key Vault cryptographic keys |
| [keyvault-secrets](skills/java/security/keyvault-secrets/) | `azure-security-keyvault-secrets` | Key Vault secrets management |

### Integration

| Skill | Package | Description |
|-------|---------|-------------|
| [appconfiguration](skills/java/integration/appconfiguration/) | `azure-data-appconfiguration` | App Configuration key-values, feature flags |

### Compute

| Skill | Package | Description |
|-------|---------|-------------|
| [batch](skills/java/compute/batch/) | `azure-compute-batch` | Azure Batch for HPC and parallel jobs |

---

## Using Symlinks

Share skills across projects without duplicating files:

**macOS / Linux:**
```bash
ln -s /path/to/agent-skills/skills/python/messaging/servicebus \
      /path/to/your-project/.github/skills/servicebus
```

**Windows (PowerShell as Admin):**
```powershell
New-Item -ItemType SymbolicLink `
  -Path "C:\project\.github\skills\servicebus" `
  -Target "C:\agent-skills\skills\python\messaging\servicebus"
```
