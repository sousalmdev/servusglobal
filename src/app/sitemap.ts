import { MetadataRoute } from "next";
import { artists } from "@/data/artists";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://servusglobalinc.com";
  const langs = ["en", "pt", "es", "ja"];
  const routes: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    routes.push({
      url: `${base}/${lang}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: `${base}/en`,
          pt: `${base}/pt`,
          es: `${base}/es`,
          ja: `${base}/ja`,
        },
      },
    });
    
    for (const a of artists) {
      routes.push({
        url: `${base}/${lang}/artists/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            en: `${base}/en/artists/${a.slug}`,
            pt: `${base}/pt/artists/${a.slug}`,
            es: `${base}/es/artists/${a.slug}`,
            ja: `${base}/ja/artists/${a.slug}`,
          },
        },
      });
    }
  }

  return routes;
}
