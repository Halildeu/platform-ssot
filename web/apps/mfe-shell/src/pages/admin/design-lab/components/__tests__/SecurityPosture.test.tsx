import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('../DataProvenanceBadge', () => ({
  DataProvenanceBadge: () => <span>badge</span>,
}));

vi.mock('../../evidence/useEvidence', () => ({
  useEvidence: () => ({ status: 'no_data' }),
  FALLBACK_REGISTRY: {
    security: {
      codeql: { workflow_exists: false, status: 'no_data' },
      secret_scan: { workflow_exists: false, status: 'no_data' },
      trivy: { workflow_exists: false, status: 'no_data' },
      sbom: { workflow_exists: false, status: 'no_data' },
      guardrails: { workflow_exists: false, status: 'no_data' },
    },
  },
}));

import { SecurityPosture } from '../SecurityPosture';

describe('SecurityPosture', () => {
  it('renders without crashing', () => {
    render(<SecurityPosture />);
    expect(document.body).toBeTruthy();
  });
});
