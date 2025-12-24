"use client";

import { useEffect, useState } from "react";

/**
 * Hyper-Realistic Sleep System (Post-Soviet Atmosphere Edition).
 * * Особенности:
 * - Пленочное зерно (Noise) для эффекта "сырой" реальности.
 * - Сложная хореография закрытия глаз (борьба со сном).
 * - Бесшовное перекрытие стыка век.
 * - Эффект медленной адаптации зрения при пробуждении.
 */
export default function SleepSystem({
    active,
    config,
    onComplete,
    addTime,
    updateStats,
    modifyStat
}) {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    if (active && phase === "idle") {
      runSleepSequence();
    }
  }, [active]);

  const runSleepSequence = async () => {
    // 1. НАЧАЛО (Тяжесть)
    // Зрение начинает мутнеть, веки тяжелеют
    setPhase("getting-tired");
    await wait(1500); // Было 3000

    // 2. ЗАКРЫТИЕ (Борьба)
    // Медленное, неумолимое движение век вниз
    setPhase("closing");
    await wait(2250); // Было 4500

    // 3. ГЛУБОКИЙ СОН (Blackout)
    // Полная темнота, шум в ушах (визуальный шум)
    setPhase("sleeping");

    // Даем игроку "почувствовать" темноту
    await wait(1250); // Было 2500

    // --- ИГРОВАЯ ЛОГИКА ---
    const { minutes, fatigueRegen } = config;
    if (addTime) addTime(minutes);
    if (updateStats) updateStats(minutes);
    if (modifyStat) modifyStat('fatigue', fatigueRegen);
    // -----------------------

    // Спим (время идет)
    await wait(1750); // Было 3500

    // 4. ПРОБУЖДЕНИЕ (Разлепляем глаза)
    // Веки открываются, но зрение сильно размыто
    setPhase("opening");
    await wait(2500); // Было 5000

    // 5. ФОКУСИРОВКА
    // Блюр медленно уходит, возвращается резкость
    setPhase("focusing");
    await wait(1750); // Было 3500

    // 6. КОНЕЦ
    setPhase("idle");
    if (onComplete) onComplete();
  };

  if (!active && phase === "idle") return null;

  const showText = phase === "sleeping";

  return (
    <div style={containerStyle}>

      {/* СЛОЙ 1: ЗЕРНО (NOISE) */}
      {/* Добавляет текстуру всему процессу, убирая стерильность */}
      <div className="noise-overlay" />

      {/* СЛОЙ 2: РАЗМЫТИЕ (Blur) */}
      {/* Имитирует расфокус хрусталика */}
      <div className={`blur-fx ${phase}`} />

      {/* СЛОЙ 3: ВЕКИ */}
      <div className={`eyelid top ${phase}`}>
        <div className="skin-texture" />
        <div className="lash-shadow" />
      </div>

      <div className={`eyelid bottom ${phase}`}>
        <div className="skin-texture" />
        <div className="lash-shadow" />
      </div>

      {/* СЛОЙ 4: ПОЛНАЯ ТЕМНОТА (Blackout) */}
      {/* Плавно появляется поверх век, скрывая их стык и тени */}
      <div className={`blackout-layer ${phase}`} />

      {/* СЛОЙ 5: ИНТЕРФЕЙС */}
      <div className={`sleep-ui ${showText ? 'visible' : ''}`}>
        <div className="sleep-icon">💤</div>
        <div className="sleep-title">ОТДЫХ</div>
        <div className="sleep-desc">
           {config?.minutes >= 400 ? "Время лечит усталость..." : "Перекур..."}
        </div>
      </div>

      <style jsx>{`
        /* --- NOISE EFFECT (ЗЕРНО) --- */
        .noise-overlay {
            position: absolute;
            inset: 0;
            z-index: 9999;
            pointer-events: none;
            opacity: 0.01; /* Едва заметный шум */
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }

        /* --- ВЕКИ (EYELIDS) --- */
        .eyelid {
            position: absolute;
            left: 0;
            width: 100%;
            height: 55%; /* Нахлест для надежности */
            background: #080707; /* Очень темный теплый черный */
            z-index: 10000;
            transition: transform 0.1s linear; /* Базовый переход, управляется анимацией */
        }

        .eyelid.top {
            top: 0;
            transform: translateY(-100%);
            /* Тени появляются плавно, а не резко */
            transition: box-shadow 1.5s ease; /* Было 3s */
            box-shadow: 0 0 0 rgba(0,0,0,0); /* Изначально тени нет */
        }
        .eyelid.top.closing {
             box-shadow: 0 10px 100px rgba(0,0,0,0.9); /* Появляется при закрытии */
        }

        .eyelid.bottom {
            bottom: 0;
            transform: translateY(100%);
            transition: box-shadow 1.5s ease; /* Было 3s */
            box-shadow: 0 0 0 rgba(0,0,0,0);
        }
        .eyelid.bottom.closing {
             box-shadow: 0 -10px 100px rgba(0,0,0,0.9);
        }

        /* Анимация закрытия: Медленно, "вязко" */
        .eyelid.top.closing { animation: closeTop 2.25s cubic-bezier(0.45, 0, 0.55, 1) forwards; } /* Было 4.5s */
        .eyelid.bottom.closing { animation: closeBottom 2.25s cubic-bezier(0.45, 0, 0.55, 1) forwards; } /* Было 4.5s */

        @keyframes closeTop {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(0%); }
        }
        @keyframes closeBottom {
            0% { transform: translateY(100%); }
            100% { transform: translateY(0%); }
        }

        /* Удержание в закрытом состоянии */
        .eyelid.top.sleeping, .eyelid.bottom.sleeping {
            transform: translateY(0%);
            box-shadow: none; /* Убираем тени в полной темноте, чтобы не было артефактов */
        }

        /* Открытие: очень медленно, с трудом */
        .eyelid.top.opening { animation: openTop 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; } /* Было 5s */
        .eyelid.bottom.opening { animation: openBottom 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; } /* Было 5s */

        @keyframes openTop {
            0% { transform: translateY(0%); }
            100% { transform: translateY(-100%); }
        }
        @keyframes openBottom {
            0% { transform: translateY(0%); }
            100% { transform: translateY(100%); }
        }

        /* Текстура кожи/век (едва заметный градиент) */
        .skin-texture {
            position: absolute;
            inset: 0;
            opacity: 0.3;
            background: linear-gradient(to bottom, #1a1515 0%, transparent 100%);
        }
        .eyelid.bottom .skin-texture { background: linear-gradient(to top, #1a1515 0%, transparent 100%); }

        /* Ресницы (Blur edge) */
        .lash-shadow {
            position: absolute;
            left: 0;
            width: 100%;
            height: 120px;
            background: rgba(0,0,0,0.95);
            filter: blur(30px); /* Очень сильный блюр для мягкости */
            z-index: 10001;
            opacity: 0; /* Скрыты в начале */
            transition: opacity 1s ease; /* Было 2s */
        }
        .lash-shadow.closing, .lash-shadow.sleeping { opacity: 1; }

        .eyelid.top .lash-shadow { bottom: -60px; }
        .eyelid.bottom .lash-shadow { top: -60px; }


        /* --- BLACKOUT LAYER (Скрывает стыки) --- */
        .blackout-layer {
            position: absolute;
            inset: 0;
            background: #020202; /* Абсолютная темнота */
            opacity: 0;
            z-index: 10002; /* Поверх век */
            transition: opacity 1.5s ease-in-out; /* Было 3s */
            pointer-events: none;
        }
        /* Включается, когда веки сомкнулись */
        .blackout-layer.sleeping { opacity: 1; }


        /* --- BLUR FX (Расфокус) --- */
        .blur-fx {
            position: absolute;
            inset: 0;
            z-index: 9000;
            backdrop-filter: blur(0px);
            background: transparent;
            transition: backdrop-filter 1.5s ease, background 1.5s ease; /* Было 3s */
            pointer-events: none;
        }

        .blur-fx.getting-tired {
            backdrop-filter: blur(6px);
            background: rgba(0,0,0,0.15); /* Плавное затемнение */
        }
        .blur-fx.closing {
            backdrop-filter: blur(12px);
            background: rgba(0,0,0,0.25);
        }
        .blur-fx.opening {
            backdrop-filter: blur(25px);
            background: rgba(255,255,255,0.01); /* Легкий засвет при открытии */
        }
        .blur-fx.focusing {
            backdrop-filter: blur(0px); /* Медленный выход в резкость */
            transition: backdrop-filter 2s ease-out; /* Было 4s */
        }


        /* --- UI ИНТЕРФЕЙС --- */
        .sleep-ui {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            opacity: 0;
            z-index: 10005; /* Поверх всего */
            transition: opacity 1.25s ease-in-out; /* Было 2.5s */
        }
        .sleep-ui.visible { opacity: 0.9; }

        .sleep-icon {
            font-size: 32px;
            margin-bottom: 12px;
            opacity: 0.7;
            filter: drop-shadow(0 0 15px rgba(255,255,255,0.2));
        }
        .sleep-title {
            font-size: 18px;
            color: #c0c0c0;
            font-family: 'Courier New', monospace; /* Более "сырой" шрифт */
            letter-spacing: 6px;
            font-weight: 400;
            text-transform: uppercase;
        }
        .sleep-desc {
            font-size: 11px;
            color: #555;
            margin-top: 8px;
            font-family: sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));

const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden'
};