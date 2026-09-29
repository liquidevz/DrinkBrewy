"use client";

import { MutableRefObject, RefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

import StudioEnvironment from "@/components/StudioEnvironment";
import { LabelSpotlight } from "@/components/SodaCan";
import { Carousel, updateCarousel } from "./carousel";
import { Director, Framing, sampleLoop, sampleStory, Story } from "./director";
import { createScrollView, readScroll } from "./scroll";
import Backdrop from "./scene/Backdrop";
import CarouselRow from "./scene/CarouselRow";
import HeroBottle from "./scene/HeroBottle";
import LineupSet from "./scene/LineupSet";
import PodiumSet from "./scene/PodiumSet";
import StatementSet from "./scene/StatementSet";

export type Intro = { flash: number };

type Props = {
  director: MutableRefObject<Director>;
  story: Story;
  storyRef: RefObject<HTMLElement>;
  loopRef: RefObject<HTMLElement>;
  carousel: MutableRefObject<Carousel>;
  intro: MutableRefObject<Intro>;
  spotlight: LabelSpotlight;
  framing: Framing;
  isDesktop: boolean;
  onReady: () => void;
};

/**
 * Runs before everything else each frame: turns the scroll position into
 * the director state, layers the load-in intro on top, and ticks the
 * carousel clock.
 */
function StoryDriver({
  director,
  story,
  storyRef,
  loopRef,
  carousel,
  intro,
}: Pick<Props, "director" | "story" | "storyRef" | "loopRef" | "carousel" | "intro">) {
  const view = useMemo(() => createScrollView(), []);

  useFrame((_, delta) => {
    const d = director.current;
    readScroll(storyRef.current, loopRef.current, view);
    if (view.loop > 0) {
      // Past the FAQ: rebuild the opening frame for the jump back to the top.
      sampleLoop(story, view.loop, d);
    } else {
      sampleStory(story, view.progress * story.duration, d);
      d.scrollOut = view.scrollOut;
    }
    d.flash += intro.current.flash;

    const c = carousel.current;
    const playing =
      d.stage > 0.98 && Math.abs(c.offset) < 1e-3 && document.visibilityState === "visible";
    updateCarousel(c, Math.min(delta, 0.1), playing);
  }, -1);
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  // Only mounts once everything inside the Suspense boundary has loaded.
  useEffect(() => onReady(), [onReady]);
  return null;
}

/**
 * The page's one continuous 3D scene, fixed behind the scrolling copy.
 * It has a canvas of its own, which is what lets the bottle use true
 * glass transmission and full-frame post-processing.
 */
export default function Stage(props: Props) {
  const { director, carousel, spotlight, framing, isDesktop, onReady } = props;
  const spacing = useRef(1);

  // Up to 2× pixel ratio for crisp edges on high-density screens, dropping
  // back to 1× if the device can't hold the frame rate.
  const [dpr, setDpr] = useState(1.5);
  useEffect(() => setDpr(Math.min(window.devicePixelRatio || 1, 2)), []);

  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      dpr={dpr}
      camera={{ position: [0, 0, 5], fov: 30, near: 0.1, far: 100 }}
      gl={{ antialias: false, stencil: false, powerPreference: "high-performance" }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(window.devicePixelRatio || 1, 2))}
        onFallback={() => setDpr(1)}
      />
      <color attach="background" args={["#0B0506"]} />
      {/* Anything much further back than the star bottle sinks into the
          dark, which is what separates it from the row behind it. It
          starts just behind the bottle, wherever this screen frames it. */}
      <fog
        attach="fog"
        args={["#0B0506", framing.podium.dist + 0.5, framing.podium.dist + 3.2]}
      />

      <StoryDriver {...props} />

      <Suspense fallback={null}>
        <Backdrop director={director} glowCenter={isDesktop ? [0.6, 0.55] : [0.5, 0.64]} />
        <StudioEnvironment />
        <PodiumSet director={director} framing={framing.podium} />
        <CarouselRow director={director} carousel={carousel} spacing={spacing} />
        <HeroBottle director={director} carousel={carousel} spacing={spacing} spotlight={spotlight} />
        <StatementSet director={director} />
        <LineupSet director={director} />
        <Ready onReady={onReady} />
      </Suspense>

      {/* Tone mapping runs here rather than in the renderer so bloom sees
          the real HDR highlights (the lamp, pedestal rim, glass).
          Khronos PBR Neutral keeps the label's brand red true, where AgX
          and ACES shift and desaturate saturated reds. */}
      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.25} intensity={0.6} mipmapBlur />
        <Vignette offset={0.25} darkness={0.7} />
        <Noise premultiply opacity={0.35} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </Canvas>
  );
}
