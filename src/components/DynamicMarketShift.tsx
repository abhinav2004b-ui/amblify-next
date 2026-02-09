"use client";

import dynamic from "next/dynamic";

const MarketShift = dynamic(() => import("./MarketShift"), {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black/5" />,
});

export default function DynamicMarketShift() {
    return <MarketShift />;
}
