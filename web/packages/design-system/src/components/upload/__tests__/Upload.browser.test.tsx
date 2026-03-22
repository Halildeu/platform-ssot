import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Upload } from '../Upload';

describe('Upload (Browser)', () => {
  it('renders upload area', async () => {
    const screen = render(<Upload />);
    const input = screen.container.querySelector('input[type="file"]');
    expect(input).not.toBeNull();
  });

  it('renders with label', async () => {
    const screen = render(<Upload label="Attachment" />);
    await expect.element(screen.getByText('Attachment')).toBeVisible();
  });
});
