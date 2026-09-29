import { Metadata } from "next";

import Experience from "@/whats-inside/Experience";

export const metadata: Metadata = {
  title: "What's Inside | Brewy Guilt Free Cola",
  description:
    "Turn the bottle around: zero sugar, 16 kcal per 100 ml, no caffeine, no aspartame and 4g+ of plant-based prebiotic fiber. Every ingredient, explained.",
  openGraph: {
    title: "What's Inside | Brewy Guilt Free Cola",
  },
};

export default function WhatsInsidePage() {
  return <Experience />;
}
