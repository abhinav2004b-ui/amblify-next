"use client";

import { useRef, useEffect } from 'react';

let sessionHighScore = 0;

export default function PuppyRunGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animationFrameId: number;

        const GRAVITY = 0.6;
        const JUMP_FORCE = -12;
        const INITIAL_SPEED = 5;
        const MIN_GAP = 300;

        const OBSTACLE_CHARS = ['W', 'H', 'A', 'T', 'W', 'E', 'D', 'O'];
        let charIndex = 0;

        let groundY: number;
        let obstacles: Obstacle[] = [];
        let score = 0;
        let level = 0;
        let gameSpeed = INITIAL_SPEED;
        let gameOver = true;

        const player = {
            width: 40,
            height: 40,
            x: 50,
            y: 0,
            dy: 0,
            isJumping: false,
            isGrounded: false,

            reset: function () {
                this.y = groundY - this.height;
                this.dy = 0;
                this.isJumping = false;
                this.isGrounded = true;
            },

            jump: function () {
                if (this.isGrounded) {
                    this.dy = JUMP_FORCE;
                    this.isGrounded = false;
                    this.isJumping = true;
                }
            },

            update: function () {
                this.dy += GRAVITY;
                this.y += this.dy;

                if (this.y + this.height >= groundY) {
                    this.y = groundY - this.height;
                    this.dy = 0;
                    this.isGrounded = true;
                    this.isJumping = false;
                } else {
                    this.isGrounded = false;
                }
            },

            draw: function () {
                if (!ctx) return;
                ctx.fillStyle = '#ff6b6b';
                ctx.beginPath();
                // @ts-ignore - roundRect might not be in all TS defs yet
                if (ctx.roundRect) {
                    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
                } else {
                    ctx.rect(this.x, this.y, this.width, this.height);
                }
                ctx.fill();

                ctx.fillStyle = 'white';
                ctx.fillRect(this.x + 24, this.y + 8, 8, 8);
                ctx.fillStyle = 'black';
                ctx.fillRect(this.x + 28, this.y + 10, 4, 4);

                ctx.fillStyle = '#ff4757';
                ctx.beginPath();
                ctx.moveTo(this.x + 10, this.y);
                ctx.lineTo(this.x, this.y + 15);
                ctx.lineTo(this.x + 20, this.y);
                ctx.fill();
            }
        };

        class Obstacle {
            char: string;
            x: number;
            y: number;
            width: number;
            height: number;
            markedForDeletion: boolean;

            constructor(char: string, x: number) {
                this.char = char;
                this.x = x;
                this.y = groundY - 5;
                this.markedForDeletion = false;

                if (ctx) {
                    ctx.font = '900 32px Inter, sans-serif';
                    const metrics = ctx.measureText(char);
                    this.width = metrics.width;
                } else {
                    this.width = 20;
                }
                this.height = 30;
            }

            update() {
                this.x -= gameSpeed;
                if (this.x + this.width < 0) {
                    this.markedForDeletion = true;
                }
            }

            draw() {
                if (!ctx) return;
                const isDark = document.documentElement.classList.contains('dark');
                ctx.fillStyle = isDark ? '#ffffff' : '#000000';
                ctx.font = '900 32px Inter, sans-serif';
                ctx.fillText(this.char, this.x, groundY - 5);
            }
        }

        function resize() {
            if (!containerRef.current || !canvas) return;
            const parent = containerRef.current;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            groundY = canvas.height;
            if (player) player.y = groundY - player.height;
        }

        function spawnObstacles() {
            if (obstacles.length === 0) {
                createObstacle();
            } else {
                const lastObstacle = obstacles[obstacles.length - 1];
                if (canvas && canvas.width - lastObstacle.x > MIN_GAP) {
                    const spawnChance = 0.05 * (gameSpeed / INITIAL_SPEED);
                    if (Math.random() < spawnChance) {
                        createObstacle();
                    }
                }
            }
        }

        function createObstacle() {
            if (!canvas) return;
            const char = OBSTACLE_CHARS[charIndex];
            const obstacle = new Obstacle(char, canvas.width + 50);
            obstacles.push(obstacle);
            charIndex = (charIndex + 1) % OBSTACLE_CHARS.length;
        }

        function checkCollisions() {
            for (let obs of obstacles) {
                if (
                    player.x < obs.x + obs.width - 10 &&
                    player.x + player.width > obs.x + 10 &&
                    player.y + player.height > groundY - 25
                ) {
                    gameOver = true;
                }
            }
        }

        function resetGame() {
            gameOver = false;
            obstacles = [];
            charIndex = 0;
            score = 0;
            level = 0;
            gameSpeed = INITIAL_SPEED;
            player.reset();
        }

        function animate() {
            if (!ctx || !canvas) return;
            const isDark = document.documentElement.classList.contains('dark');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (gameOver) {
                ctx.fillStyle = isDark ? 'white' : 'black';
                ctx.textAlign = 'center';
                ctx.font = 'bold 20px Inter, sans-serif';
                const message = score === 0 ? "Tap to Start" : "Game Over";
                ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 20);

                if (score > 0) {
                    ctx.font = '16px Inter, sans-serif';
                    ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width / 2, canvas.height / 2 + 10);
                    ctx.fillText(`High Score: ${Math.floor(sessionHighScore)}`, canvas.width / 2, canvas.height / 2 + 35);
                    ctx.globalAlpha = 0.6;
                    ctx.font = '12px Inter, sans-serif';
                    ctx.fillText("Tap to Restart", canvas.width / 2, canvas.height / 2 + 65);
                    ctx.globalAlpha = 1.0;
                }
                ctx.textAlign = 'start';
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            score += 0.1;
            if (score > sessionHighScore) sessionHighScore = score;
            const currentLevel = Math.floor(score / 30);
            if (currentLevel > level) {
                gameSpeed += 0.5;
                level = currentLevel;
            }

            player.update();
            player.draw();
            spawnObstacles();
            obstacles.forEach(obs => {
                obs.update();
                obs.draw();
            });
            obstacles = obstacles.filter(obs => !obs.markedForDeletion);
            checkCollisions();

            if (ctx && canvas) {
                ctx.fillStyle = isDark ? 'white' : 'black';
                ctx.font = 'bold 14px Inter, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(`Score: ${Math.floor(score)}`, canvas.width - 20, 30);
                ctx.globalAlpha = 0.7;
                ctx.fillText(`HI: ${Math.floor(sessionHighScore)}`, canvas.width - 20, 50);
                ctx.globalAlpha = 1.0;
                ctx.textAlign = 'start';
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        const handleInput = (e: any) => {
            if (e.type === 'keydown' && (e.code === 'Space' || e.code === 'ArrowUp')) {
                e.preventDefault();
            }
            if (gameOver) {
                resetGame();
            } else {
                player.jump();
            }
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('keydown', handleInput);
        canvas.addEventListener('touchstart', handleInput);
        canvas.addEventListener('mousedown', handleInput);

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('keydown', handleInput);
            canvas.removeEventListener('touchstart', handleInput);
            canvas.removeEventListener('mousedown', handleInput);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="block w-full h-full cursor-pointer touch-none"
            />
        </div>
    );
}
