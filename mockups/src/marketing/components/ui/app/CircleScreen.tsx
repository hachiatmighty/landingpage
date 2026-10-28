import type { ReactNode } from "react";
import { ArrowLeft, BarChart2, Heart, MoreHorizontal, Plus, Target, type LucideIcon } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";
import { sim } from "./motion";
import { Tap } from "./Tap";

/*
 * screens/Main/ManageCircle.tsx on the My Circle tab, matched to a screenshot of the current app:
 * a plain header with + on the right, underlined tabs, the Circle's size, Members (Invite someone,
 * then each person) and the AI coaches with their taglines.
 */

const CIRCLE_LIMIT = 50;
const GUTTER = 20;
const MUTED = C.onSurfaceMuted;

/* Representative members, not real people's handles. */
const CIRCLE_MEMBERS = [
  { name: "Rotimi Adeyemi", member: 0 },
  { name: "Maya Bell", member: 1 },
  { name: "Tomi Okafor", member: 2 },
  { name: "Jen Park", member: 3 },
];

/* Who joins during the simulated loop: someone invited by email, with no photo. */
const JOINING = { name: "Dami", initial: "D" };

/* The three AI coaches and their taglines, as the Circle screen shows them. */
const AI_COACHES: { name: string; tagline: string; Icon: LucideIcon }[] = [
  { name: "SPARTAN", tagline: "No excuses. Only excellence.", Icon: Target },
  { name: "ORACLE", tagline: "See what you couldn't see before.", Icon: BarChart2 },
  { name: "BLOOM", tagline: "Growth happens naturally here.", Icon: Heart },
];

const SEPARATOR = `${HAIRLINE}px solid ${C.borderSubtle}`;
const nameStyle = { ...urbanist(500), fontSize: 16, color: C.onSurface };
const subtitleStyle = { ...urbanist(400), fontSize: 14.5, color: MUTED, marginTop: 2 };

const more = (
  <V style={{ padding: 8 }}>
    <MoreHorizontal size={20} color={MUTED} />
  </V>
);

/** One row: a 42pt avatar, the name with an optional subtitle, and an optional action. */
function MemberRow({ avatar, name, subtitle, action, border = true }: { avatar: ReactNode; name: ReactNode; subtitle?: ReactNode; action?: ReactNode; border?: boolean }) {
  return (
    <V style={{ ...row, gap: 13, height: 63, paddingInline: GUTTER, borderBottom: border ? SEPARATOR : undefined }}>
      {avatar}
      <V style={{ flex: 1 }}>
        {name}
        {typeof subtitle === "string" ? <T lines={1} style={subtitleStyle}>{subtitle}</T> : subtitle}
      </V>
      {action}
    </V>
  );
}

const SectionHeading = ({ title, count }: { title: string; count: ReactNode }) => (
  <V style={{ ...row, justifyContent: "space-between", paddingInline: GUTTER, marginTop: 30, marginBottom: 8 }}>
    <T style={{ ...urbanist(700), fontSize: 20, color: C.onSurface }}>{title}</T>
    {count}
  </V>
);

/** A number that ticks over in the loop: the old value rises out as the new one rises in. */
const Ticker = ({ from, to, style }: { from: string; to: string; style: object }) => (
  <V style={{ overflow: "hidden" }}>
    <T style={{ ...style, ...sim("rise-out") }}>{from}</T>
    <T style={{ ...style, position: "absolute", left: 0, top: 0, ...sim("rise-in") }}>{to}</T>
  </V>
);

