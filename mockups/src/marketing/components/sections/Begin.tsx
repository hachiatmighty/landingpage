import { useRef } from "react";
import { Wrap } from "../ui/Wrap";
import { Reveal } from "../motion/Reveal";
import { gsap, useGSAP } from "../../lib/gsap";

/**
 * The welcome messages, staged as a real conversation arriving rather than two static quote boxes.
 *
 * The typing indicator is what sells it: each message is preceded by three pulsing dots that then
 * hand off to the bubble. That is the actual experience being described ("Kay welcomes you
 * himself"), so showing it beats describing it.
 *
 * The whole panel is a single labelled group for assistive tech and the dots are aria-hidden — a
 * screen reader should get the two messages, not a play-by-play of an animation.
 */
function WelcomeThread() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Plays once, on arrival, and then stays put. It used to loop forever and fade the
        // messages back out at the end of each cycle, which meant that for a couple of seconds
        // out of every cycle this large panel was simply empty — and a reader arriving mid-loop
        // met a blank card. A conversation arriving is a one-time event; replaying it is theatre.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
          defaults: { ease: "power3.out" },
        });

        [0, 1].forEach((i) => {
          tl.fromTo(
            `[data-typing="${i}"]`,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.3, transformOrigin: "left center" },
            i === 0 ? 0.2 : ">1.1",
          )
            .to(`[data-typing="${i}"]`, { opacity: 0, duration: 0.2 }, ">0.85")
            .fromTo(
              `[data-msg="${i}"]`,
              { opacity: 0, y: 14, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, transformOrigin: "left bottom" },
              "<",
            );
        });

        tl.from("[data-invite]", { opacity: 0, y: 16, duration: 0.6 }, ">0.2");
      });

      // Without motion, everything is simply present.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-typing]", { opacity: 0 });
        gsap.set("[data-msg], [data-invite]", { opacity: 1, y: 0, scale: 1 });
      });
    },
    { scope: ref },
  );

  const messages = [
    "Hey, I'm Kay, Bestday's founder. You're in.",
    "Come to this month's new-member call and we'll set your goals together.",
  ];

  return (
    <div
      ref={ref}
      role="group"
      aria-label="example of the welcome messages a new member receives"
      className="relative rounded-bd-2xl bg-gradient-to-b from-bd-surface-2/90 to-bd-surface-1 p-bd-24 bd-bevel min-[834px]:p-bd-32"
    >

      <div className="relative flex flex-col gap-bd-16">
        {messages.map((message, i) => (
          <div key={i} className="relative">
            {/* typing indicator, occupying the same slot the bubble will land in */}
            <span
              data-typing={i}
              aria-hidden="true"
              className="absolute left-0 top-0 flex items-center gap-bd-4 rounded-bd-2xl rounded-bl-bd-sm border border-white/10 bg-bd-surface-0 px-bd-16 py-bd-12 opacity-0"
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-bd-6 w-bd-6 animate-pulse rounded-full bg-bd-text-tertiary"
                  style={{ animationDelay: `${d * 160}ms` }}
                />
              ))}
            </span>

            <p
              data-msg={i}
              className="m-0 w-fit max-w-[42ch] rounded-bd-2xl rounded-bl-bd-sm border border-white/10 bg-bd-surface-0 px-bd-16 py-bd-12 text-bd-body-md text-bd-text-primary shadow-bd-1"
            >
              {message}
            </p>
          </div>
        ))}
      </div>

      {/*
        The call invitation as a calendar chip.

        The date tile and the text used to say the same things twice — the tile read "SEP / Thu"
        next to a line that began "New members, September · Thu 3:00pm" — and everything was one
        flat mono run strung together with four interpunct separators. The tile is now the sole
        carrier of the month and day, the title gets its own weight, and only the details that are
        genuinely a list stay in the meta line.
      */}
      <div
        data-invite
        className="relative mt-bd-24 flex items-center gap-bd-16 rounded-bd-xl border border-bd-yellow/25 bg-bd-surface-0/70 px-bd-16 py-bd-12"
      >
        {/* The tile is sized by its own padding rather than pinned to a 40x40 square. At a fixed
            size the two stacked words filled it almost exactly — "Thu" at 15px bold left about 6px
            either side and the pair left ~4px top and bottom — so it read as text crammed into a
            box rather than a date on a tile. px/py let it breathe and keep the optical inset even
            on all four sides.
            Note: this project's spacing scale is "number = pixels" but declares no `2`, so `mt-2`
            was silently falling back to Tailwind's 0.25rem multiplier (8px) — far too much between
            two lines of a compact tile. The declared `1` step via mt-bd-4 (4px) is what was wanted. */}
        <span
          aria-hidden="true"
          className="flex flex-none flex-col items-center justify-center rounded-bd-lg bg-bd-yellow px-bd-12 py-bd-8 leading-none text-black"
        >
          <span className="font-bd-mono text-[9px] font-bold uppercase tracking-[0.12em]">Sep</span>
          <span className="mt-bd-4 text-bd-body-md font-bold leading-none">Thu</span>
        </span>
        <span className="min-w-0">
          <span className="block text-bd-body-md font-semibold leading-snug text-bd-text-primary">
            Goal-setting with Kay
          </span>
          <span className="mt-bd-4 block font-bd-mono text-bd-caption leading-none text-bd-text-tertiary">
            New members · 3:00pm · 45 min
          </span>
        </span>
      </div>
    </div>
  );
}

export function Begin() {
  return (
    <section id="begin" className="overflow-hidden py-bd-section">
      <Wrap>
        <h2
          className="mx-auto m-0 max-w-[26ch] text-center font-bold tracking-[-0.03em] text-bd-text-primary"
          style={{ fontSize: "var(--text-section)", lineHeight: "var(--text-section--line-height)" }}
        >
          Every new member meets Kay.
        </h2>

        <div className="mx-auto mt-bd-large w-full max-w-[900px]">
          <Reveal y={40}>
            <WelcomeThread />
          </Reveal>
        </div>

      </Wrap>
    </section>
  );
}
