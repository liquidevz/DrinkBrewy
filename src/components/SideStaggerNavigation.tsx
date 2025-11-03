"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const NUM_LINES = 30;

const navItems = [
  { position: 3, title: "Home", href: "#home" },
  { position: 8, title: "Care", href: "#care" },
  { position: 15, title: "Flavors", href: "#flavors" },
  { position: 22, title: "Community", href: "#community" },
];

const SPRING_OPTIONS = {
  mass: 1,
  stiffness: 200,
  damping: 15,
};

interface LinkLineProps {
  mouseY: any;
  isHovered: boolean;
  title?: string;
  href?: string;
}

const LinkLine = ({ mouseY, isHovered, title, href }: LinkLineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    return val - (bounds?.y || 0) - (bounds?.height || 0) / 2;
  });

  const lineWidthRaw = useTransform(distance, [-80, 0, 80], [15, 100, 15]);
  const lineWidth = useSpring(lineWidthRaw, SPRING_OPTIONS);
  const linkWidth = useSpring(25, SPRING_OPTIONS);

  useEffect(() => {
    if (isHovered) {
      linkWidth.set(150);
    } else {
      linkWidth.set(25);
    }
  }, [isHovered, linkWidth]);

  if (title && href) {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <a href={href} onClick={handleClick}>
        <motion.div
          ref={ref}
          className="group relative bg-neutral-500 transition-colors hover:bg-red-500"
          style={{ width: linkWidth, height: 2 }}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-0 z-10 w-full pt-2 font-bold uppercase text-neutral-500 transition-colors group-hover:text-red-500"
              >
                {title}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </a>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative bg-neutral-500"
      style={{ width: lineWidth, height: 2 }}
    />
  );
};

export default function SideStaggerNavigation() {
  const [isHovered, setIsHovered] = useState(false);
  const mouseY = useMotionValue(Infinity);

  return (
    <motion.nav
      onMouseMove={(e) => {
        mouseY.set(e.clientY);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        mouseY.set(Infinity);
        setIsHovered(false);
      }}
      className="fixed right-0 top-0 z-10 flex h-screen flex-col items-end justify-between py-4 pl-8"
    >
      {Array.from(Array(NUM_LINES).keys()).map((i) => {
        const linkContent = navItems.find((item) => item.position === i + 1);
        return (
          <LinkLine
            title={linkContent?.title}
            href={linkContent?.href}
            isHovered={isHovered}
            mouseY={mouseY}
            key={i}
          />
        );
      })}
    </motion.nav>
  );
}