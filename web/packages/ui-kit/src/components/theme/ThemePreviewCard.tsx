import React from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ThemePreviewCardProps {
  selected?: boolean;
  className?: string;
}

export const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({ selected = false, className }) => {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-1 rounded-xl border p-2 text-[10px] transition',
        'bg-[var(--surface-default-bg)]',
        selected
          ? 'border-[var(--accent-primary)] shadow-sm'
          : 'border-border-subtle hover:border-text-secondary',
        className,
      )}
    >
      {selected ? (
        <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[9px] font-bold text-text-inverse">
          ✓
        </div>
      ) : null}
      <div className="flex flex-col gap-1 rounded-lg border border-border-subtle bg-surface-panel px-2 py-2">
        <div className="h-2 w-10 rounded bg-[var(--surface-panel-bg)]" />
        <div className="mt-1 h-[6px] rounded-sm bg-transparent text-[9px] font-medium text-text-primary">
          Başlık metni
        </div>
        <div className="h-[6px] rounded-sm text-[9px] text-text-secondary">İkincil metin</div>
        <div className="mt-2 flex items-center justify-end">
          <div className="inline-flex items-center rounded-full bg-action-primary px-2 py-[2px] text-[9px] font-semibold text-action-primary-text">
            Kaydet
          </div>
        </div>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface-overlay-bg)]" />
    </div>
  );
};
