import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { site } from '../config/site';

export function HomePage() {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-conect-jovem.jpg"
            alt=""
            className="hero-img h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/hero-conect-jovem.svg';
            }}
          />
          <div className="hero-overlay-r absolute inset-0" />
          <div className="hero-overlay-t absolute inset-0" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:pt-24">
          <div>
            <p className="badge mb-4">{site.hero.eyebrow}</p>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]">
              {site.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{site.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/vagas" className="btn-primary">
                {site.hero.ctaPrimary}
              </Link>
              <Link to="/cadastro/empresa" className="btn-ghost">
                {site.hero.ctaSecondary}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-edge pt-8">
              {site.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-brand-accent">{s.value}</div>
                  <div className="text-xs text-faint">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg font-semibold">Por que o {site.name}?</h2>
            <ul className="mt-5 space-y-4">
              {site.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-bold text-brand-accent">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <p className="mt-0.5 text-sm text-subtle">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="strip-section border-y py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-faint">
            Conectando talentos · empresas parceiras · escolas parceiras
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 opacity-90">
            {['Aprendizagem', 'Estágio', 'CLT', 'Freelance'].map((label) => (
              <div key={label} className="chip flex h-14 min-w-[120px] items-center justify-center rounded-xl px-5 text-sm font-medium">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card">
            <p className="badge mb-3">{site.partners.companiesLabel}</p>
            <h3 className="text-xl font-semibold">Contrate talentos da sua região</h3>
            <p className="mt-3 text-muted">{site.partners.companiesText}</p>
            <Link to="/cadastro/empresa" className="btn-primary mt-6 inline-flex">
              Cadastrar minha empresa
            </Link>
          </div>
          <div className="glass-card">
            <p className="badge mb-3">{site.partners.schoolsLabel}</p>
            <h3 className="text-xl font-semibold">Formação que vira oportunidade</h3>
            <p className="mt-3 text-muted">{site.partners.schoolsText}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent">
              ✓ Selo {site.badgeCertified}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-edge bg-gradient-to-br from-brand/30 via-brand-accent/20 to-transparent p-10 text-center md:p-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold md:text-3xl">Pronto para dar o próximo passo?</h2>
          <p className="relative mx-auto mt-3 max-w-lg text-muted">
            Crie seu perfil gratuitamente e descubra vagas de empresas parceiras perto de você.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/cadastro" className="btn-primary">Criar meu perfil</Link>
            <Link to="/vagas" className="btn-ghost">Ver vagas abertas</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
