"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import GrowthGraphCanvas from './GrowthGraphCanvas';
import StopTheScrollCanvas from './StopTheScrollCanvas';
import DigitalDominanceCanvas from './DigitalDominanceCanvas';

const MarketShift = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const cards = [
        {
            id: 0,
            number: "01",
            title: "Be the Top Result",
            description: "SEO isn't just about keywords; it’s about being found when it matters most. We handle the technical heavy lifting so you can enjoy the organic growth.",
            color: "bg-[#74C69D]", // Mantis Green
            highlight: "text-white"
        },
        {
            id: 1,
            number: "02",
            title: "Stop the Scroll",
            description: "Give them a reason to pay attention. We create the content and the strategy that transforms your social feed into a powerful lead-generation tool.",
            color: "bg-[#2D6A4F]", // Darker Green
            highlight: "text-[#74C69D]"
        },
        {
            id: 2,
            number: "03",
            title: "Establish Digital Dominance",
            description: "Your brand shouldn’t just exist online; it should set the standard. We curate a sophisticated digital footprint that positions you as the undisputed leader in your industry.",
            color: "bg-[#1B4332]", // Deep Green/Blackish
            highlight: "text-white"
        }
    ];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const newIndex = Math.min(Math.floor(latest * cards.length), cards.length - 1);
        setActiveIndex(newIndex);
    });

    const nextCard = () => {
        setActiveIndex((prev) => (prev + 1) % cards.length);
    };

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-white dark:bg-black [.cloud-mode_&]:bg-transparent transition-colors duration-500 snap-none">
            {/* Scroll Snap Ghost Points */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
                <div className="h-[133vh] snap-start" />
                <div className="h-[133vh] snap-start" />
                <div className="h-[133vh] snap-start" />
            </div>
            <section className="sticky top-0 h-screen text-black dark:text-white px-4 md:px-12 relative overflow-hidden flex items-center">
                {/* Background Details */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-pattern-ms" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern-ms)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left Content */}
                    <div>
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="font-mono text-sm tracking-widest text-[#74C69D] uppercase mb-4 block">
                                // The Shift &mdash; {cards[activeIndex].number}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                {cards[activeIndex].title}
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-md leading-relaxed">
                                {cards[activeIndex].description}
                            </p>

                            <button
                                onClick={nextCard}
                                className="mt-12 group flex items-center gap-4 text-sm font-mono tracking-widest hover:text-[#74C69D] transition-colors"
                            >
                                <span className="w-12 h-[1px] bg-black dark:bg-white group-hover:bg-[#74C69D] transition-colors" />
                                NEXT INSIGHT
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Stacked Cards */}
                    <div className="relative h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#74C69D]/30 rounded-full blur-[100px] pointer-events-none z-0" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#74C69D]/20 rounded-full blur-[60px] pointer-events-none z-0 mix-blend-screen" />

                        <div className="relative w-full max-w-sm aspect-[3/4]" onClick={nextCard}>
                            <AnimatePresence>
                                {cards.map((card, index) => {
                                    const diff = (index - activeIndex + cards.length) % cards.length;
                                    let zIndex = 30 - diff * 10;
                                    let scale = 1 - diff * 0.05;
                                    let rotate = diff * 5;
                                    let x = diff * 40;
                                    let y = diff * -10;
                                    let opacity = 1 - diff * 0.1;

                                    return (
                                        <motion.div
                                            key={card.id}
                                            layout
                                            initial={false}
                                            animate={{ zIndex, scale, rotate, x, y, opacity }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/20 bg-white/90 dark:bg-[#0A0A0A] p-8 flex flex-col justify-between cursor-pointer hover:border-[#74C69D]/50 transition-colors shadow-2xl backdrop-blur-md"
                                            style={{ transformOrigin: "bottom left" }}
                                        >
                                            <div className="flex justify-between items-start relative z-10">
                                                <span className="font-mono text-4xl font-bold text-black/20 dark:text-white/20">{card.number}</span>
                                                <div className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-[#74C69D] animate-pulse' : 'bg-black/10 dark:bg-white/10'}`} />
                                            </div>

                                            <div className="flex-1 w-full relative z-10 h-full">
                                                {card.id === 0 && <GrowthGraphCanvas />}
                                                {card.id === 1 && <StopTheScrollCanvas />}
                                                {card.id === 2 && <DigitalDominanceCanvas />}
                                            </div>

                                            <div>
                                                <div className={`w-12 h-1 mb-6 ${card.color}`} />
                                                <h3 className="text-2xl font-bold uppercase leading-none text-black dark:text-white">
                                                    {card.title}
                                                </h3>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MarketShift;
