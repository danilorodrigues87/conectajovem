import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdSlot } from '../components/ads/AdSlot';
import { Layout } from '../components/Layout';
import { VagaCard } from '../components/VagaCard';
import { api, type Vaga } from '../lib/api';

const TIPOS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'aprendiz', label: 'Jovem Aprendiz' },
  { value: 'estagio', label: 'Estágio' },
  { value: 'clt', label: 'CLT' },
  { value: 'freelance', label: 'Freelance' },
];

export function VagasPage() {
  const [searchParams] = useSearchParams();
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState(() => searchParams.get('tipo') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const qTipo = searchParams.get('tipo') || '';
    setTipo(qTipo);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .vagas({
        q: busca.trim() || undefined,
        tipo: tipo || undefined,
      })
      .then((r) => setVagas(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [busca, tipo]);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Vagas abertas</h1>
        <p className="mt-2 text-muted">Busque por palavra-chave ou filtre por tipo de vaga.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className="input"
            type="search"
            placeholder="Buscar vagas, empresas ou requisitos…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select className="select md:min-w-[180px]" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => (
              <option key={t.value || 'all'} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="mt-8 text-subtle">Carregando vagas…</p>}
        {error && <p className="mt-8 text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && vagas.length === 0 && (
          <p className="mt-8 text-subtle">Nenhuma vaga encontrada. Tente outra busca ou volte em breve!</p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-4 md:grid-cols-2">
            {vagas.map((v) => (
              <VagaCard key={v.id} vaga={v} />
            ))}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <AdSlot slot="vagas_sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
