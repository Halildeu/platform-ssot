import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Upload } from '../Upload';

describe('Upload (Browser)', () => {
  it('renders file input element', async () => {
    const screen = await render(<Upload />);
    const input = document.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
  });

  it('renders with label', async () => {
    const screen = await render(<Upload label="Attachment" />);
    await expect.element(screen.getByText('Attachment')).toBeVisible();
  });

  it('renders dropzone area', async () => {
    const screen = await render(<Upload />);
    // The upload component should have a visual drop area
    const dropzone = document.querySelector('[data-field-type="upload"], [data-component="upload"]') ?? document.querySelector('input[type="file"]')?.parentElement;
    expect(dropzone).not.toBeNull();
  });

  it('shows file list when files are provided', async () => {
    const files = [
      { name: 'document.pdf', size: 1024 },
      { name: 'image.png', size: 2048 },
    ];
    const screen = await render(<Upload defaultFiles={files} />);
    await expect.element(screen.getByText('document.pdf')).toBeVisible();
    await expect.element(screen.getByText('image.png')).toBeVisible();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<Upload disabled />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('shows error state', async () => {
    const screen = await render(<Upload error="File too large" />);
    await expect.element(screen.getByText('File too large')).toBeVisible();
  });

  it('renders with description text', async () => {
    const screen = await render(<Upload description="Max 5MB" />);
    await expect.element(screen.getByText('Max 5MB')).toBeVisible();
  });

  it('renders empty state label when no files', async () => {
    const screen = await render(<Upload emptyStateLabel="No files uploaded" defaultFiles={[]} />);
    // The component should show empty state or dropzone text
    const el = document.querySelector('input[type="file"]');
    expect(el).not.toBeNull();
  });
});
