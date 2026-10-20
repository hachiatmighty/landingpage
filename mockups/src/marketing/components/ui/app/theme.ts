import type { CSSProperties } from "react";

/** The app's dark theme: theme/Variables.ts overlaid with theme/themes/default_dark/Variables.ts. */
export const C = {
  primary: "#FFDE59",
  secondary: "#000000",
  white: "#FFFFFF",
  success: "#28a745",
  warning: "#ffc107",
  textGray800: "#E0E0E0",
  textGray400: "#969696",
  inputBackground: "#3a3a3a",
  surface: "#121212",
  surfaceInput: "#2A2A2A",
  onSurface: "#F0F0F0",
  onSurfaceMuted: "#969696",
  onSurfaceSubtle: "#BABABA",
  onPrimary: "#000000",
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  surfaceTint: "rgba(255, 255, 255, 0.04)",
  surfaceHighlight: "rgba(255, 255, 255, 0.08)",
  primaryTint: "rgba(255, 222, 89, 0.12)",
  navigationSurface: "rgba(18, 18, 18, 0.95)",
  surfaceFloating: "#252525",
  onSurfaceDisabled: "#666666",
  statusSuccess: "#10B981",
  mediaBackground: "#000000",
  onMediaMuted: "rgba(255, 255, 255, 0.7)",
} as const;

/* Text styles without a fontFamily fall back to the iOS system font in the app (no global default
   is set anywhere), so those use the system stack. Named Urbanist faces map to weights. */
export const SYSTEM = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
export const urbanist = (weight: 400 | 500 | 600 | 700): CSSProperties => ({
  fontFamily: '"Urbanist", -apple-system, BlinkMacSystemFont, sans-serif',
  fontWeight: weight,
});

/** theme/Fonts.ts */
export const Fonts = {
  textTiny: { fontSize: 14, color: C.textGray400 },
  textSmall: { fontSize: 16, color: C.textGray400 },
  textRegular: { fontSize: 20, color: C.textGray400 },
  textLarge: { fontSize: 40, color: C.textGray400 },
  textBold: { fontWeight: 700 },
  titleRegular: { fontSize: 40, fontWeight: 700, color: C.textGray800 },
} satisfies Record<string, CSSProperties>;

/** StyleSheet.hairlineWidth on a 3x display, rounded up to a width browsers will paint. */
export const HAIRLINE = 0.5;

export const row: CSSProperties = { flexDirection: "row", alignItems: "center" };
