"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import PuppyRunGame from './PuppyRunGame';

const services = [
    {
        title: "SEO",
        subtitle: "Search Optimization",
        description: "Architecting visibility. We structure your digital presence to dominate search landscapes.",
        tags: ["Audit", "Strategy", "On-Page", "Backlinks"]
    },
    {
        title: "SEM",
        subtitle: "Search Marketing",
        description: "Precision targeting. We deploy data-driven campaigns that intercept user intent.",
        tags: ["PPC", "Ad Copy", "CRO", "A/B Test"]
    },
    {
        title: "SMM",
        subtitle: "Social Marketing",
        description: "Building tribes. We cultivate engaged communities around your brand narrative.",
        tags: ["Content", "Community", "Influencer", "Analytics"]
    },
    {
        title: "Design",
        subtitle: "Graphic Design",
        description: "Visual synthesis. We craft compelling visual identities that communicate your essence.",
        tags: ["Branding", "UI/UX", "Assets", "Print"]
    }
];

export default function Services() {
    return (
        <section id="services" className="py-24 min-h-[800px] bg-transparent relative overflow-visible flex flex-col items-center z-20">
            {/* The Street Floor (Ceiling for cards) */}
            <div className="w-full max-w-7xl mx-auto relative mb-0">
                <div className="flex items-end gap-6 mb-4 px-4 md:px-0">
                    <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-none tracking-tighter transition-colors duration-500">
                        SERVICES
                    </h2>
                    {/* Game area container replacing simple line */}
                    <div className="relative flex-grow h-[150px] mb-4 hidden md:block">
                        <div className="absolute bottom-0 left-0 w-full h-full z-10">
                            <PuppyRunGame />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/20 dark:bg-white/20" />
                    </div>
                    <span className="font-mono text-sm tracking-widest text-gray-500 dark:text-gray-400 mb-2 uppercase hidden md:block">
                        What We Do
                    </span>
                </div>

                {/* The Thick Beam Floor */}
                <div className="w-full h-4 bg-black dark:bg-white rounded-full transition-colors duration-500" />
                <div className="absolute top-full left-0 w-full h-[1px] bg-black/10 dark:bg-white/10" />
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-12 w-full max-w-7xl px-4 perspective-1000 mt-2 scale-[0.8] md:scale-100 origin-top">
                {services.map((service, index) => (
                    <HangingCard key={service.title} service={service} index={index} />
                ))}
            </div>

            <div className="mt-20 z-10">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    Explore All Services
                </Link>
            </div>
        </section>
    );
}

function HangingCard({ service, index }: { service: any; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const [cutY, setCutY] = useState(0);

    const stringHeight = 120 + (index % 2 === 0 ? 40 : 80) + (index * 20);
    const duration = 3 + (index * 0.5);
    const isEven = index % 2 === 0;
    const rotateValues = isEven ? [3, -3, 3] : [-3, 3, -3];

    const handleMouseEnter = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const limitedY = Math.min(Math.max(y, 20), stringHeight - 20);
        setCutY(limitedY);
        setIsHovered(true);
    };

    const activeCutY = isHovered ? cutY : stringHeight * 0.6;

    return (
        <div
            className="relative flex flex-col items-center h-[500px] w-[200px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full relative z-10 -mt-[3px] transition-colors duration-500" />

            <motion.div
                className="flex flex-col items-center origin-top cursor-pointer relative w-full"
                initial={{ rotate: rotateValues[0] }}
                animate={{ rotate: isHovered ? 0 : rotateValues }}
                transition={{
                    rotate: isHovered ? { duration: 0.3 } : { duration: duration, repeat: Infinity, ease: "easeInOut" }
                }}
            >
                <motion.div
                    className="w-[1px] bg-black/30 dark:bg-white/30 origin-top absolute top-0 transition-colors duration-500"
                    style={{ height: activeCutY }}
                    animate={isHovered ? { scaleY: 0.8, opacity: 0.5 } : { scaleY: 1, opacity: 1 }}
                />

                <motion.div
                    className="flex flex-col items-center w-full"
                    animate={isHovered ? { y: 300, opacity: 0 } : { y: 0, opacity: 1 }}
                    transition={isHovered ?
                        {
                            y: { type: "spring", stiffness: 100, damping: 10, mass: 1 },
                            opacity: { duration: 0.2, ease: "easeOut" },
                            rotate: { duration: 0.2 }
                        } :
                        { rotate: { duration: duration, repeat: Infinity, ease: "easeInOut" }, y: { duration: 0.3 }, opacity: { duration: 0.2 } }
                    }
                >
                    <div style={{ height: activeCutY }} />
                    <div
                        className="w-[1px] bg-black/30 dark:bg-white/30 origin-bottom transition-colors duration-500"
                        style={{ height: stringHeight - activeCutY }}
                    />
                    <div className="bg-white border border-gray-200 rounded-[6px] p-4 shadow-md w-[80%] text-center">
                        <h3 className="text-xl font-black text-black">{service.title}</h3>
                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{service.subtitle}</div>
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                            opacity: 1, scale: 1, y: 0,
                            transition: { delay: 0.3, type: "spring", stiffness: 300, damping: 25 }
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.15 } }}
                        className="absolute top-20 z-50 w-[300px] md:w-[350px] bg-white rounded-[12px] shadow-2xl border border-black/10 overflow-hidden"
                    >
                        <div className="h-2 w-full bg-black" />
                        <div className="p-8">
                            <h3 className="text-4xl font-black text-black mb-2">{service.title}</h3>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">{service.subtitle}</h4>
                            <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                                {service.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {service.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] uppercase tracking-wider bg-black text-white px-2 py-1 rounded-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
