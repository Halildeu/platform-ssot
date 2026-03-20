// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Text } from '../Text';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Text — temel render', () => {
  it('varsayilan props ile span elementini render eder', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('SPAN');
  });

  it('children metnini gosterir', () => {
    render(<Text>Some text</Text>);
    expect(screen.getByText('Some text')).toBeInTheDocument();
  });

  it('varsayilan variant "default" dir', () => {
    const { container } = render(<Text>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain('text-[var(--text-primary)]');
  });
});

/* ------------------------------------------------------------------ */
/*  as prop (polymorphic)                                              */
/* ------------------------------------------------------------------ */

describe('Text — as prop', () => {
  it.each([
    ['p', 'P'],
    ['h1', 'H1'],
    ['div', 'DIV'],
    ['label', 'LABEL'],
    ['strong', 'STRONG'],
    ['code', 'CODE'],
  ] as const)('as="%s" dogru element render eder', (as, expectedTag) => {
    render(<Text as={as}>Test</Text>);
    expect(screen.getByText('Test').tagName).toBe(expectedTag);
  });
});

/* ------------------------------------------------------------------ */
/*  Variant proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Text — variant proplari', () => {
  it.each([
    ['default', 'text-[var(--text-primary)]'],
    ['secondary', 'text-[var(--text-secondary)]'],
    ['muted', 'text-[var(--text-disabled)]'],
    ['success', 'text-[var(--state-success-text)]'],
    ['warning', 'text-[var(--state-warning-text)]'],
    ['error', 'text-[var(--state-error-text)]'],
    ['info', 'text-[var(--state-info-text)]'],
  ] as const)('variant="%s" dogru class uygular', (variant, expectedClass) => {
    const { container } = render(<Text variant={variant}>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Size proplari                                                      */
/* ------------------------------------------------------------------ */

describe('Text — size proplari', () => {
  it.each([
    ['xs', 'text-xs'],
    ['sm', 'text-sm'],
    ['base', 'text-base'],
    ['lg', 'text-lg'],
    ['xl', 'text-xl'],
    ['2xl', 'text-2xl'],
    ['3xl', 'text-3xl'],
    ['4xl', 'text-4xl'],
  ] as const)('size="%s" dogru class uygular', (size, expectedClass) => {
    const { container } = render(<Text size={size}>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Weight proplari                                                    */
/* ------------------------------------------------------------------ */

describe('Text — weight proplari', () => {
  it.each([
    ['normal', 'font-normal'],
    ['medium', 'font-medium'],
    ['semibold', 'font-semibold'],
    ['bold', 'font-bold'],
  ] as const)('weight="%s" dogru class uygular', (weight, expectedClass) => {
    const { container } = render(<Text weight={weight}>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain(expectedClass);
  });
});

/* ------------------------------------------------------------------ */
/*  Truncate & lineClamp                                               */
/* ------------------------------------------------------------------ */

describe('Text — truncate & lineClamp', () => {
  it('truncate=true durumunda truncate class uygular', () => {
    const { container } = render(<Text truncate>Long text</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain('truncate');
  });

  it('truncate=false durumunda truncate class uygulamaz', () => {
    const { container } = render(<Text>Normal</Text>);
    const el = container.querySelector('span');
    expect(el?.className).not.toContain('truncate');
  });

  it.each([1, 2, 3, 4, 5] as const)('lineClamp=%d dogru class uygular', (clamp) => {
    const { container } = render(<Text lineClamp={clamp}>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain(`line-clamp-${clamp}`);
  });
});

/* ------------------------------------------------------------------ */
/*  Mono                                                               */
/* ------------------------------------------------------------------ */

describe('Text — mono', () => {
  it('mono=true durumunda font-mono class uygular', () => {
    const { container } = render(<Text mono>Code</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain('font-mono');
  });

  it('mono=false durumunda font-mono class uygulamaz', () => {
    const { container } = render(<Text>Normal</Text>);
    const el = container.querySelector('span');
    expect(el?.className).not.toContain('font-mono');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Text — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Text className="custom-class">Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Text ref={ref}>Test</Text>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('ek HTML attributes aktarilir', () => {
    render(<Text data-testid="custom-text">Test</Text>);
    expect(screen.getByTestId('custom-text')).toBeInTheDocument();
  });

  it('size verilmezse size class uygulanmaz', () => {
    const { container } = render(<Text>Test</Text>);
    const el = container.querySelector('span');
    expect(el?.className).not.toMatch(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/);
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Text — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Text>Sample text</Text>);
    await expectNoA11yViolations(container);
  });
});
