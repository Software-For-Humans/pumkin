import { a2 as createAstro, a3 as createComponent, am as renderTemplate, ak as renderSlot, ag as renderHead, aq as unescapeHTML, $ as addAttribute } from './astro/server_CNxwod6g.mjs';
import 'piccolore';
import 'clsx';
/* empty css                       */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://pumkin.app");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = "Pumkin — local AI agents for developers",
    description = "Build, run, and audit AI agents on your own machine. Pumkin uses your local Ollama and your own MCP tools. No cloud, no API keys, no recurring fees.",
    canonical,
    noindex = false,
    jsonLd
  } = Astro2.props;
  const ogImage = "/og.png";
  const canonicalURL = canonical ?? new URL(Astro2.url.pathname, Astro2.site).href;
  const ogImageURL = new URL(ogImage, Astro2.site).href;
  const gscToken = undefined                                       ;
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Pumkin",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Windows",
        description: "A local-first desktop agent IDE. Build, run, and audit AI agents on your own machine using your local Ollama models and your own MCP tools.",
        url: "https://pumkin.app",
        offers: {
          "@type": "Offer",
          price: "99",
          priceCurrency: "USD",
          description: "Founding license — lifetime updates, all platforms."
        },
        publisher: {
          "@type": "Organization",
          name: "Software For Humans",
          url: "https://swforhumans.com"
        }
      }
    ]
  };
  const structuredData = jsonLd ?? defaultJsonLd;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png"><link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png"><title>', '</title><meta name="description"', '><link rel="canonical"', ">", "", '<!-- OG / Twitter --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Pumkin"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Theme color matches brand ink --><meta name="theme-color" content="#b5ddb5"><!-- Structured data for rich results --><script type="application/ld+json">', "</script><!-- Optional head injection from individual pages (e.g., noindex meta) -->", "", "</head> <body> ", " </body></html>"])), title, addAttribute(description, "content"), addAttribute(canonicalURL, "href"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, gscToken, addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImageURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImageURL, "content"), unescapeHTML(JSON.stringify(structuredData)), renderSlot($$result, $$slots["head"]), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/llabr/Downloads/agentkit/site/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
