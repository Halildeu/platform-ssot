// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Mentions, type MentionOption } from '../Mentions';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const defaultOptions: MentionOption[] = [
  { key: 'alice', label: 'Alice' },
  { key: 'bob', label: 'Bob' },
  { key: 'charlie', label: 'Charlie' },
];

describe('Mentions contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(Mentions.displayName).toBe('Mentions');
  });

  it('renders with required props', () => {
    render(<Mentions options={defaultOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards ref to root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Mentions ref={ref} options={defaultOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  /* ---- Label ---- */
  it('renders label', () => {
    render(<Mentions options={defaultOptions} label="Comment" />);
    expect(screen.getByText('Comment')).toBeInTheDocument();
  });

  /* ---- Description ---- */
  it('renders description', () => {
    render(<Mentions options={defaultOptions} description="Use @ to mention" />);
    expect(screen.getByText('Use @ to mention')).toBeInTheDocument();
  });

  /* ---- Placeholder ---- */
  it('renders placeholder', () => {
    render(<Mentions options={defaultOptions} placeholder="Type here..." />);
    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
  });

  /* ---- Error state ---- */
  it('sets aria-invalid when error is true', () => {
    render(<Mentions options={defaultOptions} error />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  /* ---- Disabled ---- */
  it('renders disabled textarea when access=disabled', () => {
    render(<Mentions options={defaultOptions} access="disabled" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  /* ---- className merge ---- */
  it('merges custom className', () => {
    const { container } = render(<Mentions options={defaultOptions} className="my-mentions" />);
    expect(container.querySelector('.my-mentions')).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<Mentions options={defaultOptions} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Controlled value ---- */
  it('respects controlled value', () => {
    render(<Mentions options={defaultOptions} value="Hello @Alice" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Hello @Alice');
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md', 'lg'] as const)('renders size=%s', (size) => {
    render(<Mentions options={defaultOptions} size={size} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

describe('Mentions — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<Mentions options={defaultOptions} label="Comment" />);
    await expectNoA11yViolations(container);
  });
});
