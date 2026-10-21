import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate } from "remotion";
import { StatusBar } from "../components/Phone";
import { SCREEN } from "../lib/device";
import { BRAND } from "../lib/fonts";

/*
 * The v4 system, from video-v4/BRIEF.md: one calm cream canvas, quiet centered type, a real phone
 * as the hero, and a camera that does the emphasis. Every value here is the brief's.
 */

export const CREAM = "#FFFCEF";
export const INK = "#0D0D0D";
export const MUTED = "#8C887C";
export const YELLOW = "#FFDE59";

/** Things arriving. */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
/** Camera moves. */
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 over `[start, start + duration]`, clamped. */
export const t01 = (frame: number, start: number, duration: number, easing = EASE_OUT) =>
  interpolate(frame, [start, start + duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** Caption in: fade 0 → 1 while rising 24px over 14 frames. Caption out: fade to 0 while rising 12px over 10 frames. */
export function captionMotion(frame: number, inAt: number, outAt = Infinity): CSSProperties {
  const a = t01(frame, inAt, 14);
  const b = t01(frame, outAt, 10, EASE_IN_OUT);
  return { opacity: a * (1 - b), transform: `translateY(${(1 - a) * 24 - b * 12}px)` };
}

/** The camera's slow drift on a held shot: 1.00 → 1.03 across the shot, never frozen. */
export const drift = (frame: number, start: number, end: number) => interpolate(frame, [start, end], [1, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/**
 * A caption: centered, top at y 290, 66px Urbanist Regular, -1.6px tracking, 1.08 line height, at
 * most two lines and about 800px wide. A second sentence goes on its own line in muted grey.
 */
export function Caption({ lines, muted, top = 290, style }: { lines: string[]; muted?: string; top?: number; style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", left: 140, width: 800, top, textAlign: "center", fontFamily: BRAND, fontWeight: 400, fontSize: 66, letterSpacing: -1.6, lineHeight: 1.08, color: INK, ...style }}>
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
      {muted && <div style={{ color: MUTED }}>{muted}</div>}
    </div>
  );
}

/** The phone: 920px wide, a 16px black bezel, about 136px corners, and a soft realistic shadow. */
export const PHONE = { width: 920, bezel: 16, radius: 136, top: 640 } as const;
const SCREEN_W = PHONE.width - PHONE.bezel * 2;
/** Screen points to pixels: the real 393pt screen drawn at 888px, so the UI renders as live, sharp type. */
export const UI_SCALE = SCREEN_W / SCREEN.width;

/** A real phone, full screen, never cropped. `x` is its centre; `y` its top edge. The UI inside is drawn in screen points. */
export function Phone({ x = 540, y = PHONE.top, light = false, style, children }: { x?: number; y?: number; light?: boolean; style?: CSSProperties; children: ReactNode }) {
  const screenH = SCREEN.height * UI_SCALE;
  return (
    <div
      style={{
        position: "absolute",
        left: x - PHONE.width / 2,
        top: y,
        width: PHONE.width,
        height: screenH + PHONE.bezel * 2,
        borderRadius: PHONE.radius,
        padding: PHONE.bezel,
        boxSizing: "border-box",
        background: "#0D0D0D",
        boxShadow: "0 2px 4px rgba(40,32,10,.06), 0 18px 40px rgba(40,32,10,.10), 0 60px 120px rgba(40,32,10,.14)",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: SCREEN_W, height: screenH, borderRadius: PHONE.radius - PHONE.bezel, overflow: "hidden", background: light ? "#FFFFFF" : "#121212" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.width, height: SCREEN.height, transform: `scale(${UI_SCALE})`, transformOrigin: "0 0" }}>
          {children}
          <StatusBar color={light ? "#000" : "#fff"} />
          <div style={{ position: "absolute", left: "50%", top: 11, width: 126, height: 37, marginLeft: -63, borderRadius: 19, background: "#000", zIndex: 40 }} />
        </div>
      </div>
    </div>
  );
}

/**
 * A tap: a soft circle that expands and fades over 10 frames from `at`, 30% white on dark UI or
 * 15% black on light UI. Drawn in screen points.
 */
export function Tap({ frame, at, x, y, light = false }: { frame: number; at: number; x: number; y: number; light?: boolean }) {
  const p = (frame - at) / 10;
  if (p < 0 || p > 1) return null;
  const e = EASE_OUT(p);
  const size = 18 + 34 * e;
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: light ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.3)", opacity: 1 - p, zIndex: 60 }} />;
}

/** The one sparkle: a four-point star, filled yellow. `size` in the parent's units. */
export const Sparkle = ({ x, y, size, style }: { x: number; y: number; size: number; style?: CSSProperties }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, overflow: "visible", ...style }}>
    <path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0 Z" fill={YELLOW} />
  </svg>
);
