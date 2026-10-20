import { Composition } from "remotion";
import "./lib/fonts";
import { EmailCircleInvites, TOTAL_FRAMES, type VideoProps } from "./Video";
import { FPS } from "./lib/anim";
import { H, W } from "./lib/layout";

export function Root() {
  return (
    <Composition
      id="EmailCircleInvites"
      component={EmailCircleInvites}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={{ music: "", showSafeZone: false } satisfies VideoProps}
    />
  );
}
