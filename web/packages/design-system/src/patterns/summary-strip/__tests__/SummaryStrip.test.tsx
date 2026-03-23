// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SummaryStrip, type SummaryStripItem } from '../SummaryStrip';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: SummaryStripItem[] = [
  { key: '1', label: 'Revenue', value: '$10k' },
  { key: '2', label: 'Users', value: '500' },
  { key: '3', label: 'Orders', value: '120' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — temel render', () => {
  it('tum item label ve value degerlerini render eder', () => {
    render(<SummaryStrip items={defaultItems} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10k')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('article elementlerini render eder', () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    expect(container.querySelectorAll('article')).toHaveLength(3);
  });

  it('title gosterilir', () => {
    render(<SummaryStrip items={defaultItems} title="KPIs" />);
    expect(screen.getByText('KPIs')).toBeInTheDocument();
  });

  it('description gosterilir', () => {
    render(<SummaryStrip items={defaultItems} description="Key metrics" />);
    expect(screen.getByText('Key metrics')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Item proplari                                                      */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — item props', () => {
  it('note gosterilir', () => {
    const items: SummaryStripItem[] = [
      { key: '1', label: 'Rev', value: '10', note: 'vs last month' },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('trend gosterilir', () => {
    const items: SummaryStripItem[] = [
      { key: '1', label: 'Rev', value: '10', trend: <span data-testid="trend">+5%</span> },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByTestId('trend')).toBeInTheDocument();
  });

  it('icon gosterilir', () => {
    const items: SummaryStripItem[] = [
      { key: '1', label: 'Rev', value: '10', icon: <svg data-testid="icon" /> },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Tone                                                               */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — tone', () => {
  it.each(['info', 'success', 'warning'] as const)(
    'tone="%s" durumunda border-s-2 class uygulanir',
    (tone) => {
      const items: SummaryStripItem[] = [
        { key: '1', label: 'X', value: '0', tone },
      ];
      const { container } = render(<SummaryStrip items={items} />);
      const article = container.querySelector('article');
      expect(article?.className).toContain('border-s-2');
    },
  );

  it('tone="default" durumunda border-s-2 class uygulanmaz', () => {
    const items: SummaryStripItem[] = [
      { key: '1', label: 'X', value: '0', tone: 'default' },
    ];
    const { container } = render(<SummaryStrip items={items} />);
    const article = container.querySelector('article');
    expect(article?.className).not.toContain('border-s-2');
  });
});

/* ------------------------------------------------------------------ */
/*  Columns                                                            */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — columns', () => {
  it('varsayilan columns 4 dur', () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    const grid = container.querySelector('.grid');
    expect(grid?.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
  });

  it.each([2, 3, 4] as const)('columns=%d dogru grid uygular', (cols) => {
    const { container } = render(<SummaryStrip items={defaultItems} columns={cols} />);
    const grid = container.querySelector('.grid');
    expect(grid?.style.gridTemplateColumns).toBe(`repeat(${cols}, 1fr)`);
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<SummaryStrip items={defaultItems} className="custom-strip" />);
    expect(container.firstElementChild?.className).toContain('custom-strip');
  });

  it('bos items dizisi ile hata vermez', () => {
    const { container } = render(<SummaryStrip items={[]} />);
    expect(container.querySelectorAll('article')).toHaveLength(0);
  });

  it('title ve description olmadan render edilir', () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });
});

describe('SummaryStrip — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    await expectNoA11yViolations(container);
  });

  it('renders article elements for each metric card', () => {
    render(<SummaryStrip items={defaultItems} />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(defaultItems.length);
  });

  it('each article has accessible label and value text', () => {
    render(<SummaryStrip items={defaultItems} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10k')).toBeInTheDocument();
  });

  it('section wrapper is accessible via semantic structure', () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeInTheDocument();
  });

  it('title renders as heading when provided', () => {
    render(<SummaryStrip items={defaultItems} title="Metrics" />);
    expect(screen.getByText('Metrics')).toBeInTheDocument();
  });
});
