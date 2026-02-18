import { useCallback, useEffect, useMemo, useState } from "react";
import { DIFFICULTY_PRESETS, type GameDifficulty } from "@/constants/game";

export type Phase = "menu" | "countdown" | "playing" | "gameover";

export function useGameSetup(opts?: {
  muted?: boolean;
  initialDifficulty?: GameDifficulty;
}) {
  const muted = opts?.muted ?? false;
  const [phase, setPhase] = useState<Phase>("menu");
  const [difficulty, setDifficulty] = useState<GameDifficulty>(
    opts?.initialDifficulty ?? "classic",
  );
  const [paused, setPaused] = useState(false);
  const [bump, setBump] = useState(false);

  const eatSnd = useMemo(() => new Audio("/sounds/food.mp3"), []);
  const dieSnd = useMemo(() => new Audio("/sounds/gameover.mp3"), []);
  const keySnd = useMemo(() => new Audio("/sounds/move.mp3"), []);

  useEffect(() => {
    eatSnd.volume = 0.7;
    dieSnd.volume = 0.9;
    keySnd.volume = 0.4;
  }, [eatSnd, dieSnd, keySnd]);

  const play = useCallback(
    (a: HTMLAudioElement) => {
      if (muted) return;
      try {
        a.currentTime = 0;
        void a.play();
      } catch (err) {
        console.error("Audio play exception:", err);
      }
    },
    [muted],
  );

  const playEat = useCallback(() => play(eatSnd), [play, eatSnd]);
  const playDie = useCallback(() => play(dieSnd), [play, dieSnd]);
  const playMove = useCallback(() => play(keySnd), [play, keySnd]);

  const triggerBump = useCallback(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, []);

  return {
    phase,
    setPhase,
    difficulty,
    setDifficulty,
    paused,
    setPaused,
    bump,
    triggerBump,
    tuning: DIFFICULTY_PRESETS[difficulty],
    sounds: { playEat, playDie, playMove },
  };
}
