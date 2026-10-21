import { Check, Clock, TrendingUp } from "lucide-react";
import { INSETS, SCREEN } from "../lib/device";
import { C, row, urbanist } from "../lib/theme";
import { T, V } from "../lib/native";

/** The dimmed backdrop behind a bottom sheet. */
const Scrim = ({ t }: { t: number }) => <V style={{ position: "absolute", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.6)", opacity: t }} />;

/* ---------- Invite to your Circle ---------- */

const INVITE_TOP = 469;
const INPUT_TOP = INVITE_TOP + 118;
const BUTTON_TOP = INPUT_TOP + 58 + 22;

export const INVITE_POINTS = { field: { x: 196, y: INPUT_TOP + 29 }, send: { x: 196, y: BUTTON_TOP + 29 } } as const;

/** The sheet the Circle action opens, as in the app: title, one line of explanation, email field, Send invite. */
export function InviteSheet({ open, email, caret, sendScale = 1, keyboard = 0 }: { open: number; email: string; caret: boolean; sendScale?: number; keyboard?: number }) {
  return (
    <>
      <Scrim t={open} />
      <Keyboard t={keyboard * open} />
      <V
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: INVITE_TOP,
          bottom: 0,
          zIndex: 41,
          background: C.surfaceFloating,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          transform: `translateY(calc(${(1 - open) * 105}% - ${keyboard * KEYBOARD_HEIGHT}px))`,
          paddingInline: 20,
        }}
      >
        <V style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, background: C.textGray400, marginTop: 10 }} />
        <T style={{ ...urbanist(700), fontSize: 22, color: C.onSurface, marginTop: 26 }}>Invite to your Circle</T>
        <T style={{ ...urbanist(400), fontSize: 15, color: C.onSurfaceMuted, marginTop: 8 }}>They get an email and can reply to your goal updates.</T>
        <V style={{ position: "absolute", left: 20, right: 20, top: INPUT_TOP - INVITE_TOP, height: 58, borderRadius: 16, background: C.inputBackground, justifyContent: "center", paddingInline: 18 }}>
          <V style={row}>
            {email ? <T style={{ ...urbanist(500), fontSize: 17, color: C.onSurface }}>{email}</T> : <T style={{ ...urbanist(400), fontSize: 17, color: C.onSurfaceMuted }}>Email address</T>}
            <V style={{ width: 2, height: 22, marginLeft: email ? 1 : -1, background: C.primary, opacity: caret ? 1 : 0, order: email ? 1 : -1 }} />
          </V>
        </V>
        <V
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: BUTTON_TOP - INVITE_TOP,
            height: 58,
            borderRadius: 29,
            background: C.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: email ? 1 : 0.4,
            transform: `scale(${sendScale})`,
          }}
        >
          <T style={{ ...urbanist(700), fontSize: 17, color: C.onPrimary }}>Send invite</T>
        </V>
      </V>
    </>
  );
}

/* ---------- The keyboard ---------- */

/** The iOS keyboard's height on a 393pt-wide iPhone, with the suggestion bar. */
export const KEYBOARD_HEIGHT = 291;

/** The dark-mode iOS keyboard, rising with `t`. When the email field is focused it lifts the sheet with it. */
function Keyboard({ t }: { t: number }) {
  if (t <= 0) return null;
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return (
    <V style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: KEYBOARD_HEIGHT, zIndex: 42, background: "#2B2B2D", transform: `translateY(${(1 - t) * 100}%)`, paddingTop: 52, gap: 12, alignItems: "center" }}>
      {rows.map((keys) => (
        <V key={keys} style={{ flexDirection: "row", gap: 6 }}>
          {keys.split("").map((k) => (
            <V key={k} style={{ width: 33, height: 42, borderRadius: 5, background: "#6B6B6D", alignItems: "center", justifyContent: "center" }}>
              <T style={{ fontSize: 22, color: "#fff" }}>{k}</T>
            </V>
          ))}
        </V>
      ))}
    </V>
  );
}

