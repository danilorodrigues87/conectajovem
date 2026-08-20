import { Link } from 'react-router-dom';
import { FieldLabel } from './FieldLabel';
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
  const excerpt =
    vaga.descricao.length > 140 ? `${vaga.descricao.slice(0, 140).trim()}…` : vaga.descricao;

  return (
    <Link to={`/vagas/${vaga.slug}`} className="card block transition hover:border-brand-accent/40">
      <div className="flex items-start gap-3">
        {vaga.empresaLogoUrl ? (
          <img
            src={vaga.empresaLogoUrl}
            alt=""
            className="mt-0.5 h-11 w-11 shrink-0 rounded-lg object-contain bg-white/5 p-1 ring-1 ring-[var(--cj-border)]"
          />
        ) : (
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-accent/10 text-sm font-bold text-brand-accent">
            {(vaga.empresaNome || '?').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <FieldLabel>Empresa</FieldLabel>
          <p className="text-sm font-medium">{vaga.empresaNome}</p>

          <FieldLabel>Título</FieldLabel>
          <h3 className="text-lg font-semibold leading-snug">{vaga.titulo}</h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
              {tipoLabel[vaga.tipoVaga] || vaga.tipoVaga}
            </span>
            {vaga.modalidade && (
              <span className="chip rounded-full px-2.5 py-0.5 text-xs">
                {modalidadeLabel[vaga.modalidade] || vaga.modalidade}
              </span>
            )}
          </div>

          {excerpt && (
            <>
              <FieldLabel>Descrição</FieldLabel>
              <p className="text-sm text-subtle">{excerpt}</p>
            </>
          )}

          {vaga.requisitos && (
            <>
              <FieldLabel>Requisitos</FieldLabel>
              <p className="text-sm text-subtle line-clamp-2">{vaga.requisitos}</p>
            </>
          )}

          <p className="mt-3 text-xs text-faint">
            {[vaga.cidadeNome, vaga.uf].filter(Boolean).join(' · ') || 'Local não informado'}
          </p>
        </div>
      </div>
    </Link>
  );
}
