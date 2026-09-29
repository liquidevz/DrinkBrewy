"use client";

import { Environment, Lightformer } from "@react-three/drei";

type Props = {
  /** Scales the whole rig; 1 is tuned for the bottle on a Cola Dark page. */
  intensity?: number;
};

/**
 * The one lighting setup every bottle on the site shares: a dark studio built
 * from light strips, so clear plastic, cola and cap pick up crisp white
 * highlights and Brewy-red rims, plus a soft key so the label print reads.
 */
export default function StudioEnvironment({ intensity = 1 }: Props) {
  return (
    <>
      <ambientLight intensity={0.5 * intensity} />
      <spotLight
        position={[-3, 3, 4]}
        intensity={45 * intensity}
        angle={0.6}
        penumbra={1}
        color="#fff4ea"
      />

      <Environment resolution={256} frames={1}>
        {/* Tall white key strip, front-left. */}
        <Lightformer
          form="rect"
          intensity={3.5 * intensity}
          position={[-5, 1, 3]}
          scale={[2, 9, 1]}
        />
        {/* Softer fill strip, front-right. */}
        <Lightformer
          form="rect"
          intensity={2 * intensity}
          position={[5, 0, 2]}
          scale={[1.5, 9, 1]}
        />
        {/* Overhead softbox. */}
        <Lightformer
          form="rect"
          intensity={1 * intensity}
          position={[0, 6, 1]}
          scale={[6, 3, 1]}
        />
        {/* Brewy-red rims from behind. */}
        <Lightformer
          form="rect"
          intensity={7 * intensity}
          color="#ff2d45"
          position={[4, 1, -5]}
          scale={[3, 9, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.5 * intensity}
          color="#c41e3a"
          position={[-4, -1, -5]}
          scale={[3, 9, 1]}
        />
      </Environment>
    </>
  );
}
