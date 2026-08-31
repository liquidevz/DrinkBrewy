import localFont from "next/font/local";
import dynamic from "next/dynamic";

import "./app.css";

import Footer from "@/components/Footer";
import FloatingBottomNav from "@/components/FloatingBottomNav";
import FrameBreaker from "@/components/FrameBreaker";

const ViewCanvas = dynamic(() => import("@/components/ViewCanvas"), {
  ssr: false,
});

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
      <body className="overflow-x-hidden bg-cream">
        <FrameBreaker />

        <main>
          {children}
          <ViewCanvas />
        </main>
        <Footer />
        <FloatingBottomNav />
      </body>
    </html>
  );
}
