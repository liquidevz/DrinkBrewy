import { BigTextSlice } from "@/data/content";

/**
 * Props for `BigText`.
 */
export type BigTextProps = {
  slice: BigTextSlice;
};

/**
 * Component for "BigText" Slices.
 */
const BigText = ({ slice }: BigTextProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.type}
      data-slice-variation="default"
      className="min-h-screen w-screen overflow-hidden bg-cream text-red-600"
    >
      <h2 className="grid w-full gap-[3vw] py-4 md:py-10 text-center font-black uppercase leading-[.7]">
        <div className="text-[34vw]">Soda</div>
        <div className="grid gap-[3vw] text-[34vw] md:flex md:text-[11vw]">
          <span className="inline-block">that </span>
          <span className="inline-block max-md:text-[27vw]">makes </span>
          <span className="inline-block max-md:text-[40vw]">you </span>
        </div>
        <div className="text-[32vw]">Smile</div>
      </h2>
    </section>
  );
};

export default BigText;
