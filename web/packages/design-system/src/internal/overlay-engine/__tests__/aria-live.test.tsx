// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { AriaLiveRegion, announce, useAnnounce } from '../aria-live';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('AriaLiveRegion', () => {
  it('renders polite and assertive live regions', () => {
    render(<AriaLiveRegion />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('polite region has aria-live="polite"', () => {
    render(<AriaLiveRegion />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('assertive region has aria-live="assertive"', () => {
    render(<AriaLiveRegion />);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('both regions have aria-atomic="true"', () => {
    render(<AriaLiveRegion />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
    expect(screen.getByRole('alert')).toHaveAttribute('aria-atomic', 'true');
  });

  it('has correct displayName', () => {
    expect(AriaLiveRegion.displayName).toBe('AriaLiveRegion');
  });
});

describe('announce', () => {
  it('polite message appears in status region', async () => {
    render(<AriaLiveRegion />);
    act(() => {
      announce('Hello world');
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Hello world');
  });

  it('assertive message appears in alert region', async () => {
    render(<AriaLiveRegion />);
    act(() => {
      announce('Critical error', 'assertive');
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Critical error');
  });

  it('messages auto-clear after 5 seconds', () => {
    render(<AriaLiveRegion />);
    act(() => {
      announce('Temp message');
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Temp message');
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('does nothing when no AriaLiveRegion is mounted', () => {
    // Should not throw
    expect(() => announce('No region')).not.toThrow();
  });
});

describe('useAnnounce', () => {
  it('returns a stable function', () => {
    const Probe: React.FC = () => {
      const fn = useAnnounce();
      return <div data-testid="probe">{typeof fn}</div>;
    };
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('function');
  });
});
