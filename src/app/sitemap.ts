import { MetadataRoute } from "next";
import { artists } from "@/data/artists";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://servusglobal.com";
  const artistRoutes = artists.map((a) => ({
    url: `${base}/artists/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/releases`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...artistRoutes,
  ];
}
