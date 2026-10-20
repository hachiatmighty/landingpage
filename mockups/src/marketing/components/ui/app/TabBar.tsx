import { CircleDashed, CircleFadingPlus, Target, UsersRound, type LucideIcon } from "lucide-react";
import { MEMBERS } from "../../../lib/members";
import { INSETS } from "./device";
import { C, SYSTEM } from "./theme";
import { V } from "./native";

type TabKey = "stories" | "goals" | "community" | "profile";

const TABS: { key: TabKey; label: string; Icon?: LucideIcon }[] = [
  { key: "stories", label: "Stories", Icon: CircleDashed },
  { key: "goals", label: "Goals", Icon: Target },
  { key: "community", label: "Community", Icon: UsersRound },
  { key: "profile", label: "Profile" },
];

/**
 * navigators/Private.tsx: the five-slot bottom tab bar over an ultra-thin dark blur, with the 65pt
 * yellow post button in the middle and the member's own avatar, ringed in the tint colour, as the
 * Profile icon.
 */
export function TabBar({ active }: { active: TabKey }) {
  const item = (key: TabKey, label: string, Icon?: LucideIcon) => {
    const color = key === active ? C.primary : C.onSurfaceSubtle;
    return (
      <V key={key} style={{ flex: 1, alignItems: "center", paddingTop: 3 }}>
        <V style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
          {Icon ? (
            <Icon size={24} color={color} strokeWidth={2} />
          ) : (
            <V style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderStyle: "solid", borderColor: color, overflow: "hidden", background: C.surfaceInput }}>
              <img src={MEMBERS[4].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </V>
          )}
        </V>
        <span style={{ fontFamily: SYSTEM, fontSize: 10, fontWeight: 500, color, marginTop: 3, lineHeight: "12px" }}>{label}</span>
      </V>
    );
  };

  return (
    <V style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 49 + INSETS.bottom, zIndex: 20 }}>
      <V style={{ position: "absolute", inset: 0, background: C.navigationSurface, backdropFilter: "blur(20px)" }} />
      <V style={{ flexDirection: "row", height: 49 }}>
        {TABS.slice(0, 2).map((tab) => item(tab.key, tab.label, tab.Icon))}
        <V style={{ flex: 1, alignItems: "center" }}>
          <V
            style={{
              width: 65,
              height: 65,
              borderRadius: 65,
              marginTop: -19,
              background: C.primary,
              boxShadow: "0 3px 3.2px rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircleFadingPlus size={32} color={C.onPrimary} strokeWidth={2} />
          </V>
        </V>
        {TABS.slice(2).map((tab) => item(tab.key, tab.label, tab.Icon))}
      </V>
    </V>
  );
}
