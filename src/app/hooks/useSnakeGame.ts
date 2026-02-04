import { useCallback, useRef, useState } from 'react';
import type { XY, Dir, Food, FoodKind } from '@/types';
import {
  eq,
  nextHead,
  initSnake,
  wrapPoint,
  randomFreeCell,
  generateObstacles,
} from '@/utils/logic';
import { FOOD_EMOJIS, POWER_UP_CONFIG } from '@/constants/game';

export type GameConfig = {
  cols: number;
  rows: number;
  wrap: boolean;
  obstacleCount: number;
  powerChance: number;
};

/**
 * Core game state + rules (no rendering).
 * Supports obstacles, wrap mode, and power-up food.
 */
export function useSnakeGame(
  config: GameConfig,
  opts?: {
    onEat?: (value: number, kind: FoodKind) => void;
    onDie?: () => void;
  }
) {
  const { cols, rows, wrap, obstacleCount, powerChance } = config;

  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<XY[]>(initSnake(cols, rows));
  const foodRef = useRef<Food | null>(null);
  const obstaclesRef = useRef<XY[]>([]);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const spawnFood = useCallback(
    (snake: XY[]): Food => {
      const blocked = [...obstaclesRef.current];
      const coords = randomFreeCell(snake, cols, rows, blocked);

      const isPowerUp = Math.random() < powerChance;
      const kinds: FoodKind[] = ['golden', 'freeze', 'ghost', 'multiplier'];
      const kind: FoodKind = isPowerUp
        ? kinds[Math.floor(Math.random() * kinds.length)]
        : 'normal';

      const cfg = POWER_UP_CONFIG[kind];
      const emoji =
        kind === 'normal'
          ? FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
          : cfg.emoji;

      return {
        ...coords,
        kind,
        emoji,
        value: cfg.value,
      };
    },
    [cols, rows, powerChance]
  );

  const reset = useCallback(() => {
    const snake = initSnake(cols, rows);
    snakeRef.current = snake;
    dirRef.current = 'right';
    nextDirRef.current = null;
    obstaclesRef.current = generateObstacles(obstacleCount, cols, rows, snake);
    foodRef.current = spawnFood(snake);
    setAlive(true);
    setScore(0);
  }, [cols, rows, obstacleCount, spawnFood]);

  const turn = useCallback((d: Dir) => {
    nextDirRef.current = d;
  }, []);

  const tick = useCallback(() => {
    if (nextDirRef.current) {
      dirRef.current = nextDirRef.current;
      nextDirRef.current = null;
    }

    const snake = snakeRef.current;
    const head = snake[0];
    if (!head) return;

    let nh = nextHead(head, dirRef.current);

    if (wrap) {
      nh = wrapPoint(nh, cols, rows);
    } else {
      const oob = nh.x < 0 || nh.x >= cols || nh.y < 0 || nh.y >= rows;
      if (oob) {
        setAlive(false);
        opts?.onDie?.();
        return;
      }
    }

    const food = foodRef.current;
    const willEat = !!food && eq(nh, food);
    const bodyToCheck = willEat ? snake : snake.slice(0, -1);

    const hitBody = bodyToCheck.some((s) => eq(s, nh));
    const hitObstacle = obstaclesRef.current.some((o) => eq(o, nh));

    if (hitBody || hitObstacle) {
      setAlive(false);
      opts?.onDie?.();
      return;
    }

    if (willEat) {
      snake.unshift(nh);
      const value = food.value ?? 1;
      setScore((s) => s + value);
      foodRef.current = spawnFood(snake);
      opts?.onEat?.(value, food.kind);
    } else {
      snake.unshift(nh);
      snake.pop();
    }
  }, [cols, rows, wrap, opts, spawnFood]);

  return {
    alive,
    score,
    snakeRef,
    foodRef,
    obstaclesRef,
    reset,
    turn,
    tick,
  };
}
