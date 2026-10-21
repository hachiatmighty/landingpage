import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { loadFont } from "@remotion/fonts";
import { continueRender, delayRender, staticFile } from "remotion";

/** The brand's own Urbanist files (public/fonts, from the brand asset pack), one per weight. */
const URBANIST = { 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" } as const;

/** Hold the first frame until every face is in, so no frame renders in a fallback font. */
const handle = delayRender("Loading fonts");
Promise.all([
  ...Object.entries(URBANIST).map(([weight, name]) => loadFont({ family: "Urbanist", url: staticFile(`fonts/Urbanist-${name}.ttf`), weight })),
  ...["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Inter`)),
]).then(() => continueRender(handle));

/** Bestday's brand face (the app and the marketing site). */
export const BRAND = '"Urbanist", -apple-system, sans-serif';
/** The mail client stands in for a generic inbox, so it gets a neutral UI face. */
export const MAIL = '"Inter", -apple-system, "Helvetica Neue", Arial, sans-serif';
