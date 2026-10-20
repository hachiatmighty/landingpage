import { Img, staticFile } from "remotion";
import { MAIL } from "../lib/fonts";

/** An iOS notification banner dropping in from under the Dynamic Island. `t` runs 0 → 1 → 0. */
export function PushBanner({ t, title, body }: { t: number; title: string; body: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 10,
        right: 10,
        top: 54,
        zIndex: 55,
        transform: `translateY(${(1 - t) * -150}px) scale(${0.92 + 0.08 * t})`,
        opacity: Math.min(1, t * 1.6),
        display: "flex",
        gap: 11,
        padding: "13px 14px",
        borderRadius: 24,
        background: "rgba(58,58,60,0.94)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
        fontFamily: MAIL,
        color: "#fff",
      }}
    >
      <Img src={staticFile("app-icon.svg")} style={{ width: 38, height: 38, borderRadius: 9, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{title}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>now</span>
        </div>
        <div style={{ fontSize: 15, lineHeight: "20px", marginTop: 1, color: "rgba(255,255,255,0.92)", letterSpacing: -0.2 }}>{body}</div>
      </div>
    </div>
  );
}
