import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_RBMOkP4I.mjs';
import { manifest } from './manifest_CqQvIPk6.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/download/_token_.astro.mjs');
const _page2 = () => import('./pages/api/order/_session_id_.astro.mjs');
const _page3 = () => import('./pages/api/slots.astro.mjs');
const _page4 = () => import('./pages/api/stripe-webhook.astro.mjs');
const _page5 = () => import('./pages/brand.astro.mjs');
const _page6 = () => import('./pages/docs/faq.astro.mjs');
const _page7 = () => import('./pages/docs/first-agent.astro.mjs');
const _page8 = () => import('./pages/docs/install-pumkin.astro.mjs');
const _page9 = () => import('./pages/docs/installing-ollama.astro.mjs');
const _page10 = () => import('./pages/docs/mcp-tools.astro.mjs');
const _page11 = () => import('./pages/docs/runs-and-threads.astro.mjs');
const _page12 = () => import('./pages/docs/troubleshooting.astro.mjs');
const _page13 = () => import('./pages/docs.astro.mjs');
const _page14 = () => import('./pages/privacy.astro.mjs');
const _page15 = () => import('./pages/terms.astro.mjs');
const _page16 = () => import('./pages/thank-you.astro.mjs');
const _page17 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/download/[token].ts", _page1],
    ["src/pages/api/order/[session_id].ts", _page2],
    ["src/pages/api/slots.ts", _page3],
    ["src/pages/api/stripe-webhook.ts", _page4],
    ["src/pages/brand.astro", _page5],
    ["src/pages/docs/faq.md", _page6],
    ["src/pages/docs/first-agent.md", _page7],
    ["src/pages/docs/install-pumkin.md", _page8],
    ["src/pages/docs/installing-ollama.md", _page9],
    ["src/pages/docs/mcp-tools.md", _page10],
    ["src/pages/docs/runs-and-threads.md", _page11],
    ["src/pages/docs/troubleshooting.md", _page12],
    ["src/pages/docs/index.md", _page13],
    ["src/pages/privacy.astro", _page14],
    ["src/pages/terms.astro", _page15],
    ["src/pages/thank-you.astro", _page16],
    ["src/pages/index.astro", _page17]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "85977701-2adb-4ec5-b582-a62867ebe42c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
