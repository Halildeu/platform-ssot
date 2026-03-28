import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { Steps } from '../Steps';

const stepItems = [
  { key: 'info', title: 'Information' },
  { key: 'review', title: 'Review' },
  { key: 'confirm', title: 'Confirm' },
];

describe('Steps (Browser)', () => {
  it('renders all step titles', async () => {
    const screen = await render(<Steps items={stepItems} current={0} />);
    await expect.element(screen.getByText('Information')).toBeVisible();
    await expect.element(screen.getByText('Review')).toBeVisible();
    await expect.element(screen.getByText('Confirm')).toBeVisible();
  });

  it('renders step descriptions', async () => {
    const screen = await render(
      <Steps
        items={[{ key: 's1', title: 'Step 1', description: 'First step detail' }]}
        current={0}
      />,
    );
    await expect.element(screen.getByText('First step detail')).toBeVisible();
  });

  it('calls onChange when step is clicked', async () => {
    const onChange = vi.fn();
    const screen = await render(<Steps items={stepItems} current={0} onChange={onChange} />);
    // Click the step button (indicator) for step 2 (Review)
    const stepBtn = screen.container.querySelector('button[aria-label*="Review"]') as HTMLElement;
    stepBtn.click();
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('renders data-component attribute', async () => {
    await render(<Steps items={stepItems} current={0} />);
    const el = document.querySelector('[data-component="steps"]');
    expect(el).not.toBeNull();
  });

  it('renders in vertical direction', async () => {
    const screen = await render(<Steps items={stepItems} current={0} direction="vertical" />);
    await expect.element(screen.getByText('Information')).toBeVisible();
  });

  it('renders disabled step', async () => {
    const screen = await render(
      <Steps items={[...stepItems, { key: 'disabled', title: 'Disabled', disabled: true }]} current={0} />,
    );
    await expect.element(screen.getByText('Disabled')).toBeVisible();
  });

  it('renders dot style variant', async () => {
    const screen = await render(<Steps items={stepItems} current={1} dot />);
    await expect.element(screen.getByText('Information')).toBeVisible();
    await expect.element(screen.getByText('Review')).toBeVisible();
  });

  it('renders error status on current step', async () => {
    const screen = await render(<Steps items={stepItems} current={1} status="error" />);
    await expect.element(screen.getByText('Review')).toBeVisible();
  });
});
