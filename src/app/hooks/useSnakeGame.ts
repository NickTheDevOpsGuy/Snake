import { useCallback, useRef, useState } from "react";
import type { XY, Dir } from "@/types";
import { eq, nextHead, outOfBounds, initSnake } from "@/utils/logic";

/**
 * Core game state + rules (no rendering).
 * Accepts callbacks for events like eating or dying.
 */
export function useSnakeGame(
  pickFreeCell: (snake: XY[]) => XY,
  opts?: {
    onEat?: () => void;  // play sound when food eaten
    onDie?: () => void;  // play sound when player dies
  }
) {
  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<XY[]>(initSnake());
  const foodRef = useRef<XY | null>(null);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const reset = useCallback(() => {
    snakeRef.current = initSnake();
    dirRef.current = "right";
    nextDirRef.current = null;
    foodRef.current = pickFreeCell(snakeRef.current);
    setAlive(true);
    setScore(0);
  }, [pickFreeCell]);

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

    // death check
    if (outOfBounds(nh) || bodyToCheck.some((s) => eq(s, nh))) {
      setAlive(false);
      opts?.onDie?.();
      return;
    }

    // eat or move
    if (willEat) {
      snake.unshift(nh);
      setScore((s) => s + 1);
      foodRef.current = pickFreeCell(snake);
      opts?.onEat?.();
    } else {
      snake.unshift(nh);
      snake.pop();
    }
  }, [pickFreeCell, opts]);

  return {
    alive,
    score,
    snakeRef,
    foodRef,
    reset,
    turn,
    tick,
  };
}
