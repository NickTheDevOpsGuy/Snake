import { describe, it, expect, beforeEach } from 'vitest';
import { checkAchievements } from '@/services/achievementService';

describe('achievementService', () => {
  beforeEach(() => {
    localStorage.removeItem('snake-stats');
    localStorage.removeItem('snake-achievements');
  });

  describe('checkAchievements', () => {
    it('unlocks first_score when score >= 1', () => {
      const unlocked = checkAchievements(1, 'classic', 1, 0, 0, 0, 0);
      expect(unlocked).toContain('first_score');
    });
    it('unlocks score_25 when score >= 25', () => {
      const unlocked = checkAchievements(25, 'classic', 25, 0, 0, 0, 0);
      expect(unlocked).toContain('score_25');
    });
    it('unlocks expert_win when expert and score >= 20', () => {
      const unlocked = checkAchievements(20, 'expert', 20, 0, 0, 0, 0);
      expect(unlocked).toContain('expert_win');
    });
    it('unlocks blitz_win when blitz and score >= 15', () => {
      const unlocked = checkAchievements(15, 'blitz', 15, 0, 0, 0, 0);
      expect(unlocked).toContain('blitz_win');
    });
    it('unlocks ghost_3 when ghostUsed >= 3', () => {
      const unlocked = checkAchievements(5, 'classic', 5, 3, 0, 0, 0);
      expect(unlocked).toContain('ghost_3');
    });
    it('unlocks freeze_3 when freezeUsed >= 3', () => {
      const unlocked = checkAchievements(5, 'classic', 5, 0, 3, 0, 0);
      expect(unlocked).toContain('freeze_3');
    });
    it('unlocks combo_5 when comboMax >= 5', () => {
      const unlocked = checkAchievements(5, 'classic', 5, 0, 0, 5, 0);
      expect(unlocked).toContain('combo_5');
    });
    it('unlocks games_10 when totalGames >= 10', () => {
      const unlocked = checkAchievements(0, 'classic', 0, 0, 0, 0, 10);
      expect(unlocked).toContain('games_10');
    });
    it('returns only newly unlocked ids', () => {
      const first = checkAchievements(1, 'classic', 1, 0, 0, 0, 0);
      expect(first).toContain('first_score');
      const second = checkAchievements(1, 'classic', 1, 0, 0, 0, 0);
      expect(second).not.toContain('first_score');
    });
  });
});
