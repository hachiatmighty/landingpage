import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { INK } from "../lib/layout";
import { DamiInbox, EndCard, Hook, Invite, Reply } from "./scenes";
import { whip } from "./stage";

/** Scene starts (frames at 30fps), from the storyboard. */
export const V2_SCENES = { hook: 0, circle: 66, invite: 132, join: 198, update: 282, reply: 342, end: 468 } as const;
export const V2_FRAMES = 585;

/** The UI sounds the storyboard calls for. Each is a file in public/ (e.g. "sfx/tap.wav"), or empty to leave it out. */
export type Sfx = Partial<Record<"beat" | "tap" | "keys" | "whoosh" | "ping" | "tick" | "chime" | "warmChime", string>>;

export type V2Props = {
  /** A cleared music track in public/, e.g. "music.mp3". Empty renders silent. */
  music: string;
  sfx: Sfx;
};

/** Where each sound lands, in frames. */
const CUES: { at: number; sound: keyof Sfx; volume?: number }[] = [
  { at: 15, sound: "chime", volume: 0.5 },
  { at: 66, sound: "beat" },
  { at: 90, sound: "tap" },
  { at: 136, sound: "keys" },
  { at: 164, sound: "tap" },
  { at: 167, sound: "whoosh" },
  { at: 198, sound: "ping" },
  { at: 228, sound: "tap" },
  { at: 284, sound: "ping" },
  { at: 300, sound: "tick" },
  { at: 344, sound: "tap" },
  { at: 352, sound: "keys" },
  { at: 395, sound: "whoosh" },
  { at: 406, sound: "warmChime" },
];

/** Scenes 2 to 6: Sade's phone, a whip pan to Dami's, and back for the reply. */
function Middle() {
  const local = useCurrentFrame();
  const g = local + V2_SCENES.circle;
  const w = whip(g, V2_SCENES.join - 5, 10);
  return (
    <AbsoluteFill style={{ background: INK }}>
      {w.defs}
      {g < V2_SCENES.join + 5 && (
        <div style={w.out}>
          <Invite />
        </div>
      )}
      {g >= V2_SCENES.join - 5 && g < V2_SCENES.reply && (
        <div style={w.in}>
          <DamiInbox frame={g - V2_SCENES.join} />
        </div>
      )}
      {g >= V2_SCENES.reply && <Reply frame={g - V2_SCENES.reply} />}
    </AbsoluteFill>
  );
}

export function EmailCircleInvitesV2({ music, sfx }: V2Props) {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Sequence name="1 Hook" durationInFrames={V2_SCENES.circle}>
        <Hook />
      </Sequence>
      <Sequence name="2-6 Invite, join, update, reply" from={V2_SCENES.circle} durationInFrames={V2_SCENES.end - V2_SCENES.circle}>
        <Middle />
      </Sequence>
      <Sequence name="7 End card" from={V2_SCENES.end}>
        <EndCard />
      </Sequence>
      {music && <Audio src={staticFile(music)} volume={(f) => interpolate(f, [0, 15, durationInFrames - 30, durationInFrames], [0, 0.7, 0.7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />}
      {CUES.map(({ at, sound, volume = 0.6 }) =>
        sfx[sound] ? (
          <Sequence key={`${sound}-${at}`} from={at} layout="none">
            <Audio src={staticFile(sfx[sound]!)} volume={volume} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
}

/** The cover and thumbnail: Scene 1's layout at frame 0. */
export function CoverV2() {
  return <Hook still />;
}
