---
layout: ../../layouts/DocsLayout.astro
title: Runs & threads
description: Understand runs, the event stream, and multi-turn threads.
---

Two concepts shape how you work in Pumkin: **runs** and **threads**. Once they click, the whole app makes sense.

## A run

A **run** is one complete execution of an agent on a task. You give the agent something to do, it works, and the run captures everything that happened — start to finish.

A run streams as a sequence of events, so you watch it unfold live:

- **`run_started`** — the agent picked up the task.
- **`model_response`** — the model produced output. If it decided to use tools, this event lists the tool calls it wants.
- **`tool_call`** — the agent is invoking a specific tool with specific arguments.
- **`tool_result`** — what the tool returned, fed back to the model.
- **`done`** — the run finished.

Because every step is recorded in order, a run is an **audit trail**. You can see not just what the agent concluded, but how — which tools it reached for, what they returned, and how that changed its answer. That's the point of Pumkin: nothing the agent does is hidden.

## A thread

A single run is one task. A **thread** is a conversation — multiple turns where the agent remembers what came before. Ask a follow-up and the agent has the context of everything earlier in the thread, so you can refine, drill in, or build on previous answers without re-explaining.

Use a new thread when you start something unrelated. Stay in a thread when you're iterating on the same problem.

## Everything is saved locally

Runs and threads are stored in Pumkin's local database under `%LOCALAPPDATA%\Pumkin\`. They don't expire and they never leave your machine. Come back days later and your history is intact — useful for picking up where you left off, and for going back to see exactly what an agent did on some earlier task.

## Reading a run for debugging

When an agent does something surprising, the run tells you why. Walk the events in order:

- Did it call the tool you expected? Check the `tool_call` event and its arguments.
- Did the tool return what you expected? Check the `tool_result`.
- Did the model misread the result? Compare the `tool_result` to the `model_response` that followed.

Most "the agent did the wrong thing" moments come down to a vague system prompt or a tool returning something unexpected — and the run makes both visible.

Stuck on something? See [Troubleshooting →](/docs/troubleshooting/)
