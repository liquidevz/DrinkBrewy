import localFont from "next/font/local";

import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";

import "./app.css";
import Header from "@/components/Header";
import ViewCanvas from "@/components/ViewCanvas";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

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
  // Check if coming soon mode is enabled
  const isComingSoonMode = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  return (
    <html lang="en" className={alpino.variable}>
      <body className="overflow-x-hidden bg-yellow-300">
        {isComingSoonMode ? (
          <ComingSoon />
        ) : (
          <>
            <Header />
            <main>
              {children}
              <ViewCanvas />
            </main>
            <Footer />
          </>
        )}
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
