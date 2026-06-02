import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<h2 id=\"does-anything-i-do-leave-my-machine\">Does anything I do leave my machine?</h2>\n<p>No. Pumkin runs locally, talks to Ollama locally, and stores everything in a local database. Your prompts, the models’ responses, and your data stay on your computer. There’s no Pumkin server in the loop, no telemetry on your agent activity, no API keys to a cloud provider.</p>\n<h2 id=\"do-i-need-an-internet-connection\">Do I need an internet connection?</h2>\n<p>Only to download Pumkin, install Ollama, and pull models. Once a model is on your machine, agents run fully offline.</p>\n<h2 id=\"what-does-the-license-cover\">What does the license cover?</h2>\n<p>A founding license is a one-time $99 purchase for <strong>lifetime updates on every platform</strong>. Windows ships first; macOS and Linux builds are included free when they land. You also get the source code for personal use and audit.</p>\n<h2 id=\"why-is-there-a-smartscreen-warning\">Why is there a SmartScreen warning?</h2>\n<p>Pumkin isn’t code-signed with a paid certificate yet, so Windows shows an “unknown publisher” prompt. Click <strong>More info → Run anyway</strong>. Signing is on the roadmap, funded by founding sales. See <a href=\"/docs/install-pumkin/\">Install Pumkin</a>.</p>\n<h2 id=\"what-hardware-do-i-need\">What hardware do I need?</h2>\n<p>Windows 10/11 64-bit and at least 8 GB of RAM. On 8 GB, use the <code>llama3.2:3b</code> model — it’s the tested default and runs well. More RAM lets you run larger models. See <a href=\"/docs/installing-ollama/\">Install Ollama &#x26; models</a>.</p>\n<h2 id=\"which-model-should-i-use\">Which model should I use?</h2>\n<p>Start with <code>llama3.2:3b</code>. It’s tuned and tested for Pumkin’s agent workflows — reliable tool calls at a size almost any machine can run. Once comfortable, pull others and compare; switching is a dropdown.</p>\n<h2 id=\"can-i-use-my-own-tools\">Can I use my own tools?</h2>\n<p>Yes. Pumkin uses MCP (Model Context Protocol), an open standard. Any MCP server works — including ones you write to expose your own scripts, APIs, or hardware. See <a href=\"/docs/mcp-tools/\">MCP tools</a>.</p>\n<h2 id=\"can-the-agent-do-things-without-my-say-so\">Can the agent do things without my say-so?</h2>\n<p>Only if you let it. Pumkin has an approval flow: you can require an agent to ask before running any tool, showing you the exact call and arguments first. Keep approvals on for anything that touches your system until you trust it. See <a href=\"/docs/mcp-tools/\">MCP tools</a>.</p>\n<h2 id=\"is-there-a-refund\">Is there a refund?</h2>\n<p>Yes — 30 days, no questions asked. Email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong>.</p>\n<h2 id=\"when-do-macos-and-linux-ship\">When do macOS and Linux ship?</h2>\n<p>They’re on the roadmap and included in your license. No firm date yet — founding sales fund the build work. Buy now and you get them free when they’re ready.</p>\n<h2 id=\"how-do-i-get-support\">How do I get support?</h2>\n<p>Email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong>. One founder, real answers, usually within a day. Describe what you did, what you expected, and what happened.</p>\n<p>Back to <a href=\"/docs/\">Overview →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"FAQ","description":"Common questions about Pumkin, licensing, platforms, and privacy."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/faq.md";
				const url = "/docs/faq";
				function rawContent() {
					return "   \n                                      \n          \n                                                                              \n   \n\n## Does anything I do leave my machine?\n\nNo. Pumkin runs locally, talks to Ollama locally, and stores everything in a local database. Your prompts, the models' responses, and your data stay on your computer. There's no Pumkin server in the loop, no telemetry on your agent activity, no API keys to a cloud provider.\n\n## Do I need an internet connection?\n\nOnly to download Pumkin, install Ollama, and pull models. Once a model is on your machine, agents run fully offline.\n\n## What does the license cover?\n\nA founding license is a one-time $99 purchase for **lifetime updates on every platform**. Windows ships first; macOS and Linux builds are included free when they land. You also get the source code for personal use and audit.\n\n## Why is there a SmartScreen warning?\n\nPumkin isn't code-signed with a paid certificate yet, so Windows shows an \"unknown publisher\" prompt. Click **More info → Run anyway**. Signing is on the roadmap, funded by founding sales. See [Install Pumkin](/docs/install-pumkin/).\n\n## What hardware do I need?\n\nWindows 10/11 64-bit and at least 8 GB of RAM. On 8 GB, use the `llama3.2:3b` model — it's the tested default and runs well. More RAM lets you run larger models. See [Install Ollama & models](/docs/installing-ollama/).\n\n## Which model should I use?\n\nStart with `llama3.2:3b`. It's tuned and tested for Pumkin's agent workflows — reliable tool calls at a size almost any machine can run. Once comfortable, pull others and compare; switching is a dropdown.\n\n## Can I use my own tools?\n\nYes. Pumkin uses MCP (Model Context Protocol), an open standard. Any MCP server works — including ones you write to expose your own scripts, APIs, or hardware. See [MCP tools](/docs/mcp-tools/).\n\n## Can the agent do things without my say-so?\n\nOnly if you let it. Pumkin has an approval flow: you can require an agent to ask before running any tool, showing you the exact call and arguments first. Keep approvals on for anything that touches your system until you trust it. See [MCP tools](/docs/mcp-tools/).\n\n## Is there a refund?\n\nYes — 30 days, no questions asked. Email **hi@pumkin.app**.\n\n## When do macOS and Linux ship?\n\nThey're on the roadmap and included in your license. No firm date yet — founding sales fund the build work. Buy now and you get them free when they're ready.\n\n## How do I get support?\n\nEmail **hi@pumkin.app**. One founder, real answers, usually within a day. Describe what you did, what you expected, and what happened.\n\nBack to [Overview →](/docs/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"does-anything-i-do-leave-my-machine","text":"Does anything I do leave my machine?"},{"depth":2,"slug":"do-i-need-an-internet-connection","text":"Do I need an internet connection?"},{"depth":2,"slug":"what-does-the-license-cover","text":"What does the license cover?"},{"depth":2,"slug":"why-is-there-a-smartscreen-warning","text":"Why is there a SmartScreen warning?"},{"depth":2,"slug":"what-hardware-do-i-need","text":"What hardware do I need?"},{"depth":2,"slug":"which-model-should-i-use","text":"Which model should I use?"},{"depth":2,"slug":"can-i-use-my-own-tools","text":"Can I use my own tools?"},{"depth":2,"slug":"can-the-agent-do-things-without-my-say-so","text":"Can the agent do things without my say-so?"},{"depth":2,"slug":"is-there-a-refund","text":"Is there a refund?"},{"depth":2,"slug":"when-do-macos-and-linux-ship","text":"When do macOS and Linux ship?"},{"depth":2,"slug":"how-do-i-get-support","text":"How do I get support?"}];
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
