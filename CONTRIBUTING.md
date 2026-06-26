# Contributing to Pumkin

Thanks for your interest in Pumkin — a local-first AI agent IDE, free and open
source under the MIT license. Issues and pull requests are welcome.

## Ways to help

- Report bugs or rough edges by opening an issue.
- Suggest features (open an issue first so we can talk it through before you build).
- Send pull requests for fixes and improvements.
- Improve the docs.

## Development setup

You need [Node.js](https://nodejs.org) 22.5+ (for the built-in `node:sqlite`) and
[Ollama](https://ollama.com) running locally with a tool-capable model pulled.

```
# install the runtime deps
npm install

# run the web UI
cd web
npm install
npm run dev   # http://localhost:3000
```

See the [README](README.md) for the CLI quickstart and an architecture overview.

## Pull requests

- Keep changes focused — one concern per PR.
- Match the existing style. The runtime (`agent.ts`) intentionally has zero
  dependencies; please keep it that way.
- Describe what changed and why. If it fixes an issue, link it.
- By submitting a PR you agree your contribution is licensed under the MIT license.

## Security issues

Please don't file public issues for security problems — see [SECURITY.md](SECURITY.md).

## Code of conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Be decent to each other.
