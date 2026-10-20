import { useId, useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { MEMBERS, PORTRAIT_FILTER } from "../../lib/members";

export interface ConstellationArtProps {
  /** Initials rendered inside each member node. Node count follows this array's length. Each entry
   * is matched to a portrait from the shared member set by position. */
  letters: string[];
  /**
   * "open" — outlined nodes: a Circle that exists but has not yet arrived (hero).
   * "filled" — solid accent nodes: the payoff state, used once at the close of the page.
   */
  variant?: "open" | "filled";
  /** Self-contained description for assistive tech. */
  label: string;
  className?: string;
}

const SIZE = 600;
const C = SIZE / 2;
const R = 208;
const NODE_R = 34;

/**
 * The page's signature artwork: a goal held at the centre of a ring of people.
 *
 * This replaces the old absolutely-positioned-div orbit. Building it as one SVG rather than a stack
 * of divs is what makes the connective tissue possible — the lines from each member to the goal,
 * and the pulses that travel along them, are the actual content of the illustration ("these people
 * are attending to this goal") and cannot be drawn with box-model elements.
 *
 * Motion, all scoped through gsap.matchMedia so reduced-motion users get the composed static
 * artwork with nothing moving:
 *  - two dashed rings counter-rotating, at very different speeds, for slow ambient life
 *  - the connector lines draw themselves outward from the centre on first view
 *  - member nodes scale in on a stagger, after their line arrives
 *  - a small pulse travels from each member down its line into the goal, on a loop — the visual
 *    argument for the whole product, in one gesture
 */
export function ConstellationArt({ letters, variant = "open", label, className = "" }: ConstellationArtProps) {
  const ref = useRef<SVGSVGElement>(null);
  /* This component is rendered twice on the page (hero and closing), so every id inside <defs> has
   * to be namespaced. Duplicate ids are invalid, and a url(#...) reference resolves to whichever
   * element the document happens to hit first — which silently binds the closing instance's
   * gradients and clip paths to the hero's. useId gives each instance its own stable prefix. */
  const uid = useId().replace(/:/g, "");

  const nodes = letters.map((letter, i) => {
    const angle = (-90 + i * (360 / letters.length)) * (Math.PI / 180);
    return {
      letter,
      photo: MEMBERS[i % MEMBERS.length].src,
      x: C + R * Math.cos(angle),
      y: C + R * Math.sin(angle),
    };
  });

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const q = gsap.utils.selector(svg);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Ambient counter-rotation. svgOrigin keeps the spin centred on the goal regardless of how
        // the SVG is scaled by its container - a CSS transform-origin would be relative to the
        // rendered box and drift as the viewport changes.
        gsap.to(q("[data-ring-outer]"), {
          rotation: 360,
          svgOrigin: `${C} ${C}`,
          duration: 130,
          repeat: -1,
          ease: "none",
        });
        gsap.to(q("[data-ring-inner]"), {
          rotation: -360,
          svgOrigin: `${C} ${C}`,
          duration: 90,
          repeat: -1,
          ease: "none",
        });

        // Entrance: lines draw outward, then nodes land.
        const lines = Array.from(svg.querySelectorAll<SVGLineElement>("[data-line]"));
        const intro = gsap.timeline({
          scrollTrigger: { trigger: svg, start: "top 88%", once: true },
        });

        intro.from(q("[data-core]"), {
          scale: 0,
          transformOrigin: "center",
          duration: 0.7,
          ease: "back.out(2)",
        });

        // Draw each connector outward from the goal. DrawSVG is a paid plugin, so this collapses
        // the line onto the centre point and animates its far end back out to the member - same
        // result, no dependency.
        lines.forEach((line, i) => {
          intro.from(
            line,
            {
              attr: { x2: C, y2: C },
              opacity: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            0.35 + i * 0.08,
          );
        });

        intro
          .from(
            q("[data-node]"),
              { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.55, ease: "back.out(1.7)", stagger: 0.09 },
            0.6,
          );

        // Signal pulses: one dot per member, travelling inward, offset so they never arrive together.
        nodes.forEach((node, i) => {
          gsap.fromTo(
            q(`[data-pulse="${i}"]`),
            { attr: { cx: node.x, cy: node.y }, opacity: 0 },
            {
              attr: { cx: C, cy: C },
              opacity: 1,
              duration: 2.1,
              ease: "power1.in",
              repeat: -1,
              repeatDelay: 2.4,
              delay: i * 0.85,
              // fade back out over the last stretch so the dot dissolves into the goal rather than
              // vanishing at full brightness the instant it lands
              onUpdate() {
                const p = this.progress();
                gsap.set(q(`[data-pulse="${i}"]`), { opacity: p < 0.15 ? p / 0.15 : p > 0.82 ? (1 - p) / 0.18 : 1 });
              },
            },
          );
        });

      });
    },
    { scope: ref },
  );

  const nodeFill = variant === "filled" ? `url(#${uid}-nodeFaceLit)` : `url(#${uid}-nodeFace)`;
  const nodeStroke = variant === "filled" ? "rgba(255,233,133,0.9)" : "rgba(255,255,255,0.38)";
  const nodeText = "var(--color-white)";

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={label}
      className={`h-auto w-full overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={`${uid}-lineFade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-yellow)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--color-yellow)" stopOpacity="0.18" />
        </linearGradient>
        {/* Member nodes need to read as physical objects against a near-black page. A flat
            surface-2 fill measures ~1.3:1 against the background and simply disappears; a vertical
            gradient plus a lit top edge gives each one a sense of form at any size. */}
        <linearGradient id={`${uid}-nodeFace`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#161616" />
        </linearGradient>
        <linearGradient id={`${uid}-nodeFaceLit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE985" />
          <stop offset="100%" stopColor="#F5CE33" />
        </linearGradient>
        <filter id={`${uid}-nodeLift`} x="-70%" y="-70%" width="240%" height="240%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.55" />
        </filter>
        {/* One clip per node: an SVG <image> is a rectangle, so each portrait needs a circular clip
            positioned at that node's own coordinates. */}
        {nodes.map((node, i) => (
          <clipPath key={`clip-${i}`} id={`${uid}-clip-${i}`}>
            <circle cx={node.x} cy={node.y} r={NODE_R} />
          </clipPath>
        ))}
      </defs>

      {/* two dashed orbit rings, counter-rotating */}
      <circle
        data-ring-outer
        cx={C}
        cy={C}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="1"
        strokeDasharray="2 12"
      />
      <circle
        data-ring-inner
        cx={C}
        cy={C}
        r={R * 0.62}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="1 9"
      />

      {/* connectors */}
      {nodes.map((node, i) => (
        <line
          key={`l-${i}`}
          data-line
          x1={C}
          y1={C}
          x2={node.x}
          y2={node.y}
          stroke={`url(#${uid}-lineFade)`}
          strokeWidth="1.5"
        />
      ))}

      {/* the goal itself */}
      <circle data-core cx={C} cy={C} r={17} fill="var(--color-yellow)" />

      {/* travelling signal pulses */}
      {/* cx/cy must be present in the markup, not only set by GSAP: an attr tween reads the
          element's current value as its start point, and an absent cx parses as "" rather than 0. */}
      {nodes.map((node, i) => (
        <circle
          key={`p-${i}`}
          data-pulse={i}
          cx={node.x}
          cy={node.y}
          r={4.5}
          fill="var(--color-yellow)"
          opacity="0"
        />
      ))}

      {/* member nodes */}
      {nodes.map((node, i) => (
        <g key={`n-${i}`} data-node filter={`url(#${uid}-nodeLift)`}>
          {/* the disc behind the photo, so a node still reads as an object while the image loads */}
          <circle cx={node.x} cy={node.y} r={NODE_R} fill={nodeFill} />

          <image
            href={node.photo}
            x={node.x - NODE_R}
            y={node.y - NODE_R}
            width={NODE_R * 2}
            height={NODE_R * 2}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${uid}-clip-${i})`}
            style={{ filter: PORTRAIT_FILTER }}
            opacity={variant === "filled" ? 0.9 : 0.82}
          />

          {/* accent veil on the arrived state, so "filled" still reads as yellow without hiding the face */}
          {variant === "filled" && (
            <circle cx={node.x} cy={node.y} r={NODE_R} fill="var(--color-yellow)" opacity="0.34" />
          )}

          <circle cx={node.x} cy={node.y} r={NODE_R} fill="none" stroke={nodeStroke} strokeWidth="1.5" />
          {/* top-edge specular arc: the same bd-bevel idea as the CSS cards, drawn as a clipped arc */}
          <path
            d={`M ${node.x - 24} ${node.y - 24} A ${NODE_R} ${NODE_R} 0 0 1 ${node.x + 24} ${node.y - 24}`}
            fill="none"
            stroke={variant === "filled" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* The initial moves out of the portrait and onto a small chip beneath it: overlaid on a
              face it was unreadable, and it is what ties each person to the ledger's tally marks. */}
          <g>
            <rect
              x={node.x - 13}
              y={node.y + NODE_R - 2}
              width={26}
              height={18}
              rx={9}
              fill="var(--color-surface-0)"
              stroke={nodeStroke}
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y + NODE_R + 7}
              textAnchor="middle"
              dominantBaseline="central"
              fill={nodeText}
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-sans)"
            >
              {node.letter}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
