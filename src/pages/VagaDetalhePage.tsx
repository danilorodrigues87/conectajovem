import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, type Vaga } from '../lib/api';

export function VagaDetalhePage() {
  const { slug = '' } = useParams();
  const [vaga, setVaga] = useState<Vaga | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    api
      .vaga(slug)
      .then((r) => setVaga(r.vaga))
      .catch((e) => setError(e.message));
  }, [slug]);

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
            <Link to="/login" className="btn-primary mt-8 inline-flex">
              Candidatar-se
            </Link>
          </article>
        )}
      </div>
    </Layout>
  );
}
