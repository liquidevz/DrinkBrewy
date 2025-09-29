"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/Soda-can.gltf");

const flavorTextures = {
  lemonLime: "/labels/lemon-lime.png",
  grape: "/labels/grape.png",
  blackCherry: "/labels/cherry.png",
  strawberryLemonade: "/labels/strawberry.png",
  watermelon: "/labels/watermelon.png",
};

export type SodaBottleProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaBottle({
  flavor = "blackCherry",
  scale = 2,
  ...props
}: SodaBottleProps) {
  const { nodes } = useGLTF("/Soda-can.gltf");
  const labels = useTexture(flavorTextures);

  labels.strawberryLemonade.flipY = false;
  labels.blackCherry.flipY = false;
  labels.watermelon.flipY = false;
  labels.grape.flipY = false;
  labels.lemonLime.flipY = false;

  const label = labels[flavor];

  return (
    <group {...props} dispose={null} scale={scale} rotation={[0, -Math.PI, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.can as THREE.Mesh).geometry}
        scale={[1, 1.5, 1]}
      >
        <meshStandardMaterial roughness={0.15} metalness={0.7} map={label} transparent={true} />
      </mesh>
    </group>
  );
}