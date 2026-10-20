export interface MiniOrbitProps {
  /** How many people are attending to the goal. 0 renders the isolated state. */
  count: number;
  className?: string;
}

const SIZE = 200;
const C = SIZE / 2;
const R = 64;

/**
 * The two-state glyph for the Alone / Witnessed diptych: the same goal, drawn once with nobody
 * around it and once with a Circle around it. Static (no GSAP) — its job is to be read at a glance
 * as a pair, and animating it would pull attention away from the scrubbed sentence above it.
 *
 * The empty state is deliberately not "the same picture with the people deleted": the ring goes
 * dashed and dim, so isolation reads as a different quality of image,
 * not just a lower element count.
 */
export function MiniOrbit({ count, className = "" }: MiniOrbitProps) {
  const nodes = Array.from({ length: count }, (_, i) => {
    const angle = (-90 + i * (360 / Math.max(count, 1))) * (Math.PI / 180);
    return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
  });
  const isAlone = count === 0;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className={`h-auto w-full ${className}`}>
      {!isAlone && (
        <defs>
          <radialGradient id="miniGlow">
            <stop offset="0%" stopColor="var(--color-yellow)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-yellow)" stopOpacity="0" />
          </radialGradient>
        </defs>
      )}

      {!isAlone && <circle cx={C} cy={C} r={86} fill="url(#miniGlow)" />}

      <circle
        cx={C}
        cy={C}
        r={R}
        fill="none"
        stroke={isAlone ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.22)"}
        strokeWidth="1"
        strokeDasharray={isAlone ? "3 7" : undefined}
      />

      {nodes.map((n, i) => (
        <line
          key={`l${i}`}
          x1={C}
          y1={C}
          x2={n.x}
          y2={n.y}
          stroke="var(--color-yellow)"
          strokeOpacity="0.32"
          strokeWidth="1"
        />
      ))}

      <circle
        cx={C}
        cy={C}
        r={isAlone ? 7 : 10}
        fill={isAlone ? "#4A4A44" : "var(--color-yellow)"}
      />

      {nodes.map((n, i) => (
        <circle
          key={`n${i}`}
          cx={n.x}
          cy={n.y}
          r={13}
          fill="#2E2E2E"
          stroke="rgba(255,255,255,0.42)"
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}
