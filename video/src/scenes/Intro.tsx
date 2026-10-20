import { Img, staticFile, useCurrentFrame } from "remotion";
import { Mail } from "lucide-react";
import { Caption } from "../components/Caption";
import { Scene } from "../components/Scene";
import { caretOn, pop, ramp, typed } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { DAMI, SADE, YELLOW } from "../lib/layout";

/** 1. Hook: the claim, before any product is shown. */
export function Hook() {
  const frame = useCurrentFrame();
  const tag = pop(frame, 4);
  return (
    <Scene bg="dark" enter="none">
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: Math.min(1, tag), transform: `scale(${0.8 + 0.2 * tag})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: 40, border: `2px solid ${YELLOW}`, fontFamily: BRAND, fontWeight: 700, fontSize: 34, color: YELLOW, letterSpacing: 0.5 }}>
          <span style={{ padding: "4px 12px", borderRadius: 10, background: YELLOW, color: "#000", fontSize: 26, letterSpacing: 1.5 }}>NEW</span>
          Email Circle invites
        </div>
      </div>
      <Caption frame={frame} start={12} end={999} top={770} size={96}>
        {"Your biggest supporters don’t need *another app.*"}
      </Caption>
    </Scene>
  );
}

const FRIENDS = [
  { photo: "members/r.jpg", x: 280, y: 700 },
  { photo: "members/m.jpg", x: 800, y: 700 },
  { photo: "members/t.jpg", x: 540, y: 1150 },
];
const CENTER = { x: 540, y: 880 };

/** 2. Before: a Circle that had to download the app first, and the people lost on the way. */
export function Before() {
  const frame = useCurrentFrame();
  return (
    <Scene bg="dark">
      <Caption frame={frame} start={6} end={999} size={64}>
        {"Until now, your Circle\nhad to *be on Bestday.*"}
      </Caption>

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {FRIENDS.map((f, i) => {
          const at = 40 + i * 22;
          const lost = ramp(frame, at + 28, 18);
          const drawn = ramp(frame, 10 + i * 5, 18);
          return (
            <line
              key={i}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={CENTER.x + (f.x - CENTER.x) * drawn}
              y2={CENTER.y + (f.y - CENTER.y) * drawn + lost * 60 * drawn}
              stroke={lost > 0.5 ? "rgba(255,255,255,0.18)" : YELLOW}
              strokeOpacity={1 - lost * 0.7}
              strokeWidth={4}
              strokeDasharray={lost > 0 ? "6 14" : undefined}
            />
          );
        })}
      </svg>

      {FRIENDS.map((f, i) => {
        const at = 40 + i * 22;
        const shown = pop(frame, 8 + i * 5);
        const ask = pop(frame, at) * (1 - ramp(frame, at + 34, 10));
        const lost = ramp(frame, at + 28, 18);
        return (
          <div key={i}>
            <div style={{ position: "absolute", left: f.x - 75, top: f.y - 75 + lost * 60, width: 150, height: 150, borderRadius: 75, overflow: "hidden", transform: `scale(${Math.min(1, shown) * (1 - lost * 0.2)})`, opacity: 1 - lost * 0.75, border: "4px solid rgba(255,255,255,0.15)" }}>
              <Img src={staticFile(f.photo)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `grayscale(1) contrast(1.08) brightness(${0.95 - lost * 0.4})` }} />
            </div>
            <div style={{ position: "absolute", left: f.x - 210, width: 420, top: f.y - 150, display: "flex", justifyContent: "center", opacity: Math.min(1, ask), transform: `translateY(${(1 - Math.min(1, ask)) * 20}px) scale(${0.85 + 0.15 * Math.min(1, ask)})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 18, background: "#262626", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: BRAND, fontWeight: 600, fontSize: 26, color: "#E0E0E0", whiteSpace: "nowrap" }}>
                <Img src={staticFile("app-icon.svg")} style={{ width: 34, height: 34, borderRadius: 8 }} />
                Download Bestday to join
              </div>
            </div>
          </div>
        );
      })}

      {/* Sade, at the centre of her Circle */}
      <div style={{ position: "absolute", left: CENTER.x - 115, top: CENTER.y - 115, width: 230, height: 230, borderRadius: 115, padding: 6, background: YELLOW, transform: `scale(${Math.min(1, pop(frame, 2))})` }}>
        <Img src={staticFile(SADE.photo)} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", filter: "grayscale(1) contrast(1.08) brightness(0.95)" }} />
      </div>

      <Caption frame={frame} start={112} end={999} top={1290} size={54} color="rgba(255,255,255,0.75)">
        {"Not everyone made it past the download."}
      </Caption>
    </Scene>
  );
}

/** 3. The turn: the new answer is an email address. */
export function Turn() {
  const frame = useCurrentFrame();
  const field = pop(frame, 22);
  const email = typed(DAMI.email, frame, 34, 14);
  const glow = ramp(frame, 70, 12);
  return (
    <Scene bg="dark">
      <Caption frame={frame} start={4} end={999} top={600} size={96}>
        {"Now, all you need\nis *their email.*"}
      </Caption>
      <div
        style={{
          position: "absolute",
          left: 140,
          width: 800,
          top: 1010,
          height: 130,
          borderRadius: 36,
          background: "#1C1C1C",
          border: `3px solid ${glow > 0 ? `rgba(255,222,89,${0.25 + 0.75 * glow})` : "rgba(255,255,255,0.12)"}`,
          boxShadow: `0 0 ${60 * glow}px rgba(255,222,89,${0.35 * glow})`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 40px",
          boxSizing: "border-box",
          opacity: Math.min(1, field),
          transform: `scale(${0.85 + 0.15 * field})`,
        }}
      >
        <Mail size={48} color={YELLOW} strokeWidth={2.2} />
        <span style={{ fontFamily: BRAND, fontWeight: 600, fontSize: 52, color: email ? "#fff" : "#777" }}>{email || "Email address"}</span>
        <span style={{ width: 4, height: 58, marginLeft: -18, background: YELLOW, opacity: caretOn(frame) ? 1 : 0 }} />
      </div>
    </Scene>
  );
}
