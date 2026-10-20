# Bestday mockup demos

A runnable copy of every mockup on the Bestday marketing page (`/marketing`) that is drawn in code, plus the image assets the page loads. The components in `src/marketing/` are copied verbatim from `kayakinwunmi/bestday-ai-landing-page` (`src/marketing`, commit `18241df`; the marketing code on `main` at `20d0b02` is identical). The folder layout mirrors the source, so imports and the `/marketing/…` and `/members/…` image paths are unchanged.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5180
npm run build      # typecheck + production build to dist/
```

React 19, Tailwind 3, GSAP 3 + `@gsap/react`, Vite 5. Versions are pinned to what the site uses.

## What's in the gallery (`src/App.tsx`)

| # | Demo | Source |
|---|---|---|
| 01 | Phone screens: goals, check-in, circle, companion | `ui/PhoneFrame.tsx` + `ui/ShowcaseArt.tsx` |
| 02 | Product carousel (scroll-pinned, autoplay, arrows + dots) | `sections/ProductShowcase.tsx` |
| 03 | How it works: horizontal accordion with the screen images | `sections/HowItWorks.tsx` |
| 04 | Welcome thread: typing dots → chat bubbles → calendar chip | `sections/Begin.tsx` (`WelcomeThread`) |
| 05 | Circle glyph (avatars fan out on hover) + ledger card | `sections/Mechanism.tsx` (`CircleGlyph`), `ui/LedgerCard.tsx` |
| 06 | Constellation, `open` and `filled` (animated SVG) | `ui/ConstellationArt.tsx` |
| 07 | Mini orbit, alone and witnessed (in the code, not on the page) | `ui/MiniOrbit.tsx` |
| 08 | Image assets | `public/` |

Supporting code: `ui/TbcMark.tsx`, `ui/Wrap.tsx`, `motion/Reveal.tsx`, `lib/gsap.ts`, `lib/members.ts`, `lib/useReducedMotion.ts`, `marketing.css` (page-scoped classes such as `.bd-marketing`, `.bd-bevel`, `.bd-meta-label`).

## Image assets (`public/`)

- `marketing/goals-screen.webp` (940×1672), `marketing/checkin-screen.webp` (1024×1536): rendered phone mockups.
- `marketing/community-reference.webp` (1179×2556): a real app screenshot of the Community screen. It shows real user names and handles.
- `marketing/hero-handshake-hanging.webp`, `marketing/alone.webp`, `marketing/witnessed.webp`: hero and Alone/Witnessed photos.
- `members/{r,m,t,j,s}.jpg`: placeholder stock portraits, shown in greyscale. They are not real Bestday members.
- `bestday-wordmark-white.png`: the wordmark used in the nav and footer.

## Using the components in another project

Spread `bdTokens` from `tailwind.tokens.ts` into your Tailwind `theme.extend`, import `src/marketing/marketing.css`, wrap the page in `.bd-marketing`, and serve `public/` from the site root. Font: Urbanist (Google Fonts).
