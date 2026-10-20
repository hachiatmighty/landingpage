import { loadFont } from "@remotion/fonts";
import w400 from "@fontsource/urbanist/files/urbanist-latin-400-normal.woff2";
import w600 from "@fontsource/urbanist/files/urbanist-latin-600-normal.woff2";
import w700 from "@fontsource/urbanist/files/urbanist-latin-700-normal.woff2";

/* Bundled from @fontsource rather than fetched from Google Fonts, so renders work offline and never
 * capture a frame in the fallback font. loadFont holds rendering until each face is ready. */
const faces = { "400": w400, "600": w600, "700": w700 };

for (const [weight, url] of Object.entries(faces)) {
  loadFont({ family: "Urbanist", url, weight });
}
