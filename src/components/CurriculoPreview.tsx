import { useState } from 'react';
import type { CandidatoPerfil } from '../lib/api';
import { cloneCurriculoParaExport, imprimirCurriculo } from '../lib/curriculoExport';
import { slugArquivo } from '../lib/curriculo';
import { CurriculoDocument } from './CurriculoDocument';

type Props = {
  perfil: CandidatoPerfil;
  onClose?: () => void;
};

declare global {
  interface Window {
    html2pdf?: () => {
      set: (opt: Record<string, unknown>) => {
        from: (el: HTMLElement) => { save: () => Promise<void> };
      };
    };
  }
}

function loadHtml2Pdf(): Promise<NonNullable<Window['html2pdf']>> {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    s.onload = () => (window.html2pdf ? resolve(window.html2pdf) : reject(new Error('html2pdf indisponível')));
    s.onerror = () => reject(new Error('Falha ao carregar gerador de PDF'));
    document.head.appendChild(s);
  });
}

export function CurriculoPreview({ perfil, onClose }: Props) {
  const [gerando, setGerando] = useState(false);
  const [imprimindo, setImprimindo] = useState(false);

  async function baixarPdf() {
    const el = document.getElementById('curriculo-print');
    if (!el) return;
    setGerando(true);
    const { root, cleanup } = await cloneCurriculoParaExport(el);
    try {
      const html2pdf = await loadHtml2Pdf();
      await html2pdf()
        .set({
          margin: 0,
          filename: `curriculo-${slugArquivo(perfil.nome)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
            backgroundColor: '#ffffff',
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] },
        })
        .from(root)
        .save();
    } catch {
      await imprimirCurriculo(el);
    } finally {
      cleanup();
      setGerando(false);
    }
  }

  async function imprimir() {
    const el = document.getElementById('curriculo-print');
    if (!el) return;
    setImprimindo(true);
    try {
      await imprimirCurriculo(el);
    } finally {
      setImprimindo(false);
    }
  }

  return (
    <div className="curriculo-root">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary text-sm" disabled={gerando} onClick={() => void baixarPdf()}>
          {gerando ? 'Gerando PDF…' : 'Baixar PDF'}
        </button>
        <button type="button" className="btn-ghost text-sm" disabled={imprimindo} onClick={() => void imprimir()}>
          {imprimindo ? 'Preparando…' : 'Imprimir'}
        </button>
        {onClose && (
          <button type="button" className="btn-ghost text-sm" onClick={onClose}>
            Fechar
          </button>
        )}
      </div>
      <div className="curriculo-preview-frame">
        <CurriculoDocument perfil={perfil} />
      </div>
    </div>
  );
}
