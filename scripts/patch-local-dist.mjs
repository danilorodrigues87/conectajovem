import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');
const htaccessPath = path.join(distDir, '.htaccess');
const basePath = (process.env.VITE_BASE_PATH || '/pjt/conectajovem/dist/').replace(/\/?$/, '/');

if (!fs.existsSync(htaccessPath)) {
  console.warn('[patch-local-dist] .htaccess não encontrado em dist/');
  process.exit(0);
}

const htaccess = `# SPA fallback — XAMPP local (subpasta)
# Gerado por scripts/patch-local-dist.mjs — não editar manualmente no deploy produção

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${basePath}

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteCond %{REQUEST_URI} ^${basePath.replace(/\/$/, '')}/blog/([a-z0-9-]+)/?$
  RewriteCond %{DOCUMENT_ROOT}${basePath}blog/%1/index.html -f
  RewriteRule ^blog/([a-z0-9-]+)/?$ blog/$1/index.html [L]

  RewriteRule ^ index.html [L]
</IfModule>

Options -Indexes
DirectoryIndex index.html

<IfModule mod_mime.c>
  AddType image/svg+xml .svg .svgz
</IfModule>
`;

fs.writeFileSync(htaccessPath, htaccess, 'utf8');
console.log('[patch-local-dist] .htaccess atualizado com RewriteBase', basePath);
