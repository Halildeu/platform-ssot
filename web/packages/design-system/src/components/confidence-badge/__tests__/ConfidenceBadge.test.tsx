// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — temel render', () => {
  it('varsayilan level "medium" ile render eder', () => {
    render(<ConfidenceBadge />);
    expect(screen.getByText('Orta guven')).toBeInTheDocument();
  });

  it('aria-label atar', () => {
    render(<ConfidenceBadge />);
    expect(screen.getByLabelText('Orta guven')).toBeInTheDocument();
  });

  it('data-confidence-level attribute atar', () => {
    const { container } = render(<ConfidenceBadge level="high" />);
    expect(container.querySelector('[data-confidence-level="high"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Level proplari                                                     */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — level proplari', () => {
  it.each([
    ['low', 'Dusuk guven'],
    ['medium', 'Orta guven'],
    ['high', 'Yuksek guven'],
    ['very-high', 'Cok yuksek guven'],
  ] as const)('level="%s" dogru label gosterir', (level, expectedLabel) => {
    render(<ConfidenceBadge level={level} />);
    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Score                                                              */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — score', () => {
  it('score gosterir (showScore=true varsayilan)', () => {
    render(<ConfidenceBadge score={87} />);
    expect(screen.getByText(/87%/)).toBeInTheDocument();
  });

  it('showScore=false iken score gizler', () => {
    render(<ConfidenceBadge score={87} showScore={false} />);
    expect(screen.queryByText(/87%/)).not.toBeInTheDocument();
  });

  it('score sinir degerlere clamp eder (>100)', () => {
    render(<ConfidenceBadge score={150} />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it('score sinir degerlere clamp eder (<0)', () => {
    render(<ConfidenceBadge score={-10} />);
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it('score yuvarlar', () => {
    render(<ConfidenceBadge score={87.6} />);
    expect(screen.getByText(/88%/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Source count                                                       */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — sourceCount', () => {
  it('compact=false iken sourceCount gosterir', () => {
    render(<ConfidenceBadge sourceCount={5} compact={false} />);
    expect(screen.getByText(/5 sources/)).toBeInTheDocument();
  });

  it('compact=true iken sourceCount gizler', () => {
    render(<ConfidenceBadge sourceCount={5} compact />);
    expect(screen.queryByText(/5 sources/)).not.toBeInTheDocument();
  });

  it('sourceCount=1 iken tekil "source" kullanir', () => {
    render(<ConfidenceBadge sourceCount={1} compact={false} />);
    expect(screen.getByText(/1 source$/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Custom label                                                       */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — custom label', () => {
  it('ozel label kullanir', () => {
    render(<ConfidenceBadge label="Custom label" />);
    expect(screen.getByText(/Custom label/)).toBeInTheDocument();
  });

  it('ozel label level labelini gecersiz kilar', () => {
    render(<ConfidenceBadge label="Override" level="high" />);
    expect(screen.getByText(/Override/)).toBeInTheDocument();
    expect(screen.queryByText('Yuksek guven')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<ConfidenceBadge access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda normal render eder', () => {
    render(<ConfidenceBadge access="full" />);
    expect(screen.getByText('Orta guven')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ConfidenceBadge — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<ConfidenceBadge className="extra" />);
    expect(container.firstElementChild?.className).toContain('extra');
  });

  it('score + sourceCount + label hepsi birlesir', () => {
    render(
      <ConfidenceBadge
        label="Trust"
        score={95}
        sourceCount={3}
        compact={false}
      />,
    );
    expect(screen.getByText('Trust · 95% · 3 sources')).toBeInTheDocument();
  });
});

describe('ConfidenceBadge — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ConfidenceBadge />);
    await expectNoA11yViolations(container);
  });
});
