// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
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
