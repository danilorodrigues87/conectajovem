import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { WhatsAppFloat } from './WhatsAppFloat';
import { site } from '../config/site';
import { useBranding } from '../context/BrandingContext';
import { clearSession, getRole, getToken } from '../lib/api';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export function Layout({ children }: { children: React.ReactNode }) {
  const token = getToken();
  const role = getRole();
  const logado = !!token && !!role;
  const { nomePortal, textoInstitucional } = useBranding();

  const perfilTo = role === 'empresa' ? '/empresa' : '/candidato';
  const perfilLabel = role === 'empresa' ? 'Área da empresa' : 'Meu perfil';

  function logout() {
    clearSession();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-mesh">
      <header className="surface-header sticky top-0 z-50 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <Logo className="h-10 w-auto sm:h-11" />
            <div className="hidden leading-tight sm:block">
              <span className="block text-base">{nomePortal}</span>
              <span className="text-[11px] font-normal text-faint">Empregabilidade & talentos</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <NavLink to="/vagas" className={navClass}>Vagas</NavLink>
            <NavLink to="/empresas" className={navClass}>Empresas parceiras</NavLink>
            <NavLink to="/como-funciona" className={navClass}>Como funciona</NavLink>
            <NavLink to="/contato" className={navClass}>Contato</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {logado ? (
              <>
                <Link to={perfilTo} className="btn-primary text-sm sm:text-base">
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
                <Link to="/cadastro" className="btn-primary text-sm sm:text-base">
                  Quero me candidatar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="surface-footer mt-24 border-t">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto" />
              <div>
                <div className="font-semibold">{nomePortal}</div>
                <p className="mt-1 max-w-xs text-sm text-subtle">{textoInstitucional || site.description}</p>
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
                <Link to="/contato" className="block hover:text-[var(--cj-text)]">Contato</Link>
                <a href={`https://${site.domain}`} className="block hover:text-[var(--cj-text)]">{site.domain}</a>
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
