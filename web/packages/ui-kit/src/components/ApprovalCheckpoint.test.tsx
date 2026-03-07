import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ApprovalCheckpoint from './ApprovalCheckpoint';

describe('ApprovalCheckpoint', () => {
  test('title, summary ve checklist gosterir', () => {
    render(
      <ApprovalCheckpoint
        title="Release approval"
        summary="Publish oncesi insan onayi zorunlu."
        steps={[{ key: 'doctor', label: 'Doctor evidence', status: 'approved' }]}
        evidenceItems={['doctor:frontend']}
      />,
    );

    expect(screen.getByText('Release approval')).toBeInTheDocument();
    expect(screen.getByText('Publish oncesi insan onayi zorunlu.')).toBeInTheDocument();
    expect(screen.getByText('Doctor evidence')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('primary action callback cagrilir', () => {
    const onPrimaryAction = jest.fn();
    render(<ApprovalCheckpoint title="Approval" summary="Summary" onPrimaryAction={onPrimaryAction} />);

    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    expect(onPrimaryAction).toHaveBeenCalled();
  });

  test('readonly access durumunda aksiyon bloklanir', () => {
    const onPrimaryAction = jest.fn();
    render(<ApprovalCheckpoint title="Readonly" summary="Summary" access="readonly" onPrimaryAction={onPrimaryAction} />);

    fireEvent.click(screen.getByRole('button', { name: /Approve/i }));
    expect(onPrimaryAction).not.toHaveBeenCalled();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<ApprovalCheckpoint title="Hidden" summary="Summary" access="hidden" />);
    expect(container).toBeEmptyDOMElement();
  });
});
