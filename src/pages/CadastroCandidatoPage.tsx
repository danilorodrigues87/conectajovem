import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, saveSession } from '../lib/api';

export function CadastroCandidatoPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', password: '', whatsapp: '', resumo: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerCandidato(form);
      saveSession(res.tokens.accessToken, 'candidato');
      nav('/candidato');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold">Criar perfil de candidato</h1>
        <p className="mt-2 text-muted">Cadastro gratuito. Seu perfil pode ser vinculado a uma escola parceira da sua região.</p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <input className="input" placeholder="Nome completo" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          <input className="input" type="email" placeholder="E-mail" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          <input className="input" type="password" placeholder="Senha (mín. 6)" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          <input className="input" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          <textarea className="input min-h-[90px]" placeholder="Resumo / objetivo profissional" value={form.resumo} onChange={(e) => set('resumo', e.target.value)} />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Cadastrando…' : 'Criar conta'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-subtle">
          Já tem conta? <Link to="/login" className="text-brand-accent">Entrar</Link>
        </p>
      </div>
    </Layout>
  );
}
