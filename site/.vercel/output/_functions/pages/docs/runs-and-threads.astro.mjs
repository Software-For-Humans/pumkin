import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>Two concepts shape how you work in Pumkin: <strong>runs</strong> and <strong>threads</strong>. Once they click, the whole app makes sense.</p>\n<h2 id=\"a-run\">A run</h2>\n<p>A <strong>run</strong> is one complete execution of an agent on a task. You give the agent something to do, it works, and the run captures everything that happened — start to finish.</p>\n<p>A run streams as a sequence of events, so you watch it unfold live:</p>\n<ul>\n<li><strong><code>run_started</code></strong> — the agent picked up the task.</li>\n<li><strong><code>model_response</code></strong> — the model produced output. If it decided to use tools, this event lists the tool calls it wants.</li>\n<li><strong><code>tool_call</code></strong> — the agent is invoking a specific tool with specific arguments.</li>\n<li><strong><code>tool_result</code></strong> — what the tool returned, fed back to the model.</li>\n<li><strong><code>done</code></strong> — the run finished.</li>\n</ul>\n<p>Because every step is recorded in order, a run is an <strong>audit trail</strong>. You can see not just what the agent concluded, but how — which tools it reached for, what they returned, and how that changed its answer. That’s the point of Pumkin: nothing the agent does is hidden.</p>\n<h2 id=\"a-thread\">A thread</h2>\n<p>A single run is one task. A <strong>thread</strong> is a conversation — multiple turns where the agent remembers what came before. Ask a follow-up and the agent has the context of everything earlier in the thread, so you can refine, drill in, or build on previous answers without re-explaining.</p>\n<p>Use a new thread when you start something unrelated. Stay in a thread when you’re iterating on the same problem.</p>\n<h2 id=\"everything-is-saved-locally\">Everything is saved locally</h2>\n<p>Runs and threads are stored in Pumkin’s local database under <code>%LOCALAPPDATA%\\Pumkin\\</code>. They don’t expire and they never leave your machine. Come back days later and your history is intact — useful for picking up where you left off, and for going back to see exactly what an agent did on some earlier task.</p>\n<h2 id=\"reading-a-run-for-debugging\">Reading a run for debugging</h2>\n<p>When an agent does something surprising, the run tells you why. Walk the events in order:</p>\n<ul>\n<li>Did it call the tool you expected? Check the <code>tool_call</code> event and its arguments.</li>\n<li>Did the tool return what you expected? Check the <code>tool_result</code>.</li>\n<li>Did the model misread the result? Compare the <code>tool_result</code> to the <code>model_response</code> that followed.</li>\n</ul>\n<p>Most “the agent did the wrong thing” moments come down to a vague system prompt or a tool returning something unexpected — and the run makes both visible.</p>\n<p>Stuck on something? See <a href=\"/docs/troubleshooting/\">Troubleshooting →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Runs & threads","description":"Understand runs, the event stream, and multi-turn threads."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/runs-and-threads.md";
				const url = "/docs/runs-and-threads";
				function rawContent() {
					return "   \n                                      \n                     \n                                                                       \n   \n\nTwo concepts shape how you work in Pumkin: **runs** and **threads**. Once they click, the whole app makes sense.\n\n## A run\n\nA **run** is one complete execution of an agent on a task. You give the agent something to do, it works, and the run captures everything that happened — start to finish.\n\nA run streams as a sequence of events, so you watch it unfold live:\n\n- **`run_started`** — the agent picked up the task.\n- **`model_response`** — the model produced output. If it decided to use tools, this event lists the tool calls it wants.\n- **`tool_call`** — the agent is invoking a specific tool with specific arguments.\n- **`tool_result`** — what the tool returned, fed back to the model.\n- **`done`** — the run finished.\n\nBecause every step is recorded in order, a run is an **audit trail**. You can see not just what the agent concluded, but how — which tools it reached for, what they returned, and how that changed its answer. That's the point of Pumkin: nothing the agent does is hidden.\n\n## A thread\n\nA single run is one task. A **thread** is a conversation — multiple turns where the agent remembers what came before. Ask a follow-up and the agent has the context of everything earlier in the thread, so you can refine, drill in, or build on previous answers without re-explaining.\n\nUse a new thread when you start something unrelated. Stay in a thread when you're iterating on the same problem.\n\n## Everything is saved locally\n\nRuns and threads are stored in Pumkin's local database under `%LOCALAPPDATA%\\Pumkin\\`. They don't expire and they never leave your machine. Come back days later and your history is intact — useful for picking up where you left off, and for going back to see exactly what an agent did on some earlier task.\n\n## Reading a run for debugging\n\nWhen an agent does something surprising, the run tells you why. Walk the events in order:\n\n- Did it call the tool you expected? Check the `tool_call` event and its arguments.\n- Did the tool return what you expected? Check the `tool_result`.\n- Did the model misread the result? Compare the `tool_result` to the `model_response` that followed.\n\nMost \"the agent did the wrong thing\" moments come down to a vague system prompt or a tool returning something unexpected — and the run makes both visible.\n\nStuck on something? See [Troubleshooting →](/docs/troubleshooting/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"a-run","text":"A run"},{"depth":2,"slug":"a-thread","text":"A thread"},{"depth":2,"slug":"everything-is-saved-locally","text":"Everything is saved locally"},{"depth":2,"slug":"reading-a-run-for-debugging","text":"Reading a run for debugging"}];
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
