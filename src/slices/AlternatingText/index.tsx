"use client";

import { View } from "@react-three/drei";
import { useEffect, useRef } from "react";
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
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target && entry.target.classList) {
            if (entry.isIntersecting) {
              entry.target.classList.add('opacity-100');
              entry.target.classList.remove('opacity-0');
            } else {
              entry.target.classList.add('opacity-0');
              entry.target.classList.remove('opacity-100');
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRefs = imageRefs.current.filter(Boolean);
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <section
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="alternating-text-container relative text-sky-950"
      style={{ backgroundColor: '#FFF8DD' }}
    >
      <div className="relative z-[100] grid">
        <View className="alternating-text-view absolute left-0 top-0 h-screen w-full z-[120]">
          <Scene />
        </View>

        <div className="mx-auto w-full max-w-7xl">
          {slice.text_group.map((item, index) => (
            <div
              key={item.heading}
              className="alternating-section grid h-screen place-items-center gap-x-12 md:grid-cols-2 px-4"
            >
              <div
                ref={(el) => (imageRefs.current[index] = el)}
                className={clsx(
                  index % 2 === 0 ? "col-start-1" : "md:col-start-2",
                  "rounded-lg p-4 backdrop-blur-lg max-md:bg-white/30 relative z-[105] opacity-0 transition-opacity duration-1000",
                )}
              >
                <Image
                  src={item.image || "/AlternatingText.png"}
                  alt={item.heading}
                  width={600}
                  height={800}
                  className="object-contain md:w-[600px] md:h-[800px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlternatingText;
