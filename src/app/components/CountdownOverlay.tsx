import { useState, useEffect } from 'react';

type Props = {
  visible: boolean;
  onComplete: () => void;
};

const STEPS = ['3', '2', '1', 'Go!'];
const STEP_MS = 800;

export default function CountdownOverlay({ visible, onComplete }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!visible) {
      setStep(0);
      return;
    }
    if (step >= STEPS.length) {
      onComplete();
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [visible, step, onComplete]);

  if (!visible || step >= STEPS.length) return null;

  return (
    <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
      <span
        className={`font-mono text-5xl font-bold text-white ${
          step === STEPS.length - 1 ? 'text-emerald-400' : ''
        }`}
      >
        {STEPS[step]}
      </span>
    </div>
  );
}
