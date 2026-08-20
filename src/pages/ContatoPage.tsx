import { FormEvent, useState } from 'react';
import { Layout } from '../components/Layout';
import { contactMailtoUrl, contactWhatsAppUrl, site } from '../config/site';
import { useBranding } from '../hooks/useBranding';

export function ContatoPage() {
  const { nomePortal } = useBranding();
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const assunto = form.assunto.trim() || `Contato — ${nomePortal}`;
    const body = [
      `Nome: ${form.nome.trim()}`,
      `E-mail: ${form.email.trim()}`,
      '',
      form.mensagem.trim(),
    ].join('\n');
    window.location.href = contactMailtoUrl(assunto, body);
    setEnviado(true);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="badge mb-3">Fale conosco</p>
        <h1 className="text-3xl font-bold">Contato</h1>
        <p className="mt-4 text-lg text-muted">
          Dúvidas sobre vagas, cadastro de empresa ou parcerias com escolas? Entre em contato com a equipe do{' '}
          {site.contact.orgName}, responsável pela operação do {nomePortal}.
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
              <a
                href={site.contact.orgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                {site.contact.orgName}
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="glass-card space-y-4">
            <h2 className="text-lg font-semibold">Enviar mensagem</h2>
            <p className="text-sm text-muted">
              Ao enviar, seu aplicativo de e-mail será aberto com a mensagem endereçada para{' '}
              <strong className="font-medium text-[var(--cj-text)]">{site.contact.email}</strong>.
            </p>
            <input
              className="input"
              placeholder="Seu nome"
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              required
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
              placeholder="Assunto"
              value={form.assunto}
              onChange={(e) => setForm((f) => ({ ...f, assunto: e.target.value }))}
            />
            <textarea
              className="input min-h-[120px] resize-y"
              placeholder="Sua mensagem"
              value={form.mensagem}
              onChange={(e) => setForm((f) => ({ ...f, mensagem: e.target.value }))}
              required
            />
            <button type="submit" className="btn-primary w-full sm:w-auto">
              Enviar e-mail
            </button>
            {enviado && (
              <p className="text-sm text-emerald-400">
                Se o e-mail não abriu automaticamente, escreva para {site.contact.email}.
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
