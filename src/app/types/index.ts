export * from './game';
export * from './ui';
export type XY = { x: number; y: number };
export type Dir = 'up' | 'down' | 'left' | 'right';

export const keyToDir: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};
export const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;
