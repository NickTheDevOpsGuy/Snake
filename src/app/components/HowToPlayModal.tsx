import { X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HowToPlayModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl bg-zinc-900 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-zinc-700 px-4 py-3'>
          <h2 className='font-mono text-lg font-semibold text-white'>
            How to Play
          </h2>
          <button
            type='button'
            className='rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            onClick={onClose}
            aria-label='Close'
          >
            <X size={24} />
          </button>
        </div>

        <div className='space-y-4 p-4 text-sm text-zinc-300'>
          <p>
            Guide the snake to eat food and grow. Don&apos;t hit walls,
            obstacles, or yourself!
          </p>
          <div>
            <h3 className='mb-2 font-semibold text-white'>Controls</h3>
            <ul className='list-inside list-disc space-y-1'>
              <li>Arrow keys or WASD</li>
              <li>Swipe on mobile</li>
              <li>Tap the D-pad on mobile</li>
              <li>P to pause</li>
            </ul>
          </div>
          <div>
            <h3 className='mb-2 font-semibold text-white'>Power-ups</h3>
            <ul className='space-y-1'>
              <li>
                <span className='text-amber-400'>⭐ Golden</span> — +5 points
              </li>
              <li>
                <span className='text-cyan-400'>❄️ Freeze</span> — Pause timer
                briefly
              </li>
              <li>
                <span className='text-purple-400'>👻 Ghost</span> — Pass through
                yourself once
              </li>
              <li>
                <span className='text-orange-400'>🔥 Multiplier</span> — +3
                points
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-2 font-semibold text-white'>Difficulty</h3>
            <p>
              Choose Relaxed for wrap-around edges, or Classic/Expert for
              obstacles. Blitz starts fast!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
