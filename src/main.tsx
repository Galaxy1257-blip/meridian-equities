import React, { StrictMode, Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terminal Uncaught Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#040814',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#070D1F',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⚠️
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#f87171' }}>
                  Terminal Safe Mode Recovery
                </h2>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                  An unexpected client-side error occurred.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#cbd5e1',
              wordBreak: 'break-word',
              marginBottom: '20px',
              maxHeight: '140px',
              overflowY: 'auto'
            }}>
              {this.state.error?.message || 'Unknown application error'}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#06b6d4',
                  color: '#040814',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reload Terminal
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Reset
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
