import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Tap } from "../components/Phone";
import { caretOn, mix, press, ramp, typed, window } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { DAMI, INK, REPLY, YELLOW } from "../lib/layout";
import { GOAL_POINTS, GoalScreen } from "../screens/GoalScreen";
import { COMPOSE_POINTS, InviteBody, JoinedBody, Message, MESSAGE_POINTS, ReplySheet, SUBJECTS, UpdateBody } from "../screens/Mail";
import { INVITE_POINTS, InviteSheet, Toast } from "../screens/Sheets";
import { cam, Eyebrow, Headline, HERO, lerpCam, MARGIN, NameChip, Sparkle, UIWindow, whip } from "./stage";

/*
 * Email Circle invites, v2: the storyboard "Email Circle Invites: Video Storyboard v2". Seven
 * scenes in 585 frames (19.5s at 30fps). Frame numbers below are local to each component; the
 * scene table in V2.tsx says where each one starts.
 */

/** Dami's reply bubble on Sade's goal, in screen points (GoalScreen with the reply at the top of Activity). */
export const BUBBLE = { cy: 431, sparkle: { x: 372, y: 402 } } as const;
/** The payoff framing, shared by the cover, Scene 1 and the end of Scene 6. */
const PAYOFF = cam(400, HERO, 199);

/** Sade's goal with Dami's reply on it: the payoff, used by the cover, Scene 1 and Scene 6. */
function Payoff({ replyIn = 1, glow = 1, sparkle = 1, twinkle = 0 }: { replyIn?: number; glow?: number; sparkle?: number; twinkle?: number }) {
  return (
    <>
      <GoalScreen progress={45} circle={1} updateIn={1} updateValue={45} replyIn={replyIn} replyGlow={glow} />
      <Sparkle x={BUBBLE.sparkle.x} y={BUBBLE.sparkle.y} t={sparkle} twinkle={twinkle} />
    </>
  );
}

/* ---------- Cover and Scene 1: the hook ---------- */

