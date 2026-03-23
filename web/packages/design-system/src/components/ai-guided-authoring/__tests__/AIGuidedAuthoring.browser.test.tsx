import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';

describe('AIGuidedAuthoring (Browser)', () => {
  it('renders default title', async () => {
    const screen = await render(<AIGuidedAuthoring />);
    await expect.element(screen.getByText('AI guided authoring')).toBeVisible();
  });

  it('renders with recommendations', async () => {
    const screen = await render(
      <AIGuidedAuthoring
        recommendations={[
          { id: 'r1', title: 'Rec 1', summary: 'Summary 1' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Rec 1')).toBeVisible();
  });

  it('renders confidence badge with level', async () => {
    const screen = await render(
      <AIGuidedAuthoring confidenceLevel="high" confidenceScore={95} />,
    );
    await expect.element(screen.getByText(/Yuksek guven/)).toBeVisible();
  });

  it('renders custom title and description', async () => {
    const screen = await render(
      <AIGuidedAuthoring title="Custom Title" description="Custom Desc" />,
    );
    await expect.element(screen.getByText('Custom Title')).toBeVisible();
    await expect.element(screen.getByText('Custom Desc')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<AIGuidedAuthoring access="hidden" />);
    expect(screen.container.innerHTML.trim()).toBe('');
  });

  it('renders disabled state', async () => {
    await render(<AIGuidedAuthoring access="disabled" />);
    const el = document.querySelector('[data-access-state="disabled"]');
    expect(el).not.toBeNull();
  });

  it('renders data-component attribute', async () => {
    await render(<AIGuidedAuthoring />);
    const el = document.querySelector('[data-component="ai-guided-authoring"]');
    expect(el).not.toBeNull();
  });

  it('renders multiple recommendations', async () => {
    const screen = await render(
      <AIGuidedAuthoring
        recommendations={[
          { id: 'r1', title: 'First', summary: 'S1' },
          { id: 'r2', title: 'Second', summary: 'S2' },
        ]}
      />,
    );
    await expect.element(screen.getByText('First')).toBeVisible();
    await expect.element(screen.getByText('Second')).toBeVisible();
  });
});
