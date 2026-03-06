import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LinkInline from './LinkInline';

describe('LinkInline', () => {
  test('external link için güvenli target ve rel defaultlarini uygular', () => {
    render(<LinkInline href="https://example.com">Doküman</LinkInline>);

    const link = screen.getByRole('link', { name: 'Doküman' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
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
    const fallback = screen.getByText('Pasif');
    await user.click(fallback);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
