import { useEffect } from 'react';

type Props = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  durationMs?: number;
};

export function Toast({ message, type = 'success', onClose, durationMs = 4500 }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, onClose, durationMs]);

  const styles =
    type === 'error'
      ? 'border-red-500/40 bg-red-950/95 text-red-100'
      : 'border-emerald-500/40 bg-emerald-950/95 text-emerald-50';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast-popup fixed bottom-6 right-6 z-[200] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm ${styles}`}
    >
      <span className="text-lg leading-none" aria-hidden>
        {type === 'error' ? '✕' : '✓'}
      </span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
        aria-label="Fechar aviso"
      >
        ×
      </button>
    </div>
  );
}
