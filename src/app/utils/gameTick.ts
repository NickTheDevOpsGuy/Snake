import type { XY, Dir, Food } from '@/types';
import { eq, nextHead, wrapPoint } from './logic';

export function computeNextHead(
  head: XY,
  dir: Dir,
  cols: number,
  rows: number,
  wrap: boolean
): XY {
  let nh = nextHead(head, dir);
  if (wrap) nh = wrapPoint(nh, cols, rows);
  return nh;
}

export function isOutOfBounds(p: XY, cols: number, rows: number): boolean {
  return p.x < 0 || p.x >= cols || p.y < 0 || p.y >= rows;
}

export function checkCollisions(
  nh: XY,
  bodyToCheck: XY[],
  obstacles: XY[],
  ghostActive: boolean
): 'body' | 'obstacle' | 'none' {
  const hitBody = bodyToCheck.some((s) => eq(s, nh));
  const hitObstacle = obstacles.some((o) => eq(o, nh));
  if (hitBody && !ghostActive) return 'body';
  if (hitObstacle) return 'obstacle';
  return 'none';
}

export function willEatFood(nh: XY, food: Food | null): boolean {
  return !!food && eq(nh, food);
}
