import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>Most problems come down to one of three things: Ollama isn’t running, the model is too big for your RAM, or Windows is being cautious. Here’s how to clear each.</p>\n<h2 id=\"no-models--pumkin-cant-reach-a-model\">”No models” / Pumkin can’t reach a model</h2>\n<p>Pumkin needs Ollama running to do anything. If it reports no models or can’t connect:</p>\n<ol>\n<li><strong>Check Ollama is running.</strong> Open a terminal and run <code>ollama list</code>. If it doesn’t respond, Ollama isn’t up.</li>\n<li><strong>Start it.</strong> On Windows, Ollama runs as a service that auto-starts — restarting your machine usually brings it back. You can also relaunch Ollama from the Start menu.</li>\n<li><strong>Confirm you’ve pulled a model.</strong> <code>ollama list</code> should show at least <code>llama3.2:3b</code>. If it’s empty, run <code>ollama pull llama3.2:3b</code>.</li>\n<li><strong>Restart Pumkin</strong> after Ollama is confirmed running, so it re-checks the connection.</li>\n</ol>\n<h2 id=\"the-model-is-painfully-slow-or-wont-load\">The model is painfully slow or won’t load</h2>\n<p>Almost always a memory problem — the model is too large for your RAM.</p>\n<ul>\n<li>On <strong>8 GB</strong>, use <code>llama3.2:3b</code>. Larger 7–8B models (like <code>qwen3:8b</code>) will swap to disk and become unusable. This isn’t a bug; it’s physics.</li>\n<li>Close other memory-hungry apps (browsers with many tabs are the usual culprit).</li>\n<li>If you pulled a big model to try it and it’s grinding, switch the agent’s model back to <code>llama3.2:3b</code> in the dropdown.</li>\n</ul>\n<p>See <a href=\"/docs/installing-ollama/\">Install Ollama &#x26; models</a> for the RAM-to-model guide.</p>\n<h2 id=\"windows-protected-your-pc-on-launch\">”Windows protected your PC” on launch</h2>\n<p>This SmartScreen warning appears because Pumkin isn’t code-signed yet (a paid certificate is on the roadmap). It’s expected and harmless for the installer you got from your purchase link.</p>\n<ul>\n<li>Click <strong>More info</strong> → <strong>Run anyway</strong>.</li>\n</ul>\n<h2 id=\"the-download-link-isnt-working\">The download link isn’t working</h2>\n<ul>\n<li>The link is tied to your purchase — use the one from your <strong>welcome email</strong>.</li>\n<li>If the file is gone, the same link re-downloads it.</li>\n<li>Still stuck? Email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong> with the address you bought with and I’ll resend.</li>\n</ul>\n<h2 id=\"the-desktop-shortcut-icon-looks-generic\">The desktop shortcut icon looks generic</h2>\n<p>A cosmetic Windows icon-cache quirk that sometimes shows a stale icon on the shortcut even though the app itself is fine. It doesn’t affect anything. Signing out and back in (or a restart) clears the cache. Safe to ignore.</p>\n<h2 id=\"an-agent-did-something-unexpected\">An agent did something unexpected</h2>\n<p>Open the run and read the events in order — the <code>tool_call</code>, <code>tool_result</code>, and following <code>model_response</code> usually reveal the cause. Most often it’s a vague system prompt or a tool returning something the model misread. See <a href=\"/docs/runs-and-threads/\">Runs &#x26; threads</a> for how to read a run.</p>\n<h2 id=\"where-the-logs-are\">Where the logs are</h2>\n<p>If you need to dig deeper, Pumkin’s data and logs live under:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>%LOCALAPPDATA%\\Pumkin\\</span></span></code></pre>\n<p>When you email support about a bug, mentioning what the run showed (or attaching what’s in that folder) gets us to an answer faster.</p>\n<h2 id=\"still-stuck\">Still stuck?</h2>\n<p>Email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong>. One founder, real support — describe what you did, what you expected, and what happened, and I’ll get back to you, usually within a day.</p>\n<p>More questions? See the <a href=\"/docs/faq/\">FAQ →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Troubleshooting","description":"Fixes for the most common Pumkin issues."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/troubleshooting.md";
				const url = "/docs/troubleshooting";
				function rawContent() {
					return "   \n                                      \n                      \n                                                     \n   \n\nMost problems come down to one of three things: Ollama isn't running, the model is too big for your RAM, or Windows is being cautious. Here's how to clear each.\n\n## \"No models\" / Pumkin can't reach a model\n\nPumkin needs Ollama running to do anything. If it reports no models or can't connect:\n\n1. **Check Ollama is running.** Open a terminal and run `ollama list`. If it doesn't respond, Ollama isn't up.\n2. **Start it.** On Windows, Ollama runs as a service that auto-starts — restarting your machine usually brings it back. You can also relaunch Ollama from the Start menu.\n3. **Confirm you've pulled a model.** `ollama list` should show at least `llama3.2:3b`. If it's empty, run `ollama pull llama3.2:3b`.\n4. **Restart Pumkin** after Ollama is confirmed running, so it re-checks the connection.\n\n## The model is painfully slow or won't load\n\nAlmost always a memory problem — the model is too large for your RAM.\n\n- On **8 GB**, use `llama3.2:3b`. Larger 7–8B models (like `qwen3:8b`) will swap to disk and become unusable. This isn't a bug; it's physics.\n- Close other memory-hungry apps (browsers with many tabs are the usual culprit).\n- If you pulled a big model to try it and it's grinding, switch the agent's model back to `llama3.2:3b` in the dropdown.\n\nSee [Install Ollama & models](/docs/installing-ollama/) for the RAM-to-model guide.\n\n## \"Windows protected your PC\" on launch\n\nThis SmartScreen warning appears because Pumkin isn't code-signed yet (a paid certificate is on the roadmap). It's expected and harmless for the installer you got from your purchase link.\n\n- Click **More info** → **Run anyway**.\n\n## The download link isn't working\n\n- The link is tied to your purchase — use the one from your **welcome email**.\n- If the file is gone, the same link re-downloads it.\n- Still stuck? Email **hi@pumkin.app** with the address you bought with and I'll resend.\n\n## The desktop shortcut icon looks generic\n\nA cosmetic Windows icon-cache quirk that sometimes shows a stale icon on the shortcut even though the app itself is fine. It doesn't affect anything. Signing out and back in (or a restart) clears the cache. Safe to ignore.\n\n## An agent did something unexpected\n\nOpen the run and read the events in order — the `tool_call`, `tool_result`, and following `model_response` usually reveal the cause. Most often it's a vague system prompt or a tool returning something the model misread. See [Runs & threads](/docs/runs-and-threads/) for how to read a run.\n\n## Where the logs are\n\nIf you need to dig deeper, Pumkin's data and logs live under:\n\n```\n%LOCALAPPDATA%\\Pumkin\\\n```\n\nWhen you email support about a bug, mentioning what the run showed (or attaching what's in that folder) gets us to an answer faster.\n\n## Still stuck?\n\nEmail **hi@pumkin.app**. One founder, real support — describe what you did, what you expected, and what happened, and I'll get back to you, usually within a day.\n\nMore questions? See the [FAQ →](/docs/faq/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"no-models--pumkin-cant-reach-a-model","text":"”No models” / Pumkin can’t reach a model"},{"depth":2,"slug":"the-model-is-painfully-slow-or-wont-load","text":"The model is painfully slow or won’t load"},{"depth":2,"slug":"windows-protected-your-pc-on-launch","text":"”Windows protected your PC” on launch"},{"depth":2,"slug":"the-download-link-isnt-working","text":"The download link isn’t working"},{"depth":2,"slug":"the-desktop-shortcut-icon-looks-generic","text":"The desktop shortcut icon looks generic"},{"depth":2,"slug":"an-agent-did-something-unexpected","text":"An agent did something unexpected"},{"depth":2,"slug":"where-the-logs-are","text":"Where the logs are"},{"depth":2,"slug":"still-stuck","text":"Still stuck?"}];
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
