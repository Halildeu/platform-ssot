// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, renderHook } from '@testing-library/react';
import { PortalProvider, usePortalConfig } from '../PortalProvider';

afterEach(() => {
  cleanup();
});

describe('PortalProvider', () => {
  it('renders children', () => {
    const { getByText } = render(
      <PortalProvider>
        <div>Child content</div>
      </PortalProvider>,
    );
    expect(getByText('Child content')).toBeInTheDocument();
  });

  it('provides default empty config when no props', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortalProvider>{children}</PortalProvider>
    );
    const { result } = renderHook(() => usePortalConfig(), { wrapper });
    expect(result.current.container).toBeUndefined();
    expect(result.current.enabled).toBeUndefined();
  });

  it('provides enabled=false config', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortalProvider enabled={false}>{children}</PortalProvider>
    );
    const { result } = renderHook(() => usePortalConfig(), { wrapper });
    expect(result.current.enabled).toBe(false);
  });

  it('provides custom container', () => {
    const container = document.createElement('div');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortalProvider container={container}>{children}</PortalProvider>
    );
    const { result } = renderHook(() => usePortalConfig(), { wrapper });
    expect(result.current.container).toBe(container);
  });

  it('nested providers override config', () => {
    const outerContainer = document.createElement('div');
    const innerContainer = document.createElement('div');
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PortalProvider container={outerContainer}>
        <PortalProvider container={innerContainer}>
          {children}
        </PortalProvider>
      </PortalProvider>
    );
    const { result } = renderHook(() => usePortalConfig(), { wrapper });
    expect(result.current.container).toBe(innerContainer);
  });

  it('usePortalConfig returns empty config without provider', () => {
    const { result } = renderHook(() => usePortalConfig());
    expect(result.current).toEqual({});
  });

  it('has correct displayName', () => {
    expect(PortalProvider.displayName).toBe('PortalProvider');
  });
});
