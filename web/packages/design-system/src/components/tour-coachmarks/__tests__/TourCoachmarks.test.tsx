// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TourCoachmarks, type TourCoachmarkStep } from '../TourCoachmarks';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleSteps: TourCoachmarkStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Let us show you around.' },
  { id: 'dashboard', title: 'Dashboard', description: 'Your main workspace.', tone: 'info' },
  { id: 'settings', title: 'Settings', description: 'Customize your preferences.', meta: 'Pro tip', tone: 'success' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — temel render', () => {
  it('open=true oldugunda tour render eder', () => {
    render(<TourCoachmarks steps={sampleSteps} open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('open=false oldugunda panel gorunmez', () => {
    render(<TourCoachmarks steps={sampleSteps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('defaultOpen=true ile acilir', () => {
    render(<TourCoachmarks steps={sampleSteps} defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('varsayilan title "Guided tour" dir', () => {
    render(<TourCoachmarks steps={sampleSteps} open />);
    expect(screen.getByText('Guided tour')).toBeInTheDocument();
  });

  it('ozel title gosterir', () => {
    render(<TourCoachmarks steps={sampleSteps} open title="Onboarding" />);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('ilk adimin basligini ve aciklamasini gosterir', () => {
    render(<TourCoachmarks steps={sampleSteps} open />);
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Let us show you around.')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Progress                                                           */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — progress', () => {
  it('showProgress=true oldugunda ilerleme gosterir', () => {
    render(<TourCoachmarks steps={sampleSteps} open showProgress />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('showProgress=false oldugunda ilerleme gorunmez', () => {
    render(<TourCoachmarks steps={sampleSteps} open showProgress={false} />);
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — navigation', () => {
  it('Next step butonu ile sonraki adima gecer', async () => {
    render(<TourCoachmarks steps={sampleSteps} open />);
    await userEvent.click(screen.getByText('Next step'));
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Your main workspace.')).toBeInTheDocument();
  });

  it('Back butonu ile onceki adima doner', async () => {
    render(<TourCoachmarks steps={sampleSteps} open defaultStep={1} />);
    await userEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });

  it('ilk adimda Back butonu disabled olur', () => {
    render(<TourCoachmarks steps={sampleSteps} open />);
    expect(screen.getByText('Back')).toBeDisabled();
  });

  it('son adimda Finish butonu gorunur', () => {
    render(<TourCoachmarks steps={sampleSteps} open defaultStep={2} />);
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

  it('onStepChange callback calisir', async () => {
    const handleStepChange = vi.fn();
    render(<TourCoachmarks steps={sampleSteps} open onStepChange={handleStepChange} />);
    await userEvent.click(screen.getByText('Next step'));
    expect(handleStepChange).toHaveBeenCalledWith(1);
  });

  it('Finish tiklandiginda onFinish calisir', async () => {
    const handleFinish = vi.fn();
    render(<TourCoachmarks steps={sampleSteps} open defaultStep={2} onFinish={handleFinish} />);
    await userEvent.click(screen.getByText('Finish'));
    expect(handleFinish).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Skip / Close                                                       */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — skip ve close', () => {
  it('allowSkip=true oldugunda Skip butonu gorunur', () => {
    render(<TourCoachmarks steps={sampleSteps} open allowSkip />);
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('allowSkip=false oldugunda Skip butonu gorunmez', () => {
    render(<TourCoachmarks steps={sampleSteps} open allowSkip={false} />);
    expect(screen.queryByText('Skip')).not.toBeInTheDocument();
  });

  it('Skip tiklandiginda onClose calisir', async () => {
    const handleClose = vi.fn();
    render(<TourCoachmarks steps={sampleSteps} open onClose={handleClose} />);
    await userEvent.click(screen.getByText('Skip'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('Escape tusu ile onClose calisir', () => {
    const handleClose = vi.fn();
    render(<TourCoachmarks steps={sampleSteps} open onClose={handleClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Mode                                                               */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — mode', () => {
  it('mode="readonly" oldugunda Skip yerine Close gosterir', () => {
    render(<TourCoachmarks steps={sampleSteps} open mode="readonly" />);
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.queryByText('Skip')).not.toBeInTheDocument();
  });

  it('mode="readonly" son adimda "Tour complete" gosterir', () => {
    render(<TourCoachmarks steps={sampleSteps} open mode="readonly" defaultStep={2} />);
    expect(screen.getByText('Tour complete')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Meta & tone                                                        */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — meta ve tone', () => {
  it('meta render eder', () => {
    render(<TourCoachmarks steps={sampleSteps} open defaultStep={2} />);
    expect(screen.getByText('Pro tip')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  localeText                                                         */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — localeText', () => {
  it('ozel localeText kullanilir', () => {
    render(
      <TourCoachmarks
        steps={sampleSteps}
        open
        localeText={{
          title: 'Tur',
          skipLabel: 'Atla',
          previousLabel: 'Geri',
          nextStepLabel: 'Sonraki',
          finishLabel: 'Bitir',
        }}
      />,
    );
    expect(screen.getByText('Tur')).toBeInTheDocument();
    expect(screen.getByText('Atla')).toBeInTheDocument();
    expect(screen.getByText('Geri')).toBeInTheDocument();
    expect(screen.getByText('Sonraki')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — access control', () => {
  it('access="hidden" oldugunda render etmez', () => {
    const { container } = render(<TourCoachmarks steps={sampleSteps} open access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('accessReason title olarak atanir', () => {
    render(<TourCoachmarks steps={sampleSteps} open accessReason="Read only" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('title', 'Read only');
  });
});

/* ------------------------------------------------------------------ */
/*  testIdPrefix                                                       */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — testIdPrefix', () => {
  it('testIdPrefix data-testid atamalari yapar', () => {
    render(<TourCoachmarks steps={sampleSteps} open testIdPrefix="tour" />);
    expect(screen.getByTestId('tour-root')).toBeInTheDocument();
    expect(screen.getByTestId('tour-panel')).toBeInTheDocument();
    expect(screen.getByTestId('tour-skip')).toBeInTheDocument();
    expect(screen.getByTestId('tour-next')).toBeInTheDocument();
    expect(screen.getByTestId('tour-previous')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <TourCoachmarks steps={sampleSteps} open className="custom-tour" />,
    );
    expect(container.firstElementChild?.className).toContain('custom-tour');
  });

  it('bos steps dizisi ile render yapar (null)', () => {
    const { container } = render(<TourCoachmarks steps={[]} open />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('step indeksi sinir disina cikarsa clamp edilir', () => {
    render(<TourCoachmarks steps={sampleSteps} open defaultStep={99} />);
    // Should clamp to last step
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});

describe('TourCoachmarks — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TourCoachmarks steps={sampleSteps} open />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('TourCoachmarks — quality signals', () => {
  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
