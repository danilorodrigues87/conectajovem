import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/** Evita tela branca silenciosa quando algo quebra no React. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Conecta Jovem]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#0f1419',
            color: '#e7ecf3',
          }}
        >
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Conecta Jovem — erro ao carregar</h1>
            <p style={{ opacity: 0.85, lineHeight: 1.5 }}>
              {this.state.error.message || 'Erro desconhecido.'}
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.65 }}>
              Desenvolvimento: <code>npm run dev</code> → http://localhost:5173
              <br />
              XAMPP: <code>npm run build:local</code> → http://localhost/pjt/conectajovem/dist/
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1.25rem',
                padding: '0.5rem 1rem',
                borderRadius: 8,
                border: 'none',
                background: '#6366f1',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
