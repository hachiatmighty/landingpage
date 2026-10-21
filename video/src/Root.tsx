import { Composition, Still } from "remotion";
import "./lib/fonts";
import { EmailCircleInvites, TOTAL_FRAMES, type VideoProps } from "./Video";
import { CoverV2, EmailCircleInvitesV2, V2_FRAMES, type V2Props } from "./v2/V2";
import { EmailCircleInvitesV4, V4_FRAMES } from "./v4/V4";
import { FPS } from "./lib/anim";
import { H, W } from "./lib/layout";

export function Root() {
  return (
    <>
      <Composition id="EmailCircleInvitesV4" component={EmailCircleInvitesV4} durationInFrames={V4_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="EmailCircleInvitesV2" component={EmailCircleInvitesV2} durationInFrames={V2_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ music: "", sfx: {} } satisfies V2Props} />
      <Still id="CoverV2" component={CoverV2} width={W} height={H} />
      {/* v1, the 28s launch cut, kept for comparison. */}
      <Composition id="EmailCircleInvites" component={EmailCircleInvites} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ music: "", showSafeZone: false } satisfies VideoProps} />
    </>
  );
}
