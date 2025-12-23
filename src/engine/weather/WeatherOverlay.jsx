"use client";

import { useEffect, useRef } from "react";

// Линейная интерполяция для плавности
const lerp = (start, end, t) => start * (1 - t) + end * t;

export default function WeatherOverlay({ weather, gameTime }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particles = useRef([]);
  const lightning = useRef({ active: false, life: 0, x: 0 });

  // Храним текущие визуальные значения для плавного перехода (Lerp)
  const visualState = useRef({
      lightLevel: weather.lightLevel,
      cloudDensity: weather.cloudDensity,
      fogDensity: weather.fogDensity,
      intensity: weather.intensity,
      wind: weather.wind
  });

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

    const render = () => {
        const w = canvas.width;
        const h = canvas.height;

        // 1. ИНТЕРПОЛЯЦИЯ (СГЛАЖИВАНИЕ)
        visualState.current.lightLevel = lerp(visualState.current.lightLevel, weather.lightLevel, 0.05);
        visualState.current.cloudDensity = lerp(visualState.current.cloudDensity, weather.cloudDensity, 0.02);
        visualState.current.fogDensity = lerp(visualState.current.fogDensity, weather.fogDensity || 0, 0.02);
        visualState.current.intensity = lerp(visualState.current.intensity, weather.intensity || 0, 0.02);
        visualState.current.wind = lerp(visualState.current.wind, weather.wind, 0.05);

        const { lightLevel, cloudDensity, fogDensity, intensity, wind } = visualState.current;
        const { condition, sunrise, sunset } = weather;

        const timeOfDay = gameTime % 1440;

        // Очистка
        ctx.clearRect(0, 0, w, h);

        // --- 2. ОБЛАКА (Фон) ---
        // Рисуем облака ПЕРЕД ночью, чтобы ночь их затемняла
        if (cloudDensity > 0.05) {
            const isDarkClouds = condition === 'storm' || condition === 'heavy_rain';
            // Базовый цвет облаков
            const cloudColor = isDarkClouds ? '30, 35, 40' : '200, 210, 220';
            // Интенсивность меняет плотность (сделали прозрачнее: 0.5/0.2 вместо 0.7/0.3)
            const cloudAlpha = cloudDensity * (isDarkClouds ? 0.5 : 0.2);

            ctx.fillStyle = `rgba(${cloudColor}, ${cloudAlpha})`;
            ctx.fillRect(0, 0, w, h);
        }

        // --- 3. ЧАСТИЦЫ ---
        // Логика типа частиц для СПАВНА
        let spawnType = 'none';
        let targetCount = 0;

        if (condition.includes('rain') || condition === 'storm') {
            targetCount = Math.floor(intensity * 1200);
            spawnType = 'rain';
        } else if (condition === 'snow') {
            targetCount = Math.floor(intensity * 800);
            spawnType = 'snow';
        } else if (condition === 'windy' || (wind > 8 && condition !== 'clear')) {
            targetCount = Math.floor(wind * 5);
            spawnType = 'debris';
        }

        const windDx = wind * 2.5;
        const currentCount = particles.current.length;

        // Расширяем границы спавна при ветре
        const fallSpeedEstimate = spawnType === 'snow' ? 3 : 25;
        const maxDrift = Math.abs(windDx) * (h / fallSpeedEstimate);
        const margin = Math.max(200, maxDrift + 100);

        // Добавление частиц
        if (currentCount < targetCount) {
            const toAdd = Math.min(30, targetCount - currentCount);
            for (let i = 0; i < toAdd; i++) {
                particles.current.push({
                    x: -margin + Math.random() * (w + margin * 2),
                    y: Math.random() * h,
                    z: Math.random() * 0.5 + 0.5,
                    speed: 0,
                    life: Math.random(),
                    type: spawnType // ВАЖНО: Запоминаем тип частицы при рождении
                });
            }
        } else if (currentCount > targetCount) {
            // Удаляем лишние (постепенно, чтобы не было резкого исчезновения)
            particles.current.splice(0, Math.min(10, currentCount - targetCount));
        }

        ctx.lineWidth = 1;

        // Отрисовка частиц (В одном цикле, но с проверкой типа каждой частицы)
        // Это позволяет снегу и дождю существовать одновременно при смене погоды
        const len = particles.current.length;

        // Чтобы менять стили (fill/stroke), нам нужно группировать или переключать контекст.
        // Для оптимизации будем просто переключать стили внутри цикла, это нормально для <2000 частиц.

        ctx.beginPath(); // Начинаем путь для линий (дождь)

        for (let i = 0; i < len; i++) {
            const p = particles.current[i];

            // Физика зависит от типа частицы, а не от текущей погоды
            if (p.type === 'rain') {
                const baseSpeed = 15;
                const boost = intensity * 20;
                p.speed = (baseSpeed + Math.random() * 5 + boost) * p.z;

                p.y += p.speed;
                p.x += windDx * p.z;

                const rainLen = p.speed * 1.5;

                // Рисуем линию (Rain)
                ctx.strokeStyle = `rgba(170, 190, 210, ${0.4 + intensity * 0.4})`;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - windDx * p.z * 0.5, p.y - rainLen);
                ctx.stroke();
            }
            else if (p.type === 'snow') {
                p.speed = (2 + Math.random() * 2) * p.z;
                p.y += p.speed;
                p.x += (windDx * 0.5 + Math.sin(p.y * 0.05 + p.life * 10)) * p.z;

                // Рисуем круг/квадрат (Snow)
                ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * Math.min(1, intensity * 1.2)})`;
                ctx.beginPath();
                ctx.rect(p.x, p.y, p.z * 2.5, p.z * 2.5);
                ctx.fill();
            }
            else if (p.type === 'debris') {
                p.speed = (wind * 0.5 + Math.random()) * p.z;
                p.x += p.speed;
                p.y += Math.sin(p.x * 0.02) * 2 + 1;

                ctx.fillStyle = `rgba(80, 70, 50, 0.6)`;
                ctx.beginPath();
                ctx.rect(p.x, p.y, 2, 2);
                ctx.fill();
            }

            // Респавн (если частица улетела, она возрождается с ТЕКУЩИМ spawnType)
            if (p.y > h + 50 || p.x > w + margin || p.x < -margin) {
                if (targetCount > 0 && spawnType !== 'none') {
                    p.y = -20;
                    if (windDx > 0) p.x = -margin + Math.random() * (w + margin);
                    else if (windDx < 0) p.x = Math.random() * (w + margin);
                    else p.x = -margin + Math.random() * (w + margin * 2);

                    p.type = spawnType; // Превращаем старый дождь в новый снег (или наоборот) при респавне
                } else {
                    // Если погода ясная, просто убиваем частицу
                    p.life = -1; // Маркер для удаления (можно реализовать очистку, но здесь оставим как есть)
                }
            }
        }

        // --- 4. ТУМАН ---
        if (fogDensity > 0.01) {
             const fogAlpha = Math.min(0.6, fogDensity * 0.6);
             ctx.fillStyle = `rgba(230, 235, 240, ${fogAlpha})`;
             ctx.fillRect(0, 0, w, h);
        }

        // --- 5. ОСВЕЩЕНИЕ (ПОВЕРХ ВСЕГО) ---

        // A. НОЧЬ
        const darkness = 1 - Math.min(1, lightLevel);
        if (darkness > 0.01) {
            ctx.fillStyle = `rgba(10, 15, 35, ${darkness * 0.85})`;
            ctx.fillRect(0, 0, w, h);
        }

        // B. РАССВЕТ / ЗАКАТ
        const isSunrise = Math.abs(timeOfDay - sunrise) < 60;
        const isSunset = Math.abs(timeOfDay - sunset) < 60;

        if (isSunrise || isSunset) {
            let sunAlpha = 0;
            let sunColor1 = "";
            let sunColor2 = "";

            if (isSunrise) {
                const dist = Math.abs(timeOfDay - sunrise);
                sunAlpha = (1 - dist / 60) * 0.4 * (1 - cloudDensity);
                sunColor1 = "rgba(255, 100, 50, 0)";
                sunColor2 = `rgba(255, 150, 100, ${sunAlpha})`;
            } else {
                const dist = Math.abs(timeOfDay - sunset);
                sunAlpha = (1 - dist / 60) * 0.5 * (1 - cloudDensity);
                sunColor1 = "rgba(100, 50, 150, 0)";
                sunColor2 = `rgba(255, 100, 50, ${sunAlpha})`;
            }

            if (sunAlpha > 0.01) {
                const grad = ctx.createLinearGradient(0, 0, 0, h);
                grad.addColorStop(0, sunColor2);
                grad.addColorStop(1, sunColor1);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            }
        }

        // --- 6. МОЛНИЯ ---
        if (condition === 'storm') {
             if (!lightning.current.active && Math.random() < 0.005 * intensity) {
                 lightning.current.active = true;
                 lightning.current.life = 1.0;
                 lightning.current.x = Math.random() * w;
             }

             if (lightning.current.active) {
                 const life = lightning.current.life;

                 ctx.fillStyle = `rgba(255, 255, 255, ${life * 0.3})`;
                 ctx.fillRect(0, 0, w, h);

                 ctx.strokeStyle = `rgba(255, 255, 255, ${life})`;
                 ctx.lineWidth = 2 + Math.random() * 2;
                 ctx.beginPath();
                 let lx = lightning.current.x;
                 let ly = 0;
                 ctx.moveTo(lx, ly);
                 while (ly < h * 0.8) {
                     lx += (Math.random() - 0.5) * 60;
                     ly += Math.random() * 40 + 10;
                     ctx.lineTo(lx, ly);
                 }
                 ctx.stroke();

                 lightning.current.life -= 0.1 + Math.random() * 0.1;
                 if (lightning.current.life <= 0) lightning.current.active = false;
             }
        }

        rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [weather, gameTime]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }} />;
}