import { s as supabaseAdmin } from '../../chunks/supabase_CueFHQe0.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const TOTAL = 50;
const GET = async () => {
  const headers = {
    "content-type": "application/json",
    "cache-control": "no-store, max-age=0"
  };
  try {
    const { data, error } = await supabaseAdmin.rpc("pumkin_remaining_founding_slots");
    if (error) throw error;
    const raw = Number(data ?? TOTAL);
    const remaining = Math.max(0, Math.min(TOTAL, Number.isFinite(raw) ? raw : TOTAL));
    return new Response(
      JSON.stringify({ remaining, total: TOTAL, sold: TOTAL - remaining }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ remaining: TOTAL, total: TOTAL, sold: 0 }),
      { status: 200, headers }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
