const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '/api/v1';

export function getApiBaseUrl() {
  return API;
}

export type Vaga = {
  id: number;
  slug: string;
  titulo: string;
  tipoVaga: string;
  descricao: string;
  requisitos?: string;
  cidadeId?: number | null;
  cidadeNome?: string;
  bairro?: string;
  uf?: string;
  modalidade?: string;
  empresaId?: number;
  empresaNome?: string;
  status?: string;
  publicadaEm?: string;
  viewsCount?: number;
};

export type Empresa = {
  id: number;
  nomeFantasia: string;
  razaoSocial?: string;
  cidadeId?: number | null;
  cidadeNome?: string;
  uf?: string;
};

export type Cidade = { id: number; nome: string };

export type UserEmpresa = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  empresaId: number;
  status: 'pendente' | 'aprovada' | 'bloqueada' | string;
};

export type UserCandidato = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  candidatoId: number;
  tipo: string;
};

export type CandidatoPerfil = {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  resumo: string;
  cidadeId?: number | null;
  bairro?: string;
  uf?: string;
  disponibilidade: string;
  tipo: string;
  habilidades: string[];
};

export type Candidatura = {
  id: number;
  vagaId: number;
  vagaTitulo: string;
  vagaSlug: string;
  tipoVaga: string;
  empresaNome: string;
  status: string;
  mensagemCandidato?: string;
  createdAt: string;
};

export type Notificacao = {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  link?: string | null;
  lida: boolean;
  createdAt: string;
};

export type AuthRole = 'candidato' | 'empresa';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch (err) {
    const isDev = import.meta.env.DEV;
    if (isDev) {
      throw new Error(
        'Não foi possível conectar à API. Verifique se o Apache (XAMPP) está rodando e use npm run dev.',
      );
    }
    console.error('API fetch failed:', `${API}${path}`, err);
    throw new Error(
      'Não foi possível conectar à API. Verifique CONECT_CORS_ORIGINS no painel e se o backend foi publicado.',
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Erro na requisição (${res.status})`);
  }
  return data as T;
}

async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  if (!token) throw new Error('Sessão expirada. Faça login novamente.');
  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

export const api = {
  branding: () =>
    request<{
      branding: {
        nomePortal: string;
        textoInstitucional?: string;
        heroImageUrl?: string | null;
        logoUrl?: string | null;
      };
      sqlOk?: boolean;
    }>('/conect/public/branding'),
  vagas: (params: Record<string, string | number | undefined> = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') q.set(k, String(v));
    });
    const qs = q.toString();
    return request<{ items: Vaga[]; sqlOk?: boolean }>(`/conect/public/vagas${qs ? `?${qs}` : ''}`);
  },
  vaga: (slug: string) => request<{ vaga: Vaga }>(`/conect/public/vagas/${encodeURIComponent(slug)}`),
  empresas: (cidade?: number) => {
    const qs = cidade ? `?cidade=${cidade}` : '';
    return request<{ items: Empresa[] }>(`/conect/public/empresas${qs}`);
  },
  cidades: () => request<{ items: Cidade[] }>('/conect/public/cidades'),
  loginCandidato: (email: string, password: string) =>
    request<{ user: unknown; tokens: { accessToken: string } }>('/conect/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerCandidato: (payload: Record<string, unknown>) =>
    request<{ user: unknown; tokens: { accessToken: string } }>('/conect/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  loginEmpresa: (email: string, password: string) =>
    request<{ user: UserEmpresa; tokens: { accessToken: string } }>('/conect-empresa/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  registerEmpresa: (payload: Record<string, unknown>) =>
    request<{ message?: string }>('/conect-empresa/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  meEmpresa: () => authRequest<{ user: UserEmpresa }>('/conect-empresa/me'),
  meCandidato: () =>
    authRequest<{ user: UserCandidato; candidato: CandidatoPerfil }>('/conect/me'),
  atualizarPerfilCandidato: (payload: Record<string, unknown>) =>
    authRequest<{ message?: string; candidato: CandidatoPerfil }>('/conect/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  candidaturas: () => authRequest<{ items: Candidatura[] }>('/conect/candidaturas'),
  candidatar: (vagaId: number, mensagem?: string) =>
    authRequest<{ message?: string; candidatura?: Candidatura }>('/conect/candidaturas', {
      method: 'POST',
      body: JSON.stringify({ vagaId, mensagem }),
    }),
  notificacoes: () => authRequest<{ items: Notificacao[] }>('/conect/notificacoes'),
  marcarNotificacaoLida: (id: number) =>
    authRequest<{ message?: string }>(`/conect/notificacoes/${id}/lida`, { method: 'POST' }),
  empresaVagas: () => authRequest<{ items: Vaga[]; sqlOk?: boolean }>('/conect-empresa/vagas'),
  criarVaga: (payload: Record<string, unknown>) =>
    authRequest<{ message?: string; vaga?: Vaga }>('/conect-empresa/vagas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export function saveSession(token: string, role: AuthRole) {
  localStorage.setItem('cj_token', token);
  localStorage.setItem('cj_role', role);
}

export function saveToken(token: string) {
  localStorage.setItem('cj_token', token);
}

export function getToken() {
  return localStorage.getItem('cj_token');
}

export function getRole(): AuthRole | null {
  const role = localStorage.getItem('cj_role');
  return role === 'candidato' || role === 'empresa' ? role : null;
}

export function clearSession() {
  localStorage.removeItem('cj_token');
  localStorage.removeItem('cj_role');
}

export function clearToken() {
  clearSession();
}
