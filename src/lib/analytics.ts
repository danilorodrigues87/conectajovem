import { getApiBaseUrl } from './api';

const VISITOR_STORAGE_KEY = 'cj_visitor_id';

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function postEvent(payload: Record<string, string>) {
  const body = new URLSearchParams(payload);
  fetch(`${getApiBaseUrl()}/conect/public/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    keepalive: true,
  }).catch(() => {});
}

export function trackPageview(path: string) {
  postEvent({
    tipo: 'pageview',
    visitorKey: getVisitorId(),
    path: path || '/',
    referrer: document.referrer || '',
  });
}

export function trackShare(
  plataforma: 'whatsapp' | 'facebook' | 'linkedin' | 'twitter' | 'copy',
  path: string,
  slug?: string,
  titulo?: string
) {
  const data: Record<string, string> = {
    tipo: 'share',
    plataforma,
    path: path || '/',
  };
  if (slug) data.slug = slug;
  if (titulo) data.titulo = titulo;
  postEvent(data);
}
