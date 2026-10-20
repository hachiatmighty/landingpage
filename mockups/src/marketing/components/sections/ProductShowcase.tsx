import { useCallback, useEffect, useRef, useState } from "react";
import { Tbd, TbcMark } from "../ui/TbcMark";
import { ShowcaseArt, type ShowcaseVariant } from "../ui/ShowcaseArt";
import { PhoneFrame } from "../ui/PhoneFrame";
import { Wrap } from "../ui/Wrap";
import { useReducedMotion } from "../../lib/useReducedMotion";
import { ScrollTrigger, useGSAP } from "../../lib/gsap";

interface Slide {
  art: ShowcaseVariant;
  label: string;
  image?: string;
  tbc?: boolean;
  caption?: string;
  hasPlay?: boolean;
}

const slides: Slide[] = [
  { art: "goals", label: "Goal view", caption: "Quarterly and annual, by category." },
  {
    art: "checkin",
    label: "Weekly check-in",
    caption: "Monday messages, progress your Circle can see.",
  },
  { art: "circle", image: "/marketing/community-reference.webp", label: "Your Circle", caption: "Up to 5 people, up to 50 on Premium Plus." },
  {
    art: "companion",
    label: "The Companion",
    tbc: true,
    hasPlay: true,
  },
];

/**
 * The app preview carousel: one screen at a time, advancing on its own.
 *
 * This replaced a static four-up row. Showing all four simultaneously meant each phone was a
 * quarter of the stage wide — small enough that the previews read as four dark rectangles, and the
 * one the reader should be looking at was never distinguished from the three they should not.
 * Presenting them one at a time buys the active screen real size and gives the section a reason to
 * hold attention.
 *
 * Movement is a native scroll-snap track scrolled programmatically, not a transform with computed
 * offsets. That means the browser owns the centring maths (no slide-width arithmetic to get wrong
 * at a breakpoint), touch swipe and trackpad scroll work with no code, and the neighbouring slides
 * genuinely sit either side to be peeked at rather than being faked with absolute positioning.
 * `track.scrollTo` is used rather than `scrollIntoView`, because the latter will also scroll the
 * *page* vertically to bring the element into view — here it would yank the reader down the page
 * every time the carousel advanced.
 *
 * Autoplay follows the same contract as the How-It-Works accordion: on screen only, hover pauses,
 * an explicit interaction stops it for good, and reduced-motion disables it entirely.
 */
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const programmaticScroll = useRef(false);
  const settleTimer = useRef<number | undefined>(undefined);

  const reducedMotion = useReducedMotion();
  useGSAP(
    () => {
      const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
      if (!media.matches) return;

      const LAST = slides.length - 1;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center center",
        // Was a flat 2.4 viewports — 1,843px of scrolling stuck on one section, 17% of the whole
        // page. Now roughly half a viewport per slide, so the pin lasts as long as it has content.
        end: () => `+=${window.innerHeight * 0.5 * LAST}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // No `snap` here on purpose. It animated the *vertical* scroll while the slide's CSS
        // transition animated scale/opacity and `track.scrollTo` animated the *horizontal* scroll —
        // three animations with different durations all retargeting each other on every frame,
        // which is what made this section judder.
        onUpdate: ({ progress }) => {
          const raw = progress * LAST;
          setActive((current) =>
            // Hysteresis. Rounding alone flips exactly on the midpoint, so a pixel of scroll jitter
            // there toggled the slide back and forth, restarting the 700ms transition each time.
            // Requiring the reader to travel well past the midpoint makes the change decisive.
            Math.abs(raw - current) > 0.62 ? Math.max(0, Math.min(LAST, Math.round(raw))) : current,
          );
        },
      });
    },
    { scope: sectionRef },
  );

  /** Take manual control: used by the dots, the arrows, and a direct swipe. */
  const select = useCallback((index: number) => {
    setActive(((index % slides.length) + slides.length) % slides.length);
  }, []);

  // Centre the active slide inside the track whenever it changes.
  useEffect(() => {
    const track = trackRef.current;
    const slide = slideRefs.current[active];
    if (!track || !slide) return;

    programmaticScroll.current = true;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    // Ignore the scroll events our own scrollTo is about to emit, or the settle handler below
    // would immediately "correct" active to whatever it measures mid-animation.
    const id = window.setTimeout(() => {
      programmaticScroll.current = false;
    }, 600);
    return () => window.clearTimeout(id);
  }, [active, reducedMotion]);

  // Keep the indicator honest when the reader swipes the track directly.
  const handleScroll = useCallback(() => {
    if (programmaticScroll.current) return;
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const centre = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      setActive(nearest);
    }, 140);
  }, []);

  const current = slides[active];

  return (
    <section id="showcase" className="overflow-hidden py-bd-section">
      <Wrap>
        <h2
          className="mx-auto m-0 mb-bd-large max-w-[26ch] text-center font-bold tracking-[-0.03em] text-bd-text-primary"
          style={{ fontSize: "var(--text-section)", lineHeight: "var(--text-section--line-height)" }}
        >
          Goals, check-ins, your Circle and the Companion.
        </h2>
      </Wrap>

      <div>
      {/* Pin host. ScrollTrigger wraps the pinned element in a .pin-spacer, which changes that
            element's parent behind React's back. Keeping the pinned node as the sole child of this
            wrapper means React never has to position a sibling against it, which is what caused
            "insertBefore: node is not a child of this node" during re-render. */}
      <div
        ref={sectionRef}
        className="relative z-10 bg-bd-surface-0 py-bd-8"
        role="region"
        aria-roledescription="carousel"
        aria-label="a look at the app"
      >
        <ul
          ref={trackRef}
          onScroll={handleScroll}
          className={
            "m-0 flex list-none snap-x snap-mandatory gap-bd-32 overflow-x-auto px-bd-24 py-bd-8 " +
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
            // Fade the track into the page at both edges. Without this the neighbouring phones are
            // simply sliced off by the viewport, which reads as a layout bug rather than a peek.
            "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] " +
            "[-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          }
        >
          {slides.map((slide, i) => {
            const isActive = i === active;
            return (
              <li
                key={slide.label}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}: ${slide.label}`}
                // The first and last slides need half the track's width as padding either side, or
                // the browser cannot scroll far enough to bring them to the centre.
                className={
                  "w-[min(56vw,220px)] flex-none snap-center transition-all duration-700 ease-bd-out " +
                  "first:ml-[calc(50%-min(28vw,110px))] last:mr-[calc(50%-min(28vw,110px))] " +
                  "motion-reduce:transition-none " +
                  (isActive ? "scale-100 opacity-100" : "scale-[0.84] opacity-40")
                }
              >
                <div data-showcase-shell>
                  {slide.image ? (
                    <img src={slide.image} alt="Bestday Community screen" className="block aspect-[9/19] w-full rounded-[2.2rem] object-cover" loading="lazy" />
                  ) : (
                    <PhoneFrame>
                      <ShowcaseArt variant={slide.art} />
                      {slide.hasPlay && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-1/2 flex h-bd-48 w-bd-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/80"
                        >
                          <span className="ml-2 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-bd-yellow" />
                        </span>
                      )}
                    </PhoneFrame>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Caption for the active slide only. Keyed on `active` so React swaps the node and the
            fade-in animation re-runs on every change. */}
        <div key={active} className="mx-auto mt-bd-20 max-w-[36ch] px-bd-24 text-center">
          <p className="m-0 mb-bd-4 font-bd-mono text-bd-micro uppercase tracking-[0.12em]">
            <Tbd>
              {current.label}
              {current.tbc && <TbcMark />}
            </Tbd>
          </p>
          {current.caption && <p className="m-0 text-bd-body text-bd-text-primary">{current.caption}</p>}
        </div>

        {/* ---------- controls ---------- */}
        <div className="mt-bd-24 flex items-center justify-center gap-bd-24">
          <CarouselArrow direction="prev" onClick={() => select(active - 1)} />

          <div className="flex items-center gap-bd-12">
            {slides.map((slide, i) => {
              const isActive = i === active;
              return (
                <button
                  key={slide.label}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Show ${slide.label}`}
                  aria-current={isActive}
                  className="group relative inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center border-none bg-transparent p-0"
                >
                  <span
                    aria-hidden="true"
                    className={
                      "block h-bd-6 overflow-hidden rounded-bd-pill transition-all duration-400 ease-bd-out " +
                      "motion-reduce:transition-none " +
                      (isActive ? "w-bd-40 bg-white/25" : "w-bd-6 bg-white/25 group-hover:bg-white/50")
                    }
                  >
                    {isActive && <span className="block h-full w-full rounded-bd-pill bg-bd-yellow" />}
                  </span>
                </button>
              );
            })}
          </div>

          <CarouselArrow direction="next" onClick={() => select(active + 1)} />
        </div>
      </div>
      </div>
    </section>
  );
}

function CarouselArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous screen" : "Next screen"}
      className="inline-flex h-bd-hit-target w-bd-hit-target cursor-pointer items-center justify-center rounded-bd-pill border border-white/15 bg-bd-surface-1 text-bd-text-primary transition-colors duration-150 ease-bd-out hover:border-bd-yellow/50 hover:text-bd-yellow motion-reduce:transition-none"
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-bd-16 w-bd-16">
        <path
          d={isPrev ? "M14 8H2M2 8l5-5M2 8l5 5" : "M2 8h12M14 8l-5-5M14 8l-5 5"}
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
