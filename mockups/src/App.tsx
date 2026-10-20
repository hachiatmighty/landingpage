import type { ReactNode } from "react";
import { PhoneFrame } from "./marketing/components/ui/PhoneFrame";
import { AppScreen, type AppScreenVariant } from "./marketing/components/ui/AppScreen";
import { Moment } from "./marketing/components/ui/Moments";
import { DeviceScreen } from "./marketing/components/ui/app/DeviceScreen";
import { GoalTour } from "./marketing/components/ui/app/GoalTour";
import { COMMENT, GoalDetailScreen, type GoalDetailState } from "./marketing/components/ui/app/GoalDetailScreen";
import { GOAL_TITLE, NewGoalScreen } from "./marketing/components/ui/app/NewGoalScreen";
import { ProgressSheet } from "./marketing/components/ui/app/ProgressSheet";
import { ShareGoalPrompt } from "./marketing/components/ui/app/ShareGoalPrompt";
import { EMPTY_GOALS, TourGoalsScreen, type TourGoalsState } from "./marketing/components/ui/app/TourGoalsScreen";
import { C } from "./marketing/components/ui/app/theme";
import { StoryScreen } from "./marketing/takes/StoryScreen";
import { PROMISES } from "./marketing/lib/membership";
import { PROMISE_PHOTOS, photoUrl } from "./marketing/lib/photos";

/**
 * A gallery of every app mockup on the live marketing page (bestdayai.vercel.app/marketing). The
 * components under ./marketing are verbatim copies from the `develop` branch of
 * kayakinwunmi/bestday-ai-landing-page, so each phone here is the same code the page runs.
 */

const APP_SCREENS: { variant: AppScreenVariant | "story"; label: string; where: string }[] = [
  { variant: "goals", label: "Goals", where: "How it works, step 1" },
  { variant: "checkin", label: "Weekly check-in", where: "How it works, step 3" },
  { variant: "circle", label: "Circle", where: "Not currently placed on the page" },
  { variant: "story", label: "Stories", where: "Membership, last slide" },
];

/* Tour states, taken from the script in GoalTour.tsx. */
const SAVED: TourGoalsState = { hasGoal: true, circle: 3 };
const DETAIL_START: GoalDetailState = {
  progress: 0,
  pressUpdate: false,
  circle: 3,
  showUpdate: false,
  typed: 0,
  pressSend: false,
  sent: false,
  coachReplied: false,
  circleReplied: false,
};
const DETAIL_ANSWERED: GoalDetailState = {
  ...DETAIL_START,
  progress: 25,
  showUpdate: true,
  sent: true,
  coachReplied: true,
  circleReplied: true,
};
const DETAIL_TYPING: GoalDetailState = { ...DETAIL_START, progress: 25, showUpdate: true, typed: COMMENT.length };
const FILLED_FORM = { open: true, typed: GOAL_TITLE.length, circle: [0, 1, 2], coaches: [0], pressSave: false };

/** Mirrors the tour's root: screens stacked absolutely, sheets and modals over them. */
const Layer = ({ children, background = C.surface }: { children: ReactNode; background?: string }) => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", background }}>{children}</div>
);

const TOUR_FRAMES: { label: string; screen: ReactNode }[] = [
  {
    label: "Goals, empty",
    screen: (
      <Layer>
        <TourGoalsScreen state={EMPTY_GOALS} />
      </Layer>
    ),
  },
  {
    label: "New goal: title and Circle",
    screen: (
      <Layer>
        <TourGoalsScreen state={EMPTY_GOALS} />
        <NewGoalScreen {...FILLED_FORM} scroll={0} />
      </Layer>
    ),
  },
  {
    label: "New goal: AI coach",
    screen: (
      <Layer>
        <TourGoalsScreen state={EMPTY_GOALS} />
        <NewGoalScreen {...FILLED_FORM} scroll={220} />
      </Layer>
    ),
  },
  {
    label: "Share your goal",
    screen: (
      <Layer>
        <TourGoalsScreen state={SAVED} />
        <ShareGoalPrompt open pressShare={false} />
      </Layer>
    ),
  },
  {
    label: "Goals, with the new goal",
    screen: (
      <Layer>
        <TourGoalsScreen state={SAVED} />
      </Layer>
    ),
  },
  {
    label: "Update progress",
    screen: (
      <Layer>
        <GoalDetailScreen state={DETAIL_START} />
        <ProgressSheet open value={25} initial={0} pressSave={false} />
      </Layer>
    ),
  },
  {
    label: "Goal detail: writing a comment",
    screen: (
      <Layer>
        <GoalDetailScreen state={DETAIL_TYPING} />
      </Layer>
    ),
  },
  {
    label: "Goal detail: coach and Circle reply",
    screen: (
      <Layer>
        <GoalDetailScreen state={DETAIL_ANSWERED} />
      </Layer>
    ),
  },
];

const NAV = [
  ["tour", "Hero goal tour"],
  ["screens", "App screens"],
  ["frames", "Tour frames"],
  ["moments", "Membership moments"],
] as const;

