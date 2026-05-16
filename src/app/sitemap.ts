import { MetadataRoute } from "next";
import { artists } from "@/data/artists";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://servusglobal.com";
  const langs = ["en", "pt", "es", "ja"];
  const routes: MetadataRoute.Sitemap = [];

  for (const lang of langs) {
    routes.push({ url: `${base}/${lang}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
    // Note: releases section is within the landing page for now
    
    for (const a of artists) {
      routes.push({
        url: `${base}/${lang}/artists/${a.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return routes;
}
