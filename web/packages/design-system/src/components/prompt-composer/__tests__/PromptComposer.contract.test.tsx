// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptComposer } from '../PromptComposer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('PromptComposer contract', () => {
  it('has displayName', () => {
    expect(PromptComposer.displayName).toBe('PromptComposer');
  });

  it('renders with default props', () => {
    const { container } = render(<PromptComposer />);
    expect(container.querySelector('[data-component="prompt-composer"]')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<PromptComposer title="My Composer" description="Write your prompt" />);
    expect(screen.getByText('My Composer')).toBeInTheDocument();
    expect(screen.getByText('Write your prompt')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<PromptComposer className="custom-composer" />);
    expect(container.querySelector('.custom-composer')).toBeInTheDocument();
  });

  it('renders scope buttons', () => {
    render(<PromptComposer />);
    expect(screen.getByText('general')).toBeInTheDocument();
    expect(screen.getByText('approval')).toBeInTheDocument();
    expect(screen.getByText('policy')).toBeInTheDocument();
    expect(screen.getByText('release')).toBeInTheDocument();
  });

  it('renders tone buttons', () => {
    render(<PromptComposer />);
    expect(screen.getByText('neutral')).toBeInTheDocument();
    expect(screen.getByText('strict')).toBeInTheDocument();
    expect(screen.getByText('exploratory')).toBeInTheDocument();
  });

  it('renders guardrails when provided', () => {
    render(<PromptComposer guardrails={['no-pii', 'safe-content']} />);
    expect(screen.getByText('no-pii')).toBeInTheDocument();
    expect(screen.getByText('safe-content')).toBeInTheDocument();
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<PromptComposer access="disabled" />);
    expect(container.querySelector('[data-access-state="disabled"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<PromptComposer access="hidden" />);
    expect(container.querySelector('[data-component="prompt-composer"]')).not.toBeInTheDocument();
  });
});

describe('PromptComposer — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<PromptComposer />);
    await expectNoA11yViolations(container);
  });
});
