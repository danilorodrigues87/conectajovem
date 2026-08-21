import { site } from '../../config/site';
import { images } from '../../config/images';

export function TestimonialsSection() {
  return (
    <section className="border-y border-edge py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="badge mb-3 inline-flex">Histórias</p>
          <h2 className="text-2xl font-bold md:text-3xl">Quem já está conectado</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Experiências de candidatos, empresas e escolas parceiras na plataforma.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t) => (
            <blockquote key={t.name} className="glass-card flex flex-col">
              <p className="flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 flex items-center gap-3 border-t border-edge pt-4">
                <img
                  src={images.testimonials[t.avatarIndex]}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <cite className="not-italic font-medium">{t.name}</cite>
                  <p className="text-xs text-faint">{t.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
