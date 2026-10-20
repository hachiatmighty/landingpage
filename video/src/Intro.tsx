import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

/** Starter composition: headline fades up, then the goals screen springs in. Black (not
 * bd-surface-0) so the screen image's own black background blends in. */
export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headline = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const phone = spring({ frame: frame - 15, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill className="items-center bg-black pt-24 font-urbanist text-white">
      <h1
        className="text-center text-7xl font-bold"
        style={{ opacity: headline, transform: `translateY(${(1 - headline) * 30}px)` }}
      >
        Set goals <span className="text-bd-yellow">worth keeping.</span>
      </h1>
      <Img
        src={staticFile("marketing/goals-screen.webp")}
        className="mt-12 w-[560px]"
        style={{ opacity: phone, transform: `translateY(${(1 - phone) * 200}px)` }}
      />
    </AbsoluteFill>
  );
};
