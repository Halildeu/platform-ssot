// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../Textarea';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Textarea — temel render', () => {
  it('textarea elementini render eder', () => {
    render(<Textarea aria-label="test" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('label render eder', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Textarea label="Bio" description="Tell us about yourself" />);
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument();
  });

  it('hint render eder', () => {
    render(<Textarea label="Bio" hint="Keep it brief" />);
    expect(screen.getByText('Keep it brief')).toBeInTheDocument();
  });

  it('error render eder ve hint gizler', () => {
    render(<Textarea label="Bio" hint="hint text" error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
    expect(screen.queryByText('hint text')).not.toBeInTheDocument();
  });

  it('varsayilan rows 4 tur', () => {
    render(<Textarea aria-label="test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Textarea — size proplari', () => {
  it('varsayilan size "md" dir', () => {
    const { container } = render(<Textarea aria-label="test" />);
    const frame = container.querySelector('[data-size]');
    expect(frame).toHaveAttribute('data-size', 'md');
  });

  it.each(['sm', 'md', 'lg'] as const)('size="%s" data-size atar', (size) => {
    const { container } = render(<Textarea aria-label="test" size={size} />);
    const frame = container.querySelector('[data-size]');
    expect(frame).toHaveAttribute('data-size', size);
  });
});

/* ------------------------------------------------------------------ */
/*  Resize proplari                                                    */
/* ------------------------------------------------------------------ */

describe('Textarea — resize proplari', () => {
  it('varsayilan resize "vertical" dir', () => {
    render(<Textarea aria-label="test" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-resize', 'vertical');
  });

  it.each(['vertical', 'none', 'auto'] as const)('resize="%s" dogru data-resize atar', (resize) => {
    render(<Textarea aria-label="test" resize={resize} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-resize', resize);
  });

  it('resize="auto" olarak cozumlenir', () => {
    render(<Textarea aria-label="test" resize="auto" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-resize', 'auto');
  });
});

/* ------------------------------------------------------------------ */
/*  Visual slot proplari                                               */
/* ------------------------------------------------------------------ */

describe('Textarea — visual slot proplari', () => {
  it('leadingVisual render eder', () => {
    render(<Textarea aria-label="test" leadingVisual={<span data-testid="leading">*</span>} />);
    expect(screen.getByTestId('leading')).toBeInTheDocument();
  });

  it('trailingVisual render eder', () => {
    render(<Textarea aria-label="test" trailingVisual={<span data-testid="trailing">*</span>} />);
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Textarea — access control', () => {
  it('access="full" durumunda textarea aktif olur', () => {
    render(<Textarea aria-label="test" access="full" />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('access="disabled" durumunda textarea disabled olur', () => {
    render(<Textarea aria-label="test" access="disabled" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('access="readonly" durumunda textarea readonly olur', () => {
    render(<Textarea aria-label="test" access="readonly" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readOnly');
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<Textarea aria-label="test" access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<Textarea aria-label="test" accessReason="No access" />);
    const frame = container.querySelector('[data-field-type="text-area"]');
    expect(frame).toHaveAttribute('title', 'No access');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('Textarea — interaction', () => {
  it('onChange handler calisir', async () => {
    const handleChange = vi.fn();
    render(<Textarea aria-label="test" onChange={handleChange} />);
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    // userEvent.type fires onChange per character (5 chars = 5 calls) + 1 from clear
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls.length).toBeGreaterThanOrEqual(5);
  });

  it('onValueChange handler degeri ile calisir', async () => {
    const handleValueChange = vi.fn();
    render(<Textarea aria-label="test" onValueChange={handleValueChange} />);
    await userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(handleValueChange).toHaveBeenCalledWith('hello', expect.any(Object));
  });

  it('controlled value dogru calisir', () => {
    render(<Textarea aria-label="test" value="controlled" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled');
  });

  it('uncontrolled value dogru calisir', () => {
    render(<Textarea aria-label="test" defaultValue="initial" />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');
  });
});

/* ------------------------------------------------------------------ */
/*  Karakter sayaci                                                    */
/* ------------------------------------------------------------------ */

describe('Textarea — karakter sayaci', () => {
  it('maxLength ile sayac gosterir', () => {
    const { container } = render(<Textarea aria-label="test" maxLength={200} value="hello" onChange={() => {}} />);
    const countEl = container.querySelector('[id$="-count"]');
    expect(countEl).toBeInTheDocument();
    expect(countEl?.textContent).toBe('5 / 200');
  });

  it('showCount ile sayac gosterir', () => {
    const { container } = render(<Textarea aria-label="test" showCount value="abc" onChange={() => {}} />);
    const countEl = container.querySelector('[id$="-count"]');
    expect(countEl).toBeInTheDocument();
    expect(countEl?.textContent).toBe('3');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Textarea — a11y', () => {
  it('error durumunda aria-invalid true olur', () => {
    render(<Textarea aria-label="test" error="Error!" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('error prop aria-invalid true yapar', () => {
    render(<Textarea aria-label="test" error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('required durumunda required attribute eklenir', () => {
    render(<Textarea aria-label="test" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('Textarea — loading state', () => {
  it('renders a spinner when loading=true', () => {
    const { container } = render(<Textarea aria-label="test" loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('disables the textarea when loading=true', () => {
    render(<Textarea aria-label="test" loading />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets data-loading attribute when loading', () => {
    const { container } = render(<Textarea aria-label="test" loading />);
    const frame = container.querySelector('[data-field-type="text-area"]');
    expect(frame).toHaveAttribute('data-loading', 'true');
  });

  it('does not render spinner when loading=false', () => {
    const { container } = render(<Textarea aria-label="test" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('has a spinner with role="status"', () => {
    const { container } = render(<Textarea aria-label="test" loading />);
    const spinner = container.querySelector('[role="status"]');
    expect(spinner).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Textarea — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Textarea aria-label="test" className="custom-class" />);
    const frame = container.querySelector('[data-field-type="text-area"]');
    expect(frame?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Textarea aria-label="test" data-testid="custom-textarea" />);
    expect(screen.getByTestId('custom-textarea')).toBeInTheDocument();
  });

  it('custom rows ayarlanabilir', () => {
    render(<Textarea aria-label="test" rows={8} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '8');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y — axe-core                                                    */
/* ------------------------------------------------------------------ */

describe('Textarea — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Textarea label="Description" />);
    await expectNoA11yViolations(container);
  });
});
