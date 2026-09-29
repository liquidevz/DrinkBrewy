"use client";

import { MutableRefObject, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Director } from "../director";

const DEPTH = -20;

/**
 * A full-view plane far behind everything: Cola Dark black with a Brewy-red
 * glow that warms up for the label tour and the statement.
 */
export default function Backdrop({
  director,
  glowCenter,
}: {
  director: MutableRefObject<Director>;
  /** Glow centre in view UV (0,0 bottom-left). */
  glowCenter: [number, number];
}) {
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, DEPTH]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: {
          uGlow: { value: 0 },
          uStudio: { value: 1 },
          uCenter: { value: new THREE.Vector2(0.6, 0.55) },
          uAspect: { value: 1 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uGlow;
          uniform float uStudio;
          uniform vec2 uCenter;
          uniform float uAspect;
          varying vec2 vUv;
          void main() {
            vec3 base = vec3(0.043, 0.020, 0.024);           // cola #0B0506
            vec3 red = vec3(0.55, 0.035, 0.09);              // deep brewy red
            vec2 d = (vUv - uCenter) * vec2(uAspect, 1.0);
            float core = exp(-dot(d, d) * 3.2);
            float halo = exp(-dot(d, d) * 0.9);
            vec3 color = base + red * (core * 0.34 + halo * 0.08) * uGlow;
            // Grey studio cyclorama: dark overhead, a soft band of light where
            // the floor meets the wall, brightest in the middle. (Squares, not
            // pow(): pow of a negative base is NaN on some GPUs.)
            float by = (vUv.y - 0.3) / 0.2;
            float bx = (vUv.x - 0.5) * uAspect / 1.2;
            float band = exp(-by * by) * mix(0.45, 1.0, exp(-bx * bx));
            color += vec3(0.24, 0.23, 0.23) * band * uStudio;
            // Darken the bottom edge so the floor and copy sit on black.
            color *= mix(0.55, 1.0, smoothstep(0.0, 0.45, vUv.y));
            gl_FragColor = vec4(color, 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );

  useFrame(() => {
    material.uniforms.uGlow.value = director.current.glow;
    material.uniforms.uStudio.value = director.current.studio;
    material.uniforms.uCenter.value.set(glowCenter[0], glowCenter[1]);
    material.uniforms.uAspect.value = width / height;
  });

  return (
    <mesh position={[0, 0, DEPTH]} scale={[width * 1.05, height * 1.05, 1]} material={material} renderOrder={-1}>
      <planeGeometry />
    </mesh>
  );
}
