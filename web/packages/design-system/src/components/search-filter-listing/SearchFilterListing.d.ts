import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type SummaryStripItem } from "../../patterns/summary-strip";
export type ActiveFilter = {
    key: string;
    label: string;
    value: string;
    onRemove: () => void;
};
export type SortOption = {
    key: string;
    label: string;
};
export type SortState = {
    key: string;
    direction: "asc" | "desc";
};
export interface SearchFilterListingProps extends AccessControlledProps {
    /** Baslik ustundeki kategori/context etiketi */
    eyebrow?: React.ReactNode;
    /** Ana baslik (zorunlu) */
    title: React.ReactNode;
    /** Baslik altindaki aciklama metni */
    description?: React.ReactNode;
    /** Header sag tarafindaki meta bilgisi */
    meta?: React.ReactNode;
    /** Header sag tarafindaki durum badge'i */
    status?: React.ReactNode;
    /** Header aksiyonlari (butonlar vb.) */
    actions?: React.ReactNode;
    /** FilterBar icerigi */
    filters?: React.ReactNode;
    /** Filtre sifirlama handler'i */
    onReset?: () => void;
    /** Gorunum kaydetme handler'i */
    onSaveView?: () => void;
    /** FilterBar ek aksiyonlari */
    filterExtra?: React.ReactNode;
    /** Toolbar aksiyonlari — FilterBar'in sag tarafina eklenir (reload, density vb.) */
    toolbar?: React.ReactNode;
    /** Yeniden yukleme handler'i — verildiginde FilterBar'da reload ikonu gosterilir */
    onReload?: () => void;
    /** Uygulanmis filtre chip'leri */
    activeFilters?: ActiveFilter[];
    /** Tum filtreleri temizle handler'i */
    onClearAllFilters?: () => void;
    /** SummaryStrip KPI verileri */
    summaryItems?: SummaryStripItem[];
    /** Sonuc listesi basligi */
    listTitle?: React.ReactNode;
    /** Sonuc listesi aciklamasi */
    listDescription?: React.ReactNode;
    /** Sonuc ogeleri listesi */
    items?: React.ReactNode[];
    /** Bos durum mesaji */
    emptyStateLabel?: React.ReactNode;
    /** Tamamen ozel sonuc yuzeyi (items yerine kullanilir) */
    results?: React.ReactNode;
    /** Toplam sonuc sayisi — gosterildiginde "X sonuc" etiketi render edilir */
    totalCount?: number;
    /** Siralama secenekleri */
    sortOptions?: SortOption[];
    /** Aktif siralama durumu */
    activeSort?: SortState;
    /** Siralama degistiginde */
    onSortChange?: (key: string, direction: "asc" | "desc") => void;
    /** Secim modunu etkinlestir */
    selectable?: boolean;
    /** Secili oge key'leri */
    selectedKeys?: React.Key[];
    /** Secim degistiginde */
    onSelectionChange?: (keys: React.Key[]) => void;
    /** Toplu aksiyon butonlari — secim aktifken gosterilir */
    batchActions?: React.ReactNode;
    /** Ek CSS siniflari */
    className?: string;
    /** Section elementine erisilebilirlik etiketi */
    "aria-label"?: string;
    /** Section elementinin ARIA rolu */
    role?: string;
    /** Yukleniyor durumunda iskelet placeholder gosterir */
    loading?: boolean;
    /** Yogunluk modu: default veya compact */
    size?: "default" | "compact";
}
export declare const SearchFilterListing: React.ForwardRefExoticComponent<SearchFilterListingProps & React.RefAttributes<HTMLElement>>;
export default SearchFilterListing;
