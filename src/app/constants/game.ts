// Game-wide configuration and presets

export type GameDifficulty = "easy" | "medium" | "hard";

export type GameTuning = {
  CELL: number;
  COLS: number;
  ROWS: number;
  TICK_START_MS: number;
  TICK_MIN_MS: number;
  TICK_STEP_MS: number;
};

// Difficulty presets (adjust these to taste)
export const DIFFICULTY_PRESETS: Record<GameDifficulty, GameTuning> = {
  easy: {
    CELL: 28,
    COLS: 16,
    ROWS: 16,
    TICK_START_MS: 200,
    TICK_MIN_MS: 90,
    TICK_STEP_MS: 6,
  },
  medium: {
    CELL: 24,
    COLS: 20,
    ROWS: 20,
    TICK_START_MS: 160,
    TICK_MIN_MS: 70,
    TICK_STEP_MS: 6,
  },
  hard: {
    CELL: 20,
    COLS: 24,
    ROWS: 24,
    TICK_START_MS: 120,
    TICK_MIN_MS: 60,
    TICK_STEP_MS: 5,
  },
};

// Emoji pool for food
export const FOOD_EMOJIS = ["🍎", "🍌", "🍇", "🧀", "🍉", "🍓", "🥕", "🌽"];
