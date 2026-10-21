import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../lib/fonts";
import { DAMI, REPLY } from "../lib/layout";
import { GOAL_POINTS, GoalScreen } from "../screens/GoalScreen";
import { COMPOSE_POINTS, InviteBody, Message, ReplySheet, SUBJECTS, UpdateBody } from "../screens/Mail";
import { INVITE_POINTS, InviteSheet, KEYBOARD_HEIGHT, Toast } from "../screens/Sheets";
import { Phone, PHONE, Tap } from "../v4/system";

/*
 * Email Circle invites, v5 (video-v5/BRIEF.md). 630 frames at 30fps.
 *
 * Frames 0 to 155 (the title card and the check-ins) port reference/opening-prototype.html line
 * for line: same layout, same clocks, same easing. Frames 155 to 535 put the real app and email
 * mockups in one phone-sized world, with Natalie's phone and Dami's 1200px apart and the camera
 * panning between them. Frames 535 to 630 are the yellow end card, looping back into frame 0.
 */

export const V5_FRAMES = 630;

/* ---------- Easing and clocks (the prototype's own) ---------- */

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const outQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** 0 → 1 over `duration` frames from `start`, through `ease`. */
const at = (frame: number, start: number, duration: number, ease = outQuint) => ease(clamp((frame - start) / duration));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const CREAM = "#FFFCEF";
const INK = "#0D0D0D";
const MUTED = "#8C887C";
const YELLOW = "#FFDE59";

/* ---------- Formats ---------- */

/**
 * Where things sit in each cut. The 4:5 feed cut keeps the same timeline: the lockup is centred,
 * captions sit at y 150 and the phone at y 470, and the UI scrolls a little further so its key
 * moments stay in frame.
 */
export interface Format {
  height: number;
  /** "New in" top edge on the title card. */
  lockTop: number;
  /** Scene 2 headline top and the top of the notification stack. */
  hlTop: number;
  cardsTop: number;
  captionTop: number;
  phoneTop: number;
  /** Scene 4 push-in: how far the camera rises (px) and its scale. */
  push: { dy: number; scale: number };
  /** How far each email and the goal screen scroll so their key UI stays in frame (pt). */
  scroll: { invite: number; update: number; goal: number };
  /** The end card moves as one block. */
  endShift: number;
}

export const FORMATS = {
  story: { height: 1920, lockTop: 600, hlTop: 290, cardsTop: 860, captionTop: 290, phoneTop: PHONE.top, push: { dy: 20, scale: 1.04 }, scroll: { invite: 270, update: 120, goal: 100 }, endShift: 0 },
  feed: { height: 1350, lockTop: 315, hlTop: 150, cardsTop: 600, captionTop: 150, phoneTop: 470, push: { dy: 150, scale: 1.02 }, scroll: { invite: 335, update: 215, goal: 275 }, endShift: -285 },
} satisfies Record<string, Format>;

/* ---------- Scene 1: the title card (and the cover) ---------- */

/** The four-point sparkle, the prototype's path. */
const SPARKLE = "M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z";

/** The series opener: yellow card, "New in", the wordmark with its black sparkle, and the feature name. */
export function TitleCard({ F, frame }: { F: Format; frame: number }) {
  const w = inOut(clamp((frame - 44) / 18));
  const sp = outQuint(clamp((frame - 4) / 16));
  return (
    <div style={{ position: "absolute", inset: 0, background: YELLOW, overflow: "hidden", transform: `translateY(${-w * 100}%)`, zIndex: 100 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.lockTop, textAlign: "center", fontFamily: BRAND, color: INK, transform: `translateY(${-w * 260}px) scale(${1 + 0.02 * clamp(frame / 44)})` }}>
        <div style={{ fontSize: 128, fontWeight: 400, letterSpacing: -3.5, lineHeight: 1 }}>New in</div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 34 }}>
          <Img src={staticFile("logos/wordmark-black.png")} style={{ width: 760, display: "block" }} />
          <svg viewBox="0 0 24 24" style={{ position: "absolute", right: -96, top: -78, width: 80, height: 80, transform: `scale(${0.6 + 0.4 * sp}) rotate(${(1 - sp) * -30}deg)` }}>
            <path d={SPARKLE} fill={INK} />
          </svg>
        </div>
        <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: -1.2, marginTop: 52 }}>Email Circle invites</div>
      </div>
    </div>
  );
}

