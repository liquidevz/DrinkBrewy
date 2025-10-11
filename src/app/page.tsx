import { Metadata } from "next";
import { homePageData } from "@/data/content";
import { Hero, AlternatingText, Carousel, BigText, SkyDive } from "@/slices";
import BrewyTV from "@/components/BrewyTV";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: homePageData.meta_title,
    description: homePageData.meta_description,
    openGraph: {
      title: homePageData.meta_title,
    },
  };
}

export default function Index() {
  const slicesBeforeBigText = homePageData.slices.filter((slice) => slice.type !== 'big_text');
  const bigTextSlices = homePageData.slices.filter((slice) => slice.type === 'big_text');

  return (
    <>
      {slicesBeforeBigText.map((slice, index) => {
        switch (slice.type) {
          case "hero":
            return <Hero key={index} slice={slice} />;
          case "alternating_text":
            return <AlternatingText key={index} slice={slice} />;
          case "carousel":
            return <Carousel key={index} slice={slice} />;
          case "skydive":
            return <SkyDive key={index} slice={slice} />;
          default:
            return null;
        }
      })}
      <BrewyTV />
      {bigTextSlices.map((slice, index) => {
        if (slice.type === "big_text") {
          return <BigText key={index} slice={slice} />;
        }
        return null;
      })}
    </>
  );
}
