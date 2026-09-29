"use client";

import { MutableRefObject, useLayoutEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { LABEL_TEXTURE, SodaCan } from "@/components/SodaCan";
import { Carousel, centreWeight, ROW_DEPTH, rowPhase, rowRig, SIDE_SLOTS } from "../carousel";
import { Director } from "../director";
import { applyRig, BOTTLE_SCALE, createRig, heroRig, lerpRig, Rig, RigGroups } from "../rig";

// Every slot except the centre, which is the hero bottle.
const SLOTS = Array.from({ length: SIDE_SLOTS * 2 }, (_, i) =>
  i < SIDE_SLOTS ? i - SIDE_SLOTS : i - SIDE_SLOTS + 1,
);

type Props = {
  director: MutableRefObject<Director>;
  carousel: MutableRefObject<Carousel>;
  spacing: MutableRefObject<number>;
};

/**
 * The row of bottles either side of the hero, floating in the dark. When the
 * carousel slides, the whole row moves one slot and the bottle arriving in
 * the middle lifts out of the row into the hero's exact pose - at which point
 * the hero takes over, so the loop never shows a seam.
 */
export default function CarouselRow({ director, carousel, spacing }: Props) {
  const groupsRef = useRef<(RigGroups | null)[]>([]);
  const label = useTexture(LABEL_TEXTURE);
  const image = label.image as { width: number; height: number };
  const labelAspect = image.width / image.height;
  const rigs = useMemo(() => ({ center: createRig(), row: createRig(), out: createRig() }), []);

  useFrame(({ camera, size, clock }) => {
    const d = director.current;
    const c = carousel.current;
    const visible = d.stage > 0.01;
    const aspect = size.width / size.height;
    const cam = camera as THREE.PerspectiveCamera;

    heroRig(d, cam, aspect, labelAspect, clock.elapsedTime, rigs.center);

    // Space the row so about eight bottles span the view at its depth.
    const rowDist = d.dist + ROW_DEPTH;
    const rowWidth = 2 * rowDist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * aspect;
    spacing.current = Math.max(1.05, rowWidth / 8);

    // Middle of the empty space between the hero's edge and its neighbour's
    // edge (the neighbour sits further back, so it looks smaller), as a
    // fraction of the view's width at the hero's depth.
    const halfBottle = 0.355;
    const k = d.dist / rowDist;
    const heroViewWidth = 2 * d.dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * aspect;
    c.gap = (halfBottle + k * (spacing.current - halfBottle)) / 2 / heroViewWidth;

    // When the hero takes the spotlight, the row is shoved out past both
    // edges of the frame - each bottle off its own side.
    const gone = 1 - d.stage;
    const push = gone * rowWidth * 0.85;

    SLOTS.forEach((slot, i) => {
      const groups = groupsRef.current[i];
      if (!groups) return;
      groups.rig.visible = visible;
      if (!visible) return;

      const offset = slot - rowPhase(c);
      rowRig(rigs.center, offset, c.index + slot, spacing.current, rigs.row);
      // Depth, height and angle ease into the hero's pose near the middle;
      // the sideways position stays on the row's fixed spacing.
      lerpRig(rigs.row, rigs.center, centreWeight(offset), rigs.out);
      rigs.out.x = rigs.row.x + Math.sign(slot) * push;
      applyRig(rigs.out as Rig, groups);
    });
  });

  return (
    <>
      {SLOTS.map((slot, i) => (
        <RowBottle
          key={slot}
          // The two neighbours can glide into the centre, so they get the
          // hero's full detail and fizz; the rest stay light.
          near={Math.abs(slot) === 1}
          onGroups={(groups) => {
            groupsRef.current[i] = groups;
          }}
        />
      ))}
    </>
  );
}

function RowBottle({ near, onGroups }: { near: boolean; onGroups: (g: RigGroups | null) => void }) {
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const lift = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);

  // Hand the four groups to the row once they all exist.
  useLayoutEffect(() => {
    if (rig.current && tilt.current && lift.current && spin.current) {
      onGroups({ rig: rig.current, tilt: tilt.current, lift: lift.current, spin: spin.current });
    }
    return () => onGroups(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <group ref={rig}>
      <group ref={tilt}>
        <group ref={lift}>
          <group ref={spin}>
            <SodaCan
              scale={BOTTLE_SCALE}
              shell="studio"
              detail={near ? "high" : "low"}
              bubbles={near ? 60 : 0}
            />
          </group>
        </group>
      </group>
    </group>
  );
}
