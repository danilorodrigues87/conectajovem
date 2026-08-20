import { Link } from 'react-router-dom';
import { site } from '../../config/site';

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-br from-brand/30 via-brand-accent/20 to-transparent p-10 text-center md:p-14">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />
        <h2 className="relative text-2xl font-bold md:text-3xl">{site.finalCta.title}</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-muted">{site.finalCta.subtitle}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/cadastro" className="btn-primary">
            {site.finalCta.primary}
          </Link>
          <Link to="/vagas" className="btn-ghost">
            {site.finalCta.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
