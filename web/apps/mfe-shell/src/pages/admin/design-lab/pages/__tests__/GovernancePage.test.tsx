// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: {
      items: [],
      pages: { currentFamilies: [] },
      recipes: { currentFamilies: [] },
      ecosystem: { currentFamilies: [] },
    },
    layer: 'components',
  }),
}));

vi.mock('../../governance/ReleaseHealthCard', () => ({
  ReleaseHealthCard: () => <div data-testid="release-health">Release Health</div>,
}));
vi.mock('../../governance/ApprovalQueue', () => ({
  ApprovalQueue: () => <div data-testid="approval-queue">Approval Queue Content</div>,
}));
vi.mock('../../governance/OwnershipPanel', () => ({
  OwnershipPanel: () => <div data-testid="ownership-panel">Ownership Coverage</div>,
}));
vi.mock('../../governance/AuditTrailPanel', () => ({
  AuditTrailPanel: ({ maxEntries }: { maxEntries: number }) => (
    <div data-testid="audit-trail">Audit Trail ({maxEntries})</div>
  ),
}));
vi.mock('../../governance/useDesignLabRBAC', () => ({
  useDesignLabRBAC: () => ({
    role: 'maintainer',
    permissions: {
      canEdit: true,
      canApprove: true,
      canPublish: false,
      canDelete: false,
    },
  }),
}));
vi.mock('../../components/DataProvenanceBadge', () => ({
  DataProvenanceBadge: ({ level }: { level: string }) => <span data-testid="provenance-badge">{level}</span>,
}));

import GovernancePage from '../GovernancePage';

function renderPage() {
  return render(<MemoryRouter><GovernancePage /></MemoryRouter>);
}

describe('GovernancePage', () => {
  it('renders the page title "Governance"', () => {
    renderPage();
    expect(screen.getByText('Governance')).toBeInTheDocument();
  });

  it('shows page description text', () => {
    renderPage();
    expect(screen.getByText(/Policy cockpit for RBAC, approvals, ownership, and release health/)).toBeInTheDocument();
  });

  it('displays the current user role badge as Maintainer', () => {
    renderPage();
    expect(screen.getByText('Maintainer')).toBeInTheDocument();
    expect(screen.getByText('Your role:')).toBeInTheDocument();
  });

  it('renders the Release Health Card section', () => {
    renderPage();
    expect(screen.getByTestId('release-health')).toBeInTheDocument();
  });

  it('renders the Approval Queue section', () => {
    renderPage();
    expect(screen.getByTestId('approval-queue')).toBeInTheDocument();
  });

  it('renders the Ownership Panel', () => {
    renderPage();
    expect(screen.getByTestId('ownership-panel')).toBeInTheDocument();
  });

  it('renders the Audit Trail panel with maxEntries=20', () => {
    renderPage();
    expect(screen.getByTestId('audit-trail')).toBeInTheDocument();
    expect(screen.getByText('Audit Trail (20)')).toBeInTheDocument();
  });

  it('shows Your Permissions section with RBAC permission entries', () => {
    renderPage();
    expect(screen.getByText('Your Permissions')).toBeInTheDocument();
    // canEdit -> "Edit" with checkmark, canPublish -> "Publish" with cross
    expect(screen.getByText(/Edit/)).toBeInTheDocument();
    expect(screen.getByText(/Approve/)).toBeInTheDocument();
    expect(screen.getByText(/Publish/)).toBeInTheDocument();
    expect(screen.getByText(/Delete/)).toBeInTheDocument();
  });
});
