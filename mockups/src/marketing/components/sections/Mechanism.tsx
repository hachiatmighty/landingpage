import { LedgerCard } from "../ui/LedgerCard";
import { TbcMark } from "../ui/TbcMark";
import { Wrap } from "../ui/Wrap";
import { Reveal } from "../motion/Reveal";
import { MEMBERS, PORTRAIT_FILTER } from "../../lib/members";

/**
 * The Circle's glyph: an overlapping cluster of people that fans apart when the card is hovered,
 * so the card performs its own idea instead of illustrating it.
 *
 * This is bottom-anchored and sized to fill the tall bento cell. The alternative — a small icon at
 * the top of a two-row-tall card — left a large dead band of background in the middle of the
 * densest part of the page, which is exactly the empty-cell problem the bento is meant to avoid,
 * just moved inside a card instead of between them.
 */
function CircleGlyph() {
  return (
    <div aria-hidden="true" className="relative mt-bd-40 flex items-end justify-center">
      {/* the arc they are gathered around - the goal's ring, cropped by the card edge */}
      <span className="pointer-events-none absolute bottom-[-80px] left-1/2 h-[240px] w-[240px] -translate-x-1/2 rounded-full border border-bd-yellow/20" />
      <span className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full border border-white/6" />

      <div className="relative flex items-center">
        {MEMBERS.map((member, i) => (
          <span
            key={member.initial}
            className={
              "-ml-bd-16 block h-bd-64 w-bd-64 overflow-hidden rounded-full border " +
              "transition-all duration-700 ease-bd-spring first:ml-0 group-hover:ml-bd-8 motion-reduce:transition-none " +
              (i === 2 ? "border-bd-yellow/70" : "border-white/25 shadow-bd-2")
            }
            style={{ zIndex: 10 - i }}
          >
            <img
              src={member.src}
              alt=""
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              style={{ filter: PORTRAIT_FILTER }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Mechanism() {
  return (
    <section id="mechanism" className="py-bd-section">
      <Wrap>
        <h2
          className="mx-auto m-0 mb-bd-40 max-w-[26ch] text-center font-bold tracking-[-0.03em] text-bd-text-primary"
          style={{ fontSize: "var(--text-section)", lineHeight: "var(--text-section--line-height)" }}
        >
          Two forces. One mission. Yours.
        </h2>
        <Reveal
          stagger={0.1}
          className="grid grid-cols-1 overflow-hidden border-y border-white/15 min-[1100px]:grid-cols-2"
        >
          <article className="group flex min-h-[560px] flex-col bg-black p-bd-32 min-[834px]:p-bd-large">
            <h3 className="m-0 text-[clamp(2.25rem,3vw,3rem)] font-semibold leading-[.95] tracking-[-.035em] text-white">The Circle</h3>
            <p className="m-0 mt-bd-24 max-w-[40ch] text-bd-lead text-white/65">
              A handful of mentors, peers and friends who know what matters to you. They celebrate your wins, call
              out your excuses, and don't let you drift.
            </p>
            <div className="mt-auto">
              <CircleGlyph />
            </div>
          </article>
          <article className="flex min-h-[560px] flex-col border-t border-white/15 bg-bd-surface-1 p-bd-32 min-[834px]:p-bd-large min-[1100px]:border-l min-[1100px]:border-t-0">
            <div className="border-b border-white/15 pb-bd-40">
              <h3 className="m-0 max-w-[12ch] text-[clamp(2.25rem,3vw,3rem)] font-semibold leading-[.95] tracking-[-.035em] text-white">The Companion</h3>
              <p className="m-0 mt-bd-24 max-w-[34ch] text-bd-lead leading-relaxed text-white/65">
                An AI that stays close to your goals and catches a slip while it's still small. The longer you stay,
                the better it knows your story<TbcMark />.
              </p>
            </div>
            <div className="mt-auto pt-bd-40">
              <LedgerCard label="a goal, entered" tallyLabel="noticed this week" marks={["— R.", "— M.", "— T."]} />
            </div>
          </article>
        </Reveal>
      </Wrap>
    </section>
  );
}
