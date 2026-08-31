"use client";

import { Home, Sparkles, Tv } from "lucide-react";
import Link from "next/link";

const FloatingBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-[#C41E3A]/30 shadow-lg z-[9998] md:hidden">
      <div className="flex justify-around items-center py-3 px-4">
        <NavLink text="Home" Icon={Home} href="/#home" />
        <NavLink text="About" Icon={Sparkles} href="/#care" />
        <NavLink text="Flavors" Icon={Sparkles} href="/#flavors" />
        <NavLink text="Brewy TV" Icon={Tv} href="/#community" />
      </div>
    </nav>
  );
};

const NavLink = ({ text, Icon, href }: { text: string; Icon: any; href: string }) => {
  return (
    <Link
      href={href}
      className="text-sm w-14 hover:text-[#C41E3A] transition-colors flex flex-col gap-1 items-center text-[#C41E3A]/80"
    >
      <Icon size={18} />
      <span className="text-xs">{text}</span>
    </Link>
  );
};

export default FloatingBottomNav;
