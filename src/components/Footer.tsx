import React from "react";
import Link from "next/link";
import { BrewyFooter } from "./BrewyFooter";
import CircleText from "./CircleText";

export default function Footer() {
  return (
    <footer className="relative z-[45] border-t border-cream/10 bg-cola-800 pb-24 text-cream md:pb-0">
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        <BrewyFooter className="text-brewy" />
        <div className="absolute right-6 top-0 size-28 origin-center -translate-y-14 md:right-24 md:size-48 md:-translate-y-28">
          <CircleText />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 pb-10 text-xs uppercase tracking-[0.18em] text-cream/50 md:flex-row md:justify-between">
        <nav aria-label="Footer" className="flex gap-6">
          <Link href="/" className="hover:text-cream">Home</Link>
          <Link href="/whats-inside" className="hover:text-cream">What&apos;s Inside</Link>
          <a href="mailto:contact@drinkbrewy.com" className="hover:text-cream">
            contact@drinkbrewy.com
          </a>
        </nav>
        <p>Proudly made in India · Brewy Naturals LLP</p>
      </div>
    </footer>
  );
}
