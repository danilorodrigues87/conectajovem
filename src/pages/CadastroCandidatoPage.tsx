import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, saveSession } from '../lib/api';
import { IDADE_MENOR, maxDateNascimento, validarNascimento } from '../lib/idade';

export function CadastroCandidatoPage() {
  const nav = useNavigate();
  const maxNasc = useMemo(() => maxDateNascimento(), []);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    whatsapp: '',
    resumo: '',
    nascimento: '',
    responsavelNome: '',
    responsavelConsentimento: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const idadePreview = form.nascimento ? validarNascimento(form.nascimento).idade : undefined;
  const exigeResponsavel = typeof idadePreview === 'number' && idadePreview < IDADE_MENOR;

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const val = validarNascimento(form.nascimento);
    if (!val.ok) {
      setError(val.erro || 'Data inválida.');
      setLoading(false);
      return;
    }
    if (exigeResponsavel) {
      if (form.responsavelNome.trim().length < 3) {
        setError('Informe o nome completo do responsável legal.');
        setLoading(false);
        return;
      }
      if (!form.responsavelConsentimento) {
        setError('Confirme o consentimento do responsável legal.');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await api.registerCandidato({
        nome: form.nome,
        email: form.email,
        password: form.password,
        whatsapp: form.whatsapp,
        resumo: form.resumo,
        nascimento: form.nascimento,
        responsavelNome: exigeResponsavel ? form.responsavelNome : undefined,
        responsavelConsentimento: exigeResponsavel ? true : undefined,
      });
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
        <p className="mt-2 text-muted">Cadastro gratuito. Participação a partir de 12 anos.</p>
        <form onSubmit={onSubmit} className="card mt-6 space-y-4">
          <input className="input" placeholder="Nome completo" value={form.nome} onChange={(e) => set('nome', e.target.value)} required />
          <div>
            <label className="mb-1 block text-sm font-medium">Data de nascimento *</label>
            <input
              className="input"
              type="date"
              max={maxNasc}
              value={form.nascimento}
              onChange={(e) => set('nascimento', e.target.value)}
              required
            />
          </div>
          {exigeResponsavel && (
            <div className="space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-sm text-subtle">Como você tem menos de 18 anos, informe o responsável legal.</p>
              <input
                className="input"
                placeholder="Nome completo do responsável"
                value={form.responsavelNome}
                onChange={(e) => set('responsavelNome', e.target.value)}
                required
              />
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={form.responsavelConsentimento}
                  onChange={(e) => set('responsavelConsentimento', e.target.checked)}
                  required
                />
                <span>Declaro ser o responsável legal ou possuir autorização para este cadastro.</span>
              </label>
            </div>
          )}
          <input className="input" type="email" placeholder="E-mail" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          <input className="input" type="password" placeholder="Senha (mín. 6)" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
          <input className="input" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} />
          <textarea className="input min-h-[90px]" placeholder="Resumo / objetivo profissional" value={form.resumo} onChange={(e) => set('resumo', e.target.value)} />
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <p className="text-xs text-faint">
            Ao cadastrar, você concorda com os{' '}
            <Link to="/termos" className="text-brand-accent hover:underline">Termos de Uso</Link>
            {' '}e a{' '}
            <Link to="/privacidade" className="text-brand-accent hover:underline">Política de Privacidade</Link>.
          </p>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Cadastrando…' : 'Criar conta'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-subtle">
          Já tem conta? <Link to="/login" className="text-brand-accent">Entrar</Link>
        </p>
      </div>
    </Layout>
  );
}
