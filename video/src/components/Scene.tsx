import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ramp } from "../lib/anim";
import { INK, PAPER } from "../lib/layout";

/** Frames each scene overlaps the one before it while it transitions in. */
export const OVERLAP = 14;

const BACKGROUNDS = {
  dark: `radial-gradient(1100px 900px at 50% 28%, rgba(255,222,89,0.09), transparent 62%), ${INK}`,
  light: `radial-gradient(1100px 900px at 50% 28%, rgba(255,222,89,0.22), transparent 60%), ${PAPER}`,
} as const;

/**
 * One scene: its background and how it arrives over the previous scene. Moving between the two
 * worlds (Sade's dark app, Dami's light inbox) is an iris from the centre; staying in one world is
 * a cross-fade.
 */
export function Scene({ bg, enter = "fade", children }: { bg: keyof typeof BACKGROUNDS; enter?: "iris" | "fade" | "none"; children: ReactNode }) {
  const frame = useCurrentFrame();
  const t = enter === "none" ? 1 : ramp(frame, 0, OVERLAP);
  return (
    <AbsoluteFill
      style={{
        background: BACKGROUNDS[bg],
        overflow: "hidden",
        opacity: enter === "fade" ? t : 1,
        clipPath: enter === "iris" && t < 1 ? `circle(${t * 75}% at 50% 55%)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
