"""Basic Azure AI Agent example with authentication, thread management, and cleanup."""

import os
from azure.identity import DefaultAzureCredential
from azure.ai.agents import AgentsClient


def main():
    # Authentication
    credential = DefaultAzureCredential()
    client = AgentsClient(
        endpoint=os.environ["PROJECT_ENDPOINT"],
        credential=credential,
    )

    agent = None
    try:
        # 1. Create agent
        agent = client.create_agent(
            model=os.environ["MODEL_DEPLOYMENT_NAME"],
            name="basic-assistant",
            instructions="You are a helpful assistant.",
        )
        print(f"Created agent: {agent.id}")

        # 2. Create thread
        thread = client.threads.create()
        print(f"Created thread: {thread.id}")

        # 3. Add user message
        client.messages.create(
            thread_id=thread.id,
            role="user",
            content="Hello! What can you help me with?",
        )

        # 4. Create and process run
        run = client.runs.create_and_process(
            thread_id=thread.id,
            agent_id=agent.id,
        )
        print(f"Run status: {run.status}")

        # 5. Get response
        if run.status == "completed":
            messages = client.messages.list(thread_id=thread.id)
            for msg in messages:
                if msg.role == "assistant":
                    print(f"Assistant: {msg.content[0].text.value}")
        elif run.status == "failed":
            print(f"Run failed: {run.last_error}")

    finally:
        # Cleanup
        if agent:
            client.delete_agent(agent.id)
            print(f"Deleted agent: {agent.id}")


if __name__ == "__main__":
    main()
