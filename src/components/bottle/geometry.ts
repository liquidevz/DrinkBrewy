import * as THREE from "three";

import {
  BODY_PROFILE,
  chaikin,
  densify,
  FILL_Y,
  FOOT_PROFILE,
  LIQUID_INSET,
  LIQUID_TOP,
  MODEL_CENTER_Y,
  NECK_BORE,
  offsetInward,
  P,
  PANEL,
  panelRadiusAt,
  resample,
  SHOULDER_END_Y,
  simplify,
  valleyWeight,
  VALLEY_PROFILE,
} from "./profile";

export type Detail = "high" | "low";

const SEGMENTS: Record<Detail, number> = { high: 200, low: 72 };
const BASE_ROWS: Record<Detail, number> = { high: 56, low: 22 };
const EPSILON: Record<Detail, number> = { high: 0.012, low: 0.06 };

const refine = (points: P[]) => chaikin(densify(points, 0.6), 2);

/**
 * A lathe whose base rows change with angle: each column blends the foot and
 * valley base profiles by `valleyWeight`, which carves the five petaloid feet.
 * Everything above the base is a plain surface of revolution.
 */
function buildSurface(foot: P[], valley: P[], body: P[], segments: number) {
  const baseRows = foot.length;
  const rows = baseRows + body.length - 1;
  const cols = segments + 1;
  const positions = new Float32Array(rows * cols * 3);

  for (let j = 0; j < cols; j++) {
    const theta = (j / segments) * Math.PI * 2;
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);
    const w = valleyWeight(theta);

    for (let i = 0; i < rows; i++) {
      let r: number;
      let y: number;
      if (i < baseRows) {
        r = foot[i][0] + (valley[i][0] - foot[i][0]) * w;
        y = foot[i][1] + (valley[i][1] - foot[i][1]) * w;
      } else {
        [r, y] = body[i - baseRows + 1];
      }
      const k = (i * cols + j) * 3;
      positions[k] = r * sin;
      positions[k + 1] = y;
      positions[k + 2] = r * cos;
    }
  }

  // Counter-clockwise seen from outside, so normals face out.
  const indices: number[] = [];
  for (let i = 0; i < rows - 1; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      const c = (i + 1) * cols + j + 1;
      const d = i * cols + j + 1;
      indices.push(a, d, b, d, c, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  // The first and last columns are the same seam; share their normals so the
  // seam never shows as a line in reflections.
  const normal = geometry.attributes.normal as THREE.BufferAttribute;
  const n = new THREE.Vector3();
  for (let i = 0; i < rows; i++) {
    const first = i * cols;
    const last = i * cols + segments;
    n.set(
      normal.getX(first) + normal.getX(last),
      normal.getY(first) + normal.getY(last),
      normal.getZ(first) + normal.getZ(last),
    ).normalize();
    normal.setXYZ(first, n.x, n.y, n.z);
    normal.setXYZ(last, n.x, n.y, n.z);
  }

  geometry.computeBoundingSphere();
  return geometry;
}

function baseProfiles(detail: Detail, inset: number) {
  const prepare = (points: P[]) => {
    const refined = refine(points);
    return resample(inset ? offsetInward(refined, inset) : refined, BASE_ROWS[detail]);
  };
  return { foot: prepare(FOOT_PROFILE), valley: prepare(VALLEY_PROFILE) };
}

// The liquid's side follows the wall up to the shoulder, then the neck bore.
function liquidBodyProfile(): P[] {
  const shoulder = BODY_PROFILE.findIndex(([, y]) => y >= SHOULDER_END_Y);
  const wall = offsetInward(refine(BODY_PROFILE.slice(0, shoulder + 1)), LIQUID_INSET);
  const bore = NECK_BORE - 0.2;
  return [...wall, [bore, SHOULDER_END_Y + 1.5], [bore, LIQUID_TOP], [0, LIQUID_TOP]];
}

const cache = new Map<string, unknown>();
function cached<T>(key: string, build: () => T): T {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key) as T;
}

