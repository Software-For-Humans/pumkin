# Pumkin backend setup

End-to-end walkthrough to get the order-tracking, email-delivery, and
download-gating system working in production.

## What you're building

```
Buyer clicks "Buy"
    ↓
Stripe Checkout (the payment link you already have)
    ↓
Stripe → POST /api/stripe-webhook
    ↓                            ↓
Insert into                  Send Mailgun
pumkin_orders                welcome email
table                        with download link
    ↓
Stripe → 302 buyer to
/thank-you?session_id=cs_xxx
    ↓
Page loads from server,
shows download button +
founding number
    ↓
Buyer clicks download
    ↓
/api/download/[token] →
signed Spaces URL → .exe
```

Five external services need configuring. Steps below in dependency order.

---

## 1. Supabase — create the project and table

1. Go to https://supabase.com → New Project
2. Name: `pumkin` (or anything; just for your reference)
3. Region: same as your Vercel deploy region for lowest latency (e.g., `eu-central-1` if you're using Frankfurt)
4. Wait ~2 min for provisioning
5. Open the project → **SQL Editor** → New query
6. Paste the contents of `site/supabase/migrations/001_pumkin_orders.sql`
7. Click Run. You should see `pumkin_orders` and the helper functions appear under Table Editor.

Grab the env vars:
- `SUPABASE_URL` — Project Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → Project API keys → `service_role`. **Not** `anon`. This key bypasses RLS — never expose it to a browser.

---

## 2. DigitalOcean Spaces — host the installer

1. Cloud → Spaces Object Storage → Create Space
2. Region: `fra1` (Frankfurt) is good for EU. Match your audience.
3. Bucket name: `pumkin-releases` (must be globally unique — pick something else if taken)
4. CDN: optional, not needed for signed-URL downloads
5. Bucket access: **Restricted** (do NOT make public)
6. Create the Space

Upload the installer:
- Open the Space → click "Upload Files"
- Drag `pumkin_0.0.1_x64-setup.exe` (rebuild from the desktop project if needed)
- Path inside the bucket should be `releases/pumkin_0.0.1_x64-setup.exe`

> The download code expects `releases/pumkin_${version}_x64-setup.exe`. If
> you organize differently, update `signedInstallerUrl()` in
> `src/lib/spaces.ts`.

Generate Spaces credentials:
- Cloud → API → Spaces Keys → "Generate New Key"
- Name: `pumkin-site`
- Save the **Key** (`DO_SPACES_KEY`) and **Secret** (`DO_SPACES_SECRET`) immediately. Secret is only shown once.

Test the upload by visiting the file in the Spaces UI — should show "private" and not be accessible at the public URL.

---

## 3. Mailgun — verify your sending domain

You probably already have a Mailgun account from The Kept Gate. Either:

**A. Reuse the Kept Gate sending domain** (simplest)
- Use your existing `MAILGUN_DOMAIN` and `MAILGUN_API_KEY`
- Set `MAILGUN_FROM_EMAIL=hi@pumkin.app` (Mailgun lets you send from any address as long as you reply-to manages bounces)

**B. Add a dedicated `mg.pumkin.app` subdomain** (cleaner, recommended)
1. Mailgun → Sending → Domains → "Add New Domain"
2. Domain: `mg.pumkin.app`
3. Region: pick same as your account
4. Copy the DNS records Mailgun shows you (typically: 2× TXT, 2× MX, 1× CNAME)
5. Go to Namecheap → pumkin.app → Advanced DNS
6. Add each of the records Mailgun specified
7. Save in Namecheap
8. Back in Mailgun → click "Verify DNS" — may take 5-30 min for propagation
9. Once verified, copy the API key from Mailgun → Settings → API Keys → "Private API key"

Env vars:
- `MAILGUN_DOMAIN=mg.pumkin.app`
- `MAILGUN_API_KEY=<the private key>`
- `MAILGUN_REGION=us` or `eu` (check Mailgun → Account → Region)
- `MAILGUN_FROM_EMAIL=hi@pumkin.app` (the Namecheap email forwarding rule you already set up will catch replies)

Test from CLI:
```bash
curl -s --user "api:$MAILGUN_API_KEY" \
  https://api.mailgun.net/v3/$MAILGUN_DOMAIN/messages \
  -F from="Lew <hi@pumkin.app>" \
  -F to=your-real-inbox@gmail.com \
  -F subject="Pumkin Mailgun test" \
  -F text="If this lands, Mailgun is configured."
```

Should arrive within 30 seconds.

---

## 4. Stripe — point the webhook at your site

1. Stripe Dashboard → Developers → Webhooks → "Add endpoint"
2. Endpoint URL: `https://pumkin.app/api/stripe-webhook` (placeholder for now; works after Vercel deploy)
3. Events to listen for:
   - `checkout.session.completed`
   - `charge.refunded`
   - `charge.dispute.created` (optional)
4. Create endpoint
5. Click into the endpoint → "Signing secret" → reveal and copy
6. That's `STRIPE_WEBHOOK_SECRET=whsec_...`

Also grab a server-side API key:
- Developers → API Keys → "Secret key" (or create a Restricted Key with: Checkout sessions read, Charges read, Customers read)
- That's `STRIPE_SECRET_KEY=sk_live_...`

**For local development**, use the Stripe CLI to forward webhooks to localhost:
```bash
stripe login
stripe listen --forward-to localhost:4321/api/stripe-webhook
```
The CLI prints a dev webhook secret (`whsec_...`) — put that in your local `.env`.

---

## 5. Vercel — deploy with env vars

1. Push the repo to GitHub if not already
2. Vercel → Add New → Project → import the agentkit repo
3. **Root Directory: `site`** ← critical
4. Framework: Astro (auto-detected)
5. Before deploying, click "Environment Variables" and paste everything from `.env.example` with your real values
6. Deploy
7. After first deploy succeeds, go to Project → Settings → Domains → add `pumkin.app`
8. Vercel shows you DNS records to add at Namecheap (A record for `@`, CNAME for `www`)
9. Wait for SSL to provision (~5 min)
10. Test by visiting `https://pumkin.app` — should serve the landing page

---

## 6. End-to-end test

Use Stripe **test mode** for the first run-through:

1. In Stripe Dashboard, toggle to **Test mode** (top of sidebar)
2. Create a duplicate of your $99 payment link in test mode
3. Buy through the test link using card `4242 4242 4242 4242` with any future expiry and any CVC
4. After payment, you should:
   - Land on `pumkin.app/thank-you?session_id=cs_test_xxx`
   - See "You're in." with a download button (founding_no will be null because it's test mode — that's correct behavior)
   - Receive the welcome email at the test email you entered
5. Check Supabase Table Editor → `pumkin_orders` — should see your test row with `status='test'`
6. Click the download button → should redirect and start downloading the installer
7. Open Supabase again → your row's `download_count` should be 1, `first_dl_at` and `last_dl_at` set

If everything works, switch back to live mode and you're ready to launch.

---

## Troubleshooting

**Webhook returns 400 on Stripe retries**
- Signing secret mismatch. Verify `STRIPE_WEBHOOK_SECRET` in Vercel matches Stripe Dashboard exactly. Test-mode secret and live-mode secret are different.

**Welcome email doesn't arrive**
- Check Mailgun → Sending → Logs for delivery status
- Buyer's domain might have strict SPF — that's why a dedicated `mg.pumkin.app` is better than reusing
- Check Vercel function logs (Project → Functions → /api/stripe-webhook → invocations) for error messages

**Download returns 500**
- Check that `releases/pumkin_0.0.1_x64-setup.exe` exists in the Space
- Verify `DO_SPACES_KEY` and `DO_SPACES_SECRET` are correct
- Check that `DO_SPACES_REGION` matches your Space's region

**Thank-you page shows "Almost there"**
- The webhook hasn't fired yet (usually completes in <2s). Refresh the page.
- If persistent: check Stripe Dashboard → Webhooks → your endpoint → recent deliveries. If they're failing, fix the underlying issue and Stripe will retry.

**Founding number not assigned**
- Make sure the order is in **live mode** (test mode purchases get no founding number)
- Verify the SQL sequence exists: in Supabase SQL Editor, `SELECT nextval('pumkin_founding_seq');` should return the next number

---

## Operations cheat sheet

**Look up an order by email:**
```sql
SELECT * FROM pumkin_orders WHERE email = 'buyer@example.com';
```

**See all founding members:**
```sql
SELECT * FROM pumkin_founding_members;
```

**Remaining founding slots:**
```sql
SELECT pumkin_remaining_founding_slots();
```

**Manually mark a refund (if Stripe didn't trigger the webhook):**
```sql
UPDATE pumkin_orders
SET status = 'refunded', refunded_at = NOW()
WHERE stripe_session = 'cs_live_xxx';
```

**Resend a welcome email** (e.g., buyer lost the original):
- Easiest: re-trigger the webhook from Stripe Dashboard → Webhooks → recent delivery → "Resend"
- Or: clear `email_sent_at` in Supabase, then Stripe webhook retry will resend

**Rotate a download token** (e.g., suspected leak):
```sql
UPDATE pumkin_orders
SET download_token = gen_random_uuid()
WHERE email = 'buyer@example.com'
RETURNING download_token;
```
Then email the new link to the buyer.
