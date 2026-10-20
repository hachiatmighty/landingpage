/**
 * The `bd-*` design tokens the mockup components use, extracted from the source repo's
 * tailwind.config.ts (theme.extend). Spread these into your own Tailwind config's `theme.extend`.
 */
export const bdTokens = {
  fontFamily: {
    "bd-mono": ["ui-monospace", "SF Mono", "SFMono-Regular", "JetBrains Mono", "Menlo", "monospace"],
    urbanist: ["Urbanist", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "sans-serif"],
  },
  colors: {
    bd: {
      "surface-0": "#0D0D0D",
      "surface-1": "#1A1A1A",
      "surface-2": "#222222",
      "surface-3": "#2A2A2A",
      line: "rgba(255, 255, 255, 0.45)",
      "line-soft": "rgba(255, 255, 255, 0.35)",
      hairline: "rgba(255, 255, 255, 0.07)",
      bevel: "rgba(255, 255, 255, 0.16)",
      "text-primary": "#FFFFFF",
      "text-secondary": "#C4C4C4",
      "text-tertiary": "#999999",
      yellow: "#FFDE59",
      "yellow-dim": "rgba(255, 222, 89, 0.14)",
    },
  },
  borderRadius: {
    "bd-sm": "8px",
    "bd-md": "10px",
    "bd-lg": "12px",
    "bd-xl": "16px",
    "bd-2xl": "20px",
    "bd-pill": "999px",
  },
  spacing: {
    "bd-4": "4px", "bd-6": "6px", "bd-8": "8px", "bd-12": "12px", "bd-16": "16px",
    "bd-20": "20px", "bd-24": "24px", "bd-32": "32px", "bd-40": "40px", "bd-48": "48px",
    "bd-64": "64px",
    "bd-tiny": "10px", "bd-small": "20px", "bd-regular": "30px", "bd-large": "60px",
    "bd-hit-target": "44px",
    "bd-section": "clamp(5.5rem, 9vw, 9.5rem)",
    "bd-gutter": "clamp(1.5rem, 4vw, 3.75rem)",
  },
  fontSize: {
    "bd-h1": ["28px", { lineHeight: "36px" }],
    "bd-body": ["16px", { lineHeight: "24px" }],
    "bd-body-md": ["15px", { lineHeight: "22px" }],
    "bd-caption": ["13px", { lineHeight: "18px" }],
    "bd-micro": ["12px", { lineHeight: "16px" }],
  },
  boxShadow: {
    "bd-1": "0 1px 2px rgba(0, 0, 0, 0.4)",
    "bd-2": "0 8px 24px rgba(0, 0, 0, 0.4)",
    "bd-yellow": "0 8px 24px rgba(255, 222, 89, 0.25)",
  },
  transitionTimingFunction: {
    "bd-out": "cubic-bezier(.16, 1, .3, 1)",
    "bd-spring": "cubic-bezier(.2, .9, .2, 1.2)",
  },
  transitionDuration: { "240": "240ms", "400": "400ms" },
};

/** CSS custom properties some components read via arbitrary values (e.g. max-w-[var(--width-stage-max)]). */
export const bdCssVars = `
.bd-marketing {
  --text-section: clamp(2rem, 4.4vw, 3.5rem);
  --text-section--line-height: 1.02;
  --width-stage-max: 1280px;
  background-color: #0d0d0d;
  color: #ffffff;
}
`;
