import { useCurrentFrame } from "remotion";
import { Mail } from "lucide-react";
import { Copy } from "../components/Copy";
import { HeroPhone, push, Push } from "../components/HeroPhone";
import { Tap } from "../components/Phone";
import { Scene } from "../components/Scene";
import { caretOn, mix, pop, press, ramp, typed, window } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { COPY_TOP, DAMI, GOAL, GREY, REPLY, SAFE, SADE, YELLOW } from "../lib/layout";
import { GOAL_POINTS, GoalScreen } from "../screens/GoalScreen";
import { COMPOSE_POINTS, INBOX_POINTS, Inbox, InviteBody, JoinedBody, Message, MESSAGE_POINTS, ReplySheet, SUBJECTS, UpdateBody, bestdayRow } from "../screens/Mail";
import { PushBanner } from "../screens/PushBanner";
import { INVITE_POINTS, InviteSheet, Toast } from "../screens/Sheets";

/*
 * Email Circle invites, the 28-second launch cut. Six scenes on the brand black: the feature's
 * name, then one step per scene (invite, join, updates, replies), then the end card. Each line of
 * copy says what the phone is showing at the same moment.
 */

const INVITE_ROW = bestdayRow(SUBJECTS.invite, `${DAMI.first}, join ${SADE.full} on “${GOAL.title}”`);
const JOINED_ROW = bestdayRow(SUBJECTS.joined, `You’re now part of ${SADE.full}’s Circle.`);
const UPDATE_ROW = bestdayRow(SUBJECTS.update, `“${GOAL.title}” is now at 45%. Reply to check in.`);
const read = (row: typeof INVITE_ROW) => ({ row: { ...row, unread: false, time: "9:41" }, t: 1 });

/** 1. The feature's name. */
export function Title() {
  const frame = useCurrentFrame();
  const field = Math.min(1, pop(frame, 26));
  const email = typed(DAMI.email, frame, 34, 22);
  return (
    <Scene first>
      <Copy frame={frame} start={2} size={44} color={GREY}>
        New in Bestday
      </Copy>
      <Copy frame={frame} start={8} size={112} top={COPY_TOP + 70} style={{ lineHeight: 1.05, letterSpacing: -2.5 }}>
        Email Circle invites
      </Copy>
      {/* Stand-in visual until the brand illustrations are added: the one thing you now need. */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.right - SAFE.left,
          top: 1010,
          height: 124,
          borderRadius: 34,
          border: `3px solid ${YELLOW}`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 38px",
          boxSizing: "border-box",
          opacity: field,
          transform: `translateY(${(1 - field) * 40}px)`,
        }}
      >
        <Mail size={46} color={YELLOW} strokeWidth={2} />
        <span style={{ fontFamily: BRAND, fontWeight: 400, fontSize: 50, color: "#fff" }}>{email}</span>
        <span style={{ width: 3, height: 56, marginLeft: -20, background: YELLOW, opacity: caretOn(frame) ? 1 : 0 }} />
      </div>
    </Scene>
  );
}

