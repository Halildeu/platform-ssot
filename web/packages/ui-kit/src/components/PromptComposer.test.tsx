import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PromptComposer from './PromptComposer';

describe('PromptComposer', () => {
  test('subject, body ve guardrails gosterir', () => {
    render(
      <PromptComposer
        defaultSubject="Quarterly review"
        defaultValue="Write a concise executive summary."
        guardrails={['pii-safe', 'approval-bound']}
        citations={['policy_work_intake', 'ux_katalogu']}
      />,
    );

    expect(screen.getByDisplayValue('Quarterly review')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Write a concise executive summary.')).toBeInTheDocument();
    expect(screen.getByText('pii-safe')).toBeInTheDocument();
    expect(screen.getByText('ux_katalogu')).toBeInTheDocument();
  });

  test('onValueChange callback cagrilir', () => {
    const onValueChange = jest.fn();
    render(<PromptComposer onValueChange={onValueChange} />);

    fireEvent.change(screen.getByLabelText(/Prompt body/i), { target: { value: 'Create a risk summary' } });
    expect(onValueChange).toHaveBeenCalledWith('Create a risk summary');
  });

  test('scope ve tone secimleri callback uretir', () => {
    const onScopeChange = jest.fn();
    const onToneChange = jest.fn();
    render(<PromptComposer onScopeChange={onScopeChange} onToneChange={onToneChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'approval' }));
    fireEvent.click(screen.getByRole('button', { name: 'strict' }));

    expect(onScopeChange).toHaveBeenCalledWith('approval');
    expect(onToneChange).toHaveBeenCalledWith('strict');
  });

  test('readonly access durumunda body degisimini bloklar', () => {
    const onValueChange = jest.fn();
    render(<PromptComposer access="readonly" onValueChange={onValueChange} defaultValue="locked" />);

    fireEvent.change(screen.getByLabelText(/Prompt body/i), { target: { value: 'changed' } });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
