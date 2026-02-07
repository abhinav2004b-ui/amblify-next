"use client";

import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import profileImg from '../assets/profile-transparent.png';
import profileArt from '../assets/profile-hover-top.png';

export default function AboutMe() {
    // Mouse tracking for hover reveal effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, transparent 0px, transparent 50px, black 80px)`;
    return (
        <section id="about" className="min-h-screen py-24 px-4 md:px-12 relative flex items-center justify-center bg-white dark:bg-black [.cloud-mode_&]:bg-transparent overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="order-2 md:order-1 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 bg-black/20 dark:bg-white/20" />
                            <span className="text-sm font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">The Architect</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white leading-[1.1] mb-8">
                            Best Digital Marketer in <span className="text-gray-400 dark:text-gray-600">Kollam</span>.
                        </h2>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            I don&apos;t just run ads; I build dominance. With a laser focus on ROI and a creative arsenal that breaks through the noise, I help brands in Kollam and beyond turn clicks into customers and traffic into tangible revenue.
                        </p>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-3xl font-bold text-black dark:text-white mb-1">2+</h4>
                                <p className="text-xs font-mono uppercase text-gray-400 dark:text-gray-500">Years Experience</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-black dark:text-white mb-1">20+</h4>
                                <p className="text-xs font-mono uppercase text-gray-400 dark:text-gray-500">Satisfied Clients</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Image Animation - sleek reveal with Hover Effect */}
                <div className="order-1 md:order-2 relative w-full aspect-[4/5] md:aspect-square flex items-center justify-center">
                    <motion.div
                        initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" }}
                        whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Power4.out feel
                        viewport={{ once: true }}
                        className="relative w-full h-full max-w-md mx-auto group cursor-none"
                    >
                        {/* Interactive Container */}
                        <div
                            className="relative w-full h-full"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Bottom Layer (Original Photo) - Visible through the hole */}
                            <Image
                                src={profileImg}
                                alt="Abhinav - Digital Marketer"
                                className="absolute inset-0 w-full h-full object-cover rounded-sm shadow-2xl"
                            />

                            {/* Top Layer (Polygon Art) - Vanishes at cursor */}
                            <motion.div
                                className="absolute inset-0 z-10 w-full h-full"
                                style={{
                                    maskImage: maskImage,
                                    WebkitMaskImage: maskImage
                                }}
                            >
                                <Image
                                    src={profileArt}
                                    alt="Abhinav - Digital Art"
                                    className="w-full h-full object-cover rounded-sm shadow-2xl"
                                />
                            </motion.div>
                        </div>

                        {/* Decorative Frame */}
                        <motion.div
                            initial={{ opacity: 0, x: 20, y: 20 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute inset-0 border-2 border-black/10 dark:border-white/10 -z-10 translate-x-4 translate-y-4 pointer-events-none"
                        />
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
