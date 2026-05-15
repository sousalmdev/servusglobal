import LoadingSequence from "@/components/LoadingSequence";
import Navbar from "@/components/Navbar";
import HeroEditorial from "@/components/HeroEditorial";
import LocationMarquee from "@/components/LocationMarquee";
import ArtistGridEditorial from "@/components/ArtistGridEditorial";
import Releases from "@/components/Releases";
import Services from "@/components/Services";
import OurStory from "@/components/OurStory";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import WorkWithUsMarquee from "@/components/WorkWithUsMarquee";
import Roles from "@/components/Roles";
import Contact from "@/components/Contact";
import FooterEditorial from "@/components/FooterEditorial";

export default function Home() {
  return (
    <>
      <LoadingSequence />
      <Navbar />
      <main>
        <HeroEditorial />
        <LocationMarquee />
        <ArtistGridEditorial />
        <Releases />
        <Services />
        <OurStory />
        <ParallaxShowcase />
        <WorkWithUsMarquee />
        <Roles />
        <Contact />
      </main>
      <FooterEditorial />
    </>
  );
}
