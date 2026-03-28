// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Upload } from '../Upload';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('Upload contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Upload.displayName).toBe('Upload');
  });

  it('renders with required props', () => {
    const { container } = render(<Upload />);
    expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('forwards ref to <input>', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Upload ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Upload label="Attachment" />);
    expect(screen.getByText('Attachment')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Upload description="Upload your files" />);
    expect(screen.getByText('Upload your files')).toBeInTheDocument();
  });

  /* ---- Error ---- */
  it('sets aria-invalid when error is provided', () => {
    const { container } = render(<Upload error="File too large" />);
    expect(container.querySelector('input[type="file"]')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders error message text', () => {
    render(<Upload error="File too large" />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  /* ---- Disabled ---- */
  it('respects disabled prop', () => {
    const { container } = render(<Upload disabled />);
    expect(container.querySelector('input[type="file"]')).toBeDisabled();
  });

  /* ---- Required ---- */
  it('sets required on the input', () => {
    const { container } = render(<Upload required />);
    expect(container.querySelector('input[type="file"]')).toBeRequired();
  });

  /* ---- Accept ---- */
  it('renders accept filter text', () => {
    render(<Upload accept=".pdf,.docx" />);
    expect(screen.getByText(/\.pdf,\.docx/)).toBeInTheDocument();
  });

  /* ---- Controlled files ---- */
  it('renders file list when files are provided', () => {
    const files = [
      { name: 'report.pdf', size: 1024 },
      { name: 'image.png', size: 2048 },
    ];
    render(<Upload files={files} />);
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('image.png')).toBeInTheDocument();
  });

  /* ---- Empty file state ---- */
  it('renders empty state when no files', () => {
    render(<Upload />);
    expect(screen.getByText('Henuz dosya secilmedi.')).toBeInTheDocument();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Upload className="my-upload" />);
    expect(container.querySelector('.my-upload')).toBeInTheDocument();
  });

  /* ---- Access control ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Upload access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access=disabled renders disabled input', () => {
    const { container } = render(<Upload access="disabled" />);
    expect(container.querySelector('input[type="file"]')).toBeDisabled();
  });

  it('access=readonly renders disabled input', () => {
    const { container } = render(<Upload access="readonly" />);
    expect(container.querySelector('input[type="file"]')).toBeDisabled();
  });
});

describe('Upload — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Upload label="Attachment" />);
    await expectNoA11yViolations(container);
  });
});
