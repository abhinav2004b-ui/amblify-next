"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Lenis from 'lenis';
import BackgroundLines from './BackgroundLines';
import GlobalClouds from './GlobalClouds';
import ThemeDock from './ThemeDock';
import AiAssistant from './AiAssistant';
import TimeIndicator from './TimeIndicator';
import Link from 'next/link';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [lenisRef, setLenisRef] = useState<Lenis | null>(null);

    // Initialize Lenis
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        setLenisRef(lenis);

        return () => {
            lenis.destroy();
            setLenisRef(null);
        };
    }, []);

    // Scroll to Top on Path Change (Manual for Lenis)
    useEffect(() => {
        if (lenisRef) {
            lenisRef.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenisRef]);

    // Robust Smooth Scroll Helper
    const scrollToSection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        const targetId = id.replace('#', '');

        if (pathname === '/') {
            const element = document.getElementById(targetId);
            if (element && lenisRef) {
                lenisRef.scrollTo(element, { offset: -50, duration: 1.5 });
            } else if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(`/#${targetId}`);
        }
    };

    const isHomePage = pathname === '/';

    return (
        <div className="relative w-full min-h-screen text-black dark:text-white transition-colors duration-500">
            {/* Global Background Layer */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <BackgroundLines />
                <GlobalClouds />
            </div>

            {/* --- BRAND HEADER (Top Left) --- */}
            <header className="fixed top-8 left-8 z-50 text-white mix-blend-difference">
                <Link href="/" className="block">
                    <h1 className="text-sm font-bold tracking-widest lowercase">
                        amblify
                    </h1>
                </Link>
            </header>

            {/* --- TIME INDICATOR (Top Right) --- */}
            <TimeIndicator />

            {/* --- STATUS INDICATOR (Bottom Left) --- */}
            <div className="fixed bottom-8 left-8 z-50 text-white mix-blend-difference hidden md:block">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#ffffff]" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">System Online</span>
                </div>
            </div>

            {/* --- SIDEBAR NAVIGATION --- */}
            {/* Left Sidebar - Home Only (Original Logic) */}
            {isHomePage && (
                <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:block text-white mix-blend-difference">
                    <div className="flex flex-col gap-12 -rotate-90 origin-center">
                        <a
                            href="#services"
                            onClick={(e) => scrollToSection(e, 'services')}
                            className="text-[10px] font-bold tracking-[0.3em] uppercase hover:opacity-100 opacity-60 transition-opacity whitespace-nowrap"
                        >
                            Agency Services
                        </a>
                    </div>
                </nav>
            )}

            {/* Right Sidebar - Always (Original Logic) */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block text-white mix-blend-difference">
                <div className="flex flex-col gap-12 rotate-90 origin-center">
                    <Link
                        href="/#about"
                        onClick={(e) => isHomePage && scrollToSection(e, 'about')}
                        className="text-[10px] font-bold tracking-[0.3em] uppercase hover:opacity-100 opacity-60 transition-opacity whitespace-nowrap"
                    >
                        Agency Profile
                    </Link>
                </div>
            </nav>

            {/* Main Content Wrapper - Matches Original Layout.jsx */}
            <main className="relative z-10 w-full">
                {children}
            </main>

            {/* Global Interface Elements - ALWAYS SHOWN */}
            <ThemeDock />
            <AiAssistant />

            {/* Smooth Scroll Utility Class Handling */}
            <style jsx global>{`
                html.lenis {
                    height: auto;
                }
                .lenis.lenis-smooth {
                    scroll-behavior: auto;
                }
                .lenis.lenis-smooth [data-lenis-prevent] {
                    overscroll-behavior: contain;
                }
                .lenis.lenis-stopped {
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
