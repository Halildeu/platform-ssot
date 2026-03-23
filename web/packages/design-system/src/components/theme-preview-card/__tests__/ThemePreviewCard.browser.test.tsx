import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemePreviewCard } from '../ThemePreviewCard';

describe('ThemePreviewCard (Browser)', () => {
  it('renders default text content', async () => {
    const screen = await render(<ThemePreviewCard />);
    await expect.element(screen.getByText('Baslik metni')).toBeVisible();
    await expect.element(screen.getByText('Ikincil metin')).toBeVisible();
  });

  it('renders save button label', async () => {
    const screen = await render(<ThemePreviewCard />);
    await expect.element(screen.getByText('Kaydet')).toBeVisible();
  });

  it('renders selected state with checkmark sr-only text', async () => {
    const screen = await render(<ThemePreviewCard selected />);
    await expect.element(screen.getByText('Secili tema onizlemesi')).toBeInTheDocument();
  });

  it('renders unselected state without checkmark', async () => {
    await render(<ThemePreviewCard selected={false} />);
    expect(document.querySelector('.sr-only')).toBeNull();
  });

  it('renders custom locale text', async () => {
    const screen = await render(
      <ThemePreviewCard
        localeText={{
          titleText: 'Title text',
          secondaryText: 'Secondary',
          saveLabel: 'Save',
        }}
      />,
    );
    await expect.element(screen.getByText('Title text')).toBeVisible();
    await expect.element(screen.getByText('Secondary')).toBeVisible();
    await expect.element(screen.getByText('Save')).toBeVisible();
  });

  it('applies custom className', async () => {
    await render(<ThemePreviewCard className="my-preview" />);
    const el = document.querySelector('.my-preview');
    expect(el).not.toBeNull();
  });

  it('renders with selected border styling', async () => {
    const screen = await render(<ThemePreviewCard selected />);
    await expect.element(screen.getByText('Baslik metni')).toBeVisible();
  });
});
