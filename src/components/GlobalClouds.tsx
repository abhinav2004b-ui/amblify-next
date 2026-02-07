"use client";

import { Canvas } from '@react-three/fiber';
import { Cloud, Float } from '@react-three/drei';

export default function GlobalClouds() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-0 [.cloud-mode_&]:opacity-100 [.dark_&]:opacity-40 transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Scene />
            </Canvas>
        </div>
    );
}

function Scene() {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Cloud
                seed={1}
                position={[0, 0, 0]}
                opacity={0.2}
                speed={0.4}
                segments={40}
                bounds={[20, 2, 5]}
                volume={10}
                color="white"
            />
        </Float>
    );
}
