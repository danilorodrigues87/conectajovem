import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddressFields } from '../components/AddressFields';
import { CurriculoPreview } from '../components/CurriculoPreview';
import { Layout } from '../components/Layout';
import { SocialLinksForm } from '../components/SocialLinksForm';
import { Toast } from '../components/Toast';
import {
  api,
  clearSession,
  type CandidatoPerfil,
  type Candidatura,
  type ExperienciaProfissional,
  type FormacaoAcademica,
  type Notificacao,
  type UserCandidato,
} from '../lib/api';
import { newExperiencia, newFormacaoAcademica, TIPO_FORMACAO_LABEL } from '../lib/curriculo';
import { formatConclusaoEm } from '../lib/date';
import { EMPTY_REDES, normalizeRedes } from '../lib/social';
import { site } from '../config/site';

type Tab = 'perfil' | 'curriculo' | 'candidaturas' | 'notificacoes';

const TIPO_LABEL: Record<string, string> = {
  aprendiz: 'Jovem Aprendiz',
  estagio: 'Estágio',
  clt: 'CLT',
  freelance: 'Freelance',
};

const STATUS_LABEL: Record<string, string> = {
  enviada: 'Enviada',
  visualizada: 'Visualizada',
  em_analise: 'Em análise',
  pre_selecionado: 'Pré-selecionado',
  contratado: 'Contratado',
  recusado: 'Recusado',
};

const DISPONIBILIDADE_LABEL: Record<string, string> = {
  imediata: 'Imediata',
  '15_dias': 'Em até 15 dias',
  '30_dias': 'Em até 30 dias',
  a_combinar: 'A combinar',
};

const FORMACAO_ORIGEM: Record<string, string> = {
  manual: 'Certificado emitido pela escola parceira',
  matricula_auto: 'Matrícula certificada',
  lms_auto: 'Progresso no portal EAD (referência)',
};

