import { useCallback, useRef, useState } from 'react';
import type { XY, Dir, Food } from '@/types';
import {
  eq,
  nextHead,
  outOfBounds as oobDefault,
  initSnake,
} from '@/utils/logic';
import { FOOD_EMOJIS } from '@/constants/game';

/**
 * Core game state + rules (no rendering).
 * Accepts callbacks for events like eating or dying, and an optional bounds override.
 */
export function useSnakeGame(
  pickFreeCell: (snake: XY[]) => XY,
  opts?: {
    onEat?: () => void;
    onDie?: () => void;
    isOutOfBounds?: (p: XY) => boolean; // overrides default bounds if provided
  }
) {
  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<XY[]>(initSnake());
  const foodRef = useRef<Food | null>(null);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const spawnFood = useCallback(
    (snake: XY[]): Food => {
      const coords = pickFreeCell(snake);
      const emoji = FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)];
      return { ...coords, emoji };
    },
    [pickFreeCell]
  );

  const reset = useCallback(() => {
    snakeRef.current = initSnake();
    dirRef.current = 'right';
    nextDirRef.current = null;
    foodRef.current = spawnFood(snakeRef.current);
    setAlive(true);
    setScore(0);
  }, [spawnFood]);

  /** Queue a direction; consumed once per tick */
  const turn = useCallback((d: Dir) => {
    nextDirRef.current = d;
  }, []);

  const tick = useCallback(() => {
    // apply queued turn
    if (nextDirRef.current) {
      dirRef.current = nextDirRef.current;
      nextDirRef.current = null;
    }

    const snake = snakeRef.current;
    const head = snake[0];
    if (!head) return;

    const nh = nextHead(head, dirRef.current);
    const food = foodRef.current;
    const willEat = !!food && eq(nh, food);
    const bodyToCheck = willEat ? snake : snake.slice(0, -1);

    const isOOB = opts?.isOutOfBounds ?? oobDefault;
    if (isOOB(nh) || bodyToCheck.some((s) => eq(s, nh))) {
      setAlive(false);
      opts?.onDie?.();
      return;
    }

    if (willEat) {
      snake.unshift(nh);
      setScore((s) => s + 1);
      foodRef.current = spawnFood(snake);
      opts?.onEat?.();
    } else {
      snake.unshift(nh);
      snake.pop();
    }
  }, [opts, spawnFood]);

  return { alive, score, snakeRef, foodRef, reset, turn, tick };
}
