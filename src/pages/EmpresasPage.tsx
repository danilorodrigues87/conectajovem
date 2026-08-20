import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, type Empresa } from '../lib/api';
import { site } from '../config/site';

function EmpresaCard({ empresa }: { empresa: Empresa }) {
  const initial = (empresa.nomeFantasia || '?').charAt(0).toUpperCase();
  return (
    <div className="glass-card group transition hover:border-brand-accent/25">
      <div className="flex items-start gap-4">
        {empresa.logoUrl ? (
          <img
            src={empresa.logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-contain bg-white/5 p-1 ring-1 ring-[var(--cj-border)]"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent/30 to-brand/30 text-lg font-bold ring-1 ring-[var(--cj-border)]">
            {initial}
          </div>
        )}
        <div>
          <h3 className="font-semibold transition group-hover:text-brand-accent">{empresa.nomeFantasia}</h3>
          <p className="mt-1 text-sm text-subtle">
            {[empresa.cidadeNome, empresa.uf].filter(Boolean).join(' · ') || 'Brasil'}
          </p>
          <span className="mt-3 inline-flex text-xs text-brand-accent/80">Empresa parceira ✓</span>
        </div>
      </div>
    </div>
  );
}

export function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .empresas({ q: busca.trim() || undefined })
      .then((r) => setEmpresas(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [busca]);

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-14">
          <p className="badge mb-3">{site.partners.companiesLabel}</p>
          <h1 className="text-3xl font-bold md:text-4xl">Empresas parceiras</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Conheça quem contrata pelo {site.name} — empresas locais aprovadas que publicam vagas reais para jovens
            talentos.
          </p>
          <div className="mt-8 max-w-md">
            <label className="mb-1.5 block text-xs text-faint">Buscar empresa</label>
            <input
              className="input"
              type="search"
              placeholder="Nome fantasia ou razão social…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {loading && <p className="text-subtle">Carregando empresas…</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && empresas.length === 0 && (
          <div className="glass-card text-center">
            <p className="text-muted">Nenhuma empresa parceira encontrada.</p>
            <Link to="/cadastro/empresa" className="btn-primary mt-4 inline-flex text-sm">
              Quero ser empresa parceira
            </Link>
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {empresas.map((e) => (
            <EmpresaCard key={e.id} empresa={e} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
