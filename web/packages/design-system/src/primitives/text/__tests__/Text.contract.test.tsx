// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Text } from '../Text';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Text contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Text.displayName).toBe('Text');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(<Text>Hello</Text>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  /* ---- Default element is span ---- */
  it('renders as <span> by default', () => {
    const { container } = render(<Text>Default</Text>);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
  });

  /* ---- Forwards ref ---- */
  it('forwards ref to rendered element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Text ref={ref}>Ref test</Text>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  /* ---- Polymorphic as ---- */
  it.each(['p', 'h1', 'h2', 'h3', 'div', 'label', 'strong', 'em', 'small', 'code'] as const)(
    'renders as=%s',
    (tag) => {
      const { container } = render(<Text as={tag}>Poly</Text>);
      expect(container.firstElementChild?.tagName).toBe(tag.toUpperCase());
    },
  );

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Text className="custom-text">Styled</Text>);
    expect(container.querySelector('span')).toHaveClass('custom-text');
  });

  /* ---- Variants ---- */
  it.each(['default', 'secondary', 'muted', 'success', 'warning', 'error', 'info'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      const { container } = render(<Text variant={variant}>V</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Sizes ---- */
  it.each(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'] as const)(
    'renders size=%s without crash',
    (size) => {
      const { container } = render(<Text size={size}>S</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Weights ---- */
  it.each(['normal', 'medium', 'semibold', 'bold'] as const)(
    'renders weight=%s without crash',
    (weight) => {
      const { container } = render(<Text weight={weight}>W</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    },
  );

  /* ---- Truncate ---- */
  it('applies truncate class', () => {
    const { container } = render(<Text truncate>Long text</Text>);
    expect(container.querySelector('span')).toHaveClass('truncate');
  });

  /* ---- Line clamp ---- */
  it.each([1, 2, 3, 4, 5] as const)(
    'applies line-clamp-%s class',
    (clamp) => {
      const { container } = render(<Text lineClamp={clamp}>Clamped</Text>);
      expect(container.querySelector('span')).toHaveClass(`line-clamp-${clamp}`);
    },
  );

  /* ---- Mono ---- */
  it('applies font-mono class', () => {
    const { container } = render(<Text mono>Code</Text>);
    expect(container.querySelector('span')).toHaveClass('font-mono');
  });

  /* ---- Props propagation ---- */
  it('passes through HTML attributes', () => {
    const { container } = render(<Text data-testid="my-text">Props</Text>);
    expect(container.querySelector('[data-testid="my-text"]')).toBeInTheDocument();
  });

  /* ---- Weight class applied ---- */
  it('applies font-bold when weight="bold"', () => {
    const { container } = render(<Text weight="bold">Bold</Text>);
    expect(container.querySelector('span')).toHaveClass('font-bold');
  });

  /* ---- Size class applied ---- */
  it('applies text-lg when size="lg"', () => {
    const { container } = render(<Text size="lg">Large</Text>);
    expect(container.querySelector('span')).toHaveClass('text-lg');
  });
});

describe('Text — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Text>Accessible text</Text>);
    await expectNoA11yViolations(container);
  });
});
