// Game-wide configuration and presets

export type GameDifficulty =
  | "relaxed"
  | "classic"
  | "expert"
  | "blitz"
  | "endless";

export type GameTuning = {
  CELL: number;
  COLS: number;
  ROWS: number;
  TICK_START_MS: number;
  TICK_MIN_MS: number;
  TICK_STEP_MS: number;
  wrap: boolean;
  obstacleCount: number;
  powerChance: number;
  label: string;
  description: string;
  speedCurve?: "linear" | "ease-in" | "ease-out";
};

// Difficulty presets (adjust these to taste)
export const DIFFICULTY_PRESETS: Record<GameDifficulty, GameTuning> = {
  relaxed: {
    CELL: 30,
    COLS: 16,
    ROWS: 16,
    TICK_START_MS: 240,
    TICK_MIN_MS: 120,
    TICK_STEP_MS: 5,
    wrap: true,
    obstacleCount: 0,
    powerChance: 0.1,
    label: "Relaxed",
    description: "Chill speed, wrap-around edges, great for warming up.",
    speedCurve: "ease-out",
  },
  classic: {
    CELL: 26,
    COLS: 20,
    ROWS: 20,
    TICK_START_MS: 170,
    TICK_MIN_MS: 70,
    TICK_STEP_MS: 6,
    wrap: false,
    obstacleCount: 2,
    powerChance: 0.12,
    label: "Classic",
    description: "Balanced pace with light obstacles and occasional power-ups.",
    speedCurve: "linear",
  },
  expert: {
    CELL: 22,
    COLS: 24,
    ROWS: 24,
    TICK_START_MS: 150,
    TICK_MIN_MS: 55,
    TICK_STEP_MS: 6,
    wrap: false,
    obstacleCount: 8,
    powerChance: 0.16,
    label: "Expert",
    description: "Faster ramp, tighter space, dodging lots of barriers.",
    speedCurve: "ease-in",
  },
  blitz: {
    CELL: 20,
    COLS: 22,
    ROWS: 22,
    TICK_START_MS: 120,
    TICK_MIN_MS: 45,
    TICK_STEP_MS: 8,
    wrap: false,
    obstacleCount: 4,
    powerChance: 0.2,
    label: "Blitz",
    description: "Starts fast, gets wild—perfect for short intense runs.",
    speedCurve: "ease-in",
  },
  endless: {
    CELL: 18,
    COLS: 28,
    ROWS: 28,
    TICK_START_MS: 190,
    TICK_MIN_MS: 80,
    TICK_STEP_MS: 5,
    wrap: true,
    obstacleCount: 3,
    powerChance: 0.14,
    label: "Endless",
    description: "Massive board with wrap edges—how long can you last?",
    speedCurve: "linear",
  },
};

// Emoji pool for normal food
export const FOOD_EMOJIS = ["🍎", "🍌", "🍇", "🧀", "🍉", "🍓", "🥕", "🌽"];

// Power-up food config
import type { FoodKind } from "@/types";

export const POWER_UP_CONFIG: Record<
  FoodKind,
  { emoji: string; value: number; label: string }
> = {
  normal: { emoji: "🍎", value: 1, label: "+1" },
  golden: { emoji: "⭐", value: 5, label: "+5" },
  freeze: { emoji: "❄️", value: 1, label: "Freeze" },
  ghost: { emoji: "👻", value: 2, label: "Ghost" },
  multiplier: { emoji: "🔥", value: 3, label: "+3" },
};
