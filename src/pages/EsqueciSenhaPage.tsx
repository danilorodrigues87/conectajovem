import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';

export function EsqueciSenhaPage() {
  const nav = useNavigate();
  const [tipo, setTipo] = useState<'candidato' | 'empresa'>('candidato');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fn = tipo === 'candidato' ? api.recuperarSenhaCandidato : api.recuperarSenhaEmpresa;
      const res = await fn(email);
      nav(`/codigo-seguranca?tipo=${tipo}`, { state: { message: res.message, email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar código');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold">Recuperar senha</h1>
        <p className="mt-3 text-sm text-subtle">
          Informe o e-mail da sua conta. Enviaremos um código de 6 dígitos para redefinir a senha.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm ${tipo === 'candidato' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setTipo('candidato'); setError(''); }}
          >
            Candidato / Aluno
          </button>
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm ${tipo === 'empresa' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => { setTipo('empresa'); setError(''); }}
          >
            Empresa parceira
          </button>
        </div>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <input
            className="input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/login" className="text-sm text-subtle hover:text-brand-accent">
              Voltar para login
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar código'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
