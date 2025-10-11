"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Total number of lines on the side of the page
const NUM_LINES = 30;
// Position key will place the title on the Nth
// line of the sidebar
const navItems = [
  { position: 3, title: "Home", href: "#" },
  { position: 8, title: "Flavors", href: "#flavors" },
  { position: 15, title: "About", href: "#about" },
  { position: 22, title: "Contact", href: "#contact" },
];

const SideStaggerNavigation = () => {
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
      className="fixed right-0 top-0 z-50 flex h-screen flex-col items-end justify-between py-4 pl-8 pr-4"
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
};

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

  // Styles for non-link lines
  const lineWidthRaw = useTransform(distance, [-80, 0, 80], [15, 100, 15]);
  const lineWidth = useSpring(lineWidthRaw, SPRING_OPTIONS);

  // Styles for link lines
  const linkWidth = useSpring(25, SPRING_OPTIONS);

  useEffect(() => {
    if (isHovered) {
      linkWidth.set(150);
    } else {
      linkWidth.set(25);
    }
  }, [isHovered, linkWidth]);

  if (title && href) {
    return (
      <a href={href} className="block">
        <motion.div
          ref={ref}
          className="group relative bg-white/60 transition-colors hover:bg-orange-400"
          style={{ width: linkWidth, height: 2 }}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-0 z-10 w-full pt-2 text-right font-bold uppercase text-white transition-colors group-hover:text-orange-400"
              >
                {title}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </a>
    );
  } else {
    return (
      <motion.div
        ref={ref}
        className="relative bg-white/40"
        style={{ width: lineWidth, height: 2 }}
      />
    );
  }
};

export default SideStaggerNavigation;
