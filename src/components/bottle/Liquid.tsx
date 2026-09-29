"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import {
  Detail,
  getLevelTable,
  getLiquidGeometry,
  levelAt,
  liquidRadiusAt,
} from "./geometry";
import { FILL_Y, MODEL_CENTER_Y } from "./profile";

const UP = new THREE.Vector3(0, 1, 0);
// Bottle height in model units, used to turn world motion into "bottles".
const BOTTLE_HEIGHT = 172;
// Surface slosh: a damped spring (≈1.6 Hz, settles in ~1.5 s). Real physics
// gives a barely visible tilt for scroll-driven moves, so it's exaggerated.
const SLOSH_STIFFNESS = 100;
const SLOSH_DAMPING = 5;
const SLOSH_GAIN = 4;
const SLOSH_MAX = 0.28;
// Frame-to-frame acceleration is noisy; smooth it over roughly this long (s).
const ACCEL_SMOOTHING = 0.08;
// Faster than this (bottle heights per second) is a jump, not motion: a page
// loading mid-scroll, an anchor link, a scene swapping in. Ignore it.
const TELEPORT_SPEED = 40;
// Real gravity, in bottle heights per second² (a 300 ml bottle is ~20 cm).
const GRAVITY = 9.81 / 0.2;

const BUBBLE_MIN_Y = 24;

type Bubble = { theta: number; y: number; speed: number; size: number; phase: number };

function spawnBubble(bubble: Bubble, fresh: boolean) {
  bubble.theta = Math.random() * Math.PI * 2;
  bubble.y = fresh
    ? BUBBLE_MIN_Y + Math.random() * (FILL_Y - BUBBLE_MIN_Y)
    : BUBBLE_MIN_Y + Math.random() * 30;
  bubble.speed = 6 + Math.random() * 10;
  bubble.size = 0.18 + Math.random() * 0.34;
  bubble.phase = Math.random() * Math.PI * 2;
  return bubble;
}

type LiquidProps = {
  detail: Detail;
  /** Carbonation bubbles clinging to and rising up the wall. */
  bubbles?: number;
};

/**
 * Cola that behaves like a liquid: the surface stays level in world space
 * whatever the bottle does, the volume stays constant (even upside down),
 * it sloshes when the bottle moves, and bubbles stream up the wall.
 *
 * Must be rendered inside the bottle's model-space group.
 */
