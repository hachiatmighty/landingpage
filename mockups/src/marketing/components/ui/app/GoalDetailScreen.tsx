import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowUp, MoreHorizontal, Sparkles, ThumbsUp, Users } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";

/**
 * screens/Main/GoalDetail for the sample goal, following GoalActivityHeader.tsx, GoalCommentRow.tsx,
 * ProgressUpdateItem.tsx and styles.ts: meta line, title, progress with "Update progress", the
 * React and Circle actions, then Activity (newest first) with the comment box pinned to the bottom.
 * Its state comes from the hero tour (GoalTour.tsx), which drives it the way a finger would.
 */

const GUTTER = 20;
const EASE = "cubic-bezier(.2,.8,.2,1)";

/** The comment the member writes after updating progress, typed into the box a few characters at a time. */
export const COMMENT = "Did my first 5k this morning. Slow, but I finished.";

const AI_COLOR = C.primary;

export interface GoalDetailState {
  progress: number;
  /** "Update progress" is being pressed. */
  pressUpdate: boolean;
  /** People the goal is shared with. */
  circle: number;
  /** The progress update has landed in Activity. */
  showUpdate: boolean;
  /** Characters of the comment typed so far. */
  typed: number;
  pressSend: boolean;
  /** The comment has been sent and sits in Activity. */
  sent: boolean;
  /** The AI coach has replied to it. */
  coachReplied: boolean;
  /** A Circle member has replied too. */
  circleReplied: boolean;
}

export const TourTap = ({ x, y }: { x: number | string; y: number | string }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 54,
      height: 54,
      borderRadius: 27,
      background: "rgba(255,255,255,0.35)",
      border: "2px solid rgba(255,255,255,0.7)",
      pointerEvents: "none",
      zIndex: 60,
      opacity: 0,
      animation: "bd-sim-tap-once 0.7s ease-out both",
    }}
  />
);

