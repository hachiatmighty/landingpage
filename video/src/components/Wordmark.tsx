import { BRAND } from "../lib/fonts";
import { WORDMARK } from "../lib/layout";

/**
 * The Bestday wordmark, top-left on every scene, white on black.
 * Placeholder: typeset in Urbanist until the brand wordmark artwork is added to public/brand/.
 */
export function Wordmark({ opacity = 1 }: { opacity?: number }) {
  return (
    <div style={{ position: "absolute", left: WORDMARK.left, top: WORDMARK.top, height: WORDMARK.height, display: "flex", alignItems: "center", fontFamily: BRAND, fontWeight: 800, fontSize: WORDMARK.height * 0.78, letterSpacing: -1, color: "#fff", opacity }}>
      Bestday
    </div>
  );
}
