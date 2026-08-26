<?php
/** Redireciona para a build estática (dist). Em dev use: npm run dev → http://localhost:5173 */
header('Location: dist/', true, 302);
exit;
