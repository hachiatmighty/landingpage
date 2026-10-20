import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { OVERLAP } from "./components/Scene";
import { Wordmark } from "./components/Wordmark";
import { ramp } from "./lib/anim";
import { INK, SAFE } from "./lib/layout";
import { EndCard, Invite, Join, Replies, Title, Updates } from "./scenes/Launch";

/** The cut, in order, with each scene's length in frames (30 fps). */
export const SCENES = [
  { name: "Title", Component: Title, frames: 90 },
  { name: "Invite", Component: Invite, frames: 140 },
  { name: "Join", Component: Join, frames: 150 },
  { name: "Updates", Component: Updates, frames: 140 },
  { name: "Replies", Component: Replies, frames: 190 },
  { name: "End card", Component: EndCard, frames: 120 },
] as const;

export const TOTAL_FRAMES = SCENES.reduce((sum, scene) => sum + scene.frames, 0);

export type VideoProps = {
  /** A track in public/, e.g. "music.mp3". Leave empty to render silent. */
  music: string;
  /** Draw the text-safe box, for checking a layout. Never on for a real render. */
  showSafeZone: boolean;
};

export function EmailCircleInvites({ music, showSafeZone }: VideoProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const endCardAt = TOTAL_FRAMES - SCENES[SCENES.length - 1].frames;
  let from = 0;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SCENES.map(({ name, Component, frames }, i) => {
        const start = from;
        from += frames;
        const last = i === SCENES.length - 1;
        // Each scene runs on through the next one's swipe, leaving as it arrives.
        return (
          <Sequence key={name} name={name} from={start} durationInFrames={frames + (last ? 0 : OVERLAP)}>
            <Component />
          </Sequence>
        );
      })}
      {/* The wordmark holds still while scenes swipe beneath it; the end card spells the name out instead. */}
      <Wordmark opacity={1 - ramp(frame, endCardAt, OVERLAP)} />
      {music && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 10, durationInFrames - 45, durationInFrames], [0, 0.8, 0.8, 0], { extrapolateRight: "clamp" })} />}
      {showSafeZone && (
        <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, width: SAFE.right - SAFE.left, height: SAFE.bottom - SAFE.top, outline: "3px dashed rgba(255,0,128,0.8)", pointerEvents: "none" }} />
      )}
    </AbsoluteFill>
  );
}
