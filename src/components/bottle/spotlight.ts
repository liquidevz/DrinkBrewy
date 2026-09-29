import * as THREE from "three";

import { LABEL_FRONT_U } from "./geometry";

/**
 * Uniforms for highlighting one spot of the label: everything outside the
 * spot is dimmed and the spot itself glows. Tween the `.value`s to animate.
 */
export type LabelSpotlight = {
  /** Label UV of the spot's centre. */
  center: { value: THREE.Vector2 };
  /** Half-size of the spot, as a fraction of the label's height. */
  radius: { value: THREE.Vector2 };
  /** 0 = plain label, 1 = fully spotlit. */
  amount: { value: number };
};

export function createLabelSpotlight(): LabelSpotlight {
  return {
    center: { value: new THREE.Vector2(LABEL_FRONT_U, 0.5) },
    radius: { value: new THREE.Vector2(0.12, 0.16) },
    amount: { value: 0 },
  };
}

// A compiled material keeps the uniform objects it was compiled with, so a
// different spotlight needs a fresh material; this gives each one a key.
const spotlightIds = new WeakMap<LabelSpotlight, number>();
let nextSpotlightId = 0;

export function getSpotlightKey(spotlight?: LabelSpotlight) {
  if (!spotlight) return "plain";
  let id = spotlightIds.get(spotlight);
  if (id === undefined) {
    id = nextSpotlightId++;
    spotlightIds.set(spotlight, id);
  }
  return `spotlit-${id}`;
}

/** Patches a MeshStandardMaterial's shader to apply the spotlight. */
export function injectSpotlight(
  shader: THREE.WebGLProgramParametersWithUniforms,
  spotlight: LabelSpotlight,
  aspect: number,
) {
  shader.uniforms.uSpotCenter = spotlight.center;
  shader.uniforms.uSpotRadius = spotlight.radius;
  shader.uniforms.uSpotAmount = spotlight.amount;
  shader.uniforms.uLabelAspect = { value: aspect };
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
      uniform vec2 uSpotCenter;
      uniform vec2 uSpotRadius;
      uniform float uSpotAmount;
      uniform float uLabelAspect;`,
    )
    .replace(
      "#include <map_fragment>",
      `#include <map_fragment>
      vec2 spotDelta = vMapUv - uSpotCenter;
      spotDelta.x -= floor(spotDelta.x + 0.5); // the label wraps around
      float spotDist = length(spotDelta * vec2(uLabelAspect, 1.0) / uSpotRadius);
      float spotLit = 1.0 - smoothstep(0.65, 1.0, spotDist);
      totalEmissiveRadiance += diffuseColor.rgb * spotLit * uSpotAmount * 0.3;`,
    )
    // Dim the lit result, not just the print colour, so the glossy label's
    // reflections go dark outside the spot too.
    .replace(
      "#include <opaque_fragment>",
      `outgoingLight *= mix(1.0, mix(0.1, 1.1, spotLit), uSpotAmount);
      #include <opaque_fragment>`,
    );
}
