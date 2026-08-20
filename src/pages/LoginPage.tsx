import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, saveSession } from '../lib/api';

export function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [tipo, setTipo] = useState<'candidato' | 'empresa'>('candidato');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = tipo === 'candidato' ? api.loginCandidato : api.loginEmpresa;
      const res = await fn(email, password);
      saveSession(res.tokens.accessToken, tipo);
      if (from && tipo === 'candidato') {
        nav(from);
      } else {
        nav(tipo === 'candidato' ? '/candidato' : '/empresa');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm ${tipo === 'candidato' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTipo('candidato')}
          >
            Candidato
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm ${tipo === 'empresa' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTipo('empresa')}
          >
            Empresa
          </button>
        </div>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <input className="input" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-subtle">
          Não tem conta? <Link to="/cadastro" className="text-brand-accent">Cadastre-se</Link>
        </p>
      </div>
    </Layout>
  );
}
