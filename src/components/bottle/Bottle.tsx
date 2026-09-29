"use client";

import { useCallback } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  Detail,
  getCapGeometry,
  getLabelGeometry,
  getLabelLayout,
  getShellGeometry,
  LABEL_FRONT_U,
  LABEL_GAP,
} from "./geometry";
import { Liquid } from "./Liquid";
import { MESH_SCALE, MODEL_CENTER_Y, panelRadiusAt } from "./profile";
import { getSpotlightKey, injectSpotlight, LabelSpotlight } from "./spotlight";

export const LABEL_TEXTURE = "/labels/brewy.png";

// Puts the bottle's centre on its group's origin, so spins rotate it about
// its own axis and every scene keeps the framing it was built with.
const MESH_OFFSET = new THREE.Vector3(0, -MODEL_CENTER_Y * MESH_SCALE, 0);

/**
 * Where a point on the label sits, in the bottle's local space at scale 1.
 * `u`/`v` are label texture coordinates (v = 0 bottom, 1 top), `aspect` is the
 * label artwork's width / height.
 *
 * `angle` is the Y rotation that turns that point to face the camera.
 */
export function getLabelPoint(u: number, v: number, aspect: number) {
  const layout = getLabelLayout(aspect);
  const y = layout.bottom + v * layout.height;
  return {
    y: (y - MODEL_CENTER_Y) * MESH_SCALE,
    radius: (panelRadiusAt(y) + LABEL_GAP) * MESH_SCALE,
    angle: (LABEL_FRONT_U - u) * Math.PI * 2,
  };
}

/**
 * - `shared`: reflection-only clear plastic. Cheap, and safe on the homepage's
 *   single canvas that many sections draw into through scissored views.
 * - `studio`: physically transmissive PET that refracts the cola and whatever
 *   is behind it. Needs a canvas of its own (the What's Inside page).
 */
export type ShellVariant = "shared" | "studio";

export type BottleProps = {
  label?: string;
  scale?: number;
  spotlight?: LabelSpotlight;
  shell?: ShellVariant;
  detail?: Detail;
  /** Carbonation bubbles; 0 turns them off. */
  bubbles?: number;
};

export function Bottle({
  label: labelUrl = LABEL_TEXTURE,
  scale = 2,
  spotlight,
  shell = "shared",
  detail = "high",
  bubbles = 60,
}: BottleProps) {
  const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const label = useTexture(labelUrl);

  // Plain field assignments that only take effect at upload time, so they
  // are cheap to repeat. Never set needsUpdate here: that forces a full GPU
  // re-upload of the label on every render.
  label.colorSpace = THREE.SRGBColorSpace;
  label.wrapS = THREE.RepeatWrapping;
  label.wrapT = THREE.ClampToEdgeWrapping;
  label.anisotropy = maxAnisotropy;

  const image = label.image as { width: number; height: number };
  const aspect = image.width / image.height;

  const onBeforeCompile = useCallback(
    (shader: THREE.WebGLProgramParametersWithUniforms) => {
      if (spotlight) injectSpotlight(shader, spotlight, aspect);
    },
    [spotlight, aspect],
  );

  // Only spotlit labels need their own shader variant.
  const spotlightProps = spotlight
    ? { onBeforeCompile, customProgramCacheKey: () => "brewy-label-spotlight" }
    : {};

  return (
    // dispose={null}: the geometries are built once and shared by every
    // bottle on the page, so unmounting one bottle must not free them.
    <group dispose={null} scale={scale}>
      <group scale={MESH_SCALE} position={MESH_OFFSET}>
        <Liquid detail={detail} bubbles={bubbles} />

        {/* Printed label sleeve, wrapped once around the straight panel. */}
        <mesh geometry={getLabelGeometry(aspect, detail)}>
          <meshStandardMaterial
            key={getSpotlightKey(spotlight)}
            map={label}
            roughness={0.35}
            metalness={0}
            {...spotlightProps}
          />
        </mesh>

        {/* Black screw cap. */}
        <mesh geometry={getCapGeometry(detail)}>
          <meshPhysicalMaterial
            color="#0b0b0b"
            roughness={0.38}
            metalness={0}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Clear PET. Both variants draw both walls (front and back) since
            that's what you see through a real bottle's neck. */}
        <mesh geometry={getShellGeometry(detail)} renderOrder={2}>
          {shell === "studio" ? (
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={1}
              thickness={0.6}
              ior={1.57}
              roughness={0.03}
              metalness={0}
              specularIntensity={1}
              envMapIntensity={1}
              side={THREE.DoubleSide}
            />
          ) : (
            // Black so it adds no milky haze - only reflections - and the
            // custom blend adds those at full strength while dimming what's
            // behind by just the opacity. depthWrite off so the two walls
            // don't fight over draw order.
            <meshPhysicalMaterial
              color="#000000"
              roughness={0.05}
              metalness={0}
              envMapIntensity={0.3}
              transparent
              opacity={0.1}
              blending={THREE.CustomBlending}
              blendSrc={THREE.OneFactor}
              blendDst={THREE.OneMinusSrcAlphaFactor}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          )}
        </mesh>
      </group>
    </group>
  );
}
