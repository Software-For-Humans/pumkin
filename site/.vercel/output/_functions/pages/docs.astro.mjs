import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../renderers.mjs';

const html = () => "<p>Pumkin is a <strong>local-first AI agent IDE</strong> for developers. You build, run, and audit AI agents on your own machine — they talk to models running locally through <a href=\"https://ollama.com\">Ollama</a> and use tools you connect through MCP. Nothing leaves your computer. No cloud, no API keys, no per-token billing.</p>\n<p>This guide gets you from a fresh install to your first working agent. If you hit something it doesn’t cover, email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong> — one founder, real answers.</p>\n<h2 id=\"how-it-works\">How it works</h2>\n<p>Pumkin is a desktop app. Under the hood it runs a local server that orchestrates three things:</p>\n<ul>\n<li><strong>Your models</strong> — served by Ollama, running entirely on your hardware. Pumkin never sends your prompts to a third party.</li>\n<li><strong>Your tools</strong> — connected through MCP (Model Context Protocol). An agent can read time, call a script, hit a local API, or use any MCP server you point it at.</li>\n<li><strong>Your history</strong> — every run, message, and tool call is stored in a local database on your machine, so you can audit exactly what an agent did and why.</li>\n</ul>\n<p>An <strong>agent</strong> is a saved configuration: a model, a system prompt, and a set of tools. You give it a task, it reasons, calls tools when it needs them, and streams back its work as a <strong>run</strong> you can inspect step by step.</p>\n<h2 id=\"what-you-need\">What you need</h2>\n<ul>\n<li><strong>Windows 10 or 11</strong> (64-bit). macOS and Linux builds are coming; your license covers them when they ship.</li>\n<li><strong><a href=\"https://ollama.com\">Ollama</a></strong> installed and running. This is what actually runs the AI models. Setup is covered on the next page.</li>\n<li><strong>At least 8 GB of RAM.</strong> This is a real floor, not a suggestion — see <a href=\"/docs/installing-ollama/\">Install Ollama &#x26; models</a> for which models fit which machines.</li>\n<li>A few GB of free disk for the app and whatever models you pull.</li>\n</ul>\n<h2 id=\"the-five-minute-path\">The five-minute path</h2>\n<ol>\n<li><a href=\"/docs/installing-ollama/\">Install Ollama and pull a model</a> — start with <code>llama3.2:3b</code>.</li>\n<li><a href=\"/docs/install-pumkin/\">Install Pumkin</a> and launch it.</li>\n<li><a href=\"/docs/first-agent/\">Create your first agent</a>, pick your model, and run a task.</li>\n<li><a href=\"/docs/mcp-tools/\">Add MCP tools</a> when you want the agent to actually <em>do</em> things.</li>\n</ol>\n<blockquote>\n<p><strong>New to local models?</strong> That’s fine. You don’t need to understand how models work to use Pumkin — you need Ollama running and one model pulled. The next page walks through both.</p>\n</blockquote>\n<p>Start with <a href=\"/docs/installing-ollama/\">Install Ollama &#x26; models →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Overview","description":"What Pumkin is, how it works, and what you need to run it."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/index.md";
				const url = "/docs";
				function rawContent() {
					return "   \n                                      \n               \n                                                                       \n   \n\nPumkin is a **local-first AI agent IDE** for developers. You build, run, and audit AI agents on your own machine — they talk to models running locally through [Ollama](https://ollama.com) and use tools you connect through MCP. Nothing leaves your computer. No cloud, no API keys, no per-token billing.\n\nThis guide gets you from a fresh install to your first working agent. If you hit something it doesn't cover, email **hi@pumkin.app** — one founder, real answers.\n\n## How it works\n\nPumkin is a desktop app. Under the hood it runs a local server that orchestrates three things:\n\n- **Your models** — served by Ollama, running entirely on your hardware. Pumkin never sends your prompts to a third party.\n- **Your tools** — connected through MCP (Model Context Protocol). An agent can read time, call a script, hit a local API, or use any MCP server you point it at.\n- **Your history** — every run, message, and tool call is stored in a local database on your machine, so you can audit exactly what an agent did and why.\n\nAn **agent** is a saved configuration: a model, a system prompt, and a set of tools. You give it a task, it reasons, calls tools when it needs them, and streams back its work as a **run** you can inspect step by step.\n\n## What you need\n\n- **Windows 10 or 11** (64-bit). macOS and Linux builds are coming; your license covers them when they ship.\n- **[Ollama](https://ollama.com)** installed and running. This is what actually runs the AI models. Setup is covered on the next page.\n- **At least 8 GB of RAM.** This is a real floor, not a suggestion — see [Install Ollama & models](/docs/installing-ollama/) for which models fit which machines.\n- A few GB of free disk for the app and whatever models you pull.\n\n## The five-minute path\n\n1. [Install Ollama and pull a model](/docs/installing-ollama/) — start with `llama3.2:3b`.\n2. [Install Pumkin](/docs/install-pumkin/) and launch it.\n3. [Create your first agent](/docs/first-agent/), pick your model, and run a task.\n4. [Add MCP tools](/docs/mcp-tools/) when you want the agent to actually *do* things.\n\n> **New to local models?** That's fine. You don't need to understand how models work to use Pumkin — you need Ollama running and one model pulled. The next page walks through both.\n\nStart with [Install Ollama & models →](/docs/installing-ollama/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"how-it-works","text":"How it works"},{"depth":2,"slug":"what-you-need","text":"What you need"},{"depth":2,"slug":"the-five-minute-path","text":"The five-minute path"}];
				}

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${renderComponent(result, 'Layout', $$DocsLayout, {
								file,
								url,
								content,
								frontmatter: content,
								headings: getHeadings(),
								rawContent,
								compiledContent,
								'server:root': true,
							}, {
								'default': () => renderTemplate`${unescapeHTML(html())}`
							})}`;
				});

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Content,
	compiledContent,
	default: Content,
	file,
	frontmatter,
	getHeadings,
	rawContent,
	url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
