"use client";

import FloatingCan from "@/components/FloatingCan";
import { SodaCanProps } from "@/components/SodaCan";
import { Center, Environment, View } from "@react-three/drei";
import { useRef } from "react";
import { WavyCircles } from "./WavyCircles";
import { Group } from "three";
import Link from "next/link";

const FLAVOR: {
  flavor: SodaCanProps["flavor"];
  color: string;
  name: string;
} = { flavor: "blackCherry", color: "#710523", name: "Black Cherry" };

/**
 * Props for `Carousel`.
 */
export interface CarouselProps {
  heading?: string;
  priceCopy?: string;
}

/**
 * Component for "Carousel" Slices.
 */
const Carousel = ({
  heading = "Choose Your Flavor",
  priceCopy = "12 Packs • $35.00"
}: CarouselProps): JSX.Element => {
  const sodaCanRef = useRef<Group>(null);

  return (
    <section
      className="carousel grid-rows-[auto, 4fr, auto] relative grid h-screen justify-center overflow-hidden bg-white py-12 text-white"
    >
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" />

      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]" />

      <h2 className="relative text-center text-5xl font-bold">
        {heading}
      </h2>

      <div className="grid grid-cols-1 items-center justify-items-center">
        {/* can */}
        <Link href="https://drinkbrewy.com/products/brewy-6-pack?variant=42845686071332">
          <View className="aspect-square h-[70vmin] min-h-40 cursor-pointer">
            <Center position={[0, 0, 1.5]}>
              <FloatingCan
                floatIntensity={0.3}
                rotationIntensity={1}
                flavor={FLAVOR.flavor}
                ref={sodaCanRef}
                scale={0.6}
              />
            </Center>
            <Environment
              files="/hdr/lobby.hdr"
              environmentIntensity={0.6}
              environmentRotation={[0, 3, 0]}
            />

            <directionalLight intensity={6} position={[0, 1, 1]} />
          </View>
        </Link>
      </div>

      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-4xl font-medium">
          <p>{FLAVOR.name}</p>
        </div>

        <div className="mt-2 text-2xl font-normal opacity-90">
          {priceCopy}
        </div>
      </div>
    </section>
  );
};

export default Carousel;