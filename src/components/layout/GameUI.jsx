"use client";

import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { getWeather } from "../../engine/weather/WeatherSystem";

import TilePanel from "../ui/TilePanel";
import RightPanel from "../ui/RightPanel";
import BottomBar from "../ui/BottomBar";
import InventoryPanel from "../ui/InventoryPanel";
import DevConsole from "../ui/DevConsole";
import WeatherOverlay from "../../engine/weather/WeatherOverlay"; // <-- Новый путь

export default function GameUI({ children }) {
  const {
    gameTime, stats, inventory, skills, character,
    activeTile, isMoving, isTilePanelOpen, isLoaded,
    addTime, modifyStat, onResetWorld, changeVehicle, spawnItem,
    useItem, renameCharacter, upgradeSkill, setIsTilePanelOpen,
    stopMovementAction
  } = useGame();

  const [modalState, setModalState] = useState({ isOpen: false, tab: 'inventory' });
  const [currentWeather, setCurrentWeather] = useState({
      condition: 'clear', temp: 20, wind: 0, pressure: 760, humidity: 50,
      lightLevel: 1, intensity: 0, dateStr: '', timeStr: ''
  });

  useEffect(() => {
      const tileForWeather = isMoving ? null : activeTile;
      const w = getWeather(gameTime, tileForWeather);
      setCurrentWeather(w);
  }, [gameTime, activeTile, isMoving]);

  if (!isLoaded) return <div style={{ background: "#111", minHeight: "100vh", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>LOADING...</div>;

  const onSleep = () => {
     if (activeTile && activeTile.q === 0 && activeTile.r === 0) {
          addTime(480);
          modifyStat('fatigue', 100);
      } else {
          addTime(60);
          modifyStat('fatigue', 15);
      }
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

      <WeatherOverlay weather={currentWeather} />

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
                onReset={onResetWorld}
                onSetVehicle={changeVehicle}
                onToggleDebug={() => {}}
                onSpawnItem={spawnItem}
                gameTime={gameTime}
            />
        </div>

      </div>
    </div>
  );
}