import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SCREEN } from "./device";
import { SYSTEM } from "./theme";


/** The iOS status bar: time on the left, signal, Wi-Fi and battery on the right. */
function StatusBar() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 z-30 flex items-center justify-between text-white"
      style={{ height: 54, paddingLeft: 52, paddingRight: 36, paddingTop: 4, fontFamily: SYSTEM }}
    >
      <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.4 }}>9:41</span>
      <span className="flex items-center" style={{ gap: 7 }}>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" />
          <rect x="5.1" y="5.2" width="3.2" height="6.8" rx="1" />
          <rect x="10.2" y="2.6" width="3.2" height="9.4" rx="1" />
          <rect x="15.3" y="0" width="3.2" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <path d="M8.5 2.3c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.6 10.2 10.2 0 0 0 1.3 3.5l1.2 1.2a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8.5 5.7c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Z" />
          <path d="M8.5 9.1c.5 0 .9.2 1.2.5L8.5 11.8 7.3 9.6c.3-.3.7-.5 1.2-.5Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/**
 * A 393x852pt iPhone screen, scaled to whatever width its container gives it.
 *
 * The screens inside are laid out in real points copied from the app, so rather than re-deriving
 * every size at every breakpoint the whole canvas is drawn once at native size and scaled with a
 * transform. A ResizeObserver keeps the scale matched to the frame.
 */
export function DeviceScreen({ children, background }: { children: ReactNode; background: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / SCREEN.width));
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className="relative w-full overflow-hidden" style={{ aspectRatio: `${SCREEN.width} / ${SCREEN.height}` }}>
      <div
        className="absolute left-0 top-0 origin-top-left overflow-hidden text-left"
        style={{ width: SCREEN.width, height: SCREEN.height, background, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
        <StatusBar />
        {/* Dynamic Island */}
        <div className="absolute left-1/2 z-40 -translate-x-1/2 rounded-full bg-black" style={{ top: 11, width: 126, height: 37 }} />
        {/* Home indicator */}
        <div className="absolute left-1/2 z-40 -translate-x-1/2 rounded-full bg-white" style={{ bottom: 8, width: 139, height: 5 }} />
      </div>
    </div>
  );
}
