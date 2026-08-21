import { useEffect, useState } from 'react';
import { api, type Depoimento } from '../../lib/api';
import { site } from '../../config/site';

function fallbackDepoimentos(): Depoimento[] {
  return site.testimonials.map((t, i) => ({
    id: -(i + 1),
    texto: t.quote,
    nome: t.name,
    cargo: t.role,
    avatarUrl: null,
  }));
}

function DepoimentoAvatar({ item }: { item: Depoimento }) {
  const initial = (item.nome || '?').charAt(0).toUpperCase();
  if (item.avatarUrl) {
    return (
      <img
        src={item.avatarUrl}
        alt=""
        className="h-10 w-10 rounded-full object-cover ring-1 ring-[var(--cj-border)]"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-bold text-brand-accent ring-1 ring-[var(--cj-border)]">
      {initial}
    </div>
  );
}

export function TestimonialsSection() {
  const [items, setItems] = useState<Depoimento[]>([]);

  useEffect(() => {
    api
      .depoimentos()
      .then((r) => setItems(r.items?.length ? r.items : fallbackDepoimentos()))
      .catch(() => setItems(fallbackDepoimentos()));
  }, []);

  if (items.length === 0) return null;

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
          {items.map((t) => (
            <blockquote key={t.id} className="glass-card flex flex-col">
              <p className="flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.texto}&rdquo;</p>
              <footer className="mt-6 flex items-center gap-3 border-t border-edge pt-4">
                <DepoimentoAvatar item={t} />
                <div>
                  <cite className="not-italic font-medium">{t.nome}</cite>
                  <p className="text-xs text-faint">{t.cargo}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
