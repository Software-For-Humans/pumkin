import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>An <strong>agent</strong> in Pumkin is a saved setup: a model, a system prompt that defines its behavior, and any tools you’ve given it. Once saved, you can run it over and over with different tasks. Let’s make one.</p>\n<h2 id=\"1-create-an-agent\">1. Create an agent</h2>\n<p>From the main screen, create a new agent. You’ll give it:</p>\n<ul>\n<li><strong>A name</strong> — anything. “Scratch”, “Research helper”, whatever you’ll recognize.</li>\n<li><strong>A model</strong> — pick from the models you’ve pulled into Ollama. If you followed the setup, <code>llama3.2:3b</code> is here. This dropdown is also how you swap models later to compare them.</li>\n<li><strong>A system prompt</strong> — the standing instructions that shape how the agent behaves on every run.</li>\n</ul>\n<h2 id=\"2-write-a-system-prompt\">2. Write a system prompt</h2>\n<p>The system prompt is where you set the agent’s job and personality. Keep it concrete. A good starter:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>You are a concise, careful assistant. When a task needs</span></span>\n<span class=\"line\"><span>current information or an action, use the available tools</span></span>\n<span class=\"line\"><span>rather than guessing. Explain what you did in plain language.</span></span></code></pre>\n<p>You don’t need tools configured yet to run an agent — without them it just reasons and answers. Tools are what let it <em>act</em>, and they’re covered next in <a href=\"/docs/mcp-tools/\">MCP tools</a>.</p>\n<h2 id=\"3-run-a-task\">3. Run a task</h2>\n<p>With the agent saved, give it a task and run it. Try something simple first:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>Summarize what you can and can't do right now.</span></span></code></pre>\n<p>Pumkin streams the agent’s work back as a <strong>run</strong> — you’ll see it think, respond, and (once you’ve added tools) call them. The whole exchange is saved so you can come back to it.</p>\n<h2 id=\"4-read-the-run\">4. Read the run</h2>\n<p>A run shows each step the agent took, in order. Even on a plain question you’ll see the model’s response stream in. Once tools are involved, you’ll see tool calls and their results inline — this is the part that makes Pumkin an <em>auditing</em> tool, not just a chat box. You can see exactly what the agent did.</p>\n<p>Here’s what a run looks like with a tool call (this is real output — <code>llama3.2:3b</code> using the built-in <code>get_time</code> tool):</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>$ ask \"What time is it?\"</span></span>\n<span class=\"line\"><span>[run_started]</span></span>\n<span class=\"line\"><span>[model_response] · tool_calls: get_time</span></span>\n<span class=\"line\"><span>[tool_call]   get_time({})</span></span>\n<span class=\"line\"><span>[tool_result] 2026-05-29T11:48:02.553Z</span></span>\n<span class=\"line\"><span>[model_response]</span></span>\n<span class=\"line\"><span>  \"The current time is 11:48 AM UTC on May 29, 2026.\"</span></span>\n<span class=\"line\"><span>[done]</span></span></code></pre>\n<h2 id=\"5-keep-going\">5. Keep going</h2>\n<p>That’s the core loop: configure an agent, give it a task, watch the run, refine the prompt. From here:</p>\n<ul>\n<li><a href=\"/docs/mcp-tools/\">Add MCP tools</a> so the agent can do real work — call scripts, hit APIs, read data.</li>\n<li><a href=\"/docs/runs-and-threads/\">Understand runs &#x26; threads</a> to have multi-turn conversations and follow an agent’s reasoning in depth.</li>\n</ul>\n<p>Next: <a href=\"/docs/mcp-tools/\">MCP tools →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Your first agent","description":"Create an agent, give it a system prompt, pick a model, and run a task."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/first-agent.md";
				const url = "/docs/first-agent";
				function rawContent() {
					return "   \n                                      \n                       \n                                                                                    \n   \n\nAn **agent** in Pumkin is a saved setup: a model, a system prompt that defines its behavior, and any tools you've given it. Once saved, you can run it over and over with different tasks. Let's make one.\n\n## 1. Create an agent\n\nFrom the main screen, create a new agent. You'll give it:\n\n- **A name** — anything. \"Scratch\", \"Research helper\", whatever you'll recognize.\n- **A model** — pick from the models you've pulled into Ollama. If you followed the setup, `llama3.2:3b` is here. This dropdown is also how you swap models later to compare them.\n- **A system prompt** — the standing instructions that shape how the agent behaves on every run.\n\n## 2. Write a system prompt\n\nThe system prompt is where you set the agent's job and personality. Keep it concrete. A good starter:\n\n```\nYou are a concise, careful assistant. When a task needs\ncurrent information or an action, use the available tools\nrather than guessing. Explain what you did in plain language.\n```\n\nYou don't need tools configured yet to run an agent — without them it just reasons and answers. Tools are what let it *act*, and they're covered next in [MCP tools](/docs/mcp-tools/).\n\n## 3. Run a task\n\nWith the agent saved, give it a task and run it. Try something simple first:\n\n```\nSummarize what you can and can't do right now.\n```\n\nPumkin streams the agent's work back as a **run** — you'll see it think, respond, and (once you've added tools) call them. The whole exchange is saved so you can come back to it.\n\n## 4. Read the run\n\nA run shows each step the agent took, in order. Even on a plain question you'll see the model's response stream in. Once tools are involved, you'll see tool calls and their results inline — this is the part that makes Pumkin an *auditing* tool, not just a chat box. You can see exactly what the agent did.\n\nHere's what a run looks like with a tool call (this is real output — `llama3.2:3b` using the built-in `get_time` tool):\n\n```\n$ ask \"What time is it?\"\n[run_started]\n[model_response] · tool_calls: get_time\n[tool_call]   get_time({})\n[tool_result] 2026-05-29T11:48:02.553Z\n[model_response]\n  \"The current time is 11:48 AM UTC on May 29, 2026.\"\n[done]\n```\n\n## 5. Keep going\n\nThat's the core loop: configure an agent, give it a task, watch the run, refine the prompt. From here:\n\n- [Add MCP tools](/docs/mcp-tools/) so the agent can do real work — call scripts, hit APIs, read data.\n- [Understand runs & threads](/docs/runs-and-threads/) to have multi-turn conversations and follow an agent's reasoning in depth.\n\nNext: [MCP tools →](/docs/mcp-tools/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-create-an-agent","text":"1. Create an agent"},{"depth":2,"slug":"2-write-a-system-prompt","text":"2. Write a system prompt"},{"depth":2,"slug":"3-run-a-task","text":"3. Run a task"},{"depth":2,"slug":"4-read-the-run","text":"4. Read the run"},{"depth":2,"slug":"5-keep-going","text":"5. Keep going"}];
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
