import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  api,
  clearSession,
  type CandidaturaEmpresa,
  type CandidatoPerfil,
  type Cidade,
  type EmpresaPerfil,
  type UserEmpresa,
  type Vaga,
} from '../lib/api';
import { useBranding } from '../hooks/useBranding';

type Tab = 'vagas' | 'candidaturas' | 'perfil';

const TIPO_LABEL: Record<string, string> = {
  aprendiz: 'Jovem Aprendiz',
  estagio: 'Estágio',
  clt: 'CLT',
  freelance: 'Freelance',
};

const STATUS_VAGA: Record<string, { text: string; className: string }> = {
  pendente: { text: 'Em moderação', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  publicada: { text: 'Publicada', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  pausada: { text: 'Pausada', className: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  reprovada: { text: 'Reprovada', className: 'bg-red-500/15 text-red-300 border-red-500/30' },
  encerrada: { text: 'Encerrada', className: 'bg-white/10 text-white/50 border-white/15' },
};

const STATUS_CAND: Record<string, string> = {
  enviada: 'Enviada',
  visualizada: 'Visualizada',
  em_analise: 'Em análise',
  pre_selecionado: 'Pré-selecionado',
  contratado: 'Contratado',
  recusado: 'Recusado',
};

const emptyVagaForm = {
  titulo: '',
  tipoVaga: 'clt',
  modalidade: 'presencial',
  cidadeId: '',
  descricao: '',
  requisitos: '',
};

function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_VAGA[status || ''] || { text: status || '—', className: 'bg-white/10 text-white/60 border-white/15' };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
      {s.text}
    </span>
  );
}

function waLink(phone?: string) {
  const n = (phone || '').replace(/\D/g, '');
  if (n.length < 10) return null;
  return `https://wa.me/55${n}`;
}

export function EmpresaDashboardPage() {
  const { nomePortal } = useBranding();
  const [tab, setTab] = useState<Tab>('vagas');
  const [user, setUser] = useState<UserEmpresa | null>(null);
  const [empresa, setEmpresa] = useState<EmpresaPerfil | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<CandidaturaEmpresa[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editVagaId, setEditVagaId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyVagaForm);
  const [filtroVaga, setFiltroVaga] = useState('');
  const [filtroStatusCand, setFiltroStatusCand] = useState('');
  const [detalheCand, setDetalheCand] = useState<{
    candidatura: CandidaturaEmpresa;
    candidato: CandidatoPerfil | null;
  } | null>(null);
  const [perfilForm, setPerfilForm] = useState({
    nomeFantasia: '',
    contatoNome: '',
    whatsapp: '',
    email: '',
    cidadeId: '',
    bairro: '',
    uf: '',
  });

  function flash(msg: string, isError = false) {
    if (!msg) {
      setError('');
      setSuccess('');
      return;
    }
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
  }

  function loadVagas() {
    return api.empresaVagas().then((r) => setVagas(r.items || []));
  }

  function loadCandidaturas() {
    return api
      .empresaCandidaturas({
        vagaId: filtroVaga ? Number(filtroVaga) : undefined,
        status: filtroStatusCand || undefined,
      })
      .then((r) => setCandidaturas(r.items || []));
  }

  function loadMe() {
    return api.meEmpresa().then((r) => {
      setUser(r.user);
      setEmpresa(r.empresa);
      setPerfilForm({
        nomeFantasia: r.empresa.nomeFantasia || '',
        contatoNome: r.empresa.contatoNome || '',
        whatsapp: r.empresa.whatsapp || '',
        email: r.empresa.email || '',
        cidadeId: r.empresa.cidadeId ? String(r.empresa.cidadeId) : '',
        bairro: r.empresa.bairro || '',
        uf: r.empresa.uf || '',
      });
    });
  }

  function loadAll() {
    setLoading(true);
    setError('');
    Promise.all([loadMe(), loadVagas()])
      .catch((e) => flash(e instanceof Error ? e.message : 'Erro ao carregar', true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
    api.cidades().then((r) => setCidades(r.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'candidaturas' && user?.status === 'aprovada') {
      loadCandidaturas().catch((e) => flash(e instanceof Error ? e.message : 'Erro', true));
    }
  }, [tab, filtroVaga, filtroStatusCand, user?.status]);

  function openNovaVaga() {
    setEditVagaId(null);
    setForm(emptyVagaForm);
    setShowForm(true);
  }

  function openEditVaga(v: Vaga) {
    setEditVagaId(v.id);
    setForm({
      titulo: v.titulo,
      tipoVaga: v.tipoVaga || 'clt',
      modalidade: v.modalidade || 'presencial',
      cidadeId: v.cidadeId ? String(v.cidadeId) : '',
      descricao: v.descricao,
      requisitos: v.requisitos || '',
    });
    setShowForm(true);
  }

  async function onSubmitVaga(e: FormEvent) {
    e.preventDefault();
    if (user?.status !== 'aprovada') return;
    setSaving(true);
    flash('');
    try {
      const payload = {
        titulo: form.titulo,
        tipoVaga: form.tipoVaga,
        modalidade: form.modalidade,
        cidadeId: form.cidadeId ? Number(form.cidadeId) : undefined,
        descricao: form.descricao,
        requisitos: form.requisitos,
      };
      const res = editVagaId
        ? await api.atualizarVaga(editVagaId, payload)
        : await api.criarVaga(payload);
      flash(res.message || 'Salvo.');
      setShowForm(false);
      setEditVagaId(null);
      setForm(emptyVagaForm);
      await loadVagas();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao salvar vaga', true);
    } finally {
      setSaving(false);
    }
  }

  async function onVagaAcao(id: number, acao: 'pausar' | 'retomar' | 'encerrar' | 'moderacao') {
    if (!window.confirm('Confirmar esta ação na vaga?')) return;
    setSaving(true);
    flash('');
    try {
      const res = await api.vagaAcao(id, acao);
      flash(res.message || 'Atualizado.');
      await loadVagas();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro', true);
    } finally {
      setSaving(false);
    }
  }

  async function abrirCandidatura(id: number) {
    setSaving(true);
    flash('');
    try {
      const r = await api.empresaCandidaturaDetalhe(id);
      setDetalheCand(r);
      await loadCandidaturas();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro', true);
    } finally {
      setSaving(false);
    }
  }

  async function atualizarStatusCand(id: number, status: string) {
    setSaving(true);
    flash('');
    try {
      const res = await api.atualizarCandidaturaEmpresa(id, { status });
      flash(res.message || 'Status atualizado.');
      if (detalheCand?.candidatura.id === id && res.candidatura) {
        setDetalheCand({ ...detalheCand, candidatura: res.candidatura });
      }
      await loadCandidaturas();
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro', true);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitPerfil(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    flash('');
    try {
      const res = await api.atualizarPerfilEmpresa({
        nomeFantasia: perfilForm.nomeFantasia,
        contatoNome: perfilForm.contatoNome,
        whatsapp: perfilForm.whatsapp,
        email: perfilForm.email,
        cidadeId: perfilForm.cidadeId ? Number(perfilForm.cidadeId) : undefined,
        bairro: perfilForm.bairro,
        uf: perfilForm.uf,
      });
      setUser(res.user);
      setEmpresa(res.empresa);
      flash(res.message || 'Perfil atualizado.');
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao salvar', true);
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearSession();
    window.location.href = '/login';
  }

  const aprovada = user?.status === 'aprovada';
  const tabClass = (t: Tab) =>
    tab === t ? 'border-brand-accent text-[var(--cj-text)]' : 'border-transparent text-muted hover:text-[var(--cj-text)]';

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="badge mb-2">Área da empresa parceira</p>
            <h1 className="text-2xl font-bold md:text-3xl">Olá, {user?.nome || '…'}</h1>
            <p className="mt-1 text-muted">Gerencie vagas e candidaturas no {nomePortal}.</p>
          </div>
          <button type="button" onClick={logout} className="btn-ghost text-sm">
            Sair
          </button>
        </div>

        {!loading && user?.status === 'pendente' && (
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <h2 className="font-semibold text-amber-200">Cadastro em análise</h2>
            <p className="mt-2 text-sm text-amber-100/75">
              Sua empresa está aguardando aprovação. Assim que aprovada, você poderá publicar vagas e ver candidatos.
            </p>
          </div>
        )}

        {!loading && user?.status === 'bloqueada' && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="font-semibold text-red-200">Conta bloqueada</h2>
            <p className="mt-2 text-sm text-red-100/75">Entre em contato com o suporte.</p>
          </div>
        )}

        {aprovada && (
          <>
            <div className="mt-8 flex flex-wrap gap-6 border-b border-edge text-sm">
              {(['vagas', 'candidaturas', 'perfil'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`border-b-2 pb-3 font-medium capitalize transition ${tabClass(t)}`}
                >
                  {t === 'vagas' ? 'Vagas' : t === 'candidaturas' ? 'Candidaturas' : 'Perfil'}
                </button>
              ))}
            </div>

            {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
            {success && <p className="mt-6 text-sm text-emerald-400">{success}</p>}

            {tab === 'vagas' && (
              <div className="mt-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Suas vagas ({vagas.length})</h2>
                  <button type="button" onClick={openNovaVaga} className="btn-primary text-sm">
                    + Nova vaga
                  </button>
                </div>

                {showForm && (
                  <form onSubmit={onSubmitVaga} className="glass-card mb-6 space-y-4">
                    <h3 className="font-semibold">{editVagaId ? 'Editar vaga' : 'Nova vaga'}</h3>
                    <input
                      className="input"
                      placeholder="Título *"
                      value={form.titulo}
                      onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                      required
                    />
                    <div className="grid gap-4 md:grid-cols-3">
                      <select
                        className="select"
                        value={form.tipoVaga}
                        onChange={(e) => setForm((f) => ({ ...f, tipoVaga: e.target.value }))}
                      >
                        <option value="aprendiz">Jovem Aprendiz</option>
                        <option value="estagio">Estágio</option>
                        <option value="clt">CLT</option>
                        <option value="freelance">Freelance</option>
                      </select>
                      <select
                        className="select"
                        value={form.modalidade}
                        onChange={(e) => setForm((f) => ({ ...f, modalidade: e.target.value }))}
                      >
                        <option value="presencial">Presencial</option>
                        <option value="hibrido">Híbrido</option>
                        <option value="remoto">Remoto</option>
                      </select>
                      <select
                        className="select"
                        value={form.cidadeId}
                        onChange={(e) => setForm((f) => ({ ...f, cidadeId: e.target.value }))}
                      >
                        <option value="">Cidade (opcional)</option>
                        {cidades.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="input min-h-[120px] resize-y"
                      placeholder="Descrição *"
                      value={form.descricao}
                      onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                      required
                    />
                    <textarea
                      className="input min-h-[80px] resize-y"
                      placeholder="Requisitos"
                      value={form.requisitos}
                      onChange={(e) => setForm((f) => ({ ...f, requisitos: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Salvando…' : editVagaId ? 'Salvar alterações' : 'Enviar para moderação'}
                      </button>
                      <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                {loading ? (
                  <p className="text-subtle">Carregando…</p>
                ) : vagas.length === 0 ? (
                  <div className="glass-card text-center">
                    <p className="text-muted">Nenhuma vaga cadastrada.</p>
                    <button type="button" onClick={openNovaVaga} className="btn-primary mt-4 text-sm">
                      Publicar primeira vaga
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vagas.map((v) => (
                      <div key={v.id} className="glass-card">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">{v.titulo}</h3>
                              <StatusBadge status={v.status} />
                            </div>
                            <p className="mt-1 text-sm text-subtle">
                              {TIPO_LABEL[v.tipoVaga] || v.tipoVaga}
                              {[v.cidadeNome, v.uf].filter(Boolean).length > 0 &&
                                ` · ${[v.cidadeNome, v.uf].filter(Boolean).join(' / ')}`}
                              {typeof v.viewsCount === 'number' && v.viewsCount > 0 && ` · ${v.viewsCount} views`}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {v.status === 'publicada' && v.slug && (
                              <Link to={`/vagas/${v.slug}`} className="btn-ghost text-xs">
                                Ver no portal
                              </Link>
                            )}
                            {v.status !== 'encerrada' && (
                              <button type="button" className="btn-ghost text-xs" onClick={() => openEditVaga(v)}>
                                Editar
                              </button>
                            )}
                            {v.status === 'publicada' && (
                              <button
                                type="button"
                                className="btn-ghost text-xs"
                                disabled={saving}
                                onClick={() => onVagaAcao(v.id, 'pausar')}
                              >
                                Pausar
                              </button>
                            )}
                            {v.status === 'pausada' && (
                              <button
                                type="button"
                                className="btn-ghost text-xs"
                                disabled={saving}
                                onClick={() => onVagaAcao(v.id, 'retomar')}
                              >
                                Retomar
                              </button>
                            )}
                            {v.status === 'reprovada' && (
                              <button
                                type="button"
                                className="btn-ghost text-xs"
                                disabled={saving}
                                onClick={() => onVagaAcao(v.id, 'moderacao')}
                              >
                                Reenviar
                              </button>
                            )}
                            {v.status !== 'encerrada' && (
                              <button
                                type="button"
                                className="btn-ghost text-xs text-red-300"
                                disabled={saving}
                                onClick={() => onVagaAcao(v.id, 'encerrar')}
                              >
                                Encerrar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'candidaturas' && (
              <div className="mt-8">
                <div className="mb-4 flex flex-wrap gap-3">
                  <select
                    className="select max-w-xs"
                    value={filtroVaga}
                    onChange={(e) => setFiltroVaga(e.target.value)}
                  >
                    <option value="">Todas as vagas</option>
                    {vagas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.titulo}
                      </option>
                    ))}
                  </select>
                  <select
                    className="select max-w-xs"
                    value={filtroStatusCand}
                    onChange={(e) => setFiltroStatusCand(e.target.value)}
                  >
                    <option value="">Todos os status</option>
                    {Object.entries(STATUS_CAND).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {detalheCand && (
                  <div className="glass-card mb-6 space-y-4 border border-brand-accent/20">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{detalheCand.candidato?.nome || detalheCand.candidatura.candidatoNome}</h3>
                        <p className="text-sm text-subtle">
                          Vaga: {detalheCand.candidatura.vagaTitulo} ·{' '}
                          {STATUS_CAND[detalheCand.candidatura.status] || detalheCand.candidatura.status}
                        </p>
                      </div>
                      <button type="button" className="btn-ghost text-xs" onClick={() => setDetalheCand(null)}>
                        Fechar
                      </button>
                    </div>
                    {detalheCand.candidatura.mensagemCandidato && (
                      <p className="rounded-xl bg-white/5 p-3 text-sm">{detalheCand.candidatura.mensagemCandidato}</p>
                    )}
                    {detalheCand.candidato?.resumo && (
                      <p className="text-sm text-muted">{detalheCand.candidato.resumo}</p>
                    )}
                    {detalheCand.candidato?.habilidades && detalheCand.candidato.habilidades.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {detalheCand.candidato.habilidades.map((h) => (
                          <span key={h} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    {detalheCand.candidato?.temSeloCertificado && (
                      <p className="text-sm text-emerald-300">✓ Formação verificada (selo certificado)</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {waLink(detalheCand.candidato?.whatsapp || detalheCand.candidatura.candidatoWhatsapp) && (
                        <a
                          href={waLink(detalheCand.candidato?.whatsapp || detalheCand.candidatura.candidatoWhatsapp)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-sm"
                        >
                          WhatsApp
                        </a>
                      )}
                      {(['em_analise', 'pre_selecionado', 'contratado', 'recusado'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          className="btn-ghost text-xs"
                          disabled={saving || detalheCand.candidatura.status === st}
                          onClick={() => atualizarStatusCand(detalheCand.candidatura.id, st)}
                        >
                          {STATUS_CAND[st]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {candidaturas.length === 0 ? (
                  <div className="glass-card text-center text-muted">Nenhuma candidatura ainda.</div>
                ) : (
                  <div className="space-y-3">
                    {candidaturas.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => abrirCandidatura(c.id)}
                        className="glass-card w-full text-left transition hover:border-brand-accent/30"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="font-semibold">{c.candidatoNome}</div>
                            <div className="text-sm text-subtle">{c.vagaTitulo}</div>
                          </div>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                            {STATUS_CAND[c.status] || c.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'perfil' && empresa && (
              <form onSubmit={onSubmitPerfil} className="glass-card mt-8 max-w-xl space-y-4">
                <h2 className="text-lg font-semibold">Dados da empresa</h2>
                <p className="text-xs text-faint">CNPJ: {empresa.cnpj} · Razão social: {empresa.razaoSocial}</p>
                <input
                  className="input"
                  placeholder="Nome fantasia"
                  value={perfilForm.nomeFantasia}
                  onChange={(e) => setPerfilForm((f) => ({ ...f, nomeFantasia: e.target.value }))}
                />
                <input
                  className="input"
                  placeholder="Nome do contato"
                  value={perfilForm.contatoNome}
                  onChange={(e) => setPerfilForm((f) => ({ ...f, contatoNome: e.target.value }))}
                />
                <input
                  className="input"
                  placeholder="WhatsApp"
                  value={perfilForm.whatsapp}
                  onChange={(e) => setPerfilForm((f) => ({ ...f, whatsapp: e.target.value }))}
                />
                <input
                  className="input"
                  type="email"
                  placeholder="E-mail"
                  value={perfilForm.email}
                  onChange={(e) => setPerfilForm((f) => ({ ...f, email: e.target.value }))}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <select
                    className="select md:col-span-2"
                    value={perfilForm.cidadeId}
                    onChange={(e) => setPerfilForm((f) => ({ ...f, cidadeId: e.target.value }))}
                  >
                    <option value="">Cidade</option>
                    {cidades.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input"
                    placeholder="UF"
                    maxLength={2}
                    value={perfilForm.uf}
                    onChange={(e) => setPerfilForm((f) => ({ ...f, uf: e.target.value.toUpperCase() }))}
                  />
                </div>
                <input
                  className="input"
                  placeholder="Bairro"
                  value={perfilForm.bairro}
                  onChange={(e) => setPerfilForm((f) => ({ ...f, bairro: e.target.value }))}
                />
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Salvando…' : 'Salvar perfil'}
                </button>
              </form>
            )}
          </>
        )}

        {loading && aprovada === false && user?.status !== 'pendente' && user?.status !== 'bloqueada' && (
          <p className="mt-8 text-subtle">Carregando…</p>
        )}
      </div>
    </Layout>
  );
}
