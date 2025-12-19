import { useState, useRef, useCallback, useEffect } from "react";
import {
  loadPlayerState,
  savePlayerState,
  START_TIME
} from "../engine/player/playerState";
import { INITIAL_STATS, calculateStatsDecay } from "../engine/player/playerStats";
import { INITIAL_SKILLS, INITIAL_CHARACTER } from "../data/skillsData";
import {
  createInitialInventory,
  useItem as useInventoryItem,
  addItemToInventory,
  createItemInstance
} from "../engine/inventory/inventoryLogic";
import { setVehicle } from "../engine/player/playerEngine";

export function usePlayer(gameTimeRef) {
  // --- REFS (Актуальные данные для игрового цикла) ---
  const playerPosRef = useRef({ q: 0, r: 0 });
  const statsRef = useRef(INITIAL_STATS);
  const inventoryRef = useRef([]);
  const skillsRef = useRef(INITIAL_SKILLS);
  const characterRef = useRef(INITIAL_CHARACTER);
  const currentVehicleIdRef = useRef("none");

  // --- STATE (Для UI) ---
  const [playerState, setPlayerState] = useState({
    stats: INITIAL_STATS,
    inventory: [],
    skills: INITIAL_SKILLS,
    character: INITIAL_CHARACTER,
    vehicleId: "none"
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // --- ЗАГРУЗКА ---
  useEffect(() => {
    const loaded = loadPlayerState();
    if (loaded) {
      playerPosRef.current = loaded.pos;
      statsRef.current = loaded.stats;
      inventoryRef.current = loaded.inventory || createInitialInventory();
      skillsRef.current = loaded.skills || INITIAL_SKILLS;
      characterRef.current = loaded.character || INITIAL_CHARACTER;
      currentVehicleIdRef.current = loaded.vehicle || "none";

      // Синхронизируем движок транспорта
      setVehicle(loaded.vehicle || "none");

      // Обновляем UI
      setPlayerState({
        stats: loaded.stats,
        inventory: loaded.inventory || createInitialInventory(),
        skills: loaded.skills || INITIAL_SKILLS,
        character: loaded.character || INITIAL_CHARACTER,
        vehicleId: loaded.vehicle || "none"
      });
    }
    setIsLoaded(true);
  }, []);

  // --- СОХРАНЕНИЕ ---
  const save = useCallback((movementQueue = [], activeStep = null) => {
    savePlayerState(
      playerPosRef.current,
      gameTimeRef.current,
      currentVehicleIdRef.current,
      movementQueue,
      activeStep,
      statsRef.current,
      inventoryRef.current,
      skillsRef.current,
      characterRef.current
    );
  }, [gameTimeRef]);

  // --- ОБНОВЛЕНИЕ В ЦИКЛЕ (TICK) ---
  const updateStats = useCallback((deltaMinutes) => {
    const newStats = calculateStatsDecay(statsRef.current, deltaMinutes);
    statsRef.current = newStats;
    // Обновляем UI стейт частично (только статы) для оптимизации
    setPlayerState(prev => ({ ...prev, stats: newStats }));
  }, []);

  // --- ДЕЙСТВИЯ (ACTIONS) ---

  const modifyStat = useCallback((type, amount) => {
    const currentVal = statsRef.current[type];
    const newVal = Math.min(100, Math.max(0, currentVal + amount));
    statsRef.current = { ...statsRef.current, [type]: newVal };
    setPlayerState(prev => ({ ...prev, stats: statsRef.current }));
    save();
  }, [save]);

  const useItem = useCallback((index) => {
    const { inventory: newInv, effect } = useInventoryItem(inventoryRef.current, index, gameTimeRef.current);
    inventoryRef.current = newInv;

    if (effect) {
      // Примитивная обработка эффектов (можно вынести в EffectManager)
      let updatedStats = { ...statsRef.current };
      if (effect.food) updatedStats.food = Math.min(100, updatedStats.food + effect.food);
      if (effect.water) updatedStats.water = Math.min(100, updatedStats.water + effect.water);
      statsRef.current = updatedStats;
      setPlayerState(prev => ({ ...prev, inventory: newInv, stats: updatedStats }));
    } else {
      setPlayerState(prev => ({ ...prev, inventory: newInv }));
    }
    save();
  }, [gameTimeRef, save]);

  const spawnItem = useCallback((itemId) => {
    const newItem = createItemInstance(itemId, gameTimeRef.current);
    if (!newItem) return;
    const newInv = addItemToInventory(inventoryRef.current, newItem);
    if (newInv) {
      inventoryRef.current = newInv;
      setPlayerState(prev => ({ ...prev, inventory: newInv }));
      save();
    }
  }, [gameTimeRef, save]);

  const changeVehicle = useCallback((id) => {
    if (setVehicle(id)) {
      currentVehicleIdRef.current = id;
      setPlayerState(prev => ({ ...prev, vehicleId: id }));
      return true;
    }
    return false;
  }, []);

  const renameCharacter = useCallback((name) => {
    characterRef.current = { ...characterRef.current, name };
    setPlayerState(prev => ({ ...prev, character: characterRef.current }));
    save();
  }, [save]);

  const upgradeSkill = useCallback(() => {
    // Заглушка прокачки
    const newSkills = { ...skillsRef.current };
    for (const key in newSkills) {
      newSkills[key].xp += 10;
      if (newSkills[key].xp >= 100) {
        newSkills[key].level += 1;
        newSkills[key].xp -= 100;
      }
    }
    skillsRef.current = newSkills;
    setPlayerState(prev => ({ ...prev, skills: newSkills }));
    save();
  }, [save]);

  const reset = useCallback(() => {
    playerPosRef.current = { q: 0, r: 0 };
    statsRef.current = INITIAL_STATS;
    inventoryRef.current = createInitialInventory();
    skillsRef.current = INITIAL_SKILLS;
    characterRef.current = INITIAL_CHARACTER;
    currentVehicleIdRef.current = "none";

    setPlayerState({
      stats: INITIAL_STATS,
      inventory: inventoryRef.current,
      skills: INITIAL_SKILLS,
      character: INITIAL_CHARACTER,
      vehicleId: "none"
    });
  }, []);

  return {
    isLoaded,
    playerPosRef,
    statsRef,
    inventoryRef,
    skillsRef,
    characterRef,
    currentVehicleIdRef,
    // UI State
    ...playerState,
    // Methods
    updateStats,
    modifyStat,
    useItem,
    spawnItem,
    changeVehicle,
    renameCharacter,
    upgradeSkill,
    save,
    reset
  };
}