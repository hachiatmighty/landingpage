import { Eye, Heart, MessageCircle } from "lucide-react";
import { DeviceScreen } from "../components/ui/app/DeviceScreen";
import { TabBar } from "../components/ui/app/TabBar";
import { INSETS } from "../components/ui/app/device";
import { C, urbanist } from "../components/ui/app/theme";
import { V, T } from "../components/ui/app/native";
import { sim } from "../components/ui/app/motion";
import { Tap } from "../components/ui/app/Tap";
import { MEMBERS } from "../lib/members";
import { PHOTOS, photoUrl } from "../lib/photos";

const countStyle = { ...urbanist(600), fontSize: 13, color: C.white };

/** One reaction in the right-hand rail: icon over a count. */
const Action = ({ Icon, count }: { Icon: typeof Heart; count: string }) => (
  <V style={{ alignItems: "center", gap: 4 }}>
    <Icon size={30} color={C.white} strokeWidth={2} />
    <T style={countStyle}>{count}</T>
  </V>
);

/**
 * The like, simulated: a finger taps the heart (phase B of the loop), it fills yellow with a bump,
 * the count ticks up, and a few hearts drift away.
 */
const LikeAction = () => (
  <V style={{ alignItems: "center", gap: 4 }}>
    <V style={sim("pop-b")}>
      <Heart size={30} color={C.white} strokeWidth={2} />
      <V style={{ position: "absolute", inset: 0, ...sim("in-b") }}>
        <Heart size={30} color={C.primary} fill={C.primary} strokeWidth={2} />
      </V>
      {[0, 0.25, 0.5].map((delay, i) => (
        <V key={delay} style={{ position: "absolute", left: [2, -10, 12][i], top: 0, opacity: 0, ...sim("float", { delay }) }}>
          <Heart size={[18, 14, 12][i]} color={C.primary} fill={C.primary} strokeWidth={2} />
        </V>
      ))}
      <Tap x={15} y={15} phase="b" />
    </V>
    <V style={{ overflow: "hidden", alignItems: "center" }}>
      <T style={{ ...countStyle, ...sim("rise-out-b") }}>11</T>
      <T style={{ ...countStyle, position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", ...sim("rise-in-b") }}>12</T>
    </V>
  </V>
);

/**
 * The Stories tab, for the marketing mockups.
 *
 * Unlike the other screens in `components/ui/app`, this is not a value-for-value port: it follows
 * the layout of BestdayApp/src/screens/Feed/Home.tsx (full-bleed media, a dark overlay, profile and
 * caption bottom-left, reactions on the right, the tab bar on top) with representative content
 * that continues the half-marathon goal used everywhere else on the page. In the loop the photo
 * pushes in slowly and the story gets a like.
 */
export const StoryScreen = () => (
  <DeviceScreen background="#000">
    <img
      src={photoUrl(PHOTOS.goldenRun, 800, 1734)}
      alt=""
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...sim("zoom", { ease: "ease-in-out" }) }}
    />
    <V style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 25%, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />

    <V style={{ position: "absolute", left: 0, right: 0, bottom: 49 + INSETS.bottom + 24, flexDirection: "row", alignItems: "flex-end" }}>
      <V style={{ flex: 1, gap: 10 }}>
        <V style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 16 }}>
          <img src={MEMBERS[1].src} alt="" style={{ width: 40, height: 40, borderRadius: 20, objectFit: "cover", border: `2px solid ${C.primary}` }} />
          <V>
            <T style={{ ...urbanist(700), fontSize: 16, color: C.white }}>Maya Bell</T>
            <T style={{ ...urbanist(500), fontSize: 13, color: C.onSurfaceSubtle }}>Run a half marathon · 2h</T>
          </V>
        </V>
        <V style={{ paddingLeft: 16, maxWidth: "85%" }}>
          <T lines={3} style={{ ...urbanist(500), fontSize: 16, lineHeight: "24px", color: C.white }}>
            8k before work. Legs heavy, head clear. Saturday long run is on.
          </T>
        </V>
      </V>
      <V style={{ width: 72, alignItems: "center", gap: 22, paddingBottom: 4 }}>
        <LikeAction />
        <Action Icon={MessageCircle} count="4" />
        <Action Icon={Eye} count="5" />
      </V>
    </V>

    <TabBar active="stories" />
  </DeviceScreen>
);
