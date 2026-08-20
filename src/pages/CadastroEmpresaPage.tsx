import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';

export function CadastroEmpresaPage() {
  const [ok, setOk] = useState(false);
  const [okMessage, setOkMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    password: '',
    whatsapp: '',
    contatoNome: '',
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.registerEmpresa(form);
      setOkMessage(
        res.message ||
          'Cadastro concluído! CNPJ validado — sua empresa já está aprovada para publicar vagas.',
      );
      setOk(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <Layout>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Cadastro concluído!</h1>
          <p className="mt-4 text-muted">{okMessage}</p>
          <Link to="/login" className="btn-primary mt-8 inline-flex">
            Fazer login
          </Link>
          <Link to="/" className="btn-ghost mt-4 inline-flex text-sm">
            Voltar ao início
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold">Cadastrar empresa parceira</h1>
        <p className="mt-2 text-sm text-muted">
          Empresas com CNPJ válido são aprovadas automaticamente e já podem publicar vagas após o cadastro.
        </p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <input className="input" placeholder="CNPJ (somente números)" value={form.cnpj} onChange={(e) => set('cnpj', e.target.value)} required />
          <input className="input" placeholder="Razão social" value={form.razaoSocial} onChange={(e) => set('razaoSocial', e.target.value)} required />
          <input className="input" placeholder="Nome fantasia" value={form.nomeFantasia} onChange={(e) => set('nomeFantasia', e.target.value)} />
          <input className="input" placeholder="Nome do contato" value={form.contatoNome} onChange={(e) => set('contatoNome', e.target.value)} />
          <input className="input" type="email" placeholder="E-mail de acesso" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          <input className="input" type="password" placeholder="Senha" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          <input className="input" placeholder="WhatsApp comercial" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Enviando…' : 'Cadastrar empresa'}</button>
        </form>
      </div>
    </Layout>
  );
}
