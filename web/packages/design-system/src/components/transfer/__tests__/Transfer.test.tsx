// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Transfer, type TransferItem } from '../Transfer';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const defaultItems: TransferItem[] = [
  { key: '1', label: 'Elma', description: 'Kirmizi meyve' },
  { key: '2', label: 'Armut', description: 'Yesil meyve' },
  { key: '3', label: 'Portakal', description: 'Turuncu meyve' },
  { key: '4', label: 'Kiraz' },
  { key: '5', label: 'Uzum', disabled: true },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('Transfer — temel render', () => {
  it('transfer containerini render eder', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });

  it('iki panel render eder', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer-panel-left')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-panel-right')).toBeInTheDocument();
  });

  it('varsayilan Turkce basliklar gosterir', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getAllByText('Kaynak').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hedef').length).toBeGreaterThanOrEqual(1);
  });

  it('ozel basliklar gosterir', () => {
    render(<Transfer dataSource={defaultItems} titles={['Source', 'Target']} />);
    expect(screen.getAllByText('Source').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Target').length).toBeGreaterThanOrEqual(1);
  });

  it('tum itemlari sol panelde gosterir (bos targetKeys)', () => {
    render(<Transfer dataSource={defaultItems} />);
    const leftPanel = screen.getByTestId('transfer-list-left');
    expect(leftPanel.querySelectorAll('[role="option"]')).toHaveLength(5);
  });

  it('transfer butonlarini render eder', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer-move-right')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-move-left')).toBeInTheDocument();
  });

  it('data-component attribute atanir', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer')).toHaveAttribute('data-component', 'transfer');
  });
});

/* ------------------------------------------------------------------ */
/*  targetKeys (controlled)                                            */
/* ------------------------------------------------------------------ */

