import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { PromptComposer } from '../PromptComposer';

describe('PromptComposer (Browser)', () => {
  it('renders title', async () => {
    const screen = render(<PromptComposer />);
    await expect.element(screen.getByText('Prompt olusturucu')).toBeVisible();
  });

  it('renders scope buttons', async () => {
    const screen = render(<PromptComposer />);
    await expect.element(screen.getByText('general')).toBeVisible();
    await expect.element(screen.getByText('approval')).toBeVisible();
    await expect.element(screen.getByText('policy')).toBeVisible();
    await expect.element(screen.getByText('release')).toBeVisible();
  });

  it('renders tone buttons', async () => {
    const screen = render(<PromptComposer />);
    await expect.element(screen.getByText('neutral')).toBeVisible();
    await expect.element(screen.getByText('strict')).toBeVisible();
    await expect.element(screen.getByText('exploratory')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<PromptComposer />);
    const el = screen.container.querySelector('[data-component="prompt-composer"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<PromptComposer access="hidden" />);
    expect(screen.container.querySelector('[data-component="prompt-composer"]')).toBeNull();
  });

  it('renders disabled state', async () => {
    const screen = render(<PromptComposer access="disabled" />);
    const el = screen.container.querySelector('[data-access-state="disabled"]');
    expect(el).not.toBeNull();
  });

  it('renders custom title and description', async () => {
    const screen = render(
      <PromptComposer title="Custom Composer" description="Write your prompt" />,
    );
    await expect.element(screen.getByText('Custom Composer')).toBeVisible();
    await expect.element(screen.getByText('Write your prompt')).toBeVisible();
  });

  it('renders guardrails when provided', async () => {
    const screen = render(
      <PromptComposer guardrails={['No PII', 'No financial advice']} />,
    );
    await expect.element(screen.getByText('No PII')).toBeVisible();
    await expect.element(screen.getByText('No financial advice')).toBeVisible();
  });
});
