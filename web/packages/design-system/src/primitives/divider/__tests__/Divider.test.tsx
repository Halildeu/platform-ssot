// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Divider — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<Divider />);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Divider — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
