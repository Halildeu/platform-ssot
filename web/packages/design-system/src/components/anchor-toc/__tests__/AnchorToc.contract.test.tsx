// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnchorToc } from '../AnchorToc';
import type { AnchorTocItem } from '../AnchorToc';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const items: AnchorTocItem[] = [
  { id: 'intro', label: 'Introduction' },
  { id: 'setup', label: 'Setup' },
  { id: 'api', label: 'API Reference', level: 2 },
];

describe('AnchorToc contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(AnchorToc.displayName).toBe('AnchorToc');
  });

  /* ---- Default render ---- */
  it('renders all items', () => {
    render(<AnchorToc items={items} syncWithHash={false} />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Setup')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('renders nav with aria-label', () => {
    render(<AnchorToc items={items} syncWithHash={false} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Sayfa ici navigasyon');
  });

  /* ---- Item count badge ---- */
  it('shows item count', () => {
    render(<AnchorToc items={items} syncWithHash={false} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  /* ---- Default title ---- */
  it('renders default title', () => {
    render(<AnchorToc items={items} syncWithHash={false} />);
    expect(screen.getByText('Bu sayfada')).toBeInTheDocument();
  });

  /* ---- Callback: onValueChange ---- */
  it('calls onValueChange when item is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<AnchorToc items={items} syncWithHash={false} onValueChange={handler} />);
    await user.click(screen.getByText('Setup'));
    expect(handler).toHaveBeenCalledWith('setup');
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    render(<AnchorToc items={items} syncWithHash={false} className="my-toc" />);
    expect(screen.getByRole('navigation').className).toContain('my-toc');
  });

  /* ---- Empty items renders nothing ---- */
  it('renders nothing when items is empty', () => {
    const { container } = render(<AnchorToc items={[]} syncWithHash={false} />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<AnchorToc items={items} access="hidden" syncWithHash={false} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('AnchorToc — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AnchorToc items={items} syncWithHash={false} />);
    await expectNoA11yViolations(container);
  });
});
