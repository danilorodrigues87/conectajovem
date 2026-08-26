/**
 * Verifica se a API de assinatura está com rota correta (painel-cti).
 * Uso: node scripts/verify-assinatura-route.mjs
 *
 * Resposta esperada (rota OK): 401 + "Não autenticado."
 * Resposta com bug de rota:    404 + "Anúncio não encontrado."
 */

const API =
  process.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'https://admin.ctieducacional.com.br/api/v1';

const url = `${API}/conect-empresa/anuncios/assinatura`;

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ planId: 1 }),
});

const text = await res.text();
let body = {};
try {
  body = JSON.parse(text);
} catch {
  body = { raw: text.slice(0, 200) };
}

const msg = body.message || body.raw || text.slice(0, 120);
console.log('URL:', url);
console.log('HTTP:', res.status);
console.log('Body:', JSON.stringify(body, null, 2));

if (msg.includes('Anúncio não encontrado')) {
  console.log('\n❌ BUG: rota POST /anuncios/assinatura cai em /anuncios/{id}.');
  console.log('   Publique painel-cti com routes/api/v1/conect.php corrigido (rotas fixas antes de {id}).');
  process.exit(1);
}

if (res.status === 401 && String(msg).includes('autenticado')) {
  console.log('\n✅ Rota de assinatura OK (401 sem token é esperado).');
  process.exit(0);
}

console.log('\n⚠ Resposta inesperada — confira manualmente.');
process.exit(2);
