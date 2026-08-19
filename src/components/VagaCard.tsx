import { Link } from 'react-router-dom';
import type { Vaga } from '../lib/api';

const tipoLabel: Record<string, string> = {
  aprendiz: 'Jovem Aprendiz',
  estagio: 'Estágio',
  clt: 'CLT',
  freelance: 'Freelance',
};

export function VagaCard({ vaga }: { vaga: Vaga }) {
  return (
    <Link to={`/vagas/${vaga.slug}`} className="card block transition hover:border-brand-accent/40">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-accent/15 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
          {tipoLabel[vaga.tipoVaga] || vaga.tipoVaga}
        </span>
        {vaga.modalidade && (
          <span className="chip rounded-full px-2.5 py-0.5 text-xs">{vaga.modalidade}</span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{vaga.titulo}</h3>
      <p className="mt-1 text-sm text-muted">{vaga.empresaNome}</p>
      <p className="mt-2 text-sm text-subtle">
        {[vaga.cidadeNome, vaga.uf].filter(Boolean).join(' · ') || 'Local não informado'}
      </p>
    </Link>
  );
}
