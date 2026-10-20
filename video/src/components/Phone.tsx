import type { CSSProperties, ReactNode } from "react";
import { SCREEN } from "../lib/device";
import { MAIL } from "../lib/fonts";

/** The iOS status bar, white on the dark app and black on the light mail app. */
function StatusBar({ color }: { color: string }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 54, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 52, paddingRight: 36, paddingTop: 4, color, fontFamily: MAIL }}>
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.4 }}>9:41</span>
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
          <rect x="5.1" y="5.2" width="3.2" height="6.8" rx="1" />
          <rect x="10.2" y="2.6" width="3.2" height="9.4" rx="1" />
          <rect x="15.3" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.6 10.2 10.2 0 0 0 1.3 3.5l1.2 1.2a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8.5 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8.5 9.1c.5 0 .9.2 1.2.5L8.5 11.8 7.3 9.6c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** Sizes of a phone `width` pixels wide; `inset` is where the screen starts inside it. */
export function phoneGeometry(width: number) {
  const bezel = width * 0.035;
  const screenWidth = width - bezel * 2 - 6;
  const scale = screenWidth / SCREEN.width;
  const screenHeight = SCREEN.height * scale;
  return { bezel, screenWidth, scale, screenHeight, height: screenHeight + bezel * 2 + 6, inset: bezel + 3 };
}

/**
 * An iPhone 16 with a 393x852pt screen drawn at native size and scaled to `width` pixels, after
 * PhoneFrame.tsx and DeviceScreen.tsx in the mockups (titanium edge, black bezel, Dynamic Island,
 * home indicator). `x` and `y` place the phone's centre; `style` adds transforms on top.
 */
export function Phone({
  x,
  y,
  width,
  light = false,
  children,
  style,
}: {
  x: number;
  y: number;
  width: number;
  light?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { bezel, screenWidth, scale, screenHeight, height } = phoneGeometry(width);

  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        borderRadius: width * 0.17,
        padding: 3,
        background: "linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.2))",
        boxShadow: light ? "0 40px 90px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)" : "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        ...style,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: width * 0.164, background: "#050505", padding: bezel, boxSizing: "border-box", position: "relative" }}>
        <div style={{ width: screenWidth, height: screenHeight, borderRadius: width * 0.13, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: SCREEN.width, height: SCREEN.height, transform: `scale(${scale})`, transformOrigin: "top left", overflow: "hidden", background: light ? "#FFFFFF" : "#121212" }}>
            {children}
            <StatusBar color={light ? "#000" : "#fff"} />
            <div style={{ position: "absolute", left: "50%", top: 11, width: 126, height: 37, marginLeft: -63, borderRadius: 19, background: "#000", zIndex: 40 }} />
            <div style={{ position: "absolute", left: "50%", bottom: 8, width: 139, height: 5, marginLeft: -69.5, borderRadius: 3, background: light ? "#000" : "#fff", zIndex: 40 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** A fingertip landing at (x, y) in screen points, centred on frame `at`. */
export function Tap({ x, y, at, frame }: { x: number; y: number; at: number; frame: number }) {
  const t = (frame - at + 6) / 20;
  if (t < 0 || t > 1) return null;
  const opacity = t < 0.3 ? (t / 0.3) * 0.9 : 0.9 * (1 - (t - 0.3) / 0.7);
  const scale = 0.5 + t * 0.85;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 54,
        height: 54,
        borderRadius: 27,
        background: "rgba(255,255,255,0.35)",
        border: "2px solid rgba(255,255,255,0.75)",
        boxShadow: "0 0 0 8px rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.25)",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        zIndex: 60,
      }}
    />
  );
}
