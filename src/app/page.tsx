"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import DynamicMarketShift from "@/components/DynamicMarketShift";

const AboutMe = dynamic(() => import("@/components/AboutMe"), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-black/5" />,
});

const MorphingScrollSection = dynamic(() => import("@/components/MorphingScrollSection"), {
  ssr: false,
  loading: () => <div className="h-[400vh] w-full bg-black/5 animate-pulse" />,
});

const WhyKollam = dynamic(() => import("@/components/WhyKollam"), {
  ssr: false,
  loading: () => <div className="h-[800px] w-full bg-black/5" />,
});

const WhyChooseMe = dynamic(() => import("@/components/WhyChooseMe"), {
  ssr: false,
  loading: () => <div className="h-[400vh] w-full bg-black/5 animate-pulse" />,
});

const Services = dynamic(() => import("@/components/Services"), {
  ssr: false,
  loading: () => <div className="h-[800px] w-full bg-black/5" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <div className="h-[60vh] w-full bg-black/5" />,
});

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
