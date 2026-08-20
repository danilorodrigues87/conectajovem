/**
 * Imagens provisórias via Unsplash (URLs fixas, sem API key).
 * Substituir por uploads próprios quando o Master branding estiver ativo.
 */
const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const images = {
  hero: u('photo-1521737711862-ea3e097405db', 1920, 900),
  candidate: u('photo-1522202176988-66273c2fd55f', 800, 600),
  company: u('photo-1600880292203-757bb62b4baf', 800, 600),
  school: u('photo-1523050854058-8df90110c9f1', 800, 600),
  testimonials: [
    u('photo-1494790108377-be9c29b29330', 128, 128),
    u('photo-1507003211169-0a1dd7228f2d', 128, 128),
    u('photo-1438761681033-6461ffad8d80', 128, 128),
  ],
  heroFallback: '/hero-conect-jovem.svg',
} as const;
