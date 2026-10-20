import { sim } from "./motion";

/**
 * A fingertip landing on the screen at (x, y) in points: the cue that the mockup is being used, not
 * just shown. Phase A taps at about 20% of the loop, phase B at about 47%.
 */
export const Tap = ({ x, y, phase = "a" }: { x: number | string; y: number | string; phase?: "a" | "b" }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 54,
      height: 54,
      borderRadius: 27,
      background: "rgba(255,255,255,0.35)",
      border: "2px solid rgba(255,255,255,0.7)",
      boxShadow: "0 0 0 8px rgba(255,255,255,0.08)",
      pointerEvents: "none",
      zIndex: 50,
      opacity: 0,
      ...sim(phase === "a" ? "tap-a" : "tap-b"),
    }}
  />
);
