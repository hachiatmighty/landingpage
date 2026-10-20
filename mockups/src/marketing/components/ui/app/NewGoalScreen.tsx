import { BarChart2, Calendar, Check, Heart, Target, User, X } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";

/** The goal the hero tour creates, typed into the title field a few characters at a time. */
export const GOAL_TITLE = "Run a half marathon";

const EASE = "cubic-bezier(.2,.8,.2,1)";
const GUTTER = 20;

/** Circle members offered as chips, as indices into MEMBERS (the same four the Circle sheet lists). */
export const CIRCLE_CHIPS = [
  { member: 0, name: "Rotimi Adeyemi" },
  { member: 1, name: "Maya Bell" },
  { member: 2, name: "Tomi Okafor" },
  { member: 3, name: "Jen Park" },
];

/** The coaches the form lists, with the icon each personality gets and the tagline under its name. */
export const COACH_ROWS = [
  { name: "SPARTAN", Icon: Target, subtitle: "General · I own this. Done. Next." },
  { name: "ORACLE", Icon: BarChart2, subtitle: "General · See what you couldn't see before." },
  { name: "BLOOM", Icon: Heart, subtitle: "General · Growth happens here." },
];

const caret = (
  <span aria-hidden="true" style={{ width: 2, height: 26, borderRadius: 1, background: C.primary, animation: "bd-tour-caret 1s steps(1) infinite" }} />
);

const sectionTitle = { ...urbanist(700), fontSize: 17, color: C.onSurface };
const caption = { ...urbanist(400), fontSize: 14, lineHeight: "20px", color: C.onSurfaceMuted, marginTop: 8 };

export interface NewGoalState {
  open: boolean;
  /** Characters of the title typed so far. */
  typed: number;
  /** How far the form has scrolled, in points. */
  scroll: number;
  /** Circle members selected, as indices into MEMBERS. */
  circle: number[];
  /** Coaches selected, as indices into COACH_ROWS. */
  coaches: number[];
  pressSave: boolean;
}

/**
 * screens/Main/AddGoal.tsx, the manual form: a Q3 key result or a yearly goal, the goal written
 * inline, then due date, ownership, the Circle it is shared with and the AI coaches that check in
 * on it, with Save goal pinned underneath. It opens as a full-screen modal from Goals.
 */
