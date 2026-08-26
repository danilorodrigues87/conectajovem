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
  empresaLogoUrl?: string | null;
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
  logoUrl?: string | null;
  redesSociais?: RedesSociais;
};

export type RedesSociais = {
  linkedin: string;
  instagram: string;
  github: string;
  portfolio: string;
  facebook: string;
  tiktok: string;
};

export type Cidade = { id: number; nome: string };

export type Estado = { id: number; nome: string; uf: string };

export type UserEmpresa = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  empresaId: number;
  status: 'pendente' | 'aprovada' | 'bloqueada' | string;
};

export type EmpresaPerfil = {
  id: number;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  whatsapp: string;
  email: string;
  contatoNome: string;
  cidadeId?: number | null;
  cidadeNome?: string;
  estadoId?: number | null;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  uf?: string;
  endereco?: string;
  status: string;
  logoUrl?: string | null;
  redesSociais?: RedesSociais;
};

export type CandidaturaEmpresa = Candidatura & {
  candidatoId: number;
  candidatoNome: string;
  candidatoEmail?: string;
  candidatoWhatsapp?: string;
  candidatoResumo?: string;
  candidatoDisponibilidade?: string;
  candidatoTipo?: string;
  candidatoIdade?: number | null;
  candidatoIsMenor?: boolean;
  mensagemEmpresa?: string;
};

export type UserCandidato = {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  candidatoId: number;
  tipo: string;
};

export type FormacaoAcademica = {
  id: string;
  tipo: 'graduacao' | 'pos' | 'tecnico' | 'outro';
  curso: string;
  instituicao: string;
  anoConclusao?: number | null;
};

export type ExperienciaProfissional = {
  id: string;
  empresa: string;
  cargo: string;
  inicio?: string | null;
  fim?: string | null;
  atual?: boolean;
  descricao?: string;
};

export type CandidatoPerfil = {
  id: number;
  nome: string;
  email: string;
  whatsapp: string;
  resumo: string;
  idade?: number | null;
  isMenor?: boolean;
  temNascimento?: boolean;
  nascimento?: string | null;
  responsavelNome?: string | null;
  responsavelConsentimento?: boolean;
  cidadeId?: number | null;
  cidadeNome?: string;
  estadoId?: number | null;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  uf?: string;
  endereco?: string;
  disponibilidade: string;
  tipo: string;
  fotoUrl?: string | null;
  habilidades: string[];
  formacao: FormacaoCandidato[];
  formacaoAcademica?: FormacaoAcademica[];
  experiencias?: ExperienciaProfissional[];
  temSeloCertificado: boolean;
  redesSociais?: RedesSociais;
};

