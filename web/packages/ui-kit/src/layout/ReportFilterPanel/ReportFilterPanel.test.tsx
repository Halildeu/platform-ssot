import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportFilterPanel } from './ReportFilterPanel';

describe('ReportFilterPanel', () => {
  test('submit ve reset aksiyonlari calisir', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    const onReset = jest.fn();

    render(
      <ReportFilterPanel onSubmit={onSubmit} onReset={onReset}>
        <div>Alan</div>
      </ReportFilterPanel>,
    );

    fireEvent.submit(screen.getByTestId('report-filter-panel'));
    await user.click(screen.getByTestId('report-filter-reset'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test('readonly access submiti bloklar', () => {
    const onSubmit = jest.fn();

    render(
      <ReportFilterPanel onSubmit={onSubmit} access="readonly">
        <div>Alan</div>
      </ReportFilterPanel>,
    );

    fireEvent.submit(screen.getByTestId('report-filter-panel'));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
