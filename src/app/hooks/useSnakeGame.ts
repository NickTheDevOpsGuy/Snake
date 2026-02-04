import { useCallback, useRef, useState } from "react";
import type { XY, Dir, Food, FoodKind } from "@/types";
import { eq, initSnake, randomFreeCell, generateObstacles } from "@/utils/logic";
import {
  computeNextHead,
  isOutOfBounds,
  checkCollisions,
  willEatFood,
} from "@/utils/gameTick";
import { FOOD_EMOJIS, POWER_UP_CONFIG } from "@/constants/game";

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
  },
) {
  const { cols, rows, wrap, obstacleCount, powerChance } = config;

  const dirRef = useRef<Dir>("right");
  const nextDirRef = useRef<Dir | null>(null);
  const snakeRef = useRef<XY[]>(initSnake(cols, rows));
  const foodRef = useRef<Food | null>(null);
  const obstaclesRef = useRef<XY[]>([]);
  const freezeUntilRef = useRef<number>(0);
  const ghostUntilRef = useRef<number>(0);

  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);

  const spawnFood = useCallback(
    (snake: XY[]): Food => {
      const blocked = [...obstaclesRef.current];
      const coords = randomFreeCell(snake, cols, rows, blocked);

      const isPowerUp = Math.random() < powerChance;
      const kinds: FoodKind[] = ["golden", "freeze", "ghost", "multiplier"];
      const kind: FoodKind = isPowerUp
        ? kinds[Math.floor(Math.random() * kinds.length)]
        : "normal";

      const cfg = POWER_UP_CONFIG[kind];
      const emoji =
        kind === "normal"
          ? FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
          : cfg.emoji;

      return {
        ...coords,
        kind,
        emoji,
        value: cfg.value,
      };
    },
    [cols, rows, powerChance],
  );

  const reset = useCallback(() => {
    const snake = initSnake(cols, rows);
    snakeRef.current = snake;
    dirRef.current = "right";
    nextDirRef.current = null;
    obstaclesRef.current = generateObstacles(obstacleCount, cols, rows, snake);
    foodRef.current = spawnFood(snake);
    freezeUntilRef.current = 0;
    ghostUntilRef.current = 0;
    setAlive(true);
    setScore(0);
  }, [cols, rows, obstacleCount, spawnFood]);

  const turn = useCallback((d: Dir) => {
    nextDirRef.current = d;
  }, []);

  const tick = useCallback(() => {
    const now = Date.now();
    if (now < freezeUntilRef.current) return;

    if (nextDirRef.current) {
      dirRef.current = nextDirRef.current;
      nextDirRef.current = null;
    }

    const snake = snakeRef.current;
    const head = snake[0];
    if (!head) return;

    const nh = computeNextHead(head, dirRef.current, cols, rows, wrap);

    if (!wrap && isOutOfBounds(nh, cols, rows)) {
      setAlive(false);
      opts?.onDie?.();
      return;
    }

    const food = foodRef.current;
    const eating = willEatFood(nh, food);
    const bodyToCheck = eating ? snake : snake.slice(0, -1);
    const ghostActive = now < ghostUntilRef.current;
    const collision = checkCollisions(
      nh,
      bodyToCheck,
      obstaclesRef.current,
      ghostActive,
    );

    if (collision !== "none") {
      setAlive(false);
      opts?.onDie?.();
      return;
    }

    if (eating && food) {
      snake.unshift(nh);
      const value = food.value ?? 1;
      setScore((s) => s + value);
      foodRef.current = spawnFood(snake);
      opts?.onEat?.(value, food.kind);
      if (food.kind === "freeze") freezeUntilRef.current = now + 2500;
      if (food.kind === "ghost") ghostUntilRef.current = now + 4000;
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
