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
Para relatórios/analytics no Master: `painel-cti/database/conect_jovem_analytics.sql`

Módulo escola: `/painel/conect`  
Roadmap completo (fases 1–6, API, deploy, smoke): `painel-cti/docs/CONECT_ROADMAP.md`

## Produção (cPanel Git — igual portal do aluno)

1. Ajuste `DEPLOYPATH` em `.cpanel.yml` se necessário
2. `npm run build` (usa `.env.production`)
3. Commit da pasta `dist/` + push
4. cPanel → Git Version Control → **Deploy HEAD Commit**

Detalhes: `DEPLOY.md`  
Documentação completa: `../painel-cti/docs/CONECT_ROADMAP.md`

- Domínio: `conectajovem.com.br`
- API: `https://admin.ctieducacional.com.br/api/v1`
