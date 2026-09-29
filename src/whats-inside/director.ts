import { LABEL_FRONT_U } from "@/components/SodaCan";
import { TourStop } from "./content";

/**
 * Everything the 3D scene shows, as plain numbers. The whole page is a list
 * of keyframes of this state, and the scene samples it from the scroll
 * position every frame. Because it's a pure function of scroll, the bottle,
 * the sets and the copy can never drift apart - there is no animation state
 * to lose on a remount, a hot reload or a resize.
 */
export type Director = {
  // Hero bottle, placed by the label-focus rig (see rig.ts).
  u: number; // label point turned to the camera (texture u)
  v: number; // …and its height on the label (0 bottom … 1 top)
  dist: number; // camera distance to that point
  sx: number; // where the point lands on screen, as fractions of the view
  sy: number;
  tilt: number; // bottle lean around the focus point, radians
  lift: number; // extra rise, in world units
  float: number; // gentle hovering bob, 0 … 1
  spot: number; // label spotlight strength
  spotRX: number; // spotlight half-size (fractions of label height)
  spotRY: number;
  // Sets, each 0 = gone … 1 = fully in.
  stage: number; // carousel: lamp, pedestal and the row of bottles
  studio: number; // grey studio haze on the backdrop
  glow: number; // Brewy-red backdrop glow
  fog: number; // statement fog and giant type
  lineupIn: number; // lineup visibility
  lineup: number; // lineup sweep progress, 0 … 1
  flash: number; // lamp flare
  /** Pixels scrolled past the end of the story (the FAQ scrolling in). */
  scrollOut: number;
};

// The bottle's visual centre (cap included) on the label's v scale: framing
// this point shows the whole bottle.
export const BOTTLE_CENTER_V = 0.8;

// When the carousel clears away, the lamp rises this far (world units) and
// the pedestal sinks this far - both well out of frame.
export const LAMP_RISE = 3;
export const PEDESTAL_DROP = 2.6;

export type Framing = {
  podium: { dist: number; sx: number; sy: number };
  hero: { dist: number; sx: number; sy: number };
  close: { dist: number; sx: number; sy: number };
  statement: { dist: number; sx: number; sy: number };
};

export function getFraming(isDesktop: boolean): Framing {
  return isDesktop
    ? {
        podium: { dist: 7.6, sx: 0, sy: 0 },
        hero: { dist: 3.1, sx: 0.12, sy: 0.02 },
        close: { dist: 1.9, sx: 0.1, sy: 0.02 },
        statement: { dist: 5.6, sx: 0, sy: 0 },
      }
    : {
        podium: { dist: 11, sx: 0, sy: 0.02 },
        hero: { dist: 4.6, sx: 0, sy: 0.18 },
        close: { dist: 2.9, sx: 0, sy: 0.22 },
        statement: { dist: 8.5, sx: 0, sy: 0.04 },
      };
}

export function createDirector(framing: Framing): Director {
  return {
    u: LABEL_FRONT_U,
    v: BOTTLE_CENTER_V,
    ...framing.podium,
    tilt: -0.24,
    lift: 0,
    float: 1,
    spot: 0,
    spotRX: 0.12,
    spotRY: 0.16,
    stage: 1,
    studio: 1,
    glow: 0,
    fog: 0,
    lineupIn: 0,
    lineup: 0,
    flash: 0,
    scrollOut: 0,
  };
}

// Story units. The page scrolls about one viewport per unit.
const PODIUM_HOLD = 2;
const TO_HERO = 1.4;
const HERO_HOLD = 1.2;
const STOP_HOLD = 1;
const STOP_MOVE = 0.9;
const TO_STATEMENT = 1.2;
const STATEMENT_HOLD = 2;
const TO_LINEUP = 1.2;
const LINEUP_SWEEP = 3;

export const VIEWPORTS_PER_UNIT = 0.9;

export type Chapter =
  | { kind: "podium" }
  | { kind: "hero" }
  | { kind: "stop"; index: number }
  | { kind: "statement" }
  | { kind: "lineup" }
  // Past the story: the FAQ, then the run back round to the top.
  | { kind: "none" };

type Ease = (x: number) => number;
const linear: Ease = (x) => x;
const inOut: Ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

type Key = { time: number; state: Director; ease: Ease };

