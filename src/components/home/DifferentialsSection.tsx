import { site } from '../../config/site';

export function DifferentialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <p className="badge mb-3 inline-flex">Diferenciais</p>
        <h2 className="text-2xl font-bold md:text-3xl">Por que escolher o {site.name}?</h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {site.differentials.map((item) => (
          <div key={item.title} className="glass-card text-center">
            <span className="text-2xl" aria-hidden>
              {item.icon}
            </span>
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
