import type { GameDifficulty } from "@/constants/game";

const STATS_KEY = "snake-stats";
const ACHIEVEMENTS_KEY = "snake-achievements";

export type GameStats = {
  totalGames: number;
  totalFoodEaten: number;
  bestPerDifficulty: Record<GameDifficulty, number>;
  ghostUsed: number;
  freezeUsed: number;
};

const DEFAULT_STATS: GameStats = {
  totalGames: 0,
  totalFoodEaten: 0,
  bestPerDifficulty: {
    relaxed: 0,
    classic: 0,
    expert: 0,
    blitz: 0,
    endless: 0,
  },
  ghostUsed: 0,
  freezeUsed: 0,
};

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      bestPerDifficulty: { ...DEFAULT_STATS.bestPerDifficulty, ...parsed.bestPerDifficulty },
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function getStats(): GameStats {
  return loadStats();
}

export function recordGame(
  score: number,
  difficulty: GameDifficulty,
  foodEaten: number,
  ghostUsed: number,
  freezeUsed: number,
) {
  const stats = loadStats();
  stats.totalGames += 1;
  stats.totalFoodEaten += foodEaten;
  stats.ghostUsed += ghostUsed;
  stats.freezeUsed += freezeUsed;
  if (score > stats.bestPerDifficulty[difficulty]) {
    stats.bestPerDifficulty[difficulty] = score;
  }
  saveStats(stats);
  return stats;
}

export function loadUnlockedAchievements(): Set<string> {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export function unlockAchievement(id: string) {
  const unlocked = loadUnlockedAchievements();
  if (unlocked.has(id)) return false;
  unlocked.add(id);
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...unlocked]));
  } catch {
    return false;
  }
  return true;
}
