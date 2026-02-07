"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const services = [
    {
        id: 'seo',
        title: "SEO Architecture",
        subtitle: "Search Engine Optimization",
        description: "We don't just chase algorithms; we anticipate them. Our SEO infrastructure is built on semantic core analysis and high-velocity technical optimization.",
        details: ["01. Technical Audit", "02. Semantic Core", "03. Backlink Strategy"],
        gradient: "from-blue-500 to-cyan-400"
    },
    {
        id: 'sem',
        title: "Precision SEM",
        subtitle: "Performance Marketing",
        description: "Surgical targeting for maximum ROAS. We analyze user intent signals to deploy campaigns that intercept customers exactly when they're ready to convert.",
        details: ["01. PPC Management", "02. A/B Testing", "03. Conversion Labs"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: 'smm',
        title: "Social Ecosystems",
        subtitle: "Community & Content",
        description: "Turning passive scrolling into active engagement. We build self-sustaining brand communities through narrative-driven content architecture.",
        details: ["01. Content Strategy", "02. Influencer Grids", "03. Viral Loops"],
        gradient: "from-pink-500 to-rose-400"
    },
    {
        id: 'design',
        title: "Visual Synthesis",
        subtitle: "Design & UI/UX",
        description: "Design that functions as a competitive asset. We craft visual identities that communicate authority, trust, and innovation in milliseconds.",
        details: ["01. Brand Identity", "02. UI/UX Systems", "03. Motion Assets"],
        gradient: "from-orange-400 to-yellow-400"
    }
];

export default function DetailedServices() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const yLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
    const yRight = useTransform(scrollYProgress, [0, 1], ["-75%", "0%"]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-white dark:bg-black transition-colors duration-500">
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col md:flex-row">
                {/* LEFT: Visuals (Scrolls UP) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-gray-50 dark:bg-black border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
                    <motion.div style={{ y: yLeft }} className="h-[400%] flex flex-col">
                        {services.map((s) => (
                            <div key={s.id} className="h-[100vh] w-full flex items-center justify-center p-8 md:p-12 relative group overflow-hidden">
                                <div className={`relative w-full aspect-square max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${s.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}>
                                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay" />
                                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl mix-blend-overlay" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-30 font-black text-6xl md:text-9xl text-white mix-blend-overlay tracking-tighter">
                                        {s.id.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* RIGHT: Text (Scrolls DOWN) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-white dark:bg-black">
                    <motion.div style={{ y: yRight }} className="h-[400%] flex flex-col">
                        {[...services].reverse().map((s) => (
                            <div key={s.id} className="h-[100vh] w-full flex flex-col justify-center px-8 md:px-24 relative">
                                <div className="absolute top-8 md:top-12 left-8 md:left-12 w-12 h-1 bg-black dark:bg-white" />
                                <h3 className="font-mono text-sm tracking-[0.3em] uppercase mb-4 md:mb-6 text-gray-400">
                                    {s.subtitle}
                                </h3>
                                <h2 className="font-serif text-4xl md:text-8xl text-black dark:text-white mb-4 md:mb-8 leading-none uppercase">
                                    {s.title}
                                </h2>
                                <p className="font-sans font-light text-base md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mb-8 md:mb-12">
                                    {s.description}
                                </p>
                                <ul className="space-y-2 md:space-y-4 font-mono text-sm tracking-widest text-gray-500 dark:text-gray-400">
                                    {s.details.map((item) => (
                                        <li key={item} className="flex items-center gap-4">
                                            <span className="w-2 h-2 bg-[#74C69D] rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button className="mt-8 md:mt-12 flex items-center gap-2 text-black dark:text-white uppercase tracking-widest font-bold text-sm hover:translate-x-4 transition-transform group">
                                    Start Project <ArrowUpRight className="group-hover:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
