import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../../lib/useReducedMotion";
import { DeviceScreen } from "./DeviceScreen";
import { SCREEN } from "./device";
import { COMMENT, GoalDetailScreen, TourTap, type GoalDetailState } from "./GoalDetailScreen";
import { GOAL_TITLE, NewGoalScreen, type NewGoalState } from "./NewGoalScreen";
import { ProgressSheet } from "./ProgressSheet";
import { ShareGoalPrompt } from "./ShareGoalPrompt";
import { EMPTY_GOALS, TourGoalsScreen, type TourGoalsState } from "./TourGoalsScreen";
import { C } from "./theme";

/** What the finger touches in a step: the element whose text matches, or a fixed point. */
type Target = { text: string } | { x: number; y: number };

interface Step {
  /** How long the step holds before the next one, in ms. */
  ms: number;
  screen: "goals" | "detail";
  goals?: Partial<TourGoalsState>;
  form?: Partial<NewGoalState>;
  share?: { open: boolean; press?: boolean };
  progress?: { open: boolean; value: number; press?: boolean };
  detail?: Partial<GoalDetailState>;
  tap?: Target;
}

const FORM: NewGoalState = { open: false, typed: 0, scroll: 0, circle: [], coaches: [], pressSave: false };
const SHARE = { open: false, press: false };
const PROGRESS = { open: false, value: 0, press: false };

