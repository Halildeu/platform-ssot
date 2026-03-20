// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TourCoachmarks, type TourCoachmarkStep } from '../TourCoachmarks';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeSteps = (): TourCoachmarkStep[] => [
  { id: 'intro', title: 'Welcome', description: 'This is the intro step.' },
  { id: 'setup', title: 'Setup', description: 'Configure your settings.' },
  { id: 'done', title: 'Finish', description: 'You are all set.' },
];

describe('TourCoachmarks contract', () => {
  it('has displayName', () => {
    expect(TourCoachmarks.displayName).toBe('TourCoachmarks');
  });

  it('renders when open', () => {
    render(<TourCoachmarks steps={makeSteps()} open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render dialog when closed', () => {
    render(<TourCoachmarks steps={makeSteps()} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders step title and description', () => {
    render(<TourCoachmarks steps={makeSteps()} open currentStep={0} />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('This is the intro step.')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<TourCoachmarks steps={makeSteps()} open className="custom-tour" />);
    expect(container.querySelector('.custom-tour')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<TourCoachmarks steps={makeSteps()} open showProgress />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('fires onStepChange on next click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<TourCoachmarks steps={makeSteps()} open onStepChange={handler} testIdPrefix="tour" />);
    await user.click(screen.getByTestId('tour-next'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('fires onFinish on last step', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<TourCoachmarks steps={makeSteps()} open currentStep={2} onFinish={handler} testIdPrefix="tour" />);
    await user.click(screen.getByTestId('tour-finish'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<TourCoachmarks steps={makeSteps()} open access="readonly" />);
    expect(container.querySelector('[data-access-state="readonly"]')).toBeInTheDocument();
  });
});

describe('TourCoachmarks — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<TourCoachmarks steps={makeSteps()} open />);
    await expectNoA11yViolations(container);
  });
});