function SectionHeader({ id, title, source, children }: { id: string; title: string; source: string; children?: ReactNode }) {
  return (
    <div id={id} className="flex scroll-mt-6 flex-col gap-bd-8 border-t border-bd-ink/10 pt-bd-48">
      <h2 className="m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">{title}</h2>
      <code className="font-bd-mono text-bd-caption text-bd-ink-muted">{source}</code>
      {children && <p className="m-0 max-w-[62ch] text-bd-body text-bd-ink-soft">{children}</p>}
    </div>
  );
}

function Phone({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex min-w-0 flex-col items-center gap-bd-12">
      <div className="w-full max-w-[240px]">
        <PhoneFrame>{children}</PhoneFrame>
      </div>
      <figcaption className="text-center">
        <span className="block text-bd-body-md font-semibold">{label}</span>
        {note && <span className="block text-bd-caption text-bd-ink-muted">{note}</span>}
      </figcaption>
    </figure>
  );
}

export function App() {
  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-bd-48 px-5 pb-24 pt-12 md:px-10">
      <header className="flex flex-col gap-bd-16">
        <span className="font-bd-mono text-bd-micro uppercase tracking-[0.14em] text-bd-ink-muted">Bestday · marketing page</span>
        <h1 className="m-0 max-w-[18ch] text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.04em]">
          App mockups, <span className="bg-bd-yellow px-1">in code</span>
        </h1>
        <p className="m-0 max-w-[62ch] text-bd-lead text-bd-ink-soft">
          Every phone screen on bestdayai.vercel.app/marketing. They are rebuilt from the app&rsquo;s own React Native
          styles on a 393×852pt canvas and scaled to fit, so they stay sharp at any size.
        </p>
        <nav className="flex flex-wrap gap-bd-8">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-bd-pill border border-bd-ink/15 bg-bd-paper-2 px-bd-12 py-bd-6 text-bd-caption font-semibold text-bd-ink no-underline hover:border-bd-ink/40"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="flex flex-col gap-bd-32">
        <SectionHeader id="tour" title="Hero goal tour" source="components/ui/app/GoalTour.tsx">
          The hero phone plays a scripted first minute in the app. It adds a goal, shares it with the Circle, updates
          progress, and gets replies from the AI coach and a Circle member, then loops.
        </SectionHeader>
        <div className="flex justify-center rounded-[28px] bg-bd-paper-2 px-5 py-12">
          <div className="w-full max-w-[300px] drop-shadow-[0_24px_40px_rgba(13,13,13,0.28)]">
            <PhoneFrame>
              <GoalTour />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-bd-32">
        <SectionHeader id="screens" title="App screens" source="components/ui/AppScreen.tsx, takes/StoryScreen.tsx">
          Each screen loops a short simulated interaction, such as a tap or a new row appearing.
        </SectionHeader>
        <div className="grid grid-cols-2 gap-x-bd-24 gap-y-bd-40 rounded-[28px] bg-bd-ink px-5 py-12 text-bd-paper-2 md:grid-cols-4 md:px-10 [&_figcaption_span:last-child]:text-white/55">
          {APP_SCREENS.map(({ variant, label, where }) => (
            <Phone key={variant} label={label} note={where}>
              {variant === "story" ? <StoryScreen /> : <AppScreen variant={variant} />}
            </Phone>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-bd-32">
        <SectionHeader id="frames" title="Tour frames" source="TourGoalsScreen, NewGoalScreen, ShareGoalPrompt, GoalDetailScreen, ProgressSheet">
          The screens the hero tour moves through, each held still in one state from the tour script.
        </SectionHeader>
        <div className="grid grid-cols-2 gap-x-bd-24 gap-y-bd-40 md:grid-cols-4">
          {TOUR_FRAMES.map(({ label, screen }) => (
            <Phone key={label} label={label}>
              <DeviceScreen background={C.surface}>{screen}</DeviceScreen>
            </Phone>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-bd-32">
        <SectionHeader id="moments" title="Membership moments" source="components/ui/Moments.tsx">
          The small looping UI cards over each membership photo. The photos load from Unsplash, as they do on the page.
        </SectionHeader>
        <div className="grid grid-cols-1 gap-bd-24 md:grid-cols-2">
          {PROMISES.map((promise) => (
            <figure key={promise.key} className="m-0 flex min-w-0 flex-col gap-bd-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-bd-ink">
                <img
                  src={photoUrl(PROMISE_PHOTOS[promise.key], 1200, 900)}
                  alt={PROMISE_PHOTOS[promise.key].alt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bd-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-bd-surface-1/90 p-5 backdrop-blur-md md:inset-x-6 md:bottom-6">
                  <Moment kind={promise.key} />
                </div>
              </div>
              <figcaption>
                <span className="block text-bd-body-md font-semibold">{promise.title}</span>
                <code className="font-bd-mono text-bd-caption text-bd-ink-muted">kind="{promise.key}"</code>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
