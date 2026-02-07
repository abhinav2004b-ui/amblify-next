import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import MarketShift from "@/components/MarketShift";
import WhyChooseMe from "@/components/WhyChooseMe";
import MorphingScrollSection from "@/components/MorphingScrollSection";
import WhyKollam from "@/components/WhyKollam";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <MarketShift />
      <MorphingScrollSection />
      <WhyKollam />
      <WhyChooseMe />
      <Services />
      <Footer />
    </main>
  );
}
