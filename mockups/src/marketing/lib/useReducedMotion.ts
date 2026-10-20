import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reads the reduced-motion preference in JS.
 *
 * The CSS media query and gsap.matchMedia cover animation, but anything driven by a *timer* —
 * an autoplaying carousel, a rotating panel — has to be stopped in JS, because there is no CSS
 * that prevents a setInterval from firing. Auto-advancing content is exactly the kind of
 * unrequested movement this preference exists to suppress.
 *
 * Subscribes to changes rather than reading once, so flipping the OS setting takes effect without
 * a reload. The initial value is read in a lazy initialiser instead of in the effect: this is a
 * client-rendered SPA with no hydration pass to mismatch against, so the preference is known on the
 * very first render and there is no need to render once with the wrong value and then correct it.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
