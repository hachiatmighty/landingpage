import { ChevronLeft, ChevronRight, MessageCircle, Target, TrendingUp, X } from "lucide-react";
import { INSETS } from "./device";
import { C, HAIRLINE, row, urbanist } from "./theme";
import { T, V } from "./native";
import { sim } from "./motion";
import { Tap } from "./Tap";

/* Second of three goals: the first is done, this one is current, the third is still to come. */
const SEGMENTS: ("complete" | "active" | "pending")[] = ["complete", "active", "pending"];
const GOAL = { text: "Run a half marathon", progress: 68 };
/* Where the simulated update in the loop takes it. */
const UPDATED = 75;

const SEGMENT_COLOR = { complete: C.primary, active: C.textGray400, pending: C.inputBackground };

/**
 * screens/Main/WeeklyCheckIn.tsx: the story-style Monday check-in, one goal per card.
 *
 * RN's SafeAreaView pads the bottom inset and the footer adds it again, so the card flexes into
 * whatever is left (541pt on this device, under its 570pt cap). The flex chain below reproduces that.
 */
export function CheckInScreen() {
  const progressColor = GOAL.progress === 100 ? C.success : C.primary;
  const index = SEGMENTS.indexOf("active");

  return (
    <V style={{ height: "100%", paddingTop: INSETS.top, paddingBottom: INSETS.bottom, background: C.surface }}>
      {/* story header */}
      <V style={{ paddingInline: 16, paddingTop: 8 }}>
        <V style={{ flexDirection: "row", gap: 5 }}>
          {SEGMENTS.map((state, i) => (
            <V key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: SEGMENT_COLOR[state], overflow: "hidden" }}>
              {/* The active goal's segment fills once its update is saved. */}
              {state === "active" && (
                <V style={{ position: "absolute", inset: 0, background: C.primary, transformOrigin: "left center", ...sim("fill") }} />
              )}
            </V>
          ))}
        </V>
        <V style={{ ...row, height: 58, justifyContent: "space-between" }}>
          <T style={{ ...urbanist(700), fontSize: 12, letterSpacing: 1.4, color: C.textGray400 }}>WEEKLY CHECK-IN</T>
          <V style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <X size={22} color={C.textGray800} />
          </V>
        </V>
      </V>

      {/* body */}
      <V style={{ flex: 1, paddingInline: 16 }}>
        <V style={{ ...row, height: 52, justifyContent: "space-between" }}>
          <ChevronLeft size={24} color={C.textGray400} />
          <T style={{ position: "absolute", left: 0, right: 0, textAlign: "center", ...urbanist(500), fontSize: 13, color: C.textGray400 }}>
            {index + 1} of {SEGMENTS.length}
          </T>
          <ChevronRight size={24} color={C.textGray400} />
        </V>

        <V
          style={{
            flex: 1,
            maxHeight: 570,
            borderRadius: 28,
            background: C.inputBackground,
            border: `${HAIRLINE}px solid rgba(255,255,255,0.12)`,
            padding: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Phase B of the loop: the comment goes out and the Circle sees it. */}
          <V style={{ position: "absolute", top: 18, left: 18, right: 18, ...row, gap: 8, justifyContent: "center", paddingBlock: 10, borderRadius: 999, background: "rgba(255, 222, 89, 0.14)", ...sim("in-b") }}>
            <T style={{ ...urbanist(600), fontSize: 13, color: C.primary }}>Sent to your Circle</T>
          </V>
          <V style={{ width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", background: "rgba(255, 222, 89, 0.14)", marginBottom: 20 }}>
            <Target size={22} color={C.primary} />
          </V>
          <T style={{ ...urbanist(700), fontSize: 26, lineHeight: "34px", textAlign: "center", color: C.textGray800 }}>{GOAL.text}</T>
          <V style={{ marginTop: 22, alignItems: "center" }}>
            <V style={{ overflow: "hidden", alignItems: "center" }}>
              <T style={{ ...urbanist(700), fontSize: 38, color: progressColor, ...sim("rise-out") }}>{GOAL.progress}%</T>
              <T style={{ ...urbanist(700), fontSize: 38, color: progressColor, position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", ...sim("rise-in") }}>{UPDATED}%</T>
            </V>
            <T style={{ ...urbanist(400), fontSize: 13, color: C.textGray400 }}>current progress</T>
          </V>
          <V style={{ width: "100%", gap: 12, marginTop: 32 }}>
            {[
              { label: "Update progress", Icon: TrendingUp },
              { label: "Add comment", Icon: MessageCircle },
            ].map(({ label, Icon }, i) => (
              <V key={label} style={{ ...row, minHeight: 58, borderRadius: 16, paddingInline: 18, justifyContent: "center", gap: 10, background: C.secondary, ...sim(i ? "press-b" : "press-a") }}>
                <Icon size={20} color={C.primary} />
                <T style={{ ...urbanist(600), fontSize: 16, color: C.textGray800 }}>{label}</T>
                <Tap x="50%" y="50%" phase={i ? "b" : "a"} />
              </V>
            ))}
          </V>
        </V>
      </V>

      {/* footer */}
      <V style={{ paddingInline: 16, paddingTop: 14, paddingBottom: INSETS.bottom }}>
        <V style={{ height: 48, alignItems: "center", justifyContent: "center" }}>
          <T style={{ ...urbanist(600), fontSize: 15, color: C.textGray400 }}>Skip for now</T>
        </V>
      </V>
    </V>
  );
}
