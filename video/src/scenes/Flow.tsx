import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Phone, Tap, phoneGeometry } from "../components/Phone";
import { Scene } from "../components/Scene";
import { caretOn, mix, press, ramp, typed, window } from "../lib/anim";
import { DAMI, GOAL, REPLY } from "../lib/layout";
import { GOAL_POINTS, GoalScreen } from "../screens/GoalScreen";
import { COMPOSE_POINTS, INBOX_POINTS, Inbox, InviteBody, JoinedBody, Message, MESSAGE_POINTS, ReplySheet, SUBJECTS, UpdateBody, bestdayRow } from "../screens/Mail";
import { PushBanner } from "../screens/PushBanner";
import { INVITE_POINTS, InviteSheet, PROGRESS_POINTS, ProgressSheet, Toast } from "../screens/Sheets";

/** The single phone these scenes share: centred, under a two-line caption. */
export const PHONE = { x: 540, y: 1120, width: 600 } as const;

/** A camera push-in: `t` 0 → 1 zooms to `scale` around the screen point (x, y), in points. */
interface Zoom {
  t: number;
  x: number;
  y: number;
  scale: number;
}

/** Below the caption: a zoomed phone fades out here rather than running under the copy. */
const CAPTION_FLOOR = 470;

/** The phone rises into place over the scene's first frames, and can push in on one spot. */
function HeroPhone({ light = false, zoom, children }: { light?: boolean; zoom?: Zoom; children: ReactNode }) {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, 18);
  const g = phoneGeometry(PHONE.width);
  const z = zoom ? mix(1, zoom.scale, zoom.t) : 1;
  const origin = zoom ? `${g.inset + zoom.x * g.scale}px ${g.inset + zoom.y * g.scale}px` : "center";
  const hide = zoom ? zoom.t : 0;
  const mask = `linear-gradient(to bottom, rgba(0,0,0,${1 - hide}) ${CAPTION_FLOOR - 40}px, #000 ${CAPTION_FLOOR + 40}px)`;
  return (
    <div style={{ position: "absolute", inset: 0, maskImage: mask, WebkitMaskImage: mask }}>
      <Phone x={PHONE.x} y={PHONE.y + (1 - t) * 140} width={PHONE.width} light={light} style={{ opacity: Math.min(1, t * 1.5), transform: `scale(${z})`, transformOrigin: origin }}>
        {children}
      </Phone>
    </div>
  );
}

/** Zoom in over `[start, start + 16]`, hold, and ease back out over `[end - 14, end]`. */
const push = (frame: number, start: number, end: number, x: number, y: number, scale: number): Zoom => ({
  t: ramp(frame, start, 16) * (1 - ramp(frame, end - 14, 14)),
  x,
  y,
  scale,
});

