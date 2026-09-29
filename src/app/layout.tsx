import localFont from "next/font/local";

import "./app.css";

import FrameBreaker from "@/components/FrameBreaker";
import SiteHeader from "@/components/SiteHeader";
import ViewfinderFrame from "@/components/ViewfinderFrame";

const alpino = localFont({
  src: "../../public/fonts/Alpino-Variable.woff2",
  display: "swap",
  weight: "100 900",
  variable: "--font-alpino",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={alpino.variable}>
      <head>
        <base target="_top" />
      </head>
      <body className="overflow-x-hidden">
        <FrameBreaker />
        <SiteHeader />
        <ViewfinderFrame />

        {children}

      </body>
    </html>
  );
}
