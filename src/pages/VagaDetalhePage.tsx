import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, getRole, getToken, type Vaga } from '../lib/api';

export function VagaDetalhePage() {
  const { slug = '' } = useParams();
  const nav = useNavigate();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [jaCandidatou, setJaCandidatou] = useState(false);

  const logado = !!getToken();
  const isCandidato = getRole() === 'candidato';

  useEffect(() => {
    if (!slug) return;
    api
      .vaga(slug)
      .then((r) => setVaga(r.vaga))
      .catch((e) => setError(e.message));
  }, [slug]);

  useEffect(() => {
    if (!logado || !isCandidato || !vaga?.id) return;
    api
      .candidaturas()
      .then((r) => {
        const found = (r.items || []).some((c) => c.vagaId === vaga.id);
        setJaCandidatou(found);
      })
      .catch(() => {});
  }, [logado, isCandidato, vaga?.id]);

  async function onCandidatar(e: FormEvent) {
    e.preventDefault();
    if (!vaga) return;
    setApplying(true);
    setApplyError('');
    setApplySuccess('');
    try {
      const res = await api.candidatar(vaga.id, mensagem || undefined);
      setApplySuccess(res.message || 'Candidatura enviada!');
      setJaCandidatou(true);
      setShowForm(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao candidatar';
      if (msg.includes('já se candidatou')) {
        setJaCandidatou(true);
      }
      setApplyError(msg);
    } finally {
      setApplying(false);
    }
  }

  function handleCandidatarClick() {
    if (!logado) {
      nav('/login', { state: { from: `/vagas/${slug}` } });
      return;
    }
    if (!isCandidato) {
      setApplyError('Faça login como candidato para se candidatar.');
      return;
    }
    setShowForm(true);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/vagas" className="text-sm text-brand-accent hover:underline">
          ← Voltar às vagas
        </Link>
        {error && <p className="mt-6 text-red-500 dark:text-red-400">{error}</p>}
        {vaga && (
          <article className="card mt-6">
            <p className="text-sm text-subtle">{vaga.empresaNome}</p>
            <h1 className="mt-1 text-3xl font-bold">{vaga.titulo}</h1>
            <p className="mt-2 text-muted">
              {[vaga.cidadeNome, vaga.uf, vaga.modalidade].filter(Boolean).join(' · ')}
            </p>
            <div className="mt-6 max-w-none whitespace-pre-wrap text-muted">{vaga.descricao}</div>
            {vaga.requisitos && (
              <>
                <h2 className="mt-8 text-lg font-semibold">Requisitos</h2>
                <p className="mt-2 whitespace-pre-wrap text-muted">{vaga.requisitos}</p>
              </>
            )}

            {applySuccess && (
              <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {applySuccess}{' '}
                <Link to="/candidato" className="underline">
                  Ver minhas candidaturas
                </Link>
              </p>
            )}
            {applyError && <p className="mt-6 text-sm text-red-400">{applyError}</p>}

            {jaCandidatou && !applySuccess ? (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-accent/15 px-4 py-2 text-sm font-medium text-brand-accent">
                  ✓ Você já se candidatou a esta vaga
                </span>
                <Link to="/candidato" className="btn-ghost text-sm">
                  Ver candidaturas
                </Link>
              </div>
            ) : !showForm ? (
              <button type="button" onClick={handleCandidatarClick} className="btn-primary mt-8">
                Candidatar-se
              </button>
            ) : (
              <form onSubmit={onCandidatar} className="mt-8 space-y-4 rounded-2xl border border-edge p-5">
                <h2 className="font-semibold">Confirmar candidatura</h2>
                <textarea
                  className="input min-h-[80px] resize-y"
                  placeholder="Mensagem opcional para a empresa parceira"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                />
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary" disabled={applying}>
                    {applying ? 'Enviando…' : 'Enviar candidatura'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </article>
        )}
      </div>
    </Layout>
  );
}
