import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ConfidenceBadge } from '../ConfidenceBadge';

describe('ConfidenceBadge (Browser)', () => {
  it('renders with default level', async () => {
    const screen = render(<ConfidenceBadge />);
    await expect.element(screen.getByText('Orta guven')).toBeVisible();
  });

  it('renders with score and source count', async () => {
    const screen = render(<ConfidenceBadge level="high" score={92} sourceCount={5} />);
    await expect.element(screen.getByText('Yuksek guven · 92% · 5 sources')).toBeVisible();
  });
});
