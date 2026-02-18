export type SnakeSkin = 'classic' | 'neon' | 'retro' | 'ocean' | 'sunset';

export const SNAKE_SKINS: Record<
  SnakeSkin,
  { head: string; body: string; stroke: string }
> = {
  classic: { head: '#10b981', body: '#22c55e', stroke: '#059669' },
  neon: { head: '#22d3ee', body: '#06b6d4', stroke: '#0891b2' },
  retro: { head: '#fbbf24', body: '#f59e0b', stroke: '#d97706' },
  ocean: { head: '#0ea5e9', body: '#38bdf8', stroke: '#0284c7' },
  sunset: { head: '#f43f5e', body: '#fb7185', stroke: '#e11d48' },
};
