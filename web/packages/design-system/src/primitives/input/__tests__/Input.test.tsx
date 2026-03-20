// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Input — temel render', () => {
  it('input elementini render eder', () => {
    render(<Input aria-label="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('varsayilan type "text" dir', () => {
    render(<Input aria-label="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('label render eder', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Input label="Email" description="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('hint render eder', () => {
    render(<Input label="Email" hint="We will never share your email" />);
    expect(screen.getByText('We will never share your email')).toBeInTheDocument();
  });

  it('error render eder ve hint gizler', () => {
    render(<Input label="Email" hint="Some hint" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.queryByText('Some hint')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Input — size proplari', () => {
  it('varsayilan size "md" dir', () => {
    const { container } = render(<Input aria-label="test" />);
    const frame = container.querySelector('[data-size]');
    expect(frame).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" data-size atar', (size) => {
    const { container } = render(<Input aria-label="test" size={size} />);
    const frame = container.querySelector('[data-size]');
    expect(frame).toHaveAttribute('data-size', size);
  });
});

/* ------------------------------------------------------------------ */
/*  Visual slot proplari                                               */
/* ------------------------------------------------------------------ */

describe('Input — visual slot proplari', () => {
  it('leadingVisual render eder', () => {
    render(<Input aria-label="test" leadingVisual={<span data-testid="leading">$</span>} />);
    expect(screen.getByTestId('leading')).toBeInTheDocument();
  });

  it('trailingVisual render eder', () => {
    render(<Input aria-label="test" trailingVisual={<span data-testid="trailing">X</span>} />);
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });

  it('prefix alias leadingVisual olarak calisir', () => {
    render(<Input aria-label="test" prefix={<span data-testid="prefix">$</span>} />);
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
  });

  it('suffix alias trailingVisual olarak calisir', () => {
    render(<Input aria-label="test" suffix={<span data-testid="suffix">X</span>} />);
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Input — access control', () => {
  it('access="full" durumunda input aktif olur', () => {
    render(<Input aria-label="test" access="full" />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('access="disabled" durumunda input disabled olur', () => {
    render(<Input aria-label="test" access="disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('access="readonly" durumunda input readonly olur', () => {
    render(<Input aria-label="test" access="readonly" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<Input aria-label="test" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<Input aria-label="test" accessReason="Yetkiniz yok" />);
    const frame = container.querySelector('[data-field-type="text-input"]');
    expect(frame).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Input — interaction', () => {
  it('onChange handler calisir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input aria-label="test" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('onValueChange handler degeri ile calisir', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Input aria-label="test" onValueChange={handleValueChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(handleValueChange).toHaveBeenLastCalledWith('hello', expect.any(Object));
  });

  it('controlled value dogru calisir', () => {
    render(<Input aria-label="test" value="controlled" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled');
  });

  it('uncontrolled value dogru calisir', () => {
    render(<Input aria-label="test" defaultValue="initial" />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');
  });

  it('disabled durumunda kullanici yazip yazamayacagini kontrol eder', () => {
    render(<Input aria-label="test" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Readonly state                                                     */
/* ------------------------------------------------------------------ */

describe('Input — readonly state', () => {
  it('readOnly prop sets readOnly attribute on input', () => {
    render(<Input aria-label="test" readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
  });

  it('readOnly input does not allow typing to change value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input aria-label="test" readOnly value="locked" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'extra');
    expect(input).toHaveValue('locked');
  });

  it('readOnly input has aria-readonly attribute', () => {
    render(<Input aria-label="test" readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-readonly', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled state                                                     */
/* ------------------------------------------------------------------ */

describe('Input — disabled state', () => {
  it('disabled prop sets disabled attribute on input', () => {
    render(<Input aria-label="test" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('disabled input does not fire onChange on click/type', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input aria-label="test" disabled onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe('Input — error state', () => {
  it('error prop sets aria-invalid on input', () => {
    render(<Input aria-label="test" error="Something went wrong" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error message is rendered', () => {
    render(<Input aria-label="test" error="Field is required" />);
    expect(screen.getByText('Field is required')).toBeInTheDocument();
  });

  it('error prop applies error border styling via data attribute', () => {
    const { container } = render(<Input aria-label="test" error="Err" />);
    const frame = container.querySelector('[data-field-type="text-input"]');
    expect(frame).toHaveAttribute('data-field-tone', 'invalid');
  });
});

/* ------------------------------------------------------------------ */
/*  Karakter sayaci                                                    */
/* ------------------------------------------------------------------ */

describe('Input — karakter sayaci', () => {
  it('maxLength ile sayac gosterir', () => {
    const { container } = render(<Input aria-label="test" maxLength={100} value="hello" onChange={() => {}} />);
    const countEl = container.querySelector('[id$="-count"]');
    expect(countEl).toBeInTheDocument();
    expect(countEl?.textContent).toBe('5 / 100');
  });

  it('showCount ile sayac gosterir', () => {
    const { container } = render(<Input aria-label="test" showCount value="abc" onChange={() => {}} />);
    const countEl = container.querySelector('[id$="-count"]');
    expect(countEl).toBeInTheDocument();
    expect(countEl?.textContent).toBe('3');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Input — a11y', () => {
  it('error durumunda aria-invalid true olur', () => {
    render(<Input aria-label="test" error="Error!" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error prop aria-invalid true yapar', () => {
    render(<Input aria-label="test" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('required durumunda required attribute eklenir', () => {
    render(<Input aria-label="test" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Input — ref forwarding', () => {
  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input aria-label="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled / uncontrolled parity                                   */
/* ------------------------------------------------------------------ */

describe('Input — controlled/uncontrolled parity', () => {
  it('uncontrolled: renders without value prop and typing updates displayed value', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="test" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('controlled: typing calls onChange but does not change displayed value without prop update', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input aria-label="test" value="hello" onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('hello');
    await user.type(input, '!');
    expect(handleChange).toHaveBeenCalled();
    // value prop still "hello" — component should reflect controlled value
    expect(input).toHaveValue('hello');
  });

  it('controlled: reflects prop update', () => {
    const { rerender } = render(<Input aria-label="test" value="hello" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');

    rerender(<Input aria-label="test" value="world" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('world');
  });

  it('onValueChange callback receives string value', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();
    render(<Input aria-label="test" onValueChange={handleValueChange} />);

    await user.type(screen.getByRole('textbox'), 'ab');
    expect(handleValueChange).toHaveBeenCalledTimes(2);
    expect(handleValueChange).toHaveBeenLastCalledWith('ab', expect.any(Object));
  });

  it('uncontrolled with defaultValue: starts with initial value and allows typing', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="test" defaultValue="initial" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('initial');
    await user.type(input, '!');
    expect(input).toHaveValue('initial!');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Input — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Input aria-label="test" className="custom-class" />);
    const frame = container.querySelector('[data-field-type="text-input"]');
    expect(frame?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input aria-label="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Input aria-label="test" data-testid="custom-input" />);
    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('fullWidth varsayilan true dur', () => {
    const { container } = render(<Input aria-label="test" />);
    const frame = container.querySelector('[data-field-type="text-input"]');
    expect(frame?.className).toContain('w-full');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Input — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Input label="Email" />);
    await expectNoA11yViolations(container);
  });
});
