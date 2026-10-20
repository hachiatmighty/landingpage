import type { ReactNode } from "react";

/** The quiet "unconfirmed capability" superscript marker (AI memory, human coach, cohort mechanics).
 * Explained once, near the footer, by `TbcLegend` below. */
export function TbcMark() {
  return <sup className="ml-px text-[0.7em] font-medium text-bd-text-tertiary">†</sup>;
}

/** The shared legend sentence explaining the † mark. Appears once per section that uses it (pricing
 * cards, footer) matching the mockup's repeated `.tbc-legend` paragraph. */
export function TbcLegend({ className = "" }: { className?: string }) {
  return (
    <p className={`text-bd-caption text-bd-text-tertiary ${className}`}>
      † Some capabilities are still rolling out to members.
    </p>
  );
}

/** The "to-be-delivered" convention: honest "this content doesn't exist yet" marker, distinct from
 * TbcMark — italic + muted, no brackets, so it reads as a deliberately unfilled slot. */
export function Tbd({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`italic font-normal !text-bd-text-tertiary ${className}`}>{children}</span>;
}
