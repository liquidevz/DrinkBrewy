import dynamic from "next/dynamic";

import Footer from "@/components/Footer";

// The homepage's sections each render their bottle into this one shared
// canvas through drei <View>s. Other routes run their own canvas instead, so
// it lives here rather than in the root layout.
const ViewCanvas = dynamic(() => import("@/components/ViewCanvas"), {
  ssr: false,
});

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The What's Inside page loops back to its top instead of ending on a
  // footer, so the footer lives here rather than in the root layout.
  return (
    <>
      <main>
        {children}
        <ViewCanvas />
      </main>
      <Footer />
    </>
  );
}
