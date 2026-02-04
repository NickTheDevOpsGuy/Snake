import type { GameDifficulty } from '@/constants/game';
import type { AchievementId } from '@/data/achievements';
import { loadUnlockedAchievements, unlockAchievement } from './statsService';

export function checkAchievements(
  score: number,
  difficulty: GameDifficulty,
  foodEaten: number,
  ghostUsed: number,
  freezeUsed: number,
  comboMax: number,
  totalGames: number
): AchievementId[] {
  const newlyUnlocked: AchievementId[] = [];
  const unlocked = loadUnlockedAchievements();

  const tryUnlock = (id: AchievementId) => {
    if (!unlocked.has(id) && unlockAchievement(id)) {
      newlyUnlocked.push(id);
    }
  };

  if (score >= 1) tryUnlock('first_score');
  if (score >= 25) tryUnlock('score_25');
  if (score >= 50) tryUnlock('score_50');
  if (score >= 100) tryUnlock('score_100');
  if (ghostUsed >= 3) tryUnlock('ghost_3');
  if (freezeUsed >= 3) tryUnlock('freeze_3');
  if (difficulty === 'expert' && score >= 20) tryUnlock('expert_win');
  if (difficulty === 'blitz' && score >= 15) tryUnlock('blitz_win');
  if (comboMax >= 5) tryUnlock('combo_5');
  if (totalGames >= 10) tryUnlock('games_10');
  if (totalGames >= 50) tryUnlock('games_50');

  return newlyUnlocked;
}
