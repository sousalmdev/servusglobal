import LoadingSequence from "@/components/LoadingSequence";
import Navbar from "@/components/Navbar";
import HeroEditorial from "@/components/HeroEditorial";
import ArtistGridEditorial from "@/components/ArtistGridEditorial";
import Releases from "@/components/Releases";
import Services from "@/components/Services";
import OurStory from "@/components/OurStory";
import DiagonalMarquee from "@/components/DiagonalMarquee";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import WorkWithUsMarquee from "@/components/WorkWithUsMarquee";
import Roles from "@/components/Roles";
import Contact from "@/components/Contact";
import FooterEditorial from "@/components/FooterEditorial";
import { getDictionary } from "@/i18n/getDictionary";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <LoadingSequence />
      <Navbar dict={dict} />
      <main>
        <HeroEditorial dict={dict} />
        <DiagonalMarquee dict={dict} />
        <ArtistGridEditorial dict={dict} />
        <Releases dict={dict} />
        <Services dict={dict} />
        <OurStory dict={dict} />
        <ParallaxShowcase dict={dict} />
        <WorkWithUsMarquee dict={dict} />
        <Roles dict={dict} />
        <Contact dict={dict} />
      </main>
      <FooterEditorial dict={dict} />
    </>
  );
}
