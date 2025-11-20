import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Tipos do Error Boundary ---
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// --- Error Boundary Supremo ---
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CRITICAL APP CRASH:', error, errorInfo);
  }

  private handleHardReset = () => {
    // Limpa localStorage e sessionStorage para remover estados corrompidos
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('Cache limpo com sucesso.');
    } catch (e) {
      console.error('Erro ao limpar cache:', e);
    }
    // Força recarregamento do navegador
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#020617', // Slate 950 muito escuro
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          zIndex: 999999,
          padding: '20px',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: '#450a0a',
              borderRadius: '50%',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <svg 
                width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px', color: '#fff' }}>
              Ops! O jogo travou.
            </h1>
            
            <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6', fontSize: '16px' }}>
              Não se preocupe. Isso geralmente acontece quando os dados salvos no navegador conflitam com uma nova atualização.
            </p>

            <div style={{
              width: '100%',
              backgroundColor: '#0f172a',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ef4444',
              color: '#ef4444',
              fontFamily: 'monospace',
              fontSize: '12px',
              textAlign: 'left',
              marginBottom: '24px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Erro: {this.state.error?.message || "Erro desconhecido"}
            </div>

            <button 
              onClick={this.handleHardReset}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              CORRIGIR E REINICIAR ↻
            </button>
            
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
              Isso limpará os dados locais e reiniciará o app.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Inicialização Segura ---
const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Elemento 'root' não encontrado no DOM.");
}