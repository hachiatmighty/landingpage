# Bestday feature videos (Remotion)

`EmailCircleInvites`: the launch video for Email Circle invites. 1080×1920 at 30 fps, 28 s, for Reels, Shorts and TikTok. It follows the Bestday social system (the bestday-carousel skill): brand black throughout, Urbanist 400 copy on one shared baseline, the wordmark top-left, and carousel-style swipes between scenes. All copy stays inside the text-safe box in `src/lib/layout.ts`.

```bash
npm install
npm run studio     # preview and scrub in the browser
npm run render     # out/email-circle-invites.mp4
```

In a container without Remotion's own browser, point it at a local headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render`.

**Music:** put a track in `public/` and render with `--props='{"music":"music.mp3","showSafeZone":false}'`. It fades in and out automatically. Set `showSafeZone` to `true` to draw the text-safe box while checking a layout.

## The cut (`src/scenes/Launch.tsx`)

| # | Scene | Copy |
|---|---|---|
| 1 | Title | New in Bestday / Email Circle invites |
| 2 | Invite (app) | Add anyone to your Circle with just their email. |
| 3 | Join (inbox) | No app or account needed to join. |
| 4 | Updates (inbox) | They get an email every time you update your goal. |
| 5 | Replies (inbox, then app) | They reply to check in, and it shows up on your goal. |
| 6 | End card | Bring your best people with you / Bestday. Do it together. |

**Placeholders until the brand assets are added:** the wordmark is typeset in Urbanist (`src/components/Wordmark.tsx`), and the title scene uses an email field where a brand illustration will go.

Sade Okoye (goal owner) and Dami Adebayo (email-only Circle member) are fictional. The goal is "Run a half marathon".

## Where things come from

- `src/lib/theme.ts`, `native.tsx` and `device.ts` are copied unchanged from `mockups/src/marketing/components/ui/app/`.
- `src/screens/GoalScreen.tsx` and the progress sheet are frame-driven ports of the mockups' `GoalDetailScreen.tsx` and `ProgressSheet.tsx`. Remotion renders frame by frame, so nothing here uses CSS transitions or timers.
- `src/screens/Mail.tsx` holds the light mail client (generic, with no real client's chrome) and the three email bodies. The invite and "you're in" emails follow the live templates. **The update email is a new design** ("Sade Okoye just made an update to their goal… Reply to this email to check in on them").
