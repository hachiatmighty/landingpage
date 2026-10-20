import type { ComponentType } from "react";
import { CheckInScreen } from "./app/CheckInScreen";
import { CircleScreen } from "./app/CircleScreen";
import { DeviceScreen } from "./app/DeviceScreen";
import { GoalsScreen } from "./app/GoalsScreen";
import { C } from "./app/theme";

export type AppScreenVariant = "goals" | "circle" | "checkin";

const SCREENS: Record<AppScreenVariant, ComponentType> = {
  goals: GoalsScreen,
  circle: CircleScreen,
  checkin: CheckInScreen,
};

/**
 * The app, rebuilt in code from its own source (BestdayApp/src), so every mockup on the page is the
 * real design rather than an illustration of it. See `app/native.tsx` for how the React Native
 * styles carry over. The content is representative, never a real member's data.
 */
export function AppScreen({ variant }: { variant: AppScreenVariant }) {
  const Screen = SCREENS[variant];
  return (
    <DeviceScreen background={C.surface}>
      <Screen />
    </DeviceScreen>
  );
}
