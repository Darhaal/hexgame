// src/data/tileTypes.js
/**
 * Optional: richer tile type definition map.
 * You can use this to generate mapData programmatically.
 */

export const TILE_TYPES = {
  forest: { id: "forest", label: "Forest", moveCost: 2, passable: true, color: "#9edb8d" },
  island: { id: "island", label: "Island", moveCost: 1, passable: true, color: "#b6e3a1" },
  field: { id: "field", label: "Field", moveCost: 1, passable: true, color: "#d9ffbf" },
  village: { id: "village", label: "Village", moveCost: 0.5, passable: true, color: "#dcdcdc" },
  lake: { id: "lake", label: "Lake", moveCost: 0.5, passable: false, color: "#7ec5ff" },
  river: { id: "river", label: "River", moveCost: 0.5, passable: false, color: "#66b4ff" },
  lough_river: { id: "lough_river", label: "Lough River", moveCost: 0.5, passable: false, color: "#89c9ff" },
  great_river: { id: "great_river", label: "Great River", moveCost: 1, passable: false, color: "#4a9de0" },
  default: { id: "default", label: "Default", moveCost: 999, passable: false, color: "#cccccc" },
};
