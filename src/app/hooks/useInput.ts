import { useEffect } from 'react';
import { keyToDir, type Dir } from '@/types';
import { isOpposite } from '@/utils/logic';

/** Keyboard input handler. Keeps component clean. */
export function useInput(opts: {
  alive: boolean;
  getCurrentDir: () => Dir;
  onTurn: (d: Dir) => void;
  onRestart: () => void;
}) {
  const { alive, getCurrentDir, onTurn, onRestart } = opts;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!alive) onRestart();
        return;
      }
      const next = keyToDir[e.key];
      if (!next) return;
      e.preventDefault();
      const cur = getCurrentDir();
      if (!isOpposite(cur, next)) onTurn(next);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [alive, getCurrentDir, onTurn, onRestart]);
}
