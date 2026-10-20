import { Share2, X } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS, SCREEN } from "./device";
import { C, urbanist } from "./theme";
import { T, V } from "./native";

/*
 * components/ShareGoalProgress: the prompt that follows a first goal. The card is the app's own
 * 1080 x 1920 share image (GoalShareCard.tsx), drawn with the same coordinates and the layout
 * rules from layout.ts, at 0% so it has the "starting" headline and no progress ring.
 */

const EASE = "cubic-bezier(.2,.8,.2,1)";

const CARD = { width: 1080, height: 1920 };
const AVATAR_RADIUS = 120;
const CENTER_X = CARD.width / 2;
const YELLOW = "#FFDE59";
const INK = "#111111";

const NAME = "Sade Okoye";
const NAME_SIZE = 68;
const STAGE_LINE = "is starting a Q4 2026 goal";
/** layoutGoalText("Run a half marathon"): 96pt Urbanist Bold breaks after the third word. */
const GOAL = { fontSize: 96, lines: ["Run a half", "marathon"] };

/** layout.ts cardLayout for this card: avatar, name, stage and goal stacked, centred between the wordmark and footer. */
const cap = (size: number) => size * 0.72;
const goalLineHeight = Math.round(GOAL.fontSize * 1.15);
const heights = [AVATAR_RADIUS * 2, 56, cap(NAME_SIZE), 24, cap(46), 80, cap(GOAL.fontSize) + goalLineHeight * (GOAL.lines.length - 1)];
const total = heights.reduce((sum, value) => sum + value, 0);
const top = 250 + Math.max((1700 - 250 - total) / 2, 0);
const avatarY = top + AVATAR_RADIUS;
const nameY = top + AVATAR_RADIUS * 2 + 56 + cap(NAME_SIZE);
const stageY = nameY + 24 + cap(46);
const goalY = stageY + 80 + cap(GOAL.fontSize);

const font = (weight: 700 | 600) => ({ fontFamily: '"Urbanist", -apple-system, sans-serif', fontWeight: weight });

function ShareCard({ width }: { width: number }) {
  return (
    <svg width={width} height={(width * CARD.height) / CARD.width} viewBox={`0 0 ${CARD.width} ${CARD.height}`} style={{ display: "block" }}>
      <defs>
        <radialGradient id="tour-share-glow" cx="50%" cy="22%" r="75%">
          <stop offset="0" stopColor={YELLOW} stopOpacity={0.3} />
          <stop offset="1" stopColor={YELLOW} stopOpacity={0} />
        </radialGradient>
        <clipPath id="tour-share-avatar">
          <circle cx={CENTER_X} cy={avatarY} r={AVATAR_RADIUS} />
        </clipPath>
      </defs>
      <rect width={CARD.width} height={CARD.height} fill={INK} />
      <rect width={CARD.width} height={CARD.height} fill="url(#tour-share-glow)" />
      <text x={80} y={180} fill={YELLOW} fontSize={80} {...font(700)}>
        Bestday
      </text>
      <circle cx={CENTER_X} cy={avatarY} r={AVATAR_RADIUS + 10} fill={YELLOW} />
      <image
        x={CENTER_X - AVATAR_RADIUS}
        y={avatarY - AVATAR_RADIUS}
        width={AVATAR_RADIUS * 2}
        height={AVATAR_RADIUS * 2}
        href={MEMBERS[4].src}
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#tour-share-avatar)"
      />
      <text x={CENTER_X} y={nameY} fill="#FFFFFF" fontSize={NAME_SIZE} textAnchor="middle" {...font(700)}>
        {NAME}
      </text>
      <text x={CENTER_X} y={stageY} fill={YELLOW} fontSize={46} textAnchor="middle" {...font(600)}>
        {STAGE_LINE}
      </text>
      {GOAL.lines.map((line, index) => (
        <text key={line} x={CENTER_X} y={goalY + index * goalLineHeight} fill="#FFFFFF" fontSize={GOAL.fontSize} textAnchor="middle" {...font(700)}>
          {line}
        </text>
      ))}
      <text x={CENTER_X} y={1800} fill="#FFFFFF" fontSize={52} textAnchor="middle" {...font(700)}>
        Do it. Together.
      </text>
      <text x={CENTER_X} y={1862} fill="rgba(255,255,255,0.65)" fontSize={40} textAnchor="middle" {...font(600)}>
        bestday.ai
      </text>
    </svg>
  );
}

/** The 9:16 card fits between the header and the share button, as in the app. */
const PREVIEW_HEIGHT = SCREEN.height - INSETS.top - INSETS.bottom - 252;
const PREVIEW_WIDTH = Math.min(SCREEN.width - 48, (PREVIEW_HEIGHT * CARD.width) / CARD.height);

/** "Share your new goal": the card, a Share button that opens the system sheet, and Not now. */
export function ShareGoalPrompt({ open, pressShare }: { open: boolean; pressShare: boolean }) {
  return (
    <V
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 26,
        background: C.mediaBackground,
        paddingTop: INSETS.top + 8,
        paddingBottom: INSETS.bottom + 16,
        paddingInline: 24,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: `transform 0.55s ${EASE}`,
      }}
    >
      <V style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44 }}>
        <T style={{ ...urbanist(700), fontSize: 20, color: "#FFFFFF" }}>Share your new goal</T>
        <V style={{ width: 44, height: 44, alignItems: "flex-end", justifyContent: "center" }}>
          <X size={24} color="#FFFFFF" />
        </V>
      </V>

      <V style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBlock: 16 }}>
        <V style={{ borderRadius: 20, overflow: "hidden" }}>
          <ShareCard width={PREVIEW_WIDTH} />
        </V>
      </V>

      <V
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 52,
          borderRadius: 26,
          background: C.primary,
          transform: pressShare ? "scale(0.97)" : "scale(1)",
          transition: `transform 0.2s ${EASE}`,
        }}
      >
        <Share2 size={18} color={C.onPrimary} />
        <T style={{ ...urbanist(700), fontSize: 16, color: C.onPrimary }}>Share</T>
      </V>
      <V style={{ minHeight: 44, alignItems: "center", justifyContent: "center", marginTop: 8 }}>
        <T style={{ ...urbanist(600), fontSize: 15, color: C.onMediaMuted }}>Not now</T>
      </V>
    </V>
  );
}
