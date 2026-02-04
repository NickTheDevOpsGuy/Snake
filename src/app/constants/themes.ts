export type GameTheme = 'classic' | 'space' | 'ocean' | 'forest' | 'neon';

export type ThemeColors = {
  bg: string;
  gridLine: string;
  gridLineDim: string;
  obstacle: string;
  obstacleStroke: string;
  wall: string;
  wallStroke: string;
  snakeHead: string;
  snakeBody: string;
  snakeStroke: string;
  foodGlow: string;
  powerUpBorder: string;
};

export const THEME_COLORS: Record<GameTheme, ThemeColors> = {
  classic: {
    bg: '#0f172a',
    gridLine: '#334155',
    gridLineDim: '#1e293b',
    obstacle: '#374151',
    obstacleStroke: '#4b5563',
    wall: '#1e3a5f',
    wallStroke: '#2563eb',
    snakeHead: '#10b981',
    snakeBody: '#22c55e',
    snakeStroke: '#059669',
    foodGlow: 'rgba(251, 191, 36, 0.3)',
    powerUpBorder: '#fbbf24',
  },
  space: {
    bg: '#0c0a1d',
    gridLine: '#2e1065',
    gridLineDim: '#1e1b4b',
    obstacle: '#312e81',
    obstacleStroke: '#4c1d95',
    wall: '#1e3a8a',
    wallStroke: '#3b82f6',
    snakeHead: '#22d3ee',
    snakeBody: '#06b6d4',
    snakeStroke: '#0891b2',
    foodGlow: 'rgba(167, 139, 250, 0.4)',
    powerUpBorder: '#a78bfa',
  },
  ocean: {
    bg: '#0c4a6e',
    gridLine: '#0e7490',
    gridLineDim: '#155e75',
    obstacle: '#164e63',
    obstacleStroke: '#0e7490',
    wall: '#1e40af',
    wallStroke: '#60a5fa',
    snakeHead: '#2dd4bf',
    snakeBody: '#14b8a6',
    snakeStroke: '#0d9488',
    foodGlow: 'rgba(34, 211, 238, 0.4)',
    powerUpBorder: '#22d3ee',
  },
  forest: {
    bg: '#14532d',
    gridLine: '#166534',
    gridLineDim: '#052e16',
    obstacle: '#1f2937',
    obstacleStroke: '#374151',
    wall: '#422006',
    wallStroke: '#b45309',
    snakeHead: '#4ade80',
    snakeBody: '#22c55e',
    snakeStroke: '#16a34a',
    foodGlow: 'rgba(253, 224, 71, 0.3)',
    powerUpBorder: '#fde047',
  },
  neon: {
    bg: '#0f0f0f',
    gridLine: '#4f46e5',
    gridLineDim: '#312e81',
    obstacle: '#4338ca',
    obstacleStroke: '#6366f1',
    wall: '#7c3aed',
    wallStroke: '#a78bfa',
    snakeHead: '#f472b6',
    snakeBody: '#ec4899',
    snakeStroke: '#db2777',
    foodGlow: 'rgba(34, 211, 238, 0.5)',
    powerUpBorder: '#22d3ee',
  },
};

export const THEME_LABELS: Record<GameTheme, string> = {
  classic: 'Classic',
  space: 'Space',
  ocean: 'Ocean',
  forest: 'Forest',
  neon: 'Neon',
};
