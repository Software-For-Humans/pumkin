# Security Policy

Pumkin runs entirely on your machine and doesn't phone home, but it's an agent
tool that can execute MCP tools and reach your local Ollama — so security matters.

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue.

Email **hi@pumkin.app** with:

- a description of the issue and its impact,
- steps to reproduce (a proof of concept helps),
- any suggested fix.

You'll get an acknowledgement, usually within a few days. Once a fix is available
we'll credit you in the release notes, unless you'd rather stay anonymous.

## Scope

Pumkin is early-stage software (v0.x). The runtime gates tool calls behind an
allowlist and an approval step by default — keep approvals on for anything that
touches your system until you trust an agent. You're responsible for the MCP
servers and models you connect.

## Supported versions

Only the latest release is supported. Please update before reporting an issue you
hit on an older build.
