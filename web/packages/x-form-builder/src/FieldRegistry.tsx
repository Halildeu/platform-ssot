import React from 'react';
import type { FieldType } from './types';
import type { FieldRendererProps } from './FieldRenderer';
import {
  TextFieldRenderer,
  NumberFieldRenderer,
  SelectFieldRenderer,
  MultiselectFieldRenderer,
  CheckboxFieldRenderer,
  RadioFieldRenderer,
  SwitchFieldRenderer,
  TextareaFieldRenderer,
  DateFieldRenderer,
  TimeFieldRenderer,
  FileFieldRenderer,
  CustomFieldRenderer,
} from './FieldRenderer';

/* ------------------------------------------------------------------ */
/*  FieldRegistry — Extensible field-type to component mapping         */
/* ------------------------------------------------------------------ */

export type FieldRegistry = Record<FieldType, React.ComponentType<FieldRendererProps & Record<string, unknown>>>;

const defaultRegistry: FieldRegistry = {
  text: TextFieldRenderer,
  email: TextFieldRenderer,
  password: TextFieldRenderer,
  number: NumberFieldRenderer,
  select: SelectFieldRenderer,
  multiselect: MultiselectFieldRenderer,
  checkbox: CheckboxFieldRenderer,
  radio: RadioFieldRenderer,
  switch: SwitchFieldRenderer,
  textarea: TextareaFieldRenderer,
  date: DateFieldRenderer,
  time: TimeFieldRenderer,
  file: FileFieldRenderer,
  custom: CustomFieldRenderer,
};

/**
 * Create a field registry by merging overrides onto the defaults.
 * Allows consumers to register custom field types or replace built-in
 * renderers without touching the library internals.
 */
export function createFieldRegistry(
  overrides?: Partial<Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>>>,
): FieldRegistry & Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>> {
  return { ...defaultRegistry, ...overrides } as FieldRegistry &
    Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>>;
}

/**
 * Context that allows subtrees to use a custom registry.
 * Defaults to the built-in set so consumers can use FormRenderer
 * without wrapping in a provider.
 */
export const FieldRegistryContext = React.createContext<
  FieldRegistry & Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>>
>(defaultRegistry as FieldRegistry & Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>>);

FieldRegistryContext.displayName = 'FieldRegistryContext';

export interface FieldRegistryProviderProps {
  registry: FieldRegistry & Record<string, React.ComponentType<FieldRendererProps & Record<string, unknown>>>;
  children: React.ReactNode;
}

export const FieldRegistryProvider: React.FC<FieldRegistryProviderProps> = ({
  registry,
  children,
}) => {
  return (
    <FieldRegistryContext.Provider value={registry}>
      {children}
    </FieldRegistryContext.Provider>
  );
};
