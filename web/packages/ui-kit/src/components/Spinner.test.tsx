import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  test('status role ve label ile render edilir', () => {
    render(<Spinner label="Kayıtlar yükleniyor" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Kayıtlar yükleniyor')).toBeInTheDocument();
  });
});
