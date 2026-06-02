import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>An agent that can only talk is a chatbot. An agent that can <em>act</em> needs tools. Pumkin gives agents tools through <strong>MCP</strong> — the Model Context Protocol — an open standard for connecting AI models to external capabilities.</p>\n<h2 id=\"what-mcp-is\">What MCP is</h2>\n<p>MCP is a standard way for a program to expose <strong>tools</strong> (functions an agent can call) over a consistent interface. An MCP server might expose tools to read files, query a database, hit an HTTP API, control hardware, or anything else someone has built. Because it’s a standard, any MCP server works with Pumkin — you’re not limited to a fixed built-in list.</p>\n<p>When an agent decides it needs a tool, it emits a tool call. Pumkin routes that to the right MCP server, runs it, and feeds the result back to the agent so it can continue.</p>\n<h2 id=\"built-in-tools\">Built-in tools</h2>\n<p>Pumkin ships with a couple of simple tools so you can see the loop work before connecting anything:</p>\n<ul>\n<li><strong><code>get_time</code></strong> — returns the current time. Handy for testing that tool-calling works end to end (it’s the one in the example run).</li>\n<li><strong><code>echo</code></strong> — returns whatever you pass it. A trivial round-trip to confirm wiring.</li>\n</ul>\n<p>Run an agent and ask “what time is it?” — if you see a <code>get_time</code> tool call and a real timestamp in the result, your tool pipeline is working.</p>\n<h2 id=\"add-an-mcp-server\">Add an MCP server</h2>\n<p>To give an agent real capabilities, connect an MCP server:</p>\n<ol>\n<li>Open the tools / MCP section in Pumkin.</li>\n<li>Add a new MCP server — you point Pumkin at how to launch or reach it (the server’s command or address, depending on the server).</li>\n<li>Pumkin connects and discovers the tools that server exposes.</li>\n<li>Attach those tools to an agent.</li>\n</ol>\n<p>Once attached, the agent can call them on any run. The model decides <em>when</em> to use a tool based on the task and its system prompt — you don’t script the calls.</p>\n<h2 id=\"the-approval-flow\">The approval flow</h2>\n<p>Tools can do real things — write files, send requests, change state. So Pumkin puts you in control with an <strong>approval step</strong>: when an agent wants to call a tool, you can require it to ask first. You see exactly which tool it wants to run and with what arguments, and you approve or deny.</p>\n<blockquote>\n<p><strong>Why this matters:</strong> local-first isn’t just about privacy, it’s about control. You can watch an agent’s intended action <em>before</em> it happens, not read about it after. For anything that touches your system or the outside world, keep approvals on until you trust a given agent + tool combination.</p>\n</blockquote>\n<h2 id=\"writing-your-own-tools\">Writing your own tools</h2>\n<p>Because MCP is an open standard, you can expose your own scripts and services as MCP servers and Pumkin will use them like any other. This is the real unlock: an agent that uses <em>your</em> tools, on <em>your</em> machine, with <em>your</em> data — no third party in the loop.</p>\n<p>Next: <a href=\"/docs/runs-and-threads/\">Runs &#x26; threads →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"MCP tools","description":"Give your agents tools using MCP — what it is, how to add a server, and the approval flow."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/mcp-tools.md";
				const url = "/docs/mcp-tools";
				function rawContent() {
					return "   \n                                      \n                \n                                                                                                       \n   \n\nAn agent that can only talk is a chatbot. An agent that can *act* needs tools. Pumkin gives agents tools through **MCP** — the Model Context Protocol — an open standard for connecting AI models to external capabilities.\n\n## What MCP is\n\nMCP is a standard way for a program to expose **tools** (functions an agent can call) over a consistent interface. An MCP server might expose tools to read files, query a database, hit an HTTP API, control hardware, or anything else someone has built. Because it's a standard, any MCP server works with Pumkin — you're not limited to a fixed built-in list.\n\nWhen an agent decides it needs a tool, it emits a tool call. Pumkin routes that to the right MCP server, runs it, and feeds the result back to the agent so it can continue.\n\n## Built-in tools\n\nPumkin ships with a couple of simple tools so you can see the loop work before connecting anything:\n\n- **`get_time`** — returns the current time. Handy for testing that tool-calling works end to end (it's the one in the example run).\n- **`echo`** — returns whatever you pass it. A trivial round-trip to confirm wiring.\n\nRun an agent and ask \"what time is it?\" — if you see a `get_time` tool call and a real timestamp in the result, your tool pipeline is working.\n\n## Add an MCP server\n\nTo give an agent real capabilities, connect an MCP server:\n\n1. Open the tools / MCP section in Pumkin.\n2. Add a new MCP server — you point Pumkin at how to launch or reach it (the server's command or address, depending on the server).\n3. Pumkin connects and discovers the tools that server exposes.\n4. Attach those tools to an agent.\n\nOnce attached, the agent can call them on any run. The model decides *when* to use a tool based on the task and its system prompt — you don't script the calls.\n\n## The approval flow\n\nTools can do real things — write files, send requests, change state. So Pumkin puts you in control with an **approval step**: when an agent wants to call a tool, you can require it to ask first. You see exactly which tool it wants to run and with what arguments, and you approve or deny.\n\n> **Why this matters:** local-first isn't just about privacy, it's about control. You can watch an agent's intended action *before* it happens, not read about it after. For anything that touches your system or the outside world, keep approvals on until you trust a given agent + tool combination.\n\n## Writing your own tools\n\nBecause MCP is an open standard, you can expose your own scripts and services as MCP servers and Pumkin will use them like any other. This is the real unlock: an agent that uses *your* tools, on *your* machine, with *your* data — no third party in the loop.\n\nNext: [Runs & threads →](/docs/runs-and-threads/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"what-mcp-is","text":"What MCP is"},{"depth":2,"slug":"built-in-tools","text":"Built-in tools"},{"depth":2,"slug":"add-an-mcp-server","text":"Add an MCP server"},{"depth":2,"slug":"the-approval-flow","text":"The approval flow"},{"depth":2,"slug":"writing-your-own-tools","text":"Writing your own tools"}];
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