/* ---------- Scene 2: the check-ins ---------- */

const CHECK_INS = [
  { name: "Donnie", goal: "Launch New Restaurant", message: "Been a minute. Are you still working on this?" },
  { name: "Spartan", goal: "Run a half marathon", message: "Good job on the progress. Keep it up." },
  { name: DAMI.first, goal: "Run a half marathon", message: REPLY },
];

/** The app's notification: 920 x 200, #383838, the Bestday icon, "Bestday" and "now", then who replied to what. */
function Notification({ name, goal, message }: (typeof CHECK_INS)[number]) {
  return (
    <div style={{ width: 920, height: 200, borderRadius: 50, background: "#383838", color: "#fff", boxShadow: "0 2px 4px rgba(40,32,10,.08), 0 14px 32px rgba(40,32,10,.14), 0 40px 80px rgba(40,32,10,.16)", display: "flex", alignItems: "flex-start", gap: 28, padding: "34px 40px 0 34px", boxSizing: "border-box", fontFamily: BRAND }}>
      {/* the app icon, framed as in the prototype: the B sits a touch right of centre */}
      <div style={{ width: 100, height: 100, borderRadius: 24, flex: "none", marginTop: 2, background: `${YELLOW} url(${staticFile("logos/source-bestday-logo-1024.png")}) 58% 50% / 96% no-repeat` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <b style={{ fontSize: 37, fontWeight: 700 }}>Bestday</b>
          <span style={{ fontSize: 31, color: "#9B9B9B" }}>now</span>
        </div>
        <div style={{ fontFamily: '-apple-system, "Inter", sans-serif', fontSize: 33, lineHeight: 1.3, marginTop: 6, color: "#F2F2F2", letterSpacing: -0.2 }}>
          {name} replied to “{goal}”:
          <br />
          {message}
        </div>
      </div>
    </div>
  );
}

const ARR = [18, 34, 50];
const STEP = 216;

/** Scene 2, the prototype's renderScene(f) with f = frame - 50; frames 145 to 155 fade it up and out. */
export function CheckIns({ F, frame }: { F: Format; frame: number }) {
  const f = Math.max(0, frame - 50);
  const d = 1 + 0.025 * inOut(clamp(f / 105));
  const out = at(frame, 145, 10, inOut);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${d})`, transformOrigin: `50% 45%`, opacity: 1 - out, translate: `0 ${-12 * out}px` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: F.hlTop, textAlign: "center", fontFamily: BRAND, fontSize: 100, lineHeight: 1, letterSpacing: -2.8, color: INK }}>
        {["Bring your", "best people.", "Wherever they are."].map((line, i) => {
          const t = outQuint(clamp((f - 3 - i * 4) / 16));
          return (
            <span key={line} style={{ display: "block", opacity: t, transform: `translateY(${(1 - t) * 28}px)`, color: i === 2 ? MUTED : INK }}>
              {line}
            </span>
          );
        })}
      </div>
      {CHECK_INS.map((n, i) => {
        const a = outQuint(clamp((f - ARR[i]) / 16));
        let slot = 0;
        for (let j = i + 1; j < CHECK_INS.length; j++) slot += outCubic(clamp((f - ARR[j]) / 16));
        return (
          <div key={n.name} style={{ position: "absolute", left: 80, top: F.cardsTop + slot * STEP - (1 - a) * 44, opacity: a, transform: `scale(${0.96 + 0.04 * a})`, zIndex: 10 + i }}>
            <Notification {...n} />
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Captions ---------- */

/**
 * A caption: centred at the format's caption top, 66px Urbanist Regular, -1.6px tracking. Lines
 * come in one after another (4 frames apart), fading while rising 26px; the caption leaves by
 * fading while rising 12px over 10 frames. A muted second sentence is grey.
 */
function Caption({ F, frame, from, to = Infinity, lines, muted }: { F: Format; frame: number; from: number; to?: number; lines: string[]; muted?: string[] }) {
  if (frame < from || frame >= to + 10) return null;
  const out = at(frame, to, 10, inOut);
  const all = [...lines.map((text) => ({ text, color: INK })), ...(muted ?? []).map((text) => ({ text, color: MUTED }))];
  return (
    <div style={{ position: "absolute", left: 140, width: 800, top: F.captionTop, textAlign: "center", fontFamily: BRAND, fontWeight: 400, fontSize: 66, letterSpacing: -1.6, lineHeight: 1.08, opacity: 1 - out, transform: `translateY(${-12 * out}px) scale(${1 + 0.02 * clamp((frame - from) / 90)})`, transformOrigin: "50% 0" }}>
      {all.map(({ text, color }, i) => {
        const t = at(frame, from + i * 4, 15);
        return (
          <div key={text} style={{ color, opacity: t, transform: `translateY(${(1 - t) * 26}px)` }}>
            {text}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- The camera ---------- */

/** Where Dami's phone sits in the world, to the right of Natalie's. */
const DAMI_X = 1200;

/** A camera key: the world point at the frame's centre (cx, cy offset from centre) and the scale. */
type Key = { f: number; x: number; dy: number; s: number };

/** The camera path. Every segment eases in and out; holds carry the slow drift. */
const cameraKeys = (F: Format): Key[] => [
  { f: 155, x: 0, dy: 0, s: 1 },
  { f: 238, x: 0, dy: 0, s: 1.02 },
  { f: 258, x: 0, dy: F.push.dy, s: F.push.scale },
  { f: 305, x: 0, dy: F.push.dy, s: F.push.scale + 0.015 },
  { f: 326, x: DAMI_X, dy: 0, s: 1 },
  { f: 410, x: DAMI_X, dy: 0, s: 1.025 },
  { f: 456, x: DAMI_X, dy: 0, s: 1.035 },
  { f: 476, x: 0, dy: 0, s: 1 },
  { f: 535, x: 0, dy: 0, s: 1.025 },
];

function camera(F: Format, frame: number) {
  const keys = cameraKeys(F);
  let i = keys.findIndex((k) => k.f > frame) - 1;
  if (i < 0) i = frame < keys[0].f ? 0 : keys.length - 2;
  const a = keys[i];
  const b = keys[i + 1];
  const t = inOut(clamp((frame - a.f) / (b.f - a.f)));
  const panning = a.x !== b.x;
  // light motion blur on the pans, strongest mid-move
  const blur = panning ? Math.sin(Math.PI * clamp((frame - a.f) / (b.f - a.f))) * 7 : 0;
  return { x: mix(a.x, b.x, t), dy: mix(a.dy, b.dy, t), s: mix(a.s, b.s, t), blur };
}

/* ---------- Typing ---------- */

/** About `cps` characters a second, each keystroke a little early or late, the same on every render. */
function typedNatural(text: string, frame: number, start: number, cps: number) {
  let time = start;
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    const jitter = Math.sin(i * 12.9898 + text.length) * 0.35;
    time += (30 / cps) * (1 + jitter);
    if (time <= frame) n = i + 1;
  }
  return text.slice(0, n);
}

/* ---------- Scenes 3 to 6: the two phones ---------- */

const T = {
  rise: 155,
  circleTap: 210,
  fieldTap: 238,
  typeEmail: 256,
  send: 283,
  accept: 340,
  updateArrives: 365,
  replyOpen: 412,
  typeReply: 422,
  sendReply: 456,
  replyLands: 476,
  spartan: 505,
};

/** Natalie's phone: her goal, the invite, and later the reply landing on it. */
function NataliePhone({ F, frame }: { F: Format; frame: number }) {
  const rise = at(frame, T.rise, 16);
  if (frame < T.sendReply) {
    const sheet = at(frame, T.circleTap + 1, 24, inOut) * (1 - at(frame, T.send + 3, 12, inOut));
    const keyboard = at(frame, T.fieldTap + 2, 14) * (1 - at(frame, T.send + 3, 12, inOut));
    return (
      <Phone y={F.phoneTop + (1 - rise) * 60} style={{ opacity: rise }}>
        <GoalScreen progress={20} circle={0} />
        <InviteSheet open={sheet} email={typedNatural(DAMI.email, frame, T.typeEmail, 22)} caret={frame > T.fieldTap && frame < T.send} keyboard={keyboard} />
        <Toast t={at(frame, T.send + 8, 14) * (1 - at(frame, 330, 10, inOut))} text="Invite sent" bottom={852 - 380 - 23} />
        <Tap frame={frame} at={T.circleTap} x={GOAL_POINTS.circle.x} y={GOAL_POINTS.circle.y} />
        <Tap frame={frame} at={T.fieldTap} x={196} y={INVITE_POINTS.field.y - KEYBOARD_HEIGHT} />
        <Tap frame={frame} at={T.send} x={INVITE_POINTS.send.x} y={INVITE_POINTS.send.y - KEYBOARD_HEIGHT} />
      </Phone>
    );
  }
  const lands = at(frame, T.replyLands, 14);
  const lift = at(frame, T.replyLands + 6, 12) * (1 - at(frame, T.replyLands + 24, 16, inOut));
  return (
    <Phone y={F.phoneTop}>
      <GoalScreen progress={45} circle={1} updateIn={1} updateValue={45} replyIn={lands} replyBorder={lands} replyLift={lift} spartanIn={at(frame, T.spartan, 16)} scroll={F.scroll.goal} />
    </Phone>
  );
}

/** Dami's phone, light: the invite email, Accept, the update email, then the reply. */
function DamiPhone({ F, frame }: { F: Format; frame: number }) {
  const inviteScroll = F.scroll.invite * at(frame, 326, 12, inOut);
  const accept = { x: 100, y: 678 - F.scroll.invite };
  const update = at(frame, T.updateArrives, 15);
  const updateScroll = F.scroll.update * at(frame, T.updateArrives + 17, 12, inOut);
  const replyOpen = at(frame, T.replyOpen, 10) * (1 - at(frame, T.sendReply + 2, 10, inOut));
  const press = 1 - 0.05 * Math.sin(Math.PI * clamp((frame - T.accept + 3) / 8));
  return (
    <Phone light x={540 + DAMI_X} y={F.phoneTop}>
      <Message subject={SUBJECTS.invite} scroll={inviteScroll}>
        <InviteBody acceptScale={press} />
      </Message>
      {update > 0 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${(update - 1) * 100}%)`, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}>
          <Message subject={SUBJECTS.update} scroll={updateScroll}>
            <UpdateBody from={20} to={45} fill={at(frame, T.updateArrives + 28, 18)} />
          </Message>
        </div>
      )}
      <ReplySheet open={replyOpen} typed={typedNatural(REPLY, frame, T.typeReply, 32)} caret={frame >= T.replyOpen && frame < T.sendReply} subject={SUBJECTS.update} />
      <Tap frame={frame} at={T.accept} x={accept.x} y={accept.y} light />
      <Tap frame={frame} at={T.sendReply} x={COMPOSE_POINTS.send.x} y={COMPOSE_POINTS.send.y} light />
    </Phone>
  );
}

