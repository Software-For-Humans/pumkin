# agentkit

Local-first platform for building and running AI agents against your own Ollama. No cloud inference, no API keys, no per-token cost. Built single-user for now; architected to grow into a sellable product.

## Quickstart

```bash
npm install
ollama pull qwen3-coder:32b        # or llama3.1:8b to test fast
npm run example -- "what time is it, then read package.json and summarize it"
```

Requires [Ollama](https://ollama.com) running locally (default `http://localhost:11434`) with a tool-capable model pulled.

## Layout

- `agent.ts` — the runtime. The agent loop, Ollama tool-calling, and safety gates (allowlist, schema validation, per-tool timeouts, approval gate, event stream). Zero dependencies.
- `mcp.ts` — adapts MCP servers into agent tools. `connectMcp(config)` / `connectMcpServers([...])` → `{ tools, close }`. Hand the tools straight to `new Agent({ tools })`. The only file that pulls in the MCP SDK.
- `example.ts` — runnable demo with two built-in tools.

## Architecture

Three layers, built so the data model flows downhill:

1. **Runtime** (`agent.ts`) — done. An "agent" is a loop: ask the model → run any requested tools → feed results back → repeat, with hard stop conditions.
2. **MCP adapter** (`mcp.ts`) — done. Brings the whole MCP tool ecosystem in instead of hand-writing every integration. Stdio for local servers, Streamable HTTP for remote. Tools are namespaced (`server__tool`) and gated by default.
3. **Store + UI** — next. SQLite (`agents` + `mcp_servers` tables) and a Next.js shell over the runtime's event stream. Distribution later via Tauri wrapping the same code.

## Models

Local agents live or die on tool-calling reliability. Skip anything under 14B for real use.

- `qwen3-coder:32b` — current price/performance pick (24–32GB VRAM at q4/q5).
- `gpt-oss:20b` — stable, purpose-built for agent tasks.
- `llama3.3:70b` — safe choice with 48GB+ VRAM.
- `llama3.1:8b` — dev iteration only.

## Status

Runtime and MCP adapter complete and CLI-tested. Store and UI in progress.
