// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Divider } from '../Divider';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Divider — temel render', () => {
  it('varsayilan props ile hr elementini render eder', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('varsayilan orientation "horizontal" dir', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('varsayilan spacing "md" dir', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');
    expect(hr?.className).toContain('my-4');
  });
});

/* ------------------------------------------------------------------ */
/*  Horizontal orientation                                             */
/* ------------------------------------------------------------------ */

describe('Divider — horizontal', () => {
  it('label olmadan hr render eder', () => {
    const { container } = render(<Divider orientation="horizontal" />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('label verildiginde separator role ile div render eder', () => {
    render(<Divider label="OR" />);
    const separator = screen.getByRole('separator');
    expect(separator).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Vertical orientation                                               */
/* ------------------------------------------------------------------ */

describe('Divider — vertical', () => {
  it('vertical durumunda div render eder', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('vertical durumunda w-px class uygular', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const separator = container.querySelector('[role="separator"]');
    expect(separator?.className).toContain('w-px');
  });
});

/* ------------------------------------------------------------------ */
/*  Spacing proplari                                                   */
/* ------------------------------------------------------------------ */

describe('Divider — spacing proplari', () => {
  it.each([
    ['none', ''],
    ['sm', 'my-2'],
    ['md', 'my-4'],
    ['lg', 'my-6'],
  ] as const)('spacing="%s" dogru margin uygular (horizontal)', (spacing, expectedClass) => {
    const { container } = render(<Divider spacing={spacing} />);
    const hr = container.querySelector('hr');
    if (expectedClass) {
      expect(hr?.className).toContain(expectedClass);
    } else {
      expect(hr?.className).not.toContain('my-');
    }
  });

  it.each([
    ['none', ''],
    ['sm', 'mx-2'],
    ['md', 'mx-4'],
    ['lg', 'mx-6'],
  ] as const)('spacing="%s" dogru margin uygular (vertical)', (spacing, expectedClass) => {
    const { container } = render(<Divider orientation="vertical" spacing={spacing} />);
    const separator = container.querySelector('[role="separator"]');
    if (expectedClass) {
      expect(separator?.className).toContain(expectedClass);
    } else {
      expect(separator?.className).not.toContain('mx-');
    }
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility                                                      */
/* ------------------------------------------------------------------ */

describe('Divider — accessibility', () => {
  it('label durumunda role="separator" atar', () => {
    render(<Divider label="Section" />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('vertical durumunda aria-orientation="vertical" atar', () => {
    const { container } = render(<Divider orientation="vertical" />);
    const separator = container.querySelector('[role="separator"]');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Divider — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<Divider className="custom-class" />);
    const hr = container.querySelector('hr');
    expect(hr?.className).toContain('custom-class');
  });

  it('ek HTML attributes aktarilir', () => {
    const { container } = render(<Divider data-testid="custom-divider" />);
    expect(container.querySelector('[data-testid="custom-divider"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Divider — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Divider />);
    await expectNoA11yViolations(container);
  });
});