export type Story = {
  keys: Key[];
  duration: number;
  chapters: Chapter[];
  /** Story time at the middle of each chapter, for the copy and the nav. */
  anchors: number[];
};

export function buildStory(framing: Framing, stops: TourStop[]): Story {
  let time = 0;
  let state = createDirector(framing);
  const keys: Key[] = [{ time, state, ease: linear }];
  const chapters: Chapter[] = [];
  const anchors: number[] = [];

  const to = (changes: Partial<Director>, duration: number, ease = inOut) => {
    time += duration;
    state = { ...state, ...changes };
    keys.push({ time, state, ease });
  };
  const hold = (chapter: Chapter, duration: number, changes: Partial<Director> = {}) => {
    chapters.push(chapter);
    anchors.push(time + duration / 2);
    to(changes, duration, linear);
  };

  // 1. The carousel. The bottle floats between lamp and pedestal while the
  //    row slides on its own clock.
  hold({ kind: "podium" }, PODIUM_HOLD);

  // 2. The bottle takes the spotlight: the row is pushed out to both sides,
  //    the lamp rises and the pedestal sinks out of frame, the studio floods
  //    Brewy red and the bottle comes forward into a big close-up.
  to(
    {
      ...framing.hero,
      v: 0.52,
      tilt: -0.3,
      float: 0,
      stage: 0,
      studio: 0,
      glow: 1,
    },
    TO_HERO,
  );
  hold({ kind: "hero" }, HERO_HOLD);

  // 3. The label tour, spot by spot.
  stops.forEach((stop, i) => {
    const [x, y] = stop.label_position;
    const [rx, ry] = stop.spot ?? [0.12, 0.16];
    to(
      {
        u: x,
        v: 1 - y,
        tilt: -0.1,
        spot: 1,
        spotRX: rx,
        spotRY: ry,
        ...framing.close,
        dist: framing.close.dist * ((stop.distance ?? 1.9) / 1.9),
      },
      i === 0 ? STOP_MOVE * 1.3 : STOP_MOVE,
    );
    hold({ kind: "stop", index: i }, STOP_HOLD);
  });

  // 4. Back to centre stage for the statement, turning a full circle while
  //    the fog and giant type roll in.
  to(
    {
      u: LABEL_FRONT_U,
      v: BOTTLE_CENTER_V,
      tilt: 0.08,
      spot: 0,
      glow: 0.55,
      fog: 1,
      ...framing.statement,
    },
    TO_STATEMENT,
  );
  hold({ kind: "statement" }, STATEMENT_HOLD, { u: LABEL_FRONT_U - 1, tilt: -0.08 });

  // 5. The fog clears into the grey studio, the bottle rises away and the
  //    lineup sweeps through. Scrolling on carries it up and away as the FAQ
  //    arrives (see LineupSet).
  to({ lift: 4, fog: 0, glow: 0, studio: 1, lineupIn: 1, lineup: 0.1 }, TO_LINEUP);
  hold({ kind: "lineup" }, LINEUP_SWEEP, { lineup: 1 });

  return { keys, duration: time, chapters, anchors };
}

const FIELDS = Object.keys(createDirector(getFraming(true))) as (keyof Director)[];

/** The story's state at `time`, written into `out`. */
export function sampleStory(story: Story, time: number, out: Director) {
  const { keys } = story;
  if (time <= 0) return Object.assign(out, keys[0].state);

  for (let i = 1; i < keys.length; i++) {
    const b = keys[i];
    if (time > b.time) continue;
    const a = keys[i - 1];
    const k = b.ease((time - a.time) / (b.time - a.time || 1));
    for (const field of FIELDS) {
      out[field] = a.state[field] + (b.state[field] - a.state[field]) * k;
    }
    return out;
  }
  return Object.assign(out, keys[keys.length - 1].state);
}

/**
 * The run back round to the top: the opening carousel rebuilding itself as
 * `amount` goes 0 → 1 - lamp and bottle descending together, the pedestal
 * rising, the row sliding in from both sides. At 1 it's exactly the page's
 * first frame, which is what makes the jump back to the top invisible.
 */
export function sampleLoop(story: Story, amount: number, out: Director) {
  const e = inOut(Math.min(Math.max(amount, 0), 1));
  Object.assign(out, story.keys[0].state);
  out.stage = e;
  out.lift = (1 - e) * LAMP_RISE;
  return out;
}
