import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { SocialLinks } from '../SocialLinks';
import type { BrandingState } from '../../hooks/useBranding';
import { images } from '../../config/images';

type Props = {
  branding: BrandingState;
};

export function HeroSection({ branding }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={branding.heroImageUrl}
          alt=""
          className="hero-img h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = images.heroFallback;
          }}
        />
        <div className="hero-overlay-r absolute inset-0" />
        <div className="hero-overlay-t absolute inset-0" />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        <div>
          <p className="badge mb-4">{site.hero.eyebrow}</p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-[3.25rem]">
            {site.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{site.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/vagas" className="btn-primary">
              {site.hero.ctaPrimary}
            </Link>
            <Link to="/cadastro/empresa" className="btn-ghost">
              {site.hero.ctaSecondary}
            </Link>
          </div>
          <SocialLinks redes={branding.redesSociais} iconsOnly className="mt-6" />
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-edge pt-8">
            {site.stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-brand-accent">{s.value}</div>
                <div className="text-xs text-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-6 md:p-8">
          <h2 className="text-lg font-semibold">Por que o {branding.nomePortal}?</h2>
          <ul className="mt-5 space-y-4">
            {site.valueProps.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent/15 text-xs text-brand-accent">
                  ✓
                </span>
                <div>
                  <div className="font-medium">{item.title}</div>
                  <p className="mt-0.5 text-sm text-subtle">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
