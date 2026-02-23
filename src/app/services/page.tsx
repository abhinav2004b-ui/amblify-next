"use client";

import dynamic from "next/dynamic";

const DetailedServices = dynamic(() => import("@/components/DetailedServices"), {
    ssr: false,
    loading: () => <div className="h-[400vh] w-full bg-black/5 animate-pulse" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
    ssr: false,
    loading: () => <div className="h-[60vh] w-full bg-black/5" />,
});


export default function ServicesPage() {
    return (
        <main>
            <DetailedServices />
            <Footer />
        </main>
    );
}
