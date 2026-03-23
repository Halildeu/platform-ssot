// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '../IconButton';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const TestIcon = <svg data-testid="test-icon" />;

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('IconButton — temel render', () => {
  it('varsayilan props ile button elementini render eder', () => {
    render(<IconButton icon={TestIcon} label="Close" />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('aria-label olarak label kulllanir', () => {
    render(<IconButton icon={TestIcon} label="Delete" />);
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  it('icon elementini render eder', () => {
    render(<IconButton icon={TestIcon} label="Close" />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('varsayilan variant "ghost" dir', () => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-transparent');
  });

  it('varsayilan size "md" dir', () => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('h-9');
    expect(button?.className).toContain('w-9');
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('IconButton — variant proplari', () => {
  it.each([
    ['primary', 'bg-action-primary'],
    ['secondary', 'bg-surface-muted'],
    ['outline', 'border'],
    ['ghost', 'bg-transparent'],
    ['danger', 'bg-state-danger-text'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" variant={variant} />);
    const button = container.querySelector('button');
    expect(button?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('IconButton — size proplari', () => {
  it.each([
    ['xs', 'h-7', 'w-7'],
    ['sm', 'h-8', 'w-8'],
    ['md', 'h-9', 'w-9'],
    ['lg', 'h-10', 'w-10'],
  ] as const)('size="%s" dogru height/width class uygular', (size, expectedH, expectedW) => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" size={size} />);
    const button = container.querySelector('button');
    expect(button?.className).toContain(expectedH);
    expect(button?.className).toContain(expectedW);
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('IconButton — loading state', () => {
  it('loading durumunda buton disabled olur', () => {
    render(<IconButton icon={TestIcon} label="Test" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('loading durumunda icon yerine spinner render eder', () => {
    render(<IconButton icon={TestIcon} label="Test" loading />);
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Rounded                                                            */
/* ------------------------------------------------------------------ */

describe('IconButton — rounded', () => {
  it('rounded=true durumunda rounded-full class uygular', () => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" rounded />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('rounded-full');
  });

  it('rounded=false durumunda rounded-lg class uygular', () => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('rounded-lg');
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('IconButton — interaction', () => {
  it('onClick handler calisir', async () => {
    const handleClick = vi.fn();
    render(<IconButton icon={TestIcon} label="Click" onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled durumunda onClick calismaz', async () => {
    const handleClick = vi.fn();
    render(<IconButton icon={TestIcon} label="Click" disabled onClick={handleClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('IconButton — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<IconButton icon={TestIcon} label="Test" className="custom-class" />);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<IconButton icon={TestIcon} label="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<IconButton icon={TestIcon} label="Test" data-testid="custom-btn" />);
    expect(screen.getByTestId('custom-btn')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('IconButton — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<IconButton icon={TestIcon} label="Close" />);
    await expectNoA11yViolations(container);
  });
});
