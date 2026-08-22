/** Slug ASCII para URLs (espelha regra do backend). */
export function slugify(text: string): string {
  const map: Record<string, string> = {
    á: 'a', à: 'a', ã: 'a', â: 'a', ä: 'a',
    é: 'e', è: 'e', ê: 'e', ë: 'e',
    í: 'i', ì: 'i', î: 'i', ï: 'i',
    ó: 'o', ò: 'o', õ: 'o', ô: 'o', ö: 'o',
    ú: 'u', ù: 'u', û: 'u', ü: 'u',
    ç: 'c', ñ: 'n',
  };
  let s = text.trim().toLowerCase();
  s = s.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñ]/g, (ch) => map[ch] || ch);
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s || 'artigo';
}
