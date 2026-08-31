"use client";

import { useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/result.gltf");

const flavorTextures = {
  lemonLime: "/labels/brewy.png",
  grape: "/labels/brewy.png",
  blackCherry: "/labels/brewy.png",
  strawberryLemonade: "/labels/brewy.png",
  watermelon: "/labels/brewy.png",
};

// The bottle geometry was imported from an STL scan, so it has no UVs at all.
// We unwrap it ourselves with a cylindrical projection: angle around the Y
// axis -> U, height -> V. The label band is restricted to the straight
// cylindrical body (between the base and the shoulder) so the neck/cap just
// clamp to the label's background color instead of stretching the artwork.
const LABEL_Y_RANGE: [number, number] = [15, 118];
// Model units -> scene units. The scan is ~169 units tall, so this puts the
// bottle at ~1.18 units before the group's own scale is applied.
const MESH_SCALE = 0.007;
// Rotates U so the label's center panel (the "Brewy" logo) faces the camera
// by default, matching the group's 180° Y rotation below. (0.25, not 0.75 -
// negating the angle for the mirror fix also flipped which panel lands at
// the front, so the offset needed the matching half-turn correction.)
const LABEL_FRONT_OFFSET = 0.25;

function ensureCylindricalUV(geometry: THREE.BufferGeometry) {
  if (geometry.attributes.uv) return;

  const position = geometry.attributes.position;
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox!;
  const cx = (bbox.min.x + bbox.max.x) / 2;
  const cz = (bbox.min.z + bbox.max.z) / 2;
  const [yMin, yMax] = LABEL_Y_RANGE;

  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i) - cx;
    const y = position.getY(i);
    const z = position.getZ(i) - cz;

    // Negated so U increases in the same rotational direction as the mesh's
    // outward-facing winding - without this the label reads mirrored as you
    // go around the bottle.
    const angle = Math.atan2(z, x);
    uv[i * 2] = -angle / (Math.PI * 2) + LABEL_FRONT_OFFSET;
    uv[i * 2 + 1] = (y - yMin) / (yMax - yMin);
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

// Splits the single mesh into two draw groups so the label band can stay an
// opaque printed material while the rest of the bottle (cap, neck, shoulder,
// base) renders as translucent plastic with the cola colour showing through.
// Classifies whole triangles (not vertices) by their average height, then
// reorders the index buffer so each group's triangles are contiguous - that
// contiguous-range requirement is what geometry.addGroup needs.
const LABEL_MATERIAL_INDEX = 0;
const PLASTIC_MATERIAL_INDEX = 1;

function ensureLabelBandGroups(geometry: THREE.BufferGeometry) {
  if (geometry.groups.length > 0) return;

  const index = geometry.index;
  if (!index) return;
  const position = geometry.attributes.position;
  const [yMin, yMax] = LABEL_Y_RANGE;

  const labelIndices: number[] = [];
  const plasticIndices: number[] = [];

  for (let i = 0; i < index.count; i += 3) {
    const a = index.getX(i);
    const b = index.getX(i + 1);
    const c = index.getX(i + 2);
    const avgY = (position.getY(a) + position.getY(b) + position.getY(c)) / 3;
    const bucket = avgY >= yMin && avgY <= yMax ? labelIndices : plasticIndices;
    bucket.push(a, b, c);
  }

  geometry.setIndex([...labelIndices, ...plasticIndices]);
  geometry.clearGroups();
  geometry.addGroup(0, labelIndices.length, LABEL_MATERIAL_INDEX);
  geometry.addGroup(labelIndices.length, plasticIndices.length, PLASTIC_MATERIAL_INDEX);
}

export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaCan({
  flavor = "blackCherry",
  scale = 2,
  ...props
}: SodaCanProps) {
  const { nodes } = useGLTF("/result.gltf");
  const geometry = (nodes.node as THREE.Mesh).geometry;

  // The scanned geometry sits in the positive octant (roughly 3..63 x, 3..172 y,
  // 3..63 z), so its origin is a corner rather than its middle. Offsetting the
  // mesh by the scaled bounding-box centre puts the bottle on the group origin:
  // it stays fully inside the camera frustum instead of being clipped at the
  // bottom, and the spin animations rotate it about its own axis instead of
  // swinging it around an off-centre pivot.
  const offset = useMemo(() => {
    ensureCylindricalUV(geometry);
    ensureLabelBandGroups(geometry);
    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox!.getCenter(center);
    return center.multiplyScalar(-MESH_SCALE).toArray() as [
      number,
      number,
      number,
    ];
  }, [geometry]);

  const labels = useTexture(flavorTextures);
  const label = labels[flavor];

  // These are plain field assignments that only take effect at upload time, so
  // they are cheap to repeat. Never set needsUpdate here: that forces a full
  // GPU re-upload of the 2363x886 label on every render.
  // flipY true (three's default) makes UV V=0 sample the bottom of the image,
  // matching the bottom-up V generated above, so the label reads right way up.
  label.flipY = true;
  label.wrapS = THREE.RepeatWrapping;
  label.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <group {...props} dispose={null} scale={scale} rotation={[0, -Math.PI, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={geometry}
        scale={MESH_SCALE}
        position={offset}
      >
        {/* Label band: opaque, the printed artwork. DoubleSide guards
            against the STL scan's occasional inconsistent face winding
            turning into a see-through gap. */}
        <meshStandardMaterial
          attach="material-0"
          roughness={0.4}
          metalness={0}
          map={label}
          side={THREE.DoubleSide}
        />
        {/* Cap/neck/shoulder/base: translucent tinted plastic so the cola
            colour reads through, like a real PET bottle. depthWrite is off
            so the front and back walls of the transparent shell (both
            visible through each other) don't fight over draw order. */}
        <meshStandardMaterial
          attach="material-1"
          color="#4a0f08"
          roughness={0.15}
          metalness={0}
          transparent
          opacity={0.55}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
