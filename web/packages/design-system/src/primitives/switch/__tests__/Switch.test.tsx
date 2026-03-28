// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../Switch';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Switch — temel render', () => {
  it('switch role ile render eder', () => {
    render(<Switch />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Switch label="Notifications" />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Switch label="Dark Mode" description="Toggle dark theme" />);
    expect(screen.getByText('Toggle dark theme')).toBeInTheDocument();
  });

  it('label ve description olmadan sadece switch render eder', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('input[role="switch"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Switch — size proplari', () => {
  it('varsayilan switchSize "md" dir', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).toContain('h-5');
    expect(track?.className).toContain('w-9');
  });

  it.each([
    ['sm', 'h-4', 'w-7'],
    ['md', 'h-5', 'w-9'],
    ['lg', 'h-6', 'w-11'],
  ] as const)('size="%s" dogru boyut uygular', (size, expectedH, expectedW) => {
    const { container } = render(<Switch size={size} />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).toContain(expectedH);
    expect(track?.className).toContain(expectedW);
  });
});

/* ------------------------------------------------------------------ */
/*  Density proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Switch — density proplari', () => {
  it('renders compact density with scale-75', () => {
    const { container } = render(<Switch density="compact" />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).toContain('scale-75');
  });

  it('renders comfortable density as default (no scale class)', () => {
    const { container } = render(<Switch density="comfortable" />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).not.toContain('scale-75');
    expect(track?.className).not.toContain('scale-110');
  });

  it('renders spacious density with scale-110', () => {
    const { container } = render(<Switch density="spacious" />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).toContain('scale-110');
  });

  it('defaults to comfortable density when not specified', () => {
    const { container } = render(<Switch />);
    const track = container.querySelector('[aria-hidden]');
    expect(track?.className).not.toContain('scale-');
  });
});

/* ------------------------------------------------------------------ */
/*  Checked state                                                      */
/* ------------------------------------------------------------------ */

describe('Switch — checked state', () => {
  it('checked durumunda primary background uygular', () => {
    const { container } = render(<Switch checked onChange={() => {}} />);
    const track = container.querySelector('[aria-hidden]') as HTMLElement;
    expect(track?.style.backgroundColor).toContain('var(--action-primary');
  });

  it('unchecked durumunda default background uygular', () => {
    const { container } = render(<Switch checked={false} onChange={() => {}} />);
    const track = container.querySelector('[aria-hidden]') as HTMLElement;
    expect(track?.style.backgroundColor).toContain('var(--border-default');
  });

  it('checked durumunda thumb translate uygular', () => {
    const { container } = render(<Switch checked onChange={() => {}} />);
    const thumb = container.querySelector('[aria-hidden] > span');
    expect(thumb?.className).toContain('translate-x-4');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Switch — interaction', () => {
  it('onCheckedChange handler calisir', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();
    render(<Switch onCheckedChange={handleCheckedChange} />);
    await user.click(screen.getByRole('switch'));
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('disabled durumunda switch disabled olur', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('disabled durumunda opacity uygulanir', () => {
    const { container } = render(<Switch disabled label="Disabled" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });
});

/* ------------------------------------------------------------------ */
/*  Access controller                                                  */
/* ------------------------------------------------------------------ */

describe('Switch — access controller', () => {
  it('access="readonly" durumunda opacity-70 uygular', () => {
    const { container } = render(<Switch access="readonly" label="Read only" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-70');
  });

  it('access="disabled" durumunda opacity-50 uygular', () => {
    const { container } = render(<Switch access="disabled" label="Disabled" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('opacity-50');
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<Switch access="hidden" label="Hidden" />);
    expect(container.querySelector('label')).toBeNull();
  });

  it('access="readonly" durumunda onClick engellenir', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Switch access="readonly" onCheckedChange={handleChange} />);
    const input = screen.getByRole('switch');
    await user.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe('Switch — error state', () => {
  it('sets aria-invalid when error is true', () => {
    render(<Switch error />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Switch />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).not.toHaveAttribute('aria-invalid');
  });

  it('sets aria-invalid when error is a string', () => {
    render(<Switch error="This field is required" />);
    const switchEl = screen.getByRole('switch');
    expect(switchEl).toHaveAttribute('aria-invalid', 'true');
  });

  it('includes error in stateAttrs', () => {
    const { container } = render(<Switch error label="Test" />);
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('data-error');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Switch — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Switch className="custom-class" />);
    const label = container.querySelector('label');
    expect(label?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('custom id kullanilabilir', () => {
    render(<Switch id="my-switch" />);
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'my-switch');
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Switch data-testid="custom-switch" />);
    expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Ref forwarding                                                     */
/* ------------------------------------------------------------------ */

describe('Switch — ref forwarding', () => {
  it('forwards ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch ref={ref} label="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe('checkbox');
  });
});

/* ------------------------------------------------------------------ */
/*  Uncontrolled mode (defaultChecked)                                 */
/* ------------------------------------------------------------------ */

describe('Switch — uncontrolled mode (defaultChecked)', () => {
  it('renders with defaultChecked in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Switch defaultChecked label="Notifications" />);
    const sw = screen.getByRole('switch');

    // Initially checked via defaultChecked
    expect(sw).toBeChecked();

    // Simulate user interaction — state should toggle internally
    await user.click(sw);
    expect(sw).not.toBeChecked();

    await user.click(sw);
    expect(sw).toBeChecked();
  });

  it('controlled checked prop overrides defaultChecked', () => {
    render(<Switch checked={false} defaultChecked onCheckedChange={() => {}} />);
    const sw = screen.getByRole('switch');
    // controlled prop (false) should win over defaultChecked (true)
    expect(sw).not.toBeChecked();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Switch — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Switch label="Notifications" />);
    await expectNoA11yViolations(container);
  });
});
