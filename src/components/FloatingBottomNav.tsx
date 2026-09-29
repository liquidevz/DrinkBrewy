"use client";

import { Home, ScanSearch, Sparkles } from "lucide-react";
import Link from "next/link";

const FloatingBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9998] border-t border-cream/10 bg-cola/90 shadow-lg backdrop-blur md:hidden">
      <div className="flex items-center justify-around px-4 py-3">
        <NavLink text="Home" Icon={Home} href="/" />
        <NavLink text="Inside" Icon={ScanSearch} href="/whats-inside" />
        <NavLink text="About" Icon={Sparkles} href="/#care" />
      </div>
    </nav>
  );
};

const NavLink = ({ text, Icon, href }: { text: string; Icon: typeof Home; href: string }) => {
  return (
    <Link
      href={href}
      className="flex w-14 flex-col items-center gap-1 text-sm text-cream/70 transition-colors hover:text-cream"
    >
      <Icon size={18} />
      <span className="text-xs">{text}</span>
    </Link>
  );
};

export default FloatingBottomNav;
