import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Signature from "@/components/Signature";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Hobbies from "@/components/Hobbies";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />

        <div className="section-block">
          <About />
        </div>
        <div className="section-block section-alt-bg">
          <Signature />
        </div>
        <div className="section-block">
          <Projects />
        </div>
        <div className="section-block section-alt-bg">
          <Skills />
        </div>
        <div className="section-block">
          <Hobbies />
        </div>
        <div className="section-block section-alt-bg">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