/** The cover layout. Scene 1 is this frame held, then a twinkle and a slight drift up. */
export function Hook({ still = false }: { still?: boolean }) {
  const f = useCurrentFrame();
  const frame = still ? 0 : f;
  const drift = ramp(frame, 15, 51) * -24;
  const twinkle = window(frame, 15, 33, 9);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift}px)` }}>
        <Eyebrow>New in Bestday</Eyebrow>
        <Headline frame={frame} from={0} size={88} cut>
          {"Bring your best people.\nWherever they are."}
        </Headline>
        <UIWindow view={PAYOFF}>
          <Payoff twinkle={twinkle} />
        </UIWindow>
      </div>
    </AbsoluteFill>
  );
}

/* ---------- Scenes 2 and 3: Sade invites Dami (one continuous shot) ---------- */

export function Invite() {
  const frame = useCurrentFrame();
  const tapCircle = 24;
  const typeAt = 70;
  const tapSend = 98;
  const open = ramp(frame, tapCircle + 4, 40) * (1 - ramp(frame, tapSend + 5, 12));
  const view = lerpCam(cam(290), cam(640), ramp(frame, tapCircle + 8, 30));
  const cardIn = ramp(frame, 0, 9);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Headline frame={frame} from={0} to={66} cut>
        {"Your Circle, now open\nto everyone who matters."}
      </Headline>
      <Headline frame={frame} from={66}>
        {"Invite anyone with\njust their email."}
      </Headline>
      <UIWindow view={view} style={{ transform: `scale(${mix(0.96, 1, cardIn)})` }}>
        <GoalScreen progress={20} circle={0} circleScale={press(frame, tapCircle)} />
        <InviteSheet open={open} email={typed(DAMI.email, frame, typeAt, 25)} caret={frame > 60 && frame < tapSend && caretOn(frame)} sendScale={press(frame, tapSend, 0.96)} />
        <Toast t={window(frame, tapSend + 10, 999, 8)} text="Invite sent" />
        <Tap x={GOAL_POINTS.circle.x} y={GOAL_POINTS.circle.y} at={tapCircle} frame={frame} />
        <Tap x={INVITE_POINTS.send.x} y={INVITE_POINTS.send.y} at={tapSend} frame={frame} />
      </UIWindow>
      <NameChip who="sade" frame={frame} at={9} />
    </AbsoluteFill>
  );
}

/* ---------- Scenes 4 and 5: Dami's inbox ---------- */

/** Where the camera sits on Dami's emails (centre, in screen points). */
export const DAMI_VIEW = { invite: 480, joined: 400, update: 420, reply: 215 } as const;

/** The Accept button with the invite email scrolled by INVITE_SCROLL, in screen points. */
const INVITE_SCROLL = 120;
const ACCEPT = { x: 100, y: 558 };

/** Dami's phone, light mode: joins from the invite email, then gets Sade's update. Scene 5 starts at local frame 84. */
export function DamiInbox({ frame }: { frame: number }) {
  const tapAccept = 30;
  const update = 84;
  const joined = ramp(frame, tapAccept + 6, 12);
  const arrive = ramp(frame, update + 2, 12);
  const view = frame < update ? lerpCam(cam(DAMI_VIEW.invite), cam(DAMI_VIEW.joined), ramp(frame, tapAccept + 6, 14)) : cam(DAMI_VIEW.update);
  return (
    <>
      <Headline frame={frame} from={4} to={update}>
        {"They join from their inbox.\nNo app or account needed."}
      </Headline>
      <Headline frame={frame} from={update} to={144}>
        {"Your progress updates\ngo straight to their email."}
      </Headline>
      <UIWindow view={view} light>
        <Message subject={SUBJECTS.invite} scroll={INVITE_SCROLL}>
          <InviteBody acceptScale={press(frame, tapAccept, 0.95)} />
        </Message>
        {joined > 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - joined) * 100}%)` }}>
            <Message subject={SUBJECTS.joined}>
              <JoinedBody marker={ramp(frame, 54, 20)} />
            </Message>
          </div>
        )}
        {/* Sade's update arrives: the email slides down from the top and lands open. */}
        {arrive > 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `translateY(${(arrive - 1) * 100}%)`, boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>
            <Message subject={SUBJECTS.update}>
              <UpdateBody from={20} to={45} fill={ramp(frame, update + 16, 26)} />
            </Message>
          </div>
        )}
        <Tap x={ACCEPT.x} y={ACCEPT.y} at={tapAccept} frame={frame} />
      </UIWindow>
      <NameChip who="dami" frame={frame} at={8} />
    </>
  );
}

/* ---------- Scene 6: the reply ---------- */

/** Dami replies; whip pan back to Sade; the reply lands on her goal and the camera pushes in. */
export function Reply({ frame }: { frame: number }) {
  const tapReply = 2;
  const typeAt = 10;
  const tapSend = 53;
  const w = whip(frame, 54, 10);
  const land = 63;
  const open = ramp(frame, tapReply + 1, 8) * (1 - ramp(frame, tapSend + 2, 6));
  const push = ramp(frame, land + 1, 14);
  const view = lerpCam(cam(360), PAYOFF, push);
  return (
    <>
      {w.defs}
      <div style={w.out}>
        <UIWindow view={lerpCam(cam(DAMI_VIEW.update), cam(DAMI_VIEW.reply), ramp(frame, 0, 8))} light>
          <Message subject={SUBJECTS.update} replyScale={press(frame, tapReply, 0.95)}>
            <UpdateBody from={20} to={45} fill={1} />
          </Message>
          <ReplySheet open={open} typed={typed(REPLY, frame, typeAt, 25)} caret={caretOn(frame)} sendScale={press(frame, tapSend, 0.9)} subject={SUBJECTS.update} />
          <Tap x={MESSAGE_POINTS.reply.x} y={MESSAGE_POINTS.reply.y} at={tapReply} frame={frame} />
          <Tap x={COMPOSE_POINTS.send.x} y={COMPOSE_POINTS.send.y} at={tapSend} frame={frame} />
        </UIWindow>
        <NameChip who="dami" frame={frame} at={-99} />
      </div>
      <div style={w.in}>
        <UIWindow view={view}>
          <Payoff replyIn={ramp(frame, land, 10)} glow={ramp(frame, land + 4, 14)} sparkle={ramp(frame, land + 10, 12)} twinkle={window(frame, land + 14, land + 34, 8)} />
        </UIWindow>
        <NameChip who="sade" frame={frame} at={58} />
      </div>
      {/* The line comes in only once the reply has landed, so the reply is read first. */}
      <Headline frame={frame} from={76}>
        {"They reply to check in, and\nit shows up on your goal."}
      </Headline>
    </>
  );
}

