// hooks/usePauseHotkey.ts
import { useEffect } from "react";
export function usePauseHotkey(enabled: boolean, toggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!enabled) return;
      if (e.key.toLowerCase() === "p") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, toggle]);
}
