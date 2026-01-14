"use client";

import { useState, useEffect, useMemo } from "react";
import { useGame } from "../../context/GameContext";
import { getWeather } from "../../engine/weather/WeatherSystem";
import mapData, { mapDataMap } from "../../data/mapData";

import LocationPanel from "../ui/LocationPanel";
import InventoryWindow from "../ui/InventoryWindow";
import CharacterWindow from "../ui/CharacterWindow";
import SkillsWindow from "../ui/SkillsWindow";

import RightPanel from "../ui/RightPanel";
import BottomBar from "../ui/BottomBar";
import DevConsole from "../ui/DevConsole";
import WeatherOverlay from "../../engine/weather/WeatherOverlay";
import SleepSystem from "../../engine/player/SleepSystem";

export default function GameUI({ children }) {
  const {
    gameTime, stats, isLoaded, playerPosRef, isMoving,
    addTime, modifyStat, updateStats, onResetWorld, changeVehicle,
    spawnItem, spawnWorldObject, // [NEW]
    save,
    isLocationOpen, setIsLocationOpen
  } = useGame();

  const [activeWindow, setActiveWindow] = useState(null);

  useEffect(() => {
      if (isLocationOpen) setActiveWindow(null);
  }, [isLocationOpen]);

  const openWindow = (id) => {
      setIsLocationOpen(false);
      setActiveWindow(id);
  };

  const closeWindow = () => setActiveWindow(null);

  const [sleepState, setSleepState] = useState({ active: false, config: { minutes: 0, fatigueRegen: 0 } });
  const [currentWeather, setCurrentWeather] = useState({ condition: 'clear', temp: 20, wind: 0, pressure: 760, humidity: 50 });
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

  const handleContextMenu = (e) => { e.preventDefault(); };

  return (
    <div onContextMenu={handleContextMenu} style={{ position: "relative", minHeight: "100vh", background: "#111", overflow: "hidden", userSelect: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 0, width: "100%", height: "100%" }}>{children}</div>

      <WeatherOverlay weather={currentWeather} gameTime={gameTime} />
      <SleepSystem active={sleepState.active} config={sleepState.config} onComplete={() => setSleepState(prev => ({ ...prev, active: false }))} addTime={addTime} updateStats={updateStats} modifyStat={modifyStat} />

      <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100vh", pointerEvents: "none" }}>

        <div style={{ pointerEvents: "auto" }}>
            <LocationPanel />
        </div>

        <RightPanel gameTime={gameTime} stats={stats} weather={currentWeather} />

        <div style={{ width: '100%', position: 'absolute', bottom: 0, pointerEvents: "none", display: 'flex', justifyContent: 'center' }}>
             <BottomBar
                onOpenInventory={() => openWindow('inventory')}
                onOpenCharacter={() => openWindow('character')}
                onOpenSkills={() => openWindow('skills')}
                onClose={closeWindow}
                activeWindow={activeWindow || (isLocationOpen ? 'location' : null)}
             />
        </div>

        {activeWindow === 'inventory' && <div style={{pointerEvents:"auto"}}><InventoryWindow onClose={closeWindow}/></div>}
        {activeWindow === 'character' && <div style={{pointerEvents:"auto"}}><CharacterWindow onClose={closeWindow}/></div>}
        {activeWindow === 'skills' && <div style={{pointerEvents:"auto"}}><SkillsWindow onClose={closeWindow}/></div>}

        <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: "auto" }}>
            <DevConsole
                onAddSteps={addTime}
                onAddStat={modifyStat}
                onUpdateStats={updateStats}
                onReset={onResetWorld}
                onSetVehicle={changeVehicle}
                onSpawnItem={spawnItem}
                onSpawnWorldObject={spawnWorldObject} // [NEW] Передаем функцию
                gameTime={gameTime}
                onSave={save}
            />
        </div>

      </div>
    </div>
  );
}