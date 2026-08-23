import LiquidBackground from "@/components/LiquidBackground";
import GlassPointer from "@/components/GlassPointer";
import Navbar from "@/components/Navbar";
import PageNavigator from "@/components/PageNavigator";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AgePage from "@/components/AgePage";
import Projects from "@/components/Projects";
import Footprints from "@/components/Footprints";
import FootprintsAlbum from "@/components/FootprintsAlbum";
import Hobbies from "@/components/Hobbies";
import Signature from "@/components/Signature";
import Contact from "@/components/Contact";

const PAGES = {
  hero: <Hero />,
  about: <About />,
  age: <AgePage />,
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
      <LiquidBackground />
      <GlassPointer />
      <Navbar />
      <PageNavigator pages={PAGES} />
    </>
  );
}
