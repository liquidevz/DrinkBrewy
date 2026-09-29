import dynamic from "next/dynamic";

const AlternatingText = dynamic(() => import("./AlternatingText"));
const BigText = dynamic(() => import("./BigText"));
const Hero = dynamic(() => import("./Hero"));
const SkyDive = dynamic(() => import("./SkyDive"));

export const components = {
  alternating_text: AlternatingText,
  big_text: BigText,
  hero: Hero,
  skydive: SkyDive,
};

export { AlternatingText, BigText, Hero, SkyDive };
