import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  test('isimden initials fallback üretir', () => {
    render(<Avatar name="Ada Lovelace" />);

    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByLabelText('Ada Lovelace')).toHaveAttribute('data-fallback', 'initials');
  });

  test('broken image durumunda initials fallback ile çökmeden devam eder', () => {
    render(<Avatar name="Grace Hopper" src="/broken-avatar.png" alt="Grace Hopper" />);

    const image = screen.getByAltText('Grace Hopper');
    fireEvent.error(image);

    expect(screen.getByText('GH')).toBeInTheDocument();
    expect(screen.getByLabelText('Grace Hopper')).toHaveAttribute('data-fallback', 'initials');
  });

  test('icon fallback metadata ile render edilir', () => {
    render(<Avatar fallbackIcon={<span aria-hidden="true">👤</span>} data-testid="avatar" />);

    expect(screen.getByTestId('avatar')).toHaveAttribute('data-fallback', 'icon');
  });
});
