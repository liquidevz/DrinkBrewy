"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { View } from "@react-three/drei";
import Image from "next/image";

import { Bounded } from "@/components/Bounded";
import Button from "@/components/Button";
import { TextSplitter } from "@/components/TextSplitter";
import Scene from "./Scene";
import { Bubbles } from "./Bubbles";
import { useStore } from "@/hooks/useStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HeroSlice } from "@/data/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Props for `Hero`.
 */
export type HeroProps = {
  slice: HeroSlice;
};

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {
  const ready = useStore((state) => state.ready);
  const isDesktop = useMediaQuery("(min-width: 768px)", true);

  useGSAP(
    () => {
      if (!ready) return;

      const introTl = gsap.timeline();

      introTl
        .set(".hero", { opacity: 1 })
        .from(".hero-header-word", {
          scale: 3,
          opacity: 0,
          ease: "power4.in",
          delay: 0.3,
          stagger: 1,
        })
        .from(
          ".hero-subtitle",
          {
            opacity: 0,
            y: 20,
            ease: "power2.out",
          },
          "+=.3",
        )
        .from(
          ".hero-subheading",
          {
            opacity: 0,
            y: 30,
          },
          "+=.5",
        )
        .from(".hero-body", {
          opacity: 0,
          y: 10,
        })
        .from(".hero-button", {
          opacity: 0,
          y: 10,
          duration: 0.6,
        });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      scrollTl
        .fromTo(
          "body",
          {
            backgroundColor: "#FFF8DD",
          },
          {
            backgroundColor: "#FFF8DD",
            overwrite: "auto",
          },
          1,
        )
        .from(".text-side-heading .split-char", {
          scale: 1.3,
          y: 40,
          rotate: -25,
          opacity: 0,
          stagger: 0.1,
          ease: "back.out(3)",
          duration: 0.5,
        })
        .from(".text-side-body", {
          y: 20,
          opacity: 0,
        });
    },
    { dependencies: [ready] },
  );

  return (
    <Bounded
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="hero opacity-0"
    >
      <View className="hero-scene pointer-events-none sticky top-0 z-50 -mt-[100vh] h-screen w-screen">
        <Scene />
        <Bubbles count={300} speed={2} repeat={true} />
      </View>

      <div className="grid">
        <div className="grid h-screen place-items-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header text-7xl font-black uppercase leading-[.8] text-red-600 md:text-[9rem] lg:text-[13rem]">
              <TextSplitter
                text={slice.heading}
                wordDisplayStyle="block"
                className="hero-header-word"
              />
            </h1>
            <div className="hero-subtitle mt-4 text-xl font-medium text-red-600/80">
              <p>{slice.subtitle}</p>
            </div>
            <div className="hero-subheading mt-12 text-5xl font-semibold text-sky-950 lg:text-6xl">
              <p>{slice.subheading}</p>
            </div>
            <div className="hero-body text-2xl font-normal text-sky-950">
              <p>{slice.body}</p>
            </div>
            <Button
              buttonLink={slice.button_link}
              buttonText={slice.button_text}
              className="hero-button mt-12"
            />
          </div>
        </div>

        <div className="text-side relative z-[80] grid h-screen items-center gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-side-heading text-balance text-6xl font-black uppercase text-sky-950 lg:text-8xl">
              <TextSplitter text="Try All Flavors" />
            </h2>
            <div className="text-side-body mt-4 max-w-xl text-balance text-xl font-normal text-sky-950">
              <p>{slice.second_body}</p>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