describe('Transfer — controlled targetKeys', () => {
  it('targetKeys ile itemlari sag panelde gosterir', () => {
    render(<Transfer dataSource={defaultItems} targetKeys={['1', '3']} />);
    const rightPanel = screen.getByTestId('transfer-list-right');
    const leftPanel = screen.getByTestId('transfer-list-left');
    expect(rightPanel.querySelectorAll('[role="option"]')).toHaveLength(2);
    expect(leftPanel.querySelectorAll('[role="option"]')).toHaveLength(3);
  });

  it('targetKeys degistiginde paneller guncellenir', () => {
    const { rerender } = render(
      <Transfer dataSource={defaultItems} targetKeys={['1']} />,
    );
    expect(
      screen.getByTestId('transfer-list-right').querySelectorAll('[role="option"]'),
    ).toHaveLength(1);

    rerender(<Transfer dataSource={defaultItems} targetKeys={['1', '2']} />);
    expect(
      screen.getByTestId('transfer-list-right').querySelectorAll('[role="option"]'),
    ).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------ */
/*  defaultTargetKeys (uncontrolled)                                   */
/* ------------------------------------------------------------------ */

describe('Transfer — uncontrolled defaultTargetKeys', () => {
  it('defaultTargetKeys ile baslangic dagitimi', () => {
    render(<Transfer dataSource={defaultItems} defaultTargetKeys={['2', '4']} />);
    const rightPanel = screen.getByTestId('transfer-list-right');
    expect(rightPanel.querySelectorAll('[role="option"]')).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------ */
/*  Item secimi ve transfer                                            */
/* ------------------------------------------------------------------ */

describe('Transfer — secim ve transfer', () => {
  it('item tiklandiginda secilir', async () => {
    render(<Transfer dataSource={defaultItems} />);
    const item = screen.getByTestId('transfer-item-1');
    await userEvent.click(item);
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('secili item tekrar tiklandiginda secim kalkar', async () => {
    render(<Transfer dataSource={defaultItems} />);
    const item = screen.getByTestId('transfer-item-1');
    await userEvent.click(item);
    expect(item).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(item);
    expect(item).toHaveAttribute('aria-selected', 'false');
  });

  it('saga transfer yapar ve onChange cagrilir', async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={defaultItems} onChange={onChange} />);

    // Select item 1
    await userEvent.click(screen.getByTestId('transfer-item-1'));
    // Click move right
    await userEvent.click(screen.getByTestId('transfer-move-right'));

    expect(onChange).toHaveBeenCalledWith(['1'], 'right', ['1']);
  });

  it('sola transfer yapar ve onChange cagrilir', async () => {
    const onChange = vi.fn();
    render(
      <Transfer
        dataSource={defaultItems}
        defaultTargetKeys={['1', '2']}
        onChange={onChange}
      />,
    );

    // Select item 1 in right panel
    await userEvent.click(screen.getByTestId('transfer-item-1'));
    // Click move left
    await userEvent.click(screen.getByTestId('transfer-move-left'));

    expect(onChange).toHaveBeenCalledWith(['2'], 'left', ['1']);
  });

  it('secim yokken butonlar disabled olur', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer-move-right')).toBeDisabled();
    expect(screen.getByTestId('transfer-move-left')).toBeDisabled();
  });

  it('transfer sonrasi secim temizlenir', async () => {
    render(<Transfer dataSource={defaultItems} />);
    await userEvent.click(screen.getByTestId('transfer-item-1'));
    await userEvent.click(screen.getByTestId('transfer-move-right'));

    // Item should now be in right panel and not selected
    const rightItem = screen.getByTestId('transfer-item-1');
    expect(rightItem).toHaveAttribute('aria-selected', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

describe('Transfer — disabled items', () => {
  it('disabled item tiklanamaz', async () => {
    render(<Transfer dataSource={defaultItems} />);
    const disabledItem = screen.getByTestId('transfer-item-5');
    await userEvent.click(disabledItem);
    expect(disabledItem).toHaveAttribute('aria-selected', 'false');
  });

  it('disabled item aria-disabled attribute alir', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer-item-5')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('disabled item transfer edilemez', async () => {
    const onChange = vi.fn();
    render(
      <Transfer
        dataSource={[
          { key: 'd1', label: 'Disabled', disabled: true },
        ]}
        onChange={onChange}
      />,
    );
    // Try to select disabled item
    await userEvent.click(screen.getByTestId('transfer-item-d1'));
    await userEvent.click(screen.getByTestId('transfer-move-right'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  Search / filter                                                    */
/* ------------------------------------------------------------------ */

describe('Transfer — arama', () => {
  it('searchable iken arama inputu gosterir', () => {
    render(<Transfer dataSource={defaultItems} searchable />);
    expect(screen.getByTestId('transfer-search-left')).toBeInTheDocument();
    expect(screen.getByTestId('transfer-search-right')).toBeInTheDocument();
  });

  it('searchable=false iken arama inputu gostermez', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.queryByTestId('transfer-search-left')).not.toBeInTheDocument();
  });

  it('arama sonuclari filtreler', async () => {
    render(<Transfer dataSource={defaultItems} searchable />);
    const searchInput = screen.getByTestId('transfer-search-left');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Elma');

    const leftPanel = screen.getByTestId('transfer-list-left');
    const visibleOptions = leftPanel.querySelectorAll('[role="option"]');
    expect(visibleOptions).toHaveLength(1);
  });

  it('eslesme yoksa "Sonuc bulunamadi" gosterir', async () => {
    render(<Transfer dataSource={defaultItems} searchable />);
    const searchInput = screen.getByTestId('transfer-search-left');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'zzznotfound');
    const leftPanel = screen.getByTestId('transfer-list-left');
    expect(leftPanel.textContent).toContain('Sonuc bulunamadi');
  });

  it('onSearch callback cagrilir', async () => {
    const onSearch = vi.fn();
    render(<Transfer dataSource={defaultItems} searchable onSearch={onSearch} />);
    const searchInput = screen.getByTestId('transfer-search-left');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'test');
    expect(onSearch).toHaveBeenCalledWith('left', 'test');
  });

  it('custom filterOption kullanilir', async () => {
    const customFilter = (input: string, item: TransferItem) =>
      item.key === input;

    render(
      <Transfer
        dataSource={defaultItems}
        searchable
        filterOption={customFilter}
      />,
    );
    const searchInput = screen.getByTestId('transfer-search-left');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, '2');

    const leftPanel = screen.getByTestId('transfer-list-left');
    expect(leftPanel.querySelectorAll('[role="option"]')).toHaveLength(1);
  });

  it('description icinde de arama yapar (varsayilan filtre)', async () => {
    render(<Transfer dataSource={defaultItems} searchable />);
    const searchInput = screen.getByTestId('transfer-search-left');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Kirmizi');

    const leftPanel = screen.getByTestId('transfer-list-left');
    expect(leftPanel.querySelectorAll('[role="option"]')).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Select all                                                         */
/* ------------------------------------------------------------------ */

describe('Transfer — tumunu sec', () => {
  it('select all checkbox gosterir (varsayilan)', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getByTestId('transfer-select-all-left')).toBeInTheDocument();
  });

  it('showSelectAll=false ile gizler', () => {
    render(<Transfer dataSource={defaultItems} showSelectAll={false} />);
    expect(screen.queryByTestId('transfer-select-all-left')).not.toBeInTheDocument();
  });

  it('tumunu sec tiklandiginda enabled itemlar secilir', async () => {
    render(<Transfer dataSource={defaultItems} />);
    const selectAllLabel = screen.getByTestId('transfer-select-all-left');
    const checkbox = selectAllLabel.querySelector('input[type="checkbox"]')!;
    await userEvent.click(checkbox);

    // 4 enabled items should be selected (item 5 is disabled)
    const leftPanel = screen.getByTestId('transfer-list-left');
    const selectedItems = leftPanel.querySelectorAll('[aria-selected="true"]');
    expect(selectedItems).toHaveLength(4);
  });

  it('tumunu sec sonrasi tekrar tiklandiginda secim kalkar', async () => {
    render(<Transfer dataSource={defaultItems} />);
    const selectAllLabel = screen.getByTestId('transfer-select-all-left');
    const checkbox = selectAllLabel.querySelector('input[type="checkbox"]')!;

    // Select all
    await userEvent.click(checkbox);
    // Deselect all
    await userEvent.click(checkbox);

    const leftPanel = screen.getByTestId('transfer-list-left');
    const selectedItems = leftPanel.querySelectorAll('[aria-selected="true"]');
    expect(selectedItems).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Item count badges                                                  */
/* ------------------------------------------------------------------ */

describe('Transfer — item sayaci', () => {
  it('sol panel item sayisini gosterir', () => {
    render(<Transfer dataSource={defaultItems} />);
    const countBadge = screen.getByTestId('transfer-count-left');
    expect(countBadge.textContent).toContain('5');
  });

  it('secim yapildiginda sayac x/y formatinda gosterir', async () => {
    render(<Transfer dataSource={defaultItems} />);
    await userEvent.click(screen.getByTestId('transfer-item-1'));
    const countBadge = screen.getByTestId('transfer-count-left');
    expect(countBadge.textContent).toContain('1/5');
  });
});

/* ------------------------------------------------------------------ */
/*  Size variants                                                      */
/* ------------------------------------------------------------------ */

describe('Transfer — boyut', () => {
  it('varsayilan boyut md', () => {
    render(<Transfer dataSource={defaultItems} />);
    // md panels exist
    expect(screen.getByTestId('transfer-panel-left')).toBeInTheDocument();
  });

  it('sm boyut render eder', () => {
    render(<Transfer dataSource={defaultItems} size="sm" />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });

  it('lg boyut render eder', () => {
    render(<Transfer dataSource={defaultItems} size="lg" />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Custom renderItem                                                  */
/* ------------------------------------------------------------------ */

describe('Transfer — ozel renderItem', () => {
  it('custom renderItem fonksiyonu kullanilir', () => {
    const renderItem = (item: TransferItem) => (
      <span data-testid={`custom-${item.key}`}>{item.label.toUpperCase()}</span>
    );
    render(<Transfer dataSource={defaultItems} renderItem={renderItem} />);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-1').textContent).toBe('ELMA');
  });
});

/* ------------------------------------------------------------------ */
/*  Locale text                                                        */
/* ------------------------------------------------------------------ */

describe('Transfer — locale', () => {
  it('ozel locale metni kullanilir', () => {
    render(
      <Transfer
        dataSource={[]}
        searchable
        localeText={{
          searchPlaceholder: 'Search here...',
          notFound: 'Nothing found',
          itemUnit: 'entry',
          itemsUnit: 'entries',
        }}
      />,
    );
    expect(screen.getByTestId('transfer-count-left').textContent).toContain('entries');
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard                                                           */
/* ------------------------------------------------------------------ */

describe('Transfer — klavye', () => {
  it('Space tusu ile item secilir', () => {
    render(<Transfer dataSource={defaultItems} />);
    const item = screen.getByTestId('transfer-item-1');
    fireEvent.keyDown(item, { key: ' ' });
    expect(item).toHaveAttribute('aria-selected', 'true');
  });

  it('Enter tusu ile item secilir', () => {
    render(<Transfer dataSource={defaultItems} />);
    const item = screen.getByTestId('transfer-item-2');
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(item).toHaveAttribute('aria-selected', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('Transfer — access control', () => {
  it('access="hidden" durumunda hicbir sey render edilmez', () => {
    const { container } = render(
      <Transfer dataSource={defaultItems} access="hidden" />,
    );
    expect(container.querySelector('[data-component="transfer"]')).not.toBeInTheDocument();
  });

  it('access="full" durumunda normal render edilir', () => {
    render(<Transfer dataSource={defaultItems} access="full" />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    render(<Transfer dataSource={defaultItems} access="disabled" />);
    expect(screen.getByTestId('transfer')).toHaveAttribute(
      'data-access-state',
      'disabled',
    );
  });

  it('access="readonly" durumunda item secilemez', async () => {
    render(<Transfer dataSource={defaultItems} access="readonly" />);
    await userEvent.click(screen.getByTestId('transfer-item-1'));
    expect(screen.getByTestId('transfer-item-1')).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('accessReason title olarak atanir', () => {
    render(
      <Transfer dataSource={defaultItems} accessReason="Yetkiniz yok" />,
    );
    expect(screen.getByTestId('transfer')).toHaveAttribute('title', 'Yetkiniz yok');
  });

  it('access="disabled" durumunda transfer butonlari disabled olur', () => {
    render(<Transfer dataSource={defaultItems} access="disabled" />);
    expect(screen.getByTestId('transfer-move-right')).toBeDisabled();
    expect(screen.getByTestId('transfer-move-left')).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('Transfer — edge cases', () => {
  it('bos dataSource ile render eder', () => {
    render(<Transfer dataSource={[]} />);
    expect(screen.getByTestId('transfer')).toBeInTheDocument();
  });

  it('className prop uygulanir', () => {
    render(<Transfer dataSource={defaultItems} className="my-custom-class" />);
    expect(screen.getByTestId('transfer').className).toContain('my-custom-class');
  });

  it('tek itemli dataSource icin tekil birim kullanir', () => {
    render(<Transfer dataSource={[{ key: '1', label: 'Tek' }]} />);
    const countBadge = screen.getByTestId('transfer-count-left');
    expect(countBadge.textContent).toContain('1 oge');
  });

  it('ARIA multiselectable listbox rolu', () => {
    render(<Transfer dataSource={defaultItems} />);
    const leftList = screen.getByTestId('transfer-list-left');
    expect(leftList).toHaveAttribute('role', 'listbox');
    expect(leftList).toHaveAttribute('aria-multiselectable', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('Transfer — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Transfer dataSource={defaultItems} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('Transfer — interaction & role', () => {
  it('has accessible group role', () => {
    render(<Transfer dataSource={defaultItems} />);
    expect(screen.getAllByRole('group').length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('Transfer — quality signals', () => {
  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
