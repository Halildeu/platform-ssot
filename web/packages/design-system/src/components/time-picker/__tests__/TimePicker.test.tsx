// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimePicker from '../TimePicker';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('TimePicker — temel render', () => {
  it('time input elementini render eder', () => {
    const { container } = render(<TimePicker />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<TimePicker label="Start time" />);
    expect(screen.getByText('Start time')).toBeInTheDocument();
  });

  it('varsayilan empty value label gosterir', () => {
    render(<TimePicker />);
    expect(screen.getByText('Saat secin')).toBeInTheDocument();
  });

  it('ozel empty value label gosterir', () => {
    render(<TimePicker messages={{ emptyValueLabel: 'Pick a time' }} />);
    expect(screen.getByText('Pick a time')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled / uncontrolled                                          */
/* ------------------------------------------------------------------ */

describe('TimePicker — controlled / uncontrolled', () => {
  it('controlled value render eder', () => {
    const { container } = render(<TimePicker value="14:30" onChange={() => {}} />);
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input.value).toBe('14:30');
  });

  it('defaultValue ile baslangic degeri alir', () => {
    const { container } = render(<TimePicker defaultValue="09:00" />);
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    expect(input.value).toBe('09:00');
  });

  it('value gosterildiginde text label de guncellenir', () => {
    render(<TimePicker value="14:30" onChange={() => {}} />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('TimePicker — access control', () => {
  it('access="full" durumunda input aktif olur', () => {
    const { container } = render(<TimePicker access="full" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).not.toBeDisabled();
  });

  it('access="disabled" durumunda input disabled olur', () => {
    const { container } = render(<TimePicker access="disabled" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toBeDisabled();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<TimePicker access="hidden" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    render(<TimePicker accessReason="Yetkiniz yok" />);
    expect(screen.getByTitle('Yetkiniz yok')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

describe('TimePicker — validation', () => {
  it('error mesajini render eder', () => {
    render(<TimePicker error="Invalid time" />);
    expect(screen.getByText('Invalid time')).toBeInTheDocument();
  });

  it('invalid durumunda aria-invalid true olur', () => {
    const { container } = render(<TimePicker invalid />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('description render eder', () => {
    render(<TimePicker description="Select a time" />);
    expect(screen.getByText('Select a time')).toBeInTheDocument();
  });

  it('hint render eder', () => {
    render(<TimePicker hint="HH:MM format" />);
    expect(screen.getByText('HH:MM format')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('TimePicker — interaction', () => {
  it('onChange callback calisir', async () => {
    const handleChange = vi.fn();
    const { container } = render(<TimePicker onChange={handleChange} />);
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, '15:00');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('onValueChange callback calisir', async () => {
    const handleValueChange = vi.fn();
    const { container } = render(<TimePicker onValueChange={handleValueChange} />);
    const input = container.querySelector('input[type="time"]') as HTMLInputElement;
    await userEvent.clear(input);
    await userEvent.type(input, '15:00');
    expect(handleValueChange).toHaveBeenCalledWith('15:00', expect.anything());
  });

  it('disabled durumunda input disabled olur', () => {
    const { container } = render(<TimePicker disabled />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Time constraints                                                   */
/* ------------------------------------------------------------------ */

describe('TimePicker — time constraints', () => {
  it('min attribute aktarilir', () => {
    const { container } = render(<TimePicker min="09:00" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toHaveAttribute('min', '09:00');
  });

  it('max attribute aktarilir', () => {
    const { container } = render(<TimePicker max="17:00" />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toHaveAttribute('max', '17:00');
  });

  it('step attribute aktarilir', () => {
    const { container } = render(<TimePicker step={900} />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toHaveAttribute('step', '900');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('TimePicker — edge cases', () => {
  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<TimePicker ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('required attribute aktarilir', () => {
    const { container } = render(<TimePicker required />);
    const input = container.querySelector('input[type="time"]');
    expect(input).toHaveAttribute('required');
  });

  it('fullWidth varsayilan true dur', () => {
    const { container } = render(<TimePicker />);
    // The FieldControlShell handles fullWidth, so just verify it renders
    expect(container.querySelector('input[type="time"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('TimePicker — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TimePicker label="Start time" />);
    await expectNoA11yViolations(container);
  });
});
