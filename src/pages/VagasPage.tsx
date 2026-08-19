import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { VagaCard } from '../components/VagaCard';
import { api, type Cidade, type Empresa, type Vaga } from '../lib/api';

export function VagasPage() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [cidade, setCidade] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [tipo, setTipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.cidades().then((r) => setCidades(r.items || [])).catch(() => {});
    api.empresas().then((r) => setEmpresas(r.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .vagas({
        cidade: cidade || undefined,
        empresa: empresa || undefined,
        tipo: tipo || undefined,
      })
      .then((r) => setVagas(r.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [cidade, empresa, tipo]);

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">Vagas abertas</h1>
        <p className="mt-2 text-muted">Filtre por cidade, empresa ou tipo de vaga.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <select className="select" value={cidade} onChange={(e) => setCidade(e.target.value)}>
            <option value="">Todas as cidades</option>
            {cidades.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
          <select className="select" value={empresa} onChange={(e) => setEmpresa(e.target.value)}>
            <option value="">Todas as empresas</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nomeFantasia}
              </option>
            ))}
          </select>
          <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            <option value="aprendiz">Jovem Aprendiz</option>
            <option value="estagio">Estágio</option>
            <option value="clt">CLT</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        {loading && <p className="mt-8 text-subtle">Carregando vagas…</p>}
        {error && <p className="mt-8 text-red-500 dark:text-red-400">{error}</p>}
        {!loading && !error && vagas.length === 0 && (
          <p className="mt-8 text-subtle">Nenhuma vaga publicada no momento. Volte em breve!</p>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {vagas.map((v) => (
            <VagaCard key={v.id} vaga={v} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
