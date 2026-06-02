import { a2 as createAstro, a3 as createComponent, ae as renderComponent, am as renderTemplate, l as Fragment, ab as maybeRenderHead, $ as addAttribute } from '../chunks/astro/server_CNxwod6g.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_C5TaJR3P.mjs';
import { a as $$Header, $ as $$Footer } from '../chunks/Footer_orz74jQI.mjs';
import { s as supabaseAdmin } from '../chunks/supabase_CueFHQe0.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://pumkin.app");
const prerender = false;
const $$ThankYou = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ThankYou;
  const sessionId = Astro2.url.searchParams.get("session_id");
  let order = null;
  let lookupState = "missing";
  if (sessionId) {
    if (!sessionId.startsWith("cs_")) {
      lookupState = "invalid";
    } else {
      const { data } = await supabaseAdmin.from("pumkin_orders").select("download_token, founding_no, version, status, email_sent_at").eq("stripe_session", sessionId).maybeSingle();
      if (!data) {
        lookupState = "pending";
      } else if (data.status !== "paid") {
        lookupState = "invalid";
      } else {
        lookupState = "ok";
        order = {
          download_url: `/api/download/${data.download_token}`,
          founding_no: data.founding_no,
          version: data.version,
          email_sent: !!data.email_sent_at
        };
      }
    }
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Pumkin \u2014 Download", "description": "Thanks for buying Pumkin. Download the installer and get started.", "data-astro-cid-reykoxrt": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-reykoxrt": true })} ${maybeRenderHead()}<main data-astro-cid-reykoxrt> ${lookupState === "ok" && order && renderTemplate`<section class="thanks" data-astro-cid-reykoxrt> <div class="container" data-astro-cid-reykoxrt> <div class="thanks-card panel" data-astro-cid-reykoxrt> <img src="/mascot.png" alt="" class="pixel thanks-mascot" width="160" height="160" data-astro-cid-reykoxrt> <span class="eyebrow-thanks" data-astro-cid-reykoxrt> ${order.founding_no ? `founding member \xB7 #${order.founding_no} of 50` : `welcome`} </span> <h1 data-astro-cid-reykoxrt>You're in.</h1> <p class="lead" data-astro-cid-reykoxrt>
Thanks for buying Pumkin. Your founding license is good for
              lifetime updates on every platform we ship, forever.
</p> <a${addAttribute(order.download_url, "href")} class="btn btn-primary btn-download" data-astro-cid-reykoxrt>
↓ Download Pumkin for Windows (v${order.version})
</a> <p class="dl-meta faint" data-astro-cid-reykoxrt>
About 35 MB · NSIS installer · macOS & Linux builds will be
              emailed when they ship.
</p> ${order.email_sent && renderTemplate`<p class="dl-meta faint" data-astro-cid-reykoxrt>
We also emailed your download link in case you want it on
                another machine.
</p>`} </div> </div> </section>`} ${lookupState === "pending" && renderTemplate`<section class="thanks" data-astro-cid-reykoxrt> <div class="container" data-astro-cid-reykoxrt> <div class="thanks-card panel" data-astro-cid-reykoxrt> <img src="/mascot.png" alt="" class="pixel thanks-mascot" width="160" height="160" data-astro-cid-reykoxrt> <h1 data-astro-cid-reykoxrt>Almost there.</h1> <p class="lead" data-astro-cid-reykoxrt>
Stripe confirmed your payment, but we haven't finished processing
              yet. This usually takes a few seconds. Refresh this page in
              about 30 seconds, or check your email for a welcome message with
              your download link.
</p> <a${addAttribute(Astro2.url.pathname + Astro2.url.search, "href")} class="btn btn-primary btn-download" data-astro-cid-reykoxrt>
↻ Refresh
</a> <p class="dl-meta faint" data-astro-cid-reykoxrt>
If it's been more than a minute and your email hasn't arrived,
              reach out at <a href="mailto:hi@pumkin.app" data-astro-cid-reykoxrt>hi@pumkin.app</a> with
              your receipt number and we'll get you sorted.
</p> </div> </div> </section>`} ${(lookupState === "invalid" || lookupState === "missing") && renderTemplate`<section class="thanks" data-astro-cid-reykoxrt> <div class="container" data-astro-cid-reykoxrt> <div class="thanks-card panel" data-astro-cid-reykoxrt> <img src="/mascot.png" alt="" class="pixel thanks-mascot" width="160" height="160" data-astro-cid-reykoxrt> <h1 data-astro-cid-reykoxrt>This page is for buyers.</h1> <p class="lead" data-astro-cid-reykoxrt>
If you've bought Pumkin, your download link was emailed directly
              and is also accessible from your Stripe receipt. Can't find it?
              Email <a href="mailto:hi@pumkin.app" data-astro-cid-reykoxrt>hi@pumkin.app</a> with the
              email address you used and I'll resend.
</p> <a href="/" class="btn btn-secondary btn-download" data-astro-cid-reykoxrt>← Back to pumkin.app</a> </div> </div> </section>`} <section class="section quickstart" data-astro-cid-reykoxrt> <div class="container prose" data-astro-cid-reykoxrt> <h2 data-astro-cid-reykoxrt>Quick start.</h2> <p class="muted" data-astro-cid-reykoxrt>
You need <a href="https://ollama.com/download" rel="noopener" data-astro-cid-reykoxrt>Ollama</a>
installed and at least one model pulled.
</p> <ol class="steps" data-astro-cid-reykoxrt> <li data-astro-cid-reykoxrt> <strong data-astro-cid-reykoxrt>Install Ollama.</strong> Download from
<a href="https://ollama.com/download" rel="noopener" data-astro-cid-reykoxrt>ollama.com</a>,
            run the installer. Ollama lives on localhost:11434.
</li> <li data-astro-cid-reykoxrt> <strong data-astro-cid-reykoxrt>Pull a model.</strong> Open a terminal and run:
<pre class="terminal-inline" data-astro-cid-reykoxrt>ollama pull llama3.2:3b</pre>
Pumkin lists all installed Ollama models in the agent picker.
</li> <li data-astro-cid-reykoxrt> <strong data-astro-cid-reykoxrt>Run the Pumkin installer.</strong> Double-click the .exe
            you just downloaded. Windows may show a SmartScreen warning
            ("unknown publisher") — click "More info" → "Run anyway." Code
            signing is on the roadmap.
</li> <li data-astro-cid-reykoxrt> <strong data-astro-cid-reykoxrt>Launch Pumkin.</strong> From the Start menu. First run
            shows a welcome screen and prompts you to create your first agent.
</li> </ol> </div> </section> <section class="section help" data-astro-cid-reykoxrt> <div class="container prose" data-astro-cid-reykoxrt> <h2 data-astro-cid-reykoxrt>Need help?</h2> <p class="muted" data-astro-cid-reykoxrt>
One human runs Pumkin. Email
<a href="mailto:hi@pumkin.app" data-astro-cid-reykoxrt>hi@pumkin.app</a> with anything —
          install issues, bug reports, feature requests, refund requests, "what
          model should I use for X." Replies usually within 24 hours.
</p> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-reykoxrt": true })} `, "head": async ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": async ($$result3) => renderTemplate` <meta name="robots" content="noindex, nofollow"> ` })}` })} `;
}, "C:/Users/llabr/Downloads/agentkit/site/src/pages/thank-you.astro", void 0);

const $$file = "C:/Users/llabr/Downloads/agentkit/site/src/pages/thank-you.astro";
const $$url = "/thank-you";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ThankYou,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
