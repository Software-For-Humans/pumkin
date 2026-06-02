import { s as supabaseAdmin } from '../../../chunks/supabase_CueFHQe0.mjs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export { renderers } from '../../../renderers.mjs';

const region = "fra1";
const bucket = "pumkin-releases";
{
  console.warn("[pumkin] DO_SPACES_KEY / DO_SPACES_SECRET missing");
}
const client = new S3Client({
  region,
  endpoint: `https://${region}.digitaloceanspaces.com`,
  credentials: {
    accessKeyId: "",
    secretAccessKey: ""
  },
  forcePathStyle: false
});
async function signedInstallerUrl(version, expiresInSeconds = 600) {
  const key = `releases/Pumkin_${version}_x64-setup.exe`;
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
}

const prerender = false;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const GET = async ({ params }) => {
  const token = params.token;
  if (!token || !UUID_RE.test(token)) {
    return new Response("Invalid download link", { status: 400 });
  }
  const { data: order, error } = await supabaseAdmin.from("pumkin_orders").select("id, status, version, download_count, first_dl_at").eq("download_token", token).maybeSingle();
  if (error) {
    return new Response("Lookup failed — try again or email hi@pumkin.app", { status: 500 });
  }
  if (!order) {
    return new Response(
      "This download link isn't valid. If you've bought Pumkin, check your welcome email or contact hi@pumkin.app.",
      { status: 404 }
    );
  }
  if (order.status === "refunded") {
    return new Response(
      "This order was refunded. The download link is no longer active.",
      { status: 403 }
    );
  }
  if (order.status === "disputed") {
    return new Response(
      "This order is under dispute. Contact hi@pumkin.app to resolve.",
      { status: 403 }
    );
  }
  if (order.status !== "paid") {
    return new Response("Order not active.", { status: 403 });
  }
  let signedUrl;
  try {
    signedUrl = await signedInstallerUrl(order.version, 600);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[pumkin] Failed to sign installer URL:", msg);
    return new Response(
      "Couldn't generate download right now. Try again in a minute, or email hi@pumkin.app.",
      { status: 500 }
    );
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  void supabaseAdmin.from("pumkin_orders").update({
    download_count: order.download_count + 1,
    first_dl_at: order.first_dl_at ?? now,
    last_dl_at: now
  }).eq("id", order.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: signedUrl,
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