export function CandidatoDashboardPage() {
  const [tab, setTab] = useState<Tab>('perfil');
  const [user, setUser] = useState<UserCandidato | null>(null);
  const [perfil, setPerfil] = useState<CandidatoPerfil | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fotoSaving, setFotoSaving] = useState(false);
  const [sqlAviso, setSqlAviso] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [habInput, setHabInput] = useState('');
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    resumo: '',
    logradouro: '',
    numero: '',
    estadoId: '',
    cidadeId: '',
    bairro: '',
    uf: '',
    disponibilidade: 'imediata',
    habilidades: [] as string[],
    formacaoAcademica: [] as FormacaoAcademica[],
    experiencias: [] as ExperienciaProfissional[],
    redesSociais: { ...EMPTY_REDES },
  });

  const onLocationChange = useCallback(
    (next: { estadoId: string; cidadeId: string; uf: string }) => {
      setForm((f) => ({ ...f, ...next }));
    },
    [],
  );

  function loadPerfil() {
    return api.meCandidato().then((r) => {
      setUser(r.user);
      setPerfil(r.candidato);
      setForm({
        nome: r.candidato.nome || '',
        whatsapp: r.candidato.whatsapp || '',
        resumo: r.candidato.resumo || '',
        logradouro: r.candidato.logradouro || '',
        numero: r.candidato.numero || '',
        estadoId: r.candidato.estadoId ? String(r.candidato.estadoId) : '',
        cidadeId: r.candidato.cidadeId ? String(r.candidato.cidadeId) : '',
        bairro: r.candidato.bairro || '',
        uf: r.candidato.uf || '',
        disponibilidade: r.candidato.disponibilidade || 'imediata',
        habilidades: r.candidato.habilidades || [],
        formacaoAcademica: r.candidato.formacaoAcademica || [],
        experiencias: r.candidato.experiencias || [],
        redesSociais: normalizeRedes(r.candidato.redesSociais),
      });
    });
  }

  function loadCandidaturas() {
    return api.candidaturas().then((r) => setCandidaturas(r.items || []));
  }

  function loadNotificacoes() {
    return api.notificacoes().then((r) => setNotificacoes(r.items || []));
  }

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([loadPerfil(), loadCandidaturas(), loadNotificacoes()])
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, []);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
  }

  async function onFotoChange(file: File | null, opts?: { usarPortal?: boolean; restaurar?: boolean }) {
    setFotoSaving(true);
    setError('');
    try {
      const res = await api.uploadFotoCandidato(file || undefined, opts);
      if (res.candidato) setPerfil(res.candidato);
      showToast(res.message || 'Foto atualizada.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar foto';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setFotoSaving(false);
    }
  }

  async function onSubmitPerfil(e: FormEvent) {
    e.preventDefault();
    if (form.estadoId && !form.cidadeId) {
      const msg = 'Selecione a cidade após escolher o estado.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }
    setSaving(true);
    setError('');
    setSqlAviso('');
    try {
      const res = await api.atualizarPerfilCandidato({
        nome: form.nome,
        whatsapp: form.whatsapp,
        resumo: form.resumo,
        logradouro: form.logradouro,
        numero: form.numero,
        cidadeId: form.cidadeId ? Number(form.cidadeId) : null,
        bairro: form.bairro,
        uf: form.uf,
        disponibilidade: form.disponibilidade,
        habilidades: form.habilidades,
        formacaoAcademica: form.formacaoAcademica,
        experiencias: form.experiencias,
        redesSociais: form.redesSociais,
      });
      setPerfil(res.candidato);
      setForm((f) => ({
        ...f,
        estadoId: res.candidato.estadoId ? String(res.candidato.estadoId) : f.estadoId,
        cidadeId: res.candidato.cidadeId ? String(res.candidato.cidadeId) : '',
        uf: res.candidato.uf || f.uf,
        logradouro: res.candidato.logradouro || '',
        numero: res.candidato.numero || '',
        bairro: res.candidato.bairro || '',
        formacaoAcademica: res.candidato.formacaoAcademica || [],
        experiencias: res.candidato.experiencias || [],
      }));
      showToast(res.message || 'Perfil salvo com sucesso!');
      if (res.sqlAviso) {
        setSqlAviso(res.sqlAviso);
        showToast(res.sqlAviso, 'error');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  function addHabilidade() {
    const h = habInput.trim();
    if (!h || form.habilidades.includes(h)) return;
    setForm((f) => ({ ...f, habilidades: [...f.habilidades, h] }));
    setHabInput('');
  }

  function removeHabilidade(h: string) {
    setForm((f) => ({ ...f, habilidades: f.habilidades.filter((x) => x !== h) }));
  }

  async function marcarLida(id: number) {
    try {
      await api.marcarNotificacaoLida(id);
      setNotificacoes((list) => list.map((n) => (n.id === id ? { ...n, lida: true } : n)));
    } catch {
      /* ignore */
    }
  }

  function logout() {
    clearSession();
    window.location.href = '/login';
  }

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <Layout>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="badge mb-2">Área do candidato</p>
            <h1 className="text-2xl font-bold md:text-3xl">Olá, {user?.nome || '…'}</h1>
            <p className="mt-1 text-muted">Gerencie seu perfil, candidaturas e notificações no {site.name}.</p>
            {perfil?.temSeloCertificado && (
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent">
                ✓ {site.badgeCertified}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Link to="/vagas" className="btn-ghost text-sm">
              Ver vagas
            </Link>
            <button type="button" onClick={logout} className="btn-ghost text-sm">
              Sair
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-edge pb-4">
          {(
            [
              ['perfil', 'Meu perfil'],
              ['curriculo', 'Meu currículo'],
              ['candidaturas', `Candidaturas (${candidaturas.length})`],
              ['notificacoes', `Notificações${naoLidas ? ` (${naoLidas})` : ''}`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === key ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-8 text-subtle">Carregando…</p>}
        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {sqlAviso && (
          <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {sqlAviso}
          </p>
        )}

        {!loading && tab === 'curriculo' && perfil && (
          <div className="glass-card mt-8">
            <div className="no-print">
              <h2 className="text-lg font-semibold">Meu currículo</h2>
              <p className="mt-1 text-sm text-muted">
                Visualize, baixe em PDF ou imprima. Atualize os dados na aba &quot;Meu perfil&quot; antes de gerar o documento.
              </p>
            </div>
            <div className="mt-6 print:mt-0">
              <CurriculoPreview perfil={perfil} />
            </div>
          </div>
        )}

        {!loading && tab === 'curriculo' && !perfil && (
          <p className="mt-8 text-muted">Complete seu perfil para gerar o currículo.</p>
        )}

        {!loading && tab === 'perfil' && (
          <>
            {(perfil?.formacao?.length ?? 0) > 0 && (
              <div className="glass-card mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Certificados e formação</h2>
                  {perfil && (
                    <button type="button" className="btn-ghost text-sm" onClick={() => setTab('curriculo')}>
                      Ver currículo completo
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">
                  Certificados oficiais com selo da escola parceira. Progresso EAD aparece como referência.
                </p>
                <ul className="mt-4 space-y-3">
                  {perfil!.formacao.map((f) => (
                    <li
                      key={f.id}
                      className="flex flex-wrap items-start justify-between gap-2 border-t border-edge pt-3 first:border-0 first:pt-0"
                    >
                      <div>
                        <div className="font-medium">{f.titulo}</div>
                        <p className="mt-0.5 text-xs text-subtle">
                          {FORMACAO_ORIGEM[f.origem] || f.origem}
                          {f.cargaH ? ` · ${f.cargaH}h` : ''}
                          {formatConclusaoEm(f.concluidoEm) ? ` · ${formatConclusaoEm(f.concluidoEm)}` : ''}
                        </p>
                      </div>
                      {f.seloCertificado && f.status === 'concluido' ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-semibold text-brand-accent">
                          ✓ Selo {site.badgeCertified}
                        </span>
                      ) : (
                        <span className="text-xs text-faint">{f.status === 'concluido' ? 'Concluído' : 'Em andamento'}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass-card mt-8">
              <h2 className="text-lg font-semibold">Foto de perfil</h2>
              <p className="mt-1 text-sm text-muted">
                Alunos do portal CTI podem usar a foto do EAD ou enviar uma nova imagem.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {perfil?.fotoUrl ? (
                  <img
                    src={perfil.fotoUrl}
                    alt=""
                    className="h-20 w-20 rounded-xl object-cover ring-1 ring-[var(--cj-border)]"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-accent/10 text-2xl font-bold text-brand-accent">
                    {(perfil?.nome || user?.nome || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <label className="btn-ghost cursor-pointer text-sm">
                    {fotoSaving ? 'Enviando…' : 'Enviar foto'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={fotoSaving}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onFotoChange(f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {user?.tipo === 'aluno' && (
                    <button
                      type="button"
                      className="btn-ghost text-sm"
                      disabled={fotoSaving}
                      onClick={() => onFotoChange(null, { usarPortal: true })}
                    >
                      Usar foto do portal
                    </button>
                  )}
                  {perfil?.fotoUrl && (
                    <button
                      type="button"
                      className="btn-ghost text-sm text-red-300"
                      disabled={fotoSaving}
                      onClick={() => onFotoChange(null, { restaurar: true })}
                    >
                      Remover foto
                    </button>
                  )}
                </div>
              </div>
            </div>

          <form onSubmit={onSubmitPerfil} className="glass-card mt-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Currículo simplificado</h2>
              {perfil && (
                <button type="button" className="btn-ghost text-sm" onClick={() => setTab('curriculo')}>
                  Ver / baixar currículo
                </button>
              )}
            </div>
            <p className="text-sm text-muted">
              Complete seu perfil para se destacar nas candidaturas. Escolas parceiras podem enriquecer seu perfil com
              o selo {site.badgeCertified}.
            </p>
            <input
              className="input"
              placeholder="Nome completo *"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="WhatsApp"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
            />
            <textarea
              className="input min-h-[100px] resize-y"
              placeholder="Resumo profissional — objetivos, experiências e interesses"
              value={form.resumo}
              onChange={(e) => setForm((f) => ({ ...f, resumo: e.target.value }))}
            />
            <AddressFields
              logradouro={form.logradouro}
              numero={form.numero}
              bairro={form.bairro}
              estadoId={form.estadoId}
              cidadeId={form.cidadeId}
              uf={form.uf}
              onLogradouro={(v) => setForm((f) => ({ ...f, logradouro: v }))}
              onNumero={(v) => setForm((f) => ({ ...f, numero: v }))}
              onBairro={(v) => setForm((f) => ({ ...f, bairro: v }))}
              onLocation={onLocationChange}
            />

            <div className="space-y-3 border-t border-edge pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium">Formação acadêmica</label>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      formacaoAcademica: [...f.formacaoAcademica, newFormacaoAcademica()],
                    }))
                  }
                >
                  + Adicionar
                </button>
              </div>
              {form.formacaoAcademica.length === 0 && (
                <p className="text-xs text-subtle">Ex.: Graduação em Administração — Unifatecie (2025)</p>
              )}
              {form.formacaoAcademica.map((item, idx) => (
                <div key={item.id} className="grid gap-2 rounded-xl border border-edge p-3 md:grid-cols-2">
                  <select
                    className="select md:col-span-2"
                    value={item.tipo}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.formacaoAcademica];
                        list[idx] = { ...list[idx], tipo: e.target.value as FormacaoAcademica['tipo'] };
                        return { ...f, formacaoAcademica: list };
                      })
                    }
                  >
                    {Object.entries(TIPO_FORMACAO_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input"
                    placeholder="Curso *"
                    value={item.curso}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.formacaoAcademica];
                        list[idx] = { ...list[idx], curso: e.target.value };
                        return { ...f, formacaoAcademica: list };
                      })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Instituição"
                    value={item.instituicao}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.formacaoAcademica];
                        list[idx] = { ...list[idx], instituicao: e.target.value };
                        return { ...f, formacaoAcademica: list };
                      })
                    }
                  />
                  <input
                    className="input"
                    type="number"
                    min={1950}
                    max={2100}
                    placeholder="Ano conclusão"
                    value={item.anoConclusao ?? ''}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.formacaoAcademica];
                        list[idx] = {
                          ...list[idx],
                          anoConclusao: e.target.value ? Number(e.target.value) : null,
                        };
                        return { ...f, formacaoAcademica: list };
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn-ghost text-xs text-red-300 md:col-span-2 md:justify-self-start"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        formacaoAcademica: f.formacaoAcademica.filter((x) => x.id !== item.id),
                      }))
                    }
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-edge pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-medium">Experiência profissional</label>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={() =>
                    setForm((f) => ({ ...f, experiencias: [...f.experiencias, newExperiencia()] }))
                  }
                >
                  + Adicionar
                </button>
              </div>
              {form.experiencias.map((exp, idx) => (
                <div key={exp.id} className="grid gap-2 rounded-xl border border-edge p-3 md:grid-cols-2">
                  <input
                    className="input"
                    placeholder="Empresa *"
                    value={exp.empresa}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.experiencias];
                        list[idx] = { ...list[idx], empresa: e.target.value };
                        return { ...f, experiencias: list };
                      })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Cargo *"
                    value={exp.cargo}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.experiencias];
                        list[idx] = { ...list[idx], cargo: e.target.value };
                        return { ...f, experiencias: list };
                      })
                    }
                  />
                  <input
                    className="input"
                    type="month"
                    value={exp.inicio || ''}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.experiencias];
                        list[idx] = { ...list[idx], inicio: e.target.value };
                        return { ...f, experiencias: list };
                      })
                    }
                  />
                  <input
                    className="input"
                    type="month"
                    disabled={exp.atual}
                    value={exp.fim || ''}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.experiencias];
                        list[idx] = { ...list[idx], fim: e.target.value };
                        return { ...f, experiencias: list };
                      })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm md:col-span-2">
                    <input
                      type="checkbox"
                      checked={!!exp.atual}
                      onChange={(e) =>
                        setForm((f) => {
                          const list = [...f.experiencias];
                          list[idx] = { ...list[idx], atual: e.target.checked, fim: e.target.checked ? null : list[idx].fim };
                          return { ...f, experiencias: list };
                        })
                      }
                    />
                    Trabalho atual
                  </label>
                  <textarea
                    className="input min-h-[70px] resize-y md:col-span-2"
                    placeholder="Atividades principais (opcional)"
                    value={exp.descricao || ''}
                    onChange={(e) =>
                      setForm((f) => {
                        const list = [...f.experiencias];
                        list[idx] = { ...list[idx], descricao: e.target.value };
                        return { ...f, experiencias: list };
                      })
                    }
                  />
                  <button
                    type="button"
                    className="btn-ghost text-xs text-red-300 md:col-span-2 md:justify-self-start"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        experiencias: f.experiencias.filter((x) => x.id !== exp.id),
                      }))
                    }
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <select
              className="select"
              value={form.disponibilidade}
              onChange={(e) => setForm((f) => ({ ...f, disponibilidade: e.target.value }))}
            >
              {Object.entries(DISPONIBILIDADE_LABEL).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <div>
              <label className="text-sm font-medium">Habilidades</label>
              <div className="mt-2 flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Ex: Excel, atendimento, comunicação"
                  value={habInput}
                  onChange={(e) => setHabInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHabilidade();
                    }
                  }}
                />
                <button type="button" onClick={addHabilidade} className="btn-ghost shrink-0">
                  Adicionar
                </button>
              </div>
              {form.habilidades.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.habilidades.map((h) => (
                    <span key={h} className="chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs">
                      {h}
                      <button type="button" onClick={() => removeHabilidade(h)} className="text-faint hover:text-red-400">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {perfil?.temSeloCertificado && (
              <p className="text-sm text-subtle">
                Seu perfil exibe o selo <strong className="text-brand-accent">{site.badgeCertified}</strong> para empresas parceiras.
              </p>
            )}
            <SocialLinksForm
              value={form.redesSociais}
              onChange={(redesSociais) => setForm((f) => ({ ...f, redesSociais }))}
            />
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar perfil'}
            </button>
          </form>
          </>
        )}

        {!loading && tab === 'candidaturas' && (
          <div className="mt-8 space-y-3">
            {candidaturas.length === 0 ? (
              <div className="glass-card text-center">
                <p className="text-muted">Você ainda não se candidatou a nenhuma vaga.</p>
                <Link to="/vagas" className="btn-primary mt-4 inline-flex text-sm">
                  Explorar vagas abertas
                </Link>
              </div>
            ) : (
              candidaturas.map((c) => (
                <div key={c.id} className="glass-card flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{c.vagaTitulo}</h3>
                    <p className="mt-1 text-sm text-subtle">
                      {c.empresaNome} · {TIPO_LABEL[c.tipoVaga] || c.tipoVaga}
                    </p>
                    <p className="mt-1 text-xs text-faint">
                      {STATUS_LABEL[c.status] || c.status}
                      {c.createdAt && ` · ${new Date(c.createdAt).toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  {c.vagaSlug && (
                    <Link to={`/vagas/${c.vagaSlug}`} className="btn-ghost text-sm">
                      Ver vaga
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!loading && tab === 'notificacoes' && (
          <div className="mt-8 space-y-3">
            {notificacoes.length === 0 ? (
              <div className="glass-card text-center">
                <p className="text-muted">Nenhuma notificação por enquanto.</p>
              </div>
            ) : (
              notificacoes.map((n) => (
                <div
                  key={n.id}
                  className={`glass-card ${!n.lida ? 'border-brand-accent/30' : ''}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{n.titulo}</h3>
                      <p className="mt-1 text-sm text-muted">{n.mensagem}</p>
                      {n.createdAt && (
                        <p className="mt-2 text-xs text-faint">
                          {new Date(n.createdAt).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                    {!n.lida && (
                      <button type="button" onClick={() => marcarLida(n.id)} className="btn-ghost text-xs">
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