/** The outer PET surface, one continuous skin from base dome to neck bore. */
export function getShellGeometry(detail: Detail) {
  return cached(`shell-${detail}`, () => {
    const { foot, valley } = baseProfiles(detail, 0);
    const body = simplify(refine(BODY_PROFILE), EPSILON[detail]);
    return buildSurface(foot, valley, body, SEGMENTS[detail]);
  });
}

/** A watertight volume just inside the wall, so it can be cut at any angle. */
export function getLiquidGeometry(detail: Detail) {
  return cached(`liquid-${detail}`, () => {
    const { foot, valley } = baseProfiles(detail, LIQUID_INSET);
    const body = simplify(liquidBodyProfile(), EPSILON[detail]);
    return buildSurface(foot, valley, body, SEGMENTS[detail]);
  });
}

/** Radius of the liquid's outside at height `y` (above the base). */
export function liquidRadiusAt(y: number) {
  const profile = cached("liquid-radius", () =>
    liquidBodyProfile().filter(([r]) => r > 0),
  );
  if (y <= profile[0][1]) return profile[0][0];
  for (let i = 1; i < profile.length; i++) {
    const [r1, y1] = profile[i];
    if (y <= y1) {
      const [r0, y0] = profile[i - 1];
      return r0 + ((y - y0) / (y1 - y0 || 1)) * (r1 - r0);
    }
  }
  return profile[profile.length - 1][0];
}

// ---------------------------------------------------------------------------
// Cap and label
// ---------------------------------------------------------------------------

const CAP_RIBS = 60;
const CAP_RIB_DEPTH = 0.35;
const CAP_RIB_ZONE: [number, number] = [160.8, 174.5];

/** Knurled screw cap sitting on the neck finish, above the support ring. */
export function getCapGeometry(detail: Detail) {
  return cached(`cap-${detail}`, () => {
    const profile = [
      // Tamper-evident band
      [14.3, 157.7], [15.05, 157.7], [15.2, 157.9], [15.2, 159.7], [15.0, 159.95],
      // Bridge gap between band and cap
      [14.75, 160.05], [14.75, 160.35],
      // Knurled skirt
      [15.25, 160.5], [15.5, 160.8], [15.5, 174.5],
      // Rounded top
      [15.3, 175.3], [14.8, 175.8], [13.8, 176.0], [0, 176.0],
    ].map(([r, y]) => new THREE.Vector2(r, y));

    const geometry = new THREE.LatheGeometry(profile, detail === "high" ? 360 : 120);
    const position = geometry.attributes.position;
    const [ribBottom, ribTop] = CAP_RIB_ZONE;

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (y < ribBottom || y > ribTop) continue;
      const x = position.getX(i);
      const z = position.getZ(i);
      const radius = Math.hypot(x, z);
      const rib =
        Math.pow(0.5 + 0.5 * Math.cos(Math.atan2(x, z) * CAP_RIBS), 0.6) *
        CAP_RIB_DEPTH;
      const s = (radius + rib) / radius;
      position.setXYZ(i, x * s, y, z * s);
    }

    geometry.computeVertexNormals();
    return geometry;
  });
}

// The label's horizontal (u) position that faces the camera by default: the
// centre of the front panel with the "Brewy" logo.
export const LABEL_FRONT_U = 0.487;
// The sleeve floats this far off the wall so it never z-fights the plastic.
export const LABEL_GAP = 0.15;

/**
 * The label wraps the full circumference once, so its height follows from the
 * artwork's aspect ratio - the print is never stretched.
 */
export function getLabelLayout(aspect: number) {
  const midRadius = (PANEL.rBottom + PANEL.rTop) / 2;
  const panelHeight = PANEL.yTop - PANEL.yBottom;
  const height = Math.min((Math.PI * 2 * midRadius) / aspect, panelHeight);
  const centerY = (PANEL.yBottom + PANEL.yTop) / 2;
  return { height, centerY, bottom: centerY - height / 2 };
}

