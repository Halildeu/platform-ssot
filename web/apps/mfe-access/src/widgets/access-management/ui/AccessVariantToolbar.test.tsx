// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AccessVariantToolbar from './AccessVariantToolbar.ui';

test('AccessVariantToolbar variant secim ve aksiyon davranisini surdurur', async () => {
  const selectedValues: Array<string | null> = [];
  let saveCount = 0;
  let saveAsCount = 0;
  let deleteCount = 0;

  const { rerender } = render(
    <AccessVariantToolbar
      selectedVariantId="variant-1"
      variantOptions={[
        { value: 'variant-1', label: 'Variant 1' },
        { value: 'variant-2', label: 'Variant 2' },
      ]}
      isDirty
      onSelectVariant={(value) => selectedValues.push(value)}
      onSaveVariant={() => { saveCount += 1; }}
      onSaveAsVariant={() => { saveAsCount += 1; }}
      onDeleteVariant={() => { deleteCount += 1; }}
      t={(key) => key}
    />,
  );

  const select = screen.getByRole('combobox') as HTMLSelectElement;
  expect(select.value).toBe('variant-1');
  expect(screen.getByText('access.variants.saveChanges')).toBeTruthy();
  expect(screen.getByText('access.variants.unsavedChanges')).toBeTruthy();

  await act(async () => {
    fireEvent.change(select, { target: { value: '' } });
  });

  expect(selectedValues).toEqual([null]);

  const saveButton = screen.getByText('access.variants.saveChanges');
  const saveAsButton = screen.getByText('access.variants.saveAs');
  const deleteButton = screen.getByText('access.variants.delete');

  await act(async () => {
    fireEvent.click(saveButton);
    fireEvent.click(saveAsButton);
    fireEvent.click(deleteButton);
  });

  expect(saveCount).toBe(1);
  expect(saveAsCount).toBe(1);
  expect(deleteCount).toBe(1);

  rerender(
    <AccessVariantToolbar
      selectedVariantId={null}
      variantOptions={[
        { value: 'variant-1', label: 'Variant 1' },
        { value: 'variant-2', label: 'Variant 2' },
      ]}
      isDirty={false}
      onSelectVariant={(value) => selectedValues.push(value)}
      onSaveVariant={() => { saveCount += 1; }}
      onSaveAsVariant={() => { saveAsCount += 1; }}
      onDeleteVariant={() => { deleteCount += 1; }}
      t={(key) => key}
    />,
  );

  const disabledDeleteButton = screen.getByText('access.variants.delete');
  expect((disabledDeleteButton as HTMLButtonElement).disabled).toBe(true);
  expect(screen.getByText('access.variants.save')).toBeTruthy();
});
