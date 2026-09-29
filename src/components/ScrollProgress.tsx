"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline across the top of the page whose glowing fill tracks how far
 * down the page you are. Updated straight on the DOM every frame so a long
 * page never re-renders React while scrolling.
 */
export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let last = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (fillRef.current && Math.abs(progress - last) > 0.0001) {
        fillRef.current.style.transform = `scaleX(${progress})`;
        last = progress;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-4 top-2.5 h-px bg-cream/15 md:inset-x-10"
    >
      <div
        ref={fillRef}
        className="relative h-full origin-left bg-gradient-to-r from-cream/40 via-cream/80 to-cream shadow-[0_0_8px_1px_rgba(255,248,221,0.55)]"
        style={{ transform: "scaleX(0)" }}
      >
        {/* Bright tip at the leading edge, like a comet head. */}
        <span className="absolute -top-px right-0 h-[3px] w-10 rounded-full bg-cream blur-[2px]" />
      </div>
    </div>
  );
}
