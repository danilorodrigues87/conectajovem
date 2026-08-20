import { Link } from 'react-router-dom';
import { site } from '../../config/site';

export function JobTypesStrip() {
  return (
    <section className="strip-section border-y py-10">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-faint">
          Conectando talentos · empresas parceiras · escolas parceiras
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {site.jobTypes.map((tipo) => (
            <Link
              key={tipo.value}
              to={`/vagas?tipo=${tipo.value}`}
              className="chip flex h-14 min-w-[120px] items-center justify-center rounded-xl px-5 text-sm font-medium transition hover:border-brand-accent/40 hover:text-brand-accent"
            >
              {tipo.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
