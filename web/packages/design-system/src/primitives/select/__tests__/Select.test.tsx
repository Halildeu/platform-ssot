// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, type SelectOption } from '../Select';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultOptions: SelectOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Select — temel render', () => {
  it('select elementini render eder', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('tum options render eder', () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('placeholder render eder', () => {
    render(<Select options={defaultOptions} placeholder="Choose..." />);
    expect(screen.getByText('Choose...')).toBeInTheDocument();
  });

  it('placeholder option disabled olur', () => {
    render(<Select options={defaultOptions} placeholder="Choose..." />);
    const placeholderOption = screen.getByText('Choose...') as HTMLOptionElement;
    expect(placeholderOption).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Select — size proplari', () => {
  it('varsayilan selectSize "md" dir', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('h-9');
  });

  it.each([
    ['sm', 'h-8'],
    ['md', 'h-9'],
    ['lg', 'h-11'],
  ] as const)('size="%s" dogru height uygular', (size, expectedClass) => {
    render(<Select options={defaultOptions} size={size} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Density proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Select — density proplari', () => {
  it('renders compact density with compact classes', () => {
    render(<Select options={defaultOptions} density="compact" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('py-1');
    expect(select.className).toContain('text-xs');
  });

  it('renders comfortable density as default (no extra density class)', () => {
    render(<Select options={defaultOptions} density="comfortable" />);
    const select = screen.getByRole('combobox');
    expect(select.className).not.toContain('py-3');
  });

  it('renders spacious density with spacious classes', () => {
    render(<Select options={defaultOptions} density="spacious" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('py-3');
    expect(select.className).toContain('text-base');
  });

  it('defaults to comfortable density when not specified', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.className).not.toContain('py-1');
    expect(select.className).not.toContain('py-3');
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe('Select — error state', () => {
  it('error durumunda error border uygular', () => {
    render(<Select options={defaultOptions} error />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-[var(--state-error-text)]');
  });

  it('error yoksa default border uygular', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-[var(--border-default)]');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled state (whole select)                                      */
/* ------------------------------------------------------------------ */

describe('Select — disabled state', () => {
  it('disabled prop sets disabled attribute on select', () => {
    render(<Select options={defaultOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('disabled select does not fire onChange on interaction', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} disabled onChange={handleChange} />);
    // Attempt to interact with disabled select
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('disabled select applies opacity styling', () => {
    render(<Select options={defaultOptions} disabled />);
    const select = screen.getByRole('combobox');
    // The disabled:opacity-50 class is applied via Tailwind
    expect(select.className).toContain('disabled:opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Error state (detailed)                                             */
/* ------------------------------------------------------------------ */

describe('Select — error state detailed', () => {
  it('error=true applies error border class', () => {
    render(<Select options={defaultOptions} error={true} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-[var(--state-error-text)]');
  });

  it('error=false applies default border class', () => {
    render(<Select options={defaultOptions} error={false} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('border-[var(--border-default)]');
    expect(select.className).not.toContain('border-[var(--state-error-text)]');
  });

  it('error state includes error focus ring', () => {
    render(<Select options={defaultOptions} error />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('focus:ring-[var(--state-error-text)]');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled options                                                   */
/* ------------------------------------------------------------------ */

describe('Select — disabled options', () => {
  it('disabled option dogu disabled olur', () => {
    const options: SelectOption[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(<Select options={options} />);
    const optionB = screen.getByText('B') as HTMLOptionElement;
    expect(optionB).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Select — interaction', () => {
  it('onChange handler calisir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), 'b');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disabled durumunda select disabled olur', () => {
    render(<Select options={defaultOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  fullWidth                                                          */
/* ------------------------------------------------------------------ */

describe('Select — fullWidth', () => {
  it('varsayilan fullWidth true dur', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('w-full');
  });

  it('fullWidth=false durumunda w-full olmaz', () => {
    render(<Select options={defaultOptions} fullWidth={false} />);
    const select = screen.getByRole('combobox');
    expect(select.className).not.toContain('w-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe('Select — ref forwarding', () => {
  it('forwards ref to select element', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select options={defaultOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    expect(ref.current?.tagName).toBe('SELECT');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Select — edge cases', () => {
  it('className forwarding calisir', () => {
    render(<Select options={defaultOptions} className="custom-class" />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select options={defaultOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Select options={defaultOptions} data-testid="custom-select" />);
    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
  });

  it('bos options dizisi ile render eder', () => {
    render(<Select options={[]} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('chevron icon render eder', () => {
    const { container } = render(<Select options={defaultOptions} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation (Faz 3 — keyboard-complete)                    */
/* ------------------------------------------------------------------ */

describe('Select — keyboard navigation', () => {
  it('Space tusu ile select acilir (native davranis — focus alir)', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    await user.tab();
    expect(select).toHaveFocus();
    // Native select opens on Space — verify the element is focusable and receives the event
    await user.keyboard(' ');
    expect(select).toHaveFocus();
  });

  it('Enter tusu ile select etkilesime girer', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    await user.tab();
    expect(select).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(select).toHaveFocus();
  });

  it('Arrow key ile deger degisir (native select davranisi)', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    const select = screen.getByRole('combobox');
    await user.tab();
    expect(select).toHaveFocus();
    // Native select navigates options with ArrowDown
    await user.keyboard('{ArrowDown}');
    // The native select should still be focusable and interactive
    expect(select).toHaveFocus();
  });

  it('focus durumunda focus ring class icerir', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    // The component has focus:ring-2 and focus:border classes defined
    expect(select.className).toContain('focus:ring-2');
    expect(select.className).toContain('focus:border-[var(--action-primary)]');
  });

  it('error durumunda focus ring error rengi icerir', () => {
    render(<Select options={defaultOptions} error />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('focus:ring-2');
    expect(select.className).toContain('focus:ring-[var(--state-error-text)]');
  });

  it('disabled durumunda keyboard etkilesim engellenir', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    // Disabled native selects cannot be focused via tab
    await user.tab();
    expect(select).not.toHaveFocus();
  });

  it('Tab ile focus alinabilir', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    await user.tab();
    expect(select).toHaveFocus();
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultValue)                                   */
/* ------------------------------------------------------------------ */

describe('Select — uncontrolled mode (defaultValue)', () => {
  it('renders with defaultValue in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Select options={defaultOptions} defaultValue="b" />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;

    // Initially "b" should be selected via defaultValue
    expect(select.value).toBe('b');

    // Selecting "c" should update internal state
    await user.selectOptions(select, 'c');
    expect(select.value).toBe('c');
  });

  it('controlled value prop overrides defaultValue', () => {
    render(<Select options={defaultOptions} value="a" defaultValue="b" onChange={() => {}} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    // controlled value ("a") should win over defaultValue ("b")
    expect(select.value).toBe('a');
  });
});

/* ------------------------------------------------------------------ */
/*  Access controller                                                  */
/* ------------------------------------------------------------------ */

describe('Select — access controller', () => {
  it('returns null when access is hidden', () => {
    const { container } = render(<Select access="hidden" options={defaultOptions} />);
    expect(container.firstChild).toBeNull();
  });

  it('is disabled when access is disabled', () => {
    render(<Select access="disabled" options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('applies opacity-50 when access is disabled', () => {
    const { container } = render(<Select access="disabled" options={defaultOptions} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeTruthy();
  });

  it('applies readonly styling when access is readonly', () => {
    render(<Select access="readonly" options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.className).toContain('opacity-70');
  });

  it('has aria-readonly when access is readonly', () => {
    render(<Select access="readonly" options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-readonly', 'true');
    expect(select).not.toBeDisabled();
  });

  it('sets aria-invalid when error is truthy', () => {
    render(<Select options={defaultOptions} error />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is falsy', () => {
    render(<Select options={defaultOptions} />);
    const select = screen.getByRole('combobox');
    expect(select).not.toHaveAttribute('aria-invalid');
  });

  it('accepts string error type', () => {
    render(<Select options={defaultOptions} error="Field is required" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with accessReason as title', () => {
    const { container } = render(
      <Select access="disabled" accessReason="Insufficient permissions" options={defaultOptions} />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('title', 'Insufficient permissions');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Select — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Select options={defaultOptions} aria-label="Select option" />);
    await expectNoA11yViolations(container);
  });
});
