import { supabase, isSupabaseConfigured } from '@/supabase/client';
import type { GameDifficulty } from '@/constants/game';

export type LeaderboardScore = {
  rank: number;
  score: number;
  difficulty: GameDifficulty;
  playerName: string | null;
  createdAt: string;
};

/** Fetch global leaderboard for a difficulty. */
export async function fetchLeaderboard(
  difficulty: GameDifficulty,
  limit = 10
): Promise<LeaderboardScore[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  const { data, error } = await supabase
    .from('snake_scores')
    .select('score, player_name, created_at')
    .eq('difficulty', difficulty)
    .order('score', { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data ?? []).map((row, i) => ({
    rank: i + 1,
    score: row.score,
    difficulty,
    playerName: row.player_name ?? 'Anonymous',
    createdAt: row.created_at,
  }));
}

/** Submit a score to the global leaderboard. */
export async function submitScore(
  score: number,
  difficulty: GameDifficulty,
  playerName?: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase.from('snake_scores').insert({
    score,
    difficulty,
    player_name: playerName?.trim() || null,
  });

  return !error;
}
