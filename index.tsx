import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Define types for ErrorBoundary
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Global Error Boundary
// Uses inline SVGs and styles to ensure it renders even if external libraries (like lucide-react) fail to load.
// Fixed: Explicitly extend React.Component and add constructor to resolve 'props' property missing error.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false, error: null };
  }

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
          {/* Inline SVG for Alert Icon */}
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Ops! Ocorreu um erro crítico.</h1>
          <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '400px' }}>
            O aplicativo encontrou um problema e precisou ser interrompido para evitar travamentos maiores.
          </p>
          
          <details style={{ marginBottom: '20px', color: '#64748b', fontSize: '12px', textAlign: 'left', maxWidth: '90%', backgroundColor: '#1e293b', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
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
              gap: '10px',
              fontSize: '16px'
            }}
          >
            {/* Inline SVG for Refresh Icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6"></path>
              <path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Reiniciar Jogo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  // This error will be caught by the browser's default handler, not React's boundary
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