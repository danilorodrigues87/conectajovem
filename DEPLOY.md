# Deploy Conecta Jovem — cPanel Git (igual portal do aluno)

## Primeira vez

1. Confirme a pasta do domínio no cPanel e ajuste `DEPLOYPATH` em `.cpanel.yml`
2. No painel (servidor): rode `conect_jovem.sql` e configure no `.env`:
   ```env
   CONECT_URL=https://conectajovem.com.br
   CONECT_CORS_ORIGINS=https://conectajovem.com.br,https://www.conectajovem.com.br
   ```
3. cPanel → Git Version Control → clone `conectajovem`
4. No PC:
   ```powershell
   cd C:\xampp\htdocs\pjt\conectajovem
   npm install
   npm run build
   git add .
   git reset HEAD .env
   git commit -m "build: deploy Conecta Jovem"
   git push origin main
   ```
5. cPanel → repo conectajovem → **Deploy HEAD Commit**

## Atualizações

```powershell
npm run build
git add .
git commit -m "build: atualizacao"
git push
```

→ cPanel → **Deploy HEAD Commit**

## Erro: "Deploy HEAD Commit" desabilitado

O cPanel exige **as duas** condições:
1. Arquivo `.cpanel.yml` na raiz do repo (commitado no GitHub)
2. Nenhuma alteração local pendente no servidor

### Passo 1 — Enviar `.cpanel.yml` do PC

```powershell
cd C:\xampp\htdocs\pjt\conectajovem
git add .cpanel.yml DEPLOY.md public/.htaccess
git status
git commit -m "chore: cpanel deploy config"
git push origin main
```

### Passo 2 — No cPanel

1. Clique **Update from Remote**
2. Confirme que `.cpanel.yml` aparece na lista de arquivos do repo

### Passo 3 — Limpar alterações pendentes (Terminal do cPanel)

Se o botão Deploy continuar cinza:

```bash
cd ~/conectajovem.com.br
git status
git reset --hard origin/main
```

Depois disso o **Deploy HEAD Commit** deve habilitar.

### Recomendado: repo separado da pasta pública (igual Ascend)

| Item | Caminho correto |
|------|-----------------|
| Repositório Git | `/home1/dncurs82/repositories/conectajovem` |
| Site público | `/home1/dncurs82/conectajovem.com.br` |

Se o Git foi criado **dentro** de `conectajovem.com.br`, cada deploy suja o working tree e o botão trava de novo. Nesse caso:

1. cPanel → Git → **Delete** o repo em `conectajovem.com.br`
2. Create → path `repositories/conectajovem` → clone do GitHub
3. Deploy (`.cpanel.yml` copia `dist/` → `conectajovem.com.br`)

## Testes

- https://conectajovem.com.br/
- https://conectajovem.com.br/vagas
- https://admin.ctieducacional.com.br/api/v1/conect/public/branding
