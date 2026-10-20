import { Clock, TrendingUp } from "lucide-react";
import { INSETS, SCREEN } from "./device";
import { C, row, urbanist } from "./theme";
import { T, V } from "./native";

/**
 * components/Goal/ProgressSliderSheet.tsx: the sheet "Update progress" opens. Progress and History
 * tabs, the value in big type, a slider with its five milestones, and Save, which stays dimmed
 * until the value has moved. The tour drives `value` the way a thumb would.
 */

const EASE = "cubic-bezier(.2,.8,.2,1)";
const MILESTONES = [0, 25, 50, 75, 100];

const SHEET_HEIGHT = Math.round(SCREEN.height * 0.6);
const TAB_MARGIN = 16;
const TAB_GAP = 4;
const TAB_PADDING = 4;
const TAB_WIDTH = (SCREEN.width - TAB_MARGIN * 2 - TAB_PADDING * 2 - TAB_GAP) / 2;
const THUMB = 28;

export function ProgressSheet({ open, value, initial, pressSave }: { open: boolean; value: number; initial: number; pressSave: boolean }) {
  const changed = value !== initial;

  return (
    <>
      <V style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.6)", opacity: open ? 1 : 0, transition: `opacity 0.4s ${EASE}`, pointerEvents: "none" }} />
      <V
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: SHEET_HEIGHT,
          zIndex: 41,
          background: C.surfaceFloating,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: `transform 0.55s ${EASE}`,
        }}
      >
        <V style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, background: C.textGray400, marginBlock: 10 }} />

        {/* tab bar */}
        <V style={{ flexDirection: "row", marginInline: TAB_MARGIN, marginBottom: 20, marginTop: 6, background: C.surfaceHighlight, borderRadius: 12, padding: TAB_PADDING, gap: TAB_GAP }}>
          <V style={{ position: "absolute", top: TAB_PADDING, left: TAB_PADDING, bottom: TAB_PADDING, width: TAB_WIDTH, background: C.primaryTint, borderRadius: 8 }} />
          {[
            { label: "Progress", Icon: TrendingUp, active: true },
            { label: "History", Icon: Clock, active: false },
          ].map(({ label, Icon, active }) => (
            <V key={label} style={{ ...row, justifyContent: "center", width: TAB_WIDTH, minHeight: 40, gap: 6 }}>
              <Icon size={16} color={active ? C.primary : C.textGray400} strokeWidth={active ? 2.5 : 2} />
              <T style={{ ...urbanist(600), fontSize: 15, color: active ? C.primary : C.onSurfaceMuted }}>{label}</T>
            </V>
          ))}
        </V>

        <V style={{ paddingInline: 20, paddingTop: 8 }}>
          {/* value */}
          <V style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginBottom: 8 }}>
            <T style={{ ...urbanist(700), fontSize: 56, lineHeight: "64px", color: C.primary }}>{value}</T>
            <T style={{ ...urbanist(700), fontSize: 24, color: C.primary, marginLeft: 2 }}>%</T>
          </V>

          {/* slider */}
          <V style={{ height: 40, justifyContent: "center", marginBottom: 8 }}>
            <V style={{ height: 4, borderRadius: 2, background: C.surfaceHighlight }}>
              <V style={{ height: 4, borderRadius: 2, background: C.primary, width: `${value}%`, transition: `width 0.6s ${EASE}` }} />
            </V>
            <V
              style={{
                position: "absolute",
                top: (40 - THUMB) / 2,
                left: `calc(${value}% - ${(THUMB * value) / 100}px)`,
                width: THUMB,
                height: THUMB,
                borderRadius: THUMB / 2,
                background: C.primary,
                boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
                transition: `left 0.6s ${EASE}`,
              }}
            />
          </V>

          {/* milestones */}
          <V style={{ ...row, justifyContent: "space-between", paddingInline: 8, marginBottom: 20 }}>
            {MILESTONES.map((milestone) => {
              const active = value >= milestone;
              const current = Math.abs(value - milestone) <= 3;
              return (
                <V key={milestone} style={{ alignItems: "center", gap: 6 }}>
                  <V style={{ width: 8, height: 8, borderRadius: 4, background: active ? C.primary : C.surfaceHighlight, transform: `scale(${current ? 1.4 : 1})`, transition: `background 0.3s ${EASE}, transform 0.3s ${EASE}` }} />
                  <T style={{ ...urbanist(current ? 700 : 500), fontSize: 13, color: active ? C.onSurface : C.onSurfaceMuted }}>{milestone}</T>
                </V>
              );
            })}
          </V>

          <V
            style={{
              minHeight: 52,
              borderRadius: 26,
              background: C.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: INSETS.bottom,
              opacity: changed ? 1 : 0.4,
              transform: pressSave ? "scale(0.97)" : "scale(1)",
              transition: `transform 0.2s ${EASE}, opacity 0.3s ${EASE}`,
            }}
          >
            <T style={{ ...urbanist(700), fontSize: 16, color: C.onPrimary }}>Save</T>
          </V>
        </V>
      </V>
    </>
  );
}
