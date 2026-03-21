import React, { useCallback, useState } from 'react';
import type { FormSection as FormSectionType } from './types';

/* ------------------------------------------------------------------ */
/*  FormSection — Collapsible form section with title & description    */
/* ------------------------------------------------------------------ */

export interface FormSectionProps {
  section: FormSectionType;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export const FormSectionComponent: React.FC<FormSectionProps> = ({
  section,
  children,
  defaultCollapsed,
  className,
}) => {
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed ?? section.defaultCollapsed ?? false,
  );

  const isCollapsible = section.collapsible ?? false;

  const toggleCollapsed = useCallback(() => {
    if (isCollapsible) setCollapsed((prev) => !prev);
  }, [isCollapsible]);

  return (
    <fieldset
      className={`rounded-lg border border-ds-border bg-ds-surface ${className ?? ''}`}
    >
      {/* Section header */}
      <legend className="sr-only">{section.title}</legend>
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isCollapsible ? 'cursor-pointer select-none' : ''
        } ${collapsed ? '' : 'border-b border-ds-border'}`}
        role={isCollapsible ? 'button' : undefined}
        tabIndex={isCollapsible ? 0 : undefined}
        aria-expanded={isCollapsible ? !collapsed : undefined}
        aria-controls={isCollapsible ? `section-${section.id}-content` : undefined}
        onClick={toggleCollapsed}
        onKeyDown={(e) => {
          if (isCollapsible && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            toggleCollapsed();
          }
        }}
      >
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-ds-text-primary">{section.title}</h3>
          {section.description && (
            <p className="text-xs text-ds-text-secondary">{section.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Field count indicator */}
          <span className="inline-flex items-center rounded-full bg-ds-surface-secondary px-2 py-0.5 text-xs font-medium text-ds-text-secondary">
            {section.fields.length} {section.fields.length === 1 ? 'field' : 'fields'}
          </span>

          {/* Collapse toggle icon */}
          {isCollapsible && (
            <svg
              className={`h-4 w-4 text-ds-text-secondary transition-transform duration-200 ${
                collapsed ? '' : 'rotate-180'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Section content */}
      {!collapsed && (
        <div
          id={`section-${section.id}-content`}
          className="px-4 py-4"
        >
          {children}
        </div>
      )}
    </fieldset>
  );
};
