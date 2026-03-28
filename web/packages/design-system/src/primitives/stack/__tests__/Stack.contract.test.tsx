// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { Stack, HStack, VStack } from '../Stack';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Stack contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Stack.displayName).toBe('Stack');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(
      <Stack>
        <div>A</div>
        <div>B</div>
      </Stack>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Forwards ref ---- */
  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Stack ref={ref}><div>A</div></Stack>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(<Stack className="custom-stack"><div>A</div></Stack>);
    expect(container.firstElementChild).toHaveClass('custom-stack');
  });

  /* ---- Flex direction ---- */
  it('defaults to column direction', () => {
    const { container } = render(<Stack><div>A</div></Stack>);
    expect(container.firstElementChild).toHaveClass('flex-col');
  });

  it('renders row direction', () => {
    const { container } = render(<Stack direction="row"><div>A</div></Stack>);
    expect(container.firstElementChild).toHaveClass('flex-row');
  });

  /* ---- Gap ---- */
  it('applies default gap', () => {
    const { container } = render(<Stack><div>A</div></Stack>);
    expect(container.firstElementChild).toHaveClass('gap-3');
  });

  /* ---- HStack / VStack ---- */
  it('HStack renders with row direction', () => {
    const { container } = render(<HStack><div>A</div></HStack>);
    expect(container.firstElementChild).toHaveClass('flex-row');
    expect(HStack.displayName).toBe('HStack');
  });

  it('VStack renders with column direction', () => {
    const { container } = render(<VStack><div>A</div></VStack>);
    expect(container.firstElementChild).toHaveClass('flex-col');
    expect(VStack.displayName).toBe('VStack');
  });
});

describe('Stack — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    await expectNoA11yViolations(container);
  });
});
