import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import PageNavigator from "@/components/PageNavigator";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Hobbies from "@/components/Hobbies";
import Signature from "@/components/Signature";
import Contact from "@/components/Contact";

const PAGES = {
  hero: <Hero />,
  about: <About />,
  projects: <Projects />,
  skills: <Skills />,
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
