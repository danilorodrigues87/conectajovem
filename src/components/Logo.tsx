import { useTheme } from '../context/ThemeContext';
import { site } from '../config/site';

type LogoProps = {
  className?: string;
};

/**
 * Logo horizontal (fundo transparente).
 * Prioriza PNG se existir em /public; fallback para SVG por tema.
 */
export function Logo({ className = 'h-10 w-auto' }: LogoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const png = isDark ? '/logo-conect-jovem-dark.png' : '/logo-conect-jovem.png';
  const svg = isDark ? '/logo-conect-jovem-dark.svg' : '/logo-conect-jovem.svg';

  return (
    <img
      src={png}
      alt={site.name}
      className={`object-contain ${className}`}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes('.png')) {
          img.src = svg;
          return;
        }
        if (!img.src.includes('logo.svg')) {
          img.src = '/logo.svg';
        }
      }}
    />
  );
}
