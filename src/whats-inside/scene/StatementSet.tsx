"use client";

import { MutableRefObject, useMemo, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { Director } from "../director";
import { statement } from "../content";

const TEXT_DEPTH = -3.2;

const fogVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Drifting fbm smoke, feathered at the edges so the planes never show.
const fogFragment = /* glsl */ `
  uniform float uTime;
  uniform float uDensity;
  uniform float uSeed;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vUv * vec2(3.2, 1.8) + uSeed + vec2(uTime * 0.035, uTime * 0.012);
    float n = fbm(p + fbm(p + uTime * 0.02));
    float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x)
               * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
    float alpha = smoothstep(0.32, 0.85, n) * edge * uDensity;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

const LAYERS = [
  { z: -1.8, color: "#c41e3a", strength: 0.55, seed: 0, speed: 1 },
  { z: -4.6, color: "#ff3b4e", strength: 0.35, seed: 7.3, speed: 0.7 },
  { z: -7, color: "#7a0f22", strength: 0.7, seed: 3.1, speed: 0.5 },
];

/** Giant type behind the bottle, wrapped in drifting Brewy-red smoke. */
export default function StatementSet({ director }: { director: MutableRefObject<Director> }) {
  const groupRef = useRef<THREE.Group>(null);
  const textRefs = useRef<(THREE.Mesh & { fillOpacity: number })[]>([]);
  const viewport = useThree((state) => state.viewport);
  const camera = useThree((state) => state.camera);

  const textView = viewport.getCurrentViewport(camera, [0, 0, TEXT_DEPTH]);
  const fontSize = Math.min(textView.height * 0.4, textView.width * 0.34);

  const layers = useMemo(
    () =>
      LAYERS.map((layer) => {
        const view = viewport.getCurrentViewport(camera, [0, 0, layer.z]);
        return {
          ...layer,
          scale: [view.width * 1.3, view.height * 1.3, 1] as [number, number, number],
          material: new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms: {
              uTime: { value: 0 },
              uDensity: { value: 0 },
              uSeed: { value: layer.seed },
              uColor: { value: new THREE.Color(layer.color) },
            },
            vertexShader: fogVertex,
            fragmentShader: fogFragment,
          }),
        };
      }),
    [viewport, camera],
  );

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const fog = director.current.fog;
    group.visible = fog > 0.005;
    if (!group.visible) return;

    // The smoke rolls up from below as it thickens.
    group.position.y = (1 - fog) * -1.2;
    layers.forEach((layer) => {
      layer.material.uniforms.uTime.value = clock.elapsedTime * layer.speed;
      layer.material.uniforms.uDensity.value = fog * layer.strength;
    });
    textRefs.current.forEach((text) => {
      if (text) text.fillOpacity = 0.2 * fog;
    });
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer, i) => (
        <mesh key={i} position-z={layer.z} scale={layer.scale} material={layer.material}>
          <planeGeometry />
        </mesh>
      ))}

      {statement.lines.map((line, i) => (
        <Text
          key={line}
          ref={(el) => {
            textRefs.current[i] = el as unknown as THREE.Mesh & { fillOpacity: number };
          }}
          position={[0, (0.5 - i) * fontSize * 0.86, TEXT_DEPTH]}
          font="/fonts/Alpino-Variable.woff"
          fontSize={fontSize}
          letterSpacing={-0.02}
          anchorX="center"
          anchorY="middle"
          color="#FFF8DD"
          fillOpacity={0}
          characters="NOBS."
        >
          {line.toUpperCase()}
        </Text>
      ))}
    </group>
  );
}
