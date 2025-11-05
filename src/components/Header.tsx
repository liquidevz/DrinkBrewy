"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimate, motion } from "framer-motion";

import { ShoppingCart, Menu, ArrowUpRight } from "lucide-react";
import useMeasure from "react-use-measure";
import Link from "next/link";
import { BrewyLogo } from "@/components/BrewyLogo";
import { useCart } from "@/hooks/useCart";
import Cart from "@/components/Cart";

export default function Header() {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, isCartOpen, setCartOpen } = useCart();
  const itemCount = cart?.totalQuantity || 0;

  const [scope, animate] = useAnimate();
  const navRef = useRef(null);

  const handleMouseMove = ({ offsetX, offsetY, target }) => {
    const isNavElement = [...target.classList].includes("glass-nav");

    if (isNavElement) {
      setHovered(true);
      const top = offsetY + "px";
      const left = offsetX + "px";
      animate(scope.current, { top, left }, { duration: 0 });
    } else {
      setHovered(false);
    }
  };

  useEffect(() => {
    navRef.current?.addEventListener("mousemove", handleMouseMove);
    return () => navRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: hovered ? "none" : "auto" }}
        className="glass-nav sticky top-0 z-[9999] mx-auto max-w-6xl overflow-hidden border-[1px] border-cream/30 bg-gradient-to-br from-cream/40 to-cream/20 backdrop-blur md:left-6 md:right-6 md:top-6 md:rounded-2xl hidden md:block"
      >
        <div className="glass-nav flex items-center justify-between px-5 py-5">
          <Cursor hovered={hovered} scope={scope} />
          <Links />
          <Logo />
          <Buttons setMenuOpen={setMenuOpen} itemCount={itemCount} setCartOpen={setCartOpen} />
        </div>
        <MobileMenu menuOpen={menuOpen} />
      </nav>
      {isCartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
}

const Cursor = ({ hovered, scope }) => (
  <motion.span
    initial={false}
    animate={{
      opacity: hovered ? 1 : 0,
      transform: `scale(${hovered ? 1 : 0}) translateX(-50%) translateY(-50%)`,
    }}
    transition={{ duration: 0.15 }}
    ref={scope}
    className="pointer-events-none absolute z-0 grid h-[50px] w-[50px] origin-[0px_0px] place-content-center rounded-full bg-gradient-to-br from-[#C41E3A] from-40% to-red-400 text-2xl"
  >
    <ArrowUpRight className="text-white" />
  </motion.span>
);

const Logo = () => (
  <Link href="/" className="pointer-events-auto relative left-0 top-[50%] z-10 md:absolute md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%]">
    <BrewyLogo className="h-12 md:h-16 cursor-pointer text-[#C41E3A] mix-blend-overlay" />
  </Link>
);

const Links = () => (
  <div className="hidden items-center gap-2 md:flex">
    <GlassLink text="Home" href="/" />
    <GlassLink text="Cola" href="/products/blackCherry" />
    <GlassLink text="About" href="/#care" />
    <GlassLink text="Community" href="/#community" />
  </div>
);

const GlassLink = ({ text, href }) => (
  <Link
    href={href}
    className="group relative scale-100 overflow-hidden rounded-lg px-4 py-2 transition-transform hover:scale-105 active:scale-95"
  >
    <span className="relative z-10 text-[#C41E3A]/90 transition-colors group-hover:text-[#C41E3A] text-lg font-medium">
      {text}
    </span>
    <span className="absolute inset-0 z-0 bg-gradient-to-br from-cream/30 to-cream/10 opacity-0 transition-opacity group-hover:opacity-100" />
  </Link>
);

const TextLink = ({ text, href }) => (
  <Link href={href} className="text-[#C41E3A]/90 transition-colors hover:text-[#C41E3A] text-lg font-medium">
    {text}
  </Link>
);

const Buttons = ({ setMenuOpen, itemCount, setCartOpen }) => (
  <div className="flex items-center gap-4">
    <button 
      onClick={() => setCartOpen(true)}
      className="relative scale-100 overflow-hidden rounded-lg bg-gradient-to-br from-[#C41E3A] from-40% to-red-400 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
    >
      <ShoppingCart size={20} />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-[#C41E3A] font-bold">
          {itemCount}
        </span>
      )}
    </button>
    <button
      onClick={() => setMenuOpen((pv) => !pv)}
      className="ml-2 block scale-100 text-3xl text-[#C41E3A]/90 transition-all hover:scale-105 hover:text-[#C41E3A] active:scale-95 md:hidden"
    >
      <Menu />
    </button>
  </div>
);

const MobileMenu = ({ menuOpen }) => {
  const [ref, { height }] = useMeasure();
  return (
    <motion.div
      initial={false}
      animate={{ height: menuOpen ? height : "0px" }}
      className="block overflow-hidden md:hidden"
    >
      <div ref={ref} className="flex flex-col gap-4 px-4 pb-4">
        <TextLink text="Home" href="/" />
        <TextLink text="Cola" href="/products/blackCherry" />
        <TextLink text="About" href="/#care" />
        <TextLink text="Community" href="/#community" />
      </div>
    </motion.div>
  );
};