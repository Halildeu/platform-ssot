import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PromptComposer } from '../PromptComposer';

describe('PromptComposer (Browser)', () => {
  it('renders title and scope buttons', async () => {
    const screen = render(<PromptComposer />);
    await expect.element(screen.getByText('Prompt olusturucu')).toBeVisible();
    await expect.element(screen.getByText('general')).toBeVisible();
  });

  it('renders tone buttons', async () => {
    const screen = render(<PromptComposer />);
    await expect.element(screen.getByText('neutral')).toBeVisible();
    await expect.element(screen.getByText('strict')).toBeVisible();
  });
});
