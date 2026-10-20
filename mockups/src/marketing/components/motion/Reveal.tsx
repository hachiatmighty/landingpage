import { useRef, type ElementType, type ReactNode } from "react";
import { DUR, EASE, ENTER_START, gsap, useGSAP } from "../../lib/gsap";

export interface RevealProps {
  children: ReactNode;
  /** Render as something other than a div, so a reveal wrapper never breaks document semantics. */
  as?: ElementType;
  /** Seconds of delay after the trigger fires. Use to cascade siblings that share one trigger. */
  delay?: number;
  /** Stagger direct children instead of moving the wrapper as a single block. */
  stagger?: number;
  /** Travel distance in px. 0 gives a pure fade (for elements whose position is load-bearing). */
  y?: number;
  /** Adds a subtle scale-up to the entrance — reserved for cards and media, not body copy. */
  scale?: boolean;
  className?: string;
}

/**
 * The page's one-shot scroll entrance. Everything that appears on scroll uses this, so entrances
 * share a single duration, easing and trigger point.
 *
 * Two things worth noting about the implementation:
 *
 * `gsap.matchMedia` (not a plain `prefers-reduced-motion` check) is what makes this safe: it scopes
 * the animation to the media query and automatically reverts it — killing the ScrollTrigger and
 * clearing the inline transform — if the user flips the OS setting mid-session. A manual check
 * would leave whatever state the element was in at the time.
 *
 * The reduced-motion branch is not "no animation"; it is an opacity-only fade with no travel. Users
 * who set that preference are asking not to be moved, not to be shown a page whose content pops in
 * with no transition at all.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  stagger,
  y = 28,
  scale = false,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // When staggering, the targets are the children; otherwise the wrapper moves as one block.
      const targets = stagger ? Array.from(el.children) : el;
      if (stagger && (targets as Element[]).length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          motionReduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { motionReduced } = context.conditions as { motionReduced: boolean };

          gsap.from(targets, {
            opacity: 0,
            y: motionReduced ? 0 : y,
            scale: scale && !motionReduced ? 0.94 : 1,
            duration: motionReduced ? DUR.fast : DUR.slow,
            ease: EASE,
            delay,
            stagger: stagger ?? 0,
            scrollTrigger: { trigger: el, start: ENTER_START, once: true },
          });
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
