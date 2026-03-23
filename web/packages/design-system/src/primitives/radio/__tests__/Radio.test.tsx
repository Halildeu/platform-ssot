// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from '../Radio';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Radio — temel render                                               */
/* ------------------------------------------------------------------ */

describe('Radio — temel render', () => {
  it('radio elementini render eder', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Radio label="Option A" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Radio label="Option A" description="First option" />);
    expect(screen.getByText('First option')).toBeInTheDocument();
  });

  it('label ve description olmadan sadece radio render eder', () => {
    const { container } = render(<Radio />);
    expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — size proplari                                              */
/* ------------------------------------------------------------------ */

describe('Radio — size proplari', () => {
  it('varsayilan size "md" dir', () => {
    const { container } = render(<Radio />);
    const outer = container.querySelector('[aria-hidden]');
    expect(outer?.className).toContain('h-4');
    expect(outer?.className).toContain('w-4');
  });

  it.each([
    ['sm', 'h-3.5'],
    ['md', 'h-4'],
    ['lg', 'h-5'],
  ] as const)('size="%s" dogru boyut uygular', (size, expectedClass) => {
    const { container } = render(<Radio size={size} />);
    const outer = container.querySelector('[aria-hidden]');
    expect(outer?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — checked state                                              */
/* ------------------------------------------------------------------ */

describe('Radio — checked state', () => {
  it('checked durumunda inner dot render eder', () => {
    const { container } = render(<Radio checked onChange={() => {}} />);
    const dot = container.querySelector('[aria-hidden] > span');
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain('rounded-full');
  });

  it('unchecked durumunda inner dot render etmez', () => {
    const { container } = render(<Radio checked={false} onChange={() => {}} />);
    const dot = container.querySelector('[aria-hidden] > span');
    expect(dot).not.toBeInTheDocument();
  });

  it('checked durumunda primary border uygular', () => {
    const { container } = render(<Radio checked onChange={() => {}} />);
    const outer = container.querySelector('[aria-hidden]');
    expect(outer?.className).toContain('border-action-primary');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — error state                                                */
/* ------------------------------------------------------------------ */

describe('Radio — error state', () => {
  it('error durumunda error border uygular', () => {
    const { container } = render(<Radio error />);
    const outer = container.querySelector('[aria-hidden]');
    expect(outer?.className).toContain('border-state-danger-text');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — interaction                                                */
/* ------------------------------------------------------------------ */

describe('Radio — interaction', () => {
  it('onChange handler calisir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio onChange={handleChange} />);
    await user.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disabled durumunda radio disabled olur', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('disabled durumunda opacity uygulanir', () => {
    const { container } = render(<Radio disabled label="Disabled" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — error aria-invalid                                         */
/* ------------------------------------------------------------------ */

describe('Radio — error aria-invalid', () => {
  it('sets aria-invalid when error is true', () => {
    render(<Radio error />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Radio />);
    const radio = screen.getByRole('radio');
    expect(radio).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-invalid when error is a string', () => {
    render(<Radio error="Selection required" />);
    const radio = screen.getByRole('radio');
    expect(radio).toHaveAttribute('aria-invalid', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — loading state                                              */
/* ------------------------------------------------------------------ */

describe('Radio — loading state', () => {
  it('renders a spinner when loading=true', () => {
    const { container } = render(<Radio loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('disables the radio when loading=true', () => {
    render(<Radio loading />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('does not call onChange when loading', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Radio loading onChange={handleChange} />);
    await user.click(screen.getByRole('radio'));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows spinner instead of dot when loading and checked', () => {
    const { container } = render(<Radio loading checked onChange={() => {}} />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    // The inner dot span should not be present
    const outerCircle = container.querySelector('[aria-hidden]');
    const dotSpan = outerCircle?.querySelector('span');
    expect(dotSpan).not.toBeInTheDocument();
  });

  it('applies opacity via disabled state when loading', () => {
    const { container } = render(<Radio loading label="Loading" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — edge cases                                                 */
/* ------------------------------------------------------------------ */

describe('Radio — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Radio className="custom-class" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('custom id kullanilabilir', () => {
    render(<Radio id="my-radio" />);
    expect(screen.getByRole('radio')).toHaveAttribute('id', 'my-radio');
  });
});

/* ------------------------------------------------------------------ */
/*  Radio — ref forwarding                                             */
/* ------------------------------------------------------------------ */

describe('Radio — ref forwarding', () => {
  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('radio');
  });
});

/* ------------------------------------------------------------------ */
/*  RadioGroup — temel render                                          */
/* ------------------------------------------------------------------ */

describe('RadioGroup — temel render', () => {
  it('radiogroup role render eder', () => {
    render(
      <RadioGroup name="test" value="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('secili radio ya checked atar', () => {
    render(
      <RadioGroup name="test" value="a">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('onChange secilen degeri doner', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="test" value="a" onChange={handleChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    await user.click(screen.getAllByRole('radio')[1]);
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('direction="horizontal" flex-row uygular', () => {
    render(
      <RadioGroup name="test" direction="horizontal">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group.className).toContain('flex-row');
  });

  it('direction="vertical" flex-col uygular', () => {
    render(
      <RadioGroup name="test" direction="vertical">
        <Radio value="a" label="A" />
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group.className).toContain('flex-col');
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled / uncontrolled parity                                   */
/* ------------------------------------------------------------------ */

describe('RadioGroup — controlled/uncontrolled parity', () => {
  it('uncontrolled Radio (standalone): renders without checked prop and clicking toggles it', async () => {
    const user = userEvent.setup();
    render(<Radio name="standalone" value="a" label="A" />);
    const radio = screen.getByRole('radio');

    expect(radio).not.toBeChecked();
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  it('uncontrolled RadioGroup: without value prop, onChange still fires on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="uncontrolled" onChange={handleChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');

    // No value prop — all radios start unchecked
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).not.toBeChecked();

    await user.click(radios[1]);
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('controlled: calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="ctrl" value="a" onChange={handleChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );

    await user.click(screen.getAllByRole('radio')[1]);
    expect(handleChange).toHaveBeenCalledWith('b');
  });

  it('controlled: does not change selected radio without prop update', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <RadioGroup name="ctrl" value="a" onChange={handleChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');

    await user.click(radios[1]);
    // onChange fires but controlled value keeps "a" selected
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('controlled: reflects prop update from "a" to "b"', () => {
    const { rerender } = render(
      <RadioGroup name="ctrl" value="a" onChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();

    rerender(
      <RadioGroup name="ctrl" value="b" onChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultValue)                                   */
/* ------------------------------------------------------------------ */

describe('RadioGroup — uncontrolled mode (defaultValue)', () => {
  it('renders with defaultValue in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup name="uncontrolled" defaultValue="b">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');

    // Initially "b" should be checked via defaultValue
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();

    // Clicking "c" should update internal state
    await user.click(radios[2]);
    expect(radios[1]).not.toBeChecked();
    expect(radios[2]).toBeChecked();
  });

  it('controlled value prop overrides defaultValue', () => {
    render(
      <RadioGroup name="ctrl" value="a" defaultValue="b" onChange={() => {}}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');
    // controlled value ("a") should win over defaultValue ("b")
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('Radio — keyboard navigation', () => {
  it('selects on Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Radio onChange={onChange} />);
    const radio = screen.getByRole('radio');
    await user.type(radio, ' ');
    expect(onChange).toHaveBeenCalled();
  });

  it('navigates with Arrow keys in RadioGroup', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup name="arrow-test" defaultValue="a" onChange={onChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>,
    );
    const radios = screen.getAllByRole('radio');

    // Focus the first radio and press ArrowDown
    radios[0].focus();
    await user.keyboard('{ArrowDown}');

    // Native radio group behavior: arrow keys move selection
    // The second radio should now be checked
    expect(radios[1]).toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Radio — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <RadioGroup name="a11y-test" value="a">
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroup>,
    );
    await expectNoA11yViolations(container);
  });
});
