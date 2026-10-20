# Bestday app mockups

The phone mockups from the live marketing page (https://bestdayai.vercel.app/marketing), copied as code so you can run and reuse them. The live page is built from the `develop` branch of `kayakinwunmi/bestday-ai-landing-page` (commit `c4c2d15`), and everything in `src/marketing/` is copied verbatim from there. The folder layout matches the source, so imports are unchanged.

The screens are rebuilt from the app's own React Native styles (`BestdayApp/src/screens/Main/*`) and drawn on a 393×852pt iPhone 16 canvas. `DeviceScreen` then scales that canvas to whatever width it's given, so the screens stay sharp at any size.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5180
npm run build      # typecheck + production build to dist/
```

React 19, Tailwind 3, lucide-react, Vite 5. Versions are pinned to what the site uses.

## What's in the gallery (`src/App.tsx`)

| Section | Component | Where it appears on the page |
|---|---|---|
| Hero goal tour (animated loop) | `components/ui/app/GoalTour.tsx` | Hero phone |
| Goals screen | `AppScreen variant="goals"` → `app/GoalsScreen.tsx` | How it works, step 1 |
| Weekly check-in | `AppScreen variant="checkin"` → `app/CheckInScreen.tsx` | How it works, step 3 |
| Circle screen | `AppScreen variant="circle"` → `app/CircleScreen.tsx` | Built, not currently placed |
| Stories screen | `takes/StoryScreen.tsx` | Membership, last slide |
| Tour frames (still states) | `TourGoalsScreen`, `NewGoalScreen`, `ShareGoalPrompt`, `GoalDetailScreen`, `ProgressSheet` | Inside the hero tour |
| Membership moments | `components/ui/Moments.tsx` (`companion`, `coaches`, `community`, `founder`) | Membership slides |

The building blocks:
- `PhoneFrame.tsx`: the titanium edge and bezel.
- `app/DeviceScreen.tsx`: the 393×852 canvas, plus the status bar, Dynamic Island and home indicator.
- `app/native.tsx`: `V` and `T`, which lay out like React Native's View and Text.
- `app/theme.ts`: the app's colours and fonts.
- `app/TabBar.tsx`, `app/Tap.tsx`: the tab bar and the tap indicator.
- `app/motion.ts` and `motion.css`: the simulated-interaction loops.

## Photos

The Stories screen and the membership moments use photos hot-linked from Unsplash (see `lib/photos.ts`), the same as the live page. They load in a normal browser. To ship them, download the photos into `public/` and change `photoUrl`. Member avatars are in `public/members/` and are placeholder stock portraits, not real members.

## Using the components elsewhere

Copy `src/marketing/` and `src/config/publicPricing.ts`. Spread `bdTokens` from `tailwind.tokens.ts` into your Tailwind `theme.extend`, load Urbanist from Google Fonts, and serve `public/members/` from the site root. Then render any screen inside a `PhoneFrame`:

```tsx
<PhoneFrame>
  <AppScreen variant="goals" />
</PhoneFrame>
```
