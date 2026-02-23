"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalLoader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set overflow hidden on mount
        document.body.style.overflow = "hidden";

        const timer = setTimeout(() => {
            setIsLoading(false);
            // Reset overflow after animation duration
            document.body.style.overflow = "unset";
        }, 2500);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "unset";
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.2,
                        transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ffffff]"
                >
                    <motion.p
                        animate={{
                            scale: [1, 1.05, 1],
                            filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="text-4xl md:text-6xl font-bold tracking-tighter text-[#1a1a1a]"
                    >
                        hallo
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
