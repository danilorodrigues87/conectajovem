/**
 * Gera dist/blog/{slug}/index.html com meta Open Graph estáticas
 * para Facebook, WhatsApp e LinkedIn (crawlers não executam JS do SPA).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');

const API = (process.env.VITE_API_BASE_URL || 'https://admin.ctieducacional.com.br/api/v1').replace(
  /\/$/,
  '',
);
const SITE = (process.env.VITE_SITE_URL || 'https://conectajovem.com.br').replace(/\/$/, '');
const SITE_NAME = 'Conecta Jovem';
const FALLBACK_IMAGE = `${SITE}/logo-conect-jovem.png`;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(text) {
  const map = {
    á: 'a', à: 'a', ã: 'a', â: 'a', ä: 'a',
    é: 'e', è: 'e', ê: 'e', ë: 'e',
    í: 'i', ì: 'i', î: 'i', ï: 'i',
    ó: 'o', ò: 'o', õ: 'o', ô: 'o', ö: 'o',
    ú: 'u', ù: 'u', û: 'u', ü: 'u',
    ç: 'c', ñ: 'n',
  };
  let s = String(text || '').trim().toLowerCase();
  s = s.replace(/[áàãâäéèêëíìîïóòõôöúùûüçñ]/g, (ch) => map[ch] || ch);
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return s || 'artigo';
}

function buildOgBlock({ title, description, url, image, type = 'article' }) {
  const img = image || FALLBACK_IMAGE;
  const desc = description || 'Artigos sobre tecnologia, formação e empregabilidade.';
  return `
    <meta name="description" content="${escapeHtml(desc)}" />
    <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(desc)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:image" content="${escapeHtml(img)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(img)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(desc)}" />
    <meta name="twitter:image" content="${escapeHtml(img)}" />`;
}

function injectPage(baseHtml, { title, description, url, image, type }) {
  const ogBlock = buildOgBlock({ title, description, url, image, type });
  let html = baseHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  if (!html.includes('og:title')) {
    html = html.replace('</head>', `${ogBlock}\n  </head>`);
  }
  return html;
}

async function fetchPosts() {
  const res = await fetch(`${API}/conect/public/blog/posts?limit=50`);
  if (!res.ok) {
    throw new Error(`API blog/posts HTTP ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}

async function main() {
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html não encontrado. Rode vite build antes.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexPath, 'utf8');
  let posts = [];

  try {
    posts = await fetchPosts();
  } catch (err) {
    console.warn('Prerender blog: não foi possível buscar posts —', err.message);
    console.warn('Build continua; previews de artigos só após nova build com API online.');
    return;
  }

  if (posts.length === 0) {
    console.log('Prerender blog: nenhum artigo publicado.');
    return;
  }

  for (const post of posts) {
    const slug = slugify(post.slug || post.titulo);
    if (!slug) continue;

    const title = `${post.titulo || 'Artigo'} — ${SITE_NAME}`;
    const description = (post.resumo || '').trim() || SITE_NAME;
    const url = `${SITE}/blog/${slug}`;
    const image = post.capaUrl || FALLBACK_IMAGE;

    const html = injectPage(baseHtml, {
      title,
      description,
      url,
      image,
      type: 'article',
    });

    const outDir = path.join(distDir, 'blog', slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
    console.log(`  og: /blog/${slug}`);
  }

  console.log(`Prerender blog: ${posts.length} artigo(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
