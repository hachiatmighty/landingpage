import type { CSSProperties } from "react";
import { ArrowLeft, Check, ChevronRight, Search, Target } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";
import { sim } from "./motion";
import { Tap } from "./Tap";

/*
 * Inviting people into the Circle, rebuilt from screenshots of the current app:
 * the "Invite to your Circle" email sheet on a goal, and the Invite to Circle flow that starts from
 * the Circle screen's + (Choose a goal, then the people list for that goal). The content is
 * representative, never a real member's data.
 */

const GUTTER = 20;
const MUTED = C.onSurfaceMuted;
/** The Circle's size limit, and the spots it leaves with the mockups' four members plus Dami. */
export const CIRCLE_LIMIT = 50;
const SPOTS_LEFT = `${CIRCLE_LIMIT - 5} spots left`;

const Avatar = ({ member, initial, size = 42 }: { member?: number; initial?: string; size?: number }) => (
  <V style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", background: "#8F8F8F", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {member !== undefined ? (
      <img src={MEMBERS[member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      <T style={{ ...urbanist(600), fontSize: size * 0.4, color: C.white }}>{initial}</T>
    )}
  </V>
);

/** The stacked header these screens share: back arrow, centred title, spots left beneath. */
function InviteHeader() {
  return (
    <V style={{ height: 70, justifyContent: "center", marginTop: 6 }}>
      <V style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 44, justifyContent: "center", alignItems: "center" }}>
        <ArrowLeft size={24} color={C.onSurface} />
      </V>
      <V style={{ alignItems: "center" }}>
        <T style={{ ...urbanist(600), fontSize: 17, color: C.onSurface }}>Invite to Circle</T>
        <T style={{ ...urbanist(400), fontSize: 14, color: MUTED, marginTop: 3 }}>{SPOTS_LEFT}</T>
      </V>
    </V>
  );
}

const rowStyle = (last: boolean, height = 63): CSSProperties => ({ ...row, gap: 13, paddingInline: GUTTER, height, borderBottom: last ? undefined : `${HAIRLINE}px solid ${C.borderSubtle}` });
const subText: CSSProperties = { ...urbanist(400), fontSize: 14.5, color: MUTED, marginTop: 2 };

/* ---------- The email sheet ---------- */

const SHEET_TOP = 469;

/**
 * The sheet the Circle action on a goal opens: title, one line of explanation, the email field
 * and Send invite. `email` is what has been typed; Send invite stays dim until there is some.
 */
export function InviteByEmailSheet({ email = "" }: { email?: string }) {
  return (
    <>
      <V style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.6)" }} />
      <V style={{ position: "absolute", left: 0, right: 0, top: SHEET_TOP, bottom: 0, zIndex: 41, background: C.surfaceFloating, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingInline: GUTTER }}>
        <V style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, background: C.textGray400, marginTop: 10 }} />
        <T style={{ ...urbanist(700), fontSize: 22, color: C.onSurface, marginTop: 26 }}>Invite to your Circle</T>
        <T style={{ ...urbanist(400), fontSize: 15, color: MUTED, marginTop: 8 }}>They get an email and can reply to your goal updates.</T>
        <V style={{ marginTop: 24, height: 58, borderRadius: 16, background: C.inputBackground, justifyContent: "center", paddingInline: 18 }}>
          <T style={{ ...urbanist(email ? 500 : 400), fontSize: 17, color: email ? C.onSurface : MUTED }}>{email || "Email address"}</T>
        </V>
        <V style={{ marginTop: 22, height: 58, borderRadius: 29, background: C.primary, alignItems: "center", justifyContent: "center", opacity: email ? 1 : 0.4 }}>
          <T style={{ ...urbanist(700), fontSize: 17, color: C.onPrimary }}>Send invite</T>
        </V>
      </V>
    </>
  );
}

/* ---------- Invite to Circle: Choose a goal ---------- */

export const SAMPLE_GOALS = [
  { text: "Run a half marathon", period: "Quarterly goal" },
  { text: "Ship Bestday v2", period: "Quarterly goal" },
  { text: "Two nights a week, no laptop", period: "Yearly goal" },
];

