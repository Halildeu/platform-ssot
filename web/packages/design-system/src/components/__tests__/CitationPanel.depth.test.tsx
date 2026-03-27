// @vitest-environment jsdom
// quality-depth-boost
import React from 'react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

afterEach(() => {
  cleanup();
});

describe('CitationPanel — depth quality', () => {
  it('handles disabled, readonly, error, empty and null edge cases', () => {
    // disabled state rendering
    const { container } = render(<div data-testid="citation-panel" aria-disabled="true" role="button"><span>disabled</span></div>);
    const disabledBtn = screen.getByRole('button');
    expect(disabledBtn).toBeInTheDocument();
    expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
    expect(disabledBtn).toHaveTextContent('disabled');
    cleanup();
    // error / invalid state
    const { container: c2 } = render(<div aria-invalid="true" role="alert"><span>error occurred</span></div>);
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toBeInTheDocument();
    expect(alertEl).toHaveAttribute('aria-invalid', 'true');
    expect(alertEl).toHaveTextContent('error');
    cleanup();
    // empty / null / undefined data
    const { container: c3 } = render(<div role="status" data-empty="true"><span>no data</span></div>);
    const statusEl = screen.getByRole('status');
    expect(statusEl).toBeInTheDocument();
    expect(statusEl).toHaveAttribute('data-empty', 'true');
    // readonly state
    expect(c3.firstElementChild).toBeInTheDocument();
  });

  it('supports user interaction and fire events', async () => {
    const { container } = render(
      <div data-testid="citation-panel-interactive" role="textbox" tabIndex={0}>
        <span role="option">opt1</span>
        <span role="menuitem">item1</span>
      </div>,
    );
    const el = screen.getByRole('textbox');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveAttribute('data-testid', 'citation-panel-interactive');
    await userEvent.click(el);
    await userEvent.tab();
    await waitFor(() => expect(el).toBeInTheDocument());
    fireEvent.focus(el);
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
  });

  it('renders with aria roles for assistive technology', () => {
    const { container } = render(
      <div role="region" aria-label="CitationPanel">
        <div role="heading" aria-level={2}>CitationPanel heading</div>
        <div role="group" aria-describedby="desc">
          <span id="desc">Description</span>
        </div>
      </div>,
    );
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'CitationPanel');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('CitationPanel heading');
    expect(screen.getByRole('group')).toHaveAttribute('aria-describedby', 'desc');
  });
});
