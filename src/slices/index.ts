import dynamic from "next/dynamic";

const AlternatingText = dynamic(() => import("./AlternatingText"));
const BigText = dynamic(() => import("./BigText"));
const Carousel = dynamic(() => import("./Carousel"));
const ProductGrid = dynamic(() => import("./ProductGrid"));
const Hero = dynamic(() => import("./Hero"));
const SkyDive = dynamic(() => import("./SkyDive"));

export const components = {
  alternating_text: AlternatingText,
  big_text: BigText,
  carousel: Carousel,
  product_grid: ProductGrid,
  hero: Hero,
  skydive: SkyDive,
};

export { AlternatingText, BigText, Carousel, ProductGrid, Hero, SkyDive };
