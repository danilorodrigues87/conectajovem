export type RedesSociais = {
  linkedin: string;
  instagram: string;
  github: string;
  portfolio: string;
  facebook: string;
  tiktok: string;
};

export const EMPTY_REDES: RedesSociais = {
  linkedin: '',
  instagram: '',
  github: '',
  portfolio: '',
  facebook: '',
  tiktok: '',
};

export const REDES_LABELS: Record<keyof RedesSociais, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  github: 'GitHub',
  portfolio: 'Portfólio / site',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

export function hasRedesSociais(redes?: RedesSociais | null): boolean {
  if (!redes) return false;
  return Object.values(redes).some((v) => v.trim() !== '');
}

export function normalizeRedes(input?: Partial<RedesSociais> | null): RedesSociais {
  const out = { ...EMPTY_REDES };
  if (!input) return out;
  (Object.keys(out) as (keyof RedesSociais)[]).forEach((k) => {
    out[k] = (input[k] || '').trim();
  });
  return out;
}
