import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';

export function CodigoSegurancaPage() {
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const tipo: 'candidato' | 'empresa' = tipoParam === 'empresa' ? 'empresa' : 'candidato';
  const stateMsg = (location.state as { message?: string; email?: string } | null)?.message;
  const [codigo, setCodigo] = useState('');
  const [nova, setNova] = useState('');
  const [confirma, setConfirma] = useState('');
  const [info] = useState(stateMsg || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(codigo.trim())) {
      setError('Informe o código de 6 dígitos recebido por e-mail.');
      return;
    }
    if (nova.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (nova !== confirma) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const fn = tipo === 'candidato' ? api.redefinirSenhaCandidato : api.redefinirSenhaEmpresa;
      const res = await fn({
        code: codigo.trim(),
        newPassword: nova,
        confirmPassword: confirma,
      });
      nav('/login', { state: { senhaOk: res.message } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar código');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Código de segurança</h1>
        <p className="mt-3 text-sm text-subtle">
          Informe o código recebido no e-mail e escolha uma nova senha
          {tipo === 'empresa' ? ' da empresa parceira' : ''}.
        </p>
        {info && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{info}</p>}
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Código de 6 dígitos</label>
            <input
              className="input mt-1 text-center text-xl tracking-widest"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
          <input
            className="input"
            type="password"
            placeholder="Nova senha"
            autoComplete="new-password"
            minLength={6}
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Confirmar nova senha"
            autoComplete="new-password"
            minLength={6}
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/esqueci-senha" className="text-sm text-subtle hover:text-brand-accent">
              Solicitar novo código
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Validando…' : 'Redefinir senha'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-subtle">
          <Link to="/login" className="text-brand-accent">Voltar para login</Link>
        </p>
      </div>
    </Layout>
  );
}
