import localFont from "next/font/local";
import dynamic from "next/dynamic";

import "./app.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButton from "@/components/FloatingButton";
import SideStaggerNavigation from "@/components/SideStaggerNavigation";

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
      <body className="overflow-x-hidden bg-cream">
        <Header />
        <main>
          {children}
          <ViewCanvas />
        </main>
        <Footer />
        <FloatingButton />
        <SideStaggerNavigation />
      </body>
    </html>
  );
}
