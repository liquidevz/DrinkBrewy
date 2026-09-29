"use client";

import { MutableRefObject, useLayoutEffect, useMemo, useRef } from "react";
import { Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { getLabelPoint, LABEL_TEXTURE } from "@/components/SodaCan";
import { MESH_SCALE, MODEL_CENTER_Y } from "@/components/bottle/profile";
import { podium } from "../content";
import {
  BOTTLE_CENTER_V,
  Director,
  Framing,
  LAMP_RISE,
  PEDESTAL_DROP,
} from "../director";
import { BOTTLE_SCALE, framingPosition } from "../rig";

// Lowest point of the bottle's feet and top of its cap, in model units.
const BOTTLE_BASE_Y = 3.6;
const BOTTLE_TOP_Y = 176;
// The bottle hovers this far above the pedestal and below the lamp.
const PEDESTAL_GAP = 0.34;
const LAMP_GAP = 0.42;

const PEDESTAL_RADIUS = 0.82;
const PEDESTAL_HEIGHT = 0.3;
const LAMP_RADIUS = 0.74;

const lathe = (points: number[][]) =>
  points.map(([r, y]) => new THREE.Vector2(r, y));

// A thick puck with softly rounded edges.
const pedestalProfile = lathe([
  [0, 0],
  [PEDESTAL_RADIUS - 0.04, 0],
  [PEDESTAL_RADIUS, 0.03],
  [PEDESTAL_RADIUS, PEDESTAL_HEIGHT - 0.03],
  [PEDESTAL_RADIUS - 0.04, PEDESTAL_HEIGHT],
  [0, PEDESTAL_HEIGHT],
]);

// A flat round studio lamp on a suspension rod, lit from underneath.
const lampProfile = lathe([
  [LAMP_RADIUS - 0.1, 0],
  [LAMP_RADIUS - 0.02, 0.01],
  [LAMP_RADIUS, 0.05],
  [LAMP_RADIUS, 0.11],
  [LAMP_RADIUS - 0.05, 0.15],
  [0.32, 0.18],
  [0.13, 0.3],
  [0.05, 0.34],
  [0.05, 3],
]);

// Concentric light rings on the lamp's underside, brightest in the middle.
const LAMP_RINGS = [
  { radius: 0.2, strength: 3 },
  { radius: 0.38, strength: 2.2 },
  { radius: 0.56, strength: 1.5 },
];

const simpleVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * The opening set: a lamp overhead, a pedestal below with the product name
 * on it, and a pool of light on the studio floor. The hero bottle floats in
 * the gap between lamp and pedestal. Sinks away when the label tour begins.
 */
export default function PodiumSet({
  director,
  framing,
}: {
  director: MutableRefObject<Director>;
  framing: Framing["podium"];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lampRef = useRef<THREE.Group>(null);
  const lowerRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef<THREE.Object3D>(null);
  const glowMaterials = useRef<THREE.MeshBasicMaterial[]>([]);

  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const label = useTexture(LABEL_TEXTURE);
  const image = label.image as { width: number; height: number };

  // Lay the set out around where the podium framing puts the bottle.
  const layout = useMemo(() => {
    const focus = framingPosition(
      framing,
      camera,
      size.width / size.height,
      new THREE.Vector3(),
    );
    const point = getLabelPoint(0, BOTTLE_CENTER_V, image.width / image.height);
    const centerY = focus.y - point.y * BOTTLE_SCALE;
    const unit = MESH_SCALE * BOTTLE_SCALE;
    const pedestalTop =
      centerY + (BOTTLE_BASE_Y - MODEL_CENTER_Y) * unit - PEDESTAL_GAP;
    const lampBottom =
      centerY + (BOTTLE_TOP_Y - MODEL_CENTER_Y) * unit + LAMP_GAP;
    return {
      x: focus.x,
      z: focus.z - point.radius * BOTTLE_SCALE,
      floor: pedestalTop - PEDESTAL_HEIGHT,
      lampBottom,
    };
  }, [framing, camera, size.width, size.height, image.width, image.height]);

  // Heights below are relative to the floor.
  const lampY = layout.lampBottom - layout.floor;
  const beamHeight = lampY - PEDESTAL_HEIGHT;

  const floorMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uStage: { value: 1 } },
        vertexShader: simpleVertex,
        fragmentShader: /* glsl */ `
          uniform float uStage;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            // A soft pool of lamp light on a dark studio floor, with the
            // pedestal's red glow underneath.
            float pool = exp(-dot(p, p) * 60.0);
            float spill = exp(-dot(p * vec2(1.0, 2.2), p * vec2(1.0, 2.2)) * 9.0);
            float under = exp(-dot(p, p) * 260.0);
            vec3 color = vec3(0.30, 0.27, 0.27) * pool
                       + vec3(0.11, 0.09, 0.09) * spill
                       + vec3(0.75, 0.08, 0.16) * under;
            float alpha = clamp(pool + spill + under, 0.0, 1.0) * uStage;
            gl_FragColor = vec4(color, alpha);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  );

  // A faint cone of light from the lamp down to the pedestal.
  const beamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uStrength: { value: 1 } },
        vertexShader: simpleVertex,
        fragmentShader: /* glsl */ `
          uniform float uStrength;
          varying vec2 vUv;
          void main() {
            // pow(0, y) is NaN on some GPUs (ANGLE/D3D), and bloom smears a
            // single NaN pixel across the whole frame - keep the base positive.
            float a = pow(max(vUv.y, 1e-4), 1.6) * 0.06 * uStrength;
            gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * a, a);
          }
        `,
      }),
    [],
  );

  useLayoutEffect(() => {
    if (spotRef.current && targetRef.current)
      spotRef.current.target = targetRef.current;
  }, []);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const d = director.current;
    const gone = 1 - d.stage;
    group.visible = d.stage > 0.01;
    if (!group.visible) return;

    // Clearing the stage, the lamp rises out of the top of the frame and
    // the pedestal sinks out of the bottom, parting around the bottle.
    group.position.set(layout.x, layout.floor, layout.z);
    if (lampRef.current) lampRef.current.position.y = lampY + gone * LAMP_RISE;
    if (lowerRef.current) lowerRef.current.position.y = -gone * PEDESTAL_DROP;
    floorMaterial.uniforms.uStage.value = d.stage;
    beamMaterial.uniforms.uStrength.value =
      d.stage * d.stage * (1 + d.flash * 2);

    // The lamp breathes gently and flares when the bottle arrives.
    const pulse = 0.9 + Math.sin(clock.elapsedTime * 1.4) * 0.1;
    glowMaterials.current.forEach((m, i) => {
      const base = i < LAMP_RINGS.length ? LAMP_RINGS[i].strength : 1.6;
      m.color.setRGB(1, 0.96, 0.9).multiplyScalar(base * (pulse + d.flash * 2));
    });
    if (spotRef.current)
      spotRef.current.intensity = (35 + d.flash * 70) * d.stage;
  });

  const glowRef = (i: number) => (m: THREE.MeshBasicMaterial | null) => {
    if (m) glowMaterials.current[i] = m;
  };

  return (
    <group ref={groupRef}>
      <group ref={lowerRef}>
        {/* Floor */}
        <mesh
          rotation-x={-Math.PI / 2}
          position-y={0.001}
          scale={[14, 14, 1]}
          material={floorMaterial}
        >
          <planeGeometry />
        </mesh>

        {/* Pedestal, with the product name wrapped around its front. */}
        <mesh>
          <latheGeometry args={[pedestalProfile, 128]} />
          <meshPhysicalMaterial
            color="#120a0c"
            roughness={0.28}
            metalness={0.25}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
        <mesh position-y={PEDESTAL_HEIGHT - 0.012} rotation-x={Math.PI / 2}>
          <torusGeometry args={[PEDESTAL_RADIUS - 0.03, 0.008, 12, 160]} />
          <meshBasicMaterial
            color={new THREE.Color("#ff3b4e").multiplyScalar(2)}
            toneMapped={false}
          />
        </mesh>
        <Text
          font="/fonts/Alpino-Variable.woff"
          fontSize={0.1}
          lineHeight={0.92}
          letterSpacing={-0.01}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          position={[0, PEDESTAL_HEIGHT / 2, PEDESTAL_RADIUS + 0.004]}
          color="#FFF8DD"
          // drei forwards unknown props to troika's text mesh, which can curve
          // text; its types just don't list it. Negative wraps the text around
          // a cylinder behind it - the pedestal's own curved face.
          {...({ curveRadius: -(PEDESTAL_RADIUS + 0.004) } as object)}
        >
          {podium.pedestal.map((line) => line.toUpperCase()).join("\n")}
        </Text>
        <object3D ref={targetRef} position-y={PEDESTAL_HEIGHT} />
      </group>

      {/* Lamp */}
      <group ref={lampRef} position-y={lampY}>
        <mesh>
          <latheGeometry args={[lampProfile, 128]} />
          <meshStandardMaterial
            color="#b8bcc2"
            metalness={1}
            roughness={0.22}
          />
        </mesh>
        {/* Diffuser and light rings on the underside. */}
        <mesh rotation-x={Math.PI / 2} position-y={-0.002}>
          <circleGeometry args={[LAMP_RADIUS - 0.08, 96]} />
          <meshStandardMaterial
            color="#1a1818"
            metalness={0.6}
            roughness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {LAMP_RINGS.map((ring, i) => (
          <mesh key={ring.radius} rotation-x={Math.PI / 2} position-y={-0.006}>
            <torusGeometry args={[ring.radius, 0.014, 12, 128]} />
            <meshBasicMaterial ref={glowRef(i)} toneMapped={false} />
          </mesh>
        ))}
        {/* Bright outer lip. */}
        <mesh rotation-x={Math.PI / 2} position-y={0.01}>
          <torusGeometry args={[LAMP_RADIUS - 0.05, 0.012, 12, 160]} />
          <meshBasicMaterial
            ref={glowRef(LAMP_RINGS.length)}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* The light it throws down. */}
      <mesh
        position-y={PEDESTAL_HEIGHT + beamHeight / 2}
        material={beamMaterial}
      >
        <cylinderGeometry
          args={[LAMP_RADIUS - 0.1, PEDESTAL_RADIUS, beamHeight, 64, 1, true]}
        />
      </mesh>
      <spotLight
        ref={spotRef}
        position={[0, lampY, 0]}
        angle={0.45}
        penumbra={0.8}
        intensity={35}
        color="#fff4ea"
        distance={12}
      />
    </group>
  );
}