const START: GoalDetailState = {
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

const TITLE = GOAL_TITLE.length;
const WORDING = COMMENT.length;

/* The form as the member leaves it, which the closing step holds while the screen slides away. */
const FILLED = { open: true, typed: TITLE, circle: [0, 1, 2], coaches: [0] };
const SAVED: Partial<TourGoalsState> = { hasGoal: true, circle: 3 };

const UPDATED = { progress: 25, showUpdate: true };
const SENT = { ...UPDATED, sent: true };
const COACHED = { ...SENT, coachReplied: true };
const ANSWERED = { ...COACHED, circleReplied: true };

/*
 * The script: a new member's first minute, in the order the app takes them through it. The Goals
 * tab is empty, so they tap "Add Q4 goals", write the goal, pick who sees it from their Circle and
 * which AI coach checks in, and save. The app offers to share the new goal. Back on Goals they open
 * it, set its progress on the slider, and post a comment, which the AI coach and a Circle member
 * both answer. Each step lists only what differs from the start of the loop, so it reads as the
 * state of the screen at that moment and the loop resets cleanly when it wraps.
 */
const STEPS: Step[] = [
  { ms: 2600, screen: "goals" },
  { ms: 650, screen: "goals", tap: { text: "Add Q4 goals" } },
  { ms: 1100, screen: "goals", form: { open: true } },
  { ms: 500, screen: "goals", form: { open: true, typed: 7 } },
  { ms: 500, screen: "goals", form: { open: true, typed: 14 } },
  { ms: 900, screen: "goals", form: { open: true, typed: TITLE } },
  { ms: 650, screen: "goals", form: { ...FILLED, circle: [0] }, tap: { text: "Rotimi Adeyemi" } },
  { ms: 650, screen: "goals", form: { ...FILLED, circle: [0, 1] }, tap: { text: "Maya Bell" } },
  { ms: 800, screen: "goals", form: FILLED, tap: { text: "Tomi Okafor" } },
  { ms: 1100, screen: "goals", form: { ...FILLED, scroll: 220 } },
  { ms: 750, screen: "goals", form: { ...FILLED, scroll: 220 }, tap: { text: "SPARTAN" } },
  { ms: 900, screen: "goals", form: { ...FILLED, scroll: 220 } },
  { ms: 550, screen: "goals", form: { ...FILLED, scroll: 220, pressSave: true }, tap: { text: "Save goal" } },
  { ms: 1200, screen: "goals", goals: SAVED, form: { ...FILLED, open: false, scroll: 220 } },
  { ms: 2800, screen: "goals", goals: SAVED, share: { open: true } },
  { ms: 650, screen: "goals", goals: SAVED, share: { open: true }, tap: { text: "Not now" } },
  { ms: 1500, screen: "goals", goals: SAVED, share: { open: false } },
  { ms: 650, screen: "goals", goals: SAVED, tap: { text: GOAL_TITLE } },
  { ms: 1600, screen: "detail", goals: SAVED },
  { ms: 450, screen: "detail", goals: SAVED, detail: { pressUpdate: true }, tap: { text: "Update progress" } },
  { ms: 1100, screen: "detail", goals: SAVED, progress: { open: true, value: 0 } },
  { ms: 650, screen: "detail", goals: SAVED, progress: { open: true, value: 12 } },
  { ms: 900, screen: "detail", goals: SAVED, progress: { open: true, value: 25 } },
  { ms: 450, screen: "detail", goals: SAVED, progress: { open: true, value: 25, press: true }, tap: { text: "Save" } },
  { ms: 2200, screen: "detail", goals: SAVED, progress: { open: false, value: 25 }, detail: UPDATED },
  { ms: 650, screen: "detail", goals: SAVED, detail: UPDATED, tap: { text: "Add a comment" } },
  { ms: 450, screen: "detail", goals: SAVED, detail: { ...UPDATED, typed: 16 } },
  { ms: 450, screen: "detail", goals: SAVED, detail: { ...UPDATED, typed: 34 } },
  { ms: 700, screen: "detail", goals: SAVED, detail: { ...UPDATED, typed: WORDING } },
  { ms: 450, screen: "detail", goals: SAVED, detail: { ...UPDATED, typed: WORDING, pressSend: true }, tap: { x: 365, y: 788 } },
  { ms: 2400, screen: "detail", goals: SAVED, detail: SENT },
  { ms: 2800, screen: "detail", goals: SAVED, detail: COACHED },
  { ms: 4200, screen: "detail", goals: SAVED, detail: ANSWERED },
  { ms: 550, screen: "detail", goals: SAVED, detail: ANSWERED, tap: { x: 30, y: 85 } },
  { ms: 1400, screen: "goals", goals: SAVED, detail: ANSWERED },
];

/* Reduced motion: no tour, just the goal with everything the tour would have shown. */
const STILL = STEPS.findIndex((step) => step.detail?.circleReplied);

const PUSH = "transform 0.5s cubic-bezier(.2,.8,.2,1), filter 0.5s cubic-bezier(.2,.8,.2,1)";

/** Centre of the target, in screen points. Measured, so it stays right if a screen's layout moves. */
function locate(root: HTMLElement, target: Target) {
  if ("x" in target) return target;
  const scale = root.getBoundingClientRect().width / SCREEN.width;
  const origin = root.getBoundingClientRect();
  const match = Array.from(root.querySelectorAll<HTMLElement>("[data-tour-layer='active'] span, [data-tour-sheet] span")).find(
    (el) => el.textContent?.trim() === target.text,
  );
  if (!match) return null;
  const box = match.getBoundingClientRect();
  return {
    x: (box.left + box.width / 2 - origin.left) / scale,
    y: (box.top + box.height / 2 - origin.top) / scale,
  };
}

/**
 * The hero phone: a scripted tour of the app's first minute instead of a still. It opens on an
 * empty Goals tab, writes a goal and shares it with a Circle, sets its progress, and lets the AI
 * coach and a Circle member answer a comment, before starting again. It pauses while off screen,
 * and under reduced motion it holds one still frame of the goal with all of that already done.
 */
export function GoalTour() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tap, setTap] = useState<{ key: number; x: number; y: number } | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const step = STEPS[reduced ? STILL : index];
  const goals = { ...EMPTY_GOALS, ...step.goals };
  const form = { ...FORM, ...step.form };
  const share = { ...SHARE, ...step.share };
  const progress = { ...PROGRESS, ...step.progress };
  const detail = { ...START, ...step.detail };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % STEPS.length), STEPS[index].ms);
    return () => window.clearTimeout(timer);
  }, [index, reduced, visible]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced || !step.tap) return setTap(null);
    const point = locate(root, step.tap);
    setTap(point ? { key: index, ...point } : null);
  }, [index, reduced, step.tap]);

  return (
    <div ref={hostRef}>
      <DeviceScreen background={C.surface}>
        <div ref={rootRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <div
            data-tour-layer={step.screen === "goals" ? "active" : "idle"}
            style={{
              position: "absolute",
              inset: 0,
              background: C.surface,
              transform: step.screen === "goals" ? "translateX(0)" : "translateX(-28%)",
              filter: step.screen === "goals" ? "brightness(1)" : "brightness(0.6)",
              transition: PUSH,
            }}
          >
            <TourGoalsScreen state={goals} />
          </div>
          <div
            data-tour-layer={step.screen === "detail" ? "active" : "idle"}
            style={{
              position: "absolute",
              inset: 0,
              transform: step.screen === "detail" ? "translateX(0)" : "translateX(100%)",
              boxShadow: "-12px 0 32px rgba(0,0,0,0.5)",
              transition: PUSH,
            }}
          >
            <GoalDetailScreen state={detail} />
          </div>
          {/* Modals and sheets sit over whichever screen is showing; the finger finds their text through data-tour-sheet. */}
          <div data-tour-sheet style={{ display: "contents" }}>
            <NewGoalScreen {...form} />
            <ShareGoalPrompt open={share.open} pressShare={Boolean(share.press)} />
            <ProgressSheet open={progress.open} value={progress.value} initial={0} pressSave={Boolean(progress.press)} />
          </div>
          {tap && <TourTap key={tap.key} x={tap.x} y={tap.y} />}
        </div>
      </DeviceScreen>
    </div>
  );
}
