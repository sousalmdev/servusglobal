import type { Metadata } from "next";
import { artists } from "@/data/artists";
import { releases } from "@/data/releases";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

const getLogoPath = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("spotify")) return "/images/logos/spotify.svg";
  if (p.includes("apple")) return "/images/logos/applemusic.svg";
  if (p.includes("youtube")) return "/images/logos/youtube.svg";
  if (p.includes("tidal")) return "/images/logos/tidal.svg";
  if (p.includes("soundcloud")) return "/images/logos/soundcloud.png";
  return null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) return { title: "Artist Not Found" };
  return {
    title: artist.name,
    description: artist.bio,
    openGraph: {
      title: `${artist.name} | Servus Global`,
      description: artist.bio,
      images: [{ url: artist.portraitUrl }],
    },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const artist = artists.find((a) => a.slug === slug);
  if (!artist) {
    return (
      <div
        className="p-24 text-center font-body"
        style={{ color: "var(--color-off-white)" }}
      >
        Artist not found.
      </div>
    );
  }

  const artistReleases = releases.filter((r) => r.artistSlug === artist.slug);

  return (
    <main className="min-h-screen" style={{ background: "var(--color-black)" }}>
      {/* Back link */}
      <div className="px-6 md:px-12 lg:px-16 pt-10 md:pt-12">
        <Link
          href="/#artists"
          data-cursor="hover"
          className="font-body text-eyebrow eyebrow link-underline transition-colors duration-300"
          style={{ color: "var(--color-gold)" }}
        >
          ← Back
        </Link>
      </div>

      {/* Hero */}
      <section
        className="px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        style={{
          paddingTop: "clamp(4rem, 8vw, 8rem)",
          paddingBottom: "clamp(6rem, 12vw, 12rem)",
        }}
      >
        {/* Portrait */}
        <div
          className="lg:col-span-5 aspect-[3/4] relative overflow-hidden"
          style={{ background: "var(--color-dark-surface-2)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center img-editorial"
            style={{
              backgroundImage: `url(${artist.portraitUrl})`,
              transform: "scale(1.05)",
            }}
          />
        </div>

        {/* Info column */}
        <div className="lg:col-span-7 flex flex-col">
          <span
            className="font-body text-eyebrow eyebrow mb-6"
            style={{ color: "var(--color-off-white)", opacity: 0.45 }}
          >
            Roster · Artist
          </span>

          <h1
            className="font-display text-balance"
            style={{
              color: "var(--color-off-white)",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontWeight: 800,
            }}
          >
            {artist.name}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-8">
            {artist.genres.map((g) => (
              <span
                key={g}
                className="font-body text-eyebrow eyebrow inline-flex items-center px-3 py-1.5"
                style={{
                  color: "var(--color-gold)",
                  border: "1px solid rgba(212, 165, 65, 0.3)",
                  fontSize: "0.625rem",
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p
            className="font-body text-pretty mt-10 max-w-xl"
            style={{
              color: "var(--color-off-white)",
              opacity: 0.6,
              fontSize: "clamp(1.0625rem, 1.3vw, 1.25rem)",
              lineHeight: 1.6,
            }}
          >
            {artist.bio}
          </p>

          {/* Social */}
          <div className="flex flex-wrap gap-2 mt-10">
            {artist.socialLinks.map((s) => {
              const logo = getLogoPath(s.platform);
              return (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className={`group font-body text-eyebrow eyebrow inline-flex items-center justify-center transition-all duration-300 ${logo ? 'hover:scale-110' : 'px-4 py-2.5 gap-2 hover:!text-[var(--color-black)] hover:!bg-[var(--color-gold)] hover:!border-[var(--color-gold)]'}`}
                style={{
                  color: "var(--color-off-white)",
                  ...(logo ? {} : { border: "1px solid rgba(245, 242, 235, 0.18)" }),
                  fontSize: "0.625rem",
                }}
                aria-label={s.platform}
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={s.platform}
                    className={`w-8 h-8 md:w-20 md:h-20 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 ${['apple', 'tidal'].some(p => s.platform.toLowerCase().includes(p)) ? 'brightness-0 invert' : ''}`}
                  />
                ) : (
                  s.platform
                )}
              </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Releases */}
      {artistReleases.length > 0 && (
        <section
          className="px-6 md:px-12 lg:px-16"
          style={{
            paddingTop: "clamp(6rem, 12vw, 10rem)",
            paddingBottom: "clamp(8rem, 16vw, 14rem)",
            borderTop: "1px solid rgba(245, 242, 235, 0.08)",
          }}
        >
          <div className="flex items-end justify-between mb-16 md:mb-20">
            <h2
              className="font-display"
              style={{
                color: "var(--color-off-white)",
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontWeight: 800,
              }}
            >
              Selected{" "}
              <span
                className="serif-italic"
                style={{ color: "var(--color-gold)", fontWeight: 400 }}
              >
                releases
              </span>
            </h2>
            <span
              className="font-body text-eyebrow eyebrow hidden md:inline-block mb-2"
              style={{ color: "var(--color-off-white)", opacity: 0.3 }}
            >
              {String(artistReleases.length).padStart(2, "0")} / titles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {artistReleases.map((r) => (
              <div key={r.slug} className="group">
                <div
                  className="aspect-square overflow-hidden mb-5"
                  style={{ background: "var(--color-dark-surface-2)" }}
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    style={{
                      backgroundImage: `url(${r.coverArtUrl})`,
                      filter: "saturate(0.95) contrast(1.04)",
                    }}
                  />
                </div>
                <h3
                  className="font-display"
                  style={{
                    color: "var(--color-off-white)",
                    fontSize: "clamp(1.125rem, 1.6vw, 1.5rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                    fontWeight: 600,
                  }}
                >
                  {r.title}
                </h3>
                <span
                  className="font-body text-eyebrow eyebrow mt-2 inline-block"
                  style={{
                    color: "var(--color-gold)",
                    opacity: 0.85,
                    fontSize: "0.625rem",
                  }}
                >
                  {r.year}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: artist.name,
            description: artist.bio,
            genre: artist.genres,
            image: artist.portraitUrl,
            sameAs: artist.socialLinks.map((s) => s.url),
          }),
        }}
      />
    </main>
  );
}
