"use client";

import { MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { SodaCan, SodaCanProps } from "@/components/SodaCan";
import { Director } from "../director";

// One entry per bottle in the line. Every slot is Cola today; as flavours
// launch, give them their own `flavor` and they'll sweep through in order.
const LINEUP: NonNullable<SodaCanProps["flavor"]>[] = Array(17).fill("blackCherry");
const SCALE = 1.5;
// Centre-to-centre along the line: about one bottle width, so they stand
// shoulder to shoulder.
const SPACING = 0.6;
const DEPTH = -1.2;
// How many slots the line slides along itself over the sweep.
const TRAVEL = 6;

/**
 * A tight line of bottles snaking away from the camera - near and low on
 * the left, far and high on the right - that slides along itself as you
 * scroll, then rides up and away with the page as the FAQ scrolls in.
 */
export default function LineupSet({ director }: { director: MutableRefObject<Director> }) {
  const groupRef = useRef<THREE.Group>(null);
  const bottleRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(({ camera, size }) => {
    const group = groupRef.current;
    if (!group) return;
    const d = director.current;
    group.visible = d.lineupIn > 0.01;
    if (!group.visible) return;

    // Carried up at the same rate the page scrolls, so the line leaves the
    // top of the screen together with the content around it.
    const fov = (camera as THREE.PerspectiveCamera).fov;
    const viewHeight = 2 * (camera.position.z - DEPTH) * Math.tan(THREE.MathUtils.degToRad(fov / 2));
    const rise = (d.scrollOut / size.height) * viewHeight;
    group.position.set(0, (1 - d.lineupIn) * -3 + rise, DEPTH);

    const center = (LINEUP.length - 1) / 2;
    const travel = (d.lineup - 0.5) * TRAVEL;
    bottleRefs.current.forEach((bottle, i) => {
      if (!bottle) return;
      const s = i - center - travel;
      bottle.position.set(s * SPACING * 0.88, s * 0.13 + Math.sin(s * 0.45) * 0.12, -s * SPACING * 0.48);
      // Leaning into the line, each turned a touch differently.
      bottle.rotation.set(0.1, ((i % 3) - 1) * 0.35, -0.14 + Math.sin(i * 1.7) * 0.05);
    });
  });

  return (
    <group ref={groupRef}>
      {LINEUP.map((flavor, i) => (
        <group key={i} ref={(el) => { bottleRefs.current[i] = el; }}>
          <SodaCan flavor={flavor} scale={SCALE} shell="studio" detail="low" bubbles={0} />
        </group>
      ))}
    </group>
  );
}
