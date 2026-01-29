# @azure/ai-agents - Streaming Response Patterns

Reference documentation for streaming responses in the Azure AI Agents TypeScript SDK.

**Source**: [Azure SDK for JS - ai-agents](https://github.com/Azure/azure-sdk-for-js/blob/3d73b62136d4f89a74a325329bb838280f37f0d0/sdk/ai/ai-agents)

---

## Installation

```bash
npm install @azure/ai-agents @azure/identity
```

---

## Core Streaming Types

```typescript
import {
  AgentsClient,
  // Stream event enums
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  // Data types
  ThreadRun,
  MessageDeltaChunk,
  MessageDeltaTextContent,
  RunStepDeltaChunk,
  AgentThread,
  ThreadMessage,
  RunStep,
} from "@azure/ai-agents";
```

---

## Basic Streaming Example

```typescript
import {
  AgentsClient,
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  type ThreadRun,
  type MessageDeltaChunk,
  type MessageDeltaTextContent,
} from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";

const client = new AgentsClient(
  process.env["PROJECT_ENDPOINT"]!,
  new DefaultAzureCredential()
);

// Create agent and thread
const agent = await client.createAgent("gpt-4o", {
  name: "streaming-agent",
  instructions: "You are a helpful assistant.",
});
const thread = await client.threads.create();
await client.messages.create(thread.id, "user", "Tell me a joke");

// Start streaming run
const stream = await client.runs.create(thread.id, agent.id).stream();

// Process stream events
for await (const event of stream) {
  switch (event.event) {
    case RunStreamEvent.ThreadRunCreated:
      console.log(`Run started: ${(event.data as ThreadRun).status}`);
      break;

    case MessageStreamEvent.ThreadMessageDelta:
      const delta = event.data as MessageDeltaChunk;
      delta.delta.content?.forEach((part) => {
        if (part.type === "text") {
          const text = (part as MessageDeltaTextContent).text?.value || "";
          process.stdout.write(text);
        }
      });
      break;

    case RunStreamEvent.ThreadRunCompleted:
      console.log("\nRun completed");
      break;

    case ErrorEvent.Error:
      console.error("Error:", event.data);
      break;

    case DoneEvent.Done:
      console.log("Stream finished");
      break;
  }
}
```

---

## Stream Event Types

### Run Events (`RunStreamEvent`)

| Event | Description | Data Type |
|-------|-------------|-----------|
| `ThreadRunCreated` | Run was created | `ThreadRun` |
| `ThreadRunQueued` | Run is queued | `ThreadRun` |
| `ThreadRunInProgress` | Run started processing | `ThreadRun` |
| `ThreadRunRequiresAction` | Run needs tool outputs | `ThreadRun` |
| `ThreadRunCompleted` | Run finished successfully | `ThreadRun` |
| `ThreadRunIncomplete` | Run ended incomplete | `ThreadRun` |
| `ThreadRunFailed` | Run failed | `ThreadRun` |
| `ThreadRunCancelling` | Run is being cancelled | `ThreadRun` |
| `ThreadRunCancelled` | Run was cancelled | `ThreadRun` |
| `ThreadRunExpired` | Run expired | `ThreadRun` |

### Message Events (`MessageStreamEvent`)

| Event | Description | Data Type |
|-------|-------------|-----------|
| `ThreadMessageCreated` | Message was created | `ThreadMessage` |
| `ThreadMessageInProgress` | Message is being generated | `ThreadMessage` |
| `ThreadMessageDelta` | Message content chunk | `MessageDeltaChunk` |
| `ThreadMessageCompleted` | Message finished | `ThreadMessage` |
| `ThreadMessageIncomplete` | Message ended incomplete | `ThreadMessage` |

### Other Events

| Event | Description | Data Type |
|-------|-------------|-----------|
| `ErrorEvent.Error` | An error occurred | `string` |
| `DoneEvent.Done` | Stream completed | `string` |

---

## Processing Delta Events

```typescript
import {
  MessageDeltaChunk,
  MessageDeltaTextContent,
  MessageDeltaImageFileContent,
} from "@azure/ai-agents";

for await (const event of stream) {
  if (event.event === MessageStreamEvent.ThreadMessageDelta) {
    const delta = event.data as MessageDeltaChunk;

    // Access message metadata
    console.log(`Message ID: ${delta.id}`);

    // Process content parts
    delta.delta.content?.forEach((part) => {
      switch (part.type) {
        case "text":
          const textPart = part as MessageDeltaTextContent;
          const text = textPart.text?.value || "";
          // Handle text annotations (citations, file paths)
          textPart.text?.annotations?.forEach((annotation) => {
            console.log(`Annotation: ${annotation.type}`);
          });
          process.stdout.write(text);
          break;

        case "image_file":
          const imagePart = part as MessageDeltaImageFileContent;
          console.log(`Image file: ${imagePart.imageFile?.fileId}`);
          break;
      }
    });
  }
}
```

---

## Streaming with Tools

### Code Interpreter with Streaming

```typescript
import {
  AgentsClient,
  ToolUtility,
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  type ThreadRun,
  type MessageDeltaChunk,
  type MessageDeltaTextContent,
} from "@azure/ai-agents";
import fs from "node:fs";

// Upload file and create tool
const fileStream = fs.createReadStream("./data/quarterly_results.csv");
const file = await client.files.upload(fileStream, "assistants", {
  fileName: "quarterly_results.csv",
});
const codeInterpreterTool = ToolUtility.createCodeInterpreterTool([file.id]);

// Create agent with code interpreter
const agent = await client.createAgent("gpt-4o", {
  name: "data-analyst",
  instructions: "You are a data analyst.",
  tools: [codeInterpreterTool.definition],
  toolResources: codeInterpreterTool.resources,
});

const thread = await client.threads.create();
await client.messages.create(
  thread.id,
  "user",
  "Create a bar chart from the CSV file."
);

// Stream the response
const stream = await client.runs.create(thread.id, agent.id).stream();

for await (const event of stream) {
  switch (event.event) {
    case RunStreamEvent.ThreadRunCreated:
      console.log(`Run status: ${(event.data as ThreadRun).status}`);
      break;

    case MessageStreamEvent.ThreadMessageDelta:
      const delta = event.data as MessageDeltaChunk;
      delta.delta.content?.forEach((part) => {
        if (part.type === "text") {
          const text = (part as MessageDeltaTextContent).text?.value || "";
          process.stdout.write(text);
        }
      });
      break;

    case RunStreamEvent.ThreadRunCompleted:
      console.log("\nRun completed");
      break;

    case ErrorEvent.Error:
      console.log(`Error: ${event.data}`);
      break;

    case DoneEvent.Done:
      console.log("Stream completed.");
      break;
  }
}
```

### Bing Grounding with Streaming

```typescript
import {
  AgentsClient,
  ToolUtility,
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  type ThreadRun,
  type MessageDeltaChunk,
  type MessageDeltaTextContent,
} from "@azure/ai-agents";

const connectionId = process.env["AZURE_BING_CONNECTION_ID"]!;
const bingTool = ToolUtility.createBingGroundingTool([{ connectionId }]);

const agent = await client.createAgent("gpt-4o", {
  name: "search-agent",
  instructions: "You are a helpful agent that searches the web.",
  tools: [bingTool.definition],
});

const thread = await client.threads.create();
await client.messages.create(
  thread.id,
  "user",
  "How does Wikipedia explain Euler's Identity?"
);

const stream = await client.runs.create(thread.id, agent.id).stream();

for await (const event of stream) {
  switch (event.event) {
    case RunStreamEvent.ThreadRunCreated:
      console.log(`Run status: ${(event.data as ThreadRun).status}`);
      break;

    case MessageStreamEvent.ThreadMessageDelta:
      const delta = event.data as MessageDeltaChunk;
      delta.delta.content?.forEach((part) => {
        if (part.type === "text") {
          const text = (part as MessageDeltaTextContent).text?.value || "";
          process.stdout.write(text);
        }
      });
      break;

    case RunStreamEvent.ThreadRunCompleted:
      console.log("\nRun completed");
      break;

    case ErrorEvent.Error:
      console.log(`Error: ${event.data}`);
      break;

    case DoneEvent.Done:
      console.log("Stream completed.");
      break;
  }
}
```

---

## Error Handling in Streams

```typescript
import { RestError } from "@azure/core-rest-pipeline";

try {
  const stream = await client.runs.create(thread.id, agent.id).stream();

  for await (const event of stream) {
    switch (event.event) {
      case ErrorEvent.Error:
        // Handle stream-level errors
        console.error("Stream error:", event.data);
        break;

      case RunStreamEvent.ThreadRunFailed:
        // Handle run failures
        const failedRun = event.data as ThreadRun;
        console.error("Run failed:", failedRun.lastError);
        break;

      case RunStreamEvent.ThreadRunExpired:
        // Handle expired runs
        console.error("Run expired");
        break;

      // ... handle other events
    }
  }
} catch (error) {
  if (error instanceof RestError) {
    console.error(`HTTP Error ${error.code}: ${error.message}`);
  } else {
    throw error;
  }
}
```

---

## Complete Streaming Example

```typescript
import {
  AgentsClient,
  RunStreamEvent,
  MessageStreamEvent,
  ErrorEvent,
  DoneEvent,
  type ThreadRun,
  type MessageDeltaChunk,
  type MessageDeltaTextContent,
  type ThreadMessage,
} from "@azure/ai-agents";
import { DefaultAzureCredential } from "@azure/identity";

async function streamingChat() {
  const client = new AgentsClient(
    process.env["PROJECT_ENDPOINT"]!,
    new DefaultAzureCredential()
  );

  // Create agent
  const agent = await client.createAgent("gpt-4o", {
    name: "chat-assistant",
    instructions: "You are a helpful assistant.",
  });

  // Create thread and message
  const thread = await client.threads.create();
  await client.messages.create(thread.id, "user", "Tell me about TypeScript.");

  // Start streaming
  const stream = await client.runs.create(thread.id, agent.id).stream();
  let fullResponse = "";

  for await (const event of stream) {
    switch (event.event) {
      // Run lifecycle events
      case RunStreamEvent.ThreadRunCreated:
        console.log("🚀 Run started");
        break;

      case RunStreamEvent.ThreadRunInProgress:
        console.log("⏳ Processing...");
        break;

      case RunStreamEvent.ThreadRunCompleted:
        console.log("\n✅ Run completed");
        break;

      case RunStreamEvent.ThreadRunFailed:
        const failedRun = event.data as ThreadRun;
        console.error("❌ Run failed:", failedRun.lastError);
        break;

      // Message events
      case MessageStreamEvent.ThreadMessageCreated:
        console.log("📝 Message started");
        break;

      case MessageStreamEvent.ThreadMessageDelta:
        const delta = event.data as MessageDeltaChunk;
        delta.delta.content?.forEach((part) => {
          if (part.type === "text") {
            const text = (part as MessageDeltaTextContent).text?.value || "";
            fullResponse += text;
            process.stdout.write(text);
          }
        });
        break;

      case MessageStreamEvent.ThreadMessageCompleted:
        const message = event.data as ThreadMessage;
        console.log(`\n📄 Message completed (ID: ${message.id})`);
        break;

      // Error and completion
      case ErrorEvent.Error:
        console.error("❌ Error:", event.data);
        break;

      case DoneEvent.Done:
        console.log("🏁 Stream finished");
        break;
    }
  }

  // Cleanup
  await client.deleteAgent(agent.id);

  return fullResponse;
}

// Run the example
streamingChat()
  .then((response) => console.log("\nFull response length:", response.length))
  .catch(console.error);
```

---

## AgentEventMessage Interface

The stream yields `AgentEventMessage` objects:

```typescript
interface AgentEventMessage {
  /** Event type (RunStreamEvent, MessageStreamEvent, etc.) */
  event: AgentStreamEvent | string;

  /** Event data - type depends on event */
  data: AgentEventStreamData;
}

type AgentEventStreamData =
  | AgentThread      // Thread events
  | ThreadRun        // Run events
  | RunStep          // Run step events
  | ThreadMessage    // Message events
  | MessageDeltaChunk    // Message delta events
  | RunStepDeltaChunk    // Run step delta events
  | string;              // Error/Done events
```

---

## Non-Streaming Alternative

For simpler use cases, use polling instead of streaming:

```typescript
// Create and poll until completion
const run = await client.runs.createAndPoll(thread.id, agent.id, {
  pollingOptions: {
    intervalInMs: 2000,
  },
  onResponse: (response) => {
    console.log(`Status: ${response.parsedBody.status}`);
  },
});

// Get final messages
const messages = client.messages.list(thread.id);
for await (const message of messages) {
  console.log(`${message.role}: ${message.content}`);
}
```
