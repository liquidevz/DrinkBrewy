"use client";

import { ShoppingCart, Home } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const FloatingBottomNav = () => {
  const { cart, setCartOpen } = useCart();
  const itemCount = cart?.totalQuantity || 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur border-t border-[#C41E3A]/30 shadow-lg z-[9998] md:hidden">
      <div className="flex justify-around items-center py-3 px-4">
        <NavLink text="Home" Icon={Home} href="/" />
        <NavLink text="About" Icon={Home} href="/#care" />
        <NavLink text="Cola" Icon={ShoppingCart} href="/products/blackCherry" />
        <button
          onClick={() => setCartOpen(true)}
          className="text-sm w-12 hover:text-[#C41E3A] transition-colors flex flex-col gap-1 items-center relative"
        >
          <ShoppingCart size={16} />
          <span className="text-xs">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C41E3A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ text, Icon, href }) => {
  return (
    <Link
      href={href}
      className="text-sm w-12 hover:text-[#C41E3A] transition-colors flex flex-col gap-1 items-center text-[#C41E3A]/80"
    >
      <Icon />
      <span className="text-xs">{text}</span>
    </Link>
  );
};



export default FloatingBottomNav;

