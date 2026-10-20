import { Img, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Phone } from "../components/Phone";
import { Scene } from "../components/Scene";
import { pop, ramp } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { YELLOW } from "../lib/layout";
import { GoalScreen } from "../screens/GoalScreen";
import { Message, SUBJECTS, UpdateBody } from "../screens/Mail";

/** 10. Both worlds side by side: Dami's inbox and Sade's goal. */
export function Payoff() {
  const frame = useCurrentFrame();
  const left = ramp(frame, 4, 20);
  const right = ramp(frame, 10, 20);
  return (
    <Scene bg="dark">
      <Caption frame={frame} start={6} end={999} size={70}>
        {"Your people. Their inbox.\n*Your goal.*"}
      </Caption>
      <Phone x={300 - (1 - left) * 200} y={1090} width={430} light style={{ transform: `rotate(-5deg)`, opacity: left }}>
        <Message subject={SUBJECTS.update} scroll={60}>
          <UpdateBody from={20} to={45} fill={1} marker={1} />
        </Message>
      </Phone>
      <Phone x={780 + (1 - right) * 200} y={1130} width={430} style={{ transform: `rotate(5deg)`, opacity: right }}>
        <GoalScreen progress={45} circle={1} updateIn={1} updateValue={45} replyIn={1} replyGlow={0.6} />
      </Phone>
    </Scene>
  );
}

/** 11. End card. */
export function EndCard() {
  const frame = useCurrentFrame();
  const icon = pop(frame, 6);
  const cta = pop(frame, 22, 12);
  return (
    <Scene bg="dark">
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("app-icon.svg")} style={{ width: 200, height: 200, borderRadius: 60, transform: `scale(${icon})`, boxShadow: "0 20px 60px rgba(255,222,89,0.25)" }} />
        <div style={{ marginTop: 48, fontFamily: BRAND, fontWeight: 600, fontSize: 46, color: "rgba(255,255,255,0.7)", opacity: ramp(frame, 14, 12) }}>Email Circle invites</div>
        <div style={{ marginTop: 34, padding: "26px 64px", borderRadius: 80, background: YELLOW, fontFamily: BRAND, fontWeight: 800, fontSize: 92, letterSpacing: -2, color: "#000", transform: `scale(${Math.max(0, cta)})` }}>Join Bestday</div>
      </div>
    </Scene>
  );
}
