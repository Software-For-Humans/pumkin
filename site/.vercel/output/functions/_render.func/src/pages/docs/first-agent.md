---
layout: ../../layouts/DocsLayout.astro
title: Your first agent
description: Create an agent, give it a system prompt, pick a model, and run a task.
---

An **agent** in Pumkin is a saved setup: a model, a system prompt that defines its behavior, and any tools you've given it. Once saved, you can run it over and over with different tasks. Let's make one.

## 1. Create an agent

From the main screen, create a new agent. You'll give it:

- **A name** — anything. "Scratch", "Research helper", whatever you'll recognize.
- **A model** — pick from the models you've pulled into Ollama. If you followed the setup, `llama3.2:3b` is here. This dropdown is also how you swap models later to compare them.
- **A system prompt** — the standing instructions that shape how the agent behaves on every run.

## 2. Write a system prompt

The system prompt is where you set the agent's job and personality. Keep it concrete. A good starter:

```
You are a concise, careful assistant. When a task needs
current information or an action, use the available tools
rather than guessing. Explain what you did in plain language.
```

You don't need tools configured yet to run an agent — without them it just reasons and answers. Tools are what let it *act*, and they're covered next in [MCP tools](/docs/mcp-tools/).

## 3. Run a task

With the agent saved, give it a task and run it. Try something simple first:

```
Summarize what you can and can't do right now.
```

Pumkin streams the agent's work back as a **run** — you'll see it think, respond, and (once you've added tools) call them. The whole exchange is saved so you can come back to it.

## 4. Read the run

A run shows each step the agent took, in order. Even on a plain question you'll see the model's response stream in. Once tools are involved, you'll see tool calls and their results inline — this is the part that makes Pumkin an *auditing* tool, not just a chat box. You can see exactly what the agent did.

Here's what a run looks like with a tool call (this is real output — `llama3.2:3b` using the built-in `get_time` tool):

```
$ ask "What time is it?"
[run_started]
[model_response] · tool_calls: get_time
[tool_call]   get_time({})
[tool_result] 2026-05-29T11:48:02.553Z
[model_response]
  "The current time is 11:48 AM UTC on May 29, 2026."
[done]
```

## 5. Keep going

That's the core loop: configure an agent, give it a task, watch the run, refine the prompt. From here:

- [Add MCP tools](/docs/mcp-tools/) so the agent can do real work — call scripts, hit APIs, read data.
- [Understand runs & threads](/docs/runs-and-threads/) to have multi-turn conversations and follow an agent's reasoning in depth.

Next: [MCP tools →](/docs/mcp-tools/)
