export type ShowcaseVariant = "goals" | "checkin" | "circle" | "companion";

import { MEMBERS, PORTRAIT_FILTER } from "../../lib/members";

/**
 * Abstract screen art for the phone previews.
 *
 * These are deliberately not simulated screenshots: no real product copy, no fake chrome. They are
 * schematic compositions — rows, chips, a member cluster, an orb — that suggest the shape of each
 * screen without claiming to be it, which is the honest option while the real screens are unfinished.
 *
 * Contrast note: the first pass built these from `border`/`border-soft` fills, which land around
 * #2A2A2A. Inside a phone frame on a near-black page that produced four rectangles of almost
 * uniform darkness — the previews were technically present and visually absent. Everything here now
 * uses explicit white-alpha and accent values chosen to read against #0D0D0D at thumbnail size.
 */

const bar = "rounded-bd-pill";

export function ShowcaseArt({ variant }: { variant: ShowcaseVariant }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col gap-bd-12 overflow-hidden bg-gradient-to-b from-[#1C1C1C] to-[#0F0F0F] p-bd-16 pt-bd-32"
    >
      {/* ambient accent bloom, top-right */}

      {variant === "goals" && (
        <>
          <div className={`${bar} h-bd-8 w-2/5 bg-bd-yellow`} />
          <div className="mt-bd-8 flex flex-col gap-bd-8">
            {[
              "w-full bg-white/45",
              "w-4/5 bg-white/28",
              "w-3/5 bg-white/28",
              "w-11/12 bg-white/28",
            ].map((cls, i) => (
              <div key={i} className={`${bar} h-bd-8 ${cls}`} />
            ))}
          </div>
          {/* a goal row with a progress track, the one piece of real structure */}
          <div className="mt-auto rounded-bd-lg border border-white/12 bg-white/6 p-bd-12">
            <div className={`${bar} mb-bd-8 h-bd-6 w-3/5 bg-white/55`} />
            <div className={`${bar} h-bd-6 w-full bg-white/12`}>
              <div className={`${bar} h-bd-6 w-2/3 bg-bd-yellow`} />
            </div>
          </div>
        </>
      )}

      {variant === "checkin" && (
        <>
          {/* a week of check-ins, four done */}
          <div className="flex gap-bd-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-bd-40 flex-1 rounded-bd-md ${
                  i < 4 ? "bg-bd-yellow" : "border border-white/20 bg-white/5"
                }`}
              />
            ))}
          </div>
          <div className="mt-bd-8 flex flex-col gap-bd-8">
            <div className={`${bar} h-bd-8 w-3/4 bg-white/45`} />
            <div className={`${bar} h-bd-8 w-1/2 bg-white/28`} />
          </div>
          <div className="mt-auto rounded-bd-lg border border-white/12 bg-white/6 p-bd-12">
            <div className={`${bar} mb-bd-6 h-bd-6 w-4/5 bg-white/45`} />
            <div className={`${bar} h-bd-6 w-2/5 bg-white/25`} />
          </div>
        </>
      )}

      {variant === "circle" && (
        <>
          <div className="flex flex-1 flex-col items-center justify-center gap-bd-16">
            {/* the actual Circle, as faces */}
            <div className="flex items-center">
              {MEMBERS.slice(0, 4).map((member, i) => (
                <span
                  key={member.initial}
                  className={`-ml-bd-8 block h-bd-32 w-bd-32 overflow-hidden rounded-full border first:ml-0 ${
                    i === 1 ? "border-bd-yellow" : "border-white/35"
                  }`}
                  style={{ zIndex: 4 - i }}
                >
                  <img
                    src={member.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ filter: PORTRAIT_FILTER }}
                  />
                </span>
              ))}
              <span className="-ml-bd-8 flex h-bd-32 w-bd-32 items-center justify-center rounded-full border border-dashed border-bd-yellow/60 bg-bd-surface-0 text-bd-body-md font-bold text-bd-yellow">
                +
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-bd-8">
            <div className={`${bar} h-bd-8 w-3/4 bg-white/40`} />
            <div className={`${bar} h-bd-8 w-1/2 bg-white/25`} />
          </div>
        </>
      )}

      {variant === "companion" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-bd-24">
          <div className="relative flex h-[110px] w-[110px] items-center justify-center">
            <span className="absolute h-bd-48 w-bd-48 rounded-full bg-bd-yellow/45 blur-md" />
            <span className="absolute h-bd-20 w-bd-20 rounded-full bg-bd-yellow" />
          </div>
          <div className="flex w-full flex-col gap-bd-8">
            <div className={`${bar} h-bd-8 w-4/5 bg-white/35`} />
            <div className={`${bar} h-bd-8 w-3/5 bg-white/22`} />
          </div>
        </div>
      )}
    </div>
  );
}
