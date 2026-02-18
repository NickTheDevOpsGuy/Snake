import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStats,
  recordGame,
  loadUnlockedAchievements,
  unlockAchievement,
} from '@/services/statsService';

describe('statsService', () => {
  beforeEach(() => {
    localStorage.removeItem('snake-stats');
    localStorage.removeItem('snake-achievements');
  });

  describe('getStats', () => {
    it('returns default stats when empty', () => {
      const stats = getStats();
      expect(stats.totalGames).toBe(0);
      expect(stats.totalFoodEaten).toBe(0);
      expect(stats.ghostUsed).toBe(0);
      expect(stats.freezeUsed).toBe(0);
      expect(stats.bestPerDifficulty.classic).toBe(0);
    });
  });

  describe('recordGame', () => {
    it('increments totalGames and totalFoodEaten', () => {
      recordGame(5, 'classic', 5, 0, 0);
      const stats = getStats();
      expect(stats.totalGames).toBe(1);
      expect(stats.totalFoodEaten).toBe(5);
    });
    it('updates bestPerDifficulty when score is higher', () => {
      recordGame(10, 'classic', 10, 0, 0);
      recordGame(15, 'classic', 15, 0, 0);
      const stats = getStats();
      expect(stats.bestPerDifficulty.classic).toBe(15);
    });
    it('does not lower best when score is lower', () => {
      recordGame(20, 'expert', 20, 0, 0);
      recordGame(10, 'expert', 10, 0, 0);
      const stats = getStats();
      expect(stats.bestPerDifficulty.expert).toBe(20);
    });
    it('accumulates ghostUsed and freezeUsed', () => {
      recordGame(3, 'classic', 5, 2, 1);
      recordGame(2, 'classic', 3, 1, 2);
      const stats = getStats();
      expect(stats.ghostUsed).toBe(3);
      expect(stats.freezeUsed).toBe(3);
    });
  });

  describe('loadUnlockedAchievements', () => {
    it('returns empty set when none unlocked', () => {
      const set = loadUnlockedAchievements();
      expect(set.size).toBe(0);
    });
  });

  describe('unlockAchievement', () => {
    it('adds achievement and returns true', () => {
      const ok = unlockAchievement('first_score');
      expect(ok).toBe(true);
      expect(loadUnlockedAchievements().has('first_score')).toBe(true);
    });
    it('returns false when already unlocked', () => {
      unlockAchievement('first_score');
      const ok = unlockAchievement('first_score');
      expect(ok).toBe(false);
    });
  });
});
