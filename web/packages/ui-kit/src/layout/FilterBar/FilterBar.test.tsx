import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  test('reset ve save callbacks tetiklenir', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();
    const onSaveView = jest.fn();

    render(
      <FilterBar onReset={onReset} onSaveView={onSaveView}>
        <div>Arama</div>
      </FilterBar>,
    );

    await user.click(screen.getByTestId('filter-bar-reset'));
    await user.click(screen.getByTestId('filter-bar-save-view'));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSaveView).toHaveBeenCalledTimes(1);
  });

  test('hidden access durumunda render etmez', () => {
    const { container } = render(<FilterBar access="hidden">x</FilterBar>);
    expect(container.firstChild).toBeNull();
  });
});
