"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { motion, Variants } from "framer-motion";

import { BrewyFooter } from "@/components/BrewyFooter";
import ScrollProgress from "@/components/ScrollProgress";

// `scrollTo`: an id on the What's Inside page to glide to.
const LINKS: { text: string; href: string; scrollTo?: string }[] = [
  { text: "What's Inside", href: "/whats-inside" },
  { text: "FAQ", href: "/whats-inside#faq", scrollTo: "faq" },
  { text: "Home", href: "/" },
  { text: "About", href: "/#care" },
];

// The panel unrolls from its top edge, then the items drop in one by one;
// closing plays it in reverse.
const panelVariants: Variants = {
  open: {
    scaleY: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { when: "beforeChildren" } },
  closed: { opacity: 0, y: -15, transition: { when: "afterChildren" } },
};

const CONTACT_HREF = "mailto:contact@drinkbrewy.com";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (e: React.MouseEvent, link: (typeof LINKS)[number]) => {
    setOpen(false);
    // Already on the page: glide there instead of navigating.
    if (link.scrollTo && pathname === "/whats-inside") {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent("brewy:scroll-to", { detail: link.scrollTo }),
      );
    } else if (link.scrollTo) {
      e.preventDefault();
      router.push(link.href);
    }
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] text-cream">
      {/* Keeps the chrome legible over bright 3D frames without a hard bar. */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cola/70 to-transparent" />

      <ScrollProgress />

      <div className="relative mx-4 mt-5 flex h-12 items-center justify-between md:mx-10">
        <Link
          href="/"
          aria-label="Brewy home"
          className="pointer-events-auto md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
        >
          {/* The footer wordmark, cropped tight to its letters. */}
          <BrewyFooter
            viewBox="30 144 311 99"
            width={311}
            height={99}
            className="h-9 w-auto text-cream md:h-11"
          />
        </Link>

        <div
          ref={wrapRef}
          className="pointer-events-auto relative ml-auto flex items-center gap-5"
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-wide"
          >
            <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
              <span className="size-[3px] bg-cream" />
              <span className="size-[3px] bg-cream" />
              <span className="size-[3px] bg-cream" />
              <span className="size-[3px] bg-cream" />
            </span>
            Menu
          </button>

          <a
            href={CONTACT_HREF}
            className="rounded-md bg-cream px-4 py-2.5 text-xs font-medium text-cola shadow-[0_0_24px_rgba(255,248,221,0.35)] transition-transform hover:scale-105"
          >
            Contact
          </a>

          <motion.nav
            id="site-menu"
            aria-label="Main"
            aria-hidden={!open}
            initial="closed"
            animate={open ? "open" : "closed"}
            variants={panelVariants}
            style={{ originY: "top" }}
            className={clsx(
              "absolute right-0 top-full mt-4 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-cream/15 bg-gradient-to-br from-cola/70 to-brewy-deep/30 px-6 py-2 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl",
              !open && "pointer-events-none",
            )}
          >
            {LINKS.map((link, i) => {
              const active = link.href === pathname;
              return (
                <motion.div key={link.text} variants={itemVariants}>
                  <Link
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                    onClick={(e) => go(e, link)}
                    className={clsx(
                      "block py-5 text-[1.7rem] font-light uppercase leading-none tracking-tight transition-colors hover:text-cream",
                      i > 0 && "border-t border-cream/15",
                      active || (i === 0 && pathname !== "/whats-inside")
                        ? "text-cream"
                        : "text-cream/70",
                    )}
                  >
                    {link.text}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>
        </div>
      </div>
    </header>
  );
}
