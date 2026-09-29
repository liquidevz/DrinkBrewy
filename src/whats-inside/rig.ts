import * as THREE from "three";

import { getLabelPoint } from "@/components/SodaCan";
import { Director } from "./director";

export const BOTTLE_SCALE = 1.7;

/**
 * A bottle placement as the four nested groups apply it:
 * rig (position) → tilt (lean) → lift (shift the focus point onto the rig
 * origin) → spin (turn a label point to the camera).
 */
export type Rig = {
  x: number;
  y: number;
  z: number;
  tilt: number;
  lean: number;
  spin: number;
  liftY: number;
  liftZ: number;
};

export const createRig = (): Rig => ({
  x: 0,
  y: 0,
  z: 0,
  tilt: 0,
  lean: 0,
  spin: 0,
  liftY: 0,
  liftZ: 0,
});

/** Where a framing puts the focus point, in world space. */
export function framingPosition(
  framing: { dist: number; sx: number; sy: number },
  camera: THREE.PerspectiveCamera,
  viewAspect: number,
  target: THREE.Vector3,
) {
  const viewHeight = 2 * framing.dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  return target.set(
    framing.sx * viewHeight * viewAspect,
    framing.sy * viewHeight,
    camera.position.z - framing.dist,
  );
}

const scratch = new THREE.Vector3();

/**
 * The star bottle's placement for a director state: label point (u, v)
 * turned to the camera and pinned to the rig origin, the rig placed at the
 * framing, plus a slow idle sway and (on the carousel) a hovering bob.
 */
export function heroRig(
  d: Director,
  camera: THREE.PerspectiveCamera,
  viewAspect: number,
  labelAspect: number,
  time: number,
  out: Rig,
) {
  const point = getLabelPoint(d.u, d.v, labelAspect);
  framingPosition(d, camera, viewAspect, scratch);
  out.x = scratch.x;
  out.y = scratch.y + d.lift + Math.sin(time * 1.1) * 0.05 * d.float;
  out.z = scratch.z;
  out.tilt = d.tilt + Math.sin(time * 0.6) * 0.012;
  out.lean = Math.sin(time * 0.45) * 0.015;
  out.spin = point.angle;
  out.liftY = -point.y * BOTTLE_SCALE;
  out.liftZ = -point.radius * BOTTLE_SCALE;
  return out;
}

export function lerpRig(a: Rig, b: Rig, t: number, out: Rig) {
  out.x = a.x + (b.x - a.x) * t;
  out.y = a.y + (b.y - a.y) * t;
  out.z = a.z + (b.z - a.z) * t;
  out.tilt = a.tilt + (b.tilt - a.tilt) * t;
  out.lean = a.lean + (b.lean - a.lean) * t;
  out.spin = a.spin + (b.spin - a.spin) * t;
  out.liftY = a.liftY + (b.liftY - a.liftY) * t;
  out.liftZ = a.liftZ + (b.liftZ - a.liftZ) * t;
  return out;
}

export type RigGroups = {
  rig: THREE.Group;
  tilt: THREE.Group;
  lift: THREE.Group;
  spin: THREE.Group;
};

export function applyRig(r: Rig, g: RigGroups) {
  g.rig.position.set(r.x, r.y, r.z);
  g.tilt.rotation.set(r.lean, 0, r.tilt);
  g.lift.position.set(0, r.liftY, r.liftZ);
  g.spin.rotation.y = r.spin;
}
