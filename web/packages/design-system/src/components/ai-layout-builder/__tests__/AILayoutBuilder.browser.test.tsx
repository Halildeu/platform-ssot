import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AILayoutBuilder } from '../AILayoutBuilder';

const sampleBlocks = [
  { key: 'b1', type: 'metric' as const, title: 'Revenue', content: <span>$1000</span> },
  { key: 'b2', type: 'chart' as const, title: 'Sales chart', content: <span>Chart</span> },
];

describe('AILayoutBuilder (Browser)', () => {
  it('renders blocks with their titles', async () => {
    const screen = render(<AILayoutBuilder blocks={sampleBlocks} />);
    await expect.element(screen.getByText('Revenue')).toBeVisible();
    await expect.element(screen.getByText('Sales chart')).toBeVisible();
  });

  it('renders block content', async () => {
    const screen = render(<AILayoutBuilder blocks={sampleBlocks} />);
    await expect.element(screen.getByText('$1000')).toBeVisible();
    await expect.element(screen.getByText('Chart')).toBeVisible();
  });

  it('renders with custom title and description', async () => {
    const screen = render(
      <AILayoutBuilder
        blocks={[{ key: 'b1', type: 'text', content: <span>Hello</span> }]}
        title="Dashboard"
        description="Overview of metrics"
      />,
    );
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
    await expect.element(screen.getByText('Overview of metrics')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<AILayoutBuilder blocks={sampleBlocks} />);
    const el = screen.container.querySelector('[data-component="ai-layout-builder"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<AILayoutBuilder blocks={sampleBlocks} access="hidden" />);
    expect(screen.container.textContent).toBe('');
  });

  it('renders disabled state', async () => {
    const screen = render(<AILayoutBuilder blocks={sampleBlocks} access="disabled" />);
    const el = screen.container.querySelector('[data-access-state="disabled"]');
    expect(el).not.toBeNull();
  });

  it('renders collapsible blocks', async () => {
    const screen = render(
      <AILayoutBuilder
        blocks={[{ key: 'c1', type: 'text', title: 'Collapsible', content: <span>Body</span>, collapsible: true }]}
      />,
    );
    await expect.element(screen.getByText('Collapsible')).toBeVisible();
  });

  it('sorts blocks by priority', async () => {
    const screen = render(
      <AILayoutBuilder
        blocks={[
          { key: 'low', type: 'text', title: 'Low', content: <span>L</span>, priority: 'low' },
          { key: 'high', type: 'metric', title: 'High', content: <span>H</span>, priority: 'high' },
        ]}
      />,
    );
    await expect.element(screen.getByText('High')).toBeVisible();
    await expect.element(screen.getByText('Low')).toBeVisible();
  });
});
