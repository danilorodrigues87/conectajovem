import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, type BlogPostResumo } from '../lib/api';

const CAT_LABEL: Record<string, string> = {
  tecnologia: 'Tecnologia',
  formacao: 'Formação',
  empregabilidade: 'Empregabilidade',
};

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostResumo[]>([]);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .blogPosts({ q: busca.trim() || undefined, categoria: categoria || undefined })
      .then((r) => setPosts(r.items || []))
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [busca, categoria]);

  const destaque = posts[0];
  const resto = posts.slice(1);

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-14">
        <p className="badge mb-3">Conteúdo</p>
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Artigos sobre tecnologia, formação profissional e empregabilidade para jovens e empresas parceiras.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            className="input flex-1"
            placeholder="Buscar artigos…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select
            className="input sm:w-52"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            <option value="tecnologia">Tecnologia</option>
            <option value="formacao">Formação</option>
            <option value="empregabilidade">Empregabilidade</option>
          </select>
        </div>

        {error && <p className="mt-6 text-red-300">{error}</p>}
        {loading && <p className="mt-8 text-subtle">Carregando…</p>}

        {!loading && posts.length === 0 && !error && (
          <p className="mt-8 text-muted">Nenhum artigo publicado ainda.</p>
        )}

        {destaque && (
          <Link
            to={`/blog/${destaque.slug}`}
            className="glass-card mt-8 block overflow-hidden transition hover:border-brand-accent/30"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {destaque.capaUrl ? (
                <img src={destaque.capaUrl} alt="" className="h-48 w-full object-cover md:h-full" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-brand/20 to-brand-accent/20 md:h-auto">
                  <span className="text-4xl opacity-40">✦</span>
                </div>
              )}
              <div className="flex flex-col justify-center p-2 md:p-4">
                {destaque.categoriaSlug && (
                  <span className="text-xs font-medium uppercase tracking-wide text-brand-accent">
                    {CAT_LABEL[destaque.categoriaSlug] || destaque.categoriaNome}
                  </span>
                )}
                <h2 className="mt-2 text-2xl font-bold">{destaque.titulo}</h2>
                {destaque.resumo && <p className="mt-3 text-muted line-clamp-3">{destaque.resumo}</p>}
                <span className="mt-4 text-sm text-brand-accent">Ler artigo →</span>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resto.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              className="glass-card group flex flex-col overflow-hidden transition hover:border-brand-accent/25"
            >
              {p.capaUrl ? (
                <img src={p.capaUrl} alt="" className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center bg-white/5">
                  <span className="text-2xl opacity-30">✦</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                {p.categoriaSlug && (
                  <span className="text-[10px] font-medium uppercase tracking-wide text-brand-accent">
                    {CAT_LABEL[p.categoriaSlug] || p.categoriaNome}
                  </span>
                )}
                <h3 className="mt-1 font-semibold group-hover:text-brand-accent">{p.titulo}</h3>
                {p.resumo && <p className="mt-2 flex-1 text-sm text-subtle line-clamp-2">{p.resumo}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