/** Scenes 3 to 6 on the cream canvas. */
function Story({ F, frame }: { F: Format; frame: number }) {
  const cam = camera(F, frame);
  const H = F.height;
  const world: CSSProperties = {
    position: "absolute",
    inset: 0,
    transformOrigin: `540px ${H / 2}px`,
    transform: `scale(${cam.s}) translate(${-cam.x}px, ${-cam.dy}px)`,
    filter: cam.blur > 0.3 ? `url(#pan-blur)` : undefined,
  };
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="pan-blur" x="-10%" y="0" width="120%" height="100%">
          <feGaussianBlur stdDeviation={`${cam.blur} 0`} />
        </filter>
      </svg>
      <div style={world}>
        {frame < 330 || frame >= 450 ? <NataliePhone F={F} frame={frame} /> : null}
        {frame >= 300 && frame < 482 ? <DamiPhone F={F} frame={frame} /> : null}
      </div>
      <Caption F={F} frame={frame} from={157} to={220} lines={["Your Circle, now open", "to everyone who matters."]} />
      <Caption F={F} frame={frame} from={232} to={293} lines={["All it takes is", "their email."]} />
      <Caption F={F} frame={frame} from={322} to={350} lines={["They join from their inbox."]} muted={["No app or account needed."]} />
      <Caption F={F} frame={frame} from={362} to={400} lines={["And your updates", "land there too."]} />
      <Caption F={F} frame={frame} from={425} lines={["They reply to check in, and", "it shows up on your goal."]} />
    </AbsoluteFill>
  );
}

