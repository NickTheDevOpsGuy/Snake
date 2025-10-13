import { useCallback, useRef, useState } from 'react';
import type { XY, Dir } from '@/types';
import { eq, nextHead, outOfBounds, initSnake } from '@/utils/logic';
import { COLS, ROWS } from '@/constants/game';

/**
 * Game state + rules (no rendering).
 * Accepts a cell picker so you can swap randomness later (tests/determinism).
 */
export function useSnakeGame(pickFreeCell: (snake: XY[]) => XY) {
  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir | null>(null); // queue one turn per tick
  const snakeRef = useRef<XY[]>(initSnake());
  const foodRef = useRef<XY | null>(null);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const reset = useCallback(() => {
    snakeRef.current = initSnake();
    dirRef.current = 'right';
    nextDirRef.current = null;
    foodRef.current = pickFreeCell(snakeRef.current);
    setAlive(true);
    setScore(0);
  }, [pickFreeCell]);

  /** Queue a direction; consumed on the next tick. */
  const turn = useCallback((d: Dir) => {
    nextDirRef.current = d;
  }, []);

  const tick = useCallback(() => {
    // apply queued direction once per tick
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

    if (outOfBounds(nh) || bodyToCheck.some((s) => eq(s, nh))) {
      setAlive(false);
      return;
    }

    if (willEat) {
      snake.unshift(nh);
      setScore((s) => s + 1);
      foodRef.current = pickFreeCell(snake);
    } else {
      snake.unshift(nh);
      snake.pop();
    }
  }, [pickFreeCell]);

  // initial food if needed (call reset() from component on mount)

  return {
    // state
    alive,
    score,
    snakeRef,
    foodRef,
    // controls
    reset,
    turn,
    tick,
  };
}
