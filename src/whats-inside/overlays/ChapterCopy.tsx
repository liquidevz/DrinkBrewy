"use client";

import { MutableRefObject, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { Plus, X } from "lucide-react";

import { Carousel, dwellProgress } from "../carousel";
import { Chapter } from "../director";
import {
  hero,
  ingredients,
  nutrition,
  podium,
  statement,
  tour,
  TourStop,
} from "../content";

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  gone: {
    opacity: 0,
    y: -14,
    filter: "blur(6px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

export const chapterKey = (chapter: Chapter) =>
  chapter.kind === "stop" ? `stop-${chapter.index}` : chapter.kind;

/** The copy for whichever chapter the scroll is in. Decorative: the full
 *  text is also in the page's screen-reader summary. */
type Props = {
  chapter: Chapter;
  carousel: MutableRefObject<Carousel>;
  onStep: (direction: number) => void;
};

export default function ChapterCopy({ chapter, carousel, onStep }: Props) {
  return (
    <motion.div
      key={chapterKey(chapter)}
      initial="hidden"
      animate="shown"
      exit="gone"
      transition={{ staggerChildren: 0.06 }}
      className="h-full w-full"
    >
      {chapter.kind === "podium" && (
        <PodiumCopy carousel={carousel} onStep={onStep} />
      )}
      {chapter.kind === "hero" && <HeroCopy />}
      {chapter.kind === "stop" && (
        <StopCopy stop={tour[chapter.index]} index={chapter.index} />
      )}
      {chapter.kind === "statement" && (
        <Caption text={statement.caption} center />
      )}
    </motion.div>
  );
}

function PodiumCopy({
  carousel,
  onStep,
}: {
  carousel: MutableRefObject<Carousel>;
  onStep: (direction: number) => void;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);

  // The bar fills while a bottle holds the centre, then the row moves on.
  useEffect(() => {
    let frame = requestAnimationFrame(function tick() {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${dwellProgress(carousel.current)})`;
      }
      // Keep the arrows in the gaps beside the centre bottle.
      const offset = `${carousel.current.gap * 100}vw`;
      if (leftRef.current) leftRef.current.style.left = `calc(50% - ${offset})`;
      if (rightRef.current)
        rightRef.current.style.left = `calc(50% + ${offset})`;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [carousel]);

  const arrow =
    "pointer-events-auto absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center text-cream/70 transition-all hover:scale-110 hover:text-cream";

  return (
    <>
      {/* Step the carousel by hand. They sit in the gaps between bottles. */}
      <button
        ref={leftRef}
        type="button"
        onClick={() => onStep(-1)}
        aria-label="Previous bottle"
        className={arrow}
        style={{ left: "25%" }}
      >
        <DotChevron />
      </button>
      <button
        ref={rightRef}
        type="button"
        onClick={() => onStep(1)}
        aria-label="Next bottle"
        className={arrow}
        style={{ left: "75%" }}
      >
        <DotChevron flip />
      </button>

      <div className="absolute inset-x-0 bottom-24 flex flex-col items-center text-center md:bottom-4">
        <motion.div
          variants={item}
          className="relative h-px w-44 bg-cream/15 md:w-60"
        >
          <span
            ref={fillRef}
            className="absolute inset-0 origin-left bg-gradient-to-r from-brewy-deep via-brewy to-brewy-glow"
            style={{ transform: "scaleX(0)" }}
          />
        </motion.div>
        <motion.p
          variants={item}
          className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-cream/50"
        >
          {podium.hint}
        </motion.p>
      </div>
    </>
  );
}

function HeroCopy() {
  return (
    <div className="mx-auto flex h-full max-w-7xl items-end px-6 pb-44 md:items-center md:px-14 md:pb-0">
      <div className="w-full max-w-md md:max-w-sm lg:max-w-md">
        <motion.p
          variants={item}
          className="text-[2.75rem] font-black uppercase leading-[0.85] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {hero.title}
        </motion.p>
        <motion.p
          variants={item}
          className="mt-5 text-base text-cream/70 md:text-lg"
        >
          {hero.body}
        </motion.p>
      </div>
    </div>
  );
}

/** A chevron drawn in dots. */
function DotChevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="18"
      height="26"
      viewBox="0 0 18 26"
      fill="currentColor"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {[
        [13, 2],
        [9, 7],
        [5, 13],
        [9, 19],
        [13, 24],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
      ))}
      {[
        [16, 6],
        [12, 10],
        [16, 20],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" opacity="0.6" />
      ))}
    </svg>
  );
}

function StopCopy({ stop, index }: { stop: TourStop; index: number }) {
  const isOut = stop.tag_type === "out";
  return (
    <div className="mx-auto flex h-full max-w-7xl items-end px-6 pb-44 md:items-center md:px-14 md:pb-0">
      <div className="w-full max-w-md md:max-w-sm lg:max-w-md">
        <motion.div
          variants={item}
          className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <span className="grid size-6 place-items-center rounded-md bg-brewy text-cream">
            {isOut ? (
              <X size={14} strokeWidth={3} />
            ) : (
              <Plus size={14} strokeWidth={3} />
            )}
          </span>
          <span
            className={clsx(
              "rounded-md bg-cream px-2 py-1 text-brewy-deep",
              isOut && "line-through decoration-brewy decoration-2",
            )}
          >
            {stop.tag}
          </span>
        </motion.div>
        <motion.p
          variants={item}
          className="mb-2 text-sm font-bold tabular-nums tracking-[0.2em] text-cream/40"
        >
          {pad(index + 1)} / {pad(tour.length)}
        </motion.p>
        <motion.p
          variants={item}
          className="text-[2.75rem] font-black uppercase leading-[0.85] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {stop.title}
        </motion.p>
        <motion.p
          variants={item}
          className="mt-5 text-base text-cream/70 md:text-lg"
        >
          {stop.body}
        </motion.p>
        {stop.panel === "nutrition" && <NutritionPanel />}
        {stop.panel === "ingredients" && <IngredientsPanel />}
      </div>
    </div>
  );
}

function NutritionPanel() {
  return (
    <motion.dl
      variants={item}
      className="mt-6 grid grid-cols-2 gap-x-6 rounded-xl border border-cream/15 bg-cola/60 px-4 py-3 text-sm backdrop-blur"
    >
      {nutrition.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between border-b border-cream/10 py-1.5 last:border-0 [&:nth-last-child(2)]:border-0"
        >
          <dt className="text-cream/60">{label}</dt>
          <dd className="font-bold tabular-nums">{value}</dd>
        </div>
      ))}
    </motion.dl>
  );
}

function IngredientsPanel() {
  return (
    <motion.ul
      variants={item}
      className="mt-6 max-h-[38vh] space-y-1.5 overflow-hidden rounded-xl border border-cream/15 bg-cola/60 px-4 py-3 text-sm backdrop-blur"
    >
      {ingredients.map(([name, plain]) => (
        <li key={name} className="flex justify-between gap-4">
          <span className="text-cream/60">{name}</span>
          <span className="text-right font-bold">{plain}</span>
        </li>
      ))}
    </motion.ul>
  );
}

function Caption({ text, center }: { text: string; center?: boolean }) {
  return (
    <div
      className={clsx(
        "absolute bottom-24 px-6 md:bottom-14 md:px-14",
        center ? "inset-x-0 text-center" : "left-0",
      )}
    >
      <motion.p
        variants={item}
        className="text-xs font-bold uppercase tracking-[0.25em] text-cream/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
      >
        {text}
      </motion.p>
    </div>
  );
}
