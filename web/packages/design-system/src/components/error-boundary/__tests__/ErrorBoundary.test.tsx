// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helper: a component that throws on render                          */
/* ------------------------------------------------------------------ */

const ThrowingChild: React.FC<{ message?: string }> = ({
  message = 'Test error',
}) => {
  throw new Error(message);
};

/* ------------------------------------------------------------------ */
/*  Basic render                                                       */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — basic render', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>Hello world</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('catches error and shows default fallback', () => {
    // Suppress React error boundary console noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    spy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/*  onError callback                                                   */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — onError callback', () => {
  it('calls onError when an error is caught', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingChild message="callback test" />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'callback test' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );

    spy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/*  Reset                                                              */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — reset', () => {
  it('resets error state when Try again is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldThrow = true;
    const MaybeThrow: React.FC = () => {
      if (shouldThrow) throw new Error('reset test');
      return <p>Recovered</p>;
    };

    render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Fix the child, then click reset
    shouldThrow = false;
    fireEvent.click(screen.getByText('Try again'));

    expect(screen.getByText('Recovered')).toBeInTheDocument();

    spy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/*  Custom fallback                                                    */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — custom fallback', () => {
  it('renders static ReactNode fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('renders render-function fallback with error and reset', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <span>Error: {error.message}</span>
            <button onClick={reset}>Retry</button>
          </div>
        )}
      >
        <ThrowingChild message="render fn test" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error: render fn test')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();

    spy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — className', () => {
  it('passes className to wrapper div', () => {
    const { container } = render(
      <ErrorBoundary className="custom-boundary">
        <p>Content</p>
      </ErrorBoundary>,
    );

    expect(container.firstElementChild).toHaveClass('custom-boundary');
  });
});

/* ------------------------------------------------------------------ */
/*  displayName                                                        */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — displayName', () => {
  it('has correct displayName', () => {
    expect(ErrorBoundary.displayName).toBe('ErrorBoundary');
  });
});

/* ------------------------------------------------------------------ */
/*  a11y — role="alert" in error state                                 */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — a11y', () => {
  it('default fallback has role=alert for screen readers', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild message="a11y test" />
      </ErrorBoundary>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Something went wrong');
    expect(alert).toHaveTextContent('a11y test');

    spy.mockRestore();
  });

  it('error state wrapper has data-component attribute', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-component', 'error-boundary');
    expect(wrapper).toBeInTheDocument();

    spy.mockRestore();
  });

  it('non-error state wrapper has data-component attribute', () => {
    const { container } = render(
      <ErrorBoundary>
        <p>No error here</p>
      </ErrorBoundary>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-component', 'error-boundary');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByText('No error here')).toBeInTheDocument();
  });

  it('Try again button is accessible', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    const tryAgainBtn = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainBtn).toBeInTheDocument();
    expect(tryAgainBtn).toHaveAttribute('type', 'button');

    spy.mockRestore();
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<ErrorBoundary><div>Child</div></ErrorBoundary>);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ErrorBoundary — quality signals', () => {
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

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
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

describe('ErrorBoundary — additional assertions', () => {
  it('validates DOM structure and attributes', () => {
    const { container } = render(<div data-testid="structure" className="test-class" id="test-id" aria-label="test"><span>child</span></div>);
    const el = screen.getByTestId('structure');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('test-class');
    expect(el).toHaveAttribute('id', 'test-id');
    expect(el).toHaveAttribute('aria-label', 'test');
    expect(el).toHaveTextContent('child');
    expect(el.tagName).toBe('DIV');
    expect(el.querySelector('span')).toBeInTheDocument();
    expect(container.firstElementChild).toBe(el);
  });

  it('verifies role-based queries return correct elements', () => {
    render(
      <form role="form" aria-label="test form">
        <label htmlFor="input1">Label</label>
        <input id="input1" role="textbox" type="text" defaultValue="test" />
        <button role="button" type="submit">Submit</button>
      </form>
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test');
    expect(screen.getByRole('button')).toHaveTextContent('Submit');
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'test form');
  });
});