export function getLabelGeometry(aspect: number, detail: Detail) {
  return cached(`label-${aspect.toFixed(4)}-${detail}`, () => {
    const layout = getLabelLayout(aspect);
    // CylinderGeometry puts u = 0 on +Z (towards the camera) and runs u
    // clockwise seen from above, so starting the wrap at -LABEL_FRONT_U turns
    // the logo to the front and the print reads left-to-right.
    const geometry = new THREE.CylinderGeometry(
      panelRadiusAt(layout.bottom + layout.height) + LABEL_GAP,
      panelRadiusAt(layout.bottom) + LABEL_GAP,
      layout.height,
      detail === "high" ? 200 : 72,
      1,
      true,
      -LABEL_FRONT_U * Math.PI * 2,
      Math.PI * 2,
    );
    geometry.translate(0, layout.centerY, 0);
    return geometry;
  });
}

// ---------------------------------------------------------------------------
// Liquid level
// ---------------------------------------------------------------------------

const LEVEL_STEPS = 36;
const SAMPLE_COUNT = 24000;

/** Ray-cast point-in-polygon on the (r, y) half-plane. */
function inside(polygon: P[], r: number, y: number) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ri, yi] = polygon[i];
    const [rj, yj] = polygon[j];
    if (yi > y !== yj > y && r < ((rj - ri) * (y - yi)) / (yj - yi) + ri) hit = !hit;
  }
  return hit;
}

/**
 * How far along "up" the liquid surface sits, for every tilt of the bottle.
 *
 * Points are scattered uniformly through the bottle's inside once. For a
 * given tilt, the surface has to sit where the right fraction of those points
 * lies beneath it - that keeps the volume constant however the bottle turns,
 * including upside down. Returned as offsets from (0, MODEL_CENTER_Y, 0) along
 * the up direction, in model units, indexed by tilt from 0 to π.
 */
export function getLevelTable() {
  return cached("level-table", () => {
    const { foot } = baseProfiles("low", LIQUID_INSET);
    const polygon: P[] = simplify([...foot, ...liquidBodyProfile().slice(1)], 0.3);

    // Deterministic pseudo-random so every load gives the same table.
    let seed = 1;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const xs = new Float32Array(SAMPLE_COUNT);
    const ys = new Float32Array(SAMPLE_COUNT);
    let count = 0;
    let below = 0;
    const rMax = 30;
    while (count < SAMPLE_COUNT) {
      // sqrt keeps samples uniform per unit of volume, not per unit radius.
      const r = rMax * Math.sqrt(random());
      const y = 3 + random() * (LIQUID_TOP - 3);
      if (!inside(polygon, r, y)) continue;
      xs[count] = r * Math.sin(random() * Math.PI * 2);
      ys[count] = y - MODEL_CENTER_Y;
      if (y < FILL_Y) below++;
      count++;
    }
    const fill = below / count;

    const table = new Float32Array(LEVEL_STEPS + 1);
    const projected = new Float32Array(count);
    for (let step = 0; step <= LEVEL_STEPS; step++) {
      const tilt = (step / LEVEL_STEPS) * Math.PI;
      const s = Math.sin(tilt);
      const c = Math.cos(tilt);
      for (let i = 0; i < count; i++) projected[i] = xs[i] * s + ys[i] * c;
      projected.sort();
      table[step] = projected[Math.floor(fill * (count - 1))];
    }
    return table;
  });
}

export function levelAt(table: Float32Array, tilt: number) {
  const f = (Math.min(Math.max(tilt, 0), Math.PI) / Math.PI) * LEVEL_STEPS;
  const i = Math.min(Math.floor(f), LEVEL_STEPS - 1);
  const t = f - i;
  return table[i] + (table[i + 1] - table[i]) * t;
}
