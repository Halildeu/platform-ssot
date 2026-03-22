import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Tag } from '../Tag';

describe('Tag (Browser)', () => {
  it('renders with text', async () => {
    const screen = render(<Tag>Active</Tag>);
    await expect.element(screen.getByText('Active')).toBeVisible();
  });

  it('renders closable tag with remove button', async () => {
    const screen = render(<Tag closable>Removable</Tag>);
    await expect.element(screen.getByText('Removable')).toBeVisible();
    await expect.element(screen.getByLabelText('Remove')).toBeVisible();
  });

  it('renders different color variants', async () => {
    const screen = render(
      <div>
        <Tag variant="success">Success</Tag>
        <Tag variant="error">Error</Tag>
        <Tag variant="warning">Warning</Tag>
      </div>,
    );
    await expect.element(screen.getByText('Success')).toBeVisible();
    await expect.element(screen.getByText('Error')).toBeVisible();
    await expect.element(screen.getByText('Warning')).toBeVisible();
  });
});
