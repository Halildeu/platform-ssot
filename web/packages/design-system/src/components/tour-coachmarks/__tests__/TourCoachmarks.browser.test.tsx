import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { TourCoachmarks } from '../TourCoachmarks';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'This is the first step.' },
  { id: 'feature', title: 'Feature', description: 'Here is a feature.' },
  { id: 'done', title: 'Done', description: 'Tour complete.' },
];

describe('TourCoachmarks (Browser)', () => {
  it('renders tour step when open', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen />);
    await expect.element(screen.getByText('Welcome')).toBeVisible();
    await expect.element(screen.getByText('This is the first step.')).toBeVisible();
  });

  it('shows progress counter', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen />);
    await expect.element(screen.getByText('1 / 3')).toBeVisible();
  });

  it('renders nothing when not open', async () => {
    const screen = render(<TourCoachmarks steps={steps} open={false} />);
    expect(screen.container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders next button', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen />);
    await expect.element(screen.getByText(/Sonraki|Next/)).toBeVisible();
  });

  it('renders skip button when allowSkip is true', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen allowSkip />);
    await expect.element(screen.getByText(/Atla|Skip/)).toBeVisible();
  });

  it('calls onClose when skip is clicked', async () => {
    const onClose = vi.fn();
    const screen = render(<TourCoachmarks steps={steps} defaultOpen allowSkip onClose={onClose} />);
    await screen.getByText(/Atla|Skip/).click();
    expect(onClose).toHaveBeenCalled();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<TourCoachmarks steps={steps} defaultOpen access="hidden" />);
    expect(screen.container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('navigates to next step on next button click', async () => {
    const onStepChange = vi.fn();
    const screen = render(
      <TourCoachmarks steps={steps} defaultOpen onStepChange={onStepChange} />,
    );
    await screen.getByText(/Sonraki|Next/).click();
    expect(onStepChange).toHaveBeenCalledWith(1);
  });
});
