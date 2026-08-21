import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BlogComments } from '../components/BlogComments';
import { Layout } from '../components/Layout';
import { SeoHead } from '../components/SeoHead';
import { api, type BlogPost } from '../lib/api';
import { formatDateBr } from '../lib/date';

export function BlogPostPage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    api
      .blogPost(slug)
      .then((r) => {
        setPost(r.post);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <Layout>
      {post && (
        <SeoHead
          title={post.metaTitle || post.titulo}
          description={post.metaDescription || post.resumo}
          image={post.capaUrl}
          url={`${window.location.origin}/blog/${post.slug}`}
          type="article"
        />
      )}
      <article className="mx-auto max-w-3xl px-4 py-14">
        <Link to="/blog" className="text-sm text-brand-accent hover:underline">
          ← Voltar ao blog
        </Link>

        {loading && <p className="mt-8 text-subtle">Carregando…</p>}
        {error && <p className="mt-8 text-red-300">{error}</p>}

        {post && (
          <>
            {post.categoriaNome && (
              <p className="badge mt-6">{post.categoriaNome}</p>
            )}
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{post.titulo}</h1>
            <p className="mt-3 text-sm text-subtle">
              {post.autorNome}
              {post.publicadoEm ? ` · ${formatDateBr(post.publicadoEm)}` : ''}
            </p>
            {post.capaUrl && (
              <img
                src={post.capaUrl}
                alt=""
                className="mt-8 w-full rounded-2xl border border-[var(--cj-border)] object-cover"
              />
            )}
            {post.resumo && (
              <p className="mt-8 text-lg text-muted">{post.resumo}</p>
            )}
            <div
              className="cj-blog-content mt-8"
              dangerouslySetInnerHTML={{ __html: post.corpoHtml }}
            />
            <BlogComments slug={post.slug} />
          </>
        )}
      </article>
    </Layout>
  );
}