/* ---------- Scene 7: the end card ---------- */

/** Full yellow: the headline, then the CTA, then the black wordmark and "Do it. Together." */
function EndCard({ F, frame }: { F: Format; frame: number }) {
  const wipe = at(frame, 535, 16, inOut);
  const lineIn = (start: number, i = 0): CSSProperties => {
    const t = at(frame, start + i * 4, 15);
    return { opacity: t, transform: `translateY(${(1 - t) * 26}px)` };
  };
  const drift = 1 + 0.02 * clamp((frame - 547) / 83);
  return (
    <div style={{ position: "absolute", inset: 0, background: YELLOW, transform: `translateY(${(1 - wipe) * 100}%)`, overflow: "hidden", zIndex: 50 }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${F.endShift}px) scale(${drift})`, transformOrigin: "50% 50%", fontFamily: BRAND, color: INK, textAlign: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 634, fontSize: 110, fontWeight: 400, letterSpacing: -3, lineHeight: 1.04 }}>
          {["Building your", "Circle just got", "easier."].map((line, i) => (
            <div key={line} style={lineIn(547, i)}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1058, fontSize: 40, fontWeight: 400, letterSpacing: -0.4, color: "#695C2A", ...lineIn(572) }}>Available now. Update the app to try it.</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", flexDirection: "column", alignItems: "center", ...lineIn(590) }}>
          <Img src={staticFile("logos/wordmark-black.png")} style={{ width: 322, display: "block" }} />
          <div style={{ marginTop: 32, fontSize: 32, fontWeight: 700, letterSpacing: "0.04em" }}>Do it. Together.</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- The video ---------- */

/** UI sounds the brief calls for; each is a file in public/, or empty to leave it out. */
export type Sfx = Partial<Record<"tick" | "tap" | "keys" | "whoosh" | "mail" | "warmChime", string>>;
export type V5Props = { music: string; sfx: Sfx };

const CUES: { at: number; sound: keyof Sfx; volume?: number; rate?: number }[] = [
  { at: 68, sound: "tick", rate: 1 },
  { at: 84, sound: "tick", rate: 1.06 },
  { at: 100, sound: "tick", rate: 1.12 },
  { at: T.circleTap, sound: "tap" },
  { at: T.fieldTap, sound: "tap" },
  { at: T.typeEmail, sound: "keys" },
  { at: T.send, sound: "tap" },
  { at: 305, sound: "whoosh" },
  { at: 305, sound: "mail" },
  { at: T.accept, sound: "tap" },
  { at: T.updateArrives, sound: "mail" },
  { at: T.typeReply, sound: "keys" },
  { at: T.sendReply, sound: "whoosh" },
  { at: T.replyLands, sound: "warmChime" },
];

/** Music sits on top; the effects about -18 dB under it. */
const SFX_VOLUME = 0.126;

function Video({ F, music, sfx }: { F: Format } & V5Props) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const loop = clamp((frame - 621) / 8);
  return (
    <AbsoluteFill style={{ background: CREAM, overflow: "hidden" }}>
      {frame >= 150 && frame < 552 && <Story F={F} frame={frame} />}
      {frame >= 50 && frame < 156 && <CheckIns F={F} frame={frame} />}
      {frame < 62 && <TitleCard F={F} frame={frame} />}
      {frame >= 535 && <EndCard F={F} frame={frame} />}
      {/* the last 8 frames crossfade into frame 0, so the Reels loop runs straight back into the title card */}
      {loop > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: loop, zIndex: 200 }}>
          <TitleCard F={F} frame={0} />
        </div>
      )}
      {music && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 12, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      {CUES.map(({ at: cue, sound, rate = 1 }) =>
        sfx[sound] ? (
          <Sequence key={`${sound}-${cue}`} from={cue} layout="none">
            <Audio src={staticFile(sfx[sound]!)} volume={SFX_VOLUME} playbackRate={rate} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
}

export const EmailCircleInvitesV5 = (props: V5Props) => <Video F={FORMATS.story} {...props} />;
export const EmailCircleInvitesV5Feed = (props: V5Props) => <Video F={FORMATS.feed} {...props} />;
/** The cover: frame 0, the title card. */
export const CoverV5 = () => (
  <AbsoluteFill style={{ background: CREAM }}>
    <TitleCard F={FORMATS.story} frame={0} />
  </AbsoluteFill>
);

