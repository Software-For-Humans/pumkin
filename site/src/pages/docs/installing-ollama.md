---
layout: ../../layouts/DocsLayout.astro
title: Install Ollama & models
description: Install Ollama, pull a model, and pick one that fits your hardware.
---

Pumkin doesn't ship a model — it uses whatever models you've pulled into **Ollama**, running locally. This keeps the app small and lets you swap models freely. You install Ollama once, pull at least one model, and you're set.

## 1. Install Ollama

Download Ollama from [ollama.com](https://ollama.com) and run the installer. On Windows it installs as a background service that starts automatically and listens on `localhost:11434` — that's the address Pumkin talks to.

You don't need to open or configure anything. Once installed, Ollama runs quietly in the background.

> **Check it's running:** open a terminal and run `ollama list`. If it responds (even with an empty list), Ollama is up. If the command isn't found, restart after install or check that the Ollama service started.

## 2. Pull a model

In a terminal, pull a model. Start with this one:

```
ollama pull llama3.2:3b
```

That downloads Llama 3.2 (3 billion parameters) — about 2 GB. It's the model Pumkin is tuned and tested against, and it runs comfortably on modest hardware while still handling tool calls well.

To confirm it landed:

```
ollama list
```

You should see `llama3.2:3b` in the list. That's all Pumkin needs.

## 3. Pick a model that fits your machine

This is the part people get wrong, so read it. Bigger models are smarter but need far more memory. If you pick one too large for your RAM, it either crawls or fails to load.

| Your RAM | Recommended | Notes |
|---|---|---|
| 8 GB | `llama3.2:3b` | The sweet spot. Fast, reliable tool calls, the tested default. |
| 16 GB | `llama3.2:3b` or an 7–8B model | You have headroom to experiment with larger models. |
| 32 GB+ | Larger models if you want | Quality goes up, speed goes down. Try and compare. |

> **8 GB is the practical floor.** On an 8 GB machine, `llama3.2:3b` is the model to use. Larger models like 7–8B (e.g. `qwen3:8b`) are effectively unusable there — they'll swap to disk and grind. If you only have 8 GB, stick with `llama3.2:3b` and you'll have a good experience.

## Which model is "best"?

For Pumkin's agent workflows, "best" means *reliably calls tools and follows instructions*, not *scores highest on a benchmark*. `llama3.2:3b` is a strong default because it does the agent loop well at a size almost any machine can run. Once you're comfortable, pull others and compare — switching models in Pumkin is just a dropdown.

## Keep Ollama running

Pumkin needs Ollama alive to do anything. On Windows it auto-starts with the system, so this usually takes care of itself. If Pumkin ever says it can't reach a model, the first thing to check is whether Ollama is running — see [Troubleshooting](/docs/troubleshooting/).

Next: [Install Pumkin →](/docs/install-pumkin/)
