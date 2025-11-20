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
// Projetado para capturar erros críticos e permitir que o usuário recupere o app
// limpando o cache local caso o estado salvo esteja corrompido.
class ErrorBoundary extends Component<Props, State> {
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
    // Limpa tudo que pode estar travando o app
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a', // Fundo escuro (Slate 900)
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          zIndex: 99999,
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid #334155'
          }}>
            <svg 
              style={{ width: '64px', height: '64px', marginBottom: '20px', color: '#ef4444' }} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
              Algo deu errado
            </h1>
            
            <p style={{ color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>
              Ocorreu um erro inesperado ao carregar o Brasileirão Manager.
              Isso geralmente acontece se os dados salvos estiverem corrompidos.
            </p>

            <div style={{ 
              backgroundColor: '#0f172a', 
              padding: '10px', 
              borderRadius: '6px', 
              marginBottom: '20px', 
              textAlign: 'left',
              maxHeight: '100px',
              overflow: 'auto',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#ef4444'
            }}>
               {this.state.error?.toString() || "Erro desconhecido"}
            </div>

            <button 
              onClick={this.handleHardReset}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              🔄 Limpar Dados e Reiniciar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Inicialização da Aplicação ---
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
  // Fallback caso o DOM não esteja pronto (muito raro, mas previne tela branca total)
  document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Erro Fatal: Elemento Root não encontrado.</div>';
}