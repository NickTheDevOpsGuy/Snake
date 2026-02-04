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
export const initSnake = (cols = 20, rows = 20): XY[] => {
  const row = Math.floor(rows / 2);
  const headX = Math.floor(cols / 2);
  return [
    { x: headX, y: row },
    { x: headX - 1, y: row },
    { x: headX - 2, y: row },
  ];
};

export function randomFreeCell(
  snake: XY[],
  cols: number,
  rows: number,
  blocked: XY[] = []
): XY {
  const isBlocked = (x: number, y: number) =>
    snake.some((c) => c.x === x && c.y === y) ||
    blocked.some((c) => c.x === x && c.y === y);

  while (true) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    if (!isBlocked(x, y)) return { x, y };
  }
}

/** Infer current direction from head→second segment. */
export function inferDirFromSnake(snake: XY[]): Dir {
  const [h, s] = snake;
  if (!s) return 'right';
  if (h.x === s.x) return h.y < s.y ? 'up' : 'down';
  return h.x < s.x ? 'left' : 'right';
}

export function wrapPoint(p: XY, cols: number, rows: number): XY {
  let x = p.x;
  let y = p.y;
  if (x < 0) x = cols - 1;
  if (x >= cols) x = 0;
  if (y < 0) y = rows - 1;
  if (y >= rows) y = 0;
  return { x, y };
}

export function manhattan(a: XY, b: XY) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function generateObstacles(
  count: number,
  cols: number,
  rows: number,
  snake: XY[],
  padding = 2
): XY[] {
  if (count <= 0) return [];
  const taken = new Set<string>();
  const key = (x: number, y: number) => `${x}:${y}`;
  snake.forEach((p) => taken.add(key(p.x, p.y)));

  const head = snake[0] ?? { x: 0, y: 0 };
  const result: XY[] = [];
  let attempts = 0;

  while (result.length < count && attempts < count * 50) {
    attempts += 1;
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);
    const candidate = key(x, y);
    if (taken.has(candidate)) continue;
    if (manhattan({ x, y }, head) <= padding) continue;
    taken.add(candidate);
    result.push({ x, y });
  }

  return result;
}