/** The Circle screen. The loop taps Invite someone and Dami joins by email, so the counts tick over. */
export function CircleScreen() {
  const members = CIRCLE_MEMBERS.length;

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top }}>
      {/* header */}
      <V style={{ height: 70, justifyContent: "center", marginTop: 6 }}>
        <V style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 44, justifyContent: "center", alignItems: "center" }}>
          <ArrowLeft size={24} color={C.onSurface} />
        </V>
        <T style={{ ...urbanist(600), fontSize: 18, color: C.onSurface, textAlign: "center" }}>Circle</T>
        <V style={{ position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" }}>
          <Plus size={26} color={C.onSurface} strokeWidth={2} />
        </V>
      </V>

      {/* tabs */}
      <V style={{ flexDirection: "row", gap: 24, paddingInline: GUTTER, borderBottom: SEPARATOR }}>
        <V style={{ paddingBlock: 12 }}>
          <T style={{ ...urbanist(600), fontSize: 16, color: C.onSurface }}>My Circle</T>
          <V style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2.5, borderRadius: 2, background: C.primary }} />
        </V>
        <V style={{ paddingBlock: 12 }}>
          <T style={{ ...urbanist(500), fontSize: 16, color: MUTED }}>Circles I'm in</T>
        </V>
      </V>

      <T style={{ ...urbanist(400), fontSize: 14.5, color: MUTED, paddingInline: GUTTER, marginTop: 22 }}>Build your accountability circle with up to {CIRCLE_LIMIT} people.</T>

      <SectionHeading title="Members" count={<Ticker from={`${members}`} to={`${members + 1}`} style={{ ...urbanist(400), fontSize: 14, color: MUTED }} />} />
      <MemberRow
        avatar={
          <V style={{ width: 42, height: 42, borderRadius: 21, background: C.surfaceInput, alignItems: "center", justifyContent: "center" }}>
            <Plus size={20} color={C.primary} strokeWidth={2.4} />
          </V>
        }
        name={<T style={nameStyle}>Invite someone</T>}
        subtitle={<Ticker from={`${CIRCLE_LIMIT - members} spots left`} to={`${CIRCLE_LIMIT - members - 1} spots left`} style={subtitleStyle} />}
      />
      <Tap x={41} y={INSETS.top + 6 + 70 + 44 + 46 + 61 + 31} />
      {/* Simulated loop: the person invited by email joins at the top of the list. */}
      <V style={{ overflow: "hidden", ...sim("expand") }}>
        <MemberRow
          avatar={
            <V style={{ width: 42, height: 42, borderRadius: 21, background: "#8F8F8F", alignItems: "center", justifyContent: "center", ...sim("in-a") }}>
              <T style={{ ...urbanist(600), fontSize: 17, color: C.white }}>{JOINING.initial}</T>
            </V>
          }
          name={<T style={nameStyle}>{JOINING.name}</T>}
          subtitle="Joined by email"
          action={more}
        />
      </V>
      {CIRCLE_MEMBERS.map((person, i) => (
        <MemberRow
          key={person.name}
          border={i < CIRCLE_MEMBERS.length - 1}
          avatar={
            <V style={{ width: 42, height: 42, borderRadius: 21, overflow: "hidden", background: C.textGray400 }}>
              <img src={MEMBERS[person.member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </V>
          }
          name={<T lines={1} style={nameStyle}>{person.name}</T>}
          action={more}
        />
      ))}

      <SectionHeading title="AI coaches" count={<T style={{ ...urbanist(400), fontSize: 14, color: MUTED }}>{AI_COACHES.length}</T>} />
      {AI_COACHES.map((coach, i) => (
        <MemberRow
          key={coach.name}
          border={i < AI_COACHES.length - 1}
          avatar={
            <V style={{ width: 42, height: 42, borderRadius: 21, background: C.primary, alignItems: "center", justifyContent: "center" }}>
              <coach.Icon size={20} color="#000" strokeWidth={2.2} />
            </V>
          }
          name={
            <V style={{ ...row, gap: 8 }}>
              <T lines={1} style={nameStyle}>{coach.name}</T>
              <T style={{ ...urbanist(600), fontSize: 12, color: MUTED, letterSpacing: 0.4 }}>AI</T>
            </V>
          }
          subtitle={coach.tagline}
          action={more}
        />
      ))}
    </V>
  );
}
