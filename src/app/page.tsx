import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import MorphingScrollSection from "@/components/MorphingScrollSection";
import WhyKollam from "@/components/WhyKollam";
import WhyChooseMe from "@/components/WhyChooseMe";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

import DynamicMarketShift from "@/components/DynamicMarketShift";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutMe />
      <DynamicMarketShift />
      <MorphingScrollSection />
      <WhyKollam />
      <WhyChooseMe />
      <Services />
      <Footer />
    </main>
  );
}
