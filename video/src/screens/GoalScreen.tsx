import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { ArrowLeft, MoreHorizontal, Send, ThumbsUp, Users } from "lucide-react";
import { INSETS } from "../lib/device";
import { GOAL, REPLY, SADE, DAMI } from "../lib/layout";
import { C, HAIRLINE, row, urbanist } from "../lib/theme";
import { T, V } from "../lib/native";

/**
 * Sade's goal in the app, after the mockups' GoalDetailScreen.tsx (itself a port of
 * screens/Main/GoalDetail), driven by the frame instead of CSS transitions.
 */

const GUTTER = 20;

/** Where things sit on the 393x852 screen, for taps. */
export const GOAL_POINTS = {
  update: { x: 318, y: 262 },
  circle: { x: 160, y: 321 },
} as const;

export interface GoalScreenProps {
  progress: number;
  /** Scale of the "Update progress" button (press feedback). */
  updateScale?: number;
  /** Scale of the Circle action (press feedback). */
  circleScale?: number;
  circle: number;
  /** 0 → 1 as the "Updated progress" row arrives in Activity. */
  updateIn?: number;
  updateValue?: number;
  /** 0 → 1 as Dami's emailed reply arrives in Activity. */
  replyIn?: number;
  /** 0 → 1 → 0 glow on the newly arrived reply. */
  replyGlow?: number;
}

const Photo = ({ src, size = 32 }: { src: string; size?: number }) => (
  <V style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", background: C.textGray400 }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </V>
);

/** userIcon.tsx with no photo: the first letter on grey. Email-only Circle members have no photo. */
export const InitialAvatar = ({ letter, size = 32 }: { letter: string; size?: number }) => (
  <V style={{ width: size, height: size, borderRadius: size / 2, background: C.textGray400, alignItems: "center", justifyContent: "center" }}>
    <T style={{ ...urbanist(600), fontSize: size * 0.42, color: C.white }}>{letter}</T>
  </V>
);

/** A row opening into the list: grows from nothing and fades up. */
const Arrive = ({ t, max, children }: { t: number; max: number; children: ReactNode }) => (
  <V style={{ maxHeight: t * max, overflow: "hidden", opacity: t, transform: `translateY(${(1 - t) * -8}px)` }}>{children}</V>
);

const bodyText: CSSProperties = { ...urbanist(400), fontSize: 16, lineHeight: "22px", color: C.onSurfaceSubtle, marginTop: 2 };

