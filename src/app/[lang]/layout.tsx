import type { Metadata } from "next";
import { Syne, Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LenisProvider } from "@/providers/LenisProvider";
import { ReducedMotionProvider } from "@/providers/ReducedMotionProvider";
import CustomCursor from "@/components/CustomCursor";
import "../globals.css";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  // High-value SEO keywords primarily in English, targeted at global search queries
  const seoKeywords = [
    "Servus Global",
    "music management agency",
    "artist management group",
    "music talent agency",
    "music artist rollout strategy",
    "global music distribution",
    "independent artist representation",
    "music A&R consulting",
    "music licensing and sync",
    "tour management logistics",
    "brand development for musicians",
    "independent music marketing",
    "artists worldwide representation"
  ];

  const title = "Servus Global | Global Music Management & Artist Rollouts";
  const description = "Servus Global is a premium global music management and artist talent agency. Representing elite international musical talent and directing high-impact rollouts.";

  return {
    title: {
      default: title,
      template: "%s | Servus Global",
    },
    description: description,
    keywords: seoKeywords,
    metadataBase: new URL("https://servusglobal.com"),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        pt: "/pt",
        es: "/es",
        ja: "/ja",
      },
    },
    openGraph: {
      title: title,
      description: description,
      siteName: "Servus Global",
      locale: lang === "pt" ? "pt_BR" : lang === "es" ? "es_ES" : lang === "ja" ? "ja_JP" : "en_US",
      type: "website",
      url: `https://servusglobal.com/${lang}`,
      images: [
        {
          url: "/servusabout.png",
          width: 1200,
          height: 630,
          alt: "Servus Global Artist & Talent Management",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/servusabout.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "google-site-verification-placeholder-change-this-in-layout",
    },
    category: "Music Agency & Talent Management",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Servus Global",
      "url": "https://servusglobal.com",
      "logo": "https://servusglobal.com/servuslogo.png",
      "sameAs": [
        "https://instagram.com/servusglobal",
        "https://youtube.com/servusglobal"
      ],
      "description": "Premium artist and talent management agency working with artists worldwide."
    };

    return (
      <html lang={lang} className={`${syne.variable} ${inter.variable} ${playfair.variable}`}>
        <head>
          <link rel="preload" href="/servuslogo.svg" as="fetch" crossOrigin="anonymous" />
          <link rel="preload" href="/servuslogo.png" as="image" />
          <link rel="preload" href="/fleursunset.png" as="image" />
          <link rel="preload" href="/fleur.mp4" as="video" type="video/mp4" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
      <body className={`min-h-full overflow-x-hidden grain-overlay`}>
        <ReducedMotionProvider>
          <LenisProvider>{children}</LenisProvider>
        </ReducedMotionProvider>
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
