import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CitationPanel from './CitationPanel';

describe('CitationPanel', () => {
  const items = [
    {
      id: 'policy-1',
      title: 'Etik politika',
      excerpt: 'Madde 4.2 insan onayi gerektirir.',
      source: 'policy_work_intake.v2',
      locator: 'sec:4.2',
      kind: 'policy' as const,
    },
  ];

  test('citation itemlarini gosterir', () => {
    render(<CitationPanel items={items} />);

    expect(screen.getByText('Etik politika')).toBeInTheDocument();
    expect(screen.getByText('Madde 4.2 insan onayi gerektirir.')).toBeInTheDocument();
    expect(screen.getByText('policy')).toBeInTheDocument();
  });

  test('onOpenCitation callback cagrilir', () => {
    const onOpenCitation = jest.fn();
    render(<CitationPanel items={items} onOpenCitation={onOpenCitation} />);

    fireEvent.click(screen.getByRole('button', { name: /Etik politika/i }));
    expect(onOpenCitation).toHaveBeenCalledWith('policy-1', expect.objectContaining({ id: 'policy-1' }));
  });

  test('readonly access durumunda callback bloklanir', () => {
    const onOpenCitation = jest.fn();
    render(<CitationPanel items={items} onOpenCitation={onOpenCitation} access="readonly" />);

    fireEvent.click(screen.getByRole('button', { name: /Etik politika/i }));
    expect(onOpenCitation).not.toHaveBeenCalled();
  });

  test('bos listede empty state gosterir', () => {
    render(<CitationPanel items={[]} emptyStateLabel="Kaynak yok" />);
    expect(screen.getByText('Kaynak yok')).toBeInTheDocument();
  });
});
