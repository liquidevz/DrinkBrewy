"use client";

import { useRef, useEffect, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FloatingCan from "@/components/FloatingCan";
import { useStore } from "@/hooks/useStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {};

export default function Scene({}: Props) {
  const isReady = useStore((state) => state.isReady);

  const can1Ref = useRef<Group>(null);
  const can2Ref = useRef<Group>(null);
  const can1GroupRef = useRef<Group>(null);
  const can2GroupRef = useRef<Group>(null);
  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(() => {
    if (
      !can1Ref.current ||
      !can2Ref.current ||
      !can1GroupRef.current ||
      !can2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    // Set can starting location
    const xOffset = isMobile ? 1 : 1.5;
    gsap.set(can1Ref.current.position, { x: -xOffset });
    gsap.set(can1Ref.current.rotation, { z: -0.5 });
    gsap.set(can2Ref.current.position, { x: xOffset });
    gsap.set(can2Ref.current.rotation, { z: 0.5 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: "back.out(1.4)",
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(can1GroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(can1GroupRef.current.rotation, { z: 3 }, 0)
        .from(can2GroupRef.current.position, { y: 5, x: 1 }, 0)
        .from(can2GroupRef.current.rotation, { z: 3 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    scrollTl
      .to(groupRef.current.rotation, { y: Math.PI * 2 })
      .to(can1Ref.current.position, { x: isMobile ? 0.2 : 0.3, y: 0, z: isMobile ? -0.3 : -0.5 }, 0)
      .to(can1Ref.current.rotation, { z: 0.3 }, 0)
      .to(can2Ref.current.position, { x: isMobile ? 0.8 : 1.2, y: 0, z: isMobile ? -1 : -1.5 }, 0)
      .to(can2Ref.current.rotation, { z: -0.3 }, 0);
  }, [isMobile]);

  return (
    <group ref={groupRef}>
      <group ref={can1GroupRef}>
        <FloatingCan
          ref={can1Ref}
          flavor="blackCherry"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <group ref={can2GroupRef}>
        <FloatingCan
          ref={can2Ref}
          flavor="lemonLime"
          floatSpeed={FLOAT_SPEED}
        />
      </group>
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
