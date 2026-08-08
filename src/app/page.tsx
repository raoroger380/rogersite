import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageNavigator from "@/components/PageNavigator";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footprints from "@/components/Footprints";
import FootprintsAlbum from "@/components/FootprintsAlbum";
import Hobbies from "@/components/Hobbies";
import Signature from "@/components/Signature";
import Contact from "@/components/Contact";

const PAGES = {
  hero: <Hero />,
  about: <About />,
  projects: <Projects />,
  footprints: <Footprints />,
  "footprints-album": <FootprintsAlbum />,
  hobbies: <Hobbies />,
  signature: <Signature />,
  contact: <Contact />,
};

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <ScrollProgress />
      <Navbar />
      <PageNavigator pages={PAGES} />
    </>
  );
}