/** Invite to Circle, step one: pick the goal this person will help with. The loop taps the first goal. */
export function ChooseGoalScreen() {
  return (
    <V style={{ height: "100%", paddingTop: INSETS.top, background: C.surface }}>
      <InviteHeader />
      <V style={{ paddingInline: GUTTER, marginTop: 14 }}>
        <T style={{ ...urbanist(700), fontSize: 27, color: C.onSurface }}>Choose a goal</T>
        <T style={{ ...urbanist(400), fontSize: 15.5, lineHeight: "22px", color: MUTED, marginTop: 8 }}>Pick the goal this person will help keep you accountable on.</T>
      </V>
      <V style={{ marginTop: 26 }}>
        {SAMPLE_GOALS.map((goal, i) => (
          <V key={goal.text} style={rowStyle(i === SAMPLE_GOALS.length - 1, 67)}>
            <V style={{ width: 42, height: 42, borderRadius: 21, background: C.surfaceInput, alignItems: "center", justifyContent: "center" }}>
              <Target size={20} color="#9A9A9A" strokeWidth={2} />
            </V>
            <V style={{ flex: 1 }}>
              <T style={{ ...urbanist(600), fontSize: 16, color: C.onSurface }}>{goal.text}</T>
              <T style={subText}>{goal.period}</T>
            </V>
            <ChevronRight size={20} color={MUTED} />
            {i === 0 && <Tap x={196} y={33} />}
          </V>
        ))}
      </V>
    </V>
  );
}

/* ---------- Invite to Circle: the people list ---------- */

/** People the member follows; the Circle's own members already show as ✓ Member. */
const PEOPLE: { name: string; username: string; member?: number; initial?: string; isMember?: boolean; joins?: boolean }[] = [
  { name: "Jen Park", username: "@jenpark", member: 3, isMember: true },
  { name: "Maya Bell", username: "@mayabell", member: 1, joins: true },
  { name: "Rotimi Adeyemi", username: "@rotimi.runs", member: 0 },
  { name: "Tomi Okafor", username: "@tomi", member: 2, isMember: true },
  { name: "Ada Obi", username: "@ada.obi", initial: "A" },
];

const InviteButton = ({ style }: { style?: CSSProperties }) => (
  <V style={{ width: 70, height: 35, borderRadius: 17.5, background: C.surfaceInput, alignItems: "center", justifyContent: "center", ...style }}>
    <T style={{ ...urbanist(500), fontSize: 15.5, color: C.onSurface }}>Invite</T>
  </V>
);

const MemberBadge = ({ style }: { style?: CSSProperties }) => (
  <V style={{ ...row, gap: 5, paddingRight: 8, ...style }}>
    <Check size={16} color={MUTED} strokeWidth={2} />
    <T style={{ ...urbanist(500), fontSize: 16, color: MUTED }}>Member</T>
  </V>
);

/**
 * Invite to Circle, step two: the goal (with Change), a search field, then people with Invite or
 * ✓ Member. The loop taps one Invite and it turns into ✓ Member.
 */
export function PeopleListScreen({ goal = SAMPLE_GOALS[0].text }: { goal?: string }) {
  return (
    <V style={{ height: "100%", paddingTop: INSETS.top, background: C.surface }}>
      <InviteHeader />
      <V style={{ ...row, gap: 9, paddingInline: GUTTER, height: 44, borderBottom: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
        <Target size={17} color={C.primary} strokeWidth={2.2} />
        <T lines={1} style={{ ...urbanist(600), fontSize: 16.5, color: C.onSurface, flex: 1 }}>{goal}</T>
        <T style={{ ...urbanist(500), fontSize: 16, color: C.primary }}>Change</T>
      </V>
      <V style={{ ...row, gap: 10, marginInline: GUTTER, marginTop: 10, marginBottom: 6, height: 46, borderRadius: 14, background: C.surfaceInput, paddingInline: 15 }}>
        <Search size={19} color={MUTED} />
        <T style={{ ...urbanist(400), fontSize: 16.5, color: MUTED }}>Search by name or username</T>
      </V>
      {PEOPLE.map((p) => (
        <V key={p.username} style={{ ...row, gap: 13, paddingInline: GUTTER, height: 63 }}>
          <Avatar member={p.member} initial={p.initial} />
          <V style={{ flex: 1 }}>
            <T style={{ ...urbanist(500), fontSize: 16.5, color: C.onSurface }}>{p.name}</T>
            <T style={subText}>{p.username}</T>
          </V>
          <V style={{ width: 104, height: 35, alignItems: "flex-end", justifyContent: "center" }}>
            {p.isMember ? (
              <MemberBadge />
            ) : p.joins ? (
              <>
                <InviteButton style={{ position: "absolute", right: 0, ...sim("out-a") }} />
                <MemberBadge style={{ opacity: 0, ...sim("in-a") }} />
                <Tap x={69} y={17} />
              </>
            ) : (
              <InviteButton />
            )}
          </V>
        </V>
      ))}
    </V>
  );
}

