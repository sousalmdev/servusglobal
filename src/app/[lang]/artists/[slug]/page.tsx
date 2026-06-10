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
  
  const title = `${artist.name} | Servus Global Artist Roster`;
  const description = `${artist.name} - official artist profile. ${artist.bio.substring(0, 120)}... Represented by Servus Global, premier music management agency.`;
  const genresString = artist.genres.join(", ");
  
  return {
    title: title,
    description: description,
    keywords: [
      artist.name,
      `${artist.name} music`,
      `${artist.name} artist`,
      artist.name.toLowerCase(),
      genresString,
      "Servus Global roster",
      "music management roster",
      "artist management profile"
    ],
    alternates: {
      canonical: `/${lang}/artists/${slug}`,
      languages: {
        en: `/en/artists/${slug}`,
        pt: `/pt/artists/${slug}`,
        es: `/es/artists/${slug}`,
        ja: `/ja/artists/${slug}`,
      },
    },
    openGraph: {
      title: `${artist.name} | Servus Global`,
      description: description,
      images: [{ url: artist.portraitUrl, alt: `${artist.name} portrait` }],
      type: "profile",
      locale: lang === "pt" ? "pt_BR" : lang === "es" ? "es_ES" : lang === "ja" ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${artist.name} | Servus Global`,
      description: description,
      images: [artist.portraitUrl],
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
