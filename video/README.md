# Bestday feature videos (Remotion)

`EmailCircleInvites`: the feature release video for Email Circle invites. 1080×1920 at 30 fps, about 49 s, for Reels, Shorts and TikTok. All on-screen copy stays inside the text-safe box in `src/lib/layout.ts`, so platform overlays don't cover it.

```bash
npm install
npm run studio     # preview and scrub in the browser
npm run render     # out/email-circle-invites.mp4
```

In a container without Remotion's own browser, point it at a local headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render`.

**Music:** put a track in `public/` and render with `--props='{"music":"music.mp3","showSafeZone":false}'`. It fades in and out automatically. Set `showSafeZone` to `true` to draw the text-safe box while checking a layout.

## The cut (`src/Video.tsx`)

| # | Scene | Copy |
|---|---|---|
| 1 | Hook | NEW · Email Circle invites. "Your biggest supporters don't need another app." |
| 2 | Before | "Until now, your Circle had to be on Bestday." / "Not everyone made it past the download." |
| 3 | Turn | "Now, all you need is their email." |
| 4 | Invite (app) | "Invite anyone with just an email." |
| 5 | Accept (inbox) | "Dami gets it in their inbox." / "One tap to join. No app. No account." |
| 6 | Log progress (app) | "Every time you log progress…" |
| 7 | Update email (inbox) | "…your Circle hears about it." |
| 8 | Reply (inbox) | "Dami just hits reply." |
| 9 | Lands (app) | "…and it lands right on your goal." (push notification, then the comment) |
| 10 | Payoff | "Your people. Their inbox. Your goal." |
| 11 | End card | Email Circle invites · **Join Bestday** |

Sade Okoye (goal owner) and Dami Adebayo (email-only Circle member) are fictional. The goal is "Run a half marathon".

## Where things come from

- `src/lib/theme.ts`, `native.tsx` and `device.ts` are copied unchanged from `mockups/src/marketing/components/ui/app/`.
- `src/screens/GoalScreen.tsx` and the progress sheet are frame-driven ports of the mockups' `GoalDetailScreen.tsx` and `ProgressSheet.tsx`. Remotion renders frame by frame, so nothing here uses CSS transitions or timers.
- `src/screens/Mail.tsx` holds the light mail client (generic, with no real client's chrome) and the three email bodies. The invite and "you're in" emails follow the live templates. **The update email is a new design** ("Sade Okoye just made an update to their goal… Reply to this email to check in on them").
