"use client";

import { useEffect, useRef } from "react";

export default function WeatherOverlay({ weather }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const particlesRef = useRef([]);
  const lastConditionRef = useRef(weather.condition);
  const lightningRef = useRef({ active: false, opacity: 0, x: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Инициализация частиц
    const initParticles = () => {
        const { condition, intensity } = weather;
        const w = canvas.width;
        const h = canvas.height;

        let count = 0;
        if (condition === "rain" || condition === "storm") count = Math.floor(1200 * intensity);
        if (condition === "snow") count = Math.floor(800 * intensity);

        if (Math.abs(particlesRef.current.length - count) > 50) {
            particlesRef.current = [];
            for (let i = 0; i < count; i++) {
                particlesRef.current.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    speed: (condition === "snow" ? 1.5 : 20) + Math.random() * 5,
                    size: (condition === "snow" ? 2 : 15) + Math.random() * 5,
                    opacity: Math.random() * 0.4 + 0.1
                });
            }
            lastConditionRef.current = condition;
        }
    };

    initParticles();

    const render = () => {
        const { condition, wind, lightLevel, isFoggy, intensity, cloudIntensity } = weather;
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);

        // --- 1. ТЕМНОТА (Ночь) ---
        // Рисуем базовую ночь (синюю)
        const darkness = 1 - Math.max(0, Math.min(1, lightLevel));
        if (darkness > 0.05) {
            ctx.fillStyle = `rgba(5, 10, 25, ${darkness * 0.95})`;
            ctx.fillRect(0, 0, w, h);
        }

        // --- 2. ОБЛАЧНОСТЬ (Серость) ---
        // Рисуем отдельный слой серых туч, если есть cloudIntensity, но еще светло
        // Это дает эффект "пасмурного дня" до того, как начнется ночь или дождь
        if (cloudIntensity > 0.1 && lightLevel > 0.2) {
            ctx.fillStyle = `rgba(80, 90, 100, ${cloudIntensity * 0.4})`;
            ctx.fillRect(0, 0, w, h);
        }

        // --- 3. МОЛНИЯ ---
        if (condition === "storm") {
            if (lightningRef.current.active) {
                ctx.fillStyle = `rgba(255, 255, 255, ${lightningRef.current.opacity})`;
                ctx.fillRect(0, 0, w, h);

                // Молния
                ctx.strokeStyle = `rgba(255, 255, 255, ${lightningRef.current.opacity + 0.3})`;
                ctx.lineWidth = 2 + Math.random() * 2;
                ctx.beginPath();
                ctx.moveTo(lightningRef.current.x, 0);

                let lx = lightningRef.current.x;
                let ly = 0;
                while(ly < h * 0.85) {
                    lx += (Math.random() - 0.5) * 60;
                    ly += Math.random() * 40 + 10;
                    ctx.lineTo(lx, ly);
                }
                ctx.stroke();

                lightningRef.current.opacity -= 0.1;
                if (lightningRef.current.opacity <= 0) lightningRef.current.active = false;
            } else {
                // Шанс удара
                if (Math.random() < 0.005 * (intensity + 0.5)) {
                    lightningRef.current.active = true;
                    lightningRef.current.opacity = 0.5 + Math.random() * 0.5;
                    lightningRef.current.x = Math.random() * w;
                }
            }
        }

        // --- 4. ОСАДКИ ---
        if (particlesRef.current.length > 0) {
            const windOffset = wind * 1.5;

            ctx.beginPath();

            if (condition === "snow") {
                ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
                for (let p of particlesRef.current) {
                    p.y += p.speed;
                    p.x += windOffset * 0.4 + Math.sin(p.y * 0.015);

                    if (p.y > h) { p.y = -5; p.x = Math.random() * w; }
                    if (p.x > w) p.x = 0; if (p.x < 0) p.x = w;

                    ctx.moveTo(p.x, p.y);
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                }
                ctx.fill();
            } else {
                // Дождь
                ctx.strokeStyle = "rgba(190, 210, 235, 0.6)";
                ctx.lineWidth = 1.2;
                for (let p of particlesRef.current) {
                    p.y += p.speed;
                    p.x += windOffset;

                    if (p.y > h) { p.y = -20; p.x = Math.random() * w; }
                    if (p.x > w) p.x = 0; if (p.x < 0) p.x = w;

                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x + windOffset * 0.3, p.y + p.size);
                }
                ctx.stroke();
            }
        }

        // --- 5. ТУМАН ---
        if (isFoggy) {
            const grad = ctx.createLinearGradient(0, h, 0, h * 0.35);
            grad.addColorStop(0, "rgba(210, 220, 230, 0.9)");
            grad.addColorStop(1, "rgba(210, 220, 230, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animationRef.current);
    };
  }, [weather]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />;
}