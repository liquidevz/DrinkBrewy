import React from "react";
import { BrewyFooter } from "./BrewyFooter";
import CircleText from "./CircleText";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="bg-[#C41E3A] text-white">
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        <BrewyFooter />
        <div className="absolute right-24 top-0 size-28 origin-center -translate-y-14 md:size-48 md:-translate-y-28">
          <CircleText />
        </div>
      </div>
    </footer>
  );
}
