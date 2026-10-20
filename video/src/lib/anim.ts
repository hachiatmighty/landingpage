import { Easing, interpolate, spring } from "remotion";

/**
 * Frame-driven motion helpers. Remotion renders one frame at a time, so nothing here reads the
 * clock: every value is a pure function of the frame number.
 */

export const FPS = 30;
export const s = (seconds: number) => Math.round(seconds * FPS);

/** The mockups' house ease, cubic-bezier(.2,.8,.2,1). */
export const EASE = Easing.bezier(0.2, 0.8, 0.2, 1);

/** 0 → 1 between `start` and `start + duration`, eased and clamped. */
export const ramp = (frame: number, start: number, duration: number, easing = EASE) =>
  interpolate(frame, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Linear mix between two numbers. */
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** A springy 0 → 1 that settles with a slight overshoot. */
export const pop = (frame: number, start: number, damping = 14) =>
  spring({ frame: frame - start, fps: FPS, config: { damping, stiffness: 170, mass: 0.9 } });

/** In at `start`, out at `end`: a value that fades up and back down. */
export const window = (frame: number, start: number, end: number, fade = 8) =>
  Math.min(ramp(frame, start, fade), 1 - ramp(frame, end - fade, fade));

/** The first characters of `text` typed since `start`, at `cps` characters a second. */
export const typed = (text: string, frame: number, start: number, cps = 16) =>
  text.slice(0, Math.max(0, Math.floor(((frame - start) * cps) / FPS)));

/** Frames needed to type `text` at `cps`. */
export const typeDuration = (text: string, cps = 16) => Math.ceil((text.length * FPS) / cps);

/** A button press around frame `at`: dips to `depth` and springs back. */
export const press = (frame: number, at: number, depth = 0.94) => {
  const down = ramp(frame, at - 3, 3);
  const up = ramp(frame, at + 2, 6);
  return 1 - (1 - depth) * (down - up);
};

/** Blinking text caret, on for half a second, off for half. */
export const caretOn = (frame: number) => Math.floor(frame / (FPS / 2)) % 2 === 0;
