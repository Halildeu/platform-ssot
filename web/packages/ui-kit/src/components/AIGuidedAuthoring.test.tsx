import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AIGuidedAuthoring from './AIGuidedAuthoring';

describe('AIGuidedAuthoring', () => {
  test('prompt composer ve recommendation stack render eder', () => {
    render(
      <AIGuidedAuthoring
        recommendations={[
          {
            id: 'rec-1',
            title: 'Use approval review recipe',
            summary: 'Duplicate review flow yerine canonical recipe kullan.',
          },
        ]}
      />,
    );

    expect(screen.getByText('AI guided authoring')).toBeInTheDocument();
    expect(screen.getByText('Use approval review recipe')).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt title/i)).toBeInTheDocument();
  });

  test('command palette butonu palettei acar', () => {
    render(
      <AIGuidedAuthoring
        commandItems={[
          { id: 'open-recipe', title: 'Open recipe registry', group: 'Navigate' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Command palette/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Open recipe registry')).toBeInTheDocument();
  });
});
