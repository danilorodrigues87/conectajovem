export const IDADE_MINIMA = 12;
export const IDADE_MENOR = 18;

export function maxDateNascimento(): string {
  const hoje = new Date();
  const max = new Date(hoje.getFullYear() - IDADE_MINIMA, hoje.getMonth(), hoje.getDate());
  return max.toISOString().slice(0, 10);
}

export function calcularIdade(nascimento: string): number | null {
  if (!nascimento || !/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) return null;
  const parts = nascimento.split('-').map((x) => parseInt(x, 10));
  const dn = new Date(parts[0], parts[1] - 1, parts[2]);
  if (Number.isNaN(dn.getTime())) return null;
  const hoje = new Date();
  let idade = hoje.getFullYear() - dn.getFullYear();
  const m = hoje.getMonth() - dn.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < dn.getDate())) idade--;
  return idade;
}

export function isMenor(idade: number | null | undefined): boolean {
  return typeof idade === 'number' && idade < IDADE_MENOR;
}

export function validarNascimento(nascimento: string): { ok: boolean; erro?: string; idade?: number } {
  if (!nascimento) {
    return { ok: false, erro: 'Informe sua data de nascimento.' };
  }
  const idade = calcularIdade(nascimento);
  if (idade === null) {
    return { ok: false, erro: 'Data de nascimento inválida.' };
  }
  if (idade < IDADE_MINIMA) {
    return {
      ok: false,
      erro: `É necessário ter pelo menos ${IDADE_MINIMA} anos para participar do Conecta Jovem.`,
      idade,
    };
  }
  return { ok: true, idade };
}

export function formatarIdade(idade?: number | null): string {
  if (idade == null || idade < 0) return '';
  return idade === 1 ? '1 ano' : `${idade} anos`;
}
