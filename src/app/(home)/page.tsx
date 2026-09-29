import { Metadata } from "next";
import { homePageData } from "@/data/content";
import { Hero, AlternatingText, BigText, SkyDive } from "@/slices";

export const metadata: Metadata = {
  title: homePageData.meta_title,
  description: homePageData.meta_description,
  openGraph: {
    title: homePageData.meta_title,
  },
};

export default function Index() {
  return (
    <>
      {homePageData.slices.map((slice, index) => {
        switch (slice.type) {
          case "hero":
            return <div key={index} id="home"><Hero slice={slice} /></div>;
          case "skydive":
            return <SkyDive key={index} slice={slice} />;
          case "alternating_text":
            return <div key={index} id="care"><AlternatingText slice={slice} /></div>;
          case "big_text":
            return <BigText key={index} slice={slice} />;
          default:
            return null;
        }
      })}
    </>
  );
}