/** A screen that slides in from the right over the one beneath, as a push in a navigation stack. */
const Push = ({ t, children }: { t: number; children: ReactNode }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - t) * 100}%)`, boxShadow: t < 1 ? "-10px 0 30px rgba(0,0,0,0.15)" : undefined }}>{children}</div>
);

const INVITE_ROW = bestdayRow(SUBJECTS.invite, `${DAMI.first}, join ${"Sade Okoye"} on “${GOAL.title}”`);
const JOINED_ROW = bestdayRow(SUBJECTS.joined, "You’re now part of Sade Okoye’s Circle.");
const UPDATE_ROW = bestdayRow(SUBJECTS.update, `“${GOAL.title}” is now at 45%. Reply to check in.`);

/** 4. Sade adds Dami to the Circle by email. */
export function Invite() {
  const frame = useCurrentFrame();
  const tapCircle = 34;
  const typeAt = 58;
  const tapSend = 104;
  const open = ramp(frame, tapCircle + 4, 14) * (1 - ramp(frame, tapSend + 8, 14));
  return (
    <Scene bg="dark">
      <Caption frame={frame} start={6} end={999} size={64}>
        {"Invite anyone with\n*just an email.*"}
      </Caption>
      <HeroPhone zoom={push(frame, typeAt - 10, tapSend + 4, 196, 640, 1.35)}>
        <GoalScreen progress={20} circle={0} circleScale={press(frame, tapCircle)} />
        <InviteSheet open={open} email={typed(DAMI.email, frame, typeAt, 18)} caret={frame > tapCircle + 14 && frame < tapSend && caretOn(frame)} sendScale={press(frame, tapSend, 0.96)} />
        <Toast t={window(frame, tapSend + 14, 200, 10)} text={`Invite sent to ${DAMI.email}`} />
        <Tap x={GOAL_POINTS.circle.x} y={GOAL_POINTS.circle.y} at={tapCircle} frame={frame} />
        <Tap x={INVITE_POINTS.send.x} y={INVITE_POINTS.send.y} at={tapSend} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 5. Dami gets the invite by email and joins with one tap. */
export function Accept() {
  const frame = useCurrentFrame();
  const tapRow = 44;
  const tapAccept = 112;
  const ACCEPT = { x: 100, y: 518 };
  return (
    <Scene bg="light" enter="iris">
      <Caption frame={frame} start={8} end={112} size={64} light>
        {`${DAMI.first} gets it *in their inbox.*`}
      </Caption>
      <Caption frame={frame} start={120} end={999} size={64} light>
        {"One tap to join.\n*No app. No account.*"}
      </Caption>
      <HeroPhone light zoom={push(frame, 150, 400, 196, 420, 1.5)}>
        <Inbox arrivals={[{ row: INVITE_ROW, t: ramp(frame, 18, 14) }]} pressed={window(frame, tapRow - 3, tapRow + 10, 3)} />
        <Push t={ramp(frame, tapRow + 6, 14)}>
          <Message subject={SUBJECTS.invite} scroll={mix(0, 160, ramp(frame, 72, 26))}>
            <InviteBody acceptScale={press(frame, tapAccept, 0.95)} />
          </Message>
        </Push>
        <Push t={ramp(frame, tapAccept + 10, 14)}>
          <Message subject={SUBJECTS.joined}>
            <JoinedBody marker={ramp(frame, 165, 24)} />
          </Message>
        </Push>
        <Tap x={INBOX_POINTS.first.x} y={INBOX_POINTS.first.y} at={tapRow} frame={frame} />
        <Tap x={ACCEPT.x} y={ACCEPT.y} at={tapAccept} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 6. Sade logs progress in the app. */
export function LogProgress() {
  const frame = useCurrentFrame();
  const tapUpdate = 18;
  const tapSave = 74;
  const open = ramp(frame, tapUpdate + 2, 14) * (1 - ramp(frame, tapSave + 4, 14));
  const slider = mix(20, 45, ramp(frame, 38, 24));
  const bar = mix(20, 45, ramp(frame, tapSave + 6, 20));
  return (
    <Scene bg="dark" enter="iris">
      <Caption frame={frame} start={6} end={999} size={64}>
        {"Every time you *log progress…*"}
      </Caption>
      <HeroPhone>
        <GoalScreen progress={bar} circle={1} updateScale={press(frame, tapUpdate)} updateIn={ramp(frame, tapSave + 12, 14)} updateValue={45} />
        <ProgressSheet open={open} value={slider} initial={20} saveScale={press(frame, tapSave, 0.97)} />
        <Tap x={GOAL_POINTS.update.x} y={GOAL_POINTS.update.y} at={tapUpdate} frame={frame} />
        <Tap x={PROGRESS_POINTS.save.x} y={PROGRESS_POINTS.save.y} at={tapSave} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 7. …and Dami gets the new update email. */
export function UpdateEmail() {
  const frame = useCurrentFrame();
  const tapRow = 42;
  const read = (row: typeof INVITE_ROW) => ({ row: { ...row, unread: false, time: "9:41" }, t: 1 });
  return (
    <Scene bg="light" enter="iris">
      <Caption frame={frame} start={8} end={999} size={64} light>
        {"…your Circle *hears about it.*"}
      </Caption>
      <HeroPhone light zoom={push(frame, 58, 400, 196, 440, 1.45)}>
        <Inbox arrivals={[read(INVITE_ROW), read(JOINED_ROW), { row: UPDATE_ROW, t: ramp(frame, 14, 14) }]} pressed={window(frame, tapRow - 3, tapRow + 10, 3)} />
        <Push t={ramp(frame, tapRow + 6, 14)}>
          <Message subject={SUBJECTS.update}>
            <UpdateBody from={20} to={45} fill={ramp(frame, 66, 26)} marker={ramp(frame, 98, 22)} />
          </Message>
        </Push>
        <Tap x={INBOX_POINTS.first.x} y={INBOX_POINTS.first.y} at={tapRow} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 8. Dami replies to the email. */
export function ReplyScene() {
  const frame = useCurrentFrame();
  const tapReply = 14;
  const typeAt = 32;
  const tapSend = 94;
  const open = ramp(frame, tapReply + 2, 14) * (1 - ramp(frame, tapSend + 3, 12));
  return (
    <Scene bg="light">
      <Caption frame={frame} start={6} end={999} size={64} light>
        {`${DAMI.first} just *hits reply.*`}
      </Caption>
      <HeroPhone light zoom={push(frame, typeAt - 6, tapSend - 2, 196, 230, 1.5)}>
        <Message subject={SUBJECTS.update} replyScale={press(frame, tapReply, 0.95)}>
          <UpdateBody from={20} to={45} fill={1} marker={1} />
        </Message>
        <ReplySheet open={open} typed={typed(REPLY, frame, typeAt, 22)} caret={caretOn(frame)} sendScale={press(frame, tapSend, 0.9)} subject={SUBJECTS.update} />
        <Tap x={MESSAGE_POINTS.reply.x} y={MESSAGE_POINTS.reply.y} at={tapReply} frame={frame} />
        <Tap x={COMPOSE_POINTS.send.x} y={COMPOSE_POINTS.send.y} at={tapSend} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 9. The reply lands on Sade's goal, with a push. */
export function Lands() {
  const frame = useCurrentFrame();
  const banner = ramp(frame, 12, 12) * (1 - ramp(frame, 60, 10));
  return (
    <Scene bg="dark" enter="iris">
      <Caption frame={frame} start={8} end={999} size={64}>
        {"…and it lands\n*right on your goal.*"}
      </Caption>
      <HeroPhone zoom={frame < 64 ? push(frame, 8, 64, 196, 110, 1.45) : push(frame, 70, 400, 196, 480, 1.4)}>
        <GoalScreen progress={45} circle={1} updateIn={1} updateValue={45} replyIn={ramp(frame, 66, 14)} replyGlow={window(frame, 72, 130, 10)} />
        <PushBanner t={banner} title="Bestday" body={`${DAMI.first} replied to “${GOAL.title}”: ${REPLY}`} />
      </HeroPhone>
    </Scene>
  );
}
