import React from "react";
import { BrewyLogo } from "@/components/BrewyLogo";

type Props = {};

export default function Header({}: Props) {
  return (
    <header className="-mb-28 flex justify-center py-4">
      <BrewyLogo className="z-10 h-20 cursor-pointer text-sky-800" />
    </header>
  );
}
