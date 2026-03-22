import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../DesignLabProvider', () => ({
  useDesignLab: () => ({
    t: (key: string) => key,
    index: { items: [], pages: { currentFamilies: [] }, recipes: { currentFamilies: [] }, ecosystem: { currentFamilies: [] } },
    layer: 'components',
  }),
}));

vi.mock('../../governance/ReleaseHealthCard', () => ({ ReleaseHealthCard: () => <div data-testid="release-health" /> }));
vi.mock('../../governance/ApprovalQueue', () => ({ ApprovalQueue: () => <div data-testid="approval-queue" /> }));
vi.mock('../../governance/OwnershipPanel', () => ({ OwnershipPanel: () => <div data-testid="ownership" /> }));
vi.mock('../../governance/AuditTrailPanel', () => ({ AuditTrailPanel: () => <div data-testid="audit-trail" /> }));
vi.mock('../../governance/useDesignLabRBAC', () => ({ useDesignLabRBAC: () => ({ role: 'viewer', permissions: [] }) }));
vi.mock('../../components/DataProvenanceBadge', () => ({ DataProvenanceBadge: () => <span>badge</span> }));

import GovernancePage from '../GovernancePage';

describe('GovernancePage', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><GovernancePage /></MemoryRouter>);
    expect(document.body).toBeTruthy();
  });
});
