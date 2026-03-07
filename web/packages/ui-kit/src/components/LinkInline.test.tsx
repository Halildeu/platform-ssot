import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkInline from './LinkInline';

describe('LinkInline', () => {
  test('external link için güvenli target ve rel defaultlarini uygular', () => {
    render(<LinkInline href="https://example.com">Doküman</LinkInline>);

    const link = screen.getByRole('link', { name: /Doküman/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('data-link-state', 'external');
    expect(screen.getByText('Harici bağlantı')).toHaveClass('sr-only');
  });

  test('disabled durumda tıklanamaz span fallback render eder', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <LinkInline href="#x" disabled onClick={handleClick}>
        Pasif
      </LinkInline>,
    );

    expect(screen.queryByRole('link', { name: 'Pasif' })).toBeNull();
    const fallback = screen.getByText('Pasif').closest('[data-link-state="blocked"]');
    expect(fallback).toHaveAttribute('data-link-state', 'blocked');
    await user.click(fallback as HTMLElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('current durumda aria-current ve current state metadata tasir', () => {
    render(
      <LinkInline href="#current" current>
        Aktif
      </LinkInline>,
    );

    const link = screen.getByRole('link', { name: 'Aktif' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-link-state', 'current');
  });
});
