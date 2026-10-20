import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/* Single registration point. Registering the same plugin from several component modules is
 * harmless but makes it impossible to tell at a glance what this site actually uses, and it is the
 * usual reason a plugin ends up registered on the server during SSR. Everything imports from here. */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The page's motion vocabulary, in one place so every section moves like the same product rather
 * than like nine independently-animated demos. Mirrors --ease-out / --bd-dur-* from the token set. */
export const EASE = "power3.out";
export const EASE_SOFT = "power2.out";
export const DUR = { fast: 0.24, med: 0.5, slow: 0.9 } as const;

/** Standard ScrollTrigger start for one-shot entrances: fire when the element's top reaches 85% of
 * the viewport height, i.e. just as it comes into comfortable reading position. */
export const ENTER_START = "top 85%";

export { gsap, ScrollTrigger, useGSAP };