export function Liquid({ detail, bubbles = 0 }: LiquidProps) {
  const geometry = getLiquidGeometry(detail);
  const table = getLevelTable();

  const meshRef = useRef<THREE.Mesh>(null);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);

  const uniforms = useMemo(
    () => ({
      uPlanePoint: { value: new THREE.Vector3() },
      uPlaneNormal: { value: new THREE.Vector3(0, 1, 0) },
      uFoamWidth: { value: 0.01 },
      uRippleAmp: { value: 0 },
      uRippleFreq: { value: 1 },
      uRippleDir: { value: new THREE.Vector3(1, 0, 0) },
      uTime: { value: 0 },
    }),
    [],
  );

  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: "#050101",
      roughness: 0.18,
      metalness: 0,
      envMapIntensity: 0.35,
      side: THREE.DoubleSide,
    });

    m.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vLiquidWorld;")
        .replace(
          "#include <project_vertex>",
          `#include <project_vertex>
          vLiquidWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
        );

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform vec3 uPlanePoint;
          uniform vec3 uPlaneNormal;
          uniform float uFoamWidth;
          uniform float uRippleAmp;
          uniform float uRippleFreq;
          uniform vec3 uRippleDir;
          uniform float uTime;
          varying vec3 vLiquidWorld;`,
        )
        // Everything above the (rippling) surface plane is air.
        .replace(
          "void main() {",
          `void main() {
          float liquidDist = dot(vLiquidWorld - uPlanePoint, uPlaneNormal)
            + uRippleAmp * sin(dot(vLiquidWorld, uRippleDir) * uRippleFreq + uTime * 5.0);
          if (liquidDist > 0.0) discard;
          // With the top cut away, the inside of the far wall shows through
          // the opening; shading those back faces as a flat, up-facing
          // surface is what reads as the liquid's top.
          bool liquidTop = !gl_FrontFacing;`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
          // Cola isn't flat black: where the light path through it is short
          // (grazing edges) it glows a deep red-brown.
          // max(): pow(0, y) is NaN on some GPUs.
          float liquidEdge = pow(max(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), 1e-4), 2.5);
          vec3 colaEdge = vec3(0.30, 0.055, 0.02);
          if (liquidTop) {
            diffuseColor.rgb = vec3(0.028, 0.009, 0.005);
          } else {
            diffuseColor.rgb = mix(diffuseColor.rgb, colaEdge, liquidEdge * 0.35);
          }
          // Meniscus: a thin tan line where the surface meets the wall.
          float liquidFoam = 1.0 - smoothstep(0.0, uFoamWidth, -liquidDist);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.42, 0.26, 0.16), liquidFoam * 0.8);`,
        )
        // The top is a matte-ish dark surface: a mirror-like one picks up
        // whole bright rooms from the environment map and reads as amber.
        .replace(
          "#include <roughnessmap_fragment>",
          `#include <roughnessmap_fragment>
          if (liquidTop) roughnessFactor = 0.45;`,
        )
        .replace(
          "#include <opaque_fragment>",
          `if (liquidTop) outgoingLight *= 0.45;
          #include <opaque_fragment>`,
        )
        .replace(
          "#include <normal_fragment_begin>",
          `#include <normal_fragment_begin>
          if (liquidTop) normal = normalize((viewMatrix * vec4(uPlaneNormal, 0.0)).xyz);`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          if (!liquidTop) totalEmissiveRadiance += colaEdge * liquidEdge * 0.15;`,
        );
    };
    m.customProgramCacheKey = () => "brewy-liquid";
    return m;
  }, [uniforms]);

  useEffect(() => () => material.dispose(), [material]);

  const bubbleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffe6d0",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const bubbleGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  useEffect(() => () => bubbleMaterial.dispose(), [bubbleMaterial]);
  useEffect(() => () => bubbleGeometry.dispose(), [bubbleGeometry]);

  const bubbleState = useMemo(
    () =>
      Array.from({ length: bubbles }, () =>
        spawnBubble({ theta: 0, y: 0, speed: 0, size: 0, phase: 0 }, true),
      ),
    [bubbles],
  );

  // Per-frame scratch objects, reused so the frame loop never allocates.
  const sim = useMemo(
    () => ({
      ready: false,
      quaternion: new THREE.Quaternion(),
      inverse: new THREE.Quaternion(),
      axis: new THREE.Vector3(),
      upLocal: new THREE.Vector3(),
      pointLocal: new THREE.Vector3(),
      scale: new THREE.Vector3(),
      prevPoint: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      prevVelocity: new THREE.Vector3(),
      acceleration: new THREE.Vector3(),
      rawAcceleration: new THREE.Vector3(),
      tilt: new THREE.Vector2(),
      tiltVelocity: new THREE.Vector2(),
      matrix: new THREE.Matrix4(),
      bubblePos: new THREE.Vector3(),
      bubbleScale: new THREE.Vector3(),
      identity: new THREE.Quaternion(),
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(Math.max(delta, 1 / 240), 1 / 30);
    const s = sim;

    mesh.updateWorldMatrix(true, false);
    mesh.getWorldQuaternion(s.quaternion);
    mesh.getWorldScale(s.scale);
    const unit = s.scale.y; // world units per model unit
    const height = BOTTLE_HEIGHT * unit;

    // How far the bottle leans from upright decides where the surface sits;
    // "up" expressed in the bottle's own frame gives the plane's direction.
    s.axis.copy(UP).applyQuaternion(s.quaternion);
    const lean = Math.acos(THREE.MathUtils.clamp(s.axis.y, -1, 1));
    s.upLocal.copy(UP).applyQuaternion(s.inverse.copy(s.quaternion).invert());
    s.pointLocal
      .set(0, MODEL_CENTER_Y, 0)
      .addScaledVector(s.upLocal, levelAt(table, lean));

    const planePoint = uniforms.uPlanePoint.value;
    planePoint.copy(s.pointLocal).applyMatrix4(mesh.matrixWorld);

    // Slosh: the surface tilts towards the acceleration of its own centre
    // (which also captures the bottle swinging and spinning), then rings
    // down on a damped spring.
    if (s.ready) {
      s.velocity.subVectors(planePoint, s.prevPoint).divideScalar(dt);
      if (s.velocity.length() > TELEPORT_SPEED * height) {
        s.velocity.set(0, 0, 0);
        s.prevVelocity.set(0, 0, 0);
      }
      s.rawAcceleration.subVectors(s.velocity, s.prevVelocity).divideScalar(dt);
      s.acceleration.lerp(s.rawAcceleration, 1 - Math.exp(-dt / ACCEL_SMOOTHING));
    } else {
      s.velocity.set(0, 0, 0);
      s.acceleration.set(0, 0, 0);
      s.ready = true;
    }
    s.prevPoint.copy(planePoint);
    s.prevVelocity.copy(s.velocity);

    const g = GRAVITY * height;
    const targetX = THREE.MathUtils.clamp((s.acceleration.x / g) * SLOSH_GAIN, -SLOSH_MAX, SLOSH_MAX);
    const targetZ = THREE.MathUtils.clamp((s.acceleration.z / g) * SLOSH_GAIN, -SLOSH_MAX, SLOSH_MAX);
    s.tiltVelocity.x += (SLOSH_STIFFNESS * (targetX - s.tilt.x) - SLOSH_DAMPING * s.tiltVelocity.x) * dt;
    s.tiltVelocity.y += (SLOSH_STIFFNESS * (targetZ - s.tilt.y) - SLOSH_DAMPING * s.tiltVelocity.y) * dt;
    s.tilt.x = THREE.MathUtils.clamp(s.tilt.x + s.tiltVelocity.x * dt, -SLOSH_MAX, SLOSH_MAX);
    s.tilt.y = THREE.MathUtils.clamp(s.tilt.y + s.tiltVelocity.y * dt, -SLOSH_MAX, SLOSH_MAX);

    uniforms.uPlaneNormal.value.set(s.tilt.x, 1, s.tilt.y).normalize();

    // Ripples run along the slosh while it's moving and fade as it settles.
    const agitation = s.tiltVelocity.length();
    uniforms.uRippleAmp.value = Math.min(agitation * 0.4, 0.6) * unit;
    uniforms.uRippleFreq.value = (Math.PI * 2) / (14 * unit);
    if (agitation > 1e-4) {
      uniforms.uRippleDir.value.set(s.tiltVelocity.x, 0, s.tiltVelocity.y).normalize();
    }
    uniforms.uFoamWidth.value = 0.9 * unit;
    uniforms.uTime.value = clock.elapsedTime;

    // Carbonation: bubbles hug the wall just outside the liquid and rise; any
    // that leave the liquid pop and respawn low down.
    const instanced = bubblesRef.current;
    if (instanced && bubbleState.length) {
      for (let i = 0; i < bubbleState.length; i++) {
        const b = bubbleState[i];
        b.y += b.speed * dt;
        const theta = b.theta + Math.sin(clock.elapsedTime * 2 + b.phase) * 0.01;
        const r = liquidRadiusAt(b.y) + 0.12;
        s.bubblePos.set(r * Math.sin(theta), b.y, r * Math.cos(theta));

        const depth =
          (s.bubblePos.x - s.pointLocal.x) * s.upLocal.x +
          (s.bubblePos.y - s.pointLocal.y) * s.upLocal.y +
          (s.bubblePos.z - s.pointLocal.z) * s.upLocal.z;
        if (depth > -1.2 || b.y > FILL_Y + 20) {
          spawnBubble(b, false);
          s.bubbleScale.setScalar(0);
        } else {
          s.bubbleScale.setScalar(b.size);
        }
        s.matrix.compose(s.bubblePos, s.identity, s.bubbleScale);
        instanced.setMatrixAt(i, s.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} material={material} />
      {bubbles > 0 && (
        <instancedMesh
          ref={bubblesRef}
          args={[bubbleGeometry, bubbleMaterial, bubbles]}
          frustumCulled={false}
          renderOrder={1}
        />
      )}
    </>
  );
}
