import React from 'react';
import { AuditEventFeed } from './AuditEventFeed';

class AuditAppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[AuditApp] Unhandled error yakalandı', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Denetim modülü yüklenirken beklenmeyen bir hata oluştu.</h2>
          <p>Lütfen sayfayı yenileyin. Sorun devam ederse sistem yöneticinizle iletişime geçin.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AuditApp: React.FC = () => {
  return (
    <AuditAppErrorBoundary>
      <main data-testid="audit-events-page" style={{ padding: '1.5rem' }}>
        <header style={{ marginBottom: '1rem' }}>
          <h1>Audit Event Feed</h1>
          <p>Monitor system-wide audit events, inspect diffs and export reports.</p>
        </header>
        <AuditEventFeed />
      </main>
    </AuditAppErrorBoundary>
  );
};

export default AuditApp;
