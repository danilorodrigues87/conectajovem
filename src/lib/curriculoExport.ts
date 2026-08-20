import { getApiBaseUrl, getToken } from './api';

/** Estilos embutidos para PDF/impressão (html2pdf e iframe não carregam index.css). */
export const CURRICULO_EXPORT_CSS = `
@page { size: A4 portrait; margin: 12mm 14mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #fff; color: #111; }
.curriculo-sheet {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  background: #fff;
  color: #111;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  font-size: 10.5pt;
  line-height: 1.45;
}
.curriculo-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #ccc;
}
.curriculo-foto {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.curriculo-foto-inicial {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff3e6;
  color: #c45a00;
  font-size: 1.75rem;
  font-weight: 700;
}
.curriculo-header-text { flex: 1; min-width: 0; }
.curriculo-nome { margin: 0; font-size: 1.35rem; font-weight: 700; line-height: 1.2; }
.curriculo-meta { margin: 0.25rem 0 0; font-size: 0.85rem; color: #444; }
.curriculo-selo { margin: 0.35rem 0 0; font-size: 0.85rem; font-weight: 600; color: #c45a00; }
.curriculo-block { margin-top: 0.85rem; break-inside: avoid; page-break-inside: avoid; }
.curriculo-section-title {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #555; margin: 0 0 0.35rem;
}
.curriculo-body { margin: 0.25rem 0 0; color: #222; }
.curriculo-list { margin: 0.35rem 0 0; padding-left: 1.1rem; color: #222; }
.curriculo-list-spaced > li + li { margin-top: 0.5rem; }
.curriculo-item-title { font-weight: 600; }
.curriculo-exp {
  border-left: 2px solid #f59e0b;
  padding-left: 0.65rem;
  list-style: none;
  margin-left: 0;
}
.whitespace-pre-wrap { white-space: pre-wrap; }
`;

function waitForImages(root: ParentNode): Promise<void> {
  const imgs = [...root.querySelectorAll('img')];
  if (imgs.length === 0) return Promise.resolve();
  return Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  ).then(() => undefined);
}

/** Converte imagens externas em data URL para impressão/PDF (evita bloqueio cross-origin). */
export async function embedCurriculoImages(root: HTMLElement): Promise<void> {
  const imgs = [...root.querySelectorAll('img')];
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src') || '';
      if (!src || src.startsWith('data:')) return;

      let dataUrl: string | null = null;
      let strategy = 'none';

      if (img.classList.contains('curriculo-foto')) {
        dataUrl = await fetchCandidatoFotoDataUrl();
        if (dataUrl) strategy = 'api';
      }
      if (!dataUrl) {
        try {
          dataUrl = await fetchBlobAsDataUrl(src);
          strategy = 'blob';
        } catch {
          /* próxima estratégia */
        }
      }
      if (!dataUrl) {
        try {
          dataUrl = await fetchImageAsDataUrl(src);
          strategy = 'canvas';
        } catch {
          /* mantém URL original */
        }
      }

      if (dataUrl) {
        img.setAttribute('src', dataUrl);
      }

      // #region agent log
      fetch('http://127.0.0.1:7299/ingest/c2f3b05d-73bd-477d-8214-a3a1d104df4e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6b4d05'},body:JSON.stringify({sessionId:'6b4d05',runId:'post-fix',hypothesisId:'H1',location:'curriculoExport.ts:embed',message:dataUrl?'embed ok':'embed fail',data:{strategy,hasDataUrl:!!dataUrl,dataLen:dataUrl?.length??0,srcHost:(()=>{try{return new URL(src).host}catch{return 'invalid'}})()},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }),
  );
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('reader'));
    reader.readAsDataURL(blob);
  });
}

function rewriteUploadToSameOrigin(src: string): string {
  try {
    const u = new URL(src, window.location.origin);
    const idx = u.pathname.indexOf('/uploads/');
    if (idx >= 0) return u.pathname.slice(idx);
  } catch {
    /* ignore */
  }
  return src;
}

async function fetchBlobAsDataUrl(src: string): Promise<string> {
  const url = rewriteUploadToSameOrigin(src);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return blobToDataUrl(await res.blob());
}

async function fetchCandidatoFotoDataUrl(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${getApiBaseUrl()}/conect/me/foto/arquivo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return blobToDataUrl(await res.blob());
  } catch {
    return null;
  }
}

function fetchImageAsDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('img load'));
    img.src = src;
  });
}

export async function cloneCurriculoParaExport(source: HTMLElement): Promise<{
  root: HTMLElement;
  cleanup: () => void;
}> {
  const host = document.createElement('div');
  host.className = 'curriculo-export-host';
  host.setAttribute('aria-hidden', 'true');
  const clone = source.cloneNode(true) as HTMLElement;
  host.appendChild(clone);
  document.body.appendChild(host);
  await embedCurriculoImages(clone);
  return {
    root: clone,
    cleanup: () => host.remove(),
  };
}

export async function imprimirCurriculo(source: HTMLElement): Promise<void> {
  const { root, cleanup } = await cloneCurriculoParaExport(source);

  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', 'Impressão do currículo');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    // #region agent log
    fetch('http://127.0.0.1:7299/ingest/c2f3b05d-73bd-477d-8214-a3a1d104df4e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6b4d05'},body:JSON.stringify({sessionId:'6b4d05',runId:'pre-fix',hypothesisId:'H5',location:'curriculoExport.ts:print',message:'iframe doc null fallback window.print',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    cleanup();
    iframe.remove();
    window.print();
    return;
  }

  doc.open();
  doc.write(
    `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>${CURRICULO_EXPORT_CSS}</style></head><body></body></html>`,
  );
  doc.close();
  doc.body.appendChild(root);
  await waitForImages(doc);

  const imgs = [...doc.querySelectorAll('img')].map((img) => ({
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    isDataUrl: (img.getAttribute('src') || '').startsWith('data:'),
    srcHost: (() => {
      try {
        return new URL(img.src).host;
      } catch {
        return 'invalid';
      }
    })(),
  }));

  const sheet = doc.querySelector('.curriculo-sheet');
  const sheetStyle = sheet ? doc.defaultView?.getComputedStyle(sheet) : null;
  // #region agent log
  fetch('http://127.0.0.1:7299/ingest/c2f3b05d-73bd-477d-8214-a3a1d104df4e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'6b4d05'},body:JSON.stringify({sessionId:'6b4d05',runId:'pre-fix',hypothesisId:'H2-H3',location:'curriculoExport.ts:print',message:'iframe ready before print',data:{imgs,rootW:root.offsetWidth,rootH:root.offsetHeight,bodyW:doc.body.offsetWidth,sheetPad:sheetStyle?.padding,sheetMargin:sheetStyle?.margin,sheetMaxW:sheetStyle?.maxWidth},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  const win = iframe.contentWindow;
  if (!win) {
    cleanup();
    iframe.remove();
    return;
  }

  const done = () => {
    cleanup();
    iframe.remove();
  };

  win.addEventListener('afterprint', done, { once: true });
  setTimeout(done, 60_000);

  win.focus();
  win.print();
}
