"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

import { faq } from "../content";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby={`${baseId}-heading`}
      // Transparent: it sits on the 3D grey studio, which carries on behind it.
      className="relative z-20 px-6 pb-32 pt-24 md:px-14 md:pb-40"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id={`${baseId}-heading`}
          className="text-6xl font-black uppercase leading-[0.85] md:text-8xl xl:text-9xl"
        >
          Got
          <br />
          questions?
        </h2>

        {/* Heading across the top, questions below and offset right. */}
        <ul className="mt-10 border-t border-cream/15 md:ml-[30%] md:mt-14 md:max-w-2xl">
          {faq.map((entry, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            return (
              <li key={entry.question} className="border-b border-cream/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-4 text-left text-base text-cream/90 transition-colors hover:text-cream md:text-lg"
                  >
                    {entry.question}
                    <ChevronDown
                      size={18}
                      className={clsx("shrink-0 text-cream/50 transition-transform duration-300", isOpen && "rotate-180")}
                    />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-10 text-cream/65">{entry.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
