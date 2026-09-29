import Link from "next/link";
import clsx from "clsx";

type Props = {
  buttonLink: string;
  buttonText: string;
  className?: string;
  target?: string;
};

export default function Button({ buttonLink, buttonText, className, target }: Props) {
  return (
    <Link
      href={buttonLink}
      target={target}
      className={clsx(
        "rounded-xl bg-brewy px-5 py-4 text-center text-xl font-bold uppercase tracking-wide text-cream shadow-[0_0_40px_rgba(196,30,58,0.45)] transition-colors duration-150 hover:bg-brewy-deep md:text-2xl",
        className,
      )}
    >
      {buttonText}
    </Link>
  );
}
