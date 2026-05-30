# Pumkin Brand

The complete brand reference. Live version at `/brand` on the website.

## Identity

**Pumkin** is an indie, local-first agent IDE for developers. The brand is intentionally counter-positioned against the sterile, corporate aesthetic of cloud AI products (OpenAI, Anthropic, Google). Pumkin's visual language is:

- **Pixel art** — handcrafted feeling, anti-mass-production
- **Mint green + pumpkin orange** — warm, playful, distinctive
- **Chunky borders + offset shadows** — sticker / printed-zine feel, no gradients
- **Plain language** — no marketing-speak, honest about what is and isn't built

The cuteness of the mascot does the anti-corporate signaling. The product copy stays serious about technical capability.

## Mascot

Pixel-art jack-o-lantern with antenna and headphones. Has a personality (mildly menacing but friendly). Always rendered with `image-rendering: pixelated` at integer scales — never anti-aliased.

## Color palette

| Token | Hex | Role |
|-------|-----|------|
| `--brand-ink` | `#B5DDB5` | Primary mint background |
| `--brand-ink-deep` | `#A3CCA3` | Elevated mint, footer |
| `--brand-panel` | `#F3EBD9` | Warm cream for cards |
| `--brand-border` | `#8FB587` | Mint shadow, hairlines |
| `--brand-fg` | `#1F141F` | Primary text, borders, shadows |
| `--brand-fg-muted` | `#5A4858` | Secondary text |
| `--brand-fg-faint` | `#8E7E8C` | Captions |
| `--brand-accent` | `#F4A03E` | Pumpkin orange — wordmark, CTA |
| `--brand-accent-hover` | `#DC8829` | Hover/active |
| `--brand-accent-quiet` | `#C26A1F` | Outlines, links on light bg |
| `--brand-accent-light` | `#FFC97F` | Tints |
| `--brand-stem` | `#7E9437` | Stem green |
| `--brand-eye` | `#FECE48` | Eye glow yellow |
| `--brand-shadow` | `#5E4E5E` | Headphone purple-gray |

All defined as CSS variables in `src/styles/brand.css`. Never use raw hex in components — use the token.

## Typography

- **Display + body:** Inter (400 / 500 / 600 / 700 / 800)
- **Mono:** JetBrains Mono (400 / 500 / 600)
- **No pixel fonts in body type** — the mascot does that work; pairing pixel mascot with pixel body type would be too much

H1: clamp(2.25rem, 5vw, 3.75rem) / 700 weight / -0.02em tracking
H2: clamp(1.75rem, 3.5vw, 2.5rem) / 700 weight
Body: 1rem / 1.6 line-height

## Asset files

Drop these in `site/public/`:

| File | Source | Used for |
|------|--------|----------|
| `logo.png` | Image #2 (wordmark + mascot horizontal) | Header, marketing |
| `mascot.png` | Image #3 (mascot only, transparent bg) | Favicon, OG, hero corner |
| `favicon.png` | Image #3 cropped to 64×64 | Browser tab |
| `og.png` | Image #1 (1200×630 with tagline) | Social share previews |
| `app-icon.png` | Image #4 (rounded-square version) | Desktop app icon, store listings |

For the favicon: convert `mascot.png` to a 32×32 and 64×64 PNG. Skip SVG — the pixel art is bitmap-native.

## Component style

- **Borders:** 2px solid `--brand-fg` on all panels and primary buttons
- **Shadows:** Hard offset shadow `3px 3px 0 var(--brand-fg)` or `4px 4px 0` for emphasis. No blurs, no opacity.
- **Hover:** translate(-1px, -1px) + larger shadow. Suggests the element popped up off the page.
- **No gradients anywhere.** Flat colors only.
- **No emoji in product copy.** The mascot owns visual personality.

## Voice and tone

- **Plainspoken.** "Build agents locally" not "Empower your team to unlock the power of AI."
- **Honest.** Tell people what doesn't work. List trade-offs explicitly.
- **Anti-corporate.** Lean into the indie origin. Don't hide it.
- **Dry humor allowed.** Cute mascot + serious product = the brand.

## Don't

- Don't anti-alias the pixel art at non-integer scales
- Don't put the wordmark on white — always mint, cream, or dark
- Don't recolor the mascot
- Don't pair with serif body fonts
- Don't add taglines under the wordmark in headers — copy does that work

## Naming conventions

- **Product name:** Pumkin (capitalized in prose, lowercase in code/url)
- **Domain:** pumkin.app (TBD)
- **Mascot:** unnamed for now — community submission, decide post-launch
- **CLI binary:** `pumkin` (lowercase)
- **App ID:** `app.pumkin.desktop`
