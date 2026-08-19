import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { site } from '../config/site';

export function ComoFuncionaPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="badge mb-3">Institucional</p>
        <h1 className="text-3xl font-bold">Como funciona o {site.name}</h1>
        <p className="mt-4 text-lg text-muted">
          {site.about} Conectamos candidatos a empresas parceiras, com o apoio de escolas parceiras que enriquecem
          perfis com formação verificada.
        </p>
        <div className="mt-10 space-y-8">
          {site.steps.map((step, i) => (
            <div key={step.title} className="glass-card flex gap-5">
              <span className="text-3xl font-bold text-brand-accent/80">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="text-xl font-semibold">{step.title}</h2>
                <p className="mt-2 text-muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/cadastro" className="btn-primary">Começar agora</Link>
          <Link to="/vagas" className="btn-ghost">Explorar vagas</Link>
        </div>
      </div>
    </Layout>
  );
}
