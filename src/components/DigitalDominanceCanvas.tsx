"use client";

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const DigitalDominanceCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || shouldReduceMotion) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        let width: number, height: number;
        let animationFrameId: number;

        const config = {
            nodeCount: 20,
            connectionDistance: 130,
            primaryColor: 'rgba(79, 209, 197, 1)',
            secondaryColor: 'rgba(79, 209, 197, 0.2)',
            neutralColor: 'rgba(200, 200, 200, 0.5)',
            pulseSpeed: 0.05
        };

        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            config.neutralColor = 'rgba(255, 255, 255, 0.2)';
        }

        let nodes: Node[] = [];
        let pulseRadius = 0;

        class Node {
            isCenter: boolean;
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            isConnected: boolean;
            pulseOffset: number;

            constructor(isCenter = false) {
                this.isCenter = isCenter;
                this.x = isCenter ? width / 2 : Math.random() * width;
                this.y = isCenter ? height / 2.2 : Math.random() * height;
                this.vx = isCenter ? 0 : (Math.random() - 0.5) * 0.8;
                this.vy = isCenter ? 0 : (Math.random() - 0.5) * 0.8;
                this.size = isCenter ? 12 : Math.random() * 3 + 2;
                this.isConnected = false;
                this.pulseOffset = Math.random() * 10;
            }

            update() {
                if (!this.isCenter) {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > width) this.vx *= -1;
                    if (this.y < 0 || this.y > height) this.vy *= -1;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                if (this.isCenter) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = config.primaryColor;
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = config.primaryColor;
                    ctx.stroke();

                    const ringSize = 20 + Math.sin(Date.now() * 0.002) * 5;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, ringSize, 0, Math.PI * 2);
                    ctx.strokeStyle = config.secondaryColor;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    ctx.shadowBlur = this.isConnected ? 10 : 0;
                    ctx.shadowColor = config.primaryColor;
                    ctx.fillStyle = this.isConnected ? config.primaryColor : config.neutralColor;
                    ctx.fill();
                }
                ctx.shadowBlur = 0;
            }
        }

        const initNodes = () => {
            nodes = [];
            nodes.push(new Node(true));
            for (let i = 0; i < config.nodeCount; i++) {
                nodes.push(new Node(false));
            }
        };

        const drawConnections = (ctx: CanvasRenderingContext2D) => {
            const centerNode = nodes[0];
            pulseRadius += 2;
            if (pulseRadius > Math.max(width, height)) pulseRadius = 0;

            ctx.beginPath();
            ctx.arc(centerNode.x, centerNode.y, pulseRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(79, 209, 197, ${1 - pulseRadius / 300})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            nodes.forEach((node, index) => {
                if (index === 0) return;
                const dx = centerNode.x - node.x;
                const dy = centerNode.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const hitByPulse = Math.abs(dist - pulseRadius) < 20;

                if (dist < config.connectionDistance || hitByPulse) {
                    node.isConnected = true;
                    ctx.beginPath();
                    ctx.moveTo(centerNode.x, centerNode.y);
                    ctx.lineTo(node.x, node.y);
                    const opacity = 1 - (dist / config.connectionDistance);
                    ctx.strokeStyle = `rgba(79, 209, 197, ${opacity})`;
                    ctx.lineWidth = hitByPulse ? 2 : 1;
                    ctx.stroke();
                } else {
                    node.isConnected = false;
                }
            });
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * scale;
            canvas.height = height * scale;
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            initNodes();
        };

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, width, height);
            nodes.forEach(node => node.update());
            drawConnections(ctx);
            nodes.forEach(node => node.draw(ctx));
            animationFrameId = requestAnimationFrame(animate);
        };

        const timer = setTimeout(() => {
            resize();
            animate();
        }, 50);

        window.addEventListener('resize', resize);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [shouldReduceMotion]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{
                    maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
                }}
            />
        </div>
    );
};

export default DigitalDominanceCanvas;
