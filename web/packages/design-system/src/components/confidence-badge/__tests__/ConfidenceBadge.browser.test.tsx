import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ConfidenceBadge } from '../ConfidenceBadge';

describe('ConfidenceBadge (Browser)', () => {
  it('renders with default medium level', async () => {
    const screen = await render(<ConfidenceBadge />);
    await expect.element(screen.getByText('Orta guven')).toBeVisible();
  });

  it('renders high level with score and source count', async () => {
    const screen = await render(<ConfidenceBadge level="high" score={92} sourceCount={5} />);
    await expect.element(screen.getByText('Yuksek guven · 92% · 5 sources')).toBeVisible();
  });

  it('renders low confidence level', async () => {
    const screen = await render(<ConfidenceBadge level="low" />);
    await expect.element(screen.getByText('Dusuk guven')).toBeVisible();
  });

  it('renders very-high confidence level', async () => {
    const screen = await render(<ConfidenceBadge level="very-high" />);
    await expect.element(screen.getByText('Cok yuksek guven')).toBeVisible();
  });

  it('renders aria-label with confidence level', async () => {
    await render(<ConfidenceBadge level="high" />);
    const el = document.querySelector('[aria-label="Yuksek guven"]');
    expect(el).not.toBeNull();
  });

  it('renders data-confidence-level attribute', async () => {
    await render(<ConfidenceBadge level="low" />);
    const el = document.querySelector('[data-confidence-level="low"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<ConfidenceBadge access="hidden" />);
    expect(screen.container.querySelector('[data-confidence-level]')).toBeNull();
  });

  it('renders compact mode without source count', async () => {
    const screen = await render(<ConfidenceBadge level="high" score={88} sourceCount={3} compact />);
    await expect.element(screen.getByText('Yuksek guven · 88%')).toBeVisible();
  });
});
