// src/app/types/index.ts

// Re-export from sibling type modules
export * from './game';
export * from './ui';

// ——— Core shared types ———

// Basic coordinate point
export type XY = { x: number; y: number };

export type FoodKind = 'normal' | 'golden' | 'freeze' | 'ghost' | 'multiplier';

// Food extends XY so it can hold rendering + gameplay metadata
export type Food = XY & {
  kind: FoodKind;
  emoji?: string;
  value?: number;
  expiresAt?: number;
};

// Snake movement direction
export type Dir = 'up' | 'down' | 'left' | 'right';

// Keyboard direction mapping (arrows + WASD)
export const keyToDir: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
};

// Equality helper for comparing coordinates
export const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;
