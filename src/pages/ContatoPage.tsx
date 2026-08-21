import { FormEvent, useState } from 'react';
import { Layout } from '../components/Layout';
import { Toast } from '../components/Toast';
import { contactWhatsAppUrl, site } from '../config/site';
import { useBranding } from '../hooks/useBranding';
import { api } from '../lib/api';

export function ContatoPage() {
  const { nomePortal } = useBranding();
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '', assunto: '', mensagem: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const res = await api.enviarContato({
        nome: form.nome.trim(),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim() || undefined,
        assunto: form.assunto.trim() || undefined,
        mensagem: form.mensagem.trim(),
        website: form.website,
      });
      setToast({ message: res.message || 'Mensagem enviada com sucesso.', type: 'success' });
      setForm({ nome: '', email: '', whatsapp: '', assunto: '', mensagem: '', website: '' });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : 'Não foi possível enviar. Tente novamente.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="badge mb-3">Fale conosco</p>
        <h1 className="text-3xl font-bold">Contato</h1>
        <p className="mt-4 text-lg text-muted">
          Dúvidas sobre vagas, cadastro de empresa ou parcerias com escolas? Fale com a equipe do {nomePortal}.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="glass-card space-y-4">
            <h2 className="text-lg font-semibold">Canais diretos</h2>
            <div>
              <p className="text-sm font-medium text-subtle">E-mail</p>
              <a href={`mailto:${site.contact.email}`} className="text-brand-accent hover:underline">
                {site.contact.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-subtle">WhatsApp</p>
              <a
                href={contactWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                {site.contact.whatsappDisplay}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium text-subtle">Instituição</p>
              <p className="text-[var(--cj-text)]">{site.contact.orgName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-subtle">Endereço</p>
              <p className="text-muted">{site.contact.address}</p>
            </div>
          </div>

          <form onSubmit={(e) => void onSubmit(e)} className="glass-card space-y-4">
            <h2 className="text-lg font-semibold">Enviar mensagem</h2>
            <p className="text-sm text-muted">
              Responderemos pelo e-mail informado assim que possível.
            </p>
            <input
              className="input"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              required
              maxLength={120}
            />
            <input
              className="input"
              type="email"
              placeholder="Seu e-mail"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              className="input"
              placeholder="WhatsApp (opcional)"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              maxLength={20}
            />
            <input
              className="input"
              placeholder="Assunto"
              value={form.assunto}
              onChange={(e) => setForm((f) => ({ ...f, assunto: e.target.value }))}
              maxLength={200}
            />
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Sua mensagem"
              value={form.mensagem}
              onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
              required
              maxLength={5000}
            />
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
            />
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
