// @vitest-environment node
/**
 * Contract test — verifies public API surface of @mfe/design-system/form.
 *
 * This prevents accidental breaking changes by asserting all expected
 * exports are present. If a new export is added, add it here.
 */
import { describe, it, expect } from 'vitest';
import * as formModule from '../index';

describe('@mfe/design-system/form contract', () => {
  it('exports all expected hooks', () => {
    expect(formModule.useForm).toBeTypeOf('function');
    expect(formModule.useFormField).toBeTypeOf('function');
    expect(formModule.useFormContext).toBeTypeOf('function');
    expect(formModule.useFormLocale).toBeTypeOf('function');
  });

  it('exports all expected validation utilities', () => {
    expect(formModule.createSchemaValidator).toBeTypeOf('function');
    expect(formModule.createZodValidator).toBeTypeOf('function');
    expect(formModule.zodResolver).toBeTypeOf('function');
  });

  it('exports all expected components and adapters', () => {
    expect(formModule.ConnectedFormField).toBeDefined();
    expect(formModule.ConnectedInput).toBeDefined();
    expect(formModule.ConnectedSelect).toBeDefined();
    expect(formModule.ConnectedCheckbox).toBeDefined();
    expect(formModule.ConnectedTextarea).toBeDefined();
    expect(formModule.ConnectedRadio).toBeDefined();
    expect(formModule.createRHFAdapter).toBeTypeOf('function');
    expect(formModule.RHFFormProvider).toBeTypeOf('function');
    expect(formModule.FormContext).toBeDefined();
  });

  it('exports i18n utilities', () => {
    expect(formModule.defaultErrorMessages).toBeDefined();
    expect(formModule.getErrorMessages).toBeTypeOf('function');
    expect(formModule.errorMessagesTr).toBeDefined();
    expect(formModule.errorMessagesEn).toBeDefined();
  });
});
