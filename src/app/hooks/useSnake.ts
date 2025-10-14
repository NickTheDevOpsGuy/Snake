import { useState, useCallback } from 'react';
import type { XY, Dir } from '@/types';

export function useSnake(initial: XY[]) {
  const [snake, setSnake] = useState<XY[]>(initial);
  const [dir, setDir] = useState<Dir>('right');

  const turn = useCallback((d: Dir) => setDir(d), []);
  const step = useCallback((nextHead: XY, grow = false) => {
    setSnake((s) => (grow ? [nextHead, ...s] : [nextHead, ...s.slice(0, -1)]));
  }, []);

  return { snake, dir, turn, step, setSnake, setDir };
}
