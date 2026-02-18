import { useCallback, useState } from "react";
import type { GameDifficulty } from "@/constants/game";

export type LocalLeaderboardEntry = {
  score: number;
  difficulty: GameDifficulty;
  playerName: string | null;
  date: number;
};

const STORAGE_KEY = "snake-leaderboard";
const MAX_ENTRIES = 10;

function loadLocalLeaderboard(): LocalLeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalLeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalLeaderboard(entries: LocalLeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function useLeaderboard() {
  const [localEntries, setLocalEntries] =
    useState<LocalLeaderboardEntry[]>(loadLocalLeaderboard);

  const submitScore = useCallback(
    (score: number, difficulty: GameDifficulty, playerName?: string) => {
      const name = playerName?.trim() || null;
      const next: LocalLeaderboardEntry[] = [
        ...localEntries,
        { score, difficulty, playerName: name, date: Date.now() },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      setLocalEntries(next);
      saveLocalLeaderboard(next);
    },
    [localEntries],
  );

  return { localEntries, submitScore };
}
