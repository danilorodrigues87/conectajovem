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

## Testes

- https://conectajovem.com.br/
- https://conectajovem.com.br/vagas
- https://admin.ctieducacional.com.br/app/api/v1/conect/public/branding
