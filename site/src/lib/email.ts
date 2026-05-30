// src/lib/email.ts
// Transactional email via Resend (https://resend.com).
//
// Pumkin uses one email today:
//   - welcome: sent on checkout.session.completed, contains the tokenized
//     download link. The Stripe webhook handler calls sendWelcomeEmail().

import { Resend } from "resend";
import type { PumkinOrder } from "./supabase";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.RESEND_FROM_EMAIL ?? "hi@pumkin.app";
const FROM_NAME = import.meta.env.RESEND_FROM_NAME ?? "Lew at Pumkin";
const SITE_URL = import.meta.env.SITE_URL ?? "https://pumkin.app";

if (!RESEND_API_KEY) {
  console.warn("[pumkin] RESEND_API_KEY missing — emails will fail at send time");
}

const resend = new Resend(RESEND_API_KEY ?? "");

/**
 * Welcome / download email. Sent immediately after Stripe confirms the
 * checkout session. Contains the tokenized download URL.
 */
export async function sendWelcomeEmail(order: PumkinOrder): Promise<void> {
  const downloadUrl = `${SITE_URL}/api/download/${order.download_token}`;
  const foundingLine = order.founding_no
    ? `You're founding member #${order.founding_no} of 50.`
    : `Thanks for buying Pumkin.`;

  const subject = `Welcome to Pumkin — your installer is ready`;

  const text = [
    `Thanks for buying Pumkin.`,
    ``,
    foundingLine,
    ``,
    `Your download link:`,
    downloadUrl,
    ``,
    `This link is personal to you. Don't share it — it's how I know you're a`,
    `licensed buyer. You can use it from any of your machines.`,
    ``,
    `Quick start:`,
    `  1. Install Ollama from https://ollama.com/download`,
    `  2. Pull a model:   ollama pull llama3.2:3b`,
    `  3. Run the Pumkin installer you just downloaded`,
    `  4. Launch Pumkin from the Start menu`,
    ``,
    `Need help? Just reply to this email. One human reads every message.`,
    ``,
    `Lew`,
    `Software For Humans · Vigo`,
    SITE_URL,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#B5DDB5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1F141F;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#B5DDB5;padding:48px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="background:#F3EBD9;border:2px solid #1F141F;border-radius:8px;box-shadow:6px 6px 0 #1F141F;">
          <tr>
            <td style="padding:40px 36px;">
              <p style="margin:0 0 16px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;color:#C26A1F;text-transform:lowercase;font-weight:600;letter-spacing:0.04em;">
                ${order.founding_no ? `founding member · #${order.founding_no} of 50` : `welcome`}
              </p>
              <h1 style="margin:0 0 16px;font-size:32px;font-weight:800;letter-spacing:-0.02em;color:#1F141F;line-height:1.15;">
                You're in.
              </h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#1F141F;">
                Thanks for buying Pumkin. Your founding license is good for lifetime updates on every platform, forever. Click below to grab the installer.
              </p>
              <p style="margin:0 0 12px;">
                <a href="${downloadUrl}"
                   style="display:inline-block;background:#F4A03E;color:#1F141F;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border:2px solid #1F141F;border-radius:8px;box-shadow:3px 3px 0 #1F141F;font-family:'JetBrains Mono',ui-monospace,monospace;">
                  ↓ Download Pumkin v${order.version}
                </a>
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#5A4858;">
                This link is personal — don't share it. It's how I know you're a licensed buyer. Use it from any of your machines.
              </p>
              <hr style="border:none;border-top:1px solid #8FB587;margin:24px 0;">
              <h2 style="margin:0 0 12px;font-size:18px;font-weight:700;color:#1F141F;">Quick start</h2>
              <ol style="margin:0 0 24px;padding:0 0 0 20px;font-size:14px;line-height:1.7;color:#1F141F;">
                <li>Install <a href="https://ollama.com/download" style="color:#C26A1F;font-weight:600;">Ollama</a> if you haven't already.</li>
                <li>Pull a model: <code style="background:#B5DDB5;padding:2px 6px;border-radius:3px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;">ollama pull llama3.2:3b</code></li>
                <li>Run the Pumkin installer you just downloaded.</li>
                <li>Launch Pumkin from the Start menu.</li>
              </ol>
              <hr style="border:none;border-top:1px solid #8FB587;margin:24px 0;">
              <p style="margin:0;font-size:14px;color:#5A4858;line-height:1.6;">
                Need help? Just reply to this email — one human reads every message, usually within 24 hours.
              </p>
              <p style="margin:24px 0 0;font-size:14px;color:#1F141F;">
                <strong>Lew</strong><br>
                <span style="color:#5A4858;">Software For Humans · Vigo</span>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#5A4858;">
          You're receiving this because you bought Pumkin at <a href="${SITE_URL}" style="color:#C26A1F;">pumkin.app</a>.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [order.email],
    subject,
    html,
    text,
    // Pumkin doesn't use marketing trackers — keep it clean
    headers: {
      "X-Entity-Ref-ID": order.id,
    },
  });

  if (error) {
    throw new Error(`Resend send failed: ${JSON.stringify(error)}`);
  }
}
