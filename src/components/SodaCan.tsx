"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/result.gltf");

const flavorTextures = {
  lemonLime: "/labels/brewy.png",
  grape: "/labels/brewy.png",
  blackCherry: "/labels/brewy.png",
  strawberryLemonade: "/labels/brewy.png",
  watermelon: "/labels/brewy.png",
};

const metalMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.3,
  metalness: 1,
  color: "#bbbbbb",
});

export type SodaCanProps = {
  flavor?: keyof typeof flavorTextures;
  scale?: number;
};

export function SodaCan({
  flavor = "blackCherry",
  scale = 2,
  ...props
}: SodaCanProps) {
  const { nodes } = useGLTF("/result.gltf");

  const labels = useTexture(flavorTextures);

  // Fixes upside down labels
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
        geometry={(nodes.node as THREE.Mesh).geometry}
        scale={0.007}
        position={[-0.2, -0.7, -0.2]}
      >
        <meshStandardMaterial 
          roughness={0.15} 
          metalness={0.7} 
          map={label} 
          transparent={true}
          opacity={0.3}
          color="#ffffff"
        />
      </mesh>
    </group>
  );
}
