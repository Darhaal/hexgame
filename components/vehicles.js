// Типы машин (водные, наземные, универсальные) – на будущее
export const VEHICLE_TYPES = {
  LAND: "land",
  WATER: "water",
  AIR: "air",
};

// Базовые параметры машин
export const VEHICLES = {
  DevMachine: {
    id: "DevMachine",
    name: "Developer Debug Machine",
    type: VEHICLE_TYPES.LAND,
    stepBonus: 10,   // +10 к стартовым шагам
    allowedTiles: null, // null = может везде
  },
};
