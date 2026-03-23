// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Checkbox — temel render', () => {
  it('checkbox elementini render eder', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Checkbox label="Accept" description="Please read terms first" />);
    expect(screen.getByText('Please read terms first')).toBeInTheDocument();
  });

  it('label ve description olmadan sadece checkbox render eder', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Checkbox — size proplari', () => {
  it('varsayilan size "md" dir', () => {
    const { container } = render(<Checkbox />);
    const box = container.querySelector('[aria-hidden]');
    expect(box?.className).toContain('h-4');
    expect(box?.className).toContain('w-4');
  });

  it.each([
    ['sm', 'h-3.5'],
    ['md', 'h-4'],
    ['lg', 'h-5'],
  ] as const)('size="%s" dogru boyut uygular', (size, expectedClass) => {
    const { container } = render(<Checkbox size={size} />);
    const box = container.querySelector('[aria-hidden]');
    expect(box?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Indeterminate state                                                */
/* ------------------------------------------------------------------ */

describe('Checkbox — indeterminate state', () => {
  it('indeterminate durumunda dash icon render eder', () => {
    const { container } = render(<Checkbox indeterminate />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const path = svg?.querySelector('path');
    expect(path?.getAttribute('d')).toContain('2.5 6h7');
  });

  it('checked durumunda checkmark icon render eder', () => {
    const { container } = render(<Checkbox checked onChange={() => {}} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const path = svg?.querySelector('path');
    expect(path?.getAttribute('d')).toContain('2.5 6L5 8.5');
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe('Checkbox — error state', () => {
  it('error durumunda error border class uygular', () => {
    const { container } = render(<Checkbox error />);
    const box = container.querySelector('[aria-hidden]');
    expect(box?.className).toContain('border-state-danger-text');
  });

  it('error olmadan default border class uygular', () => {
    const { container } = render(<Checkbox />);
    const box = container.querySelector('[aria-hidden]');
    expect(box?.className).toContain('border-border-default');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Checkbox — interaction', () => {
  it('onChange handler calisir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disabled durumunda checkbox disabled olur', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('disabled durumunda opacity uygulanir', () => {
    const { container } = render(<Checkbox disabled label="Disabled" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Error state — aria-invalid                                         */
/* ------------------------------------------------------------------ */

describe('Checkbox — error aria-invalid', () => {
  it('sets aria-invalid when error is true', () => {
    render(<Checkbox error />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-invalid when error is a string', () => {
    render(<Checkbox error="Required field" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Checkbox — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Checkbox className="custom-class" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('custom id kullanilabilir', () => {
    render(<Checkbox id="my-checkbox" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'my-checkbox');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Checkbox data-testid="custom-cb" />);
    expect(screen.getByTestId('custom-cb')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('Checkbox — loading state', () => {
  it('renders a spinner when loading=true', () => {
    const { container } = render(<Checkbox loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('disables the checkbox when loading=true', () => {
    render(<Checkbox loading />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not call onChange when loading', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox loading onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('hides check icon when loading (even if checked)', () => {
    const { container } = render(<Checkbox loading checked onChange={() => {}} />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    // The checkmark SVG should not be present; only the spinner SVG
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1); // only the spinner
  });

  it('applies opacity via disabled state when loading', () => {
    const { container } = render(<Checkbox loading label="Loading" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe('Checkbox — ref forwarding', () => {
  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled / uncontrolled parity                                   */
/* ------------------------------------------------------------------ */

describe('Checkbox — controlled/uncontrolled parity', () => {
  it('uncontrolled: renders without checked prop and toggles visually on click', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Terms" />);
    const cb = screen.getByRole('checkbox');

    expect(cb).not.toBeChecked();
    await user.click(cb);
    expect(cb).toBeChecked();
    await user.click(cb);
    expect(cb).not.toBeChecked();
  });

  it('controlled: calls onChange when clicked while checked={false}', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('controlled: does not toggle visual state without prop update', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    const cb = screen.getByRole('checkbox');

    await user.click(cb);
    // onChange fired but the component still reflects the controlled prop
    expect(cb).not.toBeChecked();
  });

  it('controlled: reflects prop update from false to true', () => {
    const { rerender } = render(<Checkbox checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<Checkbox checked={true} onChange={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultChecked)                                 */
/* ------------------------------------------------------------------ */

describe('Checkbox — uncontrolled mode (defaultChecked)', () => {
  it('renders with defaultChecked in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Checkbox defaultChecked label="Terms" />);
    const cb = screen.getByRole('checkbox');

    // Initially checked via defaultChecked
    expect(cb).toBeChecked();

    // Simulate user interaction — state should toggle internally
    await user.click(cb);
    expect(cb).not.toBeChecked();

    await user.click(cb);
    expect(cb).toBeChecked();
  });

  it('controlled checked prop overrides defaultChecked', () => {
    render(<Checkbox checked={false} defaultChecked onChange={() => {}} />);
    const cb = screen.getByRole('checkbox');
    // controlled prop (false) should win over defaultChecked (true)
    expect(cb).not.toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Checkbox — keyboard navigation', () => {
  it('toggles on Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    await user.type(checkbox, ' ');
    expect(onChange).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Checkbox — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    await expectNoA11yViolations(container);
  });
});
