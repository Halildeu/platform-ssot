import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  test('isimden initials fallback üretir', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL')).toBeInTheDocument();
  });
});
