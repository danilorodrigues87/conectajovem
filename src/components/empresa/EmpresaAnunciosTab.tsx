import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type AnuncioConfigEmpresa, type AnuncioEmpresa } from '../../lib/api';

const STATUS_CLASS: Record<string, string> = {
  pendente: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  ativo: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  pausado: 'bg-white/10 text-white/60 border-white/15',
  rejeitado: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const emptyForm = {
  titulo: '',
  nomeAnunciante: '',
  slot: 'footer_carousel',
  linkTipo: 'url' as 'url' | 'instagram' | 'whatsapp',
  linkDestino: '',
  whatsapp: '',
};

type Props = {
  onFlash: (msg: string, isError?: boolean) => void;
};

export function EmpresaAnunciosTab({ onFlash }: Props) {
  const [config, setConfig] = useState<AnuncioConfigEmpresa | null>(null);
  const [items, setItems] = useState<AnuncioEmpresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imagem, setImagem] = useState<File | null>(null);

  function carregar() {
    setLoading(true);
    Promise.all([api.empresaAnunciosConfig(), api.empresaAnuncios()])
      .then(([cfg, lista]) => {
        setConfig(cfg);
        setItems(lista.items || []);
      })
      .catch((e) => onFlash(e instanceof Error ? e.message : 'Erro ao carregar anúncios', true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function openNovo() {
    const ass = config?.assinatura;
    if (ass?.moduloAtivo && !ass.assinaturaAtiva) {
      onFlash('Assine um plano de anúncios para publicar.', true);
      return;
    }
    if (ass?.moduloAtivo && ass.assinaturaAtiva && !ass.podeCriar) {
      onFlash(`Limite de ${ass.limiteAnuncios ?? limite} anúncio(s) atingido no seu plano.`, true);
      return;
    }
    setEditId(null);
    setForm(emptyForm);
    setImagem(null);
    setShowForm(true);
  }

  function openEditar(a: AnuncioEmpresa) {
    setEditId(a.id);
    setForm({
      titulo: a.titulo,
      nomeAnunciante: a.nomeAnunciante,
      slot: a.slot,
      linkTipo: (a.linkTipo as 'url' | 'instagram' | 'whatsapp') || 'url',
      linkDestino: a.linkDestino || '',
      whatsapp: a.whatsapp || '',
    });
    setImagem(null);
    setShowForm(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editId && !imagem) {
      onFlash('Envie a imagem do banner.', true);
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('titulo', form.titulo);
      fd.append('nome_anunciante', form.nomeAnunciante);
      fd.append('slot', form.slot);
      fd.append('link_tipo', form.linkTipo);
      fd.append('link_destino', form.linkDestino);
      if (form.linkTipo === 'whatsapp') fd.append('whatsapp', form.whatsapp);
      if (imagem) fd.append('imagem', imagem);

      const res = editId
        ? await api.atualizarAnuncioEmpresa(editId, fd)
        : await api.criarAnuncioEmpresa(fd);
      onFlash(res.message || 'Salvo.');
      setShowForm(false);
      carregar();
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro ao salvar', true);
    } finally {
      setSaving(false);
    }
  }

  async function acao(id: number, acaoNome: 'pausar' | 'retomar') {
    const fd = new FormData();
    fd.append('acao', acaoNome);
    try {
      const res = await api.atualizarAnuncioEmpresa(id, fd);
      onFlash(res.message || 'Atualizado.');
      carregar();
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro', true);
    }
  }

  async function excluir(id: number) {
    if (!confirm('Excluir este anúncio?')) return;
    try {
      const res = await api.excluirAnuncioEmpresa(id);
      onFlash(res.message || 'Excluído.');
      carregar();
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro', true);
    }
  }

  const slots = config?.slots || {};
  const dimensoes = config?.slotDimensoes || {};
  const slotHint = dimensoes[form.slot]?.sugestao || '728×90 px';
  const ass = config?.assinatura;
  const limite = config?.maxAnunciosPorEmpresa ?? ass?.limiteAnuncios ?? 3;
  const usados = config?.usados ?? items.length;
  const precisaAssinatura = ass?.moduloAtivo && !ass.assinaturaAtiva;
  const requerAprovacao = config?.requerAprovacaoMaster !== false;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Anúncios da sua marca</h2>
          <p className="mt-1 text-sm text-muted">
            Divulgue produtos, serviços e promoções no Conecta Jovem na sua região.
          </p>
          {config && (
            <p className="mt-2 text-xs text-faint">
              {ass?.moduloAtivo ? (
                <>
                  Plano: {ass.assinaturaAtiva ? (ass.assinatura?.plano?.nome || 'Ativo') : 'Sem assinatura'} ·{' '}
                  {usados}/{limite} anúncios
                </>
              ) : (
                <>
                  Preço mínimo referência: R$ {config.precoMinimoMensal.toFixed(2)}/mês · {usados}/{limite} anúncios
                </>
              )}
            </p>
          )}
        </div>
        {precisaAssinatura ? (
          <Link to="/empresa/anuncios/assinatura" className="btn-primary text-sm">
            Assinar plano
          </Link>
        ) : (
          <button
            type="button"
            onClick={openNovo}
            disabled={usados >= limite || (ass?.moduloAtivo && !ass.podeCriar)}
            className="btn-primary text-sm disabled:opacity-50"
          >
            + Novo anúncio
          </button>
        )}
      </div>

      {precisaAssinatura && (
        <div className="mb-4 rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-4 text-sm">
          Para publicar banners no Conecta Jovem, escolha um plano mensual e pague via PIX.{' '}
          <Link to="/empresa/anuncios/assinatura" className="text-brand-accent underline">
            Ver planos
          </Link>
        </div>
      )}

      {requerAprovacao && items.some((a) => a.status === 'pendente') && (
        <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100/90">
          Anúncios com status &quot;Aguardando aprovação&quot; só aparecem no site após o master aprovar no painel CTI.
        </div>
      )}

      {showForm && (
        <form onSubmit={onSubmit} className="glass-card mb-6 space-y-4">
          <h3 className="font-medium">{editId ? 'Editar anúncio' : 'Novo anúncio'}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              Título interno *
              <input
                className="input mt-1"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm">
              Nome exibido (marca) *
              <input
                className="input mt-1"
                value={form.nomeAnunciante}
                onChange={(e) => setForm({ ...form, nomeAnunciante: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm">
              Posição *
              <select
                className="select mt-1"
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
              >
                {Object.entries(slots).map(([k, lbl]) => (
                  <option key={k} value={k}>
                    {String(lbl)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Banner (jpg/png/webp) {!editId && '*'}
              <input
                className="input mt-1"
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => setImagem(e.target.files?.[0] || null)}
              />
              <span className="mt-1 block text-xs text-faint">
                Tamanho sugerido: {slotHint}
                {dimensoes[form.slot]?.hint ? ` — ${dimensoes[form.slot].hint}` : ''}
              </span>
            </label>
            <label className="block text-sm">
              Destino *
              <select
                className="select mt-1"
                value={form.linkTipo}
                onChange={(e) =>
                  setForm({ ...form, linkTipo: e.target.value as 'url' | 'instagram' | 'whatsapp' })
                }
              >
                <option value="url">Site</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
            <label className="block text-sm">
              {form.linkTipo === 'whatsapp' ? 'WhatsApp *' : 'URL / @ *'}
              <input
                className="input mt-1"
                value={form.linkTipo === 'whatsapp' ? form.whatsapp : form.linkDestino}
                onChange={(e) =>
                  form.linkTipo === 'whatsapp'
                    ? setForm({ ...form, whatsapp: e.target.value })
                    : setForm({ ...form, linkDestino: e.target.value })
                }
                placeholder={form.linkTipo === 'instagram' ? '@suaempresa' : 'https://...'}
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
            <button type="button" className="btn-ghost text-sm" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-subtle">Carregando…</p>}
      {!loading && items.length === 0 && (
        <p className="text-subtle">Nenhum anúncio ainda. Crie o primeiro para divulgar sua marca.</p>
      )}

      <div className="space-y-4">
        {items.map((a) => (
          <article key={a.id} className="glass-card flex flex-col gap-4 md:flex-row md:items-center">
            {a.imagemUrl && (
              <img src={a.imagemUrl} alt="" className="h-20 w-full max-w-[200px] rounded-lg object-contain bg-white/5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{a.titulo}</h3>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${STATUS_CLASS[a.status] || STATUS_CLASS.pausado}`}
                >
                  {a.statusLabel || a.status}
                </span>
              </div>
              <p className="text-sm text-muted">{a.nomeAnunciante} · {a.slotLabel || a.slot}</p>
              <p className="mt-1 text-xs text-faint">
                {a.impressoes ?? 0} impressões · {a.cliques ?? 0} cliques · CTR {a.ctr ?? 0}%
              </p>
              {a.motivoRejeicao && (
                <p className="mt-1 text-xs text-red-400">Motivo: {a.motivoRejeicao}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-ghost text-xs" onClick={() => openEditar(a)}>
                Editar
              </button>
              {a.status === 'ativo' && (
                <button type="button" className="btn-ghost text-xs" onClick={() => acao(a.id, 'pausar')}>
                  Pausar
                </button>
              )}
              {a.status === 'pausado' && (
                <button type="button" className="btn-ghost text-xs" onClick={() => acao(a.id, 'retomar')}>
                  Retomar
                </button>
              )}
              <button type="button" className="btn-ghost text-xs text-red-400" onClick={() => excluir(a.id)}>
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
