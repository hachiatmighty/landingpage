import { useCallback, useRef, useState } from "react";
import { Wrap } from "../ui/Wrap";
import { Reveal } from "../motion/Reveal";
import { ScrollTrigger, useGSAP } from "../../lib/gsap";

interface Step {
  title: string;
  body: string;
  /** Short label shown on the collapsed spine, rotated vertically. Derived from the step, not new copy. */
  spine: string;
  screen: string;
}

const steps: Step[] = [
  {
    title: "Set goals worth keeping.",
    body: "Quarterly and annual, by category. Specific enough to act on.",
    spine: "Set",
    screen: "/marketing/goals-screen.webp",
  },
  {
    title: "Invite the right Circle.",
    body: "Add the people whose opinion you value. They follow what matters, not your whole life.",
    spine: "Invite",
    screen: "/marketing/community-reference.webp",
  },
  {
    title: "Show up every week.",
    body: "Weekly check-ins, Monday messages. Progress your people can see.",
    spine: "Show up",
    screen: "/marketing/checkin-screen.webp",
  },
];

/**
 * Horizontal accordion: three full-height slices that expand sideways, one open at a time.
 *
 * Why this and not three cards in a row — the section is about a sequence, and slices that push
 * each other aside make the reader feel they are moving through it. Three equal cards would say
 * "three features".
 *
 * Interaction notes:
 * - Driven by `flex-grow`, not width, so the three panels always exactly fill the track with no
 *   sub-pixel gap regardless of container size.
 * - Open state follows hover AND focus AND click. Hover alone would make it unusable by keyboard
 *   and unreachable on touch; each panel is a real <button> so it is tabbable and announces itself.
 * - Collapsed panels keep their number and a rotated word on the spine, so a collapsed slice still
 *   tells you what it is rather than being a blank bar.
 * - Below 834px it becomes a plain vertical stack with everything expanded — a horizontal accordion
 *   on a phone is 90px of readable width per panel, which is no interface at all.
 *
 * Scroll-driven. The section pins and the three panels expand and contract continuously as you
 * scroll through it, so the sequence is something you move through rather than something that plays
 * at you.
 *
 * The widths are interpolated straight from scroll progress and written directly to flex-grow, with
 * no CSS transition on the width while scrolling. That is the whole fix for the stutter this section
 * used to have, and it removes three separate conflicts at once:
 *
 *  - A `snap` was animating the scroll position while a 700ms CSS flex-grow transition animated the
 *    layout. Each kept retargeting the other, so panels rubber-banded.
 *  - Panel choice came from `Math.round(progress * 2)`, which flips exactly at progress 0.25 and
 *    0.75. Sub-pixel scroll jitter around those points toggled the state repeatedly, restarting the
 *    700ms transition every time.
 *  - Transitioning flex-grow forces a layout pass every frame, which is the most expensive thing to
 *    do inside a pinned section.
 *
 * Interpolating instead means there is no fixed-duration animation to interrupt, no threshold to
 * oscillate around, and the panel tracks the scroll exactly. Opacity still uses CSS transitions —
 * those composite off the main thread and cannot jank the layout.
 *
 * Pointer and keyboard still work: focusing or clicking a panel hands control over, which kills the
 * scroll mapping for the rest of the visit and restores discrete stepping with a normal transition.
 * Below 834px, and under reduced-motion, none of this runs — the panels become a plain stack.
 */
