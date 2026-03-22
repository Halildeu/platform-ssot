import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { RecommendationCard } from '../RecommendationCard';

describe('RecommendationCard (Browser)', () => {
  it('renders title and summary', async () => {
    const screen = render(
      <RecommendationCard title="Upgrade Node" summary="Node 20 is recommended" />,
    );
    await expect.element(screen.getByText('Upgrade Node')).toBeVisible();
    await expect.element(screen.getByText('Node 20 is recommended')).toBeVisible();
  });

  it('renders default action buttons', async () => {
    const screen = render(
      <RecommendationCard title="Test" summary="Summary" />,
    );
    await expect.element(screen.getByText('Apply')).toBeVisible();
    await expect.element(screen.getByText('Review')).toBeVisible();
  });

  it('renders custom action labels', async () => {
    const screen = render(
      <RecommendationCard title="T" summary="S" primaryActionLabel="Accept" secondaryActionLabel="Skip" />,
    );
    await expect.element(screen.getByText('Accept')).toBeVisible();
    await expect.element(screen.getByText('Skip')).toBeVisible();
  });

  it('calls onPrimaryAction when apply is clicked', async () => {
    const onPrimary = vi.fn();
    const screen = render(
      <RecommendationCard title="T" summary="S" onPrimaryAction={onPrimary} />,
    );
    await screen.getByText('Apply').click();
    expect(onPrimary).toHaveBeenCalledOnce();
  });

  it('calls onSecondaryAction when review is clicked', async () => {
    const onSecondary = vi.fn();
    const screen = render(
      <RecommendationCard title="T" summary="S" onSecondaryAction={onSecondary} />,
    );
    await screen.getByText('Review').click();
    expect(onSecondary).toHaveBeenCalledOnce();
  });

  it('renders data-tone attribute', async () => {
    const screen = render(
      <RecommendationCard title="T" summary="S" tone="warning" />,
    );
    const el = screen.container.querySelector('[data-tone="warning"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(
      <RecommendationCard title="T" summary="S" access="hidden" />,
    );
    expect(screen.container.textContent).toBe('');
  });

  it('renders confidence badge', async () => {
    const screen = render(
      <RecommendationCard title="T" summary="S" confidenceLevel="high" confidenceScore={90} />,
    );
    await expect.element(screen.getByText(/Yuksek guven/)).toBeVisible();
  });
});
