// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { MasterDetail } from '../master-detail/MasterDetail';

afterEach(cleanup);

describe('MasterDetail — depth', () => {
  it('renders master and detail', () => {
    render(<MasterDetail master={<div>Master</div>} detail={<div>Detail</div>} />);
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('shows empty state when no selection', () => {
    render(
      <MasterDetail master={<div>List</div>} detail={<div>D</div>} hasSelection={false} />,
    );
    expect(screen.getByText('Select an item to view details')).toBeInTheDocument();
  });

  it('collapse button hides master panel', () => {
    render(
      <MasterDetail master={<div>Master</div>} detail={<div>Detail</div>} collapsible masterHeader={<span>Header</span>} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }));
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('expand button restores master', () => {
    render(
      <MasterDetail master={<div>Master</div>} detail={<div>Detail</div>} collapsible masterHeader={<span>Header</span>} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }));
    fireEvent.click(screen.getByRole('button', { name: /expand/i }));
    expect(screen.getByText('Master')).toBeInTheDocument();
  });

  it('disabled — custom detailEmpty message', () => {
    render(
      <MasterDetail master={<div>List</div>} detail={<div>D</div>} hasSelection={false} detailEmpty={<div>No selection</div>} />,
    );
    expect(screen.getByText('No selection')).toBeInTheDocument();
  });

  it('empty master renders safely', () => {
    const { container } = render(
      <MasterDetail master={<></>} detail={<div>Detail</div>} />,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
