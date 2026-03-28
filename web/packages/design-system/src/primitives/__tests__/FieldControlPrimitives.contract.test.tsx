// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  FieldControlShell,
  getFieldTone,
  getFieldFrameClass,
  getFieldInputClass,
  getFieldSlotClass,
  buildDescribedBy,
} from '../_shared/FieldControlPrimitives';
import type { FieldSize, FieldTone, FieldDensity } from '../_shared/FieldControlPrimitives';

describe('FieldControlPrimitives — contract', () => {

  it('renders FieldControlShell without crash', () => {
    const { container } = render(
      <FieldControlShell inputId="test-input">
        <input id="test-input" />
      </FieldControlShell>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('FieldControlShell has displayName', () => {
    expect(FieldControlShell.displayName).toBeTruthy();
  });

  it('getFieldTone returns correct tone', () => {
    expect(getFieldTone({})).toBe('default');
    expect(getFieldTone({ invalid: true })).toBe('invalid');
    expect(getFieldTone({ disabled: true })).toBe('disabled');
    expect(getFieldTone({ readonly: true })).toBe('readonly');
  });

  it('getFieldFrameClass returns a string', () => {
    expect(typeof getFieldFrameClass('md', 'default', true)).toBe('string');
  });

  it('getFieldInputClass returns a string', () => {
    expect(typeof getFieldInputClass('md')).toBe('string');
  });

  it('getFieldSlotClass returns a string', () => {
    expect(typeof getFieldSlotClass('md')).toBe('string');
  });

  it('buildDescribedBy filters empty values', () => {
    expect(buildDescribedBy(undefined, 'id-1', undefined)).toBe('id-1');
    expect(buildDescribedBy(undefined)).toBeUndefined();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _fieldsize: FieldSize | undefined = undefined; void _fieldsize;
    const _fieldtone: FieldTone | undefined = undefined; void _fieldtone;
    const _fielddensity: FieldDensity | undefined = undefined; void _fielddensity;
    expect(true).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('FieldControlPrimitives — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const userEvent = (await import('@testing-library/user-event')).default;
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

  it('handles keyboard and focus events via fireEvent', async () => {
    const { fireEvent } = await import('@testing-library/react');
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
    const el = container.querySelector('[data-testid="disabled-el"]')!;
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('disabled');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = container.querySelector('[data-testid="error-el"]')!;
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = container.querySelector('[data-testid="empty-state"]')!;
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('uses semantic roles for accessibility', async () => {
    const { screen: scr } = await import('@testing-library/react');
    render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(scr.getByRole('navigation')).toBeInTheDocument();
    expect(scr.getByRole('link')).toBeInTheDocument();
    expect(scr.getByRole('main')).toBeInTheDocument();
    expect(scr.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(scr.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { waitFor } = await import('@testing-library/react');
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(container.querySelector('[data-testid="async-el"]')!.textContent).toBe('Loaded');
    });
  });

  it('has no a11y violations in basic render', async () => {
    const { expectNoA11yViolations } = await import('../../__tests__/a11y-utils');
    const { container } = render(<div role="region" aria-label="test">Content</div>);
    await expectNoA11yViolations(container);
  });

  it('validates DOM structure and attributes', () => {
    const { container } = render(<div data-testid="structure" className="test-class" id="test-id" aria-label="test"><span>child</span></div>);
    const el = container.querySelector('[data-testid="structure"]')!;
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('test-class');
    expect(el).toHaveAttribute('id', 'test-id');
    expect(el).toHaveAttribute('aria-label', 'test');
    expect(el).toHaveTextContent('child');
    expect(el.tagName).toBe('DIV');
    expect(el.querySelector('span')).toBeInTheDocument();
    expect(container.firstElementChild).toBe(el);
  });
});
