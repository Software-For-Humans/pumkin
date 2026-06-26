---
layout: ../../layouts/DocsLayout.astro
title: Troubleshooting
description: Fixes for the most common Pumkin issues.
---

Most problems come down to one of three things: Ollama isn't running, the model is too big for your RAM, or Windows is being cautious. Here's how to clear each.

## "No models" / Pumkin can't reach a model

Pumkin needs Ollama running to do anything. If it reports no models or can't connect:

1. **Check Ollama is running.** Open a terminal and run `ollama list`. If it doesn't respond, Ollama isn't up.
2. **Start it.** On Windows, Ollama runs as a service that auto-starts — restarting your machine usually brings it back. You can also relaunch Ollama from the Start menu.
3. **Confirm you've pulled a model.** `ollama list` should show at least `llama3.2:3b`. If it's empty, run `ollama pull llama3.2:3b`.
4. **Restart Pumkin** after Ollama is confirmed running, so it re-checks the connection.

## The model is painfully slow or won't load

Almost always a memory problem — the model is too large for your RAM.

- On **8 GB**, use `llama3.2:3b`. Larger 7–8B models (like `qwen3:8b`) will swap to disk and become unusable. This isn't a bug; it's physics.
- Close other memory-hungry apps (browsers with many tabs are the usual culprit).
- If you pulled a big model to try it and it's grinding, switch the agent's model back to `llama3.2:3b` in the dropdown.

See [Install Ollama & models](/docs/installing-ollama/) for the RAM-to-model guide.

## "Windows protected your PC" on launch

This SmartScreen warning appears because Pumkin isn't code-signed yet (a paid certificate is on the roadmap). It's expected and harmless for the installer you downloaded from GitHub Releases.

- Click **More info** → **Run anyway**.

## The download won't start

- Grab the installer from the [releases page](https://github.com/Software-For-Humans/pumkin/releases/latest) — it's under **Assets** on the latest release.
- If a download fails partway, just download it again.
- Still stuck? Open an issue on GitHub or email **hi@pumkin.app**.

## The desktop shortcut icon looks generic

A cosmetic Windows icon-cache quirk that sometimes shows a stale icon on the shortcut even though the app itself is fine. It doesn't affect anything. Signing out and back in (or a restart) clears the cache. Safe to ignore.

## An agent did something unexpected

Open the run and read the events in order — the `tool_call`, `tool_result`, and following `model_response` usually reveal the cause. Most often it's a vague system prompt or a tool returning something the model misread. See [Runs & threads](/docs/runs-and-threads/) for how to read a run.

## Where the logs are

If you need to dig deeper, Pumkin's data and logs live under:

```
%LOCALAPPDATA%\Pumkin\
```

When you email support about a bug, mentioning what the run showed (or attaching what's in that folder) gets us to an answer faster.

## Still stuck?

Email **hi@pumkin.app**. One maintainer, real support — describe what you did, what you expected, and what happened, and I'll get back to you, usually within a day.

More questions? See the [FAQ →](/docs/faq/)
