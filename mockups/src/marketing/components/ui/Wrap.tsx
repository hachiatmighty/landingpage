import type { ReactNode } from "react";

/** The page's shared content-stage container (`.wrap` in the mockup): centred, max-width capped,
 * with responsive side padding. */
export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[var(--width-stage-max)] px-bd-24 min-[834px]:px-bd-large ${className}`}>
      {children}
    </div>
  );
}
