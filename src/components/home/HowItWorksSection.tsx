import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import type { BrandingState } from '../../hooks/useBranding';

type Props = {
  branding: BrandingState;
};

export function HowItWorksSection({ branding }: Props) {
  return (
    <section className="border-y border-edge py-16" style={{ background: 'var(--cj-glass-subtle)' }}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="badge mb-3 inline-flex">Como funciona</p>
          <h2 className="text-2xl font-bold md:text-3xl">Três passos para sua próxima oportunidade</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            O {branding.nomePortal} simplifica a jornada do primeiro contato à candidatura.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {site.steps.map((step, i) => (
            <div key={step.title} className="glass-card text-center md:text-left">
              <span className="text-3xl font-bold text-brand-accent/80">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/como-funciona" className="btn-ghost">
            Saiba mais sobre o {branding.nomePortal}
          </Link>
        </div>
      </div>
    </section>
  );
}
