// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('ErrorBoundary contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(ErrorBoundary.displayName).toBe('ErrorBoundary');
  });

  /* ---- Renders without crashing ---- */
  it('renders without crashing', () => {
    const { container } = render(
      <ErrorBoundary>
        <p>child</p>
      </ErrorBoundary>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  /* ---- Custom className ---- */
  it('merges custom className', () => {
    const { container } = render(
      <ErrorBoundary className="custom-class">
        <p>child</p>
      </ErrorBoundary>,
    );
    expect(container.firstElementChild).toHaveClass('custom-class');
  });

  /* ---- data-component ---- */
  it('has data-component attribute', () => {
    const { container } = render(
      <ErrorBoundary>
        <p>child</p>
      </ErrorBoundary>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      'data-component',
      'error-boundary',
    );
  });

  it('allows overriding data-component', () => {
    const { container } = render(
      <ErrorBoundary data-component="custom-boundary">
        <p>child</p>
      </ErrorBoundary>,
    );
    expect(container.firstElementChild).toHaveAttribute(
      'data-component',
      'custom-boundary',
    );
  });

  /* ---- Error state renders alert role ---- */
  it('renders role=alert in error state', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const Throw: React.FC = () => {
      throw new Error('contract error');
    };

    const { container } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );

    expect(container.querySelector('[role="alert"]')).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('ErrorBoundary — accessibility', () => {
  it('has no axe-core a11y violations (normal state)', async () => {
    const { container } = render(
      <ErrorBoundary>
        <p>Accessible content</p>
      </ErrorBoundary>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no axe-core a11y violations (error state)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const Throw: React.FC = () => {
      throw new Error('a11y test');
    };

    const { container } = render(
      <ErrorBoundary>
        <Throw />
      </ErrorBoundary>,
    );

    await expectNoA11yViolations(container);
    spy.mockRestore();
  });
});
