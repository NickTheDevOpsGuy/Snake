// src/app/utils/logic.ts
import type { XY, Dir } from '@/types';

export const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;

export const isOpposite = (a: Dir, b: Dir) =>
  (a === 'up' && b === 'down') ||
  (a === 'down' && b === 'up') ||
  (a === 'left' && b === 'right') ||
  (a === 'right' && b === 'left');

export const nextHead = (h: XY, d: Dir): XY =>
  d === 'up'
    ? { x: h.x, y: h.y - 1 }
    : d === 'down'
      ? { x: h.x, y: h.y + 1 }
      : d === 'left'
        ? { x: h.x - 1, y: h.y }
        : { x: h.x + 1, y: h.y };

/**
 * Bounds check. Defaults to a 20x20 board if cols/rows are not provided,
 * so existing call sites (outOfBounds(p)) keep working.
 */
export const outOfBounds = (p: XY, cols = 20, rows = 20) =>
  p.x < 0 || p.x >= cols || p.y < 0 || p.y >= rows;

/**
 * Initial snake centered on the given number of rows.
 * Defaults to 20 so initSnake() keeps working if caller doesn't pass rows.
 */
export const initSnake = (rows = 20): XY[] => {
  const row = Math.floor(rows / 2);
  return [
    { x: 2, y: row },
    { x: 1, y: row },
    { x: 0, y: row },
  ];
};

export function randomFreeCell(snake: XY[], cols: number, rows: number): XY {
  while (true) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!snake.some((c) => c.x === x && c.y === y)) return { x, y };
  }
}

/** Infer current direction from head→second segment. */
export function inferDirFromSnake(snake: XY[]): Dir {
  const [h, s] = snake;
  if (!s) return 'right';
  if (h.x === s.x) return h.y < s.y ? 'up' : 'down';
  return h.x < s.x ? 'left' : 'right';
}
