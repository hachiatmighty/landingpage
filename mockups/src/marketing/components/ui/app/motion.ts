import type { CSSProperties } from "react";
import "./motion.css";

/** Length of one simulated-interaction loop, shared by every mockup so their beats line up. */
export const SIM_LOOP = 8;

type SimName =
  | "tap-a" | "tap-b" | "press-a" | "press-b" | "in-a" | "in-b" | "out-a" | "out-b"
  | "rise-out" | "rise-in" | "rise-out-b" | "rise-in-b" | "dim" | "strike" | "fill" | "expand"
  | "pop-b" | "float" | "zoom" | "typing" | "message" | "spotlight";

/** Inline style that plays one beat of the loop (see motion.css). */
export const sim = (name: SimName, { delay = 0, duration = SIM_LOOP, ease = "cubic-bezier(.2,.8,.2,1)" } = {}): CSSProperties => ({
  animation: `bd-sim-${name} ${duration}s ${ease} ${delay}s infinite both`,
});
