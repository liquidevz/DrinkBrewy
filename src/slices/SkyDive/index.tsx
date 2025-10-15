"use client";

import { Bounded } from "@/components/Bounded";
import Scene from "./Scene";
import { View } from "@react-three/drei";
import { SkyDiveSlice } from "@/data/content";

/**
 * Props for `SkyDive`.
 */
export type SkyDiveProps = {
  slice: SkyDiveSlice;
};

/**
 * Component for "SkyDive" Slices.
 */
const SkyDive = ({ slice }: SkyDiveProps): JSX.Element => {
  return (
    <div
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="skydive h-screen w-screen"
    >
      <h2 className="sr-only">Refreshing Brewy Experience</h2>
      <View className="h-screen w-screen">
        <Scene
          flavor="watermelon"
          sentence="Refreshing Brewy Experience"
        />
      </View>
    </div>
  );
};

export default SkyDive;
