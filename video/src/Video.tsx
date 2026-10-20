import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { OVERLAP } from "./components/Scene";
import { SAFE } from "./lib/layout";
import { Before, Hook, Turn } from "./scenes/Intro";
import { Accept, Invite, Lands, LogProgress, ReplyScene, UpdateEmail } from "./scenes/Flow";
import { EndCard, Payoff } from "./scenes/Outro";

/** The cut, in order, with each scene's length in frames (30 fps). */
export const SCENES = [
  { name: "Hook", Component: Hook, frames: 84 },
  { name: "Before", Component: Before, frames: 170 },
  { name: "Turn", Component: Turn, frames: 96 },
  { name: "Invite", Component: Invite, frames: 196 },
  { name: "Accept", Component: Accept, frames: 236 },
  { name: "Log progress", Component: LogProgress, frames: 112 },
  { name: "Update email", Component: UpdateEmail, frames: 132 },
  { name: "Reply", Component: ReplyScene, frames: 110 },
  { name: "Lands", Component: Lands, frames: 136 },
  { name: "Payoff", Component: Payoff, frames: 100 },
  { name: "End card", Component: EndCard, frames: 110 },
] as const;

export const TOTAL_FRAMES = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

export type VideoProps = {
  /** A track in public/, e.g. "music.mp3". Leave empty to render silent. */
  music: string;
  /** Draw the text-safe box, for checking a layout. Never on for a real render. */
  showSafeZone: boolean;
};

export function EmailCircleInvites({ music, showSafeZone }: VideoProps) {
  const { durationInFrames } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#0B0B0B" }}>
      {SCENES.map(({ name, Component, frames }, i) => {
        const start = from;
        from += frames;
        const last = i === SCENES.length - 1;
        // Each scene stays mounted through the next one's transition, which draws over it.
        return (
          <Sequence key={name} name={name} from={start} durationInFrames={frames + (last ? 0 : OVERLAP)}>
            <Component />
          </Sequence>
        );
      })}
      {music && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 10, durationInFrames - 45, durationInFrames], [0, 0.8, 0.8, 0], { extrapolateRight: "clamp" })} />}
      {showSafeZone && (
        <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, outline: "3px dashed rgba(255,0,128,0.8)", pointerEvents: "none" }} />
      )}
    </AbsoluteFill>
  );
}
