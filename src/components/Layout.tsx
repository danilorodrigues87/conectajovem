import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { WhatsAppFloat } from './WhatsAppFloat';
import { site } from '../config/site';
import { useBranding } from '../context/BrandingContext';
import { clearSession, getRole, getToken } from '../lib/api';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'mobile-nav-link mobile-nav-link-active' : 'mobile-nav-link';

const navLinks = [
  { to: '/vagas', label: 'Vagas' },
  { to: '/empresas', label: 'Empresas parceiras' },
  { to: '/blog', label: 'Blog' },
  { to: '/como-funciona', label: 'Como funciona' },
  { to: '/contato', label: 'Contato' },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const role = getRole();
  const logado = !!token && !!role;
  const { nomePortal, textoInstitucional } = useBranding();
  const [menuOpen, setMenuOpen] = useState(false);

  const perfilTo = role === 'empresa' ? '/empresa' : '/candidato';
  const perfilLabel = role === 'empresa' ? 'Área da empresa' : 'Meu perfil';

  function logout() {
    clearSession();
    window.location.href = '/';
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-mesh">
      <header className="surface-header sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight" onClick={closeMenu}>
            <Logo className="h-10 w-auto sm:h-11" />
            <div className="hidden leading-tight sm:block">
              <span className="block text-base">{nomePortal}</span>
              <span className="text-[11px] font-normal text-faint">Empregabilidade & talentos</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Principal">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {logado ? (
              <>
                <Link to={perfilTo} className="btn-primary hidden text-sm sm:inline-flex sm:text-base">
                  {perfilLabel}
                </Link>
                <button type="button" onClick={logout} className="btn-ghost hidden sm:inline-flex text-sm">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn-primary hidden text-sm sm:inline-flex sm:text-base">
                  Quero me candidatar
                </Link>
              </>
            )}
            <button
              type="button"
              className="mobile-menu-btn md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={menuOpen ? 'mobile-menu-icon open' : 'mobile-menu-icon'} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav-root md:hidden" role="presentation">
          <button type="button" className="mobile-nav-backdrop" aria-label="Fechar menu" onClick={closeMenu} />
          <nav id="mobile-nav-panel" className="mobile-nav-panel" aria-label="Menu mobile">
            <div className="mobile-nav-links">
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className={mobileNavClass} onClick={closeMenu}>
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mobile-nav-actions">
              {logado ? (
                <>
                  <Link to={perfilTo} className="btn-primary w-full text-center" onClick={closeMenu}>
                    {perfilLabel}
                  </Link>
                  <button type="button" className="btn-ghost w-full" onClick={() => { closeMenu(); logout(); }}>
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost w-full text-center" onClick={closeMenu}>
                    Entrar
                  </Link>
                  <Link to="/cadastro" className="btn-primary w-full text-center" onClick={closeMenu}>
                    Quero me candidatar
                  </Link>
                  <Link to="/cadastro/empresa" className="btn-ghost w-full text-center text-sm" onClick={closeMenu}>
                    Cadastrar empresa
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      <main>{children}</main>
      <footer className="surface-footer mt-24 border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto" />
              <div>
                <div className="font-semibold">{nomePortal}</div>
                <p className="mt-1 max-w-xs text-sm text-subtle">{textoInstitucional || site.description}</p>
                <p className="mt-2 text-xs text-faint">{site.contact.address}</p>
                <a href={`mailto:${site.contact.email}`} className="mt-1 block text-xs text-subtle hover:text-brand-accent">
                  {site.contact.email}
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm text-muted sm:grid-cols-3">
              <div>
                <div className="mb-2 font-medium">Candidatos</div>
                <Link to="/vagas" className="block hover:text-[var(--cj-text)]">Vagas</Link>
                <Link to={logado && role === 'candidato' ? '/candidato' : '/cadastro'} className="block hover:text-[var(--cj-text)]">
                  {logado && role === 'candidato' ? 'Meu perfil' : 'Criar perfil'}
                </Link>
              </div>
              <div>
                <div className="mb-2 font-medium">Empresas</div>
                <Link to="/cadastro/empresa" className="block hover:text-[var(--cj-text)]">Cadastrar empresa</Link>
                <Link to={logado && role === 'empresa' ? '/empresa' : '/login'} className="block hover:text-[var(--cj-text)]">
                  {logado && role === 'empresa' ? 'Área da empresa' : 'Entrar como empresa'}
                </Link>
              </div>
              <div>
                <div className="mb-2 font-medium">Institucional</div>
                <Link to="/como-funciona" className="block hover:text-[var(--cj-text)]">Como funciona</Link>
                <Link to="/blog" className="block hover:text-[var(--cj-text)]">Blog</Link>
                <Link to="/contato" className="block hover:text-[var(--cj-text)]">Contato</Link>
                <Link to="/privacidade" className="block hover:text-[var(--cj-text)]">Privacidade</Link>
                <Link to="/termos" className="block hover:text-[var(--cj-text)]">Termos de uso</Link>
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-edge pt-6 text-center text-xs text-faint">{site.footer}</p>
        </div>
      </footer>
      <WhatsAppFloat />
    </div>
  );
}
