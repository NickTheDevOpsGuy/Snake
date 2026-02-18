import { useCallback, useEffect, useRef } from "react";
import type { Dir } from "@/types";

const MIN_SWIPE_DIST = 30;

export function useSwipe(opts: {
  enabled: boolean;
  onSwipe: (dir: Dir) => void;
}) {
  const { enabled, onSwipe } = opts;
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const t = e.touches[0];
      if (t) startRef.current = { x: t.clientX, y: t.clientY };
    },
    [enabled],
  );

  const handleEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !startRef.current) return;
      const t = e.changedTouches[0];
      if (!t) return;

      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      startRef.current = null;

      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (adx < MIN_SWIPE_DIST && ady < MIN_SWIPE_DIST) return;

      if (adx > ady) {
        onSwipe(dx > 0 ? "right" : "left");
      } else {
        onSwipe(dy > 0 ? "down" : "up");
      }
    },
    [enabled, onSwipe],
  );

  useEffect(() => {
    const target = document;
    target.addEventListener("touchstart", handleStart, { passive: true });
    target.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      target.removeEventListener("touchstart", handleStart);
      target.removeEventListener("touchend", handleEnd);
    };
  }, [handleStart, handleEnd]);
}
