import React, { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  CompanyPicker — Active company selector (X-Company-Id header)     */
/*                                                                     */
/*  Backend `requiresSingleCompany: true` schemas (e.g. muavin v3)    */
/*  fail-closed without an X-Company-Id header. This dropdown writes  */
/*  the active company id to localStorage[reporting:currentCompanyId] */
/*  and triggers a page reload so dynamic-report/api.ts picks up the  */
/*  new value on its next fetch.                                       */
/*                                                                     */
/*  V1 (MVP): hardcoded 1–43 (live MSSQL evidence: workcube_mikrolink */
/*  has 43 company-only schemas).                                      */
/*  V2 (followup): dynamic list from `/api/v1/users/me/companies`     */
/*  once that endpoint stabilises (currently 500).                    */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'reporting:currentCompanyId';

const COMPANY_IDS: number[] = Array.from({ length: 43 }, (_, i) => i + 1);

const readSelected = (): string => {
  if (typeof window === 'undefined' || !window.localStorage) return '';
  return window.localStorage.getItem(STORAGE_KEY) ?? '';
};

const writeSelected = (value: string): void => {
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(
      new CustomEvent('reporting:company-changed', { detail: { companyId: value } }),
    );
  } catch {
    /* storage unavailable */
  }
};

export interface CompanyPickerProps {
  /** Optional caption shown above the select. */
  label?: string;
  /** Compact mode (smaller width). */
  compact?: boolean;
}

export const CompanyPicker: React.FC<CompanyPickerProps> = ({ label, compact }) => {
  const [selected, setSelected] = useState<string>(readSelected);

  useEffect(() => {
    const handler = () => setSelected(readSelected());
    window.addEventListener('reporting:company-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('reporting:company-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    setSelected(next);
    writeSelected(next);
    // Force the dynamic-report module to refetch with the new header.
    // V2: switch to event-bus + AG Grid api.refreshServerSide().
    if (next) {
      // Brief delay so localStorage write commits before navigation.
      window.setTimeout(() => window.location.reload(), 80);
    }
  };

  const widthClass = compact ? 'min-w-[140px]' : 'min-w-[200px]';

  return (
    <label className={`flex flex-col gap-1 text-xs font-medium text-text-secondary ${widthClass}`}>
      <span>{label || 'Şirket'}</span>
      <select
        data-testid="reporting-company-picker"
        className="w-full rounded-md border border-border-subtle bg-surface-default px-3 py-2 text-sm text-text-primary focus:outline-hidden focus:ring-2 focus:ring-selection-outline focus:ring-offset-1"
        value={selected}
        onChange={onChange}
      >
        <option value="">— Şirket seçin —</option>
        {COMPANY_IDS.map((id) => (
          <option key={id} value={String(id)}>
            Şirket #{id}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CompanyPicker;
