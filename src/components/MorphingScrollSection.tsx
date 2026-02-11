"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

// ... (shaders omitted for brevity in thought, but I must keep them or skip them in replacement)

// I will target the imports and the component body separately to avoid matching the huge shader strings.


// -----------------------------------------------------------------------------
// SHADERS
// -----------------------------------------------------------------------------

const morphVertexShader = `
uniform float uTime;
uniform float uScroll; 

attribute vec3 aPosRandom;   
attribute vec3 aPosPlane;    
attribute vec3 aPosCylinder; 

attribute float aSize;
varying vec3 vColor;
varying float vAlpha;

float easeInOutCubic(float x) {
    return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
}

void main() {
  float stage1 = smoothstep(0.0, 0.45, uScroll); 
  float stage2 = smoothstep(0.55, 1.0, uScroll); 
  
  vec3 currentPos = mix(aPosRandom, aPosPlane, easeInOutCubic(stage1));
  
  currentPos.x += sin(uTime * 0.5 + currentPos.y) * 0.2;
  currentPos.z += cos(uTime * 0.3 + currentPos.x) * 0.2;

  vec3 cylinderPos = aPosCylinder;
  currentPos = mix(currentPos, cylinderPos, easeInOutCubic(stage2));

  currentPos.x += sin(currentPos.y * 10.0 + uTime) * 0.02;

  vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = (aSize * 3.0 + 1.0) * (20.0 / -mvPosition.z);
  vColor = vec3(0.9, 0.95, 1.0);
  vAlpha = 0.8;
}
`;

const morphFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 coords = gl_PointCoord - 0.5;
  float dist = length(coords);
  if (dist > 0.5) discard;
  
  float glow = 1.0 - (dist * 2.0);
  glow = pow(glow, 2.0);

  gl_FragColor = vec4(vColor, vAlpha * glow);
}
`;

// -----------------------------------------------------------------------------
// PARTICLE SYSTEM
// -----------------------------------------------------------------------------

function MorphingParticles({ count = 80 }: { count?: number }) {
    const points = useRef<THREE.Points>(null);

    const data = useMemo(() => {
        const numParticles = count * count;
        const positions = new Float32Array(numParticles * 3);
        const posRandom = new Float32Array(numParticles * 3);
        const posPlane = new Float32Array(numParticles * 3);
        const posCylinder = new Float32Array(numParticles * 3);
        const sizes = new Float32Array(numParticles);

        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = x / count;
                const v = y / count;

                posRandom[i * 3] = (Math.random() - 0.5) * 15;
                posRandom[i * 3 + 1] = (Math.random() - 0.5) * 15;
                posRandom[i * 3 + 2] = (Math.random() - 0.5) * 10;

                posPlane[i * 3] = (u - 0.5) * 12;
                posPlane[i * 3 + 1] = 0;
                posPlane[i * 3 + 2] = (v - 0.5) * 12;

                const theta = u * Math.PI * 2;
                const radius = 3;
                const length = (v - 0.5) * 12;

                posCylinder[i * 3] = radius * Math.cos(theta);
                posCylinder[i * 3 + 1] = radius * Math.sin(theta);
                posCylinder[i * 3 + 2] = length;

                sizes[i] = Math.random();
                i++;
            }
        }

        return { positions, posRandom, posPlane, posCylinder, sizes };
    }, [count]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uScroll: { value: 0 }
    }), []);

    useFrame((state) => {
        const { clock } = state;
        const canvas = state.gl.domElement;
        const section = canvas.closest('.scroll-section');

        let scrollProgress = 0;
        if (section) {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const totalHeight = rect.height - viewportHeight;
            const scrolled = -rect.top;
            scrollProgress = Math.min(Math.max(scrolled / totalHeight, 0), 1);
        }

        if (points.current && points.current.material) {
            (points.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
            (points.current.material as THREE.ShaderMaterial).uniforms.uScroll.value = scrollProgress;
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={data.positions.length / 3} array={data.positions} itemSize={3} args={[data.positions, 3]} />
                <bufferAttribute attach="attributes-aPosRandom" count={data.posRandom.length / 3} array={data.posRandom} itemSize={3} args={[data.posRandom, 3]} />
                <bufferAttribute attach="attributes-aPosPlane" count={data.posPlane.length / 3} array={data.posPlane} itemSize={3} args={[data.posPlane, 3]} />
                <bufferAttribute attach="attributes-aPosCylinder" count={data.posCylinder.length / 3} array={data.posCylinder} itemSize={3} args={[data.posCylinder, 3]} />
                <bufferAttribute attach="attributes-aSize" count={data.sizes.length} array={data.sizes} itemSize={1} args={[data.sizes, 1]} />
            </bufferGeometry>
            <shaderMaterial
                depthWrite={false}
                transparent={true}
                blending={THREE.AdditiveBlending}
                vertexShader={morphVertexShader}
                fragmentShader={morphFragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
}

export default function MorphingScrollSection() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="scroll-section relative h-[400vh] w-full bg-black hidden dark:block">
            <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
                {!shouldReduceMotion && (
                    <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
                        <MorphingParticles count={100} />
                    </Canvas>
                )}
            </div>

            <div className="absolute top-0 left-0 w-full z-10 pointer-events-none">
                <div className="h-screen flex items-center justify-center">
                    <h2 className="text-6xl font-bold text-white tracking-widest mix-blend-difference opacity-80 backdrop-blur-sm uppercase">
                        Origin
                    </h2>
                </div>

                <div className="h-screen flex items-center justify-center">
                    <h2 className="text-6xl font-bold text-white tracking-widest mix-blend-difference opacity-80 backdrop-blur-sm uppercase">
                        Barrier
                    </h2>
                </div>

                <div className="h-[200vh] flex items-start pt-[50vh] justify-center">
                    <h2 className="text-6xl font-bold text-white tracking-widest mix-blend-difference opacity-80 backdrop-blur-sm uppercase">
                        Cylinder
                    </h2>
                </div>
            </div>
        </section>
    );
}
