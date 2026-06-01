---
layout: ../../layouts/DocsLayout.astro
title: FAQ
description: Common questions about Pumkin, licensing, platforms, and privacy.
---

## Does anything I do leave my machine?

No. Pumkin runs locally, talks to Ollama locally, and stores everything in a local database. Your prompts, the models' responses, and your data stay on your computer. There's no Pumkin server in the loop, no telemetry on your agent activity, no API keys to a cloud provider.

## Do I need an internet connection?

Only to download Pumkin, install Ollama, and pull models. Once a model is on your machine, agents run fully offline.

## What does the license cover?

A founding license is a one-time $99 purchase for **lifetime updates on every platform**. Windows ships first; macOS and Linux builds are included free when they land. You also get the source code for personal use and audit.

## Why is there a SmartScreen warning?

Pumkin isn't code-signed with a paid certificate yet, so Windows shows an "unknown publisher" prompt. Click **More info → Run anyway**. Signing is on the roadmap, funded by founding sales. See [Install Pumkin](/docs/install-pumkin/).

## What hardware do I need?

Windows 10/11 64-bit and at least 8 GB of RAM. On 8 GB, use the `llama3.2:3b` model — it's the tested default and runs well. More RAM lets you run larger models. See [Install Ollama & models](/docs/installing-ollama/).

## Which model should I use?

Start with `llama3.2:3b`. It's tuned and tested for Pumkin's agent workflows — reliable tool calls at a size almost any machine can run. Once comfortable, pull others and compare; switching is a dropdown.

## Can I use my own tools?

Yes. Pumkin uses MCP (Model Context Protocol), an open standard. Any MCP server works — including ones you write to expose your own scripts, APIs, or hardware. See [MCP tools](/docs/mcp-tools/).

## Can the agent do things without my say-so?

Only if you let it. Pumkin has an approval flow: you can require an agent to ask before running any tool, showing you the exact call and arguments first. Keep approvals on for anything that touches your system until you trust it. See [MCP tools](/docs/mcp-tools/).

## Is there a refund?

Yes — 30 days, no questions asked. Email **hi@pumkin.app**.

## When do macOS and Linux ship?

They're on the roadmap and included in your license. No firm date yet — founding sales fund the build work. Buy now and you get them free when they're ready.

## How do I get support?

Email **hi@pumkin.app**. One founder, real answers, usually within a day. Describe what you did, what you expected, and what happened.

Back to [Overview →](/docs/)
