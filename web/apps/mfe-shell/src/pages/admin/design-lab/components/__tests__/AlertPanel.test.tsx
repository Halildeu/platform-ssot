// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AlertPanel } from '../AlertPanel';

describe('AlertPanel', () => {
  it('renders empty state when no alerts', () => {
    const { container } = render(<AlertPanel alerts={[]} />);
    expect(container.textContent).toBeTruthy();
  });

  it('renders alerts of different severities', () => {
    const alerts = [
      { severity: 'critical' as const, title: 'Critical Issue', description: 'Fix now' },
      { severity: 'warning' as const, title: 'Warning', description: 'Check this' },
      { severity: 'info' as const, title: 'Info', description: 'FYI' },
    ];
    const { container } = render(<AlertPanel alerts={alerts} />);
    expect(container.textContent).toContain('Critical Issue');
    expect(container.textContent).toContain('Warning');
  });

  it('renders alert with action link', () => {
    const alerts = [
      { severity: 'warning' as const, title: 'Test', description: 'Desc', action: { label: 'Fix it', href: '/fix' } },
    ];
    const { container } = render(<AlertPanel alerts={alerts} />);
    expect(container.querySelector('a')).toBeTruthy();
  });
});
