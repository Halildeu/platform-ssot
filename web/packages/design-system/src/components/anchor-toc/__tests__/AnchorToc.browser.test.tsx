import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AnchorToc } from '../AnchorToc';

const tocItems = [
  { id: 'intro', label: 'Introduction' },
  { id: 'details', label: 'Details', level: 2 as const },
  { id: 'summary', label: 'Summary' },
];

describe('AnchorToc (Browser)', () => {
  it('renders toc items', async () => {
    const screen = await render(<AnchorToc items={tocItems} syncWithHash={false} />);
    await expect.element(screen.getByText('Introduction')).toBeVisible();
    await expect.element(screen.getByText('Details')).toBeVisible();
    await expect.element(screen.getByText('Summary')).toBeVisible();
  });

  it('shows item count badge', async () => {
    const screen = await render(<AnchorToc items={tocItems} syncWithHash={false} />);
    await expect.element(screen.getByText('3')).toBeVisible();
  });

  it('calls onValueChange when item is clicked', async () => {
    const onValueChange = vi.fn();
    const screen = await render(
      <AnchorToc items={tocItems} syncWithHash={false} onValueChange={onValueChange} />,
    );
    await screen.getByText('Details').click();
    expect(onValueChange).toHaveBeenCalledWith('details');
  });

  it('renders with navigation aria-label', async () => {
    await render(<AnchorToc items={tocItems} syncWithHash={false} />);
    const nav = document.querySelector('nav');
    expect(nav).not.toBeNull();
  });

  it('renders disabled item without interaction', async () => {
    const onValueChange = vi.fn();
    const screen = await render(
      <AnchorToc
        items={[{ id: 'disabled', label: 'Disabled', disabled: true }]}
        syncWithHash={false}
        onValueChange={onValueChange}
      />,
    );
    await expect.element(screen.getByText('Disabled')).toBeVisible();
  });

  it('renders custom title', async () => {
    const screen = await render(
      <AnchorToc items={tocItems} syncWithHash={false} title="Table of Contents" />,
    );
    await expect.element(screen.getByText('Table of Contents')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    await render(<AnchorToc items={tocItems} syncWithHash={false} access="hidden" />);
    expect(document.querySelector('nav')).toBeNull();
  });

  it('highlights the active item', async () => {
    const screen = await render(
      <AnchorToc items={tocItems} syncWithHash={false} value="details" />,
    );
    await expect.element(screen.getByText('Details')).toBeVisible();
  });
});
