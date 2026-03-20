// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider } from '../Slider';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Slider — temel render', () => {
  it('range input render eder', () => {
    render(<Slider aria-label="test" />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Slider label="Volume" />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Slider label="Volume" description="Adjust the volume" />);
    expect(screen.getByText('Adjust the volume')).toBeInTheDocument();
  });

  it('hint render eder', () => {
    render(<Slider label="Volume" hint="Use arrow keys" />);
    expect(screen.getByText('Use arrow keys')).toBeInTheDocument();
  });

  it('error render eder', () => {
    render(<Slider label="Volume" error="Invalid value" />);
    expect(screen.getByText('Invalid value')).toBeInTheDocument();
  });

  it('varsayilan min=0 max=100 step=1', () => {
    render(<Slider aria-label="test" />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('min ve max label gosterir', () => {
    render(<Slider aria-label="test" min={0} max={100} />);
    // The min/max labels are rendered as spans
    const labels = screen.getAllByText(/^(0|100)$/);
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });

  it('custom minLabel ve maxLabel gosterir', () => {
    render(<Slider aria-label="test" minLabel="Quiet" maxLabel="Loud" />);
    expect(screen.getByText('Quiet')).toBeInTheDocument();
    expect(screen.getByText('Loud')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Value display                                                      */
/* ------------------------------------------------------------------ */

describe('Slider — value display', () => {
  it('mevcut degeri gosterir', () => {
    render(<Slider aria-label="test" value={42} onChange={() => {}} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('valueFormatter ile ozel format gosterir', () => {
    render(<Slider aria-label="test" value={75} onChange={() => {}} valueFormatter={(v) => `${v}%`} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('defaultValue ile uncontrolled calisir', () => {
    render(<Slider aria-label="test" defaultValue={30} />);
    expect(screen.getByRole('slider')).toHaveValue('30');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Slider — access control', () => {
  it('access="full" durumunda slider aktif olur', () => {
    render(<Slider aria-label="test" access="full" />);
    expect(screen.getByRole('slider')).not.toBeDisabled();
  });

  it('access="disabled" durumunda slider disabled olur', () => {
    render(<Slider aria-label="test" access="disabled" />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<Slider aria-label="test" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('accessReason title olarak atanir', () => {
    render(<Slider aria-label="test" accessReason="Yetkiniz yok" />);
    expect(screen.getByRole('slider')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Slider — interaction', () => {
  it('onChange handler calisir', () => {
    const handleChange = vi.fn();
    render(<Slider aria-label="test" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '50' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('onValueChange handler degeri ile calisir', () => {
    const handleValueChange = vi.fn();
    render(<Slider aria-label="test" onValueChange={handleValueChange} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
    expect(handleValueChange).toHaveBeenCalledWith(75, expect.any(Object));
  });

  it('disabled durumunda slider disabled olur', () => {
    render(<Slider aria-label="test" disabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Slider — a11y', () => {
  it('error durumunda aria-invalid true olur', () => {
    render(<Slider aria-label="test" error="Error!" />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
  });

  it('invalid prop aria-invalid true yapar', () => {
    render(<Slider aria-label="test" invalid />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
  });

  it('required durumunda required attribute eklenir', () => {
    render(<Slider aria-label="test" required />);
    expect(screen.getByRole('slider')).toHaveAttribute('required');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Slider — edge cases', () => {
  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Slider aria-label="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Slider aria-label="test" data-testid="custom-slider" />);
    expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
  });

  it('custom min, max, step desteklenir', () => {
    render(<Slider aria-label="test" min={10} max={200} step={5} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '200');
    expect(slider).toHaveAttribute('step', '5');
  });
});

describe('Slider — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Slider aria-label="test" />);
    await expectNoA11yViolations(container);
  });
});
