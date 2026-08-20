import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VagaCard } from '../VagaCard';
import { api, type Vaga } from '../../lib/api';
import { site } from '../../config/site';

export function FeaturedJobsSection() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .vagas({ limit: 6 })
      .then((r) => setVagas(r.items || []))
      .catch(() => setVagas([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || vagas.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="badge mb-3">Oportunidades</p>
          <h2 className="text-2xl font-bold md:text-3xl">{site.featuredJobs.title}</h2>
          <p className="mt-2 max-w-xl text-muted">{site.featuredJobs.subtitle}</p>
        </div>
        <Link to="/vagas" className="btn-ghost shrink-0">
          {site.featuredJobs.cta} →
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vagas.map((v) => (
          <VagaCard key={v.id} vaga={v} />
        ))}
      </div>
    </section>
  );
}
