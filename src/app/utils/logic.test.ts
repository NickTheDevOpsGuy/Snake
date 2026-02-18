import { describe, it, expect } from 'vitest';
import {
  eq,
  isOpposite,
  nextHead,
  outOfBounds,
  initSnake,
  inferDirFromSnake,
  wrapPoint,
  generateObstacles,
} from '@/utils/logic';

describe('logic', () => {
  describe('eq', () => {
    it('returns true for same coords', () => {
      expect(eq({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    });
    it('returns false for different coords', () => {
      expect(eq({ x: 1, y: 2 }, { x: 0, y: 2 })).toBe(false);
      expect(eq({ x: 1, y: 2 }, { x: 1, y: 0 })).toBe(false);
    });
  });

  describe('isOpposite', () => {
    it('returns true for opposite directions', () => {
      expect(isOpposite('up', 'down')).toBe(true);
      expect(isOpposite('down', 'up')).toBe(true);
      expect(isOpposite('left', 'right')).toBe(true);
      expect(isOpposite('right', 'left')).toBe(true);
    });
    it('returns false for same or non-opposite', () => {
      expect(isOpposite('up', 'up')).toBe(false);
      expect(isOpposite('up', 'left')).toBe(false);
      expect(isOpposite('left', 'down')).toBe(false);
    });
  });

  describe('nextHead', () => {
    it('moves head in each direction', () => {
      const h = { x: 10, y: 10 };
      expect(nextHead(h, 'up')).toEqual({ x: 10, y: 9 });
      expect(nextHead(h, 'down')).toEqual({ x: 10, y: 11 });
      expect(nextHead(h, 'left')).toEqual({ x: 9, y: 10 });
      expect(nextHead(h, 'right')).toEqual({ x: 11, y: 10 });
    });
  });

  describe('outOfBounds', () => {
    it('returns false for in-bounds (default 20x20)', () => {
      expect(outOfBounds({ x: 0, y: 0 })).toBe(false);
      expect(outOfBounds({ x: 19, y: 19 })).toBe(false);
      expect(outOfBounds({ x: 10, y: 10 })).toBe(false);
    });
    it('returns true for out-of-bounds', () => {
      expect(outOfBounds({ x: -1, y: 0 })).toBe(true);
      expect(outOfBounds({ x: 20, y: 0 })).toBe(true);
      expect(outOfBounds({ x: 0, y: -1 })).toBe(true);
      expect(outOfBounds({ x: 0, y: 20 })).toBe(true);
    });
    it('respects custom cols/rows', () => {
      expect(outOfBounds({ x: 5, y: 5 }, 10, 10)).toBe(false);
      expect(outOfBounds({ x: 10, y: 5 }, 10, 10)).toBe(true);
    });
  });

  describe('initSnake', () => {
    it('returns 3 segments centered horizontally', () => {
      const snake = initSnake(20, 20);
      expect(snake).toHaveLength(3);
      const row = 10;
      expect(snake[0]).toEqual({ x: 10, y: row });
      expect(snake[1]).toEqual({ x: 9, y: row });
      expect(snake[2]).toEqual({ x: 8, y: row });
    });
    it('respects cols and rows', () => {
      const snake = initSnake(8, 6);
      expect(snake[0]).toEqual({ x: 4, y: 3 });
      expect(snake[1]).toEqual({ x: 3, y: 3 });
      expect(snake[2]).toEqual({ x: 2, y: 3 });
    });
  });

  describe('inferDirFromSnake', () => {
    it('infers direction from head and second segment', () => {
      expect(
        inferDirFromSnake([
          { x: 2, y: 1 },
          { x: 1, y: 1 },
        ])
      ).toBe('right');
      expect(
        inferDirFromSnake([
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ])
      ).toBe('left');
      expect(
        inferDirFromSnake([
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ])
      ).toBe('up');
      expect(
        inferDirFromSnake([
          { x: 1, y: 1 },
          { x: 1, y: 0 },
        ])
      ).toBe('down');
    });
    it('returns right for single segment', () => {
      expect(inferDirFromSnake([{ x: 5, y: 5 }])).toBe('right');
    });
  });

  describe('wrapPoint', () => {
    it('wraps negative to other side', () => {
      expect(wrapPoint({ x: -1, y: 5 }, 10, 10)).toEqual({ x: 9, y: 5 });
      expect(wrapPoint({ x: 5, y: -1 }, 10, 10)).toEqual({ x: 5, y: 9 });
    });
    it('wraps >= cols/rows to 0', () => {
      expect(wrapPoint({ x: 10, y: 5 }, 10, 10)).toEqual({ x: 0, y: 5 });
      expect(wrapPoint({ x: 5, y: 10 }, 10, 10)).toEqual({ x: 5, y: 0 });
    });
    it('leaves in-bounds unchanged', () => {
      expect(wrapPoint({ x: 5, y: 5 }, 10, 10)).toEqual({ x: 5, y: 5 });
    });
  });

  describe('generateObstacles', () => {
    it('returns empty for count 0', () => {
      const snake = initSnake(10, 10);
      expect(generateObstacles(0, 10, 10, snake)).toEqual([]);
    });
    it('returns obstacles not on snake', () => {
      const snake = initSnake(20, 20);
      const obs = generateObstacles(5, 20, 20, snake);
      expect(obs).toHaveLength(5);
      const snakeSet = new Set(snake.map((p) => `${p.x}:${p.y}`));
      obs.forEach((p) => {
        expect(snakeSet.has(`${p.x}:${p.y}`)).toBe(false);
      });
    });
  });
});
