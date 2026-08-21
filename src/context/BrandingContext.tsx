import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { images } from '../config/images';
import { site } from '../config/site';
import { EMPTY_REDES, normalizeRedes, type RedesSociais } from '../lib/social';

export type BrandingState = {
  nomePortal: string;
  textoInstitucional: string;
  heroImageUrl: string;
  logoUrl: string | null;
  redesSociais: RedesSociais;
  loading: boolean;
};

const defaults: BrandingState = {
  nomePortal: site.name,
  textoInstitucional: site.about,
  heroImageUrl: images.hero,
  logoUrl: null,
  redesSociais: EMPTY_REDES,
  loading: true,
};

const BrandingContext = createContext<BrandingState>(defaults);

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BrandingState>(defaults);

  useEffect(() => {
    api
      .branding()
      .then((r) => {
        const b = r.branding;
        setState({
          nomePortal: b.nomePortal?.trim() || site.name,
          textoInstitucional: b.textoInstitucional?.trim() || site.about,
          heroImageUrl: b.heroImageUrl?.trim() || images.hero,
          logoUrl: b.logoUrl?.trim() || null,
          redesSociais: normalizeRedes(b.redesSociais),
          loading: false,
        });
      })
      .catch(() => {
        setState({ ...defaults, loading: false });
      });
  }, []);

  useEffect(() => {
    if (state.loading) return;
    document.title = state.nomePortal;

    const svgHref = state.logoUrl?.trim() || images.faviconSvg;
    const pngHref = state.logoUrl?.trim() || images.faviconPng;

    const setLink = (rel: string, href: string, type: string, key: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[data-cj-favicon="${key}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        link.dataset.cjFavicon = key;
        document.head.appendChild(link);
      }
      link.type = type;
      link.href = href;
    };

    if (state.logoUrl?.trim()) {
      const href = state.logoUrl.trim();
      setLink('icon', href, href.endsWith('.svg') ? 'image/svg+xml' : 'image/png', 'brand');
      document.querySelector('link[data-cj-favicon="png"]')?.remove();
      document.querySelector('link[data-cj-favicon="svg"]')?.remove();
    } else {
      document.querySelector('link[data-cj-favicon="brand"]')?.remove();
      setLink('icon', svgHref, 'image/svg+xml', 'svg');
      setLink('icon', pngHref, 'image/png', 'png');
    }
    setLink('apple-touch-icon', pngHref, 'image/png', 'apple');
  }, [state.nomePortal, state.logoUrl, state.loading]);

  const value = useMemo(() => state, [state]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding(): BrandingState {
  return useContext(BrandingContext);
}
