import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { JsonViewer } from './JsonViewer';

describe('JsonViewer', () => {
  test('object ozeti ve primitive degerleri gosterir', () => {
    render(
      <JsonViewer
        title="Payload"
        value={{
          id: 'CFG-001',
          enabled: true,
        }}
      />,
    );

    expect(screen.getByText('Payload')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('"CFG-001"')).toBeInTheDocument();
    expect(screen.getByText('boolean')).toBeInTheDocument();
  });

  test('nested object dugumu tiklaninca acilir', () => {
    render(
      <JsonViewer
        value={{
          meta: {
            owner: 'platform',
          },
        }}
        defaultExpandedDepth={1}
      />,
    );

    expect(screen.queryByText('"platform"')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /meta/i }));
    expect(screen.getByText('"platform"')).toBeInTheDocument();
  });

  test('undefined veri icin empty state gosterir', () => {
    render(<JsonViewer value={undefined} emptyStateLabel="JSON yok." />);
    expect(screen.getByText('JSON yok.')).toBeInTheDocument();
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<JsonViewer access="hidden" value={{ ok: true }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
