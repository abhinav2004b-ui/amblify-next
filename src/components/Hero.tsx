"use client";

import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useState } from 'react';

export default function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const grainOpacity = useTransform(scrollY, [0, 600], [0.2, 0]); // Minimal grain

    // Mouse tracking for flashlight effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, transparent 0px, transparent 80px, black 120px)`;
    const maskImageContent = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, black 0px, black 80px, transparent 120px)`;

    return (
        <section
            className="h-screen w-full flex flex-col items-center justify-center relative px-4 text-center overflow-hidden"
        >
            {/* Grain Overlay - Minimal (Light Mode Only) */}
            <motion.div
                style={{ opacity: grainOpacity }}
                className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay dark:hidden"
            >
                <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.8%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%20opacity%3D%221%22%2F%3E%3C%2Fsvg%3E')] opacity-100" />
            </motion.div>

            {/* Dark Mode Grid Pattern (Proper Architectural Background) */}
            <div className="absolute inset-0 z-0 opacity-0 dark:opacity-20 pointer-events-none transition-opacity duration-500">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hero-grid)" />
                </svg>
            </div>

            <motion.div style={{ y, opacity }} className="relative z-20 group">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-500 dark:text-gray-400 font-mono text-sm uppercase tracking-[0.3em] mb-4 md:mb-8"
                >
                    Digital Ecosystems
                </motion.p>

                {/* Container for the stacked text layers */}
                <div
                    className="relative inline-block"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >

                    {/* Bottom Layer (Revealed Content) */}
                    <motion.div
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none"
                        style={{ maskImage: maskImageContent, WebkitMaskImage: maskImageContent }}
                    >
                        <div className="text-[12vw] leading-[0.95] font-black tracking-tightest select-none w-full">
                            {/* Row 1: H1 behind DIGITAL */}
                            <div className="relative flex items-center justify-center h-[0.95em]">
                                <motion.h1
                                    className="text-[12px] font-medium text-black dark:text-white uppercase tracking-[0.5em] absolute"
                                >
                                    Digital Marketing Consultant in Kollam
                                </motion.h1>
                                <span className="block opacity-0">DIGITAL</span> {/* Height reference */}
                            </div>

                            {/* Row 2: AMBLIFY behind ARCHITECT */}
                            <div className="relative block h-[0.95em]">
                                <motion.span
                                    className="block font-black text-transparent bg-clip-text"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(110deg, var(--amb-text, #000) 45%, #666 50%, var(--amb-text, #000) 55%)
                                        `,
                                        backgroundSize: '200% 100%'
                                    }}
                                    animate={{
                                        backgroundPosition: ["0% 0%", "200% 0%"]
                                    }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                >
                                    AMBLIFY
                                </motion.span>
                                <span className="block opacity-0">AMBLIFY</span> {/* Height reference */}
                            </div>
                        </div>
                    </motion.div>

                    {/* Top Layer (Default View) - "DIGITAL ARCHITECT" - Eraser Mask */}
                    <motion.h2
                        className="text-[12vw] leading-[0.95] font-black tracking-tightest text-black dark:text-white select-none relative z-10"
                        style={{ maskImage: isHovered ? maskImage : "none", WebkitMaskImage: isHovered ? maskImage : "none" }}
                    >
                        <span className="block">DIGITAL</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-400 dark:from-white dark:to-gray-500">ARCHITECT</span>
                    </motion.h2>

                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="max-w-md mx-auto mt-12 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed"
                >
                    We engineer ROI-driven marketing infrastructures.
                    Blending data science with avant-garde aesthetics.
                </motion.p>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div style={{ y: useTransform(scrollY, [0, 1000], [0, 200]) }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-black/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none z-0" />
            <motion.div style={{ y: useTransform(scrollY, [0, 1000], [0, 300]) }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] border border-black/10 rounded-full animate-[spin_40s_linear_infinite_reverse] pointer-events-none z-0" />
        </section >
    )
}
