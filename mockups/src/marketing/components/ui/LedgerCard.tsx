import type { ReactNode } from "react";

export interface LedgerCardProps {
  label: string;
  value?: ReactNode;
  valueClassName?: string;
  tallyLabel?: string;
  /** Initials shown under each tally-stroke, e.g. "— R.". Mutually exclusive with `placeholder`. */
  marks?: string[];
  /** Designed empty-state replacing the tally marks — the Proof section's not-yet-real-members state. */
  placeholder?: ReactNode;
  /** Optional closing line. The Mechanism ledger runs without one; Proof uses it for its
   * honest not-yet-written placeholder. */
  footnote?: ReactNode;
  footnoteClassName?: string;
  /** The Proof section gives its ledger a slight hand-placed rotation. */
  rotate?: boolean;
  className?: string;
}

/** The perforated-top-edge signature card: a page torn from a guest-book binding. Used in both the
 * Mechanism section ("a goal, entered") and the Proof section (the not-yet-real-members placeholder).
 *
 * Redesigned to actually sit above the page: surface-1 with a real border and shadow-bd-2, instead of
 * the old cream-on-cream card that only had a hairline outline to separate it from the background. */
export function LedgerCard({
  label,
  value,
  valueClassName = "",
  tallyLabel,
  marks,
  placeholder,
  footnote,
  footnoteClassName = "",
  rotate = false,
  className = "",
}: LedgerCardProps) {
  return (
    <div
      className={
        // No max-width or auto-margin here on purpose: this card is used both as a bento cell (where
        // it must fill its track) and as a standalone block (where the caller caps it). Baking a
        // width in would make the bento version float in the middle of its own column.
        "relative flex w-full flex-col rounded-bd-2xl border-t-0 " +
        "bg-gradient-to-b from-bd-surface-2/90 to-bd-surface-1 px-bd-24 py-bd-32 bd-bevel " +
        (rotate ? "rotate-[-1deg] " : "") +
        className
      }
    >
      {/* Perforated top edge — the guest-book-page silhouette, kept as the page's one signature card
          shape (03-selection.md §3.8: only two shapes exist systemically otherwise). Rendered as a
          real element rather than a ::before pseudo so the repeating-gradient stays simple JSX. */}
      <div
        aria-hidden="true"
        className="absolute left-[var(--radius-2xl)] right-[var(--radius-2xl)] top-0 h-px"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.4) 0 5px, transparent 5px 10px)",
        }}
      />

      <div className="mb-bd-24 flex flex-wrap items-baseline justify-between gap-bd-16 border-b border-white/10 pb-bd-16">
        <span className="bd-meta-label">{label}</span>
        {value && <span className={`text-bd-h3 font-bold text-bd-text-primary ${valueClassName}`}>{value}</span>}
      </div>

      {tallyLabel && <p className="mb-bd-16 font-bd-mono text-bd-caption text-bd-text-tertiary">{tallyLabel}</p>}

      {marks && (
        <div className="mb-bd-24 flex flex-wrap items-end gap-bd-24">
          {marks.map((who, i) => (
            <div key={i} className="flex flex-col items-center gap-bd-8">
              <div className="h-bd-32 w-[3px] rounded-bd-pill bg-bd-yellow" />
              <span className="rotate-[-1.5deg] font-bd-mono text-bd-caption text-bd-text-secondary">{who}</span>
            </div>
          ))}
        </div>
      )}

      {placeholder && (
        /* A designed "not yet" empty state, not a dashed box: three member-slot glyphs (echoing the
           Circle motif used everywhere else on the page) sitting on a raised surface-2 chip, with the
           honest caption underneath rather than inside a wireframe. */
        <div className="mb-bd-24 flex flex-col items-center gap-bd-12 rounded-bd-xl border border-dashed border-bd-line bg-bd-surface-0 px-bd-16 py-bd-24 shadow-bd-1">
          <div className="flex items-center gap-bd-8" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex h-bd-32 w-bd-32 items-center justify-center rounded-full border border-dashed border-bd-line text-bd-body-md font-semibold text-bd-text-tertiary"
              >
                {i === 2 ? "+" : "?"}
              </span>
            ))}
          </div>
          <p className="m-0 text-center text-bd-caption text-bd-text-tertiary">{placeholder}</p>
        </div>
      )}

      {footnote && (
        <p className={`m-0 mt-auto italic text-bd-text-primary ${footnoteClassName || "text-bd-h2 font-bold tracking-tight"}`}>
          {footnote}
        </p>
      )}
    </div>
  );
}
