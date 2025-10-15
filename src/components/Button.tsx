import Link from "next/link";
import clsx from "clsx";

type Props = {
  buttonLink: string;
  buttonText: string;
  className?: string;
};

export default function Button({ buttonLink, buttonText, className }: Props) {
  return (
    <Link
      href={buttonLink}
      className={clsx(
        "rounded-xl bg-red-600 px-5 py-4 text-center text-xl font-bold uppercase tracking-wide text-cream transition-colors duration-150 hover:bg-red-700 md:text-2xl",
        className,
      )}
    >
      {buttonText}
    </Link>
  );
}
