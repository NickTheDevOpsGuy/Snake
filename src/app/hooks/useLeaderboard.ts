import { useCallback, useState } from 'react';
import type { GameDifficulty } from '@/constants/game';

export type LeaderboardEntry = {
  score: number;
  difficulty: GameDifficulty;
  date: number;
};

const STORAGE_KEY = 'snake-leaderboard';
const MAX_ENTRIES = 10;

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LeaderboardEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(loadLeaderboard);

  const submitScore = useCallback(
    (score: number, difficulty: GameDifficulty) => {
      const next: LeaderboardEntry[] = [
        ...entries,
        { score, difficulty, date: Date.now() },
      ]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_ENTRIES);
      setEntries(next);
      saveLeaderboard(next);
    },
    [entries]
  );

  return { entries, submitScore };
}
