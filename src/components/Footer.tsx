"use client";

export default function Footer() {
    return (
        <footer id="contact" className="h-auto min-h-[50vh] bg-black text-white dark:bg-black [.cloud-mode_&]:bg-transparent dark:text-white flex flex-col justify-between p-8 md:p-12 pb-32 md:pb-32 z-0 relative overflow-hidden transition-colors duration-500">
            {/* Massive Footer Text */}
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-[10vw] leading-[0.8] font-black tracking-tightest text-center md:text-left uppercase">
                    LET&apos;S<br />SCALE
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">
                <div>
                    <h3 className="font-bold uppercase tracking-widest mb-4">Contact</h3>
                    <p className="font-mono text-sm">amblify@workwithabhinav.com</p>
                    <p className="font-mono text-sm">+1 (555) 019-2834</p>
                </div>
                <div>
                    <h3 className="font-bold uppercase tracking-widest mb-4">Socials</h3>
                    <ul className="space-y-2 font-mono text-sm">
                        <li><a href="https://www.linkedin.com/in/abhinav-b-lal/" className="hover:underline" target="_blank" rel="noopener noreferrer">LinkedIn / Professional</a></li>
                        <li><a href="#" className="hover:underline">Twitter / X</a></li>
                        <li><a href="https://www.instagram.com/amblify.in/" className="hover:underline" target="_blank" rel="noopener noreferrer">Instagram / Visuals</a></li>
                    </ul>
                </div>
                <div className="text-right flex flex-col justify-end">
                    <p className="text-xs uppercase tracking-widest opacity-60">© 2025 Amblify</p>
                </div>
            </div>
        </footer>
    )
}
