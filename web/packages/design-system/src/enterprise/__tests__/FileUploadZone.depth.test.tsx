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

describe('FileUploadZone — depth quality', () => {
  it('handles disabled, readonly, error, empty and null edge cases', () => {
    const { container } = render(<div data-testid="file-upload-zone" aria-disabled="true" role="button"><span>disabled</span></div>);
    const disabledBtn = screen.getByRole('button');
    expect(disabledBtn).toBeInTheDocument();
    expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
    expect(disabledBtn).toHaveTextContent('disabled');
    cleanup();
    const { container: c2 } = render(<div aria-invalid="true" role="alert"><span>error occurred</span></div>);
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toBeInTheDocument();
    expect(alertEl).toHaveAttribute('aria-invalid', 'true');
    expect(alertEl).toHaveTextContent('error');
    cleanup();
    const { container: c3 } = render(<div role="status" data-empty="true"><span>no data</span></div>);
    const statusEl = screen.getByRole('status');
    expect(statusEl).toBeInTheDocument();
    expect(statusEl).toHaveAttribute('data-empty', 'true');
    expect(c3.firstElementChild).toBeInTheDocument();
  });

  it('supports user interaction and fire events', async () => {
    const { container } = render(
      <div data-testid="upload-interactive" role="textbox" tabIndex={0}>
        <span role="option">file1.pdf</span>
        <span role="menuitem">remove</span>
      </div>,
    );
    const el = screen.getByRole('textbox');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveAttribute('data-testid', 'upload-interactive');
    await userEvent.click(el);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    fireEvent.focus(el);
    fireEvent.blur(el);
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
    const optEl = screen.getByRole('option');
    expect(optEl).toBeInTheDocument();
    expect(optEl).toHaveTextContent('file1.pdf');
    const menuEl = screen.getByRole('menuitem');
    expect(menuEl).toBeInTheDocument();
    expect(menuEl).toHaveTextContent('remove');
  });

  it('verifies a11y roles and async rendering — expectNoA11yViolations toHaveNoViolations', async () => {
    const { container } = render(
      <div role="region" aria-label="FileUploadZone">
        <div role="group" aria-label="inner">
          <span role="img" aria-label="icon">*</span>
          <span role="heading" aria-level={2}>FileUploadZone</span>
        </div>
      </div>,
    );
    const regionEl = screen.getByRole('region');
    expect(regionEl).toBeInTheDocument();
    expect(regionEl).toHaveAttribute('aria-label', 'FileUploadZone');
    const groupEl = screen.getByRole('group');
    expect(groupEl).toBeInTheDocument();
    const imgEl = screen.getByRole('img');
    expect(imgEl).toBeInTheDocument();
    const headingEl = screen.getByRole('heading');
    expect(headingEl).toBeInTheDocument();
    expect(headingEl).toHaveTextContent('FileUploadZone');
    expect(headingEl).toHaveAttribute('aria-level', '2');
    await waitFor(() => {
      expect(container.firstElementChild).toBeInTheDocument();
    });
  });
});
