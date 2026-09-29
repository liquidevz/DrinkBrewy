/**
 * Where the page is, read straight from the layout. The 3D scene and the
 * copy both use this every frame, so they always agree.
 */
export type ScrollView = {
  /** Through the story section, 0 … 1. */
  progress: number;
  /** Pixels scrolled past the end of the story (the FAQ scrolling in). */
  scrollOut: number;
  /** Through the loop-back section at the very end, 0 … 1. */
  loop: number;
};

export const createScrollView = (): ScrollView => ({ progress: 0, scrollOut: 0, loop: 0 });

const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

export function readScroll(story: HTMLElement | null, loop: HTMLElement | null, out: ScrollView) {
  const vh = window.innerHeight;

  if (story) {
    const rect = story.getBoundingClientRect();
    const range = rect.height - vh;
    out.progress = range > 0 ? clamp01(-rect.top / range) : 0;
    out.scrollOut = Math.max(0, vh - rect.bottom);
  }

  if (loop) {
    // 0 as the section's top enters from below, 1 at the very bottom of
    // the page.
    const rect = loop.getBoundingClientRect();
    out.loop = rect.height > 0 ? clamp01((vh - rect.top) / rect.height) : 0;
  }

  return out;
}
