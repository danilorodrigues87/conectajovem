import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { images } from '../config/images';
import { site } from '../config/site';

export type BrandingState = {
  nomePortal: string;
  textoInstitucional: string;
  heroImageUrl: string;
  loading: boolean;
};

export function useBranding(): BrandingState {
  const [state, setState] = useState<BrandingState>({
    nomePortal: site.name,
    textoInstitucional: site.about,
    heroImageUrl: images.hero,
    loading: true,
  });

  useEffect(() => {
    api
      .branding()
      .then((r) => {
        const b = r.branding;
        setState({
          nomePortal: b.nomePortal?.trim() || site.name,
          textoInstitucional: b.textoInstitucional?.trim() || site.about,
          heroImageUrl: b.heroImageUrl?.trim() || images.hero,
          loading: false,
        });
      })
      .catch(() => {
        setState({
          nomePortal: site.name,
          textoInstitucional: site.about,
          heroImageUrl: images.hero,
          loading: false,
        });
      });
  }, []);

  return state;
}
