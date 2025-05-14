"use client"

import { type SVGProps, useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export function WavyCircles({ className, ...props }: SVGProps<SVGSVGElement>) {
  const svgRef = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Outer circle animation
      gsap.to(".wavy-circles-outer", {
        transformOrigin: "center",
        rotate: "-360",
        duration: 22,
        ease: "none",
        repeat: -1,
      })

      // Middle circle animation
      gsap.to(".wavy-circles-middle", {
        transformOrigin: "center",
        rotate: "360",
        duration: 18,
        ease: "none",
        repeat: -1,
      })

      // Inner circle animation
      gsap.to(".wavy-circles-inner", {
        transformOrigin: "center",
        rotate: "-360",
        duration: 16,
        ease: "none",
        repeat: -1,
      })

      // Core circle animation
      gsap.to(".wavy-circles-core", {
        transformOrigin: "center",
        rotate: "360",
        duration: 12,
        ease: "none",
        repeat: -1,
      })

      // Pulsating effect for all circles
      gsap.to([".wavy-circles-outer", ".wavy-circles-middle", ".wavy-circles-inner", ".wavy-circles-core"], {
        scale: 1.05,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
      })

      // Opacity breathing effect
      gsap.to([".wavy-circles-outer", ".wavy-circles-middle", ".wavy-circles-inner", ".wavy-circles-core"], {
        opacity: (i) => {
          // Start with different opacities based on layer
          return 0.3 + i * 0.1
        },
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.8,
      })
    }, svgRef)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1165 1166"
      className={className}
      {...props}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer wavy circle */}
      <path
        className="wavy-circles-outer"
        fill="currentColor"
        filter="url(#glow)"
        d="M1133.5 619c-5 76.2-84.8 126.7-113.5 183.3-28.7 56.6-20.8 149-74 195.6-53 46.6-143.6 26.9-203.4 48-59.9 21.2-120.2 93.8-196.5 88.9-76.2-5-126.6-86.2-183.2-113.5-56.6-28.7-149-20.8-195.6-74-46.7-53-26.9-143.6-46.7-203.4-19.8-59.7-93.7-121.5-88.8-196.4 4.8-74.8 84.8-128 113.6-184.6 28.7-56.6 19.4-149 72.5-195.7 53.1-46.7 143.7-26.9 203.4-46.7C481 100.8 543 26.8 619.1 31.8c76.2 5 126.7 84.7 183.3 113.5 56.6 28.7 149 19.4 195.7 72.5 46.6 53.1 26.8 143.7 48 203.5 19.8 59.7 92.3 121.5 87.4 197.7z"
        opacity="0.5"
      />

      {/* Middle wavy circle */}
      <path
        className="wavy-circles-middle"
        fill="currentColor"
        filter="url(#glow)"
        d="M980 583c-3.8 58.2-64.8 96.7-86.7 140-21.9 43.2-15.9 113.8-56.5 149.3-40.5 35.6-109.7 20.5-155.3 36.7-45.7 16.2-91.8 71.6-150 67.9-58.2-3.8-96.7-65.8-140-86.7-43.2-21.9-113.8-15.9-149.3-56.5-35.6-40.5-20.5-109.7-35.7-155.3-15.1-45.6-71.6-92.8-67.8-150 3.7-57.1 64.8-97.7 86.7-141 21.9-43.2 14.8-113.8 55.4-149.3 40.5-35.6 109.7-20.5 155.3-35.7 45.6-15.1 92.8-71.6 150-67.8 58.2 3.8 96.7 64.7 140 86.7 43.2 21.9 113.8 14.8 149.3 55.4 35.6 40.5 20.5 109.7 36.7 155.3 15.1 45.6 70.5 92.8 66.8 150z"
        opacity="0.4"
      />

      {/* Inner wavy circle */}
      <path
        className="wavy-circles-inner"
        fill="currentColor"
        filter="url(#glow)"
        d="M827.9 672.6c-12.4 34-55.3 46.3-75.9 68.2-20.5 22-29.2 64.9-59.5 79-30.3 14.2-68.8-6.8-98.7-5.1-30 1.6-67 26.6-101 14.2-33.9-12.3-46-55.9-68-75.8-22-20.5-65-29.2-79-59.5-14.1-30.3 6.9-68.8 5.8-98.6-1-29.7-26.4-67.6-14.2-101 12.1-33.3 55.5-46.9 76-68.8 20.6-21.8 28.6-65 59-79.2 30.2-14.1 68.7 6.9 98.4 5.8 29.8-1 67.7-26.4 101.6-14 34 12.3 46.2 55.2 68.1 75.8 21.9 20.5 65 28.6 79.2 58.9 14.1 30.3-6.9 68.8-5.2 98.8 1 29.7 25.7 67.4 13.4 101.3z"
        opacity="0.5"
      />

      {/* Core circle - new addition */}
      <path
        className="wavy-circles-core"
        fill="currentColor"
        filter="url(#glow)"
        d="M700 583c-6.2 17-27.7 23.2-38 34.1-10.3 11-14.6 32.5-29.8 39.5-15.2 7.1-34.4-3.4-49.4-2.6-15 0.8-33.5 13.3-50.5 7.1-17-6.2-23-28-34-38-11-10.3-32.5-14.6-39.5-29.8-7.1-15.2 3.5-34.4 2.9-49.3-0.5-14.9-13.2-33.8-7.1-50.5 6.1-16.7 27.8-23.5 38-34.4 10.3-10.9 14.3-32.5 29.5-39.6 15.1-7.1 34.4 3.5 49.2 2.9 14.9-0.5 33.9-13.2 50.8-7 17 6.2 23.1 27.6 34.1 37.9 11 10.3 32.5 14.3 39.6 29.5 7.1 15.2-3.5 34.4-2.6 49.4 0.5 14.9 12.9 33.7 6.7 50.7z"
        opacity="0.6"
      />

      {/* Decorative dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          className="wavy-circles-dot"
          cx={583 + 250 * Math.cos((i * Math.PI) / 6)}
          cy={583 + 250 * Math.sin((i * Math.PI) / 6)}
          r="5"
          fill="currentColor"
          opacity="0.8"
        />
      ))}
    </svg>
  )
}
