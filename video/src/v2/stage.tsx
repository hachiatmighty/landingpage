import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { Sparkle as SparkleIcon } from "lucide-react";
import { mix, pop, ramp } from "../lib/anim";
import { SCREEN } from "../lib/device";
import { BRAND } from "../lib/fonts";
import { DAMI, SADE, YELLOW } from "../lib/layout";

/*
 * The v2 stage. There is no phone frame: every app and email state is shown through one cropped
 * window into the 393x852pt screen, at one scale (the screen's width fills the window). Emphasis
 * comes from moving the camera inside the window and, once, from pushing in. Copy sits above the
 * window on a shared baseline.
 */

/** Side margin for copy and the window, from the storyboard's cover spec. */
export const MARGIN = 64;
/** The window into the UI: y 660 to 1500, the cover's "goal card crop". */
export const WIN = { x: MARGIN, y: 660, w: 1080 - MARGIN * 2, h: 840, r: 44 } as const;
/** The one device scale: the screen's width fills the window (about 2.4x actual size). */
export const BASE = WIN.w / SCREEN.width;
/** The push-in on Dami's reply (and the cover): the bubble at 2.5x actual size. */
export const HERO = 2.5;

/** Where the camera looks: the screen point (in pt) at the window's centre, and the scale. */
export interface Cam {
  cx: number;
  cy: number;
  scale: number;
}

export const cam = (cy: number, scale: number = BASE, cx = SCREEN.width / 2): Cam => ({ cx, cy, scale });
export const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({ cx: mix(a.cx, b.cx, t), cy: mix(a.cy, b.cy, t), scale: mix(a.scale, b.scale, t) });

/** The cropped view into one phone's screen. `children` are drawn in screen points. */
export function UIWindow({ view, light = false, style, children }: { view: Cam; light?: boolean; style?: CSSProperties; children: ReactNode }) {
  const tx = WIN.w / 2 - view.cx * view.scale;
  const ty = WIN.h / 2 - view.cy * view.scale;
  const bg = light ? "#FFFFFF" : "#121212";
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y,
        width: WIN.w,
        height: WIN.h,
        borderRadius: WIN.r,
        overflow: "hidden",
        background: bg,
        boxShadow: light ? "0 30px 80px rgba(0,0,0,0.5)" : "inset 0 0 0 1.5px rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.width, height: SCREEN.height, background: bg, transform: `translate(${tx}px, ${ty}px) scale(${view.scale})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}

/**
 * One line of copy (at most two lines, broken by hand with "\n"), Urbanist 400. It always appears
 * complete: a short fade and rise from `from`, and a fade out ending at `to`. With `cut` it is
 * simply there from `from`, for hard cuts.
 */
export function Headline({ frame, from, to = Infinity, size = 72, top = 350, cut = false, color = "#FFFFFF", children }: { frame: number; from: number; to?: number; size?: number; top?: number; cut?: boolean; color?: string; children: string }) {
  if (frame < from || frame >= to) return null;
  const inT = cut ? 1 : ramp(frame, from, 7);
  const outT = to === Infinity ? 0 : ramp(frame, to - 5, 5);
  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        width: 1080 - MARGIN * 2,
        top,
        fontFamily: BRAND,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: -0.015 * size,
        color,
        whiteSpace: "pre-line",
        opacity: inT * (1 - outT),
        transform: `translateY(${(1 - inT) * 14}px)`,
      }}
    >
      {children}
    </div>
  );
}

/** The small yellow line above the hook. */
export const Eyebrow = ({ children }: { children: string }) => (
  <div style={{ position: "absolute", left: MARGIN, top: 300 - 36, height: 36, display: "flex", alignItems: "flex-end", fontFamily: BRAND, fontWeight: 500, fontSize: 36, lineHeight: 1, color: YELLOW }}>{children}</div>
);

/**
 * Whose phone this is: a small rounded label in the category-card style (20px radius, raised
 * dark surface, hairline border), just above the window's top-left corner.
 */
export function NameChip({ who, frame, at }: { who: "sade" | "dami"; frame: number; at: number }) {
  const t = Math.max(0, pop(frame, at, 12));
  if (t <= 0) return null;
  const sade = who === "sade";
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: WIN.y - 78,
        height: 60,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 22px 0 10px",
        borderRadius: 20,
        background: "#222222",
        border: "1.5px solid #333333",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        transform: `scale(${t})`,
        transformOrigin: "left center",
        zIndex: 5,
      }}
    >
      {sade ? (
        <Img src={staticFile(SADE.photo)} style={{ width: 40, height: 40, borderRadius: 20, objectFit: "cover" }} />
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: 20, background: "#969696", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRAND, fontWeight: 600, fontSize: 19, color: "#fff" }}>{DAMI.first[0]}</div>
      )}
      <span style={{ fontFamily: BRAND, fontWeight: 600, fontSize: 28, color: "#FFFFFF" }}>{sade ? SADE.first : DAMI.first}</span>
    </div>
  );
}

/** One four-point sparkle (Lucide), in screen points. `t` blooms it in; `twinkle` 0 → 1 → 0 flares it. */
export function Sparkle({ x, y, size = 22, t = 1, twinkle = 0 }: { x: number; y: number; size?: number; t?: number; twinkle?: number }) {
  if (t <= 0) return null;
  const scale = t * (1 + 0.35 * twinkle);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${scale}) rotate(${twinkle * 25}deg)`, opacity: Math.min(1, t * 1.4), zIndex: 20, filter: `drop-shadow(0 0 ${3 + 4 * twinkle}px rgba(255,222,89,0.8))` }}>
      <SparkleIcon size={size} color={YELLOW} fill={YELLOW} strokeWidth={1.5} />
    </div>
  );
}

/**
 * A whip pan between two people's phones: over `[start, start + duration]` the outgoing layer
 * flies off to the left and the incoming one arrives from the right, with a horizontal motion
 * blur (an SVG filter) that peaks mid-move. Returns the two layers' styles and the filter defs.
 */
export function whip(frame: number, start: number, duration = 10) {
  const p = ramp(frame, start, duration, (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2));
  const blur = Math.sin(Math.PI * p) * 60;
  const id = `whip-${start}`;
  const layer = (x: number, visible: boolean): CSSProperties => ({ position: "absolute", inset: 0, transform: `translateX(${x}px)`, filter: blur > 0.5 ? `url(#${id})` : undefined, visibility: visible ? "visible" : "hidden" });
  return {
    progress: p,
    out: layer(-p * 1300, p < 1),
    in: layer((1 - p) * 1300, p > 0),
    defs: (
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="0" width="140%" height="100%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
    ),
  };
}
