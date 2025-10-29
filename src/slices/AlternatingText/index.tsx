"use client";

import { Bounded } from "@/components/Bounded";
import { View } from "@react-three/drei";
import Scene from "./Scene";
import clsx from "clsx";
import { AlternatingTextSlice } from "@/data/content";
import Image from "next/image";

/**
 * Props for `AlternatingText`.
 */
export type AlternatingTextProps = {
  slice: AlternatingTextSlice;
};

/**
 * Component for "AlternatingText" Slices.
 */
const AlternatingText = ({ slice }: AlternatingTextProps): JSX.Element => {
  return (
    <Bounded
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="alternating-text-container relative text-sky-950"
      style={{ backgroundColor: '#FFF8DD' }}
    >
      <div>
        <div className="relative z-[100] grid">
          <View className="alternating-text-view absolute left-0 top-0 h-screen w-full z-[120]">
            <Scene />
          </View>

          {slice.text_group.map((item, index) => (
            <div
              key={item.heading}
              className="alternating-section grid h-screen place-items-center gap-x-12 md:grid-cols-2"
            >
              <div
                className={clsx(
                  index % 2 === 0 ? "col-start-1" : "md:col-start-2",
                  "rounded-lg p-4 backdrop-blur-lg max-md:bg-white/30 relative z-[105]",
                )}
              >
                <Image
                  src={item.image || "/AlternatingText.png"}
                  alt={item.heading}
                  width={400}
                  height={600}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Bounded>
  );
};

export default AlternatingText;
