import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PromptComposer } from '../PromptComposer';

describe('PromptComposer (Browser)', () => {
  it('renders title', async () => {
    const screen = await render(<PromptComposer />);
    await expect.element(screen.getByText('Prompt olusturucu')).toBeVisible();
  });

  it('renders scope buttons', async () => {
    const screen = await render(<PromptComposer />);
    await expect.element(screen.getByRole('button', { name: 'general' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'approval' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'policy' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'release' })).toBeVisible();
  });

  it('renders tone buttons', async () => {
    const screen = await render(<PromptComposer />);
    await expect.element(screen.getByRole('button', { name: 'neutral' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'strict' })).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'exploratory' })).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    await render(<PromptComposer />);
    const el = document.querySelector('[data-component="prompt-composer"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    await render(<PromptComposer access="hidden" />);
    expect(document.querySelector('[data-component="prompt-composer"]')).toBeNull();
  });

  it('renders disabled state', async () => {
    await render(<PromptComposer access="disabled" />);
    const el = document.querySelector('[data-access-state="disabled"]');
    expect(el).not.toBeNull();
  });

  it('renders custom title and description', async () => {
    const screen = await render(
      <PromptComposer title="Custom Composer" description="Write your prompt" />,
    );
    await expect.element(screen.getByText('Custom Composer')).toBeVisible();
    await expect.element(screen.getByText('Write your prompt')).toBeVisible();
  });

  it('renders guardrails when provided', async () => {
    const screen = await render(
      <PromptComposer guardrails={['No PII', 'No financial advice']} />,
    );
    await expect.element(screen.getByText('No PII')).toBeVisible();
    await expect.element(screen.getByText('No financial advice')).toBeVisible();
  });
});
