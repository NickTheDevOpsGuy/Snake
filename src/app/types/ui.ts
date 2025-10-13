// src/constants/ui.ts

// palette tokens (helps if you switch dark/light later)
export const COLORS = {
  background: '#0a0a0a',
  grid: '#666',
  snake: '#22c55e',
  food: '#ef4444',
  text: '#f8fafc',
};

// animation timing
export const ANIM = {
  bumpMs: 180,
  fadeMs: 250,
};

// layout constants
export const UI = {
  hudGap: 16,
  canvasBorder: 4,
  cornerRadius: 8,
};

// z-index layers (if you add overlays or modals)
export const Z = {
  hud: 10,
  modal: 20,
  tooltip: 30,
};
