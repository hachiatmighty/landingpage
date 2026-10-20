import type { CustomThemeConfig } from "tailwindcss/types/config";

/**
 * The `bd-*` design tokens used by the marketing mockups, copied from the source repo's
 * tailwind.config.ts (theme.extend, bd-* entries only). Spread into `theme.extend`.
 */
export const bdTokens: Partial<CustomThemeConfig> = {
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
    "bd-hero": ["clamp(2.75rem, 7.2vw, 5.75rem)", { lineHeight: "0.94" }],
    "bd-section": ["clamp(2rem, 4.4vw, 3.5rem)", { lineHeight: "1.02" }],
    "bd-lead": ["clamp(1.0625rem, 1.5vw, 1.375rem)", { lineHeight: "1.5" }],
    "bd-display": ["36px", { lineHeight: "1.1" }],
    "bd-display-hero": ["40px", { lineHeight: "1.1" }],
    "bd-h1": ["28px", { lineHeight: "36px" }],
    "bd-h2": ["24px", { lineHeight: "30px" }],
    "bd-h3": ["18px", { lineHeight: "24px" }],
    "bd-subtitle": ["18px", { lineHeight: "26px" }],
    "bd-body": ["16px", { lineHeight: "24px" }],
    "bd-body-md": ["15px", { lineHeight: "22px" }],
    "bd-caption": ["13px", { lineHeight: "18px" }],
    "bd-micro": ["12px", { lineHeight: "16px" }],
    "bd-button": ["16px", { lineHeight: "1" }],
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
