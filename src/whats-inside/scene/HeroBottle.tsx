"use client";

import { MutableRefObject, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { LABEL_TEXTURE, LabelSpotlight, SodaCan } from "@/components/SodaCan";
import { Carousel, centreWeight, rowPhase, rowRig } from "../carousel";
import { Director } from "../director";
import { applyRig, BOTTLE_SCALE, createRig, heroRig, lerpRig, RigGroups } from "../rig";

type Props = {
  director: MutableRefObject<Director>;
  carousel: MutableRefObject<Carousel>;
  spacing: MutableRefObject<number>;
  spotlight: LabelSpotlight;
};

/**
 * The star bottle. It's the carousel's centre bottle on the opening screen
 * (sliding out to the row when the carousel moves on, while the next bottle
 * slides in to take its place), then the camera subject for the whole tour.
 */
export default function HeroBottle({ director, carousel, spacing, spotlight }: Props) {
  const rigRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const liftRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  const label = useTexture(LABEL_TEXTURE);
  const image = label.image as { width: number; height: number };
  const labelAspect = image.width / image.height;

  const rigs = useMemo(() => ({ hero: createRig(), row: createRig(), out: createRig() }), []);

  useFrame(({ camera, size, clock }) => {
    const groups = {
      rig: rigRef.current,
      tilt: tiltRef.current,
      lift: liftRef.current,
      spin: spinRef.current,
    };
    if (!groups.rig || !groups.tilt || !groups.lift || !groups.spin) return;

    const d = director.current;
    const c = carousel.current;
    heroRig(d, camera as THREE.PerspectiveCamera, size.width / size.height, labelAspect, clock.elapsedTime, rigs.hero);

    // Mid-slide, the centre bottle drifts back into the row. The carousel's
    // pull fades out as the studio sinks away into the tour.
    const phase = rowPhase(c);
    const toRow = (1 - centreWeight(phase)) * d.stage;
    if (toRow > 0.0001) {
      rowRig(rigs.hero, -phase, c.index, spacing.current, rigs.row);
      lerpRig(rigs.hero, rigs.row, toRow, rigs.out);
      // Slide on the row's fixed spacing so the neighbours keep their
      // distance (blending x too would pinch them together mid-slide).
      rigs.out.x = rigs.hero.x - phase * spacing.current * d.stage;
    } else {
      Object.assign(rigs.out, rigs.hero);
    }
    applyRig(rigs.out, groups as RigGroups);
    groups.rig.visible = d.lift < 3.9;

    spotlight.center.value.set(d.u, d.v);
    spotlight.radius.value.set(d.spotRX, d.spotRY);
    spotlight.amount.value = d.spot;
  });

  return (
    <group ref={rigRef}>
      <group ref={tiltRef}>
        <group ref={liftRef}>
          <group ref={spinRef}>
            <SodaCan
              scale={BOTTLE_SCALE}
              spotlight={spotlight}
              shell="studio"
              detail="high"
              bubbles={110}
            />
          </group>
        </group>
      </group>
    </group>
  );
}
