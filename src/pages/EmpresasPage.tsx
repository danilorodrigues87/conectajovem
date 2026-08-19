import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, type Cidade, type Empresa } from '../lib/api';
import { site } from '../config/site';

function EmpresaCard({ empresa }: { empresa: Empresa }) {
  const initial = (empresa.nomeFantasia || '?').charAt(0).toUpperCase();
  return (
    <div className="glass-card group transition hover:border-brand-accent/25">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-accent/30 to-brand/30 text-lg font-bold ring-1 ring-[var(--cj-border)]">
          {initial}
        </div>
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
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidade, setCidade] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.cidades().then((r) => setCidades(r.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .empresas(cidade ? Number(cidade) : undefined)
      .then((r) => setEmpresas(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cidade]);

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
          <div className="mt-8 max-w-xs">
            <label className="mb-1.5 block text-xs text-faint">Filtrar por cidade</label>
            <select className="select" value={cidade} onChange={(e) => setCidade(e.target.value)}>
              <option value="">Todas as cidades</option>
              {cidades.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {loading && <p className="text-subtle">Carregando empresas…</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && empresas.length === 0 && (
          <div className="glass-card text-center">
            <p className="text-muted">Nenhuma empresa parceira aprovada nesta região ainda.</p>
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
