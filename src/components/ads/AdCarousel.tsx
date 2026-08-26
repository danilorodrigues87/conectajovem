import { useEffect, useState } from 'react';
import type { AnuncioPublico, AnuncioSlot } from '../../lib/api';

type Props = {
  items: AnuncioPublico[];
  onClique: (a: AnuncioPublico) => void;
  className?: string;
  variant?: 'footer' | 'default' | 'sidebar' | 'blog_end';
};

const IMG_CLASS: Record<NonNullable<Props['variant']>, string> = {
  footer: 'w-full object-contain object-center max-h-24 md:max-h-28',
  default: 'w-full object-contain object-center max-h-40 md:max-h-44',
  sidebar: 'w-full object-cover object-center max-h-80 md:max-h-[28rem]',
  blog_end: 'w-full object-contain object-center max-h-28 md:max-h-32',
};

export function slotAdVariant(slot: AnuncioSlot): NonNullable<Props['variant']> {
  switch (slot) {
    case 'footer_carousel':
      return 'footer';
    case 'vagas_sidebar':
    case 'blog_sidebar':
      return 'sidebar';
    case 'blog_artigo_fim':
      return 'blog_end';
    default:
      return 'default';
  }
}

export function AdCarousel({ items, onClique, className = '', variant = 'default' }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(t);
  }, [items.length]);

  useEffect(() => {
    setIdx(0);
  }, [items]);

  if (!items.length) return null;

  const atual = items[idx] || items[0];
  const img = atual.imagemMobileUrl || atual.imagemUrl;
  const imgClass = IMG_CLASS[variant];

  return (
    <aside className={className.trim() || undefined} aria-label="Publicidade">
      <button
        type="button"
        className="group block w-full overflow-hidden rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        onClick={() => onClique(atual)}
        title={atual.titulo || atual.nomeAnunciante}
        aria-label={atual.titulo || atual.nomeAnunciante || 'Ver anúncio'}
      >
        {img ? (
          <img
            src={img}
            alt=""
            className={`${imgClass} transition group-hover:opacity-95`}
            loading="lazy"
          />
        ) : (
          <div className="py-4 text-center text-sm text-muted">{atual.titulo}</div>
        )}
      </button>
      {items.length > 1 && (
        <div className="mt-1 flex justify-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Anúncio ${i + 1} de ${items.length}`}
              aria-current={i === idx ? 'true' : undefined}
              className={`h-1 w-1 rounded-full ${i === idx ? 'bg-brand-accent/80' : 'bg-white/25'}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
