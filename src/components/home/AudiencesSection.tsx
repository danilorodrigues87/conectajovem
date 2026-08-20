import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { images } from '../../config/images';

const imageMap = {
  candidate: images.candidate,
  company: images.company,
  school: images.school,
} as const;

const imageFallback: Record<keyof typeof imageMap, string> = {
  candidate: images.candidate,
  company: images.company,
  school: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&auto=format&q=80',
};

export function AudiencesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <p className="badge mb-3 inline-flex">Para quem é</p>
        <h2 className="text-2xl font-bold md:text-3xl">Uma plataforma, três caminhos</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          Jovens talentos, empresas parceiras e escolas parceiras — todos conectados em um ecossistema
          de empregabilidade.
        </p>
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {site.audiences.map((audience) => (
          <article key={audience.id} className="glass-card overflow-hidden p-0">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={imageMap[audience.imageKey]}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  const fb = imageFallback[audience.imageKey];
                  if (fb && img.src !== fb) img.src = fb;
                }}
              />
            </div>
            <div className="p-6">
              <p className="badge mb-3">{audience.badge}</p>
              <h3 className="text-xl font-semibold">{audience.title}</h3>
              <p className="mt-2 text-sm text-muted">{audience.text}</p>
              <ul className="mt-4 space-y-2">
                {audience.benefits.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-subtle">
                    <span className="text-brand-accent">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link to={audience.ctaLink} className="btn-primary mt-6 inline-flex text-sm">
                {audience.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
