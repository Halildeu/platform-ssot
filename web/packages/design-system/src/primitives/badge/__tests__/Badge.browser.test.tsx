import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Badge } from '../Badge';

describe('Badge (Browser)', () => {
  it('renders with text', async () => {
    const screen = render(<Badge>New</Badge>);
    await expect.element(screen.getByText('New')).toBeVisible();
  });

  it('renders different variants', async () => {
    const screen = render(
      <div>
        <Badge variant="success">Success</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="warning">Warning</Badge>
      </div>,
    );
    await expect.element(screen.getByText('Success')).toBeVisible();
    await expect.element(screen.getByText('Error')).toBeVisible();
    await expect.element(screen.getByText('Warning')).toBeVisible();
  });

  it('renders as a dot', async () => {
    const screen = render(<Badge dot variant="success" data-testid="dot-badge" />);
    await expect.element(screen.getByTestId('dot-badge')).toBeVisible();
  });
});
