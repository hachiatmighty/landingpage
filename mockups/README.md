# Bestday app mockups

Pulled from `kayakinwunmi/bestday-ai-landing-page` (commit `18241df`, the marketing page at `src/marketing` and `public/marketing`). The folder layout mirrors the source, so the relative imports and the `/marketing/…` and `/members/…` image paths work without changes.

## Mockup screens (`public/marketing/`)

| File | Size | Used in | What it shows |
|---|---|---|---|
| `goals-screen.webp` | 940×1672 | How It Works, step 1 "Set goals worth keeping." | Rendered phone. Header with an avatar and a "…" menu, placeholder title bars, a yellow CTA pill, and a rising 3-bar chart with a yellow trend line. Below that, 3 goal cards: a round icon (mountain/flag, heart, sprout), title and subtitle bars, a yellow progress bar and 4 step dots. Bottom tab bar: home (active, yellow), target, calendar, stats. |
| `checkin-screen.webp` | 1024×1536 | How It Works, step 3 "Show up every week." | Rendered phone. A 7-day check-in stepper (4 done as yellow checks, 3 pending), a card with a moonlit sea and a yellow sun, text bars, a note input with a pencil icon, a yellow progress bar with pager dots, and a tab bar (home active, stats, circle, profile). |
| `community-reference.webp` | 1179×2556 | How It Works, step 2 "Invite the right Circle."; Showcase slide "Your Circle" | A real app screenshot. Title "Community" with a yellow "+" button, segmented tabs (DMs / Groups / **Connections**), search ("Search by name, email, phone, or u…" plus a camera icon), "Member suggestions" list of 6 rows (avatar or initial, name, @handle, yellow "Connect" pill), and a tab bar (Stories, Goals, a centre yellow "+" button, **Community**, Profile). |

`public/members/{r,m,t,j,s}.jpg` are the stand-in portraits. The "circle" art shows them in greyscale (`PORTRAIT_FILTER`).

## Code-built mockups (`src/marketing/components/`)

- **`ui/PhoneFrame.tsx`**: a CSS phone frame at 9:19. It has a gradient titanium edge, a `#050505` bezel, a dynamic island, a `bd-surface-0` screen and a diagonal glare.
- **`ui/ShowcaseArt.tsx`**: abstract screen art that goes inside the frame, in four variants:
  - `goals`: a yellow title bar, 4 white-alpha text bars and a goal card with a 2/3 yellow progress track.
  - `checkin`: a 7-day strip (4 yellow, 3 outlined), text bars and a card.
  - `circle`: 4 overlapping greyscale member avatars (the 2nd ringed in yellow), a dashed yellow "+" and text bars.
  - `companion`: a glowing yellow orb and text bars. In the carousel it also gets a yellow play button.
- **`sections/ProductShowcase.tsx`**: a carousel with scroll snap, pinned and driven by scroll through GSAP. Slides and captions:
  1. Goal view: "Quarterly and annual, by category."
  2. Weekly check-in: "Monday messages, progress your Circle can see."
  3. Your Circle (`community-reference.webp`): "Up to 5 people, up to 50 on Premium Plus."
  4. The Companion†: marked as not confirmed yet, play overlay.

  Controls: prev/next arrows and pill dots, with the active dot in yellow. Heading: "Goals, check-ins, your Circle and the Companion."
- **`sections/HowItWorks.tsx`**: a horizontal accordion with three steps (Set / Invite / Show up). It pins on scroll, and each open step shows its screen image peeking from the bottom right.
- Supporting files: `ui/TbcMark.tsx` (the † and Tbd markers), `ui/Wrap.tsx`, `motion/Reveal.tsx`, `lib/gsap.ts`, `lib/members.ts`, `lib/useReducedMotion.ts`.

## Using them

You need React, Tailwind 3, and `gsap` + `@gsap/react`. Spread `bdTokens` from `tailwind.tokens.ts` into `theme.extend`. Wrap the page in `.bd-marketing` with the CSS from `bdCssVars`. Serve `public/` from the site root.

Palette: surface `#0D0D0D` / `#1A1A1A`, yellow `#FFDE59`, text `#FFFFFF` / `#C4C4C4` / `#999999`. Font: Urbanist.
