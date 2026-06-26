# pumkin-site

Landing page for Pumkin. Astro 5, static-rendered, designed to deploy to Vercel via Git in 30 seconds.

## Run locally

```bash
cd site
npm install
npm run dev
```

Opens at `http://localhost:4321`.

## Build for production

```bash
npm run build
```

Output goes to `site/dist/`. Static HTML/CSS/JS only — no SSR, no server runtime needed.

## Deploy to Vercel

Two options:

**Option A — Vercel Dashboard (easier):**
1. Go to vercel.com, click "Add New Project"
2. Connect to your GitHub repo (`agentkit`)
3. Set **Root Directory** to `site`
4. Framework preset: Astro (auto-detected)
5. Add custom domain (pumkin.app, pumkin.dev, etc.) in project settings → Domains
6. Deploy

**Option B — Vercel CLI:**
```bash
cd site
npx vercel
```

Both options auto-deploy on every push to `main`.

## Swap in the brand

Everything visual lives in **two places**. When your final brand is ready:

### 1. Colors and fonts: `src/styles/brand.css`

Replace the CSS variables at the top. The whole site updates automatically.

```css
:root {
  --brand-ink: #YOURBG;
  --brand-accent: #YOURORANGE;
  /* etc */
}
```

### 2. Logo

Drop your final logo SVG at `public/logo.svg`, then in `src/components/Header.astro` and `src/components/Footer.astro`, swap the pumpkin emoji `<span>` for:

```astro
<img src="/logo.svg" alt="Pumkin" height="32" />
```

That's it. No other file knows about the brand.

## Things to fill in before launch

Grep the codebase for these markers and replace:

- `STRIPE_URL` in `src/components/Buy.astro` — set to your real Stripe Payment Link
- `REMAINING_OF_50` in `src/components/Buy.astro` — hand-edit as licenses sell
- `https://github.com/zgpbts79ws-dev/pumkin` in `Hero.astro` and `Footer.astro` — update if repo gets renamed
- `hi@pumkin.app` in `Footer.astro` — set up the email forwarding rule on your domain
- `https://pumkin.app` in `astro.config.mjs` — your actual domain
- `/og.png` in `Layout.astro` — drop an OpenGraph share image at `public/og.png` (1200×630)

## Editing copy

The bulk of the prose is in `src/components/`. Each section is its own component:

- `Hero.astro` — headline, sub, CTAs, terminal mock
- `What.astro` — feature list (the `features` array at the top)
- `Who.astro` — fit / anti-fit lists
- `FAQ.astro` — FAQ items (the `faqs` array at the top)
- `Buy.astro` — pricing card

Edit, hit save, dev server hot-reloads.

## Notes

- No JavaScript shipped to the browser by default. Pure HTML/CSS.
- All fonts pulled from Google Fonts CDN. Swap for self-hosted if you want zero third-party.
- The terminal mock in `Hero.astro` is real output from a validation run. Don't change the numbers.
