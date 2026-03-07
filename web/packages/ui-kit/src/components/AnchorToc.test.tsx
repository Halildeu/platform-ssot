import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AnchorToc from './AnchorToc';

const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'security', label: 'Security', level: 2 as const },
  { id: 'release', label: 'Release', level: 3 as const },
];

describe('AnchorToc', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '#');
  });

  test('default active item aria-current ile işaretlenir', () => {
    render(<AnchorToc items={items} defaultValue="security" />);

    expect(screen.getByRole('link', { name: 'Security' })).toHaveAttribute('aria-current', 'location');
  });

  test('tıklama active state ve hash değerini günceller', () => {
    const onValueChange = jest.fn();
    render(<AnchorToc items={items} defaultValue="overview" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('link', { name: 'Release' }));

    expect(screen.getByRole('link', { name: 'Release' })).toHaveAttribute('aria-current', 'location');
    expect(window.location.hash).toBe('#release');
    expect(onValueChange).toHaveBeenCalledWith('release');
  });

  test('hash değeri mevcutsa uncontrolled modda onu tercih eder', () => {
    window.history.replaceState(null, '', '#security');
    render(<AnchorToc items={items} />);

    expect(screen.getByRole('link', { name: 'Security' })).toHaveAttribute('aria-current', 'location');
  });

  test('disabled item interaction kabul etmez', () => {
    render(
      <AnchorToc
        items={[
          { id: 'overview', label: 'Overview' },
          { id: 'security', label: 'Security', disabled: true },
        ]}
        defaultValue="overview"
      />,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Security' }));

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'location');
    expect(window.location.hash).toBe('');
  });
});