export function GoalScreen({ progress, updateScale = 1, circleScale = 1, circle, updateIn = 0, updateValue = progress, replyIn = 0, replyGlow = 0 }: GoalScreenProps) {
  const empty = 1 - Math.max(updateIn, replyIn);

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top, background: C.surface }}>
      {/* header */}
      <V style={{ ...row, justifyContent: "space-between", paddingInline: 8, paddingBlock: 4 }}>
        <V style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={24} color={C.onSurface} />
        </V>
        <V style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <MoreHorizontal size={24} color={C.onSurface} />
        </V>
      </V>

      {/* hero */}
      <V style={{ paddingInline: GUTTER, paddingTop: 8, paddingBottom: 4, borderBottom: `${HAIRLINE}px solid ${C.borderSubtle}` }}>
        <V style={{ ...row, minHeight: 24, marginBottom: 10 }}>
          <T style={{ ...urbanist(600), fontSize: 14, color: C.onSurfaceMuted }}>{GOAL.period}</T>
        </V>
        <T style={{ ...urbanist(700), fontSize: 26, lineHeight: "32px", color: C.onSurface }}>{GOAL.title}</T>
        <T style={{ ...urbanist(500), fontSize: 15, color: C.onSurfaceMuted, marginTop: 8 }}>{GOAL.due}</T>

        <V style={{ marginTop: 20 }}>
          <V style={{ ...row, justifyContent: "space-between", minHeight: 40, marginBottom: 10 }}>
            <T style={{ ...urbanist(700), fontSize: 22, color: C.onSurface }}>{Math.round(progress)}%</T>
            <V style={{ minHeight: 40, paddingInline: 16, borderRadius: 20, background: C.primary, justifyContent: "center", transform: `scale(${updateScale})` }}>
              <T style={{ ...urbanist(700), fontSize: 15, color: C.onPrimary }}>Update progress</T>
            </V>
          </V>
          <V style={{ height: 6, borderRadius: 3, background: C.surfaceHighlight, overflow: "hidden" }}>
            <V style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: C.primary }} />
          </V>
        </V>

        <V style={{ ...row, marginTop: 12, marginLeft: -10 }}>
          <V style={{ ...row, gap: 6, minHeight: 44, paddingInline: 10 }}>
            <ThumbsUp size={18} color={C.onSurfaceMuted} />
            <T style={{ ...urbanist(600), fontSize: 15, color: C.onSurfaceMuted }}>React</T>
          </V>
          <V style={{ ...row, gap: 6, minHeight: 44, paddingInline: 10, transform: `scale(${circleScale})` }}>
            <Users size={18} color={C.onSurfaceMuted} />
            <T style={{ ...urbanist(600), fontSize: 15, color: C.onSurfaceMuted }}>{circle ? `Circle · ${circle}` : "Circle"}</T>
          </V>
        </V>
      </V>

      {/* activity, newest first */}
      <V style={{ paddingInline: 16, paddingTop: 20 }}>
        <T style={{ ...urbanist(700), fontSize: 17, color: C.onSurface, marginBottom: 4, paddingInline: 4 }}>Activity</T>

        <Arrive t={empty} max={90}>
          <T style={{ ...urbanist(500), fontSize: 15, color: C.onSurfaceMuted, textAlign: "center", paddingBlock: 28 }}>No activity yet</T>
        </Arrive>

        {/* GoalCommentRow for a reply that came in by email */}
        <Arrive t={replyIn} max={120}>
          <V style={{ ...row, alignItems: "flex-start", gap: 10, marginBottom: 8, paddingBlock: 8 }}>
            <InitialAvatar letter={DAMI.first[0]} />
            <V
              style={{
                flex: 1,
                background: C.surfaceHighlight,
                borderRadius: 16,
                paddingInline: 14,
                paddingBlock: 10,
                boxShadow: `0 0 0 ${1.5 * replyGlow}px rgba(255,222,89,${0.9 * replyGlow}), 0 0 ${24 * replyGlow}px rgba(255,222,89,${0.35 * replyGlow})`,
              }}
            >
              <V style={row}>
                <T lines={1} style={{ ...urbanist(600), fontSize: 15, color: C.onSurface }}>{DAMI.first}</T>
                <T style={{ ...urbanist(500), fontSize: 13, color: C.onSurfaceMuted, marginLeft: 8 }}>now</T>
              </V>
              <T style={bodyText}>{REPLY}</T>
            </V>
          </V>
        </Arrive>

        {/* ProgressUpdateItem: a flat row, one sentence saying what changed */}
        <Arrive t={updateIn} max={90}>
          <V style={{ ...row, alignItems: "flex-start", gap: 12, paddingBlock: 12, paddingInline: 4 }}>
            <Photo src={SADE.photo} />
            <V style={{ flex: 1 }}>
              <V style={{ ...row, gap: 6 }}>
                <T style={{ ...urbanist(700), fontSize: 15, color: C.onSurface }}>{SADE.first}</T>
                <T style={{ ...urbanist(500), fontSize: 13, color: C.onSurfaceMuted }}>· {replyIn > 0 ? "2m" : "now"}</T>
              </V>
              <T style={{ ...urbanist(500), fontSize: 15, lineHeight: "21px", color: C.onSurfaceSubtle, marginTop: 4 }}>
                Updated progress to <span style={{ ...urbanist(700), color: C.primary }}>{updateValue}%</span>
              </T>
            </V>
          </V>
        </Arrive>
      </V>

      {/* comment box */}
      <V style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: INSETS.bottom, background: C.surface, borderTop: `${HAIRLINE}px solid ${C.borderSubtle}`, zIndex: 5 }}>
        <V style={{ ...row, gap: 10, paddingInline: 16, paddingBlock: 10 }}>
          <Photo src={SADE.photo} />
          <V style={{ flex: 1, minHeight: 40, borderRadius: 20, background: C.surfaceInput, justifyContent: "center", paddingInline: 16, paddingBlock: 8 }}>
            <T style={{ ...urbanist(400), fontSize: 15, color: C.onSurfaceMuted }}>Add a comment (@ to mention)</T>
          </V>
          <V style={{ opacity: 0.4 }}>
            <Send size={20} color={C.primary} />
          </V>
        </V>
      </V>
    </V>
  );
}
