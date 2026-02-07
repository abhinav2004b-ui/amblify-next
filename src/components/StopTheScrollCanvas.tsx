"use client";

import React, { useEffect, useRef } from 'react';

const StopTheScrollCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        let width: number, height: number;
        let animationFrameId: number;

        const config = {
            columnCount: 2,
            gap: 20,
            baseSpeed: 8,
            color: 'rgba(79, 209, 197, 0.15)',
            highlightColor: 'rgba(79, 209, 197, 1)',
            highlightFill: 'rgba(255, 255, 255, 1)',
            highlightFillDark: 'rgba(23, 23, 23, 1)',
            textFill: 'rgba(79, 209, 197, 0.2)',
            textFillDark: 'rgba(255, 255, 255, 0.1)',
        };

        enum STATE_TYPE {
            SCROLLING = 'scrolling',
            BRAKING = 'braking',
            SNAPPING = 'snapping',
            HOLDING = 'holding'
        }

        let currentState = STATE_TYPE.SCROLLING;
        let currentSpeed = config.baseSpeed;
        let feedItems: FeedPost[] = [];
        let stateTimer = 0;
        let snapTargetItem: FeedPost | null = null;
        let cycleStartTime = Date.now();

        function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
            if (w <= 0 || h <= 0) return;
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        class FeedPost {
            x: number;
            y: number;
            w: number;
            h: number;
            hasImage: boolean;
            lines: number;

            constructor(x: number, y: number, w: number, h: number) {
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
                this.hasImage = Math.random() > 0.3;
                this.lines = Math.floor(Math.random() * 3) + 1;
            }

            update(speed: number) {
                this.y -= speed;
                if (this.y + this.h < -50 && currentState === STATE_TYPE.SCROLLING) {
                    this.y = height + 50;
                    this.h = Math.random() * 100 + 100;
                }
            }

            draw(ctx: CanvasRenderingContext2D, isHighlighted: boolean) {
                const isDark = document.documentElement.classList.contains('dark');
                ctx.save();

                if (isHighlighted) {
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = 'rgba(0,0,0,0.1)';
                    ctx.fillStyle = isDark ? config.highlightFillDark : config.highlightFill;
                    ctx.strokeStyle = config.highlightColor;
                    ctx.lineWidth = 2;
                } else {
                    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.05)' : config.color;
                }

                roundedRect(ctx, this.x, this.y, this.w, this.h, 12);
                ctx.fill();
                if (isHighlighted) ctx.stroke();

                ctx.shadowBlur = 0;
                const padding = 15;
                let contentY = this.y + padding;
                const accent = isHighlighted ? config.highlightColor : 'rgba(79, 209, 197, 0.3)';
                const textFill = isHighlighted
                    ? 'rgba(79, 209, 197, 0.2)'
                    : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(79, 209, 197, 0.2)');

                ctx.beginPath();
                ctx.arc(this.x + padding + 10, contentY + 10, 10, 0, Math.PI * 2);
                ctx.fillStyle = accent;
                ctx.fill();

                ctx.fillStyle = textFill;
                roundedRect(ctx, this.x + padding + 30, contentY + 6, this.w * 0.4, 8, 4);
                ctx.fill();

                contentY += 35;
                if (this.hasImage) {
                    const imgHeight = this.h * 0.4;
                    ctx.fillStyle = isHighlighted ? 'rgba(79, 209, 197, 0.1)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(79, 209, 197, 0.1)');
                    roundedRect(ctx, this.x + padding, contentY, this.w - (padding * 2), imgHeight, 8);
                    ctx.fill();
                    contentY += imgHeight + 10;
                }

                ctx.fillStyle = textFill;
                for (let i = 0; i < this.lines; i++) {
                    if (contentY + 8 < this.y + this.h - padding) {
                        const lineWidth = i === this.lines - 1 ? (this.w - padding * 2) * 0.6 : (this.w - padding * 2);
                        roundedRect(ctx, this.x + padding, contentY, lineWidth, 6, 3);
                        ctx.fill();
                        contentY += 14;
                    }
                }
                ctx.restore();
            }
        }

        const initFeed = () => {
            feedItems = [];
            if (!width || width <= 0) return;
            const colWidth = (width - (config.gap * 3)) / 2;
            if (colWidth <= 0) return;

            [0, 1].forEach(colIndex => {
                let yPos = height + 100;
                const xPos = config.gap + (colIndex * (colWidth + config.gap));
                while (yPos > -300) {
                    const h = Math.random() * 100 + 120;
                    yPos -= (h + config.gap);
                    const startY = colIndex % 2 === 0 ? yPos : yPos - 50;
                    feedItems.push(new FeedPost(xPos, startY, colWidth, h));
                }
            });
        };

        const getCentralItem = () => {
            const center = height / 2;
            let closest: FeedPost | null = null;
            let minDist = Infinity;
            feedItems.forEach(item => {
                const itemCenter = item.y + (item.h / 2);
                const dist = Math.abs(itemCenter - center);
                if (dist < minDist) {
                    minDist = dist;
                    closest = item;
                }
            });
            return closest;
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = width * scale;
            canvas.height = height * scale;
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            initFeed();
            cycleStartTime = Date.now();
            currentState = STATE_TYPE.SCROLLING;
        };

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, width, height);
            const now = Date.now();
            const timeInCycle = now - cycleStartTime;

            switch (currentState) {
                case STATE_TYPE.SCROLLING:
                    currentSpeed = config.baseSpeed;
                    if (timeInCycle > 2000) currentState = STATE_TYPE.BRAKING;
                    break;
                case STATE_TYPE.BRAKING:
                    currentSpeed *= 0.90;
                    if (currentSpeed < 0.5) {
                        currentSpeed = 0;
                        currentState = STATE_TYPE.SNAPPING;
                        snapTargetItem = getCentralItem();
                    }
                    break;
                case STATE_TYPE.SNAPPING:
                    if (snapTargetItem) {
                        const targetY = (height / 2) - (snapTargetItem.h / 2);
                        const diff = targetY - snapTargetItem.y;
                        const snapSpeed = diff * 0.15;
                        feedItems.forEach(item => item.y += snapSpeed);
                        if (Math.abs(diff) < 0.5) {
                            currentState = STATE_TYPE.HOLDING;
                            stateTimer = now;
                        }
                    } else {
                        currentState = STATE_TYPE.SCROLLING;
                    }
                    break;
                case STATE_TYPE.HOLDING:
                    currentSpeed = 0;
                    if (now - stateTimer > 2500) {
                        currentState = STATE_TYPE.SCROLLING;
                        cycleStartTime = now;
                        snapTargetItem = null;
                    }
                    break;
            }

            feedItems.forEach(item => {
                if (currentState === STATE_TYPE.SCROLLING || currentState === STATE_TYPE.BRAKING) {
                    item.update(currentSpeed);
                }
                const isTarget = (currentState === STATE_TYPE.HOLDING || currentState === STATE_TYPE.SNAPPING) && item === snapTargetItem;
                item.draw(ctx, isTarget);
            });
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
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                }}
            />
        </div>
    );
};

export default StopTheScrollCanvas;