const Avatar = ({ member, size = 32, style }: { member: number; size?: number; style?: CSSProperties }) => (
  <V style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", background: C.textGray400, ...style }}>
    <img src={MEMBERS[member].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </V>
);

/** userIcon.tsx with no photo: the first letter on grey. AI coaches carry no avatar image. */
const InitialAvatar = ({ letter, size = 32 }: { letter: string; size?: number }) => (
  <V style={{ width: size, height: size, borderRadius: size / 2, background: C.textGray400, alignItems: "center", justifyContent: "center" }}>
    <T style={{ ...urbanist(600), fontSize: size * 0.4, color: C.white }}>{letter}</T>
  </V>
);

/** Wraps a newly arrived row so it slides open instead of popping in. */
const Arrive = ({ shown, children }: { shown: boolean; children: ReactNode }) => (
  <V style={{ display: "grid", gridTemplateRows: shown ? "1fr" : "0fr", transition: `grid-template-rows 0.5s ${EASE}` }}>
    <V style={{ minHeight: 0, overflow: "hidden", opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(-8px)", transition: `opacity 0.5s ${EASE}, transform 0.5s ${EASE}` }}>
      {children}
    </V>
  </V>
);

const bodyText = { ...urbanist(400), fontSize: 16, lineHeight: "22px", color: C.onSurfaceSubtle, marginTop: 2 };

/** GoalCommentRow: avatar, then a bubble holding "name  AI  time" and the text, with React beneath it. */
function CommentBubble({ avatar, name, ai, children }: { avatar: ReactNode; name: string; ai?: boolean; children: ReactNode }) {
  return (
    <V style={{ ...row, alignItems: "flex-start", gap: 10, marginBottom: 8, paddingBottom: 4 }}>
      {avatar}
      <V style={{ flex: 1 }}>
      <V style={{ background: C.surfaceHighlight, borderRadius: 16, paddingInline: 14, paddingBlock: 10 }}>
        <V style={row}>
          <T lines={1} style={{ ...urbanist(600), fontSize: 15, color: C.onSurface }}>{name}</T>
          {ai && (
            <V style={{ ...row, gap: 3, marginLeft: 6, paddingInline: 6, paddingBlock: 2, borderRadius: 4, background: `${AI_COLOR}20` }}>
              <Sparkles size={10} color={AI_COLOR} />
              <T style={{ fontWeight: 700, fontSize: 11, letterSpacing: 0.5, color: AI_COLOR }}>AI</T>
            </V>
          )}
          <T style={{ ...urbanist(500), fontSize: 13, color: C.onSurfaceMuted, marginLeft: 8 }}>now</T>
        </V>
        {children}
      </V>
      {/* React, under each comment */}
      <V style={{ ...row, gap: 6, marginTop: 8, marginLeft: 4 }}>
        <ThumbsUp size={14} color={C.onSurfaceMuted} />
        <T style={{ ...urbanist(600), fontSize: 13, color: C.onSurfaceMuted }}>React</T>
      </V>
      </V>
    </V>
  );
}

export function GoalDetailScreen({ state }: { state: GoalDetailState }) {
  const { progress, pressUpdate, circle, showUpdate, typed, pressSend, sent, coachReplied, circleReplied } = state;
  const draft = COMMENT.slice(0, typed);
  const empty = !showUpdate && !sent;

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
          <T style={{ ...urbanist(600), fontSize: 14, color: C.onSurfaceMuted }}>2026 Q4</T>
        </V>
        <T style={{ ...urbanist(700), fontSize: 26, lineHeight: "32px", color: C.onSurface }}>Run a half marathon</T>
        <T style={{ ...urbanist(500), fontSize: 15, color: C.onSurfaceMuted, marginTop: 8 }}>Due Nov 8</T>

        <V style={{ marginTop: 20 }}>
          <V style={{ ...row, justifyContent: "space-between", minHeight: 40, marginBottom: 10 }}>
            <T style={{ ...urbanist(700), fontSize: 22, color: C.onSurface }}>{progress}%</T>
            <V
              style={{
                minHeight: 40,
                paddingInline: 16,
                borderRadius: 20,
                background: C.primary,
                justifyContent: "center",
                transform: pressUpdate ? "scale(0.94)" : "scale(1)",
                transition: `transform 0.2s ${EASE}`,
              }}
            >
              <T style={{ ...urbanist(700), fontSize: 15, color: C.onPrimary }}>Update progress</T>
            </V>
          </V>
          <V style={{ height: 6, borderRadius: 3, background: C.surfaceHighlight, overflow: "hidden" }}>
            <V style={{ height: "100%", width: `${progress}%`, borderRadius: 3, background: C.primary, transition: `width 0.9s ${EASE}` }} />
          </V>
        </V>

        <V style={{ ...row, marginTop: 12, marginLeft: -10 }}>
          <V style={{ ...row, gap: 6, minHeight: 44, paddingInline: 10 }}>
            <ThumbsUp size={18} color={C.onSurfaceMuted} />
            <T style={{ ...urbanist(600), fontSize: 15, color: C.onSurfaceMuted }}>React</T>
          </V>
          <V style={{ ...row, gap: 6, minHeight: 44, paddingInline: 10 }}>
            <Users size={18} color={C.onSurfaceMuted} />
            <T style={{ ...urbanist(600), fontSize: 15, color: C.onSurfaceMuted }}>Circle · {circle}</T>
          </V>
        </V>
      </V>

      {/* activity, newest first */}
      <V style={{ paddingInline: 16, paddingTop: 20 }}>
        <T style={{ ...urbanist(700), fontSize: 17, color: C.onSurface, marginBottom: 4, paddingInline: 4 }}>Activity</T>

        <Arrive shown={empty}>
          <T style={{ ...urbanist(500), fontSize: 15, color: C.onSurfaceMuted, textAlign: "center", paddingBlock: 28 }}>No activity yet</T>
        </Arrive>

        <Arrive shown={circleReplied}>
          <CommentBubble avatar={<Avatar member={1} />} name="Maya Bell">
            <T style={bodyText}>Proud of you! Saturday run next week?</T>
          </CommentBubble>
        </Arrive>

        <Arrive shown={coachReplied}>
          <CommentBubble avatar={<InitialAvatar letter="S" />} name="SPARTAN" ai>
            <T style={bodyText}>First 5k done. Keep Saturday for the long run and add 2k a week.</T>
          </CommentBubble>
        </Arrive>

        <Arrive shown={sent}>
          <CommentBubble avatar={<Avatar member={4} />} name="Sade">
            <T style={bodyText}>{COMMENT}</T>
          </CommentBubble>
        </Arrive>

        {/* ProgressUpdateItem: a flat row, one sentence saying what changed */}
        <Arrive shown={showUpdate}>
          <V style={{ ...row, alignItems: "flex-start", gap: 12, paddingBlock: 12, paddingInline: 4 }}>
            <Avatar member={4} />
            <V style={{ flex: 1 }}>
              <V style={{ ...row, gap: 6 }}>
                <T style={{ ...urbanist(700), fontSize: 15, color: C.onSurface }}>Sade</T>
                <T style={{ ...urbanist(500), fontSize: 13, color: C.onSurfaceMuted }}>· now</T>
              </V>
              <T style={{ ...urbanist(500), fontSize: 15, lineHeight: "21px", color: C.onSurfaceSubtle, marginTop: 4 }}>
                Updated progress to <span style={{ ...urbanist(700), color: C.primary }}>{progress}%</span>
              </T>
            </V>
          </V>
        </Arrive>
      </V>

      {/* comment box */}
      <V style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: INSETS.bottom, background: C.surface, borderTop: `${HAIRLINE}px solid ${C.borderSubtle}`, zIndex: 5 }}>
        <V style={{ ...row, gap: 10, paddingInline: 16, paddingBlock: 10 }}>
          <Avatar member={4} />
          {/* the field holds the send arrow on its right, dim until there is text */}
          <V style={{ flex: 1, ...row, minHeight: 42, borderRadius: 21, background: C.surfaceInput, paddingLeft: 16, paddingRight: 10, paddingBlock: 8, gap: 8 }}>
            <V style={{ flex: 1 }}>
              {draft ? (
                <T style={{ ...urbanist(400), fontSize: 15, lineHeight: "20px", color: C.onSurface }}>{draft}</T>
              ) : (
                <T lines={1} style={{ ...urbanist(400), fontSize: 15, color: C.onSurfaceMuted }}>Add a comment (@ to mention)</T>
              )}
            </V>
            <V style={{ opacity: draft ? 1 : 0.4, transform: pressSend ? "scale(0.85)" : "scale(1)", transition: `opacity 0.3s ${EASE}, transform 0.2s ${EASE}` }}>
              <ArrowUp size={20} color={C.primary} strokeWidth={2.2} />
            </V>
          </V>
        </V>
      </V>
    </V>
  );
}
