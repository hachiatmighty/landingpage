# Bestday video

Marketing videos built with [Remotion](https://www.remotion.dev/) (React → MP4).

```bash
cd video
npm install
npm run dev                          # Remotion Studio at http://localhost:3000
npx remotion render Intro out/intro.mp4
npx remotion still Intro out/intro.png --frame=90
```

- Compositions are registered in `src/Root.tsx`. `Intro` (1080×1350, 30fps, 5s) is a starter.
- Urbanist (400/600/700) is bundled from `@fontsource/urbanist` and loaded in `src/fonts.ts`, so renders need no network. Add weights there.
- Tailwind 3 is enabled with the `bd-*` tokens from `../mockups/tailwind.tokens.ts`, so `bg-bd-surface-0`, `text-bd-yellow`, `font-urbanist` etc. work.
- The public dir is `../mockups/public`: load assets with `staticFile("marketing/goals-screen.webp")`. Plain `/members/…` URLs (as used in `ShowcaseArt`) don't resolve in Remotion; use `staticFile`.
- Components under `../mockups/src` can be imported directly; their `react` imports resolve from this folder's `node_modules`.
