---
layout: ../../layouts/DocsLayout.astro
title: FAQ
description: Common questions about Pumkin, licensing, platforms, and privacy.
---

## Does anything I do leave my machine?

No. Pumkin runs locally, talks to Ollama locally, and stores everything in a local database. Your prompts, the models' responses, and your data stay on your computer. There's no Pumkin server in the loop, no telemetry on your agent activity, no API keys to a cloud provider.

## Do I need an internet connection?

Only to download Pumkin, install Ollama, and pull models. Once a model is on your machine, agents run fully offline.

## What does it cost?

Nothing. Pumkin is free and open source under the MIT license. Download it, use it, read the source, modify it, even ship your own version. No license key, no account, no paid tier.

## Why is there a SmartScreen warning?

Pumkin isn't code-signed with a paid certificate yet, so Windows shows an "unknown publisher" prompt. Click **More info → Run anyway**. Code-signing is on the roadmap. See [Install Pumkin](/docs/install-pumkin/).

## What hardware do I need?

Windows 10/11 64-bit and at least 8 GB of RAM. On 8 GB, use the `llama3.2:3b` model — it's the tested default and runs well. More RAM lets you run larger models. See [Install Ollama & models](/docs/installing-ollama/).

## Which model should I use?

Start with `llama3.2:3b`. It's tuned and tested for Pumkin's agent workflows — reliable tool calls at a size almost any machine can run. Once comfortable, pull others and compare; switching is a dropdown.

## Can I use my own tools?

Yes. Pumkin uses MCP (Model Context Protocol), an open standard. Any MCP server works — including ones you write to expose your own scripts, APIs, or hardware. See [MCP tools](/docs/mcp-tools/).

## Can the agent do things without my say-so?

Only if you let it. Pumkin has an approval flow: you can require an agent to ask before running any tool, showing you the exact call and arguments first. Keep approvals on for anything that touches your system until you trust it. See [MCP tools](/docs/mcp-tools/).

## When do macOS and Linux ship?

They're on the roadmap. No firm date yet — the Tauri shell is cross-platform, but the bundled-Node and code-signing story needs work on each platform. They'll be free when they land, same as everything else.

## How do I get support?

Open an issue on GitHub, or email **hi@pumkin.app**. One maintainer, real answers, usually within a day. Describe what you did, what you expected, and what happened.

Back to [Overview →](/docs/)
