import type { ReactNode } from "react";
import { ArrowLeft, BarChart2, Heart, MoreHorizontal, Plus, Target, type LucideIcon } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, Fonts, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";
import { sim } from "./motion";
import { Tap } from "./Tap";

const MAX_CIRCLE = 5;

/* Representative members, not real people's handles. */
const CIRCLE_MEMBERS = [
  { name: "Rotimi Adeyemi", username: "@rotimi.runs", member: 0 },
  { name: "Maya Bell", username: "@mayabell", member: 1 },
  { name: "Tomi Okafor", username: "@tomi", member: 2 },
  { name: "Jen Park", username: "@jenpark", member: 3 },
];

/* Who joins during the simulated loop, filling the last spot. */
const JOINING = { name: "Sade Bello", username: "@sade", member: 4 };

/* The three AI coaches Premium includes, as named in the app's catalog. Subtitle is
   coachSubtitle(): specialty and description joined with a middle dot. */
const AI_COACHES: { name: string; subtitle: string; Icon: LucideIcon }[] = [
  { name: "SPARTAN", subtitle: "General · I own this. Done. Next.", Icon: Target },
  { name: "ORACLE", subtitle: "General · See what you couldn't see before.", Icon: BarChart2 },
  { name: "BLOOM", subtitle: "General · Growth happens here.", Icon: Heart },
];

const SEPARATOR = `${HAIRLINE}px solid rgba(255,255,255,0.1)`;
const nameStyle = { ...Fonts.textRegular, ...Fonts.textBold };
const subtitleStyle = { ...Fonts.textSmall, opacity: 0.5 };

/** components/UserRow.tsx inside ManageCircle's memberItem padding. */
function MemberRow({ avatar, name, subtitle, action, border }: { avatar: ReactNode; name: ReactNode; subtitle: ReactNode; action?: ReactNode; border: boolean }) {
  return (
    <V style={{ ...row, paddingBlock: 12, paddingInline: 16, borderBottom: border ? SEPARATOR : undefined }}>
      {avatar}
      <V style={{ flex: 1, marginLeft: 12 }}>
        {name}
        {typeof subtitle === "string" ? <T lines={1} style={subtitleStyle}>{subtitle}</T> : subtitle}
      </V>
      {action}
    </V>
  );
}

const SectionLabel = ({ children }: { children: string }) => (
  <T style={{ ...Fonts.textSmall, marginTop: 24, marginBottom: 12, fontWeight: 500, letterSpacing: 0.5, color: C.textGray400 }}>{children}</T>
);

const card = { background: C.inputBackground, borderRadius: 16, overflow: "hidden" } as const;
const roundButton = { width: 44, height: 44, borderRadius: 22, background: C.inputBackground, alignItems: "center", justifyContent: "center" } as const;
const more = (
  <V style={{ padding: 8, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }}>
    <MoreHorizontal size={20} color={C.textGray400} />
  </V>
);

/** screens/Main/ManageCircle.tsx on the My Circle tab, for a Premium member with four people in. */
export function CircleScreen() {
  const spotsLeft = MAX_CIRCLE - CIRCLE_MEMBERS.length;

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top }}>
      {/* header */}
      <V style={{ ...row, justifyContent: "space-between", paddingInline: 16, paddingBlock: 12 }}>
        <V style={roundButton}>
          <ArrowLeft size={24} color={C.textGray400} />
        </V>
        <V style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <T style={{ ...Fonts.textLarge, ...Fonts.textBold, fontSize: 28 }}>Circle</T>
        </V>
        <V style={roundButton}>
          <Plus size={24} color={C.primary} strokeWidth={2.5} />
        </V>
      </V>

      <V style={{ padding: 30 }}>
        {/* tab switcher. Widths are the app's own arithmetic, which leaves a few points spare at the end. */}
        <V style={{ flexDirection: "row", background: C.inputBackground, borderRadius: 14, padding: 4, marginBottom: 16 }}>
          <V style={{ position: "absolute", top: 4, left: 4, bottom: 4, width: 160, background: "rgba(255, 222, 89, 0.18)", borderRadius: 12 }} />
          {[
            { label: "My Circle", width: 160, active: true },
            { label: "Circles I'm In", width: 161, active: false },
          ].map((tab) => (
            <V key={tab.label} style={{ width: tab.width, paddingBlock: 12, alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
              <T style={{ ...urbanist(tab.active ? 700 : 600), fontSize: 15, letterSpacing: 0.2, color: tab.active ? C.primary : C.textGray400 }}>{tab.label}</T>
            </V>
          ))}
        </V>

        <T style={{ ...Fonts.textRegular, opacity: 0.6, marginTop: 8 }}>
          Build your accountability circle with up to {MAX_CIRCLE} people. Upgrade to Premium Plus for up to 50 members.
        </T>

        <SectionLabel>MEMBERS</SectionLabel>
        <V style={card}>
          <MemberRow
            border
            avatar={
              <V style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }}>
                <Plus size={24} color={C.primary} strokeWidth={2.5} />
              </V>
            }
            name={<T lines={1} style={nameStyle}>Invite someone</T>}
            subtitle={
              <V style={{ overflow: "hidden" }}>
                <T style={{ ...subtitleStyle, ...sim("rise-out") }}>{`${spotsLeft} ${spotsLeft === 1 ? "spot" : "spots"} left`}</T>
                <T style={{ ...subtitleStyle, position: "absolute", left: 0, top: 0, ...sim("rise-in") }}>Circle full</T>
              </V>
            }
          />
          {CIRCLE_MEMBERS.map((person, i) => (
            <MemberRow
              key={person.username}
              border={i < CIRCLE_MEMBERS.length - 1}
              avatar={
                <V style={{ width: 48, height: 48, borderRadius: 24, overflow: "hidden", background: C.textGray400 }}>
                  <img src={MEMBERS[person.member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </V>
              }
              name={<T lines={1} style={nameStyle}>{person.name}</T>}
              subtitle={person.username}
              action={more}
            />
          ))}
          {/* Simulated loop: the invite is tapped and a fifth person joins. */}
          <V style={{ overflow: "hidden", ...sim("expand") }}>
            <V style={{ borderTop: SEPARATOR }}>
              <MemberRow
                border={false}
                avatar={
                  <V style={{ width: 48, height: 48, borderRadius: 24, overflow: "hidden", background: C.textGray400, ...sim("in-a") }}>
                    <img src={MEMBERS[JOINING.member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </V>
                }
                name={<T lines={1} style={nameStyle}>{JOINING.name}</T>}
                subtitle={JOINING.username}
                action={more}
              />
            </V>
          </V>
          <Tap x={40} y={36} />
        </V>

        <SectionLabel>AI COACHES</SectionLabel>
        <V style={card}>
          {AI_COACHES.map((coach, i) => (
            <MemberRow
              key={coach.name}
              border={i < AI_COACHES.length - 1}
              avatar={
                <V style={{ width: 48, height: 48, borderRadius: 24, background: C.primary, alignItems: "center", justifyContent: "center" }}>
                  <coach.Icon size={24} color="#000" strokeWidth={2} />
                </V>
              }
              name={
                <V style={{ ...row, gap: 8 }}>
                  <T lines={1} style={{ ...nameStyle, flexShrink: 1 }}>{coach.name}</T>
                  <T style={{ fontSize: 12, fontWeight: 600, color: C.textGray400 }}>AI</T>
                </V>
              }
              subtitle={coach.subtitle}
              action={<V style={{ padding: 8 }}><MoreHorizontal size={20} color={C.textGray400} /></V>}
            />
          ))}
        </V>
      </V>
    </V>
  );
}
