"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface CardData {
    id: number;
    title: string;
    desc: string;
    side: string;
    initialZ: number;
}

export default function WhyChooseMe() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // MOVEMENT LOGIC
    // ----------------------------
    const forwardSpeed = useTransform(scrollYProgress, [0.15, 1], [0, 4000]);

    // Exit Animation: Fade out down
    const exitOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);
    const exitY = useTransform(scrollYProgress, [0.85, 0.95], ["0%", "10%"]);

    const cards: CardData[] = [
        {
            id: 1,
            title: "Expertise",
            desc: "The digital landscape shifts daily; I stay ahead of the curve so you don’t have to. I translate complex algorithms and emerging trends into actionable, innovative strategies that keep your brand relevant.",
            side: "left",
            initialZ: 0
        },
        {
            id: 2,
            title: "Proven Results",
            desc: "My portfolio isn’t just a list of clients, it’s a collection of success stories. From scaling organic reach to shattering engagement records, I focus on the metrics that actually impact your bottom line.",
            side: "right",
            initialZ: -1000
        },
        {
            id: 3,
            title: "Tailored Tactics",
            desc: "Generic templates are for the competition. I deep-dive into your brand’s DNA to build a custom roadmap that respects your constraints while aggressively pursuing your specific goals.",
            side: "left",
            initialZ: -2000
        },
        {
            id: 4,
            title: "The Partnership Model",
            desc: "I don’t work for you; I work with you. My success is tethered to yours, meaning every data point we analyze and every move we make is designed to secure your long-term market position.",
            side: "right",
            initialZ: -3000
        }
    ];

    return (
        <section ref={containerRef} className="relative w-full h-[400vh] bg-white dark:bg-black [.cloud-mode_&]:bg-transparent transition-colors duration-500">

            {/* Sticky Container - Perspective Root */}
            <motion.div
                className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center perspective-container transform-style-3d will-change-transform" // Added will-change-transform via class or style
                style={{
                    perspectiveOrigin: '50% 50%',
                    opacity: exitOpacity,
                    y: exitY,
                    transform: 'translate3d(0,0,0)', // Force hardware acceleration
                    willChange: 'transform, opacity' // Explicit will-change
                }}
            >

                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-transparent dark:to-transparent opacity-80 pointer-events-none" />

                {/* Floor Glow Path */}
                <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40vw] h-[200vh] bg-mantis-green/10 blur-[80px] origin-bottom"
                    style={{
                        rotateX: 90,
                        opacity: 0.6
                    }}
                />

                {/* Main 3D Scene - Centered perfectly between sidebars */}
                <motion.div
                    className="relative w-full max-w-7xl h-full flex justify-center transform-style-3d p-5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ margin: "-20% 0px", amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >

                    {/* Cards Corridor */}
                    {cards.map((card) => (
                        <TunnelCard
                            key={card.id}
                            data={card}
                            forwardSpeed={forwardSpeed}
                        />
                    ))}

                </motion.div>

                {/* Overlay Text */}
                <motion.div
                    className="absolute top-8 left-0 w-full text-center z-50 pointer-events-none mix-blend-difference"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-gray-400">Why Choose Me</h2>
                    <h3 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-gray-200">THE PASSAGE</h3>
                </motion.div>
            </motion.div>
        </section>
    );
}

function TunnelCard({ data, forwardSpeed }: { data: CardData, forwardSpeed: MotionValue<number> }) {
    const finalZ = useTransform(forwardSpeed, (latest) => data.initialZ + latest);
    const opacity = useTransform(finalZ, [-2000, -1500, 500, 1000], [0, 1, 1, 0]);

    // Side offsets - Matched Original -320/320
    const xBase = data.side === 'left' ? -320 : 320;

    // Rotation: Start angled, straighten to 0 as it approaches the front
    const baseAngle = data.side === 'left' ? 50 : -50;
    const rotateY = useTransform(finalZ, [-500, 200], [baseAngle, 0]);

    return (
        <motion.div
            // Anchor top-aligned - Matched Original top-[100px] & height [600px]
            className="absolute top-[100px] left-1/2 w-80 h-[600px] -translate-x-1/2 origin-center"
            style={{
                z: finalZ,
                //@ts-ignore
                x: xBase,
                rotateY: rotateY,
                opacity: opacity,
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                transform: 'translate3d(0,0,0)', // Force hardware acceleration
                willChange: 'transform, opacity'
            }}
        >
            <div className={`relative w-full h-full p-8 rounded-2xl border-2 ${data.side === 'left' ? 'border-r-4' : 'border-l-4'} border-neutral-950/10 dark:border-white/10 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl shadow-2xl flex flex-col justify-end overflow-hidden group hover:bg-white/80 dark:hover:bg-zinc-800 transition-all duration-300`}>

                {/* Number */}
                <span className="absolute top-2 left-6 text-9xl font-black text-black/5 dark:text-white/5 z-0">
                    0{data.id}
                </span>

                {/* Glowing Edge Line */}
                <div className={`absolute inset-y-0 ${data.side === 'left' ? 'right-0' : 'left-0'} w-1 bg-gradient-to-b from-transparent via-mantis-green to-transparent opacity-80`} />

                <div className="relative z-10 transform translate-z-[20px]">
                    <h4 className="text-3xl font-bold text-black dark:text-white mb-4 relative z-10 drop-shadow-xl">
                        {data.title}
                    </h4>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 relative z-10 leading-relaxed">
                        {data.desc}
                    </p>
                </div>

                {/* Inner Gradient/Shine */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
}
