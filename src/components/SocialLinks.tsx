import type { RedesSociais } from '../lib/social';
import { REDES_LABELS, hasRedesSociais } from '../lib/social';

type Props = {
  redes?: RedesSociais | null;
  className?: string;
  compact?: boolean;
};

export function SocialLinks({ redes, className = '', compact = false }: Props) {
  if (!hasRedesSociais(redes)) return null;
  const items = (Object.keys(REDES_LABELS) as (keyof RedesSociais)[])
    .map((key) => ({ key, url: redes?.[key]?.trim() || '', label: REDES_LABELS[key] }))
    .filter((i) => i.url !== '');

  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((i) => (
        <a
          key={i.key}
          href={i.url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            compact
              ? 'inline-flex rounded-full border border-[var(--cj-border)] bg-white/5 px-2.5 py-0.5 text-xs text-brand-accent hover:border-brand-accent/40'
              : 'inline-flex items-center gap-1 rounded-lg border border-[var(--cj-border)] bg-white/5 px-3 py-1.5 text-sm text-brand-accent hover:border-brand-accent/40'
          }
        >
          {i.label}
        </a>
      ))}
    </div>
  );
}