/* ---------- Scene 7: end card ---------- */

/** Laid out like the dark "Join Bestday" post: wordmark top, large headline, "Do it. Together." small in yellow at the bottom. */
export function EndCard() {
  const frame = useCurrentFrame();
  const lockup = ramp(frame, 36, 10);
  const cta = ramp(frame, 60, 10);
  const room = ramp(frame, 14, 30);
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Img src={staticFile("logos/wordmark-white.png")} style={{ position: "absolute", left: MARGIN, top: 300, width: 330, opacity: lockup, transform: `translateY(${(1 - lockup) * 12}px)` }} />
      <Headline frame={frame} from={0} size={88} top={700}>
        {"Building your Circle\njust got easier."}
      </Headline>
      <div style={{ position: "absolute", left: MARGIN, top: 920, fontFamily: BRAND, fontWeight: 400, fontSize: 40, lineHeight: 1.3, color: "#FFFFFF", opacity: 0.7 * cta, transform: `translateY(${(1 - cta) * 10}px)` }}>
        Available now. Update the app to try it.
      </div>
      <Room t={room} frame={frame} />
      <div style={{ position: "absolute", left: MARGIN, top: 1420, fontFamily: BRAND, fontWeight: 700, fontSize: 40, letterSpacing: "0.04em", color: YELLOW, opacity: lockup }}>Do it. Together.</div>
    </AbsoluteFill>
  );
}

/**
 * The brand's 15_room illustration, redrawn from its SVG so it can move: the room's outline draws
 * itself, three figures are already inside, and the fourth steps in last. Soft, below the copy.
 */
function Room({ t, frame }: { t: number; frame: number }) {
  if (t <= 0) return null;
  const perimeter = 2 * (260 + 220);
  const figures = [
    { x: 155, y: 215, r: -8, at: 22 },
    { x: 200, y: 225, r: 0, at: 26 },
    { x: 245, y: 212, r: 8, at: 30 },
    { x: 200, y: 175, r: 4, at: 44 },
  ];
  return (
    <svg viewBox="0 0 400 400" style={{ position: "absolute", left: 560, top: 1000, width: 380, height: 380, opacity: 0.55 }}>
      <rect x="70" y="100" width="260" height="220" rx="18" fill="none" stroke={YELLOW} strokeWidth="6" strokeDasharray={perimeter} strokeDashoffset={perimeter * (1 - t)} />
      {figures.map((p, i) => {
        const s = ramp(frame, p.at, 12);
        const step = i === 3 ? (1 - s) * 40 : 0;
        return (
          <g key={i} transform={`translate(${p.x + step},${p.y + (1 - s) * 10}) rotate(${p.r})`} opacity={s}>
            <rect x="-8.64" y="-2" width="17.28" height="28.8" rx="8.64" fill={YELLOW} />
            <circle cx="0" cy="-14.96" r="10.8" fill={YELLOW} />
          </g>
        );
      })}
    </svg>
  );
}
