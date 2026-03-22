import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemePreviewCard } from '../ThemePreviewCard';

describe('ThemePreviewCard (Browser)', () => {
  it('renders preview card', async () => {
    const screen = render(<ThemePreviewCard />);
    await expect.element(screen.getByText('Baslik metni')).toBeVisible();
    await expect.element(screen.getByText('Kaydet')).toBeVisible();
  });

  it('renders selected state with checkmark', async () => {
    const screen = render(<ThemePreviewCard selected />);
    await expect.element(screen.getByText('Baslik metni')).toBeVisible();
  });
});
