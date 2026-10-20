import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp } from "../lib/anim";
import { INK } from "../lib/layout";

/** Frames two scenes share while one swipes out and the next swipes in. */
export const OVERLAP = 14;

/**
 * One scene on the brand black. Scenes change with a horizontal swipe, the way a carousel moves:
 * the next scene pushes in from the right as this one leaves to the left.
 */
export function Scene({ first = false, last = false, children }: { first?: boolean; last?: boolean; children: ReactNode }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const enter = first ? 1 : ramp(frame, 0, OVERLAP);
  const exit = last ? 0 : ramp(frame, durationInFrames - OVERLAP, OVERLAP);
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden", transform: `translateX(${(1 - enter) * 100 - exit * 100}%)` }}>
      {children}
    </AbsoluteFill>
  );
}