/** 2. Invite: Sade adds Dami by email. */
export function Invite() {
  const frame = useCurrentFrame();
  const tapCircle = 22;
  const typeAt = 38;
  const tapSend = 78;
  const open = ramp(frame, tapCircle + 3, 12) * (1 - ramp(frame, tapSend + 6, 12));
  return (
    <Scene>
      <Copy frame={frame}>Add anyone to your Circle with just their email.</Copy>
      <HeroPhone zoom={push(frame, typeAt - 10, tapSend + 4, 196, 640, 1.3)}>
        <GoalScreen progress={20} circle={0} circleScale={press(frame, tapCircle)} />
        <InviteSheet open={open} email={typed(DAMI.email, frame, typeAt, 26)} caret={frame > tapCircle + 12 && frame < tapSend && caretOn(frame)} sendScale={press(frame, tapSend, 0.96)} />
        <Toast t={window(frame, tapSend + 12, 999, 10)} text={`Invite sent to ${DAMI.email}`} />
        <Tap x={GOAL_POINTS.circle.x} y={GOAL_POINTS.circle.y} at={tapCircle} frame={frame} />
        <Tap x={INVITE_POINTS.send.x} y={INVITE_POINTS.send.y} at={tapSend} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 3. Join: Dami accepts from the inbox, no app, no account. */
export function Join() {
  const frame = useCurrentFrame();
  const tapRow = 26;
  const tapAccept = 78;
  const ACCEPT = { x: 100, y: 518 };
  return (
    <Scene>
      <Copy frame={frame}>No app or account needed to join.</Copy>
      <HeroPhone light zoom={push(frame, 102, 999, 196, 420, 1.45)}>
        <Inbox arrivals={[{ row: INVITE_ROW, t: ramp(frame, 10, 12) }]} pressed={window(frame, tapRow - 3, tapRow + 9, 3)} />
        <Push t={ramp(frame, tapRow + 4, 12)}>
          <Message subject={SUBJECTS.invite} scroll={mix(0, 160, ramp(frame, 46, 20))}>
            <InviteBody acceptScale={press(frame, tapAccept, 0.95)} />
          </Message>
        </Push>
        <Push t={ramp(frame, tapAccept + 8, 12)}>
          <Message subject={SUBJECTS.joined}>
            <JoinedBody marker={ramp(frame, 112, 20)} />
          </Message>
        </Push>
        <Tap x={INBOX_POINTS.first.x} y={INBOX_POINTS.first.y} at={tapRow} frame={frame} />
        <Tap x={ACCEPT.x} y={ACCEPT.y} at={tapAccept} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 4. Updates: each goal update reaches Dami as an email. */
export function Updates() {
  const frame = useCurrentFrame();
  const tapRow = 28;
  return (
    <Scene>
      <Copy frame={frame}>They get an email every time you update your goal.</Copy>
      <HeroPhone light zoom={push(frame, 46, 999, 196, 440, 1.45)}>
        <Inbox arrivals={[read(INVITE_ROW), read(JOINED_ROW), { row: UPDATE_ROW, t: ramp(frame, 10, 12) }]} pressed={window(frame, tapRow - 3, tapRow + 9, 3)} />
        <Push t={ramp(frame, tapRow + 4, 12)}>
          <Message subject={SUBJECTS.update}>
            <UpdateBody from={20} to={45} fill={ramp(frame, 56, 24)} marker={ramp(frame, 86, 20)} />
          </Message>
        </Push>
        <Tap x={INBOX_POINTS.first.x} y={INBOX_POINTS.first.y} at={tapRow} frame={frame} />
      </HeroPhone>
    </Scene>
  );
}

/** 5. Replies: Dami replies to the email and it lands on Sade's goal. */
export function Replies() {
  const frame = useCurrentFrame();
  const tapReply = 12;
  const typeAt = 26;
  const tapSend = 72;
  const swap = ramp(frame, 86, 16);
  const banner = ramp(frame, 104, 10) * (1 - ramp(frame, 134, 8));
  const open = ramp(frame, tapReply + 2, 12) * (1 - ramp(frame, tapSend + 3, 10));
  return (
    <Scene>
      <Copy frame={frame}>They reply to check in, and it shows up on your goal.</Copy>
      {/* Dami's phone leaves to the left as Sade's arrives from the right. */}
      <HeroPhone light dx={-swap * 1100} zoom={push(frame, typeAt - 6, tapSend - 2, 196, 230, 1.45)}>
        <Message subject={SUBJECTS.update} replyScale={press(frame, tapReply, 0.95)}>
          <UpdateBody from={20} to={45} fill={1} marker={1} />
        </Message>
        <ReplySheet open={open} typed={typed(REPLY, frame, typeAt, 30)} caret={caretOn(frame)} sendScale={press(frame, tapSend, 0.9)} subject={SUBJECTS.update} />
        <Tap x={MESSAGE_POINTS.reply.x} y={MESSAGE_POINTS.reply.y} at={tapReply} frame={frame} />
        <Tap x={COMPOSE_POINTS.send.x} y={COMPOSE_POINTS.send.y} at={tapSend} frame={frame} />
      </HeroPhone>
      {frame > 80 && (
        <HeroPhone dx={(1 - swap) * 1100} zoom={frame < 140 ? push(frame, 100, 140, 196, 110, 1.4) : push(frame, 142, 999, 196, 480, 1.35)}>
          <GoalScreen progress={45} circle={1} updateIn={1} updateValue={45} replyIn={ramp(frame, 138, 12)} replyGlow={window(frame, 142, 999, 10)} />
          <PushBanner t={banner} title="Bestday" body={`${DAMI.first} replied to “${GOAL.title}”: ${REPLY}`} />
        </HeroPhone>
      )}
    </Scene>
  );
}

/** 6. End card. */
export function EndCard() {
  const frame = useCurrentFrame();
  const sign = ramp(frame, 26, 14);
  return (
    <Scene last>
      <Copy frame={frame} start={8} size={112} style={{ lineHeight: 1.05, letterSpacing: -2.5 }}>
        Bring your best people with you
      </Copy>
      <div style={{ position: "absolute", left: SAFE.left, top: 1150, opacity: sign, transform: `translateY(${(1 - sign) * 24}px)` }}>
        <div style={{ fontFamily: BRAND, fontWeight: 800, fontSize: 120, letterSpacing: -3, color: "#fff", lineHeight: 1 }}>Bestday.</div>
        <div style={{ fontFamily: BRAND, fontWeight: 700, fontSize: 44, letterSpacing: "0.04em", color: YELLOW, marginTop: 26 }}>Do it together.</div>
      </div>
    </Scene>
  );
}
