// The Brewy 300 ml PET bottle as 2D profiles (radius, height), in model units
// (~176 tall with the cap). Measured from the original 3D scan (result.gltf):
// every point below is a ring, rib or edge found in that scan, so the
// procedural bottle keeps the real bottle's shape while getting smooth,
// high-resolution geometry the scan never had.

export type P = [r: number, y: number];

// Model units -> scene units, and the height the bottle is centred on. These
// match the old scan-based bottle so every scene's framing is unchanged.
export const MESH_SCALE = 0.007;
export const MODEL_CENTER_Y = 87.8459;

// The straight label panel between the ribs. A very shallow cone.
export const PANEL = { yBottom: 32.63, rBottom: 29.45, yTop: 105.03, rTop: 28.45 };

// PET wall thickness, and the gap between the liquid and the wall.
export const WALL = 0.6;
export const LIQUID_INSET = WALL + 0.2;

// Where the cola sits when the bottle is upright: the upper shoulder, like
// the real product photo.
export const FILL_Y = 140;

// The petaloid base, from the dome at the centre out to the body wall. The
// base has five feet; FOOT runs down the middle of a foot, VALLEY down the
// middle of the groove between two feet.
export const FOOT_PROFILE: P[] = [
  [0, 11.8], [4.5, 10.9], [7.5, 8.7], [10.5, 6.8], [13.5, 5.1], [16.5, 3.9],
  [19.5, 3.6], [22, 3.65], [23.3, 3.9], [24.8, 4.4], [26.3, 5.5], [27.4, 7.0],
  [28.0, 9.5], [28.4, 12], [28.8, 14.5], [29.3, 17], [29.7, 20], [29.8, 21.5],
];

export const VALLEY_PROFILE: P[] = [
  [0, 11.8], [3.75, 11.1], [6.75, 10.0], [9.75, 8.6], [11.25, 7.6], [13, 7.9],
  [14.5, 8.8], [16, 9.8], [18.75, 11.3], [21.75, 13.0], [23.25, 14.9],
  [26.25, 16.9], [27.75, 19.0], [29.25, 21.0], [29.8, 21.5],
];

// Valley centres sit at -36° + k·72°; each groove is ~20° wide.
export const FEET = 5;
export const VALLEY_PHASE = (-36 * Math.PI) / 180;
const VALLEY_CORE = (5 * Math.PI) / 180;
const VALLEY_EDGE = (14 * Math.PI) / 180;

// Body, from the top of the base up to the neck lip and into the bore.
export const BODY_PROFILE: P[] = [
  [29.8, 21.5], [29.84, 23.0], [29.62, 25.6], [29.45, 26.5],
  [30.05, 27.0], [29.45, 27.5], // rib
  [29.36, 31.4], [29.95, 32.1], // rib
  [PANEL.rBottom, PANEL.yBottom], [PANEL.rTop, PANEL.yTop], // label panel
  [28.95, 105.5], [28.4, 106.0], // rib
  [28.36, 109.4], [28.97, 109.9], [28.36, 110.4], // rib
  [28.69, 114.2], [28.08, 118.5], [27.16, 122.8], [25.94, 126.9], [24.42, 131.0],
  [23.9, 134.0], [23.15, 136.0], [22.06, 138.0], [20.9, 140.0], [19.6, 141.8],
  [17.6, 143.3], [15.54, 145.9], [13.5, 148.2], [12.67, 149.4], // shoulder
  [12.67, 154.6], [17.59, 155.0], [17.59, 156.6], [12.67, 156.9], // support ring
  [12.5, 159.6], [13.61, 160.2], [13.61, 161.2], [12.67, 161.9], // tamper bead
  [13.3, 163.5], [13.3, 171.4], [12.67, 172.13], // thread band (under the cap)
  [11.0, 172.13], [11.0, 168.0], // lip and bore
];

// Inside the neck the finish is thicker than the body wall.
export const NECK_BORE = 11.0;
export const LIQUID_TOP = 169.5;
// The last shoulder point the liquid profile follows before the bore.
export const SHOULDER_END_Y = 149.4;

