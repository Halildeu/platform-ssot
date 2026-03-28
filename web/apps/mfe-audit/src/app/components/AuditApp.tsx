import React from 'react';
import { AuditEventFeed } from './AuditEventFeed';

export const AuditApp: React.FC = () => {
  return (
    <main data-testid="audit-events-page" style={{ padding: '1.5rem' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Audit Event Feed</h1>
        <p>Monitor system-wide audit events, inspect diffs and export reports.</p>
      </header>
      <AuditEventFeed />
    </main>
  );
};

export default AuditApp;
