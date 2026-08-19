import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, clearSession, type Cidade, type UserEmpresa, type Vaga } from '../lib/api';
import { site } from '../config/site';

const TIPO_LABEL: Record<string, string> = {
  aprendiz: 'Jovem Aprendiz',
  estagio: 'Estágio',
  clt: 'CLT',
  freelance: 'Freelance',
};

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  pendente: { text: 'Em moderação', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  publicada: { text: 'Publicada', className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  reprovada: { text: 'Reprovada', className: 'bg-red-500/15 text-red-300 border-red-500/30' },
  encerrada: { text: 'Encerrada', className: 'bg-white/10 text-white/50 border-white/15' },
};

function StatusBadge({ status }: { status?: string }) {
  const s = STATUS_LABEL[status || ''] || { text: status || '—', className: 'bg-white/10 text-white/60 border-white/15' };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
      {s.text}
    </span>
  );
}

export function EmpresaDashboardPage() {
  const [user, setUser] = useState<UserEmpresa | null>(null);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    tipoVaga: 'clt',
    modalidade: 'presencial',
    cidadeId: '',
    descricao: '',
    requisitos: '',
  });

  function load() {
    setLoading(true);
    setError('');
    Promise.all([api.meEmpresa(), api.empresaVagas()])
      .then(([me, vagasRes]) => {
        setUser(me.user);
        setVagas(vagasRes.items || []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    api.cidades().then((r) => setCidades(r.items || [])).catch(() => {});
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (user?.status !== 'aprovada') return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.criarVaga({
        titulo: form.titulo,
        tipoVaga: form.tipoVaga,
        modalidade: form.modalidade,
        cidadeId: form.cidadeId ? Number(form.cidadeId) : undefined,
        descricao: form.descricao,
        requisitos: form.requisitos,
      });
      setSuccess(res.message || 'Vaga enviada para moderação.');
      setForm({ titulo: '', tipoVaga: 'clt', modalidade: 'presencial', cidadeId: '', descricao: '', requisitos: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao publicar vaga');
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearSession();
    window.location.href = '/login';
  }

  const aprovada = user?.status === 'aprovada';

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="badge mb-2">Área da empresa parceira</p>
            <h1 className="text-2xl font-bold md:text-3xl">Olá, {user?.nome || '…'}</h1>
            <p className="mt-1 text-muted">Gerencie vagas da sua empresa no {site.name}.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={logout} className="btn-ghost text-sm">
              Sair
            </button>
            {aprovada && (
              <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary text-sm">
                {showForm ? 'Cancelar' : '+ Nova vaga'}
              </button>
            )}
          </div>
        </div>

        {loading && <p className="mt-8 text-subtle">Carregando…</p>}

        {!loading && user?.status === 'pendente' && (
          <div className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <h2 className="font-semibold text-amber-200">Cadastro em análise</h2>
            <p className="mt-2 text-sm text-amber-100/75">
              Sua empresa parceira está aguardando aprovação da equipe {site.name}. Assim que aprovada, você poderá
              publicar vagas.
            </p>
          </div>
        )}

        {!loading && user?.status === 'bloqueada' && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="font-semibold text-red-200">Conta bloqueada</h2>
            <p className="mt-2 text-sm text-red-100/75">Entre em contato com o suporte do {site.name}.</p>
          </div>
        )}

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-6 text-sm text-emerald-400">{success}</p>}

        {showForm && aprovada && (
          <form onSubmit={onSubmit} className="glass-card mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Nova vaga</h2>
            <input
              className="input"
              placeholder="Título da vaga *"
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
              placeholder="Descrição da vaga *"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
              required
            />
            <textarea
              className="input min-h-[80px] resize-y"
              placeholder="Requisitos (opcional)"
              value={form.requisitos}
              onChange={(e) => setForm((f) => ({ ...f, requisitos: e.target.value }))}
            />
            <p className="text-xs text-faint">Vagas passam por moderação antes de aparecer no portal público.</p>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Enviando…' : 'Enviar para moderação'}
            </button>
          </form>
        )}

        {!loading && aprovada && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Suas vagas ({vagas.length})</h2>
            </div>
            {vagas.length === 0 ? (
              <div className="glass-card text-center">
                <p className="text-muted">Nenhuma vaga cadastrada ainda.</p>
                <button type="button" onClick={() => setShowForm(true)} className="btn-primary mt-4 text-sm">
                  Publicar primeira vaga
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {vagas.map((v) => (
                  <div key={v.id} className="glass-card flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{v.titulo}</h3>
                        <StatusBadge status={v.status} />
                      </div>
                      <p className="mt-1 text-sm text-subtle">
                        {TIPO_LABEL[v.tipoVaga] || v.tipoVaga}
                        {[v.cidadeNome, v.uf].filter(Boolean).length > 0 &&
                          ` · ${[v.cidadeNome, v.uf].filter(Boolean).join(' / ')}`}
                      </p>
                    </div>
                    {v.status === 'publicada' && v.slug && (
                      <Link to={`/vagas/${v.slug}`} className="btn-ghost text-sm">
                        Ver no portal
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
