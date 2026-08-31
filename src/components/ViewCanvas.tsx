"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Loader = dynamic(
  () => import("@react-three/drei").then((mod) => mod.Loader),
  { ssr: false },
);

type Props = {};

export default function ViewCanvas({}: Props) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const gl = (probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Browsers cap the number of live WebGL contexts (~16). The probe context
    // has to be released or it permanently occupies one of those slots.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }, []);

  if (!webglSupported) {
    return null;
  }

  return (
    <>
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 30,
        }}
        shadows
        // dpr already caps the pixel ratio; calling gl.setPixelRatio() in
        // onCreated would override it and undo the cap on retina screens.
        dpr={[1, 1.5]}
        gl={{ antialias: true, failIfMajorPerformanceCaveat: false }}
        camera={{
          fov: 30,
        }}
      >
        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
