import { s as supabaseAdmin } from '../../../chunks/supabase_CueFHQe0.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ params }) => {
  const sessionId = params.session_id;
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return new Response(JSON.stringify({ error: "Invalid session id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { data, error } = await supabaseAdmin.from("pumkin_orders").select("download_token, founding_no, version, status, email_sent_at, created_at").eq("stripe_session", sessionId).maybeSingle();
  if (error) {
    return new Response(JSON.stringify({ error: "Lookup failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!data) {
    return new Response(JSON.stringify({ status: "pending" }), {
      status: 202,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(
    JSON.stringify({
      status: data.status,
      version: data.version,
      founding_no: data.founding_no,
      download_url: `/api/download/${data.download_token}`,
      email_sent: !!data.email_sent_at
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
