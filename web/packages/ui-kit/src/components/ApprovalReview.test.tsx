import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ApprovalReview from './ApprovalReview';

describe('ApprovalReview', () => {
  test('checkpoint, citation ve audit alanlarini render eder', () => {
    render(
      <ApprovalReview
        checkpoint={{ title: 'Approval', summary: 'Human check gerekir.' }}
        citations={[
          {
            id: 'policy',
            title: 'Policy',
            excerpt: 'Policy excerpt',
            source: 'policy.md',
          },
        ]}
        auditItems={[
          {
            id: 'audit-1',
            actor: 'ai',
            title: 'Draft generated',
            timestamp: '09:30',
          },
        ]}
      />,
    );

    expect(screen.getByText('Approval')).toBeInTheDocument();
    expect(screen.getByText('Policy excerpt')).toBeInTheDocument();
    expect(screen.getByText('Draft generated')).toBeInTheDocument();
  });

  test('citation secimi callback cagirir', () => {
    const onCitationSelect = jest.fn();
    render(
      <ApprovalReview
        checkpoint={{ title: 'Approval', summary: 'Summary' }}
        citations={[
          {
            id: 'policy',
            title: 'Policy',
            excerpt: 'Policy excerpt',
            source: 'policy.md',
          },
        ]}
        auditItems={[]}
        onCitationSelect={onCitationSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Policy/i }));
    expect(onCitationSelect).toHaveBeenCalledWith('policy', expect.objectContaining({ id: 'policy' }));
  });
});
