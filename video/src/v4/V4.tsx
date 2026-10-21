import type { CSSProperties } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BRAND } from "../lib/fonts";
import { REPLY } from "../lib/layout";
import { GOAL_POINTS, GoalScreen } from "../screens/GoalScreen";
import { InviteSheet } from "../screens/Sheets";
import { CREAM, EASE_IN_OUT, INK, MUTED, Caption, Phone, PHONE, Sparkle, Tap, YELLOW, captionMotion, drift, t01 } from "./system";

/*
 * Email Circle invites, v4 (video-v4/BRIEF.md). 585 frames at 30fps.
 * Step 1 builds Scenes 1 and 2 (frames 0 to 150) as a motion test; later scenes are still to come.
 */

export const V4_FRAMES = 585;
export const V4_SCENES = { cover: 0, circle: 75, invite: 150, join: 225, reply: 345, end: 480 } as const;

/** The camera: a scale about a fixed point on the canvas. */
const camera = (scale: number, ox = 540, oy = 960): CSSProperties => ({ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px` });

/* ---------- The reply card (the cover's card, and later the hero in Scene 5) ---------- */

/** Dami's reply as a card, in screen points: avatar inside, yellow border. 361pt wide. */
export const REPLY_CARD = { width: 361, height: 67 } as const;

export function ReplyCard() {
  return (
    <div style={{ width: REPLY_CARD.width, height: REPLY_CARD.height, boxSizing: "border-box", borderRadius: 15, border: `1.25px solid ${YELLOW}`, background: "#1B1B1B", display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "#5A5A5A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRAND, fontWeight: 600, fontSize: 15, color: "#E8E8E8", flexShrink: 0 }}>D</div>
      <div style={{ fontFamily: BRAND, lineHeight: 1.2 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#FFFFFF" }}>Dami</span>
          <span style={{ fontWeight: 400, fontSize: 12.5, color: "#8E8E8E", marginLeft: 5 }}>now</span>
        </div>
        <div style={{ fontWeight: 400, fontSize: 16.3, color: "#FFFFFF", marginTop: 2, letterSpacing: -0.1 }}>{REPLY}</div>
      </div>
    </div>
  );
}

/* ---------- Scene 1: the cover ---------- */

/** Cover geometry, from style frame 1-cover: the card spans x 100 to 979, y 1150 to 1313. */
const COVER_CARD = { x: 100, y: 1150, w: 879 } as const;

/** Scene 1, and at frame 0 the cover. The camera drifts from the first frame; frames 60 to 75 the type and card fade up and out. */
export function Cover({ frame }: { frame: number }) {
  const out = t01(frame, 60, 15, EASE_IN_OUT);
  const k = COVER_CARD.w / REPLY_CARD.width;
  return (
    <div style={camera(drift(frame, 0, 75))}>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-16 * out}px)` }}>
        <div style={{ position: "absolute", left: 540 - 307 / 2, top: 480, width: 307, height: 72, borderRadius: 36, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BRAND, fontWeight: 600, fontSize: 34, letterSpacing: -0.3, color: INK }}>New in Bestday</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 580, textAlign: "center", fontFamily: BRAND, fontWeight: 400, fontSize: 100, letterSpacing: -2.6, lineHeight: 1.02, color: INK }}>
          <div>Bring your</div>
          <div>best people.</div>
          <div style={{ color: MUTED }}>Wherever they are.</div>
        </div>
        <div style={{ position: "absolute", left: COVER_CARD.x, top: COVER_CARD.y, width: REPLY_CARD.width, height: REPLY_CARD.height, transform: `scale(${k})`, transformOrigin: "0 0", borderRadius: 15, boxShadow: "0 1px 2px rgba(40,32,10,.08), 0 8px 18px rgba(40,32,10,.10), 0 24px 48px rgba(40,32,10,.12)" }}>
          <ReplyCard />
          <Sparkle x={REPLY_CARD.width - 4} y={0} size={30} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Scene 2: Natalie's goal ---------- */

/** Scene 2: the phone rises into place, Circle is tapped at 130 and the invite sheet starts to rise. Frames are the video's. */
export function CircleOpen({ frame }: { frame: number }) {
  const s = V4_SCENES.circle;
  const rise = t01(frame, s, 20);
  const tapAt = 130;
  const sheet = t01(frame, tapAt + 1, 24, EASE_IN_OUT);
  return (
    <div style={camera(drift(frame, s, V4_SCENES.invite), 540, 1100)}>
      <div style={captionMotion(frame, s, V4_SCENES.invite - 12)}>
        <Caption lines={["Your Circle, now open", "to everyone who matters."]} />
      </div>
      <Phone y={PHONE.top + (1 - rise) * 60} style={{ opacity: rise }}>
        <GoalScreen progress={20} circle={0} />
        <InviteSheet open={sheet} email="" caret={false} />
        <Tap frame={frame} at={tapAt} x={GOAL_POINTS.circle.x} y={GOAL_POINTS.circle.y} />
      </Phone>
    </div>
  );
}

export function EmailCircleInvitesV4() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: CREAM, overflow: "hidden" }}>
      {frame < V4_SCENES.circle && <Cover frame={frame} />}
      {frame >= V4_SCENES.circle && frame < V4_SCENES.invite + 30 && <CircleOpen frame={frame} />}
    </AbsoluteFill>
  );
}
