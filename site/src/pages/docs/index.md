---
layout: ../../layouts/DocsLayout.astro
title: Overview
description: What Pumkin is, how it works, and what you need to run it.
---

Pumkin is a **local-first AI agent IDE** for developers. You build, run, and audit AI agents on your own machine — they talk to models running locally through [Ollama](https://ollama.com) and use tools you connect through MCP. Nothing leaves your computer. No cloud, no API keys, no per-token billing.

This guide gets you from a fresh install to your first working agent. If you hit something it doesn't cover, email **hi@pumkin.app** — one founder, real answers.

## How it works

Pumkin is a desktop app. Under the hood it runs a local server that orchestrates three things:

- **Your models** — served by Ollama, running entirely on your hardware. Pumkin never sends your prompts to a third party.
- **Your tools** — connected through MCP (Model Context Protocol). An agent can read time, call a script, hit a local API, or use any MCP server you point it at.
- **Your history** — every run, message, and tool call is stored in a local database on your machine, so you can audit exactly what an agent did and why.

An **agent** is a saved configuration: a model, a system prompt, and a set of tools. You give it a task, it reasons, calls tools when it needs them, and streams back its work as a **run** you can inspect step by step.

## What you need

- **Windows 10 or 11** (64-bit). macOS and Linux builds are coming; your license covers them when they ship.
- **[Ollama](https://ollama.com)** installed and running. This is what actually runs the AI models. Setup is covered on the next page.
- **At least 8 GB of RAM.** This is a real floor, not a suggestion — see [Install Ollama & models](/docs/installing-ollama/) for which models fit which machines.
- A few GB of free disk for the app and whatever models you pull.

## The five-minute path

1. [Install Ollama and pull a model](/docs/installing-ollama/) — start with `llama3.2:3b`.
2. [Install Pumkin](/docs/install-pumkin/) and launch it.
3. [Create your first agent](/docs/first-agent/), pick your model, and run a task.
4. [Add MCP tools](/docs/mcp-tools/) when you want the agent to actually *do* things.

> **New to local models?** That's fine. You don't need to understand how models work to use Pumkin — you need Ollama running and one model pulled. The next page walks through both.

Start with [Install Ollama & models →](/docs/installing-ollama/)
