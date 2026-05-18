import type { Metadata } from "next";
import { artists } from "@/data/artists";
import { releases } from "@/data/releases";
import { getDictionary } from "@/i18n/getDictionary";
import ArtistKineticStage from "@/components/ArtistKineticStage";

interface Props {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const langs = ["en", "pt", "es", "ja"];
  const params: { slug: string; lang: string }[] = [];
  for (const lang of langs) {
    for (const a of artists) params.push({ slug: a.slug, lang });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lang } = await params;
  const artist = artists.find((a) => a.slug === slug);
  const dict = await getDictionary(lang);

  if (!artist) return { title: dict.artistPage.notFound };
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
  const { slug, lang } = await params;
  const artist = artists.find((a) => a.slug === slug);
  const dict = await getDictionary(lang);

  if (!artist) {
    return (
      <div
        className="p-24 text-center font-body"
        style={{ color: "var(--color-off-white)" }}
      >
        {dict.artistPage.notFound}
      </div>
    );
  }

  const artistReleases = releases.filter((r) => r.artistSlug === artist.slug);
  const sortedRoster = [...artists].sort((a, b) => a.order - b.order);
  const rosterIndex = sortedRoster.findIndex((a) => a.slug === slug) + 1;

  return (
    <main
      className="min-h-screen overflow-x-hidden w-full"
      style={{ background: "var(--color-black)" }}
    >
      <ArtistKineticStage
        artist={artist}
        releases={artistReleases}
        lang={lang}
        dict={dict}
        rosterIndex={rosterIndex}
        rosterTotal={artists.length}
      />

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
