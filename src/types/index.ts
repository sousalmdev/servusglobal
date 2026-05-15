export interface Artist {
  name: string;
  slug: string;
  bio: string;
  portraitUrl: string;
  genres: string[];
  socialLinks: { platform: string; url: string }[];
  featured: boolean;
  order: number;
}

export interface Release {
  title: string;
  slug: string;
  artistSlug: string;
  artistName: string;
  coverArtUrl: string;
  releaseDate: string;
  year: number;
  streamingLinks: { platform: string; url: string; icon: string }[];
  productionCredits?: string;
  featured: boolean;
}

export interface Platform {
  name: string;
  icon: string;
  url: string;
}

export interface SiteSettings {
  heroHeadline: string;
  heroHeadlineLines?: string[];
  heroEyebrow?: string;
  heroLocation?: string;
  heroSubline: string;
  heroVideoUrl?: string;
  heroPosterUrl: string;
  stats: { label: string; value: number; suffix?: string }[];
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}
