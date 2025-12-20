"use client";

import { GameProvider } from "../context/GameContext";
import GameUI from "../components/layout/GameUI";
import HexMap from "../components/map/HexMap";

export default function Page() {
  return (
    <GameProvider>
      <GameUI>
        <HexMap />
      </GameUI>
    </GameProvider>
  );
}