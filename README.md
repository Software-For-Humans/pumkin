# Pumkin

A local-first IDE for building and running AI agents against your own Ollama models. No cloud inference, no API keys, no per-token cost — everything runs on your machine.

Free and open source under the [MIT license](LICENSE). Grab a build from [Releases](https://github.com/Software-For-Humans/pumkin/releases/latest), or build from source below.

> Heads up: the npm package and the SQLite database are still named `agentkit` internally — that rename is in progress and doesn't change how anything runs.

## Quickstart (web UI)

```bash
# Root: agentkit runtime
npm install

# Web app
cd web
npm install
npm run dev          # http://localhost:3000
```

Then in the UI: create an MCP server (optional) → create an agent → click into it → enter a prompt → see the event stream live. The SQLite DB lives at `../agentkit.db` relative to `web/` (override with `AGENTKIT_DB`).

## Quickstart (CLI)

```bash
ollama pull qwen3:8b
npm run cli -- agents:create          # NAME=... MODEL=... SYSTEM_PROMPT=... BUILTIN_TOOLS=get_time
npm run cli -- run <agentId> "what time is it?"
```

Requires [Ollama](https://ollama.com) running locally (default `http://localhost:11434`) with a tool-capable model pulled. Requires Node 22.5+ for the built-in `node:sqlite`.

## Layout

```
agent.ts           runtime: agent loop, Ollama tool-calling, safety gates (zero deps)
mcp.ts             adapter: MCP servers → agent tools (only file that pulls the MCP SDK)
store.ts           SQLite persistence: agents + mcp_servers tables (node:sqlite, no native deps)
loader.ts          turns a stored agent row into a live Agent with tools wired up
builtins.ts        registry of stock tools (get_time, read_text_file, ...)
cli.ts             terminal CRUD + run command
example.ts         minimal runnable demo, no DB
store-test.ts      end-to-end integration test against a real MCP server
web/               Next.js 15 UI over the same store + runtime
```

## Architecture

Four layers, built so the data model flows downhill:

1. **Runtime** (`agent.ts`) — agent loop with allowlist, schema validation, per-tool timeouts, approval gate, event stream.
2. **MCP adapter** (`mcp.ts`) — brings the whole MCP ecosystem in. Stdio for local servers, Streamable HTTP for remote. Tools namespaced (`server__tool`) and gated by default.
3. **Store + CLI** (`store.ts` + `loader.ts` + `cli.ts`) — SQLite persistence + a runtime-config loader + a usable terminal product.
4. **Web UI** (`web/`) — Next.js 15 App Router. Server actions for CRUD, an SSE endpoint streaming agent events to the browser live. Distribution later via Tauri wrapping the same code.

## Models

Local agents live or die on tool-calling reliability. Skip anything under 8B for real use, and prefer models specifically tuned for it.

- `qwen3:8b` — current dev pick, reliable tool calling, ~5GB.
- `llama3.1:8b` — also reliable, similar size.
- `qwen3-coder:30b-a3b-instruct-q4_K_M` — MoE, ~18GB, faster inference than dense 30B.
- `qwen3-coder:32b` — strongest at this scale (24–32GB VRAM at q4/q5).
- `llama3.3:70b` — safest if you have 48GB+ VRAM.

Models smaller than 8B (or earlier 7B variants like `qwen2.5-coder:7b`) often *imitate* tool-call JSON in the response text instead of using Ollama's structured `tool_calls` channel. The runtime correctly ignores those — a security feature, not a bug — but the agent will appear to "not call tools." Pull a better model.

## Status

Runtime, MCP adapter, SQLite store, loader, CLI, and web UI complete and integration-tested. Next: distribution via Tauri; agent edit page; live model picker via Ollama's `/api/tags`; interactive approval UI.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Report security issues privately via [SECURITY.md](SECURITY.md), and please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © 2026 Software For Humans, LLC.
