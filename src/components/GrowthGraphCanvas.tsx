"use client";

import React, { useEffect, useRef } from 'react';

const GrowthGraphCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width: number, height: number;
        let runner: GraphRunner;
        let particles: Particle[] = [];
        let bars: Bar[] = [];
        const scale = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

        // Theme Configuration
        const theme = {
            primary: 'rgba(16, 185, 129, 1)',   // Emerald-500
            trail: 'rgba(16, 185, 129, 0.4)',
            bar: 'rgba(16, 185, 129, 0.15)',
            arrow: '#064E3B'                    // Emerald-900 (Dark)
        };

        // --- Classes ---

        class Bar {
            x: number;
            y: number;
            width: number;
            targetHeight: number;
            currentHeight: number;

            constructor(x: number, targetHeight: number, baseline: number) {
                this.x = x;
                this.y = baseline;
                this.width = 30;
                this.targetHeight = targetHeight;
                this.currentHeight = 0;
            }

            update() {
                this.currentHeight += (this.targetHeight - this.currentHeight) * 0.1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = theme.bar;
                const rectTop = this.y - this.currentHeight;
                if (this.currentHeight > 1) {
                    roundedRect(ctx, this.x - (this.width / 2), rectTop, this.width, this.currentHeight, 6);
                    ctx.fill();
                }
            }
        }

        class GraphRunner {
            x!: number;
            y!: number;
            speed!: number;
            angle!: number;
            targetY!: number;
            lastBarX!: number;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = 0;
                this.y = height * 0.6;
                this.speed = 3;
                this.angle = 0;
                this.targetY = this.y;
                this.lastBarX = -50;
            }

            update(baseline: number) {
                this.x += this.speed;

                const progress = this.x / width;
                const slopeY = (height * 0.7) - (progress * (height * 0.4));
                const volatility = Math.sin(this.x * 0.05) * 20 + Math.sin(this.x * 0.02) * 40;

                this.targetY = slopeY + volatility;
                this.y += (this.targetY - this.y) * 0.1;

                const nextTargetY = (slopeY - (1 * (height * 0.4) / width)) + (Math.sin((this.x + 1) * 0.05) * 20 + Math.sin((this.x + 1) * 0.02) * 40);
                const dy = nextTargetY - this.targetY;
                this.angle = Math.atan2(dy, this.speed);

                if (this.x < width) {
                    if (Math.random() > 0.4) {
                        particles.push(new Particle(this.x, this.y));
                    }
                }

                const barSpacing = 45;
                if (this.x > this.lastBarX + barSpacing && this.x < width - 20) {
                    const barHeight = baseline - this.y - 15;
                    if (barHeight > 0) {
                        bars.push(new Bar(this.x, barHeight, baseline));
                    }
                    this.lastBarX = this.x;
                }

                if (this.x > width + 50) {
                    this.reset();
                    particles = [];
                    bars = [];
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                ctx.fillStyle = theme.arrow;
                ctx.beginPath();
                ctx.moveTo(10, 0);
                ctx.lineTo(-5, 5);
                ctx.lineTo(-5, -5);
                ctx.fill();

                ctx.restore();
            }
        }

        class Particle {
            x: number;
            y: number;
            size: number;
            life: number;
            decay: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.life = 1;
                this.decay = 0.005;
            }

            update() {
                this.life -= this.decay;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = `rgba(16, 185, 129, ${this.life})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        const resize = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * scale;
            canvas.height = height * scale;
            ctx.setTransform(scale, 0, 0, scale, 0, 0);

            if (runner) runner.reset();
            particles = [];
            bars = [];
        };

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, width, height);
            const baseline = height;

            bars.forEach(bar => {
                bar.update();
                bar.draw(ctx);
            });

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }

            if (runner) {
                runner.update(baseline);
                runner.draw(ctx);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const init = () => {
            resize();
            runner = new GraphRunner();
            animate();
        };

        const timer = setTimeout(init, 50);
        window.addEventListener('resize', resize);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default GrowthGraphCanvas;
