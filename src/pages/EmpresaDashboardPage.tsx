import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddressFields } from '../components/AddressFields';
import { CandidatoIdadeBadge } from '../components/CandidatoIdadeBadge';
import { CurriculoView } from '../components/CurriculoView';
import { Layout } from '../components/Layout';
import { LocationSelect } from '../components/LocationSelect';
import { SocialLinks } from '../components/SocialLinks';
import { SocialLinksForm } from '../components/SocialLinksForm';
import {
  api,
  clearSession,
  type CandidaturaEmpresa,
  type CandidatoPerfil,
  type EmpresaPerfil,
  type UserEmpresa,
  type Vaga,
} from '../lib/api';
import { EMPTY_REDES, normalizeRedes } from '../lib/social';
import { useBranding } from '../hooks/useBranding';

type Tab = 'vagas' | 'candidaturas' | 'talentos' | 'perfil';

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
  estadoId: '',
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
  const [talentos, setTalentos] = useState<CandidatoPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoSaving, setLogoSaving] = useState(false);
  const [buscandoTalentos, setBuscandoTalentos] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editVagaId, setEditVagaId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyVagaForm);
  const [filtroVaga, setFiltroVaga] = useState('');
  const [filtroStatusCand, setFiltroStatusCand] = useState('');
  const [filtroTalentos, setFiltroTalentos] = useState({ q: '', habilidade: '', uf: '', cidadeId: '', estadoId: '' });
  const [detalheCand, setDetalheCand] = useState<{
    candidatura: CandidaturaEmpresa;
    candidato: CandidatoPerfil | null;
  } | null>(null);
  const [detalheTalento, setDetalheTalento] = useState<CandidatoPerfil | null>(null);
  const [perfilForm, setPerfilForm] = useState({
    nomeFantasia: '',
    contatoNome: '',
    whatsapp: '',
    email: '',
    logradouro: '',
    numero: '',
    estadoId: '',
    cidadeId: '',
    bairro: '',
    uf: '',
    redesSociais: { ...EMPTY_REDES },
  });

  const onPerfilLocationChange = useCallback(
    (next: { estadoId: string; cidadeId: string; uf: string }) => {
      setPerfilForm((f) => ({ ...f, ...next }));
    },
    [],
  );

  const onVagaLocationChange = useCallback(
    (next: { estadoId: string; cidadeId: string; uf: string }) => {
      setForm((f) => ({ ...f, estadoId: next.estadoId, cidadeId: next.cidadeId }));
    },
    [],
  );

  const onTalentosLocationChange = useCallback(
    (next: { estadoId: string; cidadeId: string; uf: string }) => {
      setFiltroTalentos((f) => ({ ...f, estadoId: next.estadoId, cidadeId: next.cidadeId, uf: next.uf }));
    },
    [],
  );

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
        logradouro: r.empresa.logradouro || '',
        numero: r.empresa.numero || '',
        estadoId: r.empresa.estadoId ? String(r.empresa.estadoId) : '',
        cidadeId: r.empresa.cidadeId ? String(r.empresa.cidadeId) : '',
        bairro: r.empresa.bairro || '',
        uf: r.empresa.uf || '',
        redesSociais: normalizeRedes(r.empresa.redesSociais),
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
  }, []);

  function loadTalentos() {
    setBuscandoTalentos(true);
    return api
      .empresaTalentos({
        q: filtroTalentos.q.trim() || undefined,
        habilidade: filtroTalentos.habilidade.trim() || undefined,
        uf: filtroTalentos.uf || undefined,
        cidadeId: filtroTalentos.cidadeId ? Number(filtroTalentos.cidadeId) : undefined,
      })
      .then((r) => setTalentos(r.items || []))
      .finally(() => setBuscandoTalentos(false));
  }

  useEffect(() => {
    if (tab === 'candidaturas' && user?.status === 'aprovada') {
      loadCandidaturas().catch((e) => flash(e instanceof Error ? e.message : 'Erro', true));
    }
  }, [tab, filtroVaga, filtroStatusCand, user?.status]);

  useEffect(() => {
    if (tab === 'talentos' && user?.status === 'aprovada') {
      loadTalentos().catch((e) => flash(e instanceof Error ? e.message : 'Erro', true));
    }
  }, [tab, user?.status]);

  useEffect(() => {
    if (tab !== 'candidaturas') setDetalheCand(null);
    if (tab !== 'talentos') setDetalheTalento(null);
  }, [tab]);

  function abrirTalento(c: CandidatoPerfil) {
    setDetalheTalento(c);
  }

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
      estadoId: '',
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

  async function onLogoChange(file: File | null, restaurar?: boolean) {
    setLogoSaving(true);
    flash('');
    try {
      const res = await api.uploadLogoEmpresa(file || undefined, restaurar);
      if (res.empresa) setEmpresa(res.empresa);
      flash(res.message || 'Logo atualizada.');
    } catch (err) {
      flash(err instanceof Error ? err.message : 'Erro ao enviar logo', true);
    } finally {
      setLogoSaving(false);
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
        logradouro: perfilForm.logradouro,
        numero: perfilForm.numero,
        cidadeId: perfilForm.cidadeId ? Number(perfilForm.cidadeId) : undefined,
        bairro: perfilForm.bairro,
        uf: perfilForm.uf,
        redesSociais: perfilForm.redesSociais,
      });
      setUser(res.user);
      setEmpresa(res.empresa);
      setPerfilForm((f) => ({
        ...f,
        estadoId: res.empresa.estadoId ? String(res.empresa.estadoId) : f.estadoId,
        cidadeId: res.empresa.cidadeId ? String(res.empresa.cidadeId) : '',
        uf: res.empresa.uf || f.uf,
        logradouro: res.empresa.logradouro || '',
        numero: res.empresa.numero || '',
        bairro: res.empresa.bairro || '',
        redesSociais: normalizeRedes(res.empresa.redesSociais),
      }));
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
              {(
                [
                  ['vagas', 'Vagas'],
                  ['candidaturas', 'Candidaturas'],
                  ['talentos', 'Buscar talentos'],
                  ['perfil', 'Perfil'],
                ] as const
              ).map(([t, label]) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`border-b-2 pb-3 font-medium transition ${tabClass(t)}`}
                >
                  {label}
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
                    </div>
                    <LocationSelect
                      estadoId={form.estadoId}
                      cidadeId={form.cidadeId}
                      uf=""
                      onChange={onVagaLocationChange}
                    />
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
                      <div className="flex items-start gap-3">
                        {detalheCand.candidato?.fotoUrl ? (
                          <img
                            src={detalheCand.candidato.fotoUrl}
                            alt=""
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-[var(--cj-border)]"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 font-bold text-brand-accent">
                            {(detalheCand.candidato?.nome || detalheCand.candidatura.candidatoNome || '?')
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {detalheCand.candidato?.nome || detalheCand.candidatura.candidatoNome}
                            <CandidatoIdadeBadge
                              idade={detalheCand.candidato?.idade ?? detalheCand.candidatura.candidatoIdade}
                              isMenorFlag={detalheCand.candidato?.isMenor ?? detalheCand.candidatura.candidatoIsMenor}
                              className="ml-1 text-base font-normal"
                            />
                          </h3>
                          <p className="text-sm text-subtle">
                            Vaga: {detalheCand.candidatura.vagaTitulo} ·{' '}
                            {STATUS_CAND[detalheCand.candidatura.status] || detalheCand.candidatura.status}
                          </p>
                        </div>
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
                    <SocialLinks redes={detalheCand.candidato?.redesSociais} className="mt-2" />
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
                    {detalheCand.candidato && (
                      <div className="rounded-xl border border-edge p-2">
                        <CurriculoView perfil={detalheCand.candidato} />
                      </div>
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
                            <div className="font-semibold">
                              {c.candidatoNome}
                              <CandidatoIdadeBadge
                                idade={c.candidatoIdade}
                                isMenorFlag={c.candidatoIsMenor}
                                className="ml-1 text-sm font-normal"
                              />
                            </div>
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

            {tab === 'talentos' && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Banco de talentos</h2>
                <p className="mt-1 text-sm text-muted">
                  Busque candidatos ativos por nome, habilidade ou localização.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <input
                    className="input"
                    placeholder="Nome, e-mail ou resumo…"
                    value={filtroTalentos.q}
                    onChange={(e) => setFiltroTalentos((f) => ({ ...f, q: e.target.value }))}
                  />
                  <input
                    className="input"
                    placeholder="Habilidade (ex: Excel)"
                    value={filtroTalentos.habilidade}
                    onChange={(e) => setFiltroTalentos((f) => ({ ...f, habilidade: e.target.value }))}
                  />
                </div>
                <LocationSelect
                  className="mt-4"
                  estadoId={filtroTalentos.estadoId}
                  cidadeId={filtroTalentos.cidadeId}
                  uf={filtroTalentos.uf}
                  onChange={onTalentosLocationChange}
                />
                <button
                  type="button"
                  className="btn-primary mt-4 text-sm"
                  disabled={buscandoTalentos}
                  onClick={() => {
                    setDetalheTalento(null);
                    loadTalentos().catch((e) => flash(e instanceof Error ? e.message : 'Erro', true));
                  }}
                >
                  {buscandoTalentos ? 'Buscando…' : 'Buscar candidatos'}
                </button>

                {detalheTalento && (
                  <div className="glass-card mt-6 space-y-4 border border-brand-accent/20">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {detalheTalento.fotoUrl ? (
                          <img
                            src={detalheTalento.fotoUrl}
                            alt=""
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-[var(--cj-border)]"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-accent/10 font-bold text-brand-accent">
                            {(detalheTalento.nome || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {detalheTalento.nome}
                            <CandidatoIdadeBadge
                              idade={detalheTalento.idade}
                              isMenorFlag={detalheTalento.isMenor}
                              className="ml-1 text-base font-normal"
                            />
                          </h3>
                          <p className="text-sm text-subtle">
                            {[detalheTalento.email, detalheTalento.cidadeNome, detalheTalento.uf]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>
                      </div>
                      <button type="button" className="btn-ghost text-xs" onClick={() => setDetalheTalento(null)}>
                        Fechar
                      </button>
                    </div>
                    {detalheTalento.resumo && <p className="text-sm text-muted">{detalheTalento.resumo}</p>}
                    <SocialLinks redes={detalheTalento.redesSociais} className="mt-2" />
                    {detalheTalento.habilidades.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {detalheTalento.habilidades.map((h) => (
                          <span key={h} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                    {detalheTalento.temSeloCertificado && (
                      <p className="text-sm text-emerald-300">✓ Formação verificada (selo certificado)</p>
                    )}
                    <div className="rounded-xl border border-edge p-2">
                      <CurriculoView perfil={detalheTalento} />
                    </div>
                    {waLink(detalheTalento.whatsapp) && (
                      <a
                        href={waLink(detalheTalento.whatsapp)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  {talentos.length === 0 ? (
                    <div className="glass-card text-center text-muted">
                      {buscandoTalentos ? 'Buscando…' : 'Nenhum candidato encontrado com estes filtros.'}
                    </div>
                  ) : (
                    talentos.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => abrirTalento(c)}
                        className={`glass-card w-full text-left transition hover:border-brand-accent/30 ${
                          detalheTalento?.id === c.id ? 'border-brand-accent/40' : ''
                        }`}
                      >
                        <div className="flex flex-wrap items-start gap-3">
                          {c.fotoUrl ? (
                            <img
                              src={c.fotoUrl}
                              alt=""
                              className="h-12 w-12 rounded-xl object-cover ring-1 ring-[var(--cj-border)]"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-accent/10 font-bold text-brand-accent">
                              {(c.nome || '?').charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold">
                              {c.nome}
                              <CandidatoIdadeBadge idade={c.idade} isMenorFlag={c.isMenor} className="ml-1 text-sm font-normal" />
                            </div>
                            <p className="mt-1 text-sm text-subtle line-clamp-2">{c.resumo || 'Sem resumo'}</p>
                            {c.habilidades.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {c.habilidades.slice(0, 6).map((h) => (
                                  <span key={h} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                                    {h}
                                  </span>
                                ))}
                              </div>
                            )}
                            {c.temSeloCertificado && (
                              <p className="mt-2 text-xs text-emerald-300">✓ Formação verificada</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {tab === 'perfil' && empresa && (
              <form onSubmit={onSubmitPerfil} className="glass-card mt-8 max-w-xl space-y-4">
                <h2 className="text-lg font-semibold">Dados da empresa</h2>
                <p className="text-xs text-faint">CNPJ: {empresa.cnpj} · Razão social: {empresa.razaoSocial}</p>

                <div>
                  <label className="mb-2 block text-sm font-medium">Logo da empresa</label>
                  <p className="mb-3 text-xs text-subtle">Aparece nas vagas e na página de empresas parceiras.</p>
                  <div className="flex flex-wrap items-center gap-4">
                    {empresa.logoUrl ? (
                      <img
                        src={empresa.logoUrl}
                        alt=""
                        className="h-16 w-16 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-[var(--cj-border)]"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-accent/10 text-xl font-bold text-brand-accent">
                        {(empresa.nomeFantasia || '?').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="btn-ghost cursor-pointer text-sm">
                        {logoSaving ? 'Enviando…' : 'Enviar logo'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={logoSaving}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onLogoChange(f);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {empresa.logoUrl && (
                        <button
                          type="button"
                          className="btn-ghost text-sm text-red-300"
                          disabled={logoSaving}
                          onClick={() => onLogoChange(null, true)}
                        >
                          Remover logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
                <AddressFields
                  logradouro={perfilForm.logradouro}
                  numero={perfilForm.numero}
                  bairro={perfilForm.bairro}
                  estadoId={perfilForm.estadoId}
                  cidadeId={perfilForm.cidadeId}
                  uf={perfilForm.uf}
                  onLogradouro={(v) => setPerfilForm((f) => ({ ...f, logradouro: v }))}
                  onNumero={(v) => setPerfilForm((f) => ({ ...f, numero: v }))}
                  onBairro={(v) => setPerfilForm((f) => ({ ...f, bairro: v }))}
                  onLocation={onPerfilLocationChange}
                />
                <SocialLinksForm
                  value={perfilForm.redesSociais}
                  onChange={(redesSociais) => setPerfilForm((f) => ({ ...f, redesSociais }))}
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
