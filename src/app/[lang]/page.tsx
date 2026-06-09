import LoadingSequence from "@/components/LoadingSequence";
import Navbar from "@/components/Navbar";
import HeroEditorial from "@/components/HeroEditorial";
import ArtistGridEditorial from "@/components/ArtistGridEditorial";
import Releases from "@/components/Releases";
import WhyServus from "@/components/WhyServus";
import OurStory from "@/components/OurStory";
import Founders from "@/components/Founders";
import Services from "@/components/Services";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import WorkWithUsMarquee from "@/components/WorkWithUsMarquee";
import { getDictionary } from "@/i18n/getDictionary";
import dynamic from "next/dynamic";

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
        <WhyServus dict={dict} />
        <Founders dict={dict} />
        <Services dict={dict} />
        <ParallaxShowcase dict={dict} />
        <WorkWithUsMarquee dict={dict} />
        <Roles dict={dict} />
        <FAQ dict={dict} />
        <Contact dict={dict} />
      </main>
      <FooterEditorial dict={dict} />
    </>
  );
}
