---
title: "Announcing MemMachine v0.2.0: The Next Evolution of AI Memory"
date: 2025-12-09T21:30:00Z
featured_image: "featured_image.png"
tags: ["Release", "MemMachine", "AI Agent", "SDK", "MCP", "Semantic Memory"]
author: "Steve Scargall"
description: "Unlock the full potential of your AI agents with MemMachine v0.2.0. Discover our complete rearchitecture, powerful new SDKs, enhanced MCP integration, and the game-changing shift to Episodic and Semantic AI Agent Memory."
aliases:
---

We are thrilled to announce the release of **MemMachine v0.2.0**, a major milestone that brings a complete redesign and rearchitecture of our memory system. This release introduces powerful new capabilities for AI Agent developers, including a shift to **Episodic and Semantic Memory**, native **MCP support**, and robust **Python SDKs**.

## Highlights

-   **Episodic and Semantic Memory**: "Profile" memory is now "Semantic" memory, reflecting its broader capabilities.
-   **New Architecture**: A reimagined ingestion and search pipeline for better performance and accuracy.
-   **Python SDKs**: Official Client and Server SDKs for seamless integration.
-   **MCP Support**: Native implementation of the Model Context Protocol.
-   **API v2**: A cleaner, more powerful REST API.

---

## From "Profile" to "Episodic and Semantic" Memory

In v0.2.0, we have renamed "Profile" memory to **Semantic Memory**. While "Profile" implied a focus on user attributes, our system has evolved to capture a much wider range of semantic information—facts, world knowledge, and complex relationships derived from interactions. This rename aligns with our vision of providing a comprehensive long-term memory store that goes beyond simple user profiling.

## A Reimagined Architecture

We've completely rewritten our core architecture to address the limitations of the previous DeclarativeMemory system. The new design focuses on simplicity, performance, and scalability.

### 1. Ingestion Pipeline
Our new ingestion process is designed to maximize context and retrieval quality:
-   **Derivative Extraction**: We extract raw sentences from message-type episodes using NLTK.
-   **Context Augmentation**: Sentences are augmented with timestamps and source information.
-   **Derivative Embedding**: These augmented sentences are embedded into vectors and stored in a vector database, pointing back to their originating episodes.
-   **2-Tier Persistence**: We now persist data in two tiers: **Episodes** (raw content) and **Derivatives** (embedded chunks linked to episodes).

### 2. Advanced Search Workflow
Search is now more intelligent and context-aware:
-   **Vector Similarity**: Queries are embedded as-is to find matches in the derivative vector database.
-   **Context Expansion**: Matched derivatives trigger a context expansion, pulling in 1 episode backward and 2 episodes forward to reconstruct the full narrative.
-   **Reranking**: Expanded contexts are reranked to ensure the most relevant information surfaces first.
-   **Smart Limits**: If the search limit is reached, we prioritize episodes closest to the vector-matched nucleus.

### Why This Matters
This new architecture solves several critical pain points:
-   **Performance**: Optimized database queries and efficient vector search.
-   **Simplicity**: Configuration is now straightforward, removing the complexity of the old DeclarativeMemory.
-   **Robustness**: The system is no longer sensitive to insertion order, making batch processing easier.
-   **First-Class Properties**: Timestamps and sources are now first-class properties, simplifying filtering and indexing.

---

## New Python SDKs

We are introducing two new Python SDKs to make building with MemMachine easier than ever.

### Client Python SDK
The new **Client SDK** (`memmachine.rest_client`) allows you to integrate MemMachine into your applications with just a few lines of code. It handles authentication, project management, and memory operations seamlessly.

```python
from memmachine import MemMachineClient

client = MemMachineClient(base_url="http://localhost:8080")
project = client.create_project(
    org_id="my_org", 
    project_id="my_agent", 
    description="Memory store for customer support agent"
)
memory = project.memory(
    user_id="user123", 
    agent_id="support_bot_01",
    session_id="session_555"
)

# Add a memory
memory.add(content="I am strictly vegetarian and I love spicy food.", role="user", metadata={"topic": "food_preference"})

# Search memory
results = memory.search("What should I suggest for dinner?")
print(results)
```

For more information, see the [Client SDK documentation](https://docs.memmachine.ai/api_reference/python/client).

### Python Server SDK
For developers who want to embed MemMachine directly or build custom server implementations, the **Server SDK** (`memmachine-server`) provides direct access to the core memory logic and storage engines.

---

## Model Context Protocol (MCP) Support

MemMachine v0.2.0 includes native support for the **Model Context Protocol (MCP)**. This means MemMachine can now be instantly used as a memory tool by any MCP-compliant agent or IDE.

We expose two core tools via MCP:
-   `add_memory`: Store important information, facts, and preferences.
-   `search_memory`: Retrieve relevant context and long-term knowledge.

This allows agents to automatically manage their own memory without custom integration code.

---

## Integrations

We are committed to making MemMachine available wherever you build your agents. We are excited to announce integrations with leading platforms:

-   **Claude Code**: Seamlessly give your Claude agents long-term memory.
-   **GPT Store**: Enhance your custom GPTs with persistent context.
-   **LangGraph**: Easily plug MemMachine into your LangGraph workflows.

And this is just the beginning—we have plans to add support for many more platforms soon!

---

## Get Started

MemMachine v0.2 delivers significant advancements in conversational memory and efficiency, establishing itself as one of the highest-scoring AI memory systems available on the LoCoMo benchmark.

**Ready to experience the benefits of MemMachine v0.2?**

- 👉 [Download and try MemMachine on GitHub](https://github.com/MemMachine/MemMachine) yourself. Get started today and see the performance firsthand.
- 📖 [Explore the comprehensive documentation](https://docs.memmachine.ai) to discover integration guides, workflows, and advanced features.
- 💬 [Join our Discord community](https://discord.gg/usydANvKqD) to connect with fellow developers, share feedback, and collaborate with teams already building innovative solutions on top of MemMachine.

Don’t miss the opportunity to join a fast-growing ecosystem of organizations and engineers leveraging MemMachine for state-of-the-art conversational AI. Your feedback and contributions are welcome!

We can't wait to see what you build with this new foundation!