/** 0 on a foot, 1 in the middle of a valley. */
export function valleyWeight(theta: number) {
  const period = (Math.PI * 2) / FEET;
  let d = (theta - VALLEY_PHASE) % period;
  if (d < 0) d += period;
  if (d > period / 2) d -= period;
  const a = Math.abs(d);
  if (a <= VALLEY_CORE) return 1;
  if (a >= VALLEY_EDGE) return 0;
  const t = (a - VALLEY_CORE) / (VALLEY_EDGE - VALLEY_CORE);
  return 1 - t * t * (3 - 2 * t);
}

export function panelRadiusAt(y: number) {
  const t = (y - PANEL.yBottom) / (PANEL.yTop - PANEL.yBottom);
  return PANEL.rBottom + t * (PANEL.rTop - PANEL.rBottom);
}

// ---------------------------------------------------------------------------
// Curve utilities
// ---------------------------------------------------------------------------

/** Split every segment so none is longer than `max`. */
export function densify(points: P[], max: number): P[] {
  const out: P[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const [r0, y0] = points[i - 1];
    const [r1, y1] = points[i];
    const n = Math.max(1, Math.ceil(Math.hypot(r1 - r0, y1 - y0) / max));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      out.push([r0 + (r1 - r0) * t, y0 + (y1 - y0) * t]);
    }
  }
  return out;
}

/**
 * Chaikin corner cutting. On a densified polyline it rounds each corner by a
 * fraction of a unit - edges read as moulded plastic rather than CAD-sharp -
 * without the overshoot a spline would add at the ribs and support ring.
 */
export function chaikin(points: P[], iterations: number): P[] {
  let pts = points;
  for (let it = 0; it < iterations; it++) {
    const next: P[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [r0, y0] = pts[i];
      const [r1, y1] = pts[i + 1];
      next.push([0.75 * r0 + 0.25 * r1, 0.75 * y0 + 0.25 * y1]);
      next.push([0.25 * r0 + 0.75 * r1, 0.25 * y0 + 0.75 * y1]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  return pts;
}

/** Ramer–Douglas–Peucker: drop points the curve doesn't need. */
export function simplify(points: P[], epsilon: number): P[] {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack: [number, number][] = [[0, points.length - 1]];

  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ra, ya] = points[a];
    const [rb, yb] = points[b];
    const len = Math.hypot(rb - ra, yb - ya) || 1;
    let maxD = 0;
    let index = -1;
    for (let i = a + 1; i < b; i++) {
      const [r, y] = points[i];
      const d = Math.abs((rb - ra) * (ya - y) - (ra - r) * (yb - ya)) / len;
      if (d > maxD) {
        maxD = d;
        index = i;
      }
    }
    if (index !== -1 && maxD > epsilon) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

/** `count` points evenly spaced by arc length. */
export function resample(points: P[], count: number): P[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const [r0, y0] = points[i - 1];
    const [r1, y1] = points[i];
    lengths.push(lengths[i - 1] + Math.hypot(r1 - r0, y1 - y0));
  }
  const total = lengths[lengths.length - 1];
  const out: P[] = [];
  let seg = 1;
  for (let k = 0; k < count; k++) {
    const target = (k / (count - 1)) * total;
    while (seg < lengths.length - 1 && lengths[seg] < target) seg++;
    const span = lengths[seg] - lengths[seg - 1] || 1;
    const t = Math.min(Math.max((target - lengths[seg - 1]) / span, 0), 1);
    const [r0, y0] = points[seg - 1];
    const [r1, y1] = points[seg];
    out.push([r0 + (r1 - r0) * t, y0 + (y1 - y0) * t]);
  }
  return out;
}

/**
 * Move every point `distance` towards the inside of the bottle. Profiles run
 * from the base centre outwards and up, so "inside" is the left-hand normal
 * of the direction of travel.
 */
export function offsetInward(points: P[], distance: number): P[] {
  return points.map((p, i) => {
    const prev = points[Math.max(i - 1, 0)];
    const next = points[Math.min(i + 1, points.length - 1)];
    const dr = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dr, dy) || 1;
    // Stay on the axis: the base centre only moves up.
    const r = p[0] === 0 ? 0 : Math.max(p[0] + (-dy / len) * distance, 0);
    return [r, p[1] + (dr / len) * distance];
  });
}

/** Smooth a hand-measured profile into a render-ready one. */
export function smoothProfile(points: P[], epsilon = 0.012): P[] {
  return simplify(chaikin(densify(points, 0.6), 2), epsilon);
}
