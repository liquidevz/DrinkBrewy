"use client";

import { useEffect } from "react";

/**
 * The site is embedded in an iframe, so navigations that leave the current
 * document have to replace the top window instead of the frame. In-page
 * anchors (#flavors, #care, ...) must NOT be broken out of: they are just
 * scroll targets, and forcing a top-level navigation for them reloads the
 * host page and loses the scroll position.
 */
export default function FrameBreaker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Let the browser handle modified clicks (new tab, download, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      // Opt-outs: new tabs and non-http(s) schemes (mailto:, tel:, ...).
      if (link.target === "_blank") return;
      if (link.protocol !== "http:" && link.protocol !== "https:") return;

      // Same-document anchor link -> let it scroll in place.
      const isSamePage =
        link.pathname === window.location.pathname &&
        link.search === window.location.search &&
        link.host === window.location.host;
      if (link.hash && isSamePage) return;

      // Everything else is a real navigation: escape the frame.
      e.preventDefault();
      (window.top ?? window).location.href = link.href;
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
