import type { ReactElement } from "react";
import type { PromiseKey } from "../../lib/membership";
import { sim } from "./app/motion";
import { Tap } from "./app/Tap";
import { MEMBERS } from "../../lib/members";

/**
 * One small, legible piece of the product for each membership promise, shown in the membership
 * section's photo panels. They reuse the goal and wording from `AppScreen`, so the page tells one
 * consistent story. They carry no card chrome of their own; the container decides the surface.
 *
 * Each one plays the same simulated-interaction loop as the phone mockups (see app/motion.css): a
 * message arrives, a finger taps, the product answers, then the moment resets.
 */

function Label({ children }: { children: string }) {
  return <p className="m-0 font-bd-mono text-[10px] uppercase tracking-[0.16em] text-bd-text-tertiary">{children}</p>;
}

function Bubble({ children, tone = "grey" }: { children: string; tone?: "grey" | "yellow" }) {
  return (
    <p
      className={
        "m-0 rounded-bd-xl rounded-tl-bd-4 px-bd-16 py-bd-12 text-bd-body-md leading-snug " +
        (tone === "yellow" ? "bg-bd-yellow/10 text-bd-text-primary ring-1 ring-bd-yellow/25" : "bg-bd-surface-2 text-bd-text-secondary")
      }
    >
      {children}
    </p>
  );
}

