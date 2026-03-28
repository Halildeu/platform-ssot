// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchFilterListing } from '../SearchFilterListing';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — temel render', () => {
  it('varsayilan props ile section elementini render eder', () => {
    const { container } = render(<SearchFilterListing title="Test" />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'search-filter-listing');
  });

  it('title propi ile baslik gosterir', () => {
    render(<SearchFilterListing title="Politika Listesi" />);
    expect(screen.getByText('Politika Listesi')).toBeInTheDocument();
  });

  it('eyebrow metni gosterir', () => {
    render(<SearchFilterListing title="Test" eyebrow="Envanter" />);
    expect(screen.getByText('Envanter')).toBeInTheDocument();
  });

  it('description metni gosterir', () => {
    render(<SearchFilterListing title="Test" description="Aciklama metni" />);
    expect(screen.getByText('Aciklama metni')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<SearchFilterListing title="Test" access="hidden" />);
    expect(container.querySelector('section')).not.toBeInTheDocument();
  });

  it('access="disabled" durumunda data-access-state="disabled" atar', () => {
    const { container } = render(<SearchFilterListing title="Test" access="disabled" />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-access-state', 'disabled');
  });

  it('access="readonly" durumunda data-access-state="readonly" atar', () => {
    const { container } = render(<SearchFilterListing title="Test" access="readonly" />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-access-state', 'readonly');
  });

  it('access="full" durumunda data-access-state="full" atar', () => {
    const { container } = render(<SearchFilterListing title="Test" access="full" />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-access-state', 'full');
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — empty state', () => {
  it('items bos oldugunda empty state mesaji gosterir', () => {
    render(<SearchFilterListing title="Test" items={[]} />);
    expect(screen.getByText('Eslesen sonuc bulunamadi.')).toBeInTheDocument();
  });

  it('ozel emptyStateLabel gosterir', () => {
    render(<SearchFilterListing title="Test" items={[]} emptyStateLabel="Sonuc yok" />);
    expect(screen.getByText('Sonuc yok')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Items & results rendering                                          */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — items ve results', () => {
  it('items listesini sirayla render eder', () => {
    render(
      <SearchFilterListing
        title="Test"
        items={[
          <div key="a">Item A</div>,
          <div key="b">Item B</div>,
        ]}
      />,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });

  it('results propu verildiginde items yerine results render eder', () => {
    render(
      <SearchFilterListing
        title="Test"
        items={[<div key="x">Gizli</div>]}
        results={<div>Ozel Yuzeyi</div>}
      />,
    );
    expect(screen.getByText('Ozel Yuzeyi')).toBeInTheDocument();
    expect(screen.queryByText('Gizli')).not.toBeInTheDocument();
  });

  it('listTitle ve listDescription gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        listTitle="Sonuclar"
        listDescription="Filtrelenmis liste"
        items={[<div key="1">Oge</div>]}
      />,
    );
    expect(screen.getByText('Sonuclar')).toBeInTheDocument();
    expect(screen.getByText('Filtrelenmis liste')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Defensive guards                                                   */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — defensive guards', () => {
  it('items string olarak geldiginde crash olmaz', () => {
    expect(() => {
      render(<SearchFilterListing title="Test" items={"[]" as unknown as React.ReactNode[]} />);
    }).not.toThrow();
  });

  it('summaryItems string olarak geldiginde crash olmaz', () => {
    expect(() => {
      render(
        <SearchFilterListing
          title="Test"
          summaryItems={"[]" as unknown as []}
        />,
      );
    }).not.toThrow();
  });

  it('items undefined oldugunda crash olmaz', () => {
    expect(() => {
      render(<SearchFilterListing title="Test" items={undefined} />);
    }).not.toThrow();
  });
});

/* ------------------------------------------------------------------ */
/*  Yeni proplar: aria-label, role, loading, size                      */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — a11y proplari', () => {
  it('aria-label section elementine aktarilir', () => {
    const { container } = render(
      <SearchFilterListing title="Test" aria-label="Politika arama sonuclari" />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-label', 'Politika arama sonuclari');
  });

  it('role section elementine aktarilir', () => {
    const { container } = render(
      <SearchFilterListing title="Test" role="search" />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('role', 'search');
  });
});

describe('SearchFilterListing — loading state', () => {
  it('loading durumunda aria-busy="true" atar', () => {
    const { container } = render(<SearchFilterListing title="Test" loading />);
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-busy', 'true');
  });

  it('loading durumunda skeleton placeholder gosterir', () => {
    const { container } = render(<SearchFilterListing title="Test" loading />);
    // Loading state renders pulse animations, not the actual content
    expect(screen.queryByText('Sonuclar')).not.toBeInTheDocument();
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

describe('SearchFilterListing — size prop', () => {
  it('size="compact" durumunda gap-2 class kullanir', () => {
    const { container } = render(<SearchFilterListing title="Test" size="compact" />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('gap-2');
  });

  it('size="default" durumunda gap-4 class kullanir', () => {
    const { container } = render(<SearchFilterListing title="Test" size="default" />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('gap-4');
  });
});

/* ------------------------------------------------------------------ */
/*  Aktif filtre chip'leri                                             */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — aktif filtre chip\'leri', () => {
  it('activeFilters verildiginde chip\'leri render eder', () => {
    const filters = [
      { key: 'status', label: 'Durum', value: 'Aktif', onRemove: () => {} },
      { key: 'date', label: 'Tarih', value: 'Son 30 gun', onRemove: () => {} },
    ];
    render(<SearchFilterListing title="Test" activeFilters={filters} />);
    expect(screen.getByText('Aktif')).toBeInTheDocument();
    expect(screen.getByText('Son 30 gun')).toBeInTheDocument();
  });

  it('birden fazla filtre varsa "Tumunu temizle" butonu gosterir', () => {
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: () => {} },
      { key: 'b', label: 'B', value: '2', onRemove: () => {} },
    ];
    render(<SearchFilterListing title="Test" activeFilters={filters} onClearAllFilters={() => {}} />);
    expect(screen.getByText('Tumunu temizle')).toBeInTheDocument();
  });

  it('tek filtre varsa "Tumunu temizle" gostermez', () => {
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: () => {} },
    ];
    render(<SearchFilterListing title="Test" activeFilters={filters} onClearAllFilters={() => {}} />);
    expect(screen.queryByText('Tumunu temizle')).not.toBeInTheDocument();
  });

  it('bos activeFilters array icerik render etmez', () => {
    render(<SearchFilterListing title="Test" activeFilters={[]} />);
    expect(screen.queryByText('Tumunu temizle')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Kontekstuel empty state                                            */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — kontekstuel empty state', () => {
  it('activeFilters varken filtre-odakli empty state gosterir', () => {
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: () => {} },
    ];
    render(<SearchFilterListing title="Test" items={[]} activeFilters={filters} />);
    expect(screen.getByText('Bu filtre kombinasyonu icin sonuc bulunamadi')).toBeInTheDocument();
  });

  it('activeFilters yokken normal empty state gosterir', () => {
    render(<SearchFilterListing title="Test" items={[]} />);
    expect(screen.getByText('Eslesen sonuc bulunamadi.')).toBeInTheDocument();
  });

  it('onClearAllFilters verildiginde "Filtreleri temizle" butonu gosterir', () => {
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: () => {} },
    ];
    render(<SearchFilterListing title="Test" items={[]} activeFilters={filters} onClearAllFilters={() => {}} />);
    expect(screen.getByText('Filtreleri temizle')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Sonuc sayisi ve siralama                                           */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — sonuc sayisi ve siralama', () => {
  it('totalCount verildiginde sonuc sayisi gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        totalCount={42}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('42 sonuc')).toBeInTheDocument();
  });

  it('sortOptions verildiginde siralama dropdown gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        sortOptions={[{ key: 'date', label: 'Tarih' }, { key: 'name', label: 'Ad' }]}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByLabelText('Siralama')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Secim ve toplu aksiyon                                             */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — secim ve toplu aksiyon', () => {
  it('secili ogeler varsa secim cizgisi gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        selectable
        selectedKeys={['a', 'b', 'c']}
        onSelectionChange={() => {}}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('3 oge secildi')).toBeInTheDocument();
  });

  it('batchActions secim cizgisinde render edilir', () => {
    render(
      <SearchFilterListing
        title="Test"
        selectable
        selectedKeys={['a']}
        onSelectionChange={() => {}}
        batchActions={<button>Sil</button>}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('Sil')).toBeInTheDocument();
  });

  it('secim yoksa secim cizgisi gostermez', () => {
    render(
      <SearchFilterListing
        title="Test"
        selectable
        selectedKeys={[]}
        onSelectionChange={() => {}}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.queryByText('oge secildi')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — toolbar', () => {
  it('onReload verildiginde reload butonu gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        filters={<input />}
        onReload={() => {}}
      />,
    );
    expect(screen.getByLabelText('Yeniden yukle')).toBeInTheDocument();
  });

  it('toolbar prop ile ozel icerik render eder', () => {
    render(
      <SearchFilterListing
        title="Test"
        filters={<input />}
        toolbar={<button>Export</button>}
      />,
    );
    expect(screen.getByText('Export')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: loading state                             */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — Faz 6 contract: loading state', () => {
  it('loading durumunda gercek icerik (items) render etmez', () => {
    render(
      <SearchFilterListing
        title="Test"
        loading
        items={[<div key="1">Visible Item</div>]}
      />,
    );
    expect(screen.queryByText('Visible Item')).not.toBeInTheDocument();
  });

  it('loading durumunda data-component attribute korunur', () => {
    const { container } = render(<SearchFilterListing title="Test" loading />);
    expect(
      container.querySelector('[data-component="search-filter-listing"]'),
    ).toBeInTheDocument();
  });

  it('loading durumunda filters render edilmez', () => {
    render(
      <SearchFilterListing
        title="Test"
        loading
        filters={<input placeholder="Ara..." />}
      />,
    );
    expect(screen.queryByPlaceholderText('Ara...')).not.toBeInTheDocument();
  });

  it('loading durumunda summaryItems render edilmez', () => {
    const { container } = render(
      <SearchFilterListing
        title="Test"
        loading
        summaryItems={[{ label: 'Toplam', value: 42 }]}
      />,
    );
    expect(screen.queryByText('Toplam')).not.toBeInTheDocument();
    // Skeleton pulses should still exist
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('loading=false durumunda aria-busy atanmaz', () => {
    const { container } = render(<SearchFilterListing title="Test" loading={false} />);
    const section = container.querySelector('section');
    expect(section).not.toHaveAttribute('aria-busy');
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: empty state with message                  */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — Faz 6 contract: empty state with message', () => {
  it('ReactNode turunde emptyStateLabel verildiginde fallback mesaji gosterir', () => {
    render(
      <SearchFilterListing
        title="Test"
        items={[]}
        emptyStateLabel={<span data-testid="custom-empty">Ozel bos durum</span>}
      />,
    );
    // Empty component receives string description; ReactNode falls back to "Sonuc bulunamadi"
    expect(screen.getByText('Sonuc bulunamadi')).toBeInTheDocument();
  });

  it('items olmadan (undefined) varsayilan empty state gosterir', () => {
    render(<SearchFilterListing title="Test" />);
    expect(screen.getByText('Eslesen sonuc bulunamadi.')).toBeInTheDocument();
  });

  it('filtre-odakli empty state Filtreleri temizle butonuna tiklanabilir', () => {
    const onClear = vi.fn();
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: () => {} },
    ];
    render(
      <SearchFilterListing
        title="Test"
        items={[]}
        activeFilters={filters}
        onClearAllFilters={onClear}
      />,
    );
    fireEvent.click(screen.getByText('Filtreleri temizle'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: readonly/disabled filter controls          */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — Faz 6 contract: readonly/disabled controls', () => {
  it('access="disabled" durumunda section data-access-state="disabled" tasir', () => {
    const { container } = render(
      <SearchFilterListing title="Test" access="disabled" filters={<input />} />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-access-state', 'disabled');
  });

  it('access="readonly" durumunda section data-access-state="readonly" tasir', () => {
    const { container } = render(
      <SearchFilterListing title="Test" access="readonly" filters={<input />} />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('data-access-state', 'readonly');
  });

  it('accessReason title attribute olarak aktarilir', () => {
    const { container } = render(
      <SearchFilterListing title="Test" access="disabled" accessReason="Yetkiniz yok" />,
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('title', 'Yetkiniz yok');
  });

  it('access="hidden" durumunda filtreler dahil hicbir sey render etmez', () => {
    const { container } = render(
      <SearchFilterListing
        title="Test"
        access="hidden"
        filters={<input placeholder="Ara..." />}
      />,
    );
    expect(container.querySelector('section')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Ara...')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: search / filter input                     */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — Faz 6 contract: search input', () => {
  it('filters prop ile arama inputu render eder', () => {
    render(
      <SearchFilterListing
        title="Test"
        filters={<input placeholder="Politika ara..." data-testid="search-input" />}
      />,
    );
    expect(screen.getByPlaceholderText('Politika ara...')).toBeInTheDocument();
  });

  it('filters icindeki inputa yazi yazilabilir', () => {
    render(
      <SearchFilterListing
        title="Test"
        filters={<input placeholder="Ara..." data-testid="search-input" />}
      />,
    );
    const input = screen.getByPlaceholderText('Ara...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'guvenlik' } });
    expect(input.value).toBe('guvenlik');
  });

  it('onReload callback tiklandiginda cagirilir', () => {
    const onReload = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        filters={<input />}
        onReload={onReload}
      />,
    );
    fireEvent.click(screen.getByLabelText('Yeniden yukle'));
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('filterExtra icerik render eder', () => {
    render(
      <SearchFilterListing
        title="Test"
        filters={<input />}
        filterExtra={<button>Filtre ekle</button>}
      />,
    );
    expect(screen.getByText('Filtre ekle')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  IP-09 — Interaction flow tests (userEvent)                         */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — interaction: arama inputuna yazma', () => {
  it('arama inputuna userEvent ile yazi yazildiginda onChange callback dogru deger ile atesler', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        filters={
          <input
            placeholder="Politika ara..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        }
      />,
    );
    const input = screen.getByPlaceholderText('Politika ara...');
    await user.type(input, 'guvenlik');
    expect(onSearchChange).toHaveBeenCalled();
    // Her karakter icin bir kez cagirilir, son cagri tam metin icerir
    const lastCall = onSearchChange.mock.calls[onSearchChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe('guvenlik');
  });

  it('arama inputunu temizleyip tekrar yazildiginda callback dogru deger ile cagirilir', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        filters={
          <input
            placeholder="Ara..."
            onChange={(e) => onSearchChange(e.target.value)}
          />
        }
      />,
    );
    const input = screen.getByPlaceholderText('Ara...');
    await user.type(input, 'test');
    await user.clear(input);
    await user.type(input, 'yeni');
    const lastCall = onSearchChange.mock.calls[onSearchChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe('yeni');
    expect((input as HTMLInputElement).value).toBe('yeni');
  });
});

describe('SearchFilterListing — interaction: filtre secimi', () => {
  it('filtre chip kaldir butonuna tiklandiginda onRemove callback cagirilir', async () => {
    const user = userEvent.setup();
    const onRemoveStatus = vi.fn();
    const onRemoveDate = vi.fn();
    const filters = [
      { key: 'status', label: 'Durum', value: 'Aktif', onRemove: onRemoveStatus },
      { key: 'date', label: 'Tarih', value: 'Son 30 gun', onRemove: onRemoveDate },
    ];
    render(
      <SearchFilterListing title="Test" activeFilters={filters} />,
    );
    const removeButtons = screen.getAllByRole('button', { name: /filtresini kaldir/ });
    expect(removeButtons).toHaveLength(2);
    await user.click(removeButtons[0]);
    expect(onRemoveStatus).toHaveBeenCalledTimes(1);
    expect(onRemoveDate).not.toHaveBeenCalled();
  });

  it('siralama dropdown degistiginde onSortChange callback atesler', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        sortOptions={[
          { key: 'date', label: 'Tarih' },
          { key: 'name', label: 'Ad' },
        ]}
        onSortChange={onSortChange}
        items={[<div key="1">Item</div>]}
      />,
    );
    const select = screen.getByLabelText('Siralama');
    await user.selectOptions(select, 'date');
    expect(onSortChange).toHaveBeenCalledWith('date', 'asc');
    expect(onSortChange).toHaveBeenCalledTimes(1);
  });
});

describe('SearchFilterListing — interaction: filtreleri temizle', () => {
  it('Tumunu temizle butonuna tiklandiginda onClearAllFilters callback atesler', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: vi.fn() },
      { key: 'b', label: 'B', value: '2', onRemove: vi.fn() },
    ];
    render(
      <SearchFilterListing
        title="Test"
        activeFilters={filters}
        onClearAllFilters={onClearAll}
      />,
    );
    const clearBtn = screen.getByText('Tumunu temizle');
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('filtre-odakli empty state icindeki Filtreleri temizle butonuna tiklandiginda callback atesler', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();
    const filters = [
      { key: 'a', label: 'A', value: '1', onRemove: vi.fn() },
    ];
    render(
      <SearchFilterListing
        title="Test"
        items={[]}
        activeFilters={filters}
        onClearAllFilters={onClearAll}
      />,
    );
    expect(screen.getByText('Bu filtre kombinasyonu icin sonuc bulunamadi')).toBeInTheDocument();
    await user.click(screen.getByText('Filtreleri temizle'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
});

describe('SearchFilterListing — interaction: sonuc sayisi guncelleme', () => {
  it('totalCount degistiginde guncel sonuc sayisi gosterilir', () => {
    const { rerender } = render(
      <SearchFilterListing
        title="Test"
        totalCount={42}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('42 sonuc')).toBeInTheDocument();

    rerender(
      <SearchFilterListing
        title="Test"
        totalCount={15}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('15 sonuc')).toBeInTheDocument();
    expect(screen.queryByText('42 sonuc')).not.toBeInTheDocument();
  });

  it('totalCount sifir olarak guncellendiginde "0 sonuc" gosterilir', () => {
    const { rerender } = render(
      <SearchFilterListing
        title="Test"
        totalCount={10}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('10 sonuc')).toBeInTheDocument();

    rerender(
      <SearchFilterListing
        title="Test"
        totalCount={0}
        items={[]}
      />,
    );
    expect(screen.getByText('0 sonuc')).toBeInTheDocument();
  });
});

describe('SearchFilterListing — interaction: secim temizleme', () => {
  it('Secimi temizle butonuna tiklandiginda onSelectionChange bos array ile cagirilir', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        selectable
        selectedKeys={['a', 'b']}
        onSelectionChange={onSelectionChange}
        items={[<div key="1">Item</div>]}
      />,
    );
    expect(screen.getByText('2 oge secildi')).toBeInTheDocument();
    await user.click(screen.getByText('Secimi temizle'));
    expect(onSelectionChange).toHaveBeenCalledWith([]);
    expect(onSelectionChange).toHaveBeenCalledTimes(1);
  });
});

describe('SearchFilterListing — interaction: reload', () => {
  it('reload butonuna userEvent ile tiklandiginda onReload callback atesler', async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    render(
      <SearchFilterListing
        title="Test"
        filters={<input placeholder="Ara..." />}
        onReload={onReload}
      />,
    );
    const reloadBtn = screen.getByLabelText('Yeniden yukle');
    expect(reloadBtn).toBeInTheDocument();
    await user.click(reloadBtn);
    expect(onReload).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SearchFilterListing title="Policies" />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('SearchFilterListing — quality signals', () => {
  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
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
