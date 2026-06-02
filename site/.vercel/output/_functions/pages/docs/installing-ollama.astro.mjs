import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>Pumkin doesn’t ship a model — it uses whatever models you’ve pulled into <strong>Ollama</strong>, running locally. This keeps the app small and lets you swap models freely. You install Ollama once, pull at least one model, and you’re set.</p>\n<h2 id=\"1-install-ollama\">1. Install Ollama</h2>\n<p>Download Ollama from <a href=\"https://ollama.com\">ollama.com</a> and run the installer. On Windows it installs as a background service that starts automatically and listens on <code>localhost:11434</code> — that’s the address Pumkin talks to.</p>\n<p>You don’t need to open or configure anything. Once installed, Ollama runs quietly in the background.</p>\n<blockquote>\n<p><strong>Check it’s running:</strong> open a terminal and run <code>ollama list</code>. If it responds (even with an empty list), Ollama is up. If the command isn’t found, restart after install or check that the Ollama service started.</p>\n</blockquote>\n<h2 id=\"2-pull-a-model\">2. Pull a model</h2>\n<p>In a terminal, pull a model. Start with this one:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>ollama pull llama3.2:3b</span></span></code></pre>\n<p>That downloads Llama 3.2 (3 billion parameters) — about 2 GB. It’s the model Pumkin is tuned and tested against, and it runs comfortably on modest hardware while still handling tool calls well.</p>\n<p>To confirm it landed:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>ollama list</span></span></code></pre>\n<p>You should see <code>llama3.2:3b</code> in the list. That’s all Pumkin needs.</p>\n<h2 id=\"3-pick-a-model-that-fits-your-machine\">3. Pick a model that fits your machine</h2>\n<p>This is the part people get wrong, so read it. Bigger models are smarter but need far more memory. If you pick one too large for your RAM, it either crawls or fails to load.</p>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Your RAM</th><th>Recommended</th><th>Notes</th></tr></thead><tbody><tr><td>8 GB</td><td><code>llama3.2:3b</code></td><td>The sweet spot. Fast, reliable tool calls, the tested default.</td></tr><tr><td>16 GB</td><td><code>llama3.2:3b</code> or an 7–8B model</td><td>You have headroom to experiment with larger models.</td></tr><tr><td>32 GB+</td><td>Larger models if you want</td><td>Quality goes up, speed goes down. Try and compare.</td></tr></tbody></table>\n<blockquote>\n<p><strong>8 GB is the practical floor.</strong> On an 8 GB machine, <code>llama3.2:3b</code> is the model to use. Larger models like 7–8B (e.g. <code>qwen3:8b</code>) are effectively unusable there — they’ll swap to disk and grind. If you only have 8 GB, stick with <code>llama3.2:3b</code> and you’ll have a good experience.</p>\n</blockquote>\n<h2 id=\"which-model-is-best\">Which model is “best”?</h2>\n<p>For Pumkin’s agent workflows, “best” means <em>reliably calls tools and follows instructions</em>, not <em>scores highest on a benchmark</em>. <code>llama3.2:3b</code> is a strong default because it does the agent loop well at a size almost any machine can run. Once you’re comfortable, pull others and compare — switching models in Pumkin is just a dropdown.</p>\n<h2 id=\"keep-ollama-running\">Keep Ollama running</h2>\n<p>Pumkin needs Ollama alive to do anything. On Windows it auto-starts with the system, so this usually takes care of itself. If Pumkin ever says it can’t reach a model, the first thing to check is whether Ollama is running — see <a href=\"/docs/troubleshooting/\">Troubleshooting</a>.</p>\n<p>Next: <a href=\"/docs/install-pumkin/\">Install Pumkin →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Install Ollama & models","description":"Install Ollama, pull a model, and pick one that fits your hardware."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/installing-ollama.md";
				const url = "/docs/installing-ollama";
				function rawContent() {
					return "   \n                                      \n                              \n                                                                                \n   \n\nPumkin doesn't ship a model — it uses whatever models you've pulled into **Ollama**, running locally. This keeps the app small and lets you swap models freely. You install Ollama once, pull at least one model, and you're set.\n\n## 1. Install Ollama\n\nDownload Ollama from [ollama.com](https://ollama.com) and run the installer. On Windows it installs as a background service that starts automatically and listens on `localhost:11434` — that's the address Pumkin talks to.\n\nYou don't need to open or configure anything. Once installed, Ollama runs quietly in the background.\n\n> **Check it's running:** open a terminal and run `ollama list`. If it responds (even with an empty list), Ollama is up. If the command isn't found, restart after install or check that the Ollama service started.\n\n## 2. Pull a model\n\nIn a terminal, pull a model. Start with this one:\n\n```\nollama pull llama3.2:3b\n```\n\nThat downloads Llama 3.2 (3 billion parameters) — about 2 GB. It's the model Pumkin is tuned and tested against, and it runs comfortably on modest hardware while still handling tool calls well.\n\nTo confirm it landed:\n\n```\nollama list\n```\n\nYou should see `llama3.2:3b` in the list. That's all Pumkin needs.\n\n## 3. Pick a model that fits your machine\n\nThis is the part people get wrong, so read it. Bigger models are smarter but need far more memory. If you pick one too large for your RAM, it either crawls or fails to load.\n\n| Your RAM | Recommended | Notes |\n|---|---|---|\n| 8 GB | `llama3.2:3b` | The sweet spot. Fast, reliable tool calls, the tested default. |\n| 16 GB | `llama3.2:3b` or an 7–8B model | You have headroom to experiment with larger models. |\n| 32 GB+ | Larger models if you want | Quality goes up, speed goes down. Try and compare. |\n\n> **8 GB is the practical floor.** On an 8 GB machine, `llama3.2:3b` is the model to use. Larger models like 7–8B (e.g. `qwen3:8b`) are effectively unusable there — they'll swap to disk and grind. If you only have 8 GB, stick with `llama3.2:3b` and you'll have a good experience.\n\n## Which model is \"best\"?\n\nFor Pumkin's agent workflows, \"best\" means *reliably calls tools and follows instructions*, not *scores highest on a benchmark*. `llama3.2:3b` is a strong default because it does the agent loop well at a size almost any machine can run. Once you're comfortable, pull others and compare — switching models in Pumkin is just a dropdown.\n\n## Keep Ollama running\n\nPumkin needs Ollama alive to do anything. On Windows it auto-starts with the system, so this usually takes care of itself. If Pumkin ever says it can't reach a model, the first thing to check is whether Ollama is running — see [Troubleshooting](/docs/troubleshooting/).\n\nNext: [Install Pumkin →](/docs/install-pumkin/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-install-ollama","text":"1. Install Ollama"},{"depth":2,"slug":"2-pull-a-model","text":"2. Pull a model"},{"depth":2,"slug":"3-pick-a-model-that-fits-your-machine","text":"3. Pick a model that fits your machine"},{"depth":2,"slug":"which-model-is-best","text":"Which model is “best”?"},{"depth":2,"slug":"keep-ollama-running","text":"Keep Ollama running"}];
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
