import { Link } from 'react-router-dom';
import type { Vaga } from '../lib/api';

const tipoLabel: Record<string, string> = {
  aprendiz: 'Jovem Aprendiz',
  estagio: 'Estágio',
  clt: 'CLT',
  freelance: 'Freelance',
};

const modalidadeLabel: Record<string, string> = {
  presencial: 'Presencial',
  hibrido: 'Híbrido',
  remoto: 'Remoto',
};

export function VagaCard({ vaga }: { vaga: Vaga }) {
  const local = [vaga.cidadeNome, vaga.uf].filter(Boolean).join(' · ');

  return (
    <Link
      to={`/vagas/${vaga.slug}`}
      className="card group block transition hover:border-brand-accent/40"
    >
      <div className="flex items-start gap-4">
        {vaga.empresaLogoUrl ? (
          <img
            src={vaga.empresaLogoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-[var(--cj-border)]"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-base font-bold text-brand-accent">
            {(vaga.empresaNome || '?').charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted">{vaga.empresaNome}</p>
          <h3 className="mt-1 text-lg font-semibold leading-snug transition group-hover:text-brand-accent">
            {vaga.titulo}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
              {tipoLabel[vaga.tipoVaga] || vaga.tipoVaga}
            </span>
            {vaga.modalidade && (
              <span className="chip rounded-full px-2.5 py-0.5 text-xs">
                {modalidadeLabel[vaga.modalidade] || vaga.modalidade}
              </span>
            )}
            {local && <span className="text-xs text-faint">{local}</span>}
          </div>

          <p className="mt-3 text-xs text-brand-accent/70 opacity-0 transition group-hover:opacity-100">
            Ver detalhes →
          </p>
        </div>
      </div>
    </Link>
  );
}
