import type { CSSProperties, ReactNode } from "react";
import { SYSTEM } from "./theme";

/**
 * A tiny React Native layout layer for the app replicas.
 *
 * The phone mockups are ports of the real app screens (BestdayApp/src/screens/Main/*), and the
 * cheapest way to keep them exact is to copy each StyleSheet across value for value. That only
 * works if a web <div> lays out the way an RN <View> does, so `V` applies RN's defaults: flex column,
 * no implicit shrinking, border-box, relative positioning. `T` is RN <Text>.
 *
 * Styles are inline objects rather than Tailwind classes on purpose: they are the app's StyleSheets,
 * transcribed, and keeping them in that shape is what lets a reader diff one against the other.
 * Everything renders on a 393x852pt canvas (iPhone 16) that `DeviceScreen` scales to fit.
 */

const VIEW: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  position: "relative",
  boxSizing: "border-box",
  flexShrink: 0,
  minWidth: 0,
  minHeight: 0,
};


export function V({ style, children }: { style?: CSSProperties; children?: ReactNode }) {
  return <div style={{ ...VIEW, ...style }}>{children}</div>;
}

export function T({ style, lines, children }: { style?: CSSProperties; lines?: number; children: ReactNode }) {
  const clamp: CSSProperties = lines
    ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }
    : { display: "block" };
  return (
    <span style={{ fontFamily: SYSTEM, lineHeight: 1.2, margin: 0, whiteSpace: lines === 1 ? "nowrap" : undefined, textOverflow: lines === 1 ? "ellipsis" : undefined, ...clamp, ...style }}>
      {children}
    </span>
  );
}
