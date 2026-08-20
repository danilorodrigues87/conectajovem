import type { CandidatoPerfil, FormacaoAcademica, ExperienciaProfissional } from './api';

export const TIPO_FORMACAO_LABEL: Record<string, string> = {
  graduacao: 'Graduação',
  pos: 'Pós-graduação',
  tecnico: 'Curso técnico',
  outro: 'Formação',
};

export const DISPONIBILIDADE_LABEL: Record<string, string> = {
  imediata: 'Imediata',
  '15_dias': 'Em até 15 dias',
  '30_dias': 'Em até 30 dias',
  a_combinar: 'A combinar',
};

export function formatMesAno(valor?: string | null): string {
  if (!valor) return '';
  const m = valor.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const idx = Number(m[2]) - 1;
    return `${meses[idx] || m[2]}/${m[1]}`;
  }
  return valor;
}

export function formatPeriodoExp(exp: ExperienciaProfissional): string {
  const ini = formatMesAno(exp.inicio);
  const fim = exp.atual ? 'atual' : formatMesAno(exp.fim);
  if (!ini && !fim) return '';
  if (!fim) return `desde ${ini}`;
  return `${ini} até ${fim}`;
}

export function linhaFormacaoAcademica(item: FormacaoAcademica): string {
  const tipo = TIPO_FORMACAO_LABEL[item.tipo] || 'Formação';
  const curso = item.curso?.trim() || '';
  const inst = item.instituicao?.trim() || '';
  const ano = item.anoConclusao ? String(item.anoConclusao) : '';
  let texto = tipo;
  if (curso) texto += ` em ${curso}`;
  if (inst) texto += ` — ${inst}`;
  if (ano) texto += ` (${ano})`;
  return texto;
}

export function agruparFormacaoAcademica(items: FormacaoAcademica[]) {
  const ordem = ['graduacao', 'pos', 'tecnico', 'outro'] as const;
  const map = new Map<string, FormacaoAcademica[]>();
  for (const item of items) {
    const k = item.tipo || 'outro';
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(item);
  }
  return ordem.filter((k) => map.has(k)).map((k) => ({ tipo: k, label: TIPO_FORMACAO_LABEL[k], items: map.get(k)! }));
}

export function newFormacaoAcademica(): FormacaoAcademica {
  return { id: crypto.randomUUID(), tipo: 'graduacao', curso: '', instituicao: '', anoConclusao: null };
}

export function newExperiencia(): ExperienciaProfissional {
  return { id: crypto.randomUUID(), empresa: '', cargo: '', inicio: '', fim: null, atual: false, descricao: '' };
}

export function slugArquivo(nome: string): string {
  return (nome || 'curriculo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export function whatsappLink(phone?: string): string | null {
  const n = (phone || '').replace(/\D/g, '');
  if (n.length < 10) return null;
  return `https://wa.me/55${n}`;
}

export type CurriculoSections = {
  perfil: CandidatoPerfil;
  showActions?: boolean;
  onClose?: () => void;
};
