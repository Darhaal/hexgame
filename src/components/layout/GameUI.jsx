"use client";

import { useState, useEffect, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { getWeather } from "../../engine/weather/WeatherSystem";
// Импортируем оптимизированную карту (mapDataMap)
import mapData, { mapDataMap } from "../../data/mapData";

import TilePanel from "../ui/TilePanel";
import RightPanel from "../ui/RightPanel";
import BottomBar from "../ui/BottomBar";
import InventoryPanel from "../ui/InventoryPanel";
import DevConsole from "../ui/DevConsole";
import WeatherOverlay from "../../engine/weather/WeatherOverlay";
// [UPDATE] Импорт новой системы сна
import SleepSystem from "../../engine/player/SleepSystem";

export default function GameUI({ children }) {
  const {
    gameTime, stats, inventory, skills, character,
    activeTile, // Тайл, на который кликнули (для инфо-панели)
    playerPosRef, // Позиция игрока
    isMoving, isTilePanelOpen, isLoaded,
    addTime, modifyStat, updateStats, onResetWorld, changeVehicle, spawnItem,
    useItem, renameCharacter, upgradeSkill, setIsTilePanelOpen,
    stopMovementAction, save
  } = useGame();

  const [modalState, setModalState] = useState({ isOpen: false, tab: 'inventory' });

  // [UPDATE] Состояние для системы сна
  const [sleepState, setSleepState] = useState({
      active: false,
      config: { minutes: 0, fatigueRegen: 0 }
  });

  // Начальное состояние погоды
  const [currentWeather, setCurrentWeather] = useState({
      condition: 'clear', temp: 20, wind: 0, pressure: 760, humidity: 50,
      lightLevel: 1, intensity: 0, dateStr: '', timeStr: '',
      sunrise: 360, sunset: 1260
  });

  const playerTile = useMemo(() => {
      if (!isLoaded || !playerPosRef.current) return null;
      const q = Math.round(playerPosRef.current.q);
      const r = Math.round(playerPosRef.current.r);
      return mapDataMap[`${q},${r}`] || null;
  }, [playerPosRef.current?.q, playerPosRef.current?.r, isLoaded]);

  useEffect(() => {
      const tileForWeather = playerTile;
      const w = getWeather(gameTime, tileForWeather);
      setCurrentWeather(w);
  }, [gameTime, playerTile]);

  if (!isLoaded) return <div style={{ background: "#111", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>LOADING...</div>;

  // [UPDATE] Новая логика запуска сна
  const onSleep = () => {
     let minutes = 60;
     let fatigueRegen = 15;

     // Если спим дома (0,0) - полноценный сон 8 часов
     if (activeTile && activeTile.q === 0 && activeTile.r === 0) {
          minutes = 480;
          fatigueRegen = 100;
      }

      // Запускаем анимацию и логику через SleepSystem
      setSleepState({
          active: true,
          config: { minutes, fatigueRegen }
      });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isMoving && stopMovementAction) stopMovementAction();
  };

  const openModal = (tab) => setModalState({ isOpen: true, tab });
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ position: "relative", minHeight: "100vh", background: "#111", overflow: "hidden", userSelect: "none" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}>
        {children}
      </div>

      <WeatherOverlay weather={currentWeather} gameTime={gameTime} />

      {/* [UPDATE] Компонент Сна (поверх всего) */}
      <SleepSystem
          active={sleepState.active}
          config={sleepState.config}
          onComplete={() => setSleepState(prev => ({ ...prev, active: false }))}
          addTime={addTime}
          updateStats={updateStats}
          modifyStat={modifyStat}
      />

      <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", pointerEvents: "none" }}>

        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', pointerEvents: "none" }}>
            <TilePanel
                tile={isMoving ? null : activeTile}
                isMoving={isMoving}
                isOpen={isTilePanelOpen}
                onToggle={() => setIsTilePanelOpen(!isTilePanelOpen)}
                onSleep={onSleep}
                onEat={() => modifyStat('food', 50)}
                onDrink={() => modifyStat('water', 50)}
            />
        </div>

        <RightPanel gameTime={gameTime} stats={stats} weather={currentWeather} />

        <div style={{ width: '100%', position: 'absolute', bottom: 0, pointerEvents: "none", display: 'flex', justifyContent: 'center' }}>
             <BottomBar
                onOpenInventory={() => openModal('inventory')}
                onOpenCharacter={() => openModal('character')}
                onOpenSkills={() => openModal('skills')}
                onOpenJournal={() => openModal('journal')}
             />
        </div>

        {modalState.isOpen && (
             <div style={{ pointerEvents: "auto" }}>
                <InventoryPanel
                    inventory={inventory}
                    skills={skills}
                    character={character}
                    onUseItem={useItem}
                    gameTime={gameTime}
                    onRenameCharacter={renameCharacter}
                    onUpgradeSkill={upgradeSkill}
                    initialTab={modalState.tab}
                    onClose={closeModal}
                />
             </div>
        )}

        <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: "auto" }}>
            <DevConsole
                onAddSteps={addTime}
                onAddStat={modifyStat}
                onUpdateStats={updateStats}
                onReset={onResetWorld}
                onSetVehicle={changeVehicle}
                onSpawnItem={spawnItem}
                gameTime={gameTime}
                onSave={save}
            />
        </div>

      </div>
    </div>
  );
}