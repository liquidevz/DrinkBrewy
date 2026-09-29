"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { BrewyFooter } from "@/components/BrewyFooter";
import ScrollProgress from "@/components/ScrollProgress";

const LINKS = [
  { text: "Home", href: "/" },
  { text: "What's Inside", href: "/whats-inside" },
  { text: "About", href: "/#care" },
];

const CONTACT_HREF = "mailto:contact@drinkbrewy.com";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] text-cream">
      {/* Keeps the chrome legible over bright 3D frames without a hard bar. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cola/70 to-transparent" />

      <ScrollProgress />

      <div className="relative mx-4 mt-5 flex h-12 items-center justify-between md:mx-10">
        <nav
          aria-label="Main"
          className="pointer-events-auto hidden items-center gap-6 md:flex"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-xs font-bold uppercase tracking-[0.18em] transition-colors",
                pathname === link.href
                  ? "text-cream"
                  : "text-cream/55 hover:text-cream",
              )}
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          className="pointer-events-auto flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] md:hidden"
        >
          <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
            <span className="size-[3px] bg-cream" />
            <span className="size-[3px] bg-cream" />
            <span className="size-[3px] bg-cream" />
            <span className="size-[3px] bg-cream" />
          </span>
          Menu
        </button>

        <Link
          href="/"
          aria-label="Brewy home"
          className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          {/* The footer wordmark, cropped tight to its letters. */}
          <BrewyFooter
            viewBox="30 144 311 99"
            width={311}
            height={99}
            className="h-9 w-auto text-cream md:h-11"
          />
        </Link>

        <a
          href={CONTACT_HREF}
          className="pointer-events-auto rounded-md bg-cream px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-cola shadow-[0_0_24px_rgba(255,248,221,0.25)] transition-transform hover:scale-105"
        >
          Contact
        </a>
      </div>

      {menuOpen && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="pointer-events-auto relative mx-4 mt-3 flex flex-col gap-1 rounded-xl border border-cream/10 bg-cola-800/95 p-2 backdrop-blur md:hidden"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-bold uppercase tracking-[0.14em] text-cream/80 hover:bg-cream/5 hover:text-cream"
            >
              {link.text}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
