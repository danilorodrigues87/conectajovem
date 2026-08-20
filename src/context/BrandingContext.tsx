import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../lib/api';
import { images } from '../config/images';
import { site } from '../config/site';

export type BrandingState = {
  nomePortal: string;
  textoInstitucional: string;
  heroImageUrl: string;
  logoUrl: string | null;
  loading: boolean;
};

const defaults: BrandingState = {
  nomePortal: site.name,
  textoInstitucional: site.about,
  heroImageUrl: images.hero,
  logoUrl: null,
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
  }, [state.nomePortal, state.loading]);

  useEffect(() => {
    if (state.loading || !state.logoUrl) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = state.logoUrl;
  }, [state.logoUrl, state.loading]);

  const value = useMemo(() => state, [state]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding(): BrandingState {
  return useContext(BrandingContext);
}
