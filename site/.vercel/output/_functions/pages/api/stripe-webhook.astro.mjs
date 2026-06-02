import Stripe from 'stripe';
import '../../chunks/supabase_CueFHQe0.mjs';
import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

{
  console.warn("[pumkin] RESEND_API_KEY missing — emails will fail at send time");
}
new Resend("");

const prerender = false;
new Stripe("", {
  apiVersion: "2024-12-18.acacia"
});
const POST = async ({ request }) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }
  {
    console.error("[pumkin] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook not configured", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
