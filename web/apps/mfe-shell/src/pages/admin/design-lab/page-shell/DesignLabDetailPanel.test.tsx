import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/react';
import { DesignLabDetailPanel } from './DesignLabDetailPanel';

describe('DesignLabDetailPanel', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('resetKey degistiginde panel scrollunu basa alir', () => {
    const scrollTo = vi.fn();
    const onResetView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    const { rerender } = render(
      <DesignLabDetailPanel resetKey="components:foundations" onResetView={onResetView}>
        <div>icerik</div>
      </DesignLabDetailPanel>,
    );

    scrollTo.mockClear();
    onResetView.mockClear();

    rerender(
      <DesignLabDetailPanel resetKey="components:navigation" onResetView={onResetView}>
        <div>icerik</div>
      </DesignLabDetailPanel>,
    );

    expect(onResetView).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  });

  it('scrollTo yoksa scrollTop fallback kullanir', () => {
    const onResetView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: undefined,
    });

    const { rerender, getByTestId } = render(
      <DesignLabDetailPanel resetKey="components:foundations" onResetView={onResetView}>
        <div>icerik</div>
      </DesignLabDetailPanel>,
    );

    const panel = getByTestId('design-lab-detail-panel');
    Object.defineProperty(panel, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 128,
    });

    rerender(
      <DesignLabDetailPanel resetKey="components:navigation" onResetView={onResetView}>
        <div>icerik</div>
      </DesignLabDetailPanel>,
    );

    expect(onResetView).toHaveBeenCalled();
    expect(panel.scrollTop).toBe(0);
  });
});
