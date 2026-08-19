# Conecta Jovem — Portal de empregabilidade

SPA React consumindo a API do **painel-cti** (`/api/v1/conect/*`).

## Desenvolvimento local

```bash
cd C:\xampp\htdocs\pjt\conectajovem
npm install
npm run dev
```

Abre em http://localhost:5173

## Configuração

Copie `.env.example` → `.env` e ajuste:

```
VITE_API_BASE_URL=http://localhost/pjt/painel-cti/api/v1
```

No **painel-cti** `.env`:

```
CONECT_CORS_ORIGINS=http://localhost:5173
JWT_KEY=sua_chave
CONECT_ESCOLA_FALLBACK_ID=1
```

## Backend (painel-cti)

Execute no phpMyAdmin: `painel-cti/database/conect_jovem.sql`

Módulo escola: `/painel/conect`

## Produção

- Build: `npm run build` → pasta `dist/`
- Domínio: `conectjovem.com.br`
- API: `https://admin.ctieducacional.com.br/app/api/v1`