/** The confirmation toast after sending. `bottom` (pt) moves it up from its usual place above the home indicator. */
export function Toast({ t, text, bottom = INSETS.bottom + 80 }: { t: number; text: string; bottom?: number }) {
  return (
    <V
      style={{
        position: "absolute",
        left: "50%",
        bottom,
        zIndex: 50,
        transform: `translate(-50%, ${(1 - t) * 30}px)`,
        opacity: t,
        ...row,
        gap: 8,
        paddingInline: 16,
        paddingBlock: 12,
        borderRadius: 24,
        background: C.surfaceFloating,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}
    >
      <V style={{ width: 22, height: 22, borderRadius: 11, background: C.statusSuccess, alignItems: "center", justifyContent: "center" }}>
        <Check size={14} color="#fff" strokeWidth={3} />
      </V>
      <T style={{ ...urbanist(600), fontSize: 15, color: C.onSurface }}>{text}</T>
    </V>
  );
}

/* ---------- Update progress ---------- */

const MILESTONES = [0, 25, 50, 75, 100];
const SHEET_HEIGHT = Math.round(SCREEN.height * 0.6);
const TAB_MARGIN = 16;
const TAB_GAP = 4;
const TAB_PADDING = 4;
const TAB_WIDTH = (SCREEN.width - TAB_MARGIN * 2 - TAB_PADDING * 2 - TAB_GAP) / 2;
const THUMB = 28;

/** Save sits at the bottom of the sheet: its centre, for the tap. */
export const PROGRESS_POINTS = { save: { x: 196, y: SCREEN.height - INSETS.bottom - 26 } } as const;

/** The mockups' ProgressSheet.tsx (components/Goal/ProgressSliderSheet.tsx in the app), frame-driven. */
export function ProgressSheet({ open, value, initial, saveScale = 1 }: { open: number; value: number; initial: number; saveScale?: number }) {
  const shown = Math.round(value);
  const changed = shown !== initial;
  return (
    <>
      <Scrim t={open} />
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
          transform: `translateY(${(1 - open) * 105}%)`,
        }}
      >
        <V style={{ alignSelf: "center", width: 40, height: 4, borderRadius: 2, background: C.textGray400, marginBlock: 10 }} />
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
        <V style={{ paddingInline: 20, paddingTop: 8, flex: 1 }}>
          <V style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "center", marginBottom: 8 }}>
            <T style={{ ...urbanist(700), fontSize: 56, lineHeight: "64px", color: C.primary }}>{shown}</T>
            <T style={{ ...urbanist(700), fontSize: 24, color: C.primary, marginLeft: 2 }}>%</T>
          </V>
          <V style={{ height: 40, justifyContent: "center", marginBottom: 8 }}>
            <V style={{ height: 4, borderRadius: 2, background: C.surfaceHighlight }}>
              <V style={{ height: 4, borderRadius: 2, background: C.primary, width: `${value}%` }} />
            </V>
            <V style={{ position: "absolute", top: (40 - THUMB) / 2, left: `calc(${value}% - ${(THUMB * value) / 100}px)`, width: THUMB, height: THUMB, borderRadius: THUMB / 2, background: C.primary, boxShadow: "0 2px 6px rgba(0,0,0,0.35)" }} />
          </V>
          <V style={{ ...row, justifyContent: "space-between", paddingInline: 8, marginBottom: 20 }}>
            {MILESTONES.map((milestone) => {
              const active = value >= milestone;
              const current = Math.abs(value - milestone) <= 3;
              return (
                <V key={milestone} style={{ alignItems: "center", gap: 6 }}>
                  <V style={{ width: 8, height: 8, borderRadius: 4, background: active ? C.primary : C.surfaceHighlight, transform: `scale(${current ? 1.4 : 1})` }} />
                  <T style={{ ...urbanist(current ? 700 : 500), fontSize: 13, color: active ? C.onSurface : C.onSurfaceMuted }}>{milestone}</T>
                </V>
              );
            })}
          </V>
          <V
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: INSETS.bottom,
              minHeight: 52,
              borderRadius: 26,
              background: C.primary,
              alignItems: "center",
              justifyContent: "center",
              opacity: changed ? 1 : 0.4,
              transform: `scale(${saveScale})`,
            }}
          >
            <T style={{ ...urbanist(700), fontSize: 16, color: C.onPrimary }}>Save</T>
          </V>
        </V>
      </V>
    </>
  );
}
