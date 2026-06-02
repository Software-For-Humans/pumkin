import { a3 as createComponent, ae as renderComponent, am as renderTemplate, aq as unescapeHTML } from '../../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$DocsLayout } from '../../chunks/DocsLayout_DyAe5pK1.mjs';
export { renderers } from '../../renderers.mjs';

const html = () => "<p>After you buy Pumkin you get a download link by email (and on the confirmation page). It’s a single Windows installer — no dependencies to chase, the runtime it needs is bundled in.</p>\n<h2 id=\"1-download\">1. Download</h2>\n<p>Click the download link from your welcome email. You’ll get a file named like:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>Pumkin_0.0.1_x64-setup.exe</span></span></code></pre>\n<p>The link is tied to your purchase, so keep the email. If you ever lose the file, the same link re-downloads it — or email <strong><a href=\"mailto:hi@pumkin.app\">hi@pumkin.app</a></strong> with the address you bought with and I’ll resend.</p>\n<h2 id=\"2-run-the-installer\">2. Run the installer</h2>\n<p>Double-click the <code>.exe</code>. Windows will install Pumkin and drop a shortcut in your Start menu and on your desktop.</p>\n<h3 id=\"getting-past-the-smartscreen-warning\">Getting past the SmartScreen warning</h3>\n<p>The first time you run it, Windows SmartScreen may show a blue <strong>“Windows protected your PC”</strong> dialog saying the publisher is unknown. This is expected — it appears for any app that isn’t yet code-signed with a paid certificate, not a sign anything’s wrong.</p>\n<p>To proceed:</p>\n<ol>\n<li>Click <strong>More info</strong></li>\n<li>Click <strong>Run anyway</strong></li>\n</ol>\n<blockquote>\n<p><strong>Why the warning?</strong> Code-signing certificates cost a few hundred dollars a year, and removing this prompt is on the roadmap funded by founding sales. Until then, the click-through is harmless. The installer you downloaded from your purchase link is the real thing.</p>\n</blockquote>\n<h2 id=\"3-first-launch\">3. First launch</h2>\n<p>Open Pumkin from the Start menu or desktop shortcut. On first launch it starts its local server and checks that it can reach Ollama.</p>\n<p>Make sure <strong>Ollama is running</strong> before or shortly after you launch (on Windows it auto-starts, so it usually already is). If Pumkin can’t find any models, it’s almost always because Ollama isn’t running or you haven’t pulled a model yet — go back to <a href=\"/docs/installing-ollama/\">Install Ollama &#x26; models</a>.</p>\n<h2 id=\"where-pumkin-keeps-its-files\">Where Pumkin keeps its files</h2>\n<p>Pumkin installs and stores its data under your local app data folder:</p>\n<pre class=\"astro-code github-dark\" style=\"background-color:#24292e;color:#e1e4e8; overflow-x: auto;\" tabindex=\"0\" data-language=\"plaintext\"><code><span class=\"line\"><span>%LOCALAPPDATA%\\Pumkin\\</span></span></code></pre>\n<p>That’s where the app lives and where your local database (runs, messages, tool history) is kept. Logs live here too, which matters if you ever need to debug something — see <a href=\"/docs/troubleshooting/\">Troubleshooting</a>.</p>\n<p>You’re installed. Next: <a href=\"/docs/first-agent/\">Your first agent →</a></p>";

				const frontmatter = {"layout":"../../layouts/DocsLayout.astro","title":"Install Pumkin","description":"Run the installer, get past SmartScreen, and launch Pumkin for the first time."};
				const file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/docs/install-pumkin.md";
				const url = "/docs/install-pumkin";
				function rawContent() {
					return "   \n                                      \n                     \n                                                                                           \n   \n\nAfter you buy Pumkin you get a download link by email (and on the confirmation page). It's a single Windows installer — no dependencies to chase, the runtime it needs is bundled in.\n\n## 1. Download\n\nClick the download link from your welcome email. You'll get a file named like:\n\n```\nPumkin_0.0.1_x64-setup.exe\n```\n\nThe link is tied to your purchase, so keep the email. If you ever lose the file, the same link re-downloads it — or email **hi@pumkin.app** with the address you bought with and I'll resend.\n\n## 2. Run the installer\n\nDouble-click the `.exe`. Windows will install Pumkin and drop a shortcut in your Start menu and on your desktop.\n\n### Getting past the SmartScreen warning\n\nThe first time you run it, Windows SmartScreen may show a blue **\"Windows protected your PC\"** dialog saying the publisher is unknown. This is expected — it appears for any app that isn't yet code-signed with a paid certificate, not a sign anything's wrong.\n\nTo proceed:\n\n1. Click **More info**\n2. Click **Run anyway**\n\n> **Why the warning?** Code-signing certificates cost a few hundred dollars a year, and removing this prompt is on the roadmap funded by founding sales. Until then, the click-through is harmless. The installer you downloaded from your purchase link is the real thing.\n\n## 3. First launch\n\nOpen Pumkin from the Start menu or desktop shortcut. On first launch it starts its local server and checks that it can reach Ollama.\n\nMake sure **Ollama is running** before or shortly after you launch (on Windows it auto-starts, so it usually already is). If Pumkin can't find any models, it's almost always because Ollama isn't running or you haven't pulled a model yet — go back to [Install Ollama & models](/docs/installing-ollama/).\n\n## Where Pumkin keeps its files\n\nPumkin installs and stores its data under your local app data folder:\n\n```\n%LOCALAPPDATA%\\Pumkin\\\n```\n\nThat's where the app lives and where your local database (runs, messages, tool history) is kept. Logs live here too, which matters if you ever need to debug something — see [Troubleshooting](/docs/troubleshooting/).\n\nYou're installed. Next: [Your first agent →](/docs/first-agent/)\n";
				}
				async function compiledContent() {
					return await html();
				}
				function getHeadings() {
					return [{"depth":2,"slug":"1-download","text":"1. Download"},{"depth":2,"slug":"2-run-the-installer","text":"2. Run the installer"},{"depth":3,"slug":"getting-past-the-smartscreen-warning","text":"Getting past the SmartScreen warning"},{"depth":2,"slug":"3-first-launch","text":"3. First launch"},{"depth":2,"slug":"where-pumkin-keeps-its-files","text":"Where Pumkin keeps its files"}];
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
