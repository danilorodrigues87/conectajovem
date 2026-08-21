import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Toast } from './Toast';
import { api, getRole, getToken, type BlogComentario } from '../lib/api';

type Props = {
  slug: string;
};

export function BlogComments({ slug }: Props) {
  const [items, setItems] = useState<BlogComentario[]>([]);
  const [total, setTotal] = useState(0);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const token = getToken();
  const role = getRole();
  const logado = !!token && !!role;

  useEffect(() => {
    if (!logado || !role) {
      setUserId(null);
      return;
    }
    const p =
      role === 'empresa'
        ? api.meEmpresa().then((r) => r.user.id)
        : api.meCandidato().then((r) => r.user.id);
    void p.then(setUserId).catch(() => setUserId(null));
  }, [logado, role]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.blogComentarios(slug);
      setItems(res.items || []);
      setTotal(res.total ?? res.items?.length ?? 0);
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [slug]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!logado) return;
    setSending(true);
    setToast(null);
    try {
      const res = await api.criarBlogComentario(slug, texto.trim());
      setTexto('');
      setToast({ message: res.message || 'Comentário publicado.', type: 'success' });
      await load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Não foi possível comentar.',
        type: 'error',
      });
    } finally {
      setSending(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Remover seu comentário?')) return;
    try {
      await api.excluirBlogComentario(id);
      await load();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Erro ao remover.',
        type: 'error',
      });
    }
  }

  const loginReturn = encodeURIComponent(`/blog/${slug}`);

  return (
    <section className="mt-12 border-t border-[var(--cj-border)] pt-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-xl font-semibold">
        Comentários {total > 0 && <span className="text-base font-normal text-subtle">({total})</span>}
      </h2>

      {logado ? (
        <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-3">
          <textarea
            className="input min-h-[100px] resize-y"
            placeholder="Compartilhe sua opinião ou dúvida sobre este artigo…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={2000}
            required
          />
          <button type="submit" className="btn-primary" disabled={sending || !texto.trim()}>
            {sending ? 'Publicando…' : 'Publicar comentário'}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted">
          <Link to={`/login?return=${loginReturn}`} className="text-brand-accent hover:underline">
            Entre na sua conta
          </Link>{' '}
          (candidato ou empresa) para comentar.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && <p className="text-sm text-subtle">Carregando comentários…</p>}
        {!loading && items.length === 0 && (
          <p className="text-sm text-subtle">Seja o primeiro a comentar.</p>
        )}
        {items.map((c) => {
          const mine = logado && userId != null && c.usuarioId === userId;
          return (
            <div key={c.id} className="glass-card space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{c.nomeExibicao}</span>
                  {c.tipoAutor === 'empresa' && (
                    <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-brand-accent">
                      Empresa
                    </span>
                  )}
                  <span className="text-xs text-faint">{c.createdAt}</span>
                </div>
                {mine && (
                  <button
                    type="button"
                    className="text-xs text-red-300 hover:underline"
                    onClick={() => void onDelete(c.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm text-[var(--cj-text)]">{c.texto}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
