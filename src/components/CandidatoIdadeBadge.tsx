import { formatarIdade, isMenor } from '../lib/idade';

type Props = {
  idade?: number | null;
  isMenorFlag?: boolean;
  className?: string;
  showBadge?: boolean;
};

export function CandidatoIdadeBadge({ idade, isMenorFlag, className = '', showBadge = true }: Props) {
  if (idade == null || idade < 0) return null;
  const menor = isMenorFlag ?? isMenor(idade);
  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className="text-subtle">· {formatarIdade(idade)}</span>
      {showBadge && menor && (
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-200">
          Menor de 18
        </span>
      )}
    </span>
  );
}
