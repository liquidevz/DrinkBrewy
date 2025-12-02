import { Metadata } from "next";
import { homePageData } from "@/data/content";
import { Hero, AlternatingText, ProductGrid, BigText, SkyDive, Carousel } from "@/slices";
import TVPlayer from "@/components/TVPlayer";

export const dynamic = 'force-dynamic';

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
            return <div key={index} id="home"><Hero slice={slice} /></div>;
          case "alternating_text":
            return <div key={index} id="care"><AlternatingText slice={slice} /></div>;
          case "carousel":
            return <div key={index} id="flavors"><Carousel heading={slice.heading} priceCopy={slice.price_copy} /></div>;
          case "skydive":
            return <SkyDive key={index} slice={slice} />;
          default:
            return null;
        }
      })}
      <div id="community" className="bg-gradient-to-b from-[#C41E3A] to-[#A3182F] py-12 md:py-20">
        <TVPlayer />
      </div>
      {bigTextSlices.map((slice, index) => {
        if (slice.type === "big_text") {
          return <BigText key={index} slice={slice} />;
        }
        return null;
      })}
    </>
  );
}
