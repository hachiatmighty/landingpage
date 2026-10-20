import "@fontsource/urbanist/400.css";
import "@fontsource/urbanist/500.css";
import "@fontsource/urbanist/600.css";
import "@fontsource/urbanist/700.css";
import "@fontsource/urbanist/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { continueRender, delayRender } from "remotion";

/** Hold the first frame until the webfonts are in, so no frame renders in a fallback face. */
const handle = delayRender("Loading fonts");
Promise.all(
  ["400", "500", "600", "700", "800"].map((w) => document.fonts.load(`${w} 40px Urbanist`)).concat(
    ["400", "500", "600", "700"].map((w) => document.fonts.load(`${w} 40px Inter`)),
  ),
).then(() => continueRender(handle));

/** Bestday's brand face (the app and the marketing site). */
export const BRAND = '"Urbanist", -apple-system, sans-serif';
/** The mail client stands in for a generic inbox, so it gets a neutral UI face. */
export const MAIL = '"Inter", -apple-system, "Helvetica Neue", Arial, sans-serif';
