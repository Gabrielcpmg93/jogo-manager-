import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Define types for ErrorBoundary
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Global Error Boundary
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Global App Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <AlertCircle style={{ width: '60px', height: '60px', color: '#ef4444', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Ops! Ocorreu um erro crítico.</h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '400px' }}>
            O aplicativo encontrou um problema inesperado.
          </p>
          <details style={{ marginBottom: '20px', color: '#64748b', fontSize: '12px', textAlign: 'left', maxWidth: '80%' }}>
             <summary>Detalhes do erro (Técnico)</summary>
             <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                {this.state.error?.toString()}
             </pre>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} /> Reiniciar Jogo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);