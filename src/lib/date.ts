/** Converte "2026-08-21 14:30:00" ou ISO em Date válido. */
function parseApiDate(value?: string | null): Date | null {
  if (!value || !String(value).trim()) return null;
  const raw = String(value).trim();
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Ex.: 21/08/2026 */
export function formatDateBr(value?: string | null): string {
  const d = parseApiDate(value);
  if (!d) return value ? String(value) : '';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Ex.: 21/08/2026 às 14:30 */
export function formatDateTimeBr(value?: string | null): string {
  const d = parseApiDate(value);
  if (!d) return value ? String(value) : '';
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${date} às ${time}`;
}

/**
 * Conclusão de formação/selo: aceita ISO (`2025-08-01`) ou texto livre
 * vindo do certificado da escola (`Agosto de 2025`, `Janeiro de 2026`).
 */
export function formatConclusaoEm(value?: string | null): string {
  if (!value || !String(value).trim()) return '';
  const raw = String(value).trim();
  const d = parseApiDate(raw);
  if (d) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  return raw;
}
