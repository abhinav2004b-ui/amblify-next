"use client";

import { useState, useEffect, useRef } from 'react';
import { Home, User, Layers, Moon, Sun, Cloud, Mail } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './ThemeDock.css';

export default function ThemeDock() {
    const [theme, setTheme] = useState('dark');
    const [isOpen, setIsOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const savedTheme = localStorage.getItem('amblify-theme');
        if (savedTheme) {
            setTheme(savedTheme);
            updateDomTheme(savedTheme);
        } else {
            const isCloud = document.documentElement.classList.contains('cloud-mode');
            const isDark = document.documentElement.classList.contains('dark');
            const initial = isCloud ? 'cloud' : (isDark ? 'dark' : 'light');
            setTheme(initial);
        }
    }, []);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const cycleTheme = (e: React.MouseEvent) => {
        e.stopPropagation();
        let nextTheme: string;
        if (theme === 'light') nextTheme = 'dark';
        else if (theme === 'dark') nextTheme = 'cloud';
        else nextTheme = 'light';

        setTheme(nextTheme);
        updateDomTheme(nextTheme);
        localStorage.setItem('amblify-theme', nextTheme);
        // Auto-collapse like original
        setTimeout(() => setIsOpen(false), 800);
    };

    const updateDomTheme = (newTheme: string) => {
        if (newTheme === 'cloud') {
            document.documentElement.classList.add('dark', 'cloud-mode');
        } else if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('cloud-mode');
        } else {
            document.documentElement.classList.remove('dark', 'cloud-mode');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const scrollToSection = (id: string) => {
        const targetId = id.replace('#', '');
        if (pathname === '/') {
            const element = document.getElementById(targetId);
            if (element) {
                // We assume Lenis is global or use native smooth scroll
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(`/#${targetId}`);
        }
        setIsOpen(false);
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    const handleNodeClick = (e: React.MouseEvent, id?: string, onClick?: (e: React.MouseEvent) => void) => {
        e.stopPropagation();
        if (id && id.startsWith('#')) {
            e.preventDefault();
            scrollToSection(id);
        } else if (onClick) {
            onClick(e);
        }
        setIsOpen(false);
    };

    const navItems = [
        { icon: Home, label: 'Home', href: '/', onClick: handleHomeClick },
        { icon: User, label: 'Profile', href: '#about' },
        { icon: Layers, label: 'Services', href: '/services' },
        {
            icon: theme === 'light' ? Moon : (theme === 'dark' ? Sun : Cloud),
            label: 'Theme',
            onClick: cycleTheme,
            id: 'theme-toggle'
        },
        { icon: Mail, label: 'Contact', href: '#contact' },
    ];

    return (
        <div
            id="amb-nav-root"
            className="amb-nav-container"
        >
            <div
                ref={navRef}
                className={`amb-nav-system ${isOpen ? 'active' : ''}`}
                onClick={toggleOpen}
            >
                {/* Central AI Sphere */}
                <div
                    className="amb-ai-core"
                    onClick={(e) => { e.stopPropagation(); toggleOpen(); }}
                ></div>

                {/* Navigation Nodes */}
                {navItems.map((item, index) => {
                    const Icon = item.icon as any;
                    let isActive = false;
                    if (item.id !== 'theme-toggle' && pathname) {
                        if (item.href === '/' && pathname === '/') isActive = true;
                        else if (item.href === '/services' && pathname.startsWith('/services')) isActive = true;
                    }

                    const commonClasses = `amb-node node-${index} ${isActive ? 'active-route' : ''}`;

                    if (item.id === 'theme-toggle') {
                        return (
                            <div
                                key={index}
                                className={`${commonClasses} active-link`}
                                onClick={item.onClick}
                            >
                                <Icon size={18} strokeWidth={2.5} />
                                <span className="amb-label">{item.label}</span>
                            </div>
                        );
                    }

                    if (item.href?.startsWith('#')) {
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className={commonClasses}
                                onClick={(e) => handleNodeClick(e, item.href)}
                            >
                                <Icon size={18} strokeWidth={2.5} />
                                <span className="amb-label">{item.label}</span>
                            </a>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href || '#'}
                            className={commonClasses}
                            onClick={(e) => handleNodeClick(e, undefined, item.onClick)}
                        >
                            <Icon size={18} strokeWidth={2.5} />
                            <span className="amb-label">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
