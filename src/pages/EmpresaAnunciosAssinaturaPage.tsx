import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { api, type AnuncioAssinaturaResumo, type AnuncioPlano } from '../lib/api';
import { formatCompetenciaBr, formatDateBr } from '../lib/date';

export function EmpresaAnunciosAssinaturaPage() {
  const [planos, setPlanos] = useState<AnuncioPlano[]>([]);
  const [resumo, setResumo] = useState<AnuncioAssinaturaResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [assinando, setAssinando] = useState<number | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [flash, setFlash] = useState('');
  const [flashError, setFlashError] = useState(false);
  const pagamentoDetectado = useRef(false);

  function onFlash(msg: string, isError = false) {
    setFlash(msg);
    setFlashError(isError);
  }

  const carregar = useCallback((silencioso = false) => {
    if (!silencioso) setLoading(true);
    return Promise.all([api.anuncioPlanos(), api.anuncioAssinaturaResumo()])
      .then(([p, r]) => {
        setPlanos(p.items || []);
        setResumo(r);
        return r;
      })
      .catch((e) => {
        if (!silencioso) onFlash(e instanceof Error ? e.message : 'Erro ao carregar planos', true);
        return null;
      })
      .finally(() => {
        if (!silencioso) setLoading(false);
      });
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const faturaId = resumo?.faturaAberta?.id;
    const aguardando = faturaId && resumo?.faturaAberta?.status === 'aberta' && !resumo.assinaturaAtiva;
    if (!aguardando || pagamentoDetectado.current) return;

    const tick = async () => {
      try {
        const res = await api.verificarAnuncioAssinatura(faturaId);
        if (res.resumo) setResumo(res.resumo);
        if (res.pago && !pagamentoDetectado.current) {
          pagamentoDetectado.current = true;
          onFlash(res.message || 'Pagamento confirmado! Você já pode criar anúncios.');
          await carregar(true);
        }
      } catch {
        // polling silencioso
      }
    };

    const id = window.setInterval(tick, 5000);
    tick();
    return () => window.clearInterval(id);
  }, [resumo?.faturaAberta?.id, resumo?.faturaAberta?.status, resumo?.assinaturaAtiva, carregar]);

  async function assinar(planId: number) {
    setAssinando(planId);
    pagamentoDetectado.current = false;
    try {
      const res = await api.assinarAnuncioPlano(planId);
      onFlash(res.message || 'Assinatura iniciada.');
      await carregar(true);
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro ao assinar', true);
    } finally {
      setAssinando(null);
    }
  }

  async function verificarPagamento() {
    const faturaId = resumo?.faturaAberta?.id;
    if (!faturaId) return;
    setVerificando(true);
    try {
      const res = await api.verificarAnuncioAssinatura(faturaId);
      if (res.resumo) setResumo(res.resumo);
      onFlash(res.message || (res.pago ? 'Pagamento confirmado!' : 'Aguardando pagamento.'));
      if (res.pago) {
        pagamentoDetectado.current = true;
        await carregar(true);
      }
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro ao verificar', true);
    } finally {
      setVerificando(false);
    }
  }

  async function cancelar() {
    if (!confirm('Cancelar assinatura? Você mantém acesso até o fim do período pago.')) return;
    try {
      const res = await api.cancelarAnuncioAssinatura();
      onFlash(res.message || 'Assinatura cancelada.');
      await carregar(true);
    } catch (err) {
      onFlash(err instanceof Error ? err.message : 'Erro ao cancelar', true);
    }
  }

  const fatura = resumo?.faturaAberta;
  const ativa = resumo?.assinaturaAtiva;
  const vencimentoLabel = fatura?.vencimentoBr || formatDateBr(fatura?.vencimento);
  const competenciaLabel = fatura?.competenciaBr || formatCompetenciaBr(fatura?.competencia);
  const proxVenc = resumo?.assinatura?.proximoVencimentoBr || formatDateBr(resumo?.assinatura?.proximoVencimento);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {flash && (
          <p className={`mb-4 rounded-xl border px-4 py-3 text-sm ${flashError ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
            {flash}
          </p>
        )}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Assinatura de anúncios</h2>
            <p className="mt-1 text-sm text-muted">
              Escolha um plano para divulgar sua marca no Conecta Jovem. Pagamento via PIX (Mercado Pago CTI).
            </p>
          </div>
          <Link to="/empresa?tab=anuncios" className="btn-ghost text-sm">
            ← Voltar aos anúncios
          </Link>
        </div>

        {loading && <p className="text-subtle">Carregando planos…</p>}

        {!loading && ativa && resumo?.assinatura && (
          <div className="glass-card mb-6 border border-emerald-500/30">
            <p className="font-medium text-emerald-300">Assinatura ativa</p>
            <p className="mt-1 text-sm text-muted">
              Plano: <strong>{resumo.assinatura.plano?.nome}</strong>
              {proxVenc ? <> · válida até <strong>{proxVenc}</strong></> : null}
              {' '}· {resumo.usados}/{resumo.limiteAnuncios} anúncio(s) no plano
            </p>
            {resumo.assinatura.inicioEmBr && (
              <p className="mt-1 text-xs text-faint">Ativa desde {resumo.assinatura.inicioEmBr}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/empresa?tab=anuncios" className="btn-primary text-sm">
                Gerenciar anúncios
              </Link>
              <button type="button" className="btn-ghost text-xs text-red-400" onClick={cancelar}>
                Cancelar assinatura
              </button>
            </div>
          </div>
        )}

        {!loading && fatura && fatura.status === 'aberta' && !ativa && (
          <div className="glass-card mb-6 space-y-4">
            <p className="font-medium">Pagamento pendente — R$ {fatura.valor.toFixed(2).replace('.', ',')}</p>
            <p className="text-sm text-muted">
              Competência {competenciaLabel} · vencimento {vencimentoLabel}
            </p>
            <p className="text-xs text-faint">Detectamos o pagamento automaticamente a cada poucos segundos.</p>
            {fatura.pixQrBase64 && (
              <img
                src={`data:image/png;base64,${fatura.pixQrBase64}`}
                alt="QR Code PIX"
                className="mx-auto h-48 w-48 rounded-lg bg-white p-2"
              />
            )}
            {fatura.pixCopiaCola && (
              <div>
                <label className="text-xs text-faint">PIX copia e cola</label>
                <textarea
                  className="input mt-1 font-mono text-xs"
                  readOnly
                  rows={3}
                  value={fatura.pixCopiaCola}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary text-sm" disabled={verificando} onClick={verificarPagamento}>
                {verificando ? 'Verificando…' : 'Já paguei — verificar agora'}
              </button>
              {fatura.pixCopiaCola && (
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => {
                    const pix = fatura.pixCopiaCola;
                    if (!pix) return;
                    navigator.clipboard.writeText(pix);
                    onFlash('PIX copiado.');
                  }}
                >
                  Copiar PIX
                </button>
              )}
            </div>
            {!resumo?.mpConfigurado && (
              <p className="text-xs text-amber-400">
                Mercado Pago CTI não configurado no painel — o PIX pode não ser gerado até a CTI configurar.
              </p>
            )}
          </div>
        )}

        {!loading && !ativa && !(fatura && fatura.status === 'aberta') && (
          <div className="grid gap-4 md:grid-cols-3">
            {planos.map((plano) => (
              <article key={plano.id} className="glass-card flex flex-col">
                <h3 className="text-lg font-semibold">{plano.nome}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{plano.descricao}</p>
                <p className="mt-4 text-2xl font-bold">
                  R$ {plano.valorMensal.toFixed(2).replace('.', ',')}
                  <span className="text-sm font-normal text-faint">/mês</span>
                </p>
                <p className="mt-1 text-xs text-faint">Até {plano.maxAnuncios} banner(s) ativos</p>
                <button
                  type="button"
                  className="btn-primary mt-4 w-full text-sm"
                  disabled={assinando !== null}
                  onClick={() => assinar(plano.id)}
                >
                  {assinando === plano.id ? 'Processando…' : 'Assinar com PIX'}
                </button>
              </article>
            ))}
          </div>
        )}

        {!loading && planos.length === 0 && !resumo?.moduloAtivo && (
          <p className="text-subtle">
            Módulo de assinatura ainda não instalado no servidor. Peça ao administrador para executar{' '}
            <code className="text-xs">database/cj_anuncio_assinatura.sql</code>.
          </p>
        )}
      </div>
    </Layout>
  );
}
