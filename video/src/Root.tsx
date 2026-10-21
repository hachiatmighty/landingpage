import { Composition, Still } from "remotion";
import "./lib/fonts";
import { EmailCircleInvites, TOTAL_FRAMES, type VideoProps } from "./Video";
import { CoverV2, EmailCircleInvitesV2, V2_FRAMES, type V2Props } from "./v2/V2";
import { EmailCircleInvitesV4, V4_FRAMES } from "./v4/V4";
import { CoverV5, EmailCircleInvitesV5, EmailCircleInvitesV5Feed, V5_FRAMES, type V5Props } from "./v5/V5";
import { FPS } from "./lib/anim";
import { H, W } from "./lib/layout";

export function Root() {
  return (
    <>
      <Composition id="EmailCircleInvitesV5" component={EmailCircleInvitesV5} durationInFrames={V5_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ music: "", sfx: {} } satisfies V5Props} />
      <Composition id="EmailCircleInvitesV5Feed" component={EmailCircleInvitesV5Feed} durationInFrames={V5_FRAMES} fps={FPS} width={W} height={1350} defaultProps={{ music: "", sfx: {} } satisfies V5Props} />
      <Still id="CoverV5" component={CoverV5} width={W} height={H} />
      <Composition id="EmailCircleInvitesV4" component={EmailCircleInvitesV4} durationInFrames={V4_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="EmailCircleInvitesV2" component={EmailCircleInvitesV2} durationInFrames={V2_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ music: "", sfx: {} } satisfies V2Props} />
      <Still id="CoverV2" component={CoverV2} width={W} height={H} />
      {/* v1, the 28s launch cut, kept for comparison. */}
      <Composition id="EmailCircleInvites" component={EmailCircleInvites} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} defaultProps={{ music: "", showSafeZone: false } satisfies VideoProps} />
    </>
  );
}
