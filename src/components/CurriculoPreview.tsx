import type { CandidatoPerfil } from '../lib/api';
import { site } from '../config/site';

const DISPONIBILIDADE: Record<string, string> = {
  imediata: 'Imediata',
  '15_dias': 'Em até 15 dias',
  '30_dias': 'Em até 30 dias',
  a_combinar: 'A combinar',
};

const FORMACAO_ORIGEM: Record<string, string> = {
  manual: 'Certificado emitido pela escola parceira',
  matricula_auto: 'Matrícula certificada',
  lms_auto: 'Progresso no portal EAD',
};

type Props = {
  perfil: CandidatoPerfil;
  onClose?: () => void;
};

export function CurriculoPreview({ perfil, onClose }: Props) {
  function imprimir() {
    window.print();
  }

  return (
    <div className="curriculo-root">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary text-sm" onClick={imprimir}>
          Imprimir / Salvar PDF
        </button>
        {onClose && (
          <button type="button" className="btn-ghost text-sm" onClick={onClose}>
            Fechar
          </button>
        )}
      </div>

      <article id="curriculo-print" className="glass-card curriculo-sheet space-y-6">
        <header className="flex flex-wrap items-start gap-4 border-b border-edge pb-6">
          {perfil.fotoUrl ? (
            <img
              src={perfil.fotoUrl}
              alt=""
              className="h-20 w-20 rounded-xl object-cover ring-1 ring-[var(--cj-border)]"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-accent/15 text-2xl font-bold text-brand-accent">
              {(perfil.nome || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold">{perfil.nome}</h1>
            <p className="mt-1 text-sm text-muted">
              {[perfil.email, perfil.whatsapp].filter(Boolean).join(' · ')}
            </p>
            <p className="mt-1 text-sm text-subtle">
              Disponibilidade: {DISPONIBILIDADE[perfil.disponibilidade] || perfil.disponibilidade}
            </p>
            {perfil.temSeloCertificado && (
              <p className="mt-2 text-sm font-medium text-brand-accent">✓ {site.badgeCertified}</p>
            )}
          </div>
        </header>

        {perfil.resumo && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">Resumo</h2>
            <p className="mt-2 whitespace-pre-wrap text-muted">{perfil.resumo}</p>
          </section>
        )}

        {perfil.habilidades.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">Habilidades</h2>
            <p className="mt-2 text-muted">{perfil.habilidades.join(' · ')}</p>
          </section>
        )}

        {(perfil.formacao?.length ?? 0) > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-subtle">Formação e certificados</h2>
            <ul className="mt-3 space-y-3">
              {perfil.formacao.map((f) => (
                <li key={f.id} className="border-t border-edge pt-3 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{f.titulo}</div>
                      <p className="text-xs text-subtle">
                        {FORMACAO_ORIGEM[f.origem] || f.origem}
                        {f.cargaH ? ` · ${f.cargaH}h` : ''}
                        {f.concluidoEm ? ` · ${new Date(f.concluidoEm).toLocaleDateString('pt-BR')}` : ''}
                      </p>
                    </div>
                    {f.seloCertificado && f.status === 'concluido' && (
                      <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-xs font-medium text-brand-accent">
                        ✓ {site.badgeCertified}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
