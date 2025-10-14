import { useEffect } from 'react';
import { keyToDir, Dir } from '@/types';
import { isOpposite } from '@/utils/logic';

export function useInput(opts: {
  alive: boolean;
  getCurrentDir: () => Dir;
  onTurn: (d: Dir) => void;
  onRestart: () => void;
  onMoveKey?: () => void; // 🔊 new optional callback for arrow key press
}) {
  const { alive, getCurrentDir, onTurn, onRestart, onMoveKey } = opts;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // restart
      if (e.code === 'Space') {
        if (!alive) onRestart();
        return;
      }

      // direction input
      const next = keyToDir[e.key];
      if (!next) return;

      e.preventDefault();

      const cur = getCurrentDir();
      if (!isOpposite(cur, next)) {
        onTurn(next);
        onMoveKey?.(); // 🔊 play sound only when valid move key pressed
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [alive, getCurrentDir, onTurn, onRestart, onMoveKey]);
}
