import type { CandidatoPerfil } from '../lib/api';
import { site } from '../config/site';
import { SocialLinks } from './SocialLinks';
import {
  DISPONIBILIDADE_LABEL,
  agruparFormacaoAcademica,
  formatPeriodoExp,
  linhaFormacaoAcademica,
} from '../lib/curriculo';
import { formatConclusaoEm } from '../lib/date';

const FORMACAO_ORIGEM: Record<string, string> = {
  manual: 'Certificado emitido pela escola parceira',
  matricula_auto: 'Matrícula certificada',
  lms_auto: 'Referência de progresso no portal EAD',
};

type Props = {
  perfil: CandidatoPerfil;
};

export function CurriculoDocument({ perfil }: Props) {
  const gruposAcad = agruparFormacaoAcademica(perfil.formacaoAcademica || []);
  const certificados = (perfil.formacao || []).filter((f) => f.origem !== 'lms_auto' || f.seloCertificado);
  const cursosLms = (perfil.formacao || []).filter((f) => f.origem === 'lms_auto' && !f.seloCertificado);

  return (
    <article id="curriculo-print" className="curriculo-sheet">
      <header className="curriculo-header">
        {perfil.fotoUrl ? (
          <img src={perfil.fotoUrl} alt="" className="curriculo-foto" />
        ) : null}
        <div className="curriculo-header-text">
          <h1 className="curriculo-nome">{perfil.nome}</h1>
          <p className="curriculo-meta">
            {[perfil.email, perfil.whatsapp].filter(Boolean).join(' · ')}
          </p>
          {perfil.endereco && <p className="curriculo-meta">{perfil.endereco}</p>}
          <p className="curriculo-meta">
            Disponibilidade: {DISPONIBILIDADE_LABEL[perfil.disponibilidade] || perfil.disponibilidade}
          </p>
          {perfil.temSeloCertificado && (
            <p className="curriculo-selo">✓ {site.badgeCertified}</p>
          )}
          <SocialLinks redes={perfil.redesSociais} className="curriculo-social mt-2" compact />
        </div>
      </header>

      {perfil.resumo && (
        <section className="curriculo-block">
          <h2 className="curriculo-section-title">Objetivo / Resumo</h2>
          <p className="curriculo-body whitespace-pre-wrap">{perfil.resumo}</p>
        </section>
      )}

      {gruposAcad.length > 0 && (
        <section className="curriculo-block">
          <h2 className="curriculo-section-title">Formação acadêmica</h2>
          <ul className="curriculo-list">
            {gruposAcad.flatMap((g) =>
              g.items.map((item) => (
                <li key={item.id}>{linhaFormacaoAcademica(item)}</li>
              )),
            )}
          </ul>
        </section>
      )}

      {(certificados.length > 0 || cursosLms.length > 0) && (
        <section className="curriculo-block">
          <h2 className="curriculo-section-title">Outros cursos e certificações</h2>
          <ul className="curriculo-list curriculo-list-spaced">
            {certificados.map((f) => (
              <li key={f.id}>
                <div className="curriculo-item-title">{f.titulo}</div>
                <p className="curriculo-meta">
                  {FORMACAO_ORIGEM[f.origem] || f.origem}
                  {f.cargaH ? ` · ${f.cargaH}h` : ''}
                  {formatConclusaoEm(f.concluidoEm) ? ` · ${formatConclusaoEm(f.concluidoEm)}` : ''}
                </p>
              </li>
            ))}
            {cursosLms.map((f) => (
              <li key={f.id}>
                <div className="curriculo-item-title">{f.titulo}</div>
                <p className="curriculo-meta">{FORMACAO_ORIGEM[f.origem]}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {perfil.habilidades.length > 0 && (
        <section className="curriculo-block">
          <h2 className="curriculo-section-title">Habilidades</h2>
          <p className="curriculo-body">{perfil.habilidades.join(' · ')}</p>
        </section>
      )}

      {(perfil.experiencias?.length ?? 0) > 0 && (
        <section className="curriculo-block">
          <h2 className="curriculo-section-title">Experiência profissional</h2>
          <ul className="curriculo-list curriculo-list-spaced">
            {perfil.experiencias!.map((exp) => (
              <li key={exp.id} className="curriculo-exp">
                <div className="curriculo-item-title">{exp.cargo}</div>
                <div className="curriculo-meta">
                  {exp.empresa}
                  {formatPeriodoExp(exp) ? ` · ${formatPeriodoExp(exp)}` : ''}
                </div>
                {exp.descricao && (
                  <p className="curriculo-body whitespace-pre-wrap">{exp.descricao}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
