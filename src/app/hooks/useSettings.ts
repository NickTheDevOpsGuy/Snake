import { useCallback, useEffect, useState } from "react";
import type { GameDifficulty } from "@/constants/game";

const MUTE_KEY = "snake-muted";
const DIFFICULTY_KEY = "snake-difficulty";
const PLAYER_NAME_KEY = "snake-player-name";

function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

function loadDifficulty(): GameDifficulty {
  try {
    const v = localStorage.getItem(DIFFICULTY_KEY);
    if (
      v === "relaxed" ||
      v === "classic" ||
      v === "expert" ||
      v === "blitz" ||
      v === "endless"
    )
      return v;
  } catch {
    // ignore
  }
  return "classic";
}

function loadPlayerName(): string {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function useSettings() {
  const [muted, setMutedState] = useState(loadMuted);
  const [playerName, setPlayerNameState] = useState(loadPlayerName);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    try {
      localStorage.setItem(MUTE_KEY, String(v));
    } catch {
      // ignore
    }
  }, []);

  const setPlayerName = useCallback((v: string) => {
    setPlayerNameState(v);
    try {
      localStorage.setItem(PLAYER_NAME_KEY, v);
    } catch {
      // ignore
    }
  }, []);

  const persistDifficulty = useCallback((d: GameDifficulty) => {
    try {
      localStorage.setItem(DIFFICULTY_KEY, d);
    } catch {
      // ignore
    }
  }, []);

  return {
    muted,
    setMuted,
    playerName,
    setPlayerName,
    persistDifficulty,
    initialDifficulty: loadDifficulty(),
  };
}
