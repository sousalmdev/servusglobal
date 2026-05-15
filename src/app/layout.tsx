import type { Metadata } from "next";
import { Syne, Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LenisProvider } from "@/providers/LenisProvider";
import { ReducedMotionProvider } from "@/providers/ReducedMotionProvider";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Servus Global · Artist & Talent Management",
    template: "%s | Servus Global",
  },
  description:
    "Artist and talent management. Rooted in Perth and the US, working with artists worldwide.",
  metadataBase: new URL("https://servusglobal.com"),
  openGraph: {
    title: "Servus Global · Artist & Talent Management",
    description:
      "Artist and talent management. Rooted in Perth and the US, working with artists worldwide.",
    siteName: "Servus Global",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Servus Global",
    description:
      "Artist and talent management. Rooted in Perth and the US, working with artists worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${playfair.variable}`}>
      <body className={`min-h-full uppercase grain-overlay`}>
        <ReducedMotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </ReducedMotionProvider>
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
