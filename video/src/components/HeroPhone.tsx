import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { mix, ramp } from "../lib/anim";
import { COPY_FLOOR } from "../lib/layout";
import { Phone, phoneGeometry } from "./Phone";

/** The phone every demo scene shares: centred, below the copy block. */
export const PHONE = { x: 540, y: 1215, width: 560 } as const;

/** A camera push-in: `t` 0 → 1 zooms to `scale` around the screen point (x, y), in points. */
export interface Zoom {
  t: number;
  x: number;
  y: number;
  scale: number;
}

/** Zoom in over `[start, start + 16]`, hold, and ease back out over `[end - 14, end]`. */
export const push = (frame: number, start: number, end: number, x: number, y: number, scale: number): Zoom => ({
  t: ramp(frame, start, 16) * (1 - ramp(frame, end - 14, 14)),
  x,
  y,
  scale,
});

/**
 * The phone rises into place at `enter`, and can push in on one spot. While zoomed it fades out
 * under the copy block rather than running beneath the words. `dx` slides it sideways (points of
 * canvas), for swapping one phone for another inside a scene.
 */
export function HeroPhone({ light = false, zoom, enter = 0, dx = 0, children }: { light?: boolean; zoom?: Zoom; enter?: number; dx?: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const t = ramp(frame, enter, 18);
  const g = phoneGeometry(PHONE.width);
  const z = zoom ? mix(1, zoom.scale, zoom.t) : 1;
  const origin = zoom ? `${g.inset + zoom.x * g.scale}px ${g.inset + zoom.y * g.scale}px` : "center";
  const hide = zoom ? zoom.t : 0;
  const mask = `linear-gradient(to bottom, rgba(0,0,0,${1 - hide}) ${COPY_FLOOR - 50}px, #000 ${COPY_FLOOR + 30}px)`;
  return (
    <div style={{ position: "absolute", inset: 0, maskImage: mask, WebkitMaskImage: mask }}>
      <Phone x={PHONE.x + dx} y={PHONE.y + (1 - t) * 140} width={PHONE.width} light={light} style={{ opacity: Math.min(1, t * 1.5), transform: `scale(${z})`, transformOrigin: origin }}>
        {children}
      </Phone>
    </div>
  );
}

/** A screen sliding in from the right over the one beneath, as a push in a navigation stack. */
export const Push = ({ t, children }: { t: number; children: ReactNode }) => (
  <div style={{ position: "absolute", inset: 0, transform: `translateX(${(1 - t) * 100}%)`, boxShadow: t < 1 ? "-10px 0 30px rgba(0,0,0,0.15)" : undefined }}>{children}</div>
);