export type FormacaoCandidato = {
  id: number;
  titulo: string;
  origem: string;
  status: string;
  cargaH?: number | null;
  seloCertificado: boolean;
  concluidoEm?: string;
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

export type BlogPostResumo = {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  capaUrl?: string | null;
  categoriaNome?: string;
  categoriaSlug?: string;
  autorNome?: string;
  publicadoEm?: string;
  comentariosCount?: number;
};

export type BlogPost = BlogPostResumo & {
  corpoHtml: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogComentario = {
  id: number;
  texto: string;
  nomeExibicao: string;
  tipoAutor: 'candidato' | 'empresa' | string;
  avatarUrl?: string | null;
  createdAt: string;
  usuarioId?: number;
};

export type Depoimento = {
  id: number;
  texto: string;
  nome: string;
  cargo: string;
  tipoAutor?: string;
  avatarUrl?: string | null;
};

export type AnuncioSlot =
  | 'footer_carousel'
  | 'home_mid'
  | 'vagas_sidebar'
  | 'blog_sidebar'
  | 'blog_artigo_fim';

export type AnuncioPublico = {
  id: number;
  titulo: string;
  nomeAnunciante: string;
  imagemUrl?: string | null;
  imagemMobileUrl?: string | null;
  linkTipo: string;
  linkDestino: string;
  slot: string;
};

export type AnuncioEmpresa = {
  id: number;
  titulo: string;
  nomeAnunciante: string;
  imagemUrl?: string | null;
  linkTipo: string;
  linkDestino: string;
  whatsapp?: string;
  slot: string;
  slotLabel?: string;
  status: string;
  statusLabel?: string;
  impressoes?: number;
  cliques?: number;
  ctr?: number;
  motivoRejeicao?: string;
  inicioEm?: string | null;
  fimEm?: string | null;
};

export type AnuncioConfigEmpresa = {
  precoMinimoMensal: number;
  maxAnunciosPorEmpresa: number;
  slots: Record<string, string>;
  slotDimensoes?: Record<string, { sugestao: string; hint: string }>;
  usados: number;
  requerAprovacaoMaster?: boolean;
  assinatura?: AnuncioAssinaturaResumo;
};

export type AnuncioPlano = {
  id: number;
  slug: string;
  nome: string;
  descricao: string;
  maxAnuncios: number;
  valorMensal: number;
};

export type AnuncioFatura = {
  id: number;
  competencia: string;
  valor: number;
  vencimento: string;
  status: string;
  pixCopiaCola?: string;
  pixQrBase64?: string;
  pagoEm?: string | null;
};

export type AnuncioAssinaturaResumo = {
  moduloAtivo?: boolean;
  temAssinatura?: boolean;
  assinaturaAtiva?: boolean;
  assinatura?: {
    id: number;
    status: string;
    proximoVencimento?: string | null;
    plano?: AnuncioPlano | null;
  } | null;
  faturaAberta?: AnuncioFatura | null;
  limiteAnuncios?: number;
  usados?: number;
  podeCriar?: boolean;
  mpConfigurado?: boolean;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    const isForm = options.body instanceof FormData;
    res = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
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
  const raw = await res.text();
  let data: Record<string, unknown> = {};
  if (raw.trim()) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      if (raw.includes('<!doctype') || raw.includes('<html')) {
        throw new Error(
          res.status === 404
            ? 'Recurso não encontrado na API. Publique a versão mais recente do painel-cti.'
            : 'Resposta inválida do servidor. Verifique se a API está atualizada.',
        );
      }
      throw new Error(`Resposta inválida do servidor (${res.status}).`);
    }
  }
  if (!res.ok) {
    throw new Error((data.message as string) || `Erro na requisição (${res.status})`);
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

async function authFormRequest<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  return authRequest<T>(path, { method, body: formData });
}

export const api = {
  branding: () =>
    request<{
      branding: {
        nomePortal: string;
        textoInstitucional?: string;
        heroImageUrl?: string | null;
        logoUrl?: string | null;
        redesSociais?: Partial<import('./social').RedesSociais>;
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
  empresas: (params: { q?: string; cidade?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    if (params.cidade) q.set('cidade', String(params.cidade));
    const qs = q.toString();
    return request<{ items: Empresa[] }>(`/conect/public/empresas${qs ? `?${qs}` : ''}`);
  },
  cidades: () => request<{ items: Cidade[] }>('/conect/public/cidades'),
  estados: () => request<{ items: Estado[] }>('/conect/public/estados'),
  cidadesPorEstado: (estadoId: number) =>
    request<{ items: Cidade[] }>(`/conect/public/estados/${estadoId}/cidades`),
  enviarContato: (payload: {
    nome: string;
    email: string;
    whatsapp?: string;
    assunto?: string;
    mensagem: string;
    website?: string;
  }) =>
    request<{ message?: string }>('/conect/public/contato', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
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
  meEmpresa: () =>
    authRequest<{ user: UserEmpresa; empresa: EmpresaPerfil }>('/conect-empresa/me'),
  atualizarPerfilEmpresa: (payload: Record<string, unknown>) =>
    authRequest<{ message?: string; user: UserEmpresa; empresa: EmpresaPerfil }>('/conect-empresa/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  uploadLogoEmpresa: (file?: File, restaurar?: boolean) => {
    const fd = new FormData();
    if (file) fd.append('logo', file);
    if (restaurar) fd.append('restaurar', '1');
    return authFormRequest<{ message?: string; empresa: EmpresaPerfil }>('/conect-empresa/logo', fd);
  },
  meCandidato: () =>
    authRequest<{ user: UserCandidato; candidato: CandidatoPerfil }>('/conect/me'),
  atualizarPerfilCandidato: (payload: Record<string, unknown>) =>
    authRequest<{ message?: string; sqlAviso?: string; candidato: CandidatoPerfil }>('/conect/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  uploadFotoCandidato: (file?: File, opts?: { usarPortal?: boolean; restaurar?: boolean }) => {
    const fd = new FormData();
    if (file) fd.append('foto', file);
    if (opts?.usarPortal) fd.append('usarPortal', '1');
    if (opts?.restaurar) fd.append('restaurar', '1');
    return authFormRequest<{ message?: string; candidato: CandidatoPerfil }>('/conect/me/foto', fd);
  },
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
  atualizarVaga: (id: number, payload: Record<string, unknown>) =>
    authRequest<{ message?: string; vaga?: Vaga }>(`/conect-empresa/vagas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  vagaAcao: (id: number, acao: 'pausar' | 'retomar' | 'encerrar' | 'moderacao') =>
    authRequest<{ message?: string; vaga?: Vaga }>(`/conect-empresa/vagas/${id}/acao`, {
      method: 'POST',
      body: JSON.stringify({ acao }),
    }),
  empresaCandidaturas: (params: { vagaId?: number; status?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.vagaId) q.set('vagaId', String(params.vagaId));
    if (params.status) q.set('status', params.status);
    const qs = q.toString();
    return authRequest<{ items: CandidaturaEmpresa[] }>(
      `/conect-empresa/candidaturas${qs ? `?${qs}` : ''}`,
    );
  },
  empresaCandidaturaDetalhe: (id: number) =>
    authRequest<{ candidatura: CandidaturaEmpresa; candidato: CandidatoPerfil | null }>(
      `/conect-empresa/candidaturas/${id}`,
    ),
  atualizarCandidaturaEmpresa: (
    id: number,
    payload: { status: string; mensagemEmpresa?: string },
  ) =>
    authRequest<{ message?: string; candidatura?: CandidaturaEmpresa }>(
      `/conect-empresa/candidaturas/${id}`,
      { method: 'PUT', body: JSON.stringify(payload) },
    ),
  empresaTalentos: (params: { q?: string; habilidade?: string; cidadeId?: number; uf?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    if (params.habilidade) q.set('habilidade', params.habilidade);
    if (params.cidadeId) q.set('cidadeId', String(params.cidadeId));
    if (params.uf) q.set('uf', params.uf);
    const qs = q.toString();
    return authRequest<{ items: CandidatoPerfil[] }>(`/conect-empresa/talentos${qs ? `?${qs}` : ''}`);
  },
  blogPosts: (params: { q?: string; categoria?: string; limit?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.q) q.set('q', params.q);
    if (params.categoria) q.set('categoria', params.categoria);
    if (params.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return request<{ items: BlogPostResumo[]; sqlOk?: boolean }>(
      `/conect/public/blog/posts${qs ? `?${qs}` : ''}`,
    );
  },
  blogPost: (slug: string) =>
    request<{ post: BlogPost; sqlOk?: boolean }>(`/conect/public/blog/posts/${encodeURIComponent(slug)}`),
  blogComentarios: (slug: string) =>
    request<{ items: BlogComentario[]; total?: number }>(
      `/conect/public/blog/posts/${encodeURIComponent(slug)}/comentarios`,
    ),
  criarBlogComentario: (slug: string, texto: string) =>
    authRequest<{ message?: string; comentario?: BlogComentario }>(
      `/conect/blog/posts/${encodeURIComponent(slug)}/comentarios`,
      { method: 'POST', body: JSON.stringify({ texto }) },
    ),
  excluirBlogComentario: (id: number) =>
    authRequest<{ message?: string }>(`/conect/blog/comentarios/${id}`, { method: 'DELETE' }),
  depoimentos: () =>
    request<{ items: Depoimento[]; sqlOk?: boolean }>('/conect/public/depoimentos'),
  anunciosPublicos: (params: { slot: AnuncioSlot; uf?: string; cidadeId?: number; limit?: number }) => {
    const q = new URLSearchParams();
    q.set('slot', params.slot);
    if (params.uf) q.set('uf', params.uf);
    if (params.cidadeId) q.set('cidadeId', String(params.cidadeId));
    if (params.limit) q.set('limit', String(params.limit));
    return request<{ items: AnuncioPublico[]; sqlOk?: boolean }>(`/conect/public/anuncios?${q.toString()}`);
  },
  anunciosConfigPublico: () =>
    request<{ precoMinimoMensal: number; slotsHabilitados: string[]; slots: Record<string, string> }>(
      '/conect/public/anuncios/config',
    ),
  registrarEventoAnuncio: (
    id: number,
    tipo: 'impressao' | 'clique',
    slot: string,
    geo?: { uf?: string; cidadeId?: number },
  ) => {
    const visitorId = (() => {
      try {
        let v = localStorage.getItem('cj_visitor_id');
        if (!v) {
          v = crypto.randomUUID();
          localStorage.setItem('cj_visitor_id', v);
        }
        return v;
      } catch {
        return crypto.randomUUID();
      }
    })();
    const body = new URLSearchParams({
      tipo,
      visitorId,
      slot,
    });
    if (geo?.uf) body.set('uf', geo.uf);
    if (geo?.cidadeId) body.set('cidadeId', String(geo.cidadeId));
    return fetch(`${API}/conect/public/anuncios/${id}/evento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      keepalive: true,
    }).then(async (res) => {
      if (!res.ok) throw new Error('Falha ao registrar evento');
      return res.json() as Promise<{ ok?: boolean }>;
    });
  },
  empresaAnunciosConfig: () => authRequest<AnuncioConfigEmpresa>('/conect-empresa/anuncios/config'),
  empresaAnuncios: () => authRequest<{ items: AnuncioEmpresa[]; sqlOk?: boolean }>('/conect-empresa/anuncios'),
  criarAnuncioEmpresa: (fd: FormData) =>
    authFormRequest<{ message?: string; anuncio?: AnuncioEmpresa }>('/conect-empresa/anuncios', fd),
  atualizarAnuncioEmpresa: (id: number, fd: FormData) =>
    authFormRequest<{ message?: string; anuncio?: AnuncioEmpresa }>(`/conect-empresa/anuncios/${id}`, fd),
  excluirAnuncioEmpresa: (id: number) =>
    authRequest<{ message?: string }>(`/conect-empresa/anuncios/${id}`, { method: 'DELETE' }),
  anuncioPlanos: () =>
    authRequest<{ items: AnuncioPlano[]; moduloAtivo?: boolean }>('/conect-empresa/anuncios/planos'),
  anuncioAssinaturaResumo: () => authRequest<AnuncioAssinaturaResumo>('/conect-empresa/anuncios/assinatura'),
  assinarAnuncioPlano: (planId: number) =>
    authRequest<{ ok?: boolean; message?: string; fatura?: AnuncioFatura }>('/conect-empresa/anuncios/assinatura', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    }),
  cancelarAnuncioAssinatura: () =>
    authRequest<{ ok?: boolean; message?: string }>('/conect-empresa/anuncios/assinatura/cancelar', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  verificarAnuncioAssinatura: (faturaId: number) =>
    authRequest<{ ok?: boolean; pago?: boolean; message?: string }>(
      '/conect-empresa/anuncios/assinatura/verificar',
      { method: 'POST', body: JSON.stringify({ faturaId }) },
    ),
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
