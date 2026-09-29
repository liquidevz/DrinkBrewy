"use client";

import { Bottle, BottleProps, LABEL_TEXTURE } from "@/components/bottle/Bottle";

export { LABEL_TEXTURE, getLabelPoint } from "@/components/bottle/Bottle";
export { LABEL_FRONT_U } from "@/components/bottle/geometry";
export {
  createLabelSpotlight,
  type LabelSpotlight,
} from "@/components/bottle/spotlight";

// One label today; each flavour gets its own artwork here as they launch.
const flavorTextures = {
  lemonLime: LABEL_TEXTURE,
  grape: LABEL_TEXTURE,
  blackCherry: LABEL_TEXTURE,
  strawberryLemonade: LABEL_TEXTURE,
  watermelon: LABEL_TEXTURE,
};

export type SodaCanProps = Omit<BottleProps, "label"> & {
  flavor?: keyof typeof flavorTextures;
};

/** The Brewy bottle, as used by every homepage scene. */
export function SodaCan({ flavor = "blackCherry", ...props }: SodaCanProps) {
  return <Bottle label={flavorTextures[flavor]} {...props} />;
}
