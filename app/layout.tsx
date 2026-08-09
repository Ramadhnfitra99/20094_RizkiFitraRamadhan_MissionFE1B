import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);

  return {
    metadataBase: baseUrl,
    title: {
      default: "Chill - Temukan Tontonan Favoritmu",
      template: "%s | Chill",
    },
    description:
      "Website streaming film dan serial dengan halaman login, registrasi, dan katalog responsif.",
    icons: { icon: "/assets/img/Logo.png" },
    openGraph: {
      title: "Chill - Temukan Tontonan Favoritmu",
      description: "Jelajahi film, episode terbaru, dan series Premium persembahan Chill.",
      type: "website",
      images: [{ url: "/og-series-v2.png", width: 1536, height: 1024, alt: "Chill - Film dan Series, Tanpa Jeda" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Chill - Temukan Tontonan Favoritmu",
      description: "Jelajahi film, episode terbaru, dan series Premium persembahan Chill.",
      images: ["/og-series-v2.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
