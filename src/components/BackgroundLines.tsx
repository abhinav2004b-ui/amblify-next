"use client";

import { motion } from 'framer-motion';

const verticalLines = [...Array(6)].map((_, i) => ({
    id: i,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 5
}));

const diagonalLines = [...Array(3)].map((_, i) => ({
    id: i,
    top: 30 * (i + 1),
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5
}));

export default function BackgroundLines() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Grid of lines */}
            <div className="absolute inset-0 flex justify-between opacity-20">
                {verticalLines.map((line) => (
                    <motion.div
                        key={line.id}
                        className="w-[1px] h-full bg-gradient-to-b from-transparent via-gray-300 dark:via-white/20 to-transparent transition-colors duration-500"
                        initial={{ y: "-100%" }}
                        animate={{ y: "100%" }}
                        transition={{
                            duration: line.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: line.delay
                        }}
                    />
                ))}
            </div>

            {/* Diagonal moving lines for extra depth */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                {diagonalLines.map((line) => (
                    <motion.div
                        key={`diag-${line.id}`}
                        className="absolute h-[1px] w-[150%] bg-black dark:bg-white origin-left transition-colors duration-500"
                        style={{
                            left: -200,
                            top: `${line.top}%`,
                            rotate: 15
                        }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: line.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: line.delay
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
