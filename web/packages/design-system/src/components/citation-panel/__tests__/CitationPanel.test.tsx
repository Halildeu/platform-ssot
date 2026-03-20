// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CitationPanel, type CitationPanelProps, type CitationPanelItem } from '../CitationPanel';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleItem: CitationPanelItem = {
  id: 'c1',
  title: 'Policy doc',
  excerpt: 'Excerpt from the document.',
  source: 'Internal wiki',
  kind: 'policy',
};

const baseProps: CitationPanelProps = {
  items: [sampleItem],
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('CitationPanel — temel render', () => {
  it('varsayilan title render eder', () => {
    render(<CitationPanel {...baseProps} />);
    expect(screen.getByText('Alintilar')).toBeInTheDocument();
  });

  it('item title ve source gosterir', () => {
    render(<CitationPanel {...baseProps} />);
    expect(screen.getByText('Policy doc')).toBeInTheDocument();
    expect(screen.getByText('Internal wiki')).toBeInTheDocument();
  });

  it('excerpt gosterir', () => {
    render(<CitationPanel {...baseProps} />);
    expect(screen.getByText('Excerpt from the document.')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<CitationPanel {...baseProps} />);
    expect(container.querySelector('[data-component="citation-panel"]')).toBeInTheDocument();
  });

  it('section elementini render eder', () => {
    const { container } = render(<CitationPanel {...baseProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('CitationPanel — empty state', () => {
  it('items bos iken empty state render eder', () => {
    render(<CitationPanel items={[]} />);
    // EmptyState component renders the description
    expect(screen.queryByText('Policy doc')).not.toBeInTheDocument();
  });

  it('ozel emptyStateLabel kullanilir', () => {
    render(<CitationPanel items={[]} emptyStateLabel="No citations available" />);
    expect(screen.getByText('No citations available')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Kind badges                                                        */
/* ------------------------------------------------------------------ */

describe('CitationPanel — kind badges', () => {
  it.each(['policy', 'doc', 'code', 'log', 'dataset'] as const)(
    'kind="%s" badge render eder',
    (kind) => {
      render(
        <CitationPanel items={[{ ...sampleItem, kind }]} />,
      );
      expect(screen.getByText(kind)).toBeInTheDocument();
    },
  );

  it('locator badge render eder', () => {
    render(
      <CitationPanel items={[{ ...sampleItem, locator: 'Section 3.2' }]} />,
    );
    expect(screen.getByText('Section 3.2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('CitationPanel — interaction', () => {
  it('onOpenCitation handler calisir', async () => {
    const handleOpen = vi.fn();
    render(<CitationPanel {...baseProps} onOpenCitation={handleOpen} />);
    await userEvent.click(screen.getByText('Policy doc'));
    expect(handleOpen).toHaveBeenCalledTimes(1);
    expect(handleOpen).toHaveBeenCalledWith('c1', sampleItem);
  });

  it('onOpenCitation olmadan button yerine div render eder', () => {
    const { container } = render(<CitationPanel {...baseProps} />);
    expect(container.querySelector('button')).toBeNull();
  });

  it('onOpenCitation verilince button render eder', () => {
    render(<CitationPanel {...baseProps} onOpenCitation={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('activeCitationId secili iteme aria-current atar', () => {
    render(
      <CitationPanel {...baseProps} activeCitationId="c1" onOpenCitation={vi.fn()} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('CitationPanel — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <CitationPanel {...baseProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" durumunda onClick calismaz', async () => {
    const handleOpen = vi.fn();
    render(
      <CitationPanel
        {...baseProps}
        access="disabled"
        onOpenCitation={handleOpen}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleOpen).not.toHaveBeenCalled();
  });

  it('accessReason title olarak section ve buttonlara atanir', () => {
    render(
      <CitationPanel
        {...baseProps}
        accessReason="Read only mode"
        onOpenCitation={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Read only mode');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('CitationPanel — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <CitationPanel {...baseProps} className="my-class" />,
    );
    expect(container.querySelector('section')?.className).toContain('my-class');
  });

  it('ozel title ve description render eder', () => {
    render(
      <CitationPanel
        {...baseProps}
        title="Sources"
        description="Referenced documents"
      />,
    );
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('Referenced documents')).toBeInTheDocument();
  });

  it('birden fazla item render eder', () => {
    const items: CitationPanelItem[] = [
      sampleItem,
      { id: 'c2', title: 'Second doc', excerpt: 'Another excerpt', source: 'External' },
    ];
    render(<CitationPanel items={items} />);
    expect(screen.getByText('Policy doc')).toBeInTheDocument();
    expect(screen.getByText('Second doc')).toBeInTheDocument();
  });

  it('item badges render eder', () => {
    const items: CitationPanelItem[] = [
      { ...sampleItem, badges: [<span key="b" data-testid="item-badge">New</span>] },
    ];
    render(<CitationPanel items={items} />);
    expect(screen.getByTestId('item-badge')).toBeInTheDocument();
  });
});

describe('CitationPanel — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<CitationPanel {...baseProps} />);
    await expectNoA11yViolations(container);
  });
});
