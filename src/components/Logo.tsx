import { useTheme } from '../context/ThemeContext';
import { useBranding } from '../context/BrandingContext';

type LogoProps = {
  className?: string;
};

/**
 * Logo horizontal. Usa upload do Master quando disponível; fallback para arquivos estáticos.
 */
export function Logo({ className = 'h-10 w-auto' }: LogoProps) {
  const { theme } = useTheme();
  const { logoUrl, nomePortal } = useBranding();
  const isDark = theme === 'dark';
  const png = isDark ? '/logo-conect-jovem-dark.png' : '/logo-conect-jovem.png';
  const svg = isDark ? '/logo-conect-jovem-dark.svg' : '/logo-conect-jovem.svg';
  const src = logoUrl || png;

  return (
    <img
      src={src}
      alt={nomePortal}
      className={`object-contain ${className}`}
      onError={(e) => {
        if (logoUrl) return;
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
