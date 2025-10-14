// src/app/types/index.ts

// Re-export from sibling type modules
export * from "./game";
export * from "./ui";

// ——— Core shared types ———

// Basic coordinate point
export type XY = { x: number; y: number };

// Food extends XY so it can hold an emoji
export type Food = XY & { emoji?: string };

// Snake movement direction
export type Dir = "up" | "down" | "left" | "right";

// Keyboard direction mapping
export const keyToDir: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

// Equality helper for comparing coordinates
export const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;
