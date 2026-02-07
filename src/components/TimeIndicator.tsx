"use client";

import { useState, useEffect } from 'react';

export default function TimeIndicator() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const istTime = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now);
            setTime(istTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Return null on server/initial render to match hydration if needed, 
    // but for now we'll just render the structure.
    // Suppressing hydration warning for time since it's client-only data
    return (
        <div className="fixed top-8 right-8 z-50 text-white mix-blend-difference text-right hidden md:block" suppressHydrationWarning>
            <div className="text-sm font-mono">
                {time} IST
            </div>
            <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] opacity-60">
                Sector 7
            </div>
        </div>
    );
}
