import { useEffect } from 'react';
import { site } from '../config/site';

export type SeoProps = {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  type?: string;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function SeoHead({ title, description, image, url, type = 'website' }: SeoProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : site.name;
    document.title = fullTitle;

    const desc = description || site.description;
    const pageUrl = url || window.location.href;
    const ogImage = image || `${window.location.origin}/logo-conect-jovem.png`;

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:url', pageUrl);
    upsertMeta('property', 'og:type', type);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);
  }, [title, description, image, url, type]);

  return null;
}
