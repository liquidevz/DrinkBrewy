"use client";

import clsx from "clsx";
import {
  CandyOff,
  ClipboardList,
  Feather,
  FlaskConicalOff,
  ScrollText,
  Sprout,
  Wheat,
  ZapOff,
} from "lucide-react";

import { StopIcon, tour } from "../content";

const ICONS: Record<StopIcon, typeof CandyOff> = {
  sugar: CandyOff,
  calories: Feather,
  caffeine: ZapOff,
  prebiotics: Sprout,
  fiber: Wheat,
  aspartame: FlaskConicalOff,
  nutrition: ClipboardList,
  ingredients: ScrollText,
};

type Props = {
  active: number | null;
  visible: boolean;
  onSelect: (index: number) => void;
};

/** Jump straight to any stop of the label tour. */
export default function IconRail({ active, visible, onSelect }: Props) {
  return (
    <nav
      aria-label="Label tour"
      className={clsx(
        "absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-1.5 transition-opacity duration-500 md:bottom-auto md:left-auto md:right-14 md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:flex-col md:gap-3",
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {tour.map((stop, i) => {
        const Icon = ICONS[stop.icon];
        const isActive = i === active;
        return (
          <button
            key={stop.title}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={stop.title}
            aria-current={isActive ? "step" : undefined}
            title={stop.title}
            tabIndex={visible ? 0 : -1}
            className={clsx(
              "grid size-9 place-items-center rounded-full border transition-all duration-300 md:size-11",
              isActive
                ? "scale-110 border-cream bg-cream text-brewy shadow-[0_0_24px_rgba(255,248,221,0.45)]"
                : "border-cream/20 bg-cola/40 text-cream/60 backdrop-blur hover:border-cream/60 hover:text-cream",
            )}
          >
            <Icon size={17} strokeWidth={2.2} />
          </button>
        );
      })}
    </nav>
  );
}
