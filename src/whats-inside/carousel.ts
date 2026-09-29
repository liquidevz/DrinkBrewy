import { Rig } from "./rig";

// How long each bottle holds the centre, and how long a slide takes (s).
export const DWELL = 3.4;
export const SLIDE = 1.2;
// Bottles either side of the centre, and how far behind it the row floats.
export const SIDE_SLOTS = 5;
export const ROW_DEPTH = 1.6;

/**
 * The opening carousel's own clock. The row slides one slot at a time, on a
 * timer or when an arrow is pressed. It runs on time, not scroll, so the
 * page opens on something already moving.
 */
export type Carousel = {
  /** Which bottle is in the centre (keeps counting; wrap it per flavour). */
  index: number;
  /** Slide progress, -1 … 1: the row's offset in slots mid-slide. */
  phase: number;
  /** Extra offset in slots, for the slide-in when the page loads. */
  offset: number;
  /** Time spent resting on the current bottle. */
  timer: number;
  sliding: boolean;
  direction: number;
  elapsed: number;
  /** Set by the arrow buttons: -1 or 1. */
  request: number;
  /** Half the gap between the centre bottle and its neighbours, as a
   *  fraction of the view's width: where the arrows sit so they never
   *  cover a bottle. Written by the scene each frame. */
  gap: number;
};

export const createCarousel = (): Carousel => ({
  index: 0,
  phase: 0,
  offset: 0,
  timer: 0,
  sliding: false,
  direction: 1,
  elapsed: 0,
  request: 0,
  gap: 0.2,
});

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Advance the carousel. `playing` is false once the visitor scrolls on. */
export function updateCarousel(c: Carousel, dt: number, playing: boolean) {
  if (!c.sliding) {
    if (c.request !== 0) {
      start(c, c.request);
      c.request = 0;
    } else if (playing) {
      c.timer += dt;
      if (c.timer >= DWELL) start(c, 1);
    }
  }

  if (c.sliding) {
    c.elapsed += dt;
    const k = Math.min(c.elapsed / SLIDE, 1);
    c.phase = c.direction * easeInOutCubic(k);
    if (k >= 1) {
      c.index += c.direction;
      c.phase = 0;
      c.sliding = false;
      c.timer = 0;
    }
  }
}

function start(c: Carousel, direction: number) {
  c.sliding = true;
  c.direction = direction;
  c.elapsed = 0;
}

/** Where the row is, in slots: the current slide plus any intro offset. */
export const rowPhase = (c: Carousel) => c.phase + c.offset;

/** Progress towards the next slide, 0 … 1, for the on-screen timer bar. */
export const dwellProgress = (c: Carousel) => (c.sliding ? 1 : c.timer / DWELL);

// Stable per-bottle randomness, so each bottle keeps its own pose as it
// travels along the row.
function hash(n: number, salt: number) {
  const s = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/**
 * Where bottle `bottle` sits when it's `slot` places from the centre: in a
 * row behind the centre, each at its own jaunty angle. A little depth
 * variety keeps two neighbours leaning towards each other from touching.
 *
 * `x` is also what every carousel bottle uses while sliding, whatever else
 * it's blending: the row moves as one rigid piece, so the gaps between
 * bottles never close up mid-slide.
 */
export function rowRig(center: Rig, slot: number, bottle: number, spacing: number, out: Rig) {
  out.x = center.x + slot * spacing;
  out.y = center.y + hash(bottle, 1) * 0.16;
  out.z = center.z - ROW_DEPTH + hash(bottle, 5) * 0.3;
  out.tilt = hash(bottle, 2) * 0.3;
  out.lean = hash(bottle, 3) * 0.14;
  out.spin = center.spin + hash(bottle, 4) * Math.PI;
  out.liftY = center.liftY;
  out.liftZ = center.liftZ;
  return out;
}

/** How "centre" a bottle at `offset` slots is: 1 in the middle, 0 a slot away. */
export function centreWeight(offset: number) {
  const w = Math.max(0, 1 - Math.abs(offset));
  return w * w * (3 - 2 * w);
}
