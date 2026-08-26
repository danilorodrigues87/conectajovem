# Conecta Jovem — Portal de empregabilidade

SPA React consumindo a API do **painel-cti** (`/api/v1/conect/*`).

## Desenvolvimento local (recomendado)

```bash
cd C:\xampp\htdocs\pjt\conectajovem
npm install
npm run dev
```

Abre em **http://localhost:5173** ou pelo IP da rede (**http://192.168.x.x:5173** — celular/outro PC na mesma Wi‑Fi).

> Reinicie o `npm run dev` após mudanças no `vite.config.ts`. Se o IP não carregar, defina no `.env`: `VITE_DEV_LAN_IP=192.168.22.112` (seu IP).

Apache/XAMPP precisa estar rodando para a API.

## XAMPP — pasta dist (sem Vite dev)

Se você abre pelo Apache (`http://localhost/pjt/conectajovem/dist/`), **precisa** do build com caminho correto:

```bash
npm run build:local
```

Depois acesse: **http://localhost/pjt/conectajovem/dist/**

> Abrir só `http://localhost/pjt/conectajovem/` sem build local gera tela branca (JS em `/assets/` não existe na raiz do localhost).

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
