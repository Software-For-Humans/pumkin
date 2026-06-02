import { a2 as createAstro, a3 as createComponent, $ as addAttribute, ag as renderHead, ae as renderComponent, am as renderTemplate, ak as renderSlot } from './astro/server_CNxwod6g.mjs';
import 'piccolore';
/* empty css                       */
import { a as $$Header, $ as $$Footer } from './Footer_orz74jQI.mjs';
/* empty css                       */

const $$Astro = createAstro("https://pumkin.app");
const $$DocsLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DocsLayout;
  const fm = Astro2.props.frontmatter ?? {};
  const title = fm.title ?? Astro2.props.title ?? "Docs";
  const description = fm.description ?? Astro2.props.description ?? "How to install and use Pumkin.";
  const NAV = [
    {
      group: "Getting started",
      items: [
        { label: "Overview", href: "/docs/" },
        { label: "Install Ollama & models", href: "/docs/installing-ollama/" },
        { label: "Install Pumkin", href: "/docs/install-pumkin/" }
      ]
    },
    {
      group: "Using Pumkin",
      items: [
        { label: "Your first agent", href: "/docs/first-agent/" },
        { label: "MCP tools", href: "/docs/mcp-tools/" },
        { label: "Runs & threads", href: "/docs/runs-and-threads/" }
      ]
    },
    {
      group: "Help",
      items: [
        { label: "Troubleshooting", href: "/docs/troubleshooting/" },
        { label: "FAQ", href: "/docs/faq/" }
      ]
    }
  ];
  const current = Astro2.url.pathname.replace(/\/+$/, "/") || "/";
  const isActive = (href) => current === href || current === href.replace(/\/$/, "");
  const pageTitle = `${title} \xB7 Pumkin Docs`;
  return renderTemplate`<html lang="en" data-astro-cid-mw7aashj> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><title>${pageTitle}</title><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#b5ddb5"><meta property="og:type" content="article"><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image" content="/og.png">${renderHead()}</head> <body data-astro-cid-mw7aashj> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-mw7aashj": true })} <div class="docs-shell container" data-astro-cid-mw7aashj> <aside class="docs-sidebar" data-astro-cid-mw7aashj> <nav class="docs-nav" aria-label="Documentation" data-astro-cid-mw7aashj> ${NAV.map((section) => renderTemplate`<div class="nav-group" data-astro-cid-mw7aashj> <p class="nav-group-title" data-astro-cid-mw7aashj>${section.group}</p> <ul data-astro-cid-mw7aashj> ${section.items.map((item) => renderTemplate`<li data-astro-cid-mw7aashj> <a${addAttribute(item.href, "href")}${addAttribute(["nav-link", { active: isActive(item.href) }], "class:list")}${addAttribute(isActive(item.href) ? "page" : void 0, "aria-current")} data-astro-cid-mw7aashj> ${item.label} </a> </li>`)} </ul> </div>`)} <div class="nav-group nav-help" data-astro-cid-mw7aashj> <p class="nav-group-title" data-astro-cid-mw7aashj>Stuck?</p> <p class="nav-help-text" data-astro-cid-mw7aashj>
Email <a href="mailto:hi@pumkin.app" data-astro-cid-mw7aashj>hi@pumkin.app</a> — one founder, real
              answers, usually within a day.
</p> </div> </nav> </aside> <main class="docs-main" data-astro-cid-mw7aashj> <article class="prose docs-prose" data-astro-cid-mw7aashj> <h1 data-astro-cid-mw7aashj>${title}</h1> ${renderSlot($$result, $$slots["default"])} </article> </main> </div> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-mw7aashj": true })}  </body> </html>`;
}, "C:/Users/llabr/Downloads/agentkit/site/src/layouts/DocsLayout.astro", void 0);

export { $$DocsLayout as $ };