/** A message that arrives after a moment of "typing", holding its own space so nothing jumps. */
function ArrivingBubble({ children }: { children: string }) {
  return (
    <div className="relative">
      <div style={sim("message")}>
        <Bubble>{children}</Bubble>
      </div>
      <div className="absolute left-0 top-0 flex gap-1 rounded-bd-xl rounded-tl-bd-4 bg-bd-surface-2 px-bd-16 py-bd-16" style={sim("typing")}>
        {[0, 0.15, 0.3].map((delay) => (
          <span key={delay} className="h-1.5 w-1.5 rounded-full bg-bd-text-secondary" style={{ animation: `bd-sim-dot 1s ease-in-out ${delay}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

function CoachHeader({ name, label }: { name: string; label: string }) {
  return (
    <div className="flex items-center gap-bd-12">
      <span aria-hidden="true" className="flex h-bd-32 w-bd-32 flex-none items-center justify-center rounded-full bg-bd-yellow text-black">
        <svg viewBox="0 0 24 24" className="h-bd-16 w-bd-16" fill="currentColor">
          <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
        </svg>
      </span>
      <div>
        <p className="m-0 text-bd-body-md font-semibold text-bd-text-primary">{name}</p>
        <Label>{label}</Label>
      </div>
    </div>
  );
}

function CompanionMoment() {
  return (
    <div className="flex flex-col gap-bd-16">
      <CoachHeader name="Your AI Companion" label="Noticed a pattern" />
      <ArrivingBubble>Thursday's run has slipped two weeks running. Move it to Saturday morning, when you've never missed?</ArrivingBubble>
      <div className="flex flex-wrap gap-bd-8">
        <span className="relative overflow-hidden rounded-bd-pill bg-bd-yellow px-bd-16 py-bd-8 text-bd-caption font-bold text-black" style={sim("press-b")}>
          <span className="block" style={sim("rise-out-b")}>Move to Saturday</span>
          <span className="absolute inset-0 flex items-center justify-center" style={sim("rise-in-b")}>
            Moved ✓
          </span>
          <Tap x="50%" y="50%" phase="b" />
        </span>
        <span className="rounded-bd-pill border border-white/15 px-bd-16 py-bd-8 text-bd-caption font-semibold text-bd-text-secondary">Keep Thursday</span>
      </div>
    </div>
  );
}

/* The specialist coaches in the app's catalog (bestday-cloud-functions aiPartners/niche/catalog.ts). */
const NICHE_COACHES = [
  { name: "STRIDE", specialty: "Fitness" },
  { name: "LEDGER", specialty: "Money" },
  { name: "HEARTH", specialty: "Relationships" },
  { name: "FORGE", specialty: "Career" },
  { name: "HELM", specialty: "Business" },
  { name: "VESPER", specialty: "Faith" },
  { name: "KEEL", specialty: "Wellbeing" },
];

function CoachesMoment() {
  const step = 8 / NICHE_COACHES.length;
  return (
    <div className="flex flex-col gap-bd-12">
      <Label>Pick a coach for this goal</Label>
      <div className="flex flex-wrap gap-bd-6">
        {NICHE_COACHES.map((coach, i) => (
          <span
            key={coach.name}
            className="rounded-bd-pill border px-bd-8 py-bd-4 text-[12px]"
            style={sim("spotlight", { delay: i * step, ease: "linear" })}
          >
            <span className="font-bold">{coach.name}</span> · {coach.specialty}
          </span>
        ))}
      </div>
      <ArrivingBubble>STRIDE: Three runs logged this week. Make Saturday the long one.</ArrivingBubble>
    </div>
  );
}

/** The app's goal progress card (ShareGoalProgress/GoalShareCard.tsx), drawn small. */
function ProgressCard() {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative flex aspect-[9/16] w-[88px] flex-none flex-col items-center overflow-hidden rounded-bd-lg bg-[#111111] px-bd-6 pb-bd-8 pt-bd-6 ring-1 ring-white/10">
      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,222,89,0.3),transparent_75%)]" />
      <span className="relative self-start text-[7px] font-bold text-bd-yellow">Bestday</span>
      <img src={MEMBERS[1].src} alt="" className="relative mt-bd-4 h-6 w-6 rounded-full object-cover ring-2 ring-bd-yellow" />
      <span className="relative mt-bd-4 text-[7px] font-bold text-white">Maya Bell</span>
      <span className="relative text-[6px] font-semibold text-bd-yellow">is pursuing a Q3 goal</span>
      <span className="relative mt-bd-4 text-center text-[7px] font-bold leading-tight text-white">Run a half marathon</span>
      <svg viewBox="0 0 64 64" className="relative mt-auto h-12 w-12" aria-hidden="true">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#FFDE59"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - 0.68)}
          transform="rotate(-90 32 32)"
        />
        <text x="32" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF">68%</text>
      </svg>
      <span className="relative mt-bd-4 text-[6px] font-bold text-white">Do it. Together.</span>
    </div>
  );
}

function CommunityMoment() {
  return (
    <div className="flex items-center gap-bd-16">
      <ProgressCard />
      <div className="flex min-w-0 flex-1 flex-col gap-bd-12">
        <p className="m-0 text-bd-body font-bold text-bd-text-primary">Share your progress</p>
        <p className="m-0 text-bd-caption text-bd-text-secondary">A card for your goal, ready for Instagram, WhatsApp and more.</p>
        <span className="relative self-start rounded-bd-pill bg-bd-yellow px-bd-20 py-bd-8 text-bd-caption font-bold text-black" style={sim("press-b")}>
          Share
          <Tap x="50%" y="50%" phase="b" />
        </span>
        <span className="flex items-center gap-bd-8 text-bd-caption font-semibold text-bd-text-primary" style={sim("in-b")}>
          <span className="h-bd-8 w-bd-8 rounded-full bg-bd-yellow" />
          Shared. Your people can cheer you on.
        </span>
      </div>
    </div>
  );
}

function FounderMoment() {
  return (
    <div className="flex flex-col gap-bd-16">
      <Label>Your first week</Label>
      <div className="flex items-center gap-bd-16 rounded-bd-xl border border-white/10 bg-bd-surface-2/70 p-bd-16" style={sim("press-a")}>
        <div className="flex h-bd-48 w-bd-48 flex-none flex-col items-center justify-center rounded-bd-lg bg-bd-surface-0 ring-1 ring-white/10">
          <span className="font-bd-mono text-[9px] uppercase tracking-[0.12em] text-bd-yellow">Tue</span>
          <span className="text-bd-h3 font-bold leading-none text-bd-text-primary">14</span>
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="m-0 text-bd-body font-semibold text-bd-text-primary">Welcome call with Kay</p>
          <p className="m-0 mt-bd-4 text-bd-caption text-bd-text-tertiary">One call per cohort per month</p>
        </div>
        <span className="relative flex-none overflow-hidden rounded-bd-pill bg-bd-yellow px-bd-12 py-bd-6 text-bd-caption font-bold text-black">
          <span className="block" style={sim("rise-out")}>Book</span>
          <span className="absolute inset-0 flex items-center justify-center" style={sim("rise-in")}>
            ✓
          </span>
          <Tap x="50%" y="50%" />
        </span>
      </div>
      <p className="m-0 text-bd-body-md text-bd-text-secondary" style={sim("in-b")}>
        "Who would you be proud to tell? Let's start with them."
      </p>
    </div>
  );
}

const MOMENTS: Record<PromiseKey, () => ReactElement> = {
  companion: CompanionMoment,
  coaches: CoachesMoment,
  community: CommunityMoment,
  founder: FounderMoment,
};

/** Illustrative UI: hidden from assistive tech, since the promise copy beside it says the same thing. */
export function Moment({ kind }: { kind: PromiseKey }) {
  const Content = MOMENTS[kind];
  return (
    <div aria-hidden="true" className="text-left font-urbanist">
      <Content />
    </div>
  );
}
