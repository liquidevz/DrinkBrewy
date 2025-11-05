import localFont from "next/font/local";
import dynamic from "next/dynamic";

import "./app.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


import CartInitializer from "@/components/CartInitializer";
import FloatingBottomNav from "@/components/FloatingBottomNav";

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
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="overflow-x-hidden bg-cream">
        <CartInitializer />
        <Header />
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
