"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

const features = [
    {
        id: 'speed',
        title: 'Speed',
        subtitle: 'The Agility Factor',
        description: 'Direct access to the architect. No middle-managers. Changes happen in minutes, not days. We move fast and break nothing.',
        color: 'text-[#74C69D]'
    },
    {
        id: 'cost',
        title: 'Cost',
        subtitle: 'Budget Optimization',
        description: 'Zero agency overhead. 100% of your budget goes into the work that drives results. Why pay for their office rent?',
        color: 'text-blue-400'
    },
    {
        id: 'focus',
        title: 'Focus',
        subtitle: 'Undivided Attention',
        description: 'I work with a limited set of clients, ensuring your brand gets the deep dive it deserves. You are not just Account #402.',
        color: 'text-purple-400'
    }
];

export default function WhyKollam() {
    return (
        <section className="bg-white dark:bg-black [.cloud-mode_&]:bg-transparent text-black dark:text-white py-32 px-4 md:px-12 relative overflow-hidden transition-colors duration-500">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern-wk" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern-wk)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <InteractiveBlock />
            </div>
        </section>
    );
}

function InteractiveBlock() {
    const [activeFeature, setActiveFeature] = useState<any>(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const isHoveringRef = useRef(false);

    const checkCollision = (point: { x: number; y: number }) => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return false;
        const dropRect = dropZone.getBoundingClientRect();
        return (
            point.x >= dropRect.left &&
            point.x <= dropRect.right &&
            point.y >= dropRect.top &&
            point.y <= dropRect.bottom
        );
    };

    const handleDrag = (_: any, info: PanInfo) => {
        const hovering = checkCollision(info.point);
        setIsHovering(hovering);
        isHoveringRef.current = hovering;
    };

    const handleDragEnd = (_: any, info: PanInfo, feature: any) => {
        setIsHovering(false);
        if (isHoveringRef.current || checkCollision(info.point)) {
            triggerFlash(feature);
        }
        isHoveringRef.current = false;
    };

    const triggerFlash = (feature: any) => {
        setIsFlashing(true);
        setTimeout(() => {
            setActiveFeature(feature);
            setIsFlashing(false);
        }, 100);
    };

    return (
        <div className="grid md:grid-cols-2 gap-16 items-start md:h-[600px]">
            {/* LEFT: Drop Zone / Display Box */}
            <div
                ref={dropZoneRef}
                className={`relative h-[400px] md:h-full w-full bg-gray-50 dark:bg-white/5 rounded-lg border-2 overflow-hidden flex flex-col items-center justify-center p-8 text-center transition-all duration-300 shadow-2xl z-10 ${isHovering
                    ? 'border-[#74C69D] bg-[#74C69D]/10 scale-[1.02]'
                    : 'border-black/10 dark:border-white/10'
                    }`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#74C69D]/10 to-transparent opacity-30 pointer-events-none" />

                <AnimatePresence>
                    {isFlashing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                            className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {activeFeature ? (
                        <motion.div
                            key={activeFeature.id}
                            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                            transition={{ duration: 0.4 }}
                            className="relative z-10 max-w-lg"
                        >
                            <span className="text-[#74C69D] font-mono text-sm tracking-widest uppercase mb-4 block">
                                {activeFeature.subtitle}
                            </span>
                            <h3 className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 uppercase tracking-wider">
                                {activeFeature.title}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                                {activeFeature.description}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10 pointer-events-none select-none"
                        >
                            <h4 className={`text-2xl md:text-3xl font-bold uppercase tracking-widest animate-pulse font-mono transition-colors ${isHovering ? 'text-[#74C69D]' : 'text-black/20 dark:text-white/20'
                                }`}>
                                {isHovering ? '[ RELEASE TO DECRYPT ]' : '[ INITIATING UPLINK ]'}
                            </h4>
                            <p className="mt-4 text-xs md:text-sm text-[#74C69D]/50 font-mono tracking-[0.2em] uppercase">
                                Drag Data Module Here
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{
                        width: activeFeature ? "60%" : "30%",
                        opacity: activeFeature ? 1 : 0.3,
                        boxShadow: isFlashing ? "0 0 50px rgba(255,255,255,0.8)" : "0 0 20px rgba(116,198,157,0.5)"
                    }}
                    className="absolute bottom-16 h-[2px] bg-[#74C69D] transition-all"
                />
            </div>

            {/* RIGHT: Content Column */}
            <div className="flex flex-col h-full justify-center z-20">
                <div className="mb-12 pointer-events-none">
                    <span className="text-gray-500 dark:text-white/20 font-mono text-sm tracking-widest uppercase mb-4 block">
                        The Agility Factor
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] uppercase mb-8">
                        Why a Freelance Digital Marketer in Kollam?
                    </h2>
                </div>

                <div className="flex flex-col space-y-4">
                    {features.map((feature) => (
                        <motion.button
                            key={feature.id}
                            layoutId={feature.id}
                            drag
                            dragSnapToOrigin={true}
                            onDrag={(e, info) => handleDrag(e, info)}
                            onDragEnd={(e, info) => handleDragEnd(e, info, feature)}
                            whileHover={{ scale: 1.02, x: 10 }}
                            whileDrag={{ scale: 1.1, zIndex: 100, cursor: 'grabbing' }}
                            onClick={() => setActiveFeature(feature)}
                            className={`group relative text-left p-6 border-l-4 transition-colors duration-300 rounded-r-lg overflow-hidden cursor-grab active:cursor-grabbing ${activeFeature?.id === feature.id
                                ? 'border-[#74C69D] bg-black/5 dark:bg-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] translate-x-4'
                                : 'border-black/20 dark:border-white/20 bg-white dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 hover:border-[#74C69D]/50'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#74C69D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <h4 className={`text-2xl font-black uppercase tracking-widest transition-colors duration-300 pointer-events-none ${activeFeature?.id === feature.id ? 'text-[#74C69D]' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'
                                }`}>
                                {feature.title} - <span className="text-xs align-middle opacity-50 font-mono tracking-normal">DRAG ME</span>
                            </h4>
                            <p className={`mt-1 text-xs font-mono uppercase tracking-wider transition-all duration-300 pointer-events-none ${activeFeature?.id === feature.id ? 'text-black dark:text-white' : 'text-gray-500'
                                }`}>
                                {feature.subtitle}
                            </p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    )
}
