"use client";

import { useEffect, useRef } from "react";

// Линейная интерполяция
const lerp = (start, end, t) => start * (1 - t) + end * t;

// Генератор зигзага молнии
const generateLightningPath = (startX, h) => {
    const segments = [];
    let currentX = startX;
    let currentY = 0; // Начинаем сверху

    segments.push({ x: currentX, y: currentY });

    while (currentY < h) {
        // Шаг вниз случайной длины
        const stepY = Math.random() * 50 + 20;
        currentY += stepY;

        // Смещение по X (зигзаг)
        const offset = (Math.random() - 0.5) * 80;
        currentX += offset;

        segments.push({ x: currentX, y: currentY });
    }
    return segments;
};

export default function WeatherOverlay({ weather }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const cameraRef = useRef({ x: 0, y: 0 });

  const particles = useRef([]);
  const ripples = useRef([]);

  // [UPDATE] Обновили структуру рефа молнии
  const lightning = useRef({
      active: false,
      life: 0,
      x: 0,
      path: [] // Храним точки линии молнии
  });

  const visualState = useRef({
      lightLevel: weather.lightLevel,
      fogDensity: weather.fogDensity,
      intensity: weather.intensity,
      wind: weather.wind
  });

  useEffect(() => {
      const onCameraChange = (e) => {
          cameraRef.current = e.detail;
      };

      window.addEventListener('camera-change', onCameraChange);
      return () => window.removeEventListener('camera-change', onCameraChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let lastCamPos = { ...cameraRef.current };

    const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = (timestamp) => {
        if (!lastTimeRef.current) lastTimeRef.current = timestamp;
        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;
        const dt = Math.min(deltaTime, 0.1);

        const currCamPos = cameraRef.current;
        const camDeltaX = currCamPos.x - lastCamPos.x;
        const camDeltaY = currCamPos.y - lastCamPos.y;
        lastCamPos = { ...currCamPos };

        const w = window.innerWidth;
        const h = window.innerHeight;
        const time = timestamp / 1000;

        const lerpFactor = 3.0 * dt;
        visualState.current.lightLevel = lerp(visualState.current.lightLevel, weather.lightLevel, lerpFactor);
        visualState.current.fogDensity = lerp(visualState.current.fogDensity, weather.fogDensity || 0, lerpFactor);
        visualState.current.intensity = lerp(visualState.current.intensity, weather.intensity || 0, lerpFactor);
        visualState.current.wind = lerp(visualState.current.wind, weather.wind, lerpFactor);

        const { lightLevel, fogDensity, intensity, wind } = visualState.current;
        const { condition } = weather;

        ctx.clearRect(0, 0, w, h);

        // --- ТУМАН ---
        if (fogDensity > 0.01) {
            const grad = ctx.createRadialGradient(w/2, h/2, w*0.1, w/2, h/2, w*0.8);
            const fogColor = `200, 210, 225`;
            grad.addColorStop(0, `rgba(${fogColor}, ${fogDensity * 0.3})`);
            grad.addColorStop(1, `rgba(${fogColor}, ${fogDensity * 0.9})`);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }

        // --- БРЫЗГИ (Ripples) ---
        if (condition.includes('rain') || condition === 'storm') {
            if (Math.random() < (intensity * 50 * dt)) {
                ripples.current.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    size: 0,
                    maxSize: 5 + Math.random() * 10,
                    alpha: 0.5 + Math.random() * 0.3,
                    life: 1.0
                });
            }
        }

        ctx.lineWidth = 1.5;
        for (let i = ripples.current.length - 1; i >= 0; i--) {
            const r = ripples.current[i];
            r.size += 20 * dt;
            r.alpha -= 1.0 * dt;

            r.x += camDeltaX;
            r.y += camDeltaY;

            if (r.alpha <= 0) {
                ripples.current.splice(i, 1);
                continue;
            }
            ctx.strokeStyle = `rgba(190, 225, 255, ${r.alpha})`;
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, r.size, r.size * 0.6, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // --- ЧАСТИЦЫ ---
        let spawnType = 'none';
        let targetCount = 0;

        if (condition.includes('rain') || condition === 'storm') {
            targetCount = Math.floor(intensity * 1500);
            spawnType = 'rain';
        } else if (condition === 'drizzle') {
            targetCount = Math.floor(intensity * 800);
            spawnType = 'drizzle';
        } else if (condition === 'blizzard') {
            targetCount = Math.floor(intensity * 2500);
            spawnType = 'blizzard';
        } else if (condition === 'snow') {
            targetCount = Math.floor(intensity * 1200);
            spawnType = 'snow';
        } else if (condition === 'windy' || (wind > 5 && condition !== 'clear')) {
            targetCount = Math.floor(wind * 10);
            spawnType = 'debris';
        }

        const windOffsetPixels = wind * 50;
        const currentCount = particles.current.length;

        if (currentCount < targetCount) {
            const toAdd = Math.min(50, targetCount - currentCount);
            for (let i = 0; i < toAdd; i++) {
                particles.current.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    z: Math.random() * 0.7 + 0.3,
                    life: Math.random() * 10,
                    type: spawnType,
                    sizeMod: Math.random() * 0.5 + 0.8
                });
            }
        } else if (currentCount > targetCount) {
             particles.current.splice(0, Math.min(20, currentCount - targetCount));
        }

        ctx.beginPath();
        const rainBaseSpeed = 800;
        const snowBaseSpeed = 100;

        for (let i = 0; i < particles.current.length; i++) {
            const p = particles.current[i];
            if (targetCount > 0 && p.type !== spawnType) p.type = spawnType;

            const layerSpeedMod = p.z * p.z;
            p.x += camDeltaX;
            p.y += camDeltaY;

            if (p.type === 'rain' || p.type === 'drizzle') {
                const isDrizzle = p.type === 'drizzle';
                const baseSpd = isDrizzle ? rainBaseSpeed * 0.3 : rainBaseSpeed;
                p.speed = baseSpd * layerSpeedMod;
                p.y += p.speed * dt;

                const wave = Math.sin(p.y * 0.02 + time) * (isDrizzle ? 5 : 10);
                p.x += (windOffsetPixels * 0.1 + wave) * dt;

                const len = isDrizzle ? 10 : 30 * p.z;
                ctx.moveTo(p.x, p.y);
                const tailX = p.x - (windOffsetPixels * 0.1 + wave) * 0.1;
                const tailY = p.y - len;
                ctx.lineTo(tailX, tailY);
            }
            else if (p.type === 'snow') {
                p.speed = snowBaseSpeed * layerSpeedMod;
                p.y += p.speed * dt;
                const wobble = Math.sin(p.y * 0.05 + p.life) * 20;
                p.x += (windOffsetPixels * 0.2 + wobble) * dt;
                const size = 3.0 * p.z * p.sizeMod;
                ctx.rect(p.x, p.y, size, size);
            }
            else if (p.type === 'blizzard') {
                p.speed = (snowBaseSpeed * 3.0) * layerSpeedMod;
                p.y += p.speed * dt;
                const chaos = Math.sin(time * 20 + p.life) * 5;
                p.x += (windOffsetPixels * 1.5 + chaos) * dt;
                const size = 2.0 * p.z * p.sizeMod;
                ctx.rect(p.x, p.y, size, size);
            }
            else if (p.type === 'debris') {
                 p.x += (windOffsetPixels * 0.8 * layerSpeedMod) * dt;
                 p.y += (Math.sin(p.x * 0.01) * 50) * dt;
                 ctx.rect(p.x, p.y, 2 * p.z, 2 * p.z);
            }

            const margin = 300;
            if (p.y > h + 50 || p.x > w + margin || p.x < -margin) {
                p.y = -20;
                if (wind > 0) p.x = -margin + Math.random() * (w + margin);
                else p.x = Math.random() * (w + margin);
                p.z = Math.random() * 0.7 + 0.3;
            }
        }

        ctx.strokeStyle = `rgba(200, 230, 255, 0.6)`;
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.fill();

        // --- НОЧЬ ---
        const darkness = 1 - Math.max(0.1, Math.min(1, lightLevel));
        if (darkness > 0.01) {
            ctx.fillStyle = `rgba(5, 10, 25, ${darkness})`;
            ctx.fillRect(0, 0, w, h);
        }

        // --- МОЛНИЯ ---
        if (condition === 'storm') {
             if (lightning.current.active) {
                 const life = lightning.current.life;

                 // 1. Вспышка (белый экран), но менее яркая
                 ctx.fillStyle = `rgba(255, 255, 255, ${life * 0.3})`;
                 ctx.fillRect(0, 0, w, h);

                 // 2. Отрисовка Зигзага молнии
                 // Сохраняем контекст для эффекта свечения
                 ctx.save();
                 ctx.beginPath();

                 const path = lightning.current.path;
                 if (path.length > 0) {
                     ctx.moveTo(path[0].x, path[0].y);
                     for (let k = 1; k < path.length; k++) {
                         ctx.lineTo(path[k].x, path[k].y);
                     }
                 }

                 ctx.lineCap = "round";
                 ctx.lineJoin = "round";

                 // Основной цвет молнии
                 ctx.strokeStyle = `rgba(255, 255, 255, ${life})`;
                 ctx.lineWidth = 4;

                 // Свечение (Shadow Blur)
                 ctx.shadowColor = "rgba(200, 220, 255, 1)";
                 ctx.shadowBlur = 20;
                 ctx.stroke();

                 // Второй проход для белой сердцевины (делает молнию "горячей")
                 ctx.shadowBlur = 0;
                 ctx.strokeStyle = `rgba(255, 255, 255, ${life})`;
                 ctx.lineWidth = 2;
                 ctx.stroke();

                 ctx.restore();

                 // Эпицентр вспышки (блик)
                 const lx = lightning.current.x;
                 const ly = h * 0.5;
                 const flashGrad = ctx.createRadialGradient(lx, ly, 10, lx, ly, w);
                 flashGrad.addColorStop(0, `rgba(255, 255, 255, ${life * 0.5})`);
                 flashGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);
                 ctx.fillStyle = flashGrad;
                 ctx.fillRect(0, 0, w, h);

                 // Затухание
                 lightning.current.life -= 4.0 * dt;
                 if (lightning.current.life <= 0) lightning.current.active = false;
             } else {
                 // [FIX] Редкие удары: 0.02 вместо 0.8
                 // Это примерно один удар раз в несколько секунд/минут в зависимости от fps
                 if (Math.random() < 0.02 * dt * intensity) {
                     lightning.current.active = true;
                     lightning.current.life = 1.0;
                     lightning.current.x = Math.random() * w;
                     // Генерируем новый путь для удара
                     lightning.current.path = generateLightningPath(lightning.current.x, h);
                 }
             }
        }

        rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(rafRef.current);
    };
  }, [weather]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }} />;
}