// app/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "Something awesome is on the way. Stay tuned!",
  openGraph: {
    title: "Coming Soon",
    description: "Something awesome is on the way. Stay tuned!",
    images: [
      {
        url: "/coming-soon-og.jpg", // optional: put this image in /public/
        width: 1200,
        height: 630,
        alt: "Coming Soon",
      },
    ],
  },
};

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        color: "#333",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀 Coming Soon</h1>
      <p style={{ fontSize: "1.25rem", maxWidth: "600px" }}>
        We&apos;re working hard on something amazing. Check back soon!
      </p>
    </main>
  );
}
