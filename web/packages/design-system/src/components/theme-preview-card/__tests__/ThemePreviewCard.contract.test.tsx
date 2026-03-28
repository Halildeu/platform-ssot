// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemePreviewCard } from '../ThemePreviewCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

describe('ThemePreviewCard contract', () => {
  it('has displayName', () => {
    expect(ThemePreviewCard.displayName).toBe('ThemePreviewCard');
  });

  it('renders with default props', () => {
    const { container } = render(<ThemePreviewCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders default locale text', () => {
    render(<ThemePreviewCard />);
    expect(screen.getByText('Baslik metni')).toBeInTheDocument();
    expect(screen.getByText('Ikincil metin')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('renders custom locale text', () => {
    render(
      <ThemePreviewCard
        localeText={{
          titleText: 'Title',
          secondaryText: 'Secondary',
          saveLabel: 'Save',
        }}
      />,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<ThemePreviewCard className="custom-preview" />);
    expect(container.querySelector('.custom-preview')).toBeInTheDocument();
  });

  it('shows check mark when selected', () => {
    render(<ThemePreviewCard selected />);
    expect(screen.getByText('Secili tema onizlemesi')).toBeInTheDocument();
  });

  it('does not show check mark when not selected', () => {
    render(<ThemePreviewCard selected={false} />);
    expect(screen.queryByText('Secili tema onizlemesi')).not.toBeInTheDocument();
  });

  it('renders custom selectedLabel', () => {
    render(<ThemePreviewCard selected localeText={{ selectedLabel: 'Active theme' }} />);
    expect(screen.getByText('Active theme')).toBeInTheDocument();
  });
});

describe('ThemePreviewCard — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<ThemePreviewCard />);
    await expectNoA11yViolations(container);
  });
});
