// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemePreviewCard } from '../ThemePreviewCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — temel render', () => {
  it('varsayilan props ile render eder', () => {
    const { container } = render(<ThemePreviewCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('varsayilan metin degerlerini gosterir', () => {
    render(<ThemePreviewCard />);
    expect(screen.getByText('Baslik metni')).toBeInTheDocument();
    expect(screen.getByText('Ikincil metin')).toBeInTheDocument();
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selected state                                                     */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — selected state', () => {
  it('selected=false durumunda checkmark gostermez', () => {
    render(<ThemePreviewCard selected={false} />);
    expect(screen.queryByText('Secili tema onizlemesi')).not.toBeInTheDocument();
  });

  it('selected=true durumunda checkmark gosterir', () => {
    render(<ThemePreviewCard selected />);
    expect(screen.getByText('Secili tema onizlemesi')).toBeInTheDocument();
  });

  it('selected=true durumunda checkmark sr-only olarak render eder', () => {
    render(<ThemePreviewCard selected />);
    const srText = screen.getByText('Secili tema onizlemesi');
    expect(srText.className).toContain('sr-only');
  });

  it('selected durumunda farkli border class uygular', () => {
    const { container } = render(<ThemePreviewCard selected />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-[var(--action-primary)]');
  });

  it('selected olmayan durumda subtle border class uygular', () => {
    const { container } = render(<ThemePreviewCard selected={false} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-[var(--border-subtle)]');
  });
});

/* ------------------------------------------------------------------ */
/*  localeText proplari                                                */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — localeText proplari', () => {
  it('ozel titleText render eder', () => {
    render(<ThemePreviewCard localeText={{ titleText: 'Baslik' }} />);
    expect(screen.getByText('Baslik')).toBeInTheDocument();
  });

  it('ozel secondaryText render eder', () => {
    render(<ThemePreviewCard localeText={{ secondaryText: 'Ikincil' }} />);
    expect(screen.getByText('Ikincil')).toBeInTheDocument();
  });

  it('ozel saveLabel render eder', () => {
    render(<ThemePreviewCard localeText={{ saveLabel: 'Kaydet' }} />);
    expect(screen.getByText('Kaydet')).toBeInTheDocument();
  });

  it('ozel selectedLabel render eder', () => {
    render(<ThemePreviewCard selected localeText={{ selectedLabel: 'Secili tema' }} />);
    expect(screen.getByText('Secili tema')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ThemePreviewCard — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<ThemePreviewCard className="custom-class" />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });

  it('displayName dogru tanimlanmistir', () => {
    expect(ThemePreviewCard.displayName).toBe('ThemePreviewCard');
  });
});

describe('ThemePreviewCard — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ThemePreviewCard />);
    await expectNoA11yViolations(container);
  });
});
