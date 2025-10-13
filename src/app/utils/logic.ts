import { COLS, ROWS } from "@/constants/game";
import type { XY, Dir } from "@/types";

export const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;

export const isOpposite = (a: Dir, b: Dir) =>
  (a === "up" && b === "down") || (a === "down" && b === "up") ||
  (a === "left" && b === "right") || (a === "right" && b === "left");

export const nextHead = (h: XY, d: Dir): XY =>
  d === "up" ? { x: h.x, y: h.y - 1 } :
  d === "down" ? { x: h.x, y: h.y + 1 } :
  d === "left" ? { x: h.x - 1, y: h.y } : { x: h.x + 1, y: h.y };

export const outOfBounds = (p: XY) =>
  p.x < 0 || p.x >= COLS || p.y < 0 || p.y >= ROWS;

export const initSnake = (): XY[] => {
  const row = Math.floor(ROWS / 2);
  return [{ x: 2, y: row }, { x: 1, y: row }, { x: 0, y: row }];
};