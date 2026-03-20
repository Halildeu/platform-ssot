// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIGuidedAuthoring } from '../AIGuidedAuthoring';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — temel render', () => {
  it('varsayilan props ile section elementini render eder', () => {
    const { container } = render(<AIGuidedAuthoring />);
    const section = container.querySelector('[data-component="ai-guided-authoring"]');
    expect(section).toBeInTheDocument();
  });

  it('varsayilan title gosterir', () => {
    render(<AIGuidedAuthoring />);
    expect(screen.getByText('AI guided authoring')).toBeInTheDocument();
  });

  it('varsayilan description gosterir', () => {
    render(<AIGuidedAuthoring />);
    expect(
      screen.getByText(/Prompt yazimi, recommendation stack/),
    ).toBeInTheDocument();
  });

  it('ozel title ve description kabul eder', () => {
    render(
      <AIGuidedAuthoring title="Custom" description="Desc" />,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Confidence badge                                                   */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — confidence', () => {
  it('varsayilan confidence label gosterir', () => {
    render(<AIGuidedAuthoring />);
    expect(screen.getByText('MEVCUT GUVEN')).toBeInTheDocument();
  });

  it('ozel confidenceLabel kabul eder', () => {
    render(<AIGuidedAuthoring confidenceLabel="Score" />);
    expect(screen.getByText('Score')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Recommendations                                                    */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — recommendations', () => {
  it('bos recommendations durumunda fallback mesaji gosterir', () => {
    render(<AIGuidedAuthoring recommendations={[]} />);
    expect(screen.getByText(/Recommendation yok/)).toBeInTheDocument();
  });

  it('recommendations verildiginde render eder', () => {
    const recs = [
      {
        id: 'r1',
        title: 'Rec One',
        description: 'Desc one',
        primaryLabel: 'Apply',
        secondaryLabel: 'Review',
      },
    ];
    render(<AIGuidedAuthoring recommendations={recs} />);
    expect(screen.getByText('Rec One')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Command palette                                                    */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — command palette', () => {
  it('commandItems bos ise palette buton gostermez', () => {
    render(<AIGuidedAuthoring commandItems={[]} />);
    expect(screen.queryByText('Komut paleti')).toBeNull();
  });

  it('commandItems doluysa palette buton gosterir', () => {
    const items = [{ id: 'cmd1', label: 'Run', onSelect: vi.fn() }];
    render(<AIGuidedAuthoring commandItems={items} />);
    expect(screen.getByText('Komut paleti')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — access control', () => {
  it('access="full" durumunda render eder', () => {
    const { container } = render(<AIGuidedAuthoring access="full" />);
    expect(
      container.querySelector('[data-access-state="full"]'),
    ).toBeInTheDocument();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<AIGuidedAuthoring access="hidden" />);
    expect(
      container.querySelector('[data-component="ai-guided-authoring"]'),
    ).toBeNull();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    const { container } = render(<AIGuidedAuthoring access="disabled" />);
    expect(
      container.querySelector('[data-access-state="disabled"]'),
    ).toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(
      <AIGuidedAuthoring accessReason="Restricted" />,
    );
    const section = container.querySelector('[data-component="ai-guided-authoring"]');
    expect(section).toHaveAttribute('title', 'Restricted');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('AIGuidedAuthoring — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<AIGuidedAuthoring className="my-class" />);
    const section = container.querySelector('[data-component="ai-guided-authoring"]');
    expect(section?.className).toContain('my-class');
  });
});

describe('AIGuidedAuthoring — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AIGuidedAuthoring />);
    await expectNoA11yViolations(container);
  });
});
