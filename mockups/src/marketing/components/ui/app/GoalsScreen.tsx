import { Check, ChevronRight, ChevronUp, Circle, MessageCircle, Plus, Search, Settings, Users } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { TabBar } from "./TabBar";
import { C, Fonts, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";
import { sim } from "./motion";
import { Tap } from "./Tap";

export interface SampleGoal {
  text: string;
  due?: string;
  dueSoon?: boolean;
  comments?: number;
  unread?: number;
  circle?: number;
  completed?: boolean;
  /** The goal the simulated finger completes in the loop. */
  sim?: boolean;
}

/* Representative content, not a member's data. "Today" is late October, so the current quarter is
   Q4, the tabs show this quarter and the year, and a goal due Oct 31 reads as due soon. */
const GOALS: SampleGoal[] = [
  { text: "Run a half marathon", due: "Due Nov 8", comments: 6, circle: 4 },
  { text: "Ship Bestday v2", due: "Due Oct 31", dueSoon: true, unread: 2, circle: 3, sim: true },
  { text: "Two nights a week, no laptop", completed: true, circle: 2 },
];

const CIRCLE_USERS = [
  { name: "Rotimi", goals: 3, member: 0, unread: 1 },
  { name: "Maya", goals: 2, member: 1 },
  { name: "Tomi", goals: 4, member: 2, done: true },
  { name: "Jen", goals: 1, member: 3 },
];

const PERIODS = ["Q4", "2026"];

/** components/Goals/GoalRow.tsx */
export function GoalRow({ goal, first, last, simulate }: { goal: SampleGoal; first: boolean; last: boolean; simulate: boolean }) {
  const playing = simulate && goal.sim;
  const meta = { fontSize: 11, color: C.textGray400 };
  return (
    <V
      style={{
        background: C.surfaceInput,
        borderBottom: last ? undefined : `${HAIRLINE}px solid ${C.borderSubtle}`,
        borderTopLeftRadius: first ? 16 : 0,
        borderTopRightRadius: first ? 16 : 0,
        borderBottomLeftRadius: last ? 16 : 0,
        borderBottomRightRadius: last ? 16 : 0,
        overflow: "hidden",
      }}
    >
      <V style={{ ...row, paddingBlock: 14, paddingInline: 14 }}>
        <V style={{ marginRight: 12 }}>
          {goal.completed ? (
            <V style={{ width: 20, height: 20, borderRadius: 10, background: C.success, alignItems: "center", justifyContent: "center" }}>
              <Check size={12} color={C.secondary} strokeWidth={3} />
            </V>
          ) : (
            <Circle size={20} color={C.textGray400} strokeWidth={1.5} />
          )}
          {playing && (
            <>
              <V style={{ position: "absolute", inset: 0, borderRadius: 10, background: C.success, alignItems: "center", justifyContent: "center", ...sim("in-a") }}>
                <Check size={12} color={C.secondary} strokeWidth={3} />
              </V>
              <Tap x={10} y={10} />
            </>
          )}
        </V>
        <V style={{ flex: 1, marginRight: 8 }}>
          <V style={{ alignSelf: "flex-start", ...(playing ? sim("dim") : null) }}>
            <T lines={2} style={{ ...Fonts.textRegular, ...(goal.completed ? { textDecoration: "line-through", opacity: 0.5 } : null) }}>
              {goal.text}
            </T>
            {playing && (
              <V style={{ position: "absolute", left: 0, right: 0, top: "52%", height: 1.5, background: C.textGray800, transformOrigin: "left center", ...sim("strike") }} />
            )}
          </V>
          <V style={{ ...row, marginTop: 4, gap: 12 }}>
            {goal.due && <T style={{ ...meta, color: goal.dueSoon ? C.warning : C.textGray400 }}>{goal.due}</T>}
            <V style={{ ...row, gap: 12 }}>
              {goal.unread ? (
                <V style={{ ...row, gap: 4, background: C.primary, borderRadius: 999, paddingInline: 8, paddingBlock: 4 }}>
                  <MessageCircle size={12} color={C.secondary} />
                  <T style={{ fontSize: 11, color: C.secondary, fontWeight: 700 }}>{goal.unread} new</T>
                </V>
              ) : goal.comments ? (
                <V style={{ ...row, gap: 4 }}>
                  <MessageCircle size={12} color={C.textGray400} />
                  <T style={meta}>{goal.comments}</T>
                </V>
              ) : null}
              {goal.circle ? (
                <V style={{ ...row, gap: 4 }}>
                  <Users size={12} color={C.textGray400} />
                  <T style={meta}>{goal.circle}</T>
                </V>
              ) : null}
            </V>
          </V>
        </V>
        <ChevronRight size={16} color={C.textGray400} />
      </V>
    </V>
  );
}

/** components/Circle/CircleUsersRow.tsx, with the userIcon.tsx avatar at 48pt. */
function CircleUsersRow({ simulate }: { simulate: boolean }) {
  return (
    <V style={{ flexDirection: "row", gap: 16 }}>
      {CIRCLE_USERS.map((user) => (
        <V key={user.name} style={{ alignItems: "center", width: 72 }}>
          <V style={{ width: 56, height: 56, alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
            <V style={{ width: 48, height: 48, borderRadius: 24, overflow: "hidden", background: C.textGray400 }}>
              <img src={MEMBERS[user.member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </V>
            {user.done && (
              <V style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, background: C.success, border: `2px solid ${C.secondary}` }} />
            )}
            {user.unread ? (
              <V style={{ ...(simulate ? sim("pop-b") : null), position: "absolute", top: 0, right: 0, minWidth: 22, height: 22, borderRadius: 11, paddingInline: 6, background: C.primary, alignItems: "center", justifyContent: "center", border: `2px solid ${C.secondary}` }}>
                <T style={{ ...urbanist(700), fontSize: 10, color: C.white }}>{user.unread}</T>
              </V>
            ) : null}
          </V>
          <T lines={1} style={{ ...urbanist(600), fontSize: 13, textAlign: "center", marginBottom: 2, color: C.textGray800 }}>{user.name}</T>
          <T lines={1} style={{ ...urbanist(400), fontSize: 11, textAlign: "center", color: C.textGray400 }}>
            {user.goals} {user.goals === 1 ? "goal" : "goals"}
          </T>
        </V>
      ))}
    </V>
  );
}

/** The Goals tab header: title, add, settings and the Circle pill. */
export function GoalsHeader() {
  return (
    <V style={{ paddingInline: 16, paddingTop: 12, paddingBottom: 8 }}>
      <V style={{ ...row, justifyContent: "space-between" }}>
        <T style={Fonts.titleRegular}>Goals</T>
        <V style={row}>
          <V style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
            <Plus size={20} color={C.primary} strokeWidth={2.5} />
          </V>
          <V style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 8 }}>
            <Settings size={20} color={C.primary} strokeWidth={2.5} />
          </V>
          <V style={{ ...row, gap: 6, height: 36, paddingInline: 12, borderRadius: 18, background: C.primaryTint }}>
            <Users size={16} color={C.primary} strokeWidth={2.5} />
            <T style={{ ...urbanist(700), fontSize: 14, color: C.primary }}>Circle</T>
          </V>
        </V>
      </V>
    </V>
  );
}

/** The Q4 / 2026 switcher and the search button beside it. */
export function PeriodSwitcher() {
  return (
    <V style={{ ...row, alignItems: "stretch", gap: 8, marginTop: 4, marginBottom: 12 }}>
      <V style={{ flex: 1, flexDirection: "row", padding: 4, gap: 6, borderRadius: 14, background: C.surfaceTint }}>
        {PERIODS.map((period, i) => (
          <V
            key={period}
            style={{ flex: 1, paddingBlock: 10, paddingInline: 2, borderRadius: 10, alignItems: "center", justifyContent: "center", background: i === 0 ? C.primaryTint : undefined }}
          >
            <T style={{ ...urbanist(i === 0 ? 700 : 600), fontSize: 12, letterSpacing: 0.1, color: i === 0 ? C.primary : C.onSurfaceMuted }}>{period}</T>
          </V>
        ))}
      </V>
      <V style={{ width: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", background: C.surfaceTint }}>
        <Search size={18} color={C.onSurfaceMuted} />
      </V>
    </V>
  );
}

/**
 * screens/Main/Goals.tsx, the Goals tab on its current quarter. `simulate` plays the screen's own
 * loop (a goal gets completed); the hero tour turns it off because it drives the screen itself.
 */
export function GoalsScreen({ simulate = true }: { simulate?: boolean }) {
  const completed = GOALS.filter((goal) => goal.completed).length;

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top }}>
      <GoalsHeader />

      <V style={{ padding: 20 }}>
        <PeriodSwitcher />

        {/* what the period holds */}
        <V style={{ marginBottom: 8, ...row, justifyContent: "space-between", gap: 12, minHeight: 44 }}>
          <T style={{ ...Fonts.textRegular, ...Fonts.textBold }}>Focus for Q4</T>
          <V style={row}>
            {/* In the loop the simulated goal completes, so the bar and the count step up by one. */}
            <V style={{ width: 60, height: 4, background: C.surfaceHighlight, borderRadius: 2, overflow: "hidden" }}>
              <V
                style={{
                  height: "100%",
                  width: `${((simulate ? completed + 1 : completed) / GOALS.length) * 100}%`,
                  background: C.success,
                  borderRadius: 2,
                  transformOrigin: "left center",
                  ...(simulate ? { ["--bd-sim-from" as string]: completed / (completed + 1), ...sim("fill") } : null),
                }}
              />
            </V>
            <V style={{ marginLeft: 8, overflow: "hidden" }}>
              <T style={{ ...Fonts.textTiny, color: C.onSurfaceMuted, ...(simulate ? sim("rise-out") : null) }}>
                {completed}/{GOALS.length}
              </T>
              {simulate && (
                <T style={{ ...Fonts.textTiny, color: C.onSurfaceMuted, position: "absolute", left: 0, top: 0, ...sim("rise-in") }}>
                  {completed + 1}/{GOALS.length}
                </T>
              )}
            </V>
          </V>
        </V>

        {GOALS.map((goal, i) => (
          <GoalRow key={goal.text} goal={goal} first={i === 0} last={i === GOALS.length - 1} simulate={simulate} />
        ))}

        {/* divider, then the Circle's shared goals */}
        <V style={{ height: 0, marginBlock: 16 }} />
        <V style={{ marginTop: 24 }}>
          <V style={{ ...row, justifyContent: "space-between", marginBottom: 12 }}>
            <T style={{ ...Fonts.textRegular, ...Fonts.textBold }}>My Circle - Q4</T>
            <ChevronUp size={18} color={C.onSurfaceMuted} />
          </V>
          <CircleUsersRow simulate={simulate} />
        </V>
      </V>

      <TabBar active="goals" />
    </V>
  );
}
