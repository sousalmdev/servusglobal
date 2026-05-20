import { Artist } from "@/types";

export const artists: Artist[] = [
  {
    name: "Solis",
    slug: "solis",
    bio: "Perth-based artist working at the seam of hip-hop and R&B. Debut full-length Mood pairs melodic vocal lines with beats that breathe more than they hit.",
    portraitUrl: "/images/roster/solis.png",
    genres: ["Hip-Hop", "R&B"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "soundcloud", url: "https://soundcloud.com/whotfissolis" },
      { platform: "instagram", url: "https://instagram.com/whotfissolis" },
    ],
    featured: true,
    order: 0,
  },
  {
    name: "fabgoddamn",
    slug: "fabgoddamn",
    bio: "São Paulo rapper riding the new wave of Brazilian drill and trap. Hard-edged production with Portuguese-language flows that hit fast and stay in the gut.",
    portraitUrl: "/images/roster/fabgoddamn.jpg",
    genres: ["Drill", "Trap"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "instagram", url: "https://instagram.com/fabgoddamn" },
      { platform: "youtube", url: "https://youtube.com" },
    ],
    featured: true,
    order: 1,
  },
  {
    name: "MIKE",
    slug: "mike",
    bio: "New York rapper and producer. Central figure in the city's contemporary underground rap scene. Long-form, low-volume records that reward close listening.",
    portraitUrl: "/images/roster/MIKE.png",
    genres: ["Hip-Hop", "Lo-Fi"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "instagram", url: "https://instagram.com" },
    ],
    featured: true,
    order: 2,
  },
  {
    name: "Navy Blue",
    slug: "navy-blue",
    bio: "Brooklyn rapper, producer, and skateboarder. Soft-voiced introspective rap; frequent collaborator across the New York underground.",
    portraitUrl: "/images/roster/navy.png",
    genres: ["Hip-Hop", "Soul"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "instagram", url: "https://instagram.com" },
    ],
    featured: false,
    order: 4,
  },
  {
    name: "Pink Siifu",
    slug: "pink-siifu",
    bio: "Birmingham-born, multi-discipline rapper and vocalist. Catalog moves between meditative soul, free noise, and street rap.",
    portraitUrl: "/images/roster/pink.png",
    genres: ["Hip-Hop", "Experimental"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "instagram", url: "https://instagram.com/pinksiifu" },
    ],
    featured: true,
    order: 5,
  },
  {
    name: "Maxo",
    slug: "maxo",
    bio: "Los Angeles rapper. Sparse, atmospheric records that lean into stillness more than volume.",
    portraitUrl: "/images/roster/maxo.png",
    genres: ["Hip-Hop", "Ambient"],
    socialLinks: [
      { platform: "spotify", url: "https://open.spotify.com" },
      { platform: "instagram", url: "https://instagram.com" },
    ],
    featured: true,
    order: 6,
  },
];
