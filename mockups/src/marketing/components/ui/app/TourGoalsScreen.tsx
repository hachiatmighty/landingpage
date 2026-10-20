import { Plus } from "lucide-react";
import { INSETS } from "./device";
import { GoalRow, GoalsHeader, PeriodSwitcher } from "./GoalsScreen";
import { GOAL_TITLE } from "./NewGoalScreen";
import { TabBar } from "./TabBar";
import { C, Fonts, row } from "./theme";
import { T, V } from "./native";

/** What the Goals tab shows at one moment of the hero tour. */
export interface TourGoalsState {
  /** The goal has been saved; before that the tab holds nothing. */
  hasGoal: boolean;
  /** People the goal is shared with, shown on its row. */
  circle: number;
}

export const EMPTY_GOALS: TourGoalsState = { hasGoal: false, circle: 0 };

/** The new row arrives with a short fade and rise (keyframes in motion.css). */
const arrive = { animation: "bd-tour-arrive 0.55s cubic-bezier(.2,.8,.2,1) both" };

/**
 * screens/Main/Goals.tsx for a member with no goals in the period: the same header and period
 * switcher, a "Focus for Q4" line at 0/0, and one tappable row that opens New goal. Once the tour
 * has saved a goal the row is replaced by that goal, exactly as the app swaps them.
 */
export function TourGoalsScreen({ state }: { state: TourGoalsState }) {
  const { hasGoal, circle } = state;

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top }}>
      <GoalsHeader />

      <V style={{ padding: 20 }}>
        <PeriodSwitcher />

        <V style={{ marginBottom: 8, ...row, justifyContent: "space-between", gap: 12, minHeight: 44 }}>
          <T style={{ ...Fonts.textRegular, ...Fonts.textBold }}>Focus for Q4</T>
          <V style={row}>
            <V style={{ width: 60, height: 4, background: C.surfaceHighlight, borderRadius: 2 }} />
            <T style={{ ...Fonts.textTiny, color: C.onSurfaceMuted, marginLeft: 8 }}>0/{hasGoal ? 1 : 0}</T>
          </V>
        </V>

        {hasGoal ? (
          <V style={arrive}>
            <GoalRow goal={{ text: GOAL_TITLE, due: "Due Nov 8", circle: circle || undefined }} first last simulate={false} />
          </V>
        ) : (
          <V style={{ background: C.surfaceInput, borderRadius: 16, overflow: "hidden" }}>
            <V style={{ ...row, justifyContent: "center", paddingBlock: 24, paddingInline: 16 }}>
              <Plus size={24} color={C.primary} />
              <T style={{ ...Fonts.textSmall, color: C.primary, marginLeft: 12 }}>Add Q4 goals</T>
            </V>
          </V>
        )}
      </V>

      <TabBar active="goals" />
    </V>
  );
}
