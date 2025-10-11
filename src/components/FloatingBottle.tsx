"use client";

import { forwardRef, ReactNode } from "react";
import { Float } from "@react-three/drei";
import { SodaBottle, SodaBottleProps } from "@/components/SodaBottle";
import { Group } from "three";

type FloatingBottleProps = {
  flavor?: SodaBottleProps["flavor"];
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
  scale?: number;
};

const FloatingBottle = forwardRef<Group, FloatingBottleProps>(
  (
    {
      flavor = "blackCherry",
      floatSpeed = 1.5,
      rotationIntensity = 1,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      children,
      scale = 2,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <SodaBottle flavor={flavor} scale={scale} />
        </Float>
      </group>
    );
  },
);

FloatingBottle.displayName = "FloatingBottle";

export default FloatingBottle;