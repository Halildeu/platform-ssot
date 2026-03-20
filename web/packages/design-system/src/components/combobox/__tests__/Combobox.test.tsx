// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox, type ComboboxOption } from '../Combobox';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleOptions: ComboboxOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Combobox — temel render', () => {
  it('combobox role ile input render eder', () => {
    render(<Combobox options={sampleOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('label render eder', () => {
    render(<Combobox options={sampleOptions} label="Select fruit" />);
    expect(screen.getByText('Select fruit')).toBeInTheDocument();
  });

  it('placeholder gosterir', () => {
    render(<Combobox options={sampleOptions} placeholder="Pick one" />);
    expect(screen.getByPlaceholderText('Pick one')).toBeInTheDocument();
  });

  it('description render eder', () => {
    render(<Combobox options={sampleOptions} description="Choose your favorite" />);
    expect(screen.getByText('Choose your favorite')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Controlled value                                                   */
/* ------------------------------------------------------------------ */

describe('Combobox — controlled value', () => {
  it('defaultValue ile baslangic degeri ayarlanir', () => {
    render(<Combobox options={sampleOptions} defaultValue="banana" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Banana');
  });

  it('value kontrollü mod calisir', () => {
    render(<Combobox options={sampleOptions} value="cherry" />);
    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('Cherry');
  });
});

/* ------------------------------------------------------------------ */
/*  Dropdown popup                                                     */
/* ------------------------------------------------------------------ */

describe('Combobox — dropdown popup', () => {
  it('focus ile listbox acilir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('acildiginda tum secenekleri gosterir', () => {
    render(<Combobox options={sampleOptions} />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('Escape ile kapanir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Filtering                                                          */
/* ------------------------------------------------------------------ */

describe('Combobox — filtering', () => {
  it('input degeri ile filtreleme yapar', async () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'app');
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('eslesen sonuc yoksa noOptionsText gosterir', async () => {
    render(<Combobox options={sampleOptions} noOptionsText="No results" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'xyz');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe('Combobox — selection', () => {
  it('secim yapildiginda onValueChange cagrilir', async () => {
    const handleChange = vi.fn();
    render(<Combobox options={sampleOptions} onValueChange={handleChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    await userEvent.click(screen.getByText('Banana'));
    expect(handleChange).toHaveBeenCalledWith('banana', expect.objectContaining({ value: 'banana' }));
  });

  it('keyboard ile secenek secilir (ArrowDown + Enter)', () => {
    const handleChange = vi.fn();
    render(<Combobox options={sampleOptions} onValueChange={handleChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Clearable                                                          */
/* ------------------------------------------------------------------ */

describe('Combobox — clearable', () => {
  it('clearable=true ve deger varken clear button gosterir', () => {
    render(<Combobox options={sampleOptions} clearable defaultValue="apple" />);
    expect(screen.getByTitle('Secimi temizle')).toBeInTheDocument();
  });

  it('clearable=false clear button gostermez', () => {
    render(<Combobox options={sampleOptions} defaultValue="apple" />);
    expect(screen.queryByTitle('Secimi temizle')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Error state                                                        */
/* ------------------------------------------------------------------ */

describe('Combobox — error state', () => {
  it('error mesaji render eder', () => {
    render(<Combobox options={sampleOptions} error="This is required" />);
    expect(screen.getByText('This is required')).toBeInTheDocument();
  });

  it('aria-invalid true olur', () => {
    render(<Combobox options={sampleOptions} error="Required" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Loading state                                                      */
/* ------------------------------------------------------------------ */

describe('Combobox — loading state', () => {
  it('loading durumunda loading text gosterir', () => {
    render(<Combobox options={[]} loading loadingText="Loading..." />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled / Readonly                                                */
/* ------------------------------------------------------------------ */

describe('Combobox — disabled / readonly', () => {
  it('disabled durumunda input disabled olur', () => {
    render(<Combobox options={sampleOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('access="disabled" durumunda input disabled olur', () => {
    render(<Combobox options={sampleOptions} access="disabled" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('access="readonly" durumunda input readOnly olur', () => {
    render(<Combobox options={sampleOptions} access="readonly" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('readonly');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Combobox — access control', () => {
  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<Combobox options={sampleOptions} access="hidden" />);
    expect(container.querySelector('[data-field-type="combobox"]')).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<Combobox options={sampleOptions} accessReason="Yetkiniz yok" />);
    expect(container.querySelector('[data-field-type="combobox"]')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Combobox — edge cases', () => {
  it('fullWidth=true (varsayilan) w-full class icerir', () => {
    const { container } = render(<Combobox options={sampleOptions} />);
    expect(container.querySelector('.w-full')).toBeInTheDocument();
  });

  it('disabled option aria-disabled alir', () => {
    const options: ComboboxOption[] = [
      { label: 'Apple', value: 'apple', disabled: true },
      { label: 'Banana', value: 'banana' },
    ];
    render(<Combobox options={options} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    const disabledOption = screen.getByRole('option', { name: /Apple/i });
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('aria-expanded acilinca true olur', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    fireEvent.focus(input);
    expect(input).toHaveAttribute('aria-expanded', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation (Faz 3 — keyboard-complete)                    */
/* ------------------------------------------------------------------ */

describe('Combobox — keyboard navigation', () => {
  it('ArrowDown kapali dropdown acilir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    // Do NOT focus first (which would open it) — simulate closed state
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('ArrowUp kapali dropdown acilir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('ArrowDown ile secenekler arasinda gezinir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // First ArrowDown highlights first option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // aria-activedescendant should reference the highlighted option
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    // Move down again
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const nextActiveId = input.getAttribute('aria-activedescendant');
    expect(nextActiveId).toBeTruthy();
    expect(nextActiveId).not.toBe(activeId);
  });

  it('ArrowUp ile yukari gezinir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Navigate down twice then up once
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const firstId = input.getAttribute('aria-activedescendant');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    const afterUpId = input.getAttribute('aria-activedescendant');
    expect(afterUpId).toBe(firstId);
  });

  it('typing ile filtreleme yapilir ve sonuclar guncellenir', async () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    await userEvent.clear(input);
    await userEvent.type(input, 'ban');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('Enter ile vurgulanan secenek secilir', () => {
    const handleChange = vi.fn();
    render(<Combobox options={sampleOptions} onValueChange={handleChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Navigate to second option (Banana — index moves from initial highlight)
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalled();
    // Dropdown closes after selection in single mode
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('Enter bos highlight ile hicbir sey secmez (freeSolo kapaliyken)', async () => {
    const handleChange = vi.fn();
    render(<Combobox options={sampleOptions} onValueChange={handleChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // Type something that has no matches
    await userEvent.clear(input);
    await userEvent.type(input, 'xyz');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('Escape ile dropdown kapanir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    // aria-expanded should be false after closing
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('Escape sonrasi ArrowDown ile tekrar acilir', () => {
    render(<Combobox options={sampleOptions} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('disabled option ArrowDown ile atlanir (skip policy)', () => {
    const options: ComboboxOption[] = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana', disabled: true },
      { label: 'Cherry', value: 'cherry' },
    ];
    render(<Combobox options={options} disabledItemFocusPolicy="skip" />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    // On focus-open, initial highlight lands on first navigable option (Apple)
    const initialActiveId = input.getAttribute('aria-activedescendant');
    expect(initialActiveId).toContain('apple');
    // First ArrowDown from Apple skips disabled Banana, goes to Cherry
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const afterDownId = input.getAttribute('aria-activedescendant');
    expect(afterDownId).toContain('cherry');
  });

  it('onHighlightChange keyboard navigasyonunda cagrilir', () => {
    const handleHighlight = vi.fn();
    render(<Combobox options={sampleOptions} onHighlightChange={handleHighlight} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    handleHighlight.mockClear();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(handleHighlight).toHaveBeenCalled();
  });

  it('disabled combobox input disabled ve aria-disabled olur', () => {
    render(<Combobox options={sampleOptions} disabled />);
    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Accessibility (axe)                                                */
/* ------------------------------------------------------------------ */

describe('Combobox — a11y', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Combobox options={sampleOptions} label="Select fruit" />);
    await expectNoA11yViolations(container);
  });
});
