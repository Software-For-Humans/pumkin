---
layout: ../../layouts/DocsLayout.astro
title: MCP tools
description: Give your agents tools using MCP — what it is, how to add a server, and the approval flow.
---

An agent that can only talk is a chatbot. An agent that can *act* needs tools. Pumkin gives agents tools through **MCP** — the Model Context Protocol — an open standard for connecting AI models to external capabilities.

## What MCP is

MCP is a standard way for a program to expose **tools** (functions an agent can call) over a consistent interface. An MCP server might expose tools to read files, query a database, hit an HTTP API, control hardware, or anything else someone has built. Because it's a standard, any MCP server works with Pumkin — you're not limited to a fixed built-in list.

When an agent decides it needs a tool, it emits a tool call. Pumkin routes that to the right MCP server, runs it, and feeds the result back to the agent so it can continue.

## Built-in tools

Pumkin ships with a couple of simple tools so you can see the loop work before connecting anything:

- **`get_time`** — returns the current time. Handy for testing that tool-calling works end to end (it's the one in the example run).
- **`echo`** — returns whatever you pass it. A trivial round-trip to confirm wiring.

Run an agent and ask "what time is it?" — if you see a `get_time` tool call and a real timestamp in the result, your tool pipeline is working.

## Add an MCP server

To give an agent real capabilities, connect an MCP server:

1. Open the tools / MCP section in Pumkin.
2. Add a new MCP server — you point Pumkin at how to launch or reach it (the server's command or address, depending on the server).
3. Pumkin connects and discovers the tools that server exposes.
4. Attach those tools to an agent.

Once attached, the agent can call them on any run. The model decides *when* to use a tool based on the task and its system prompt — you don't script the calls.

## The approval flow

Tools can do real things — write files, send requests, change state. So Pumkin puts you in control with an **approval step**: when an agent wants to call a tool, you can require it to ask first. You see exactly which tool it wants to run and with what arguments, and you approve or deny.

> **Why this matters:** local-first isn't just about privacy, it's about control. You can watch an agent's intended action *before* it happens, not read about it after. For anything that touches your system or the outside world, keep approvals on until you trust a given agent + tool combination.

## Writing your own tools

Because MCP is an open standard, you can expose your own scripts and services as MCP servers and Pumkin will use them like any other. This is the real unlock: an agent that uses *your* tools, on *your* machine, with *your* data — no third party in the loop.

Next: [Runs & threads →](/docs/runs-and-threads/)
