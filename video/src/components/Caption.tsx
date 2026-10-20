import type { CSSProperties } from "react";
import { ramp } from "../lib/anim";
import { BRAND } from "../lib/fonts";
import { SAFE } from "../lib/layout";

/**
 * A line of on-screen copy that rises in word by word and fades out. It is always laid out inside
 * the safe box (see layout.ts), centred, with `top` measured from the top of the canvas.
 */
export function Caption({
  frame,
  start,
  end,
  top = SAFE.top + 20,
  size = 64,
  color,
  light = false,
  children,
  style,
}: {
  frame: number;
  start: number;
  end: number;
  top?: number;
  size?: number;
  color?: string;
  /** On the light background a highlight is a yellow marker stroke, not yellow text. */
  light?: boolean;
  children: string;
  style?: CSSProperties;
}) {
  const out = ramp(frame, end - 8, 8);
  // *a phrase* is highlighted: mark each word inside the asterisks, then drop them.
  let marking = false;
  const words = children.replace(/\n/g, " \n ").split(" ").filter(Boolean).map((raw) => {
    const opens = raw.startsWith("*");
    const word = raw.replace(/\*/g, "");
    const marked = marking || opens;
    if (opens) marking = true;
    if (/\*[.,!?…]*$/.test(raw)) marking = false;
    return { word, marked };
  });
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.right - SAFE.left,
        top,
        textAlign: "center",
        fontFamily: BRAND,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.12,
        letterSpacing: -0.02 * size,
        color: color ?? (light ? "#0B0B0B" : "#fff"),
        opacity: 1 - out,
        transform: `translateY(${-out * 16}px)`,
        ...style,
      }}
    >
      {words.map(({ word, marked }, i) => {
        if (word === "\n") return <br key={i} />;
        const t = ramp(frame, start + i * 2.5, 12);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * 0.35}em)`, marginRight: "0.24em" }}>
            {marked ? <span style={markStyle(light)}>{word}</span> : word}
          </span>
        );
      })}
    </div>
  );
}

/** Yellow text on the dark background; a yellow marker stroke under dark text on the light one. */
const markStyle = (light: boolean): CSSProperties =>
  light ? { background: "linear-gradient(transparent 58%, #FFDE59 58%, #FFDE59 94%, transparent 94%)" } : { color: "#FFDE59" };
