import LoadingSequence from "@/components/LoadingSequence";
import Navbar from "@/components/Navbar";
import HeroEditorial from "@/components/HeroEditorial";
import ArtistGridEditorial from "@/components/ArtistGridEditorial";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import { getDictionary } from "@/i18n/getDictionary";
import dynamic from "next/dynamic";

const Releases = dynamic(() => import("@/components/Releases"));
const WhyServus = dynamic(() => import("@/components/WhyServus"));
const Founders = dynamic(() => import("@/components/Founders"));
const Services = dynamic(() => import("@/components/Services"));
const ParallaxShowcase = dynamic(() => import("@/components/ParallaxShowcase"));
const WorkWithUsMarquee = dynamic(() => import("@/components/WorkWithUsMarquee"));
const Roles = dynamic(() => import("@/components/Roles"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Contact = dynamic(() => import("@/components/Contact"));
const FooterEditorial = dynamic(() => import("@/components/FooterEditorial"));

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <LoadingSequence />
      <Navbar dict={dict} />
      <main className="overflow-x-hidden w-full relative">
        <HeroEditorial dict={dict} />
        <DiagonalMarquee dict={dict} />
        <ArtistGridEditorial dict={dict} lang={lang} />
        <Releases dict={dict} />
        <Services dict={dict} />
        <WhyServus dict={dict} />
        <Founders dict={dict} />
        <FAQ dict={dict} />
        <ParallaxShowcase dict={dict} />
        <WorkWithUsMarquee dict={dict} />
        <Roles dict={dict} />
        <Contact dict={dict} />
      </main>
      <FooterEditorial dict={dict} />
    </>
  );
}
