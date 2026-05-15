import { SiteSettings, Milestone } from "@/types";

export const settings: SiteSettings = {
  heroHeadline: "Where artists become legacies.",
  heroHeadlineLines: ["Where artists", "become", "legacies."],
  heroEyebrow: "Est. 2019 · Perth · USA",
  heroLocation: "Now broadcasting",
  heroSubline:
    "Talent management for musicians building long careers. Releases, brand, touring, business.",
  heroVideoUrl:
    "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4",
  heroPosterUrl:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2400&q=80&auto=format&fit=crop",
  stats: [
    { label: "Streams", value: 850, suffix: "M+" },
    { label: "Countries", value: 47 },
    { label: "Artists", value: 24 },
    { label: "Releases", value: 120, suffix: "+" },
  ],
};

export const milestones: Milestone[] = [
  {
    year: "2019",
    title: "Founded",
    description:
      "Started in Perth with two artists on the roster and a long view of the work.",
  },
  {
    year: "2020",
    title: "First Global Release",
    description:
      "First release landed on playlists across 12 countries in week one.",
  },
  {
    year: "2021",
    title: "Expanded to Africa & South America",
    description:
      "Opened partnerships in Lagos, Nairobi and São Paulo. Six new signings.",
  },
  {
    year: "2023",
    title: "100 Million Streams",
    description:
      "Crossed 100 million streams across the roster. No single viral moment, just steady releases.",
  },
  {
    year: "2025",
    title: "The Next Chapter",
    description:
      "24 artists, 47 countries, the next batch already in the studio.",
  },
];
