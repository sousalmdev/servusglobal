import type { Metadata } from "next";
import { getDictionary } from "@/i18n/getDictionary";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import FooterEditorial from "@/components/FooterEditorial";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  const langs = ["en", "pt", "es", "ja"];
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;

  const titles: Record<string, string> = {
    en: "Contact | Servus Global — Artist Onboarding",
    pt: "Contato | Servus Global — Integração de Artistas",
    es: "Contacto | Servus Global — Incorporación de Artistas",
    ja: "お問い合わせ | Servus Global — アーティスト・オンボーディング",
  };

  const descriptions: Record<string, string> = {
    en: "Submit your portfolio and music for A&R, rollout, and distribution consideration. Join the Servus Global roster.",
    pt: "Envie seu portfólio e música para consideração de A&R, rollout e distribuição. Junte-se ao roster da Servus Global.",
    es: "Envía tu portafolio y música para consideración de A&R, lanzamiento y distribución. Únete al roster de Servus Global.",
    ja: "A&R、ロールアウト、ディストリビューションの審査のために、ポートフォリオと音楽をお送りください。Servus Globalロスターに参加しましょう。",
  };

  const title = titles[lang] || titles.en;
  const description = descriptions[lang] || descriptions.en;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/contact`,
      languages: {
        en: "/en/contact",
        pt: "/pt/contact",
        es: "/es/contact",
        ja: "/ja/contact",
      },
    },
    openGraph: {
      title,
      description,
      siteName: "Servus Global",
      locale: lang === "pt" ? "pt_BR" : lang === "es" ? "es_ES" : lang === "ja" ? "ja_JP" : "en_US",
      type: "website",
      url: `https://servusglobalinc.com/${lang}/contact`,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar dict={dict} />
      <main className="overflow-x-hidden w-full relative">
        <Contact dict={dict} />
      </main>
      <FooterEditorial dict={dict} />
    </>
  );
}
