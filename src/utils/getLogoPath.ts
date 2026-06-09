/**
 * Resolves a streaming-platform name to its local logo asset path.
 * Shared by Releases, ArtistKineticStage, and any future component that
 * needs platform branding.
 */
export function getLogoPath(platform: string): string | null {
  const p = platform.toLowerCase();
  if (p.includes("spotify")) return "/images/logos/spotify.svg";
  if (p.includes("apple")) return "/images/logos/applemusic.svg";
  if (p.includes("youtube")) return "/images/logos/youtube.svg";
  if (p.includes("tidal")) return "/images/logos/tidal.svg";
  if (p.includes("soundcloud")) return "/images/logos/soundcloud.png";
  if (p.includes("instagram")) return "/instagram-1.svg";
  return null;
}
