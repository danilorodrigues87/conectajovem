/** URL de arquivo em /public — respeita VITE_BASE_PATH (subpasta no XAMPP). */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${clean}`;
}

/** basename do React Router a partir do Vite base. */
export function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL ?? '/';
  if (base === '/' || base === '') return undefined;
  const trimmed = base.replace(/\/$/, '');
  return trimmed || undefined;
}
