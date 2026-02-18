import type { GameTheme } from "@/constants/themes";

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  return audioContext;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
) {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

const SOUNDS: Record<
  GameTheme,
  { eat: () => void; die: () => void; move: () => void }
> = {
  classic: { eat: () => {}, die: () => {}, move: () => {} }, // uses mp3 files
  space: {
    eat: () => playTone(880, 0.08, "square", 0.2),
    die: () => {
      const ctx = getContext();
      if (!ctx) return;
      [400, 350, 300, 250].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.15, "sawtooth", 0.25), i * 80),
      );
    },
    move: () => playTone(200, 0.03, "square", 0.1),
  },
  ocean: {
    eat: () => playTone(523, 0.1, "sine", 0.25),
    die: () => {
      [392, 349, 330].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.2, "sine", 0.2), i * 120),
      );
    },
    move: () => playTone(150, 0.04, "sine", 0.12),
  },
  forest: {
    eat: () => playTone(659, 0.09, "sine", 0.22),
    die: () => {
      [330, 262, 196].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.18, "triangle", 0.2), i * 100),
      );
    },
    move: () => playTone(180, 0.035, "sine", 0.1),
  },
  neon: {
    eat: () => playTone(1200, 0.06, "square", 0.18),
    die: () => {
      [600, 500, 400].forEach((f, i) =>
        setTimeout(() => playTone(f, 0.12, "square", 0.2), i * 70),
      );
    },
    move: () => playTone(300, 0.025, "square", 0.08),
  },
};

export function playThemeSound(theme: GameTheme, type: "eat" | "die" | "move") {
  if (theme === "classic") return; // caller uses mp3
  SOUNDS[theme][type]?.();
}