export function NewGoalScreen({ open, typed, scroll, circle, coaches, pressSave }: NewGoalState) {
  const text = GOAL_TITLE.slice(0, typed);
  const titleStyle = { ...urbanist(700), fontSize: 24, lineHeight: "31px" };

  return (
    <V
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        background: C.surface,
        paddingTop: INSETS.top,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: `transform 0.55s ${EASE}`,
      }}
    >
      {/* header */}
      <V style={{ ...row, paddingInline: 16, paddingBlock: 8, borderBottom: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
        <V style={{ flex: 1, flexDirection: "row" }}>
          <V style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <X size={24} color={C.onSurface} />
          </V>
        </V>
        <T style={{ ...urbanist(700), fontSize: 18, color: C.onSurface }}>New goal</T>
        <V style={{ flex: 1 }} />
      </V>

      {/* form */}
      <V style={{ flex: 1, overflow: "hidden" }}>
        <V style={{ paddingInline: GUTTER, paddingTop: 20, paddingBottom: 32, transform: `translateY(${-scroll}px)`, transition: `transform 0.7s ${EASE}` }}>
          <V style={{ flexDirection: "row", padding: 4, borderRadius: 12, background: C.surfaceInput }}>
            {["Q3 key result", "2026 goal"].map((label, i) => (
              <V key={label} style={{ flex: 1, minHeight: 40, borderRadius: 9, alignItems: "center", justifyContent: "center", background: i === 0 ? C.primary : undefined }}>
                <T style={{ ...urbanist(600), fontSize: 15, color: i === 0 ? C.onPrimary : C.onSurfaceMuted }}>{label}</T>
              </V>
            ))}
          </V>
          <T style={caption}>0 goals in Q3</T>

          <V style={{ ...row, alignItems: "flex-start", marginTop: 24, minHeight: 62, gap: 2 }}>
            {text ? (
              <>
                <T style={{ ...titleStyle, color: C.onSurface }}>{text}</T>
                {open && caret}
              </>
            ) : (
              <>
                {open && caret}
                <T style={{ ...titleStyle, color: C.onSurfaceMuted }}>What will you deliver in Q3?</T>
              </>
            )}
          </V>
          <V style={{ marginTop: 12, minHeight: 46 }}>
            <T style={{ ...urbanist(400), fontSize: 16, lineHeight: "23px", color: C.onSurfaceMuted }}>Add details (optional)</T>
          </V>

          {/* settings as plain rows */}
          <V style={{ marginTop: 24, borderTop: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
            <V style={{ ...row, gap: 14, minHeight: 56, borderBottom: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
              <Calendar size={20} color={C.onSurface} />
              <T style={{ ...urbanist(600), fontSize: 16, color: C.onSurface, flex: 1 }}>Due date</T>
              <T style={{ ...urbanist(500), fontSize: 15, color: C.onSurfaceMuted }}>Nov 8</T>
            </V>
            <V style={{ ...row, gap: 14, minHeight: 56, borderBottom: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
              <User size={20} color={C.onSurface} />
              <T style={{ ...urbanist(600), fontSize: 16, color: C.onSurface, flex: 1 }}>Ownership</T>
              <V style={{ flexDirection: "row", padding: 3, borderRadius: 10, background: C.surfaceInput }}>
                {["Just me", "Shared"].map((label, i) => (
                  <V key={label} style={{ minHeight: 32, paddingInline: 12, borderRadius: 8, alignItems: "center", justifyContent: "center", background: i === 0 ? C.primary : undefined }}>
                    <T style={{ ...urbanist(600), fontSize: 14, color: i === 0 ? C.onPrimary : C.onSurfaceMuted }}>{label}</T>
                  </V>
                ))}
              </V>
            </V>
          </V>

          {/* The people a goal is shared with are its Circle. */}
          <V style={{ marginTop: 28 }}>
            <T style={sectionTitle}>Circle</T>
            <T style={caption}>They see your progress and can cheer you on.</T>
            <V style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {CIRCLE_CHIPS.map((chip) => {
                const selected = circle.includes(chip.member);
                return (
                  <V
                    key={chip.member}
                    style={{
                      ...row,
                      gap: 8,
                      paddingLeft: 4,
                      paddingRight: 12,
                      minHeight: 36,
                      borderRadius: 18,
                      border: `1px solid ${selected ? C.primary : C.borderSubtle}`,
                      background: selected ? C.primaryTint : C.surfaceInput,
                      transition: `background 0.25s ${EASE}, border-color 0.25s ${EASE}`,
                    }}
                  >
                    <V style={{ width: 24, height: 24, borderRadius: 12, overflow: "hidden", background: C.textGray400 }}>
                      <img src={MEMBERS[chip.member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </V>
                    <T lines={1} style={{ ...urbanist(600), fontSize: 15, color: selected ? C.primary : C.onSurface }}>{chip.name}</T>
                    {selected && <Check size={14} color={C.primary} />}
                  </V>
                );
              })}
            </V>
          </V>

          <V style={{ marginTop: 28 }}>
            <T style={sectionTitle}>AI coaches</T>
            <T style={caption}>They check in on your progress every week.</T>
            <V style={{ marginInline: -GUTTER, marginTop: 4 }}>
              {COACH_ROWS.map((coach, index) => {
                const on = coaches.includes(index);
                return (
                  <V key={coach.name} style={{ ...row, minHeight: 64, paddingBlock: 10, paddingInline: GUTTER }}>
                    <V style={{ width: 44, height: 44, borderRadius: 22, background: C.primary, alignItems: "center", justifyContent: "center" }}>
                      <coach.Icon size={20} color={C.onPrimary} strokeWidth={2} />
                    </V>
                    <V style={{ flex: 1, marginLeft: 12 }}>
                      <V style={{ ...row, gap: 8 }}>
                        <T lines={1} style={{ ...urbanist(600), fontSize: 16, color: C.onSurface }}>{coach.name}</T>
                        <T style={{ ...urbanist(600), fontSize: 12, color: C.onSurfaceMuted }}>AI</T>
                      </V>
                      <T lines={1} style={{ ...urbanist(400), fontSize: 14, lineHeight: "19px", color: C.onSurfaceMuted, marginTop: 2 }}>{coach.subtitle}</T>
                    </V>
                    <V
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        border: `1.5px solid ${on ? C.primary : C.onSurfaceDisabled}`,
                        background: on ? C.primary : "transparent",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: `background 0.25s ${EASE}, border-color 0.25s ${EASE}`,
                      }}
                    >
                      {on && <Check size={16} color={C.onPrimary} strokeWidth={3} />}
                    </V>
                  </V>
                );
              })}
            </V>
          </V>
        </V>
      </V>

      {/* footer */}
      <V style={{ paddingInline: GUTTER, paddingTop: 12, paddingBottom: 8 + INSETS.bottom, borderTop: `${HAIRLINE}px solid ${C.borderSubtle}`, background: C.surface }}>
        <V
          style={{
            minHeight: 52,
            borderRadius: 26,
            background: C.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: typed ? 1 : 0.4,
            transform: pressSave ? "scale(0.97)" : "scale(1)",
            transition: `transform 0.2s ${EASE}, opacity 0.3s ${EASE}`,
          }}
        >
          <T style={{ ...urbanist(700), fontSize: 16, color: C.onPrimary }}>Save goal</T>
        </V>
      </V>
    </V>
  );
}
