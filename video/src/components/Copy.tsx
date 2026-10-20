import type { CSSProperties } from "react";
import { ramp } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { COPY_TOP, SAFE } from "../lib/layout";

/**
 * The scene's copy block: Urbanist 400, one size, left-aligned on the shared baseline. No bold and
 * no inline emphasis; size alone carries hierarchy. Words rise in one after another from `start`.
 */
export function Copy({ frame, start = 6, size = 58, top = COPY_TOP, color = "#fff", children, style }: { frame: number; start?: number; size?: number; top?: number; color?: string; children: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top,
        fontFamily: BRAND,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.26,
        letterSpacing: -0.01 * size,
        color,
        ...style,
      }}
    >
      {children.split(" ").map((word, i) => {
        const t = ramp(frame, start + i * 1.6, 12);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * 0.3}em)`, marginRight: "0.25em" }}>
            {word}
          </span>
        );
      })}
    </div>
  );
}
