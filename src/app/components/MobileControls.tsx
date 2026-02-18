import type { Dir } from "@/types";

type Props = {
  visible: boolean;
  onDirection: (dir: Dir) => void;
};

const BTN_CLASS =
  "flex items-center justify-center rounded-xl bg-zinc-700/95 text-white active:bg-emerald-500 transition-colors select-none touch-manipulation min-w-[56px] min-h-[56px]";

export default function MobileControls({ visible, onDirection }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 pb-[env(safe-area-inset-bottom)] md:hidden"
      style={{ touchAction: "manipulation" }}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div />
        <button
          type="button"
          className={BTN_CLASS}
          aria-label="Move up"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection("up");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onDirection("up");
          }}
        >
          <span className="text-xl">↑</span>
        </button>
        <div />
        <button
          type="button"
          className={BTN_CLASS}
          aria-label="Move left"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection("left");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onDirection("left");
          }}
        >
          <span className="text-xl">←</span>
        </button>
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-800/50">
          <span className="text-xs text-zinc-500">⌂</span>
        </div>
        <button
          type="button"
          className={BTN_CLASS}
          aria-label="Move right"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection("right");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onDirection("right");
          }}
        >
          <span className="text-xl">→</span>
        </button>
        <div />
        <button
          type="button"
          className={BTN_CLASS}
          aria-label="Move down"
          onTouchStart={(e) => {
            e.preventDefault();
            onDirection("down");
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            onDirection("down");
          }}
        >
          <span className="text-xl">↓</span>
        </button>
        <div />
      </div>
    </div>
  );
}
