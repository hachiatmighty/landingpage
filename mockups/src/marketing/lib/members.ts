/**
 * The stand-in Circle used by every illustration on the page — the hero constellation, the closing
 * constellation, and the Mechanism card's cluster — so the same five faces recur and read as one
 * consistent group of people rather than three unrelated sets of avatars.
 *
 * These are placeholder portraits (300x300, vendored into /public rather than hot-linked, so the
 * page has no third-party image dependency at runtime) standing in until real member photography
 * exists. They are rendered desaturated with a slight contrast lift, which is both a styling choice
 * — full-colour snapshots fight a monochrome-plus-yellow palette — and an honest one: they read as
 * treated imagery rather than as identifiable individuals being claimed as customers.
 *
 * Only initials are ever shown as text next to them, never invented names, for the same reason the
 * Proof section refuses to invent testimonials.
 */
export interface Member {
  /** Initial shown when the photo has not loaded, and in the ledger's tally marks. */
  initial: string;
  src: string;
}

export const MEMBERS: Member[] = [
  { initial: "R", src: "/members/r.jpg" },
  { initial: "M", src: "/members/m.jpg" },
  { initial: "T", src: "/members/t.jpg" },
  { initial: "J", src: "/members/j.jpg" },
  { initial: "S", src: "/members/s.jpg" },
];

/** The desaturating treatment applied wherever a member portrait appears. */
export const PORTRAIT_FILTER = "grayscale(1) contrast(1.08) brightness(0.95)";