export function HowItWorks() {
  const [open, setOpen] = useState(0);
  /** Set once the visitor drives the accordion themselves; scroll stops controlling it after that. */
  const [manual, setManual] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualRef = useRef(false);

  const takeControl = useCallback((index: number) => {
    manualRef.current = true;
    setManual(true);
    setOpen(index);
    // Hand the panels back to CSS: clear the inline flex-grow the scroll mapping was writing.
    panelRefs.current.forEach((el) => el && (el.style.flexGrow = ""));
  }, []);

  useGSAP(
    () => {
      const media = window.matchMedia("(min-width: 834px) and (prefers-reduced-motion: no-preference)");
      if (!media.matches) return;

      const LAST = steps.length - 1;

      /** Continuous width mapping: the panel nearest the scroll position is widest, and its
       *  neighbours give up exactly the width it gains, so the row always fills the track. */
      const applyProgress = (progress: number) => {
        if (manualRef.current) return;
        const position = progress * LAST;
        panelRefs.current.forEach((el, i) => {
          if (!el) return;
          const nearness = Math.max(0, 1 - Math.abs(position - i));
          el.style.flexGrow = String(1 + 2.4 * nearness);
          const content = el.querySelector<HTMLElement>("[data-step-content]");
          const spine = el.querySelector<HTMLElement>("[data-step-spine]");
          const tally = el.querySelectorAll<HTMLElement>("[data-step-tally]");
          // Ease the copy in over the back half of the expansion, so text never sits in a narrow panel.
          const reveal = Math.max(0, Math.min(1, (nearness - 0.45) / 0.55));
          if (content) content.style.opacity = String(reveal);
          if (spine) spine.style.opacity = String(1 - nearness);
          tally.forEach((t) => {
            t.style.height = `${20 + 12 * nearness}px`;
            t.style.opacity = String(0.3 + 0.7 * nearness);
          });
        });
        setOpen((current) => {
          const next = Math.round(position);
          return current === next ? current : next;
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "center center",
        // Roughly one half-viewport of scroll per step, rather than a flat 1.7 viewports.
        end: () => `+=${window.innerHeight * 0.55 * LAST}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => applyProgress(progress),
        onRefresh: ({ progress }) => applyProgress(progress),
      });

      return () => trigger.kill();
    },
    { scope: trackRef },
  );

  return (
    <section id="how-it-works" className="py-bd-section">
      <Wrap>
        <h2
          className="mx-auto m-0 mb-bd-large max-w-[26ch] text-center font-bold tracking-[-0.03em] text-bd-text-primary"
          style={{ fontSize: "var(--text-section)", lineHeight: "var(--text-section--line-height)" }}
        >
          From intention to action.
        </h2>

        {/* ---------- desktop: horizontal accordion ---------- */}
        <div>
          {/* Pin host. ScrollTrigger wraps the pinned element in a .pin-spacer, which changes that
            element's parent behind React's back. Keeping the pinned node as the sole child of this
            wrapper means React never has to position a sibling against it, which is what caused
            "insertBefore: node is not a child of this node" during re-render. */}
        <div ref={trackRef} className="relative z-10 bg-bd-surface-0">
        <Reveal className="hidden overflow-hidden rounded-bd-2xl min-[834px]:flex min-[834px]:h-[min(400px,calc(100svh-220px))]">
          {steps.map((step, i) => {
            const isOpen = open === i;
            return (
              <button
                key={step.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                // No hover handler by design. Steering the panels on pointer-enter fought the
                // scroll mapping: moving the mouse while the section scrolled past re-targeted the
                // open panel mid-transition, which is what made this section stutter. Focus and
                // click still work, so keyboard and touch keep full control.
                onFocus={() => takeControl(i)}
                onClick={() => takeControl(i)}
                // Width is React's to set only in manual mode. While scrolling it is written
                // imperatively, and passing it here too would let a re-render fight the scroll.
                style={manual ? { flexGrow: isOpen ? 3.4 : 1 } : undefined}
                className={
                  "group relative flex min-w-0 flex-1 cursor-pointer flex-col justify-between overflow-hidden " +
                  "border-r border-white/10 p-bd-24 text-left font-sans last:border-r-0 min-[834px]:p-bd-32 " +
                  "motion-reduce:transition-none " +
                  (manual
                    ? "transition-[flex-grow,background-color] duration-500 ease-bd-out "
                    : "transition-[background-color] duration-300 ease-bd-out ") +
                  (isOpen
                    ? "bg-gradient-to-br from-bd-surface-2 to-bd-surface-1 bd-bevel"
                    : "bg-bd-surface-1/70 bd-bevel")
                }
              >
                {/* the step's tally, drawn as strokes — 1, 2, 3 marks */}
                <span aria-hidden="true" className="relative flex h-bd-32 items-end gap-bd-6">
                  {Array.from({ length: i + 1 }).map((_, s) => (
                    <span
                      key={s}
                      data-step-tally
                      style={manual ? { height: isOpen ? 32 : 20, opacity: isOpen ? 1 : 0.3 } : undefined}
                      className="w-[3px] rounded-bd-pill bg-bd-yellow transition-[height,opacity] duration-500 ease-bd-out motion-reduce:transition-none"
                    />
                  ))}
                </span>

                {/* Collapsed spine label. Rotated with writing-mode rather than a transform so the
                    text still occupies real vertical layout space and cannot overlap the tally. */}
                <span
                  aria-hidden="true"
                  data-step-spine
                  className={
                    "absolute bottom-bd-32 left-1/2 -translate-x-1/2 whitespace-nowrap font-bd-mono text-bd-caption " +
                    "uppercase tracking-[0.2em] text-bd-text-tertiary transition-opacity duration-400 " +
                    "motion-reduce:transition-none"
                  }
                  style={{ writingMode: "vertical-rl", ...(manual ? { opacity: isOpen ? 0 : 1 } : {}) }}
                >
                  {step.spine}
                </span>

                {/* Expanded content. Kept mounted (not conditionally rendered) so its text is always
                    in the accessibility tree and in the DOM for search — only its opacity moves. */}
                <span
                  data-step-content
                  style={manual ? { opacity: isOpen ? 1 : 0 } : undefined}
                  className={
                    "relative block w-[min(38ch,100%)] transition-opacity duration-400 ease-bd-out " +
                    "motion-reduce:transition-none " +
                    (isOpen ? "" : "pointer-events-none")
                  }
                >
                  <span className="mb-bd-12 block text-bd-h1 font-bold tracking-tight text-bd-text-primary">{step.title}</span>
                  <span className="block text-bd-body text-bd-text-secondary">{step.body}</span>
                </span>
                <img
                  src={step.screen}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={
                    "pointer-events-none absolute bottom-[-8rem] right-[-1rem] w-[min(42%,220px)] rounded-[1.5rem] opacity-0 shadow-bd-2 transition-all duration-700 ease-bd-out " +
                    (isOpen ? "translate-y-[-1rem] opacity-35" : "translate-y-4")
                  }
                />
              </button>
            );
          })}
        </Reveal>
        </div>
        </div>

        {/* ---------- mobile: plain stack ---------- */}
        <Reveal stagger={0.12} className="flex flex-col gap-bd-16 min-[834px]:hidden">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-bd-2xl bg-bd-surface-1 p-bd-24 bd-bevel">
              <span aria-hidden="true" className="mb-bd-16 flex h-bd-24 items-end gap-bd-6">
                {Array.from({ length: i + 1 }).map((_, s) => (
                  <span key={s} className="h-bd-24 w-[3px] rounded-bd-pill bg-bd-yellow" />
                ))}
              </span>
              <h3 className="m-0 mb-bd-8 text-bd-h2 font-bold tracking-tight text-bd-text-primary">{step.title}</h3>
              <p className="m-0 text-bd-body text-bd-text-secondary">{step.body}</p>
            </div>
          ))}
        </Reveal>
      </Wrap>
    </section>
  );
}
