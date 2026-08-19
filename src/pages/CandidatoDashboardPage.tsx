import { Layout } from '../components/Layout';

export function CandidatoDashboardPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-bold">Área do candidato</h1>
        <p className="mt-2 text-muted">Em breve: currículo, candidaturas e notificações.</p>
        <div className="card mt-8">
          <p className="text-muted">
            Você está autenticado. Explore as{' '}
            <a href="/vagas" className="text-brand-accent underline">
              vagas abertas
            </a>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
