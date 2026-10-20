import type { ReactNode } from "react";

/**
 * A device frame for the app previews.
 *
 * The frame does real work here beyond decoration: the previews inside are honest abstractions
 * rather than screenshots, and without a phone around them they read as random coloured bars. The
 * frame is what tells the reader "this is a screen", which is the whole point of the section.
 *
 * Built from nested rounded rects — outer titanium edge, inner bezel, screen — because that layered
 * construction is what makes a CSS phone look machined instead of like a rounded rectangle.
 */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={
        "relative aspect-[9/19] w-full rounded-[2.2rem] p-[3px] " +
        "bg-gradient-to-b from-white/28 via-white/6 to-white/16 shadow-bd-2 " +
        className
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[#050505] p-[5px]">
        {/* dynamic island */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-bd-8 z-20 h-bd-12 w-[28%] -translate-x-1/2 rounded-bd-pill bg-black"
        />
        {/* screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] bg-bd-surface-0">{children}</div>
        {/* screen glare: one diagonal sheen across the top-left, low opacity */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/8 via-transparent to-transparent"
        />
      </div>
    </div>
  );
}
