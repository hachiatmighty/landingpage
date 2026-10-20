import type { ReactNode } from "react";

/**
 * The device around the app replicas: a titanium edge and a black bezel. The screen inside sets the
 * proportions (iPhone 16, 393x852pt) and draws its own Dynamic Island at native size, so the frame
 * only wraps it. Corner radii are percentages of the screen, so they stay true at any width.
 */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={"relative w-full rounded-[17%/7.8%] bg-gradient-to-b from-white/28 via-white/6 to-white/16 p-[3px] shadow-bd-2 " + className}>
      <div className="relative w-full overflow-hidden rounded-[16.4%/7.6%] bg-[#050505] p-[3.5%]">
        <div className="relative w-full overflow-hidden rounded-[14%/6.46%]">{children}</div>
        {/* screen glare: one diagonal sheen across the top-left, low opacity */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
      </div>
    </div>
  );
}
