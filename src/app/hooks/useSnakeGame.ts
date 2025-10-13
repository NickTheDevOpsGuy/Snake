import { useCallback, useMemo, useRef, useState } from "react";
import type { XY, Dir } from "@/types";
import { eq, nextHead, outOfBounds, initSnake } from "@/utils/logic";

export function useSnakeGame(randomFreeCell: (s: XY[]) => XY) {
  const dirRef = useRef<Dir>("right");
  const snakeRef = useRef<XY[]>(initSnake());
  const foodRef = useRef<XY | null>(null);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const reset = useCallback(() => {
    snakeRef.current = initSnake();
    dirRef.current = "right";
    foodRef.current = randomFreeCell(snakeRef.current);
    setAlive(true); setScore(0);
  }, [randomFreeCell]);

  const turn = useCallback((next: Dir) => { dirRef.current = next; }, []);

  const tick = useCallback(() => {
    const snake = snakeRef.current; const head = snake[0]; if (!head) return;
    const nh = nextHead(head, dirRef.current);
    const food = foodRef.current; const willEat = food && eq(nh, food);
    const bodyToCheck = willEat ? snake : snake.slice(0, -1);

    if (outOfBounds(nh) || bodyToCheck.some(s => eq(s, nh))) { setAlive(false); return; }

    if (willEat) { snake.unshift(nh); setScore(s => s + 1); foodRef.current = randomFreeCell(snake); }
    else { snake.unshift(nh); snake.pop(); }
  }, []);

  return {
    alive, score, snakeRef, foodRef,
    reset, turn, tick,
    state: useMemo(() => ({ alive, score }), [alive, score]),
  };
}