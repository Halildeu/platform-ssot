import { test, expect } from 'vitest';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import AccessVariantToolbar from './AccessVariantToolbar.ui';

test('AccessVariantToolbar variant secim ve aksiyon davranisini surdurur', async () => {
  const selectedValues: Array<string | null> = [];
  let saveCount = 0;
  let saveAsCount = 0;
  let deleteCount = 0;

  const renderer = TestRenderer.create(
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

  let root = renderer.root;
  const select = root.findByType('select');
  expect(select.props.value).toBe('variant-1');
  expect(root.findByProps({ children: 'access.variants.saveChanges' })).toBeTruthy();
  expect(root.findByProps({ children: 'access.variants.unsavedChanges' })).toBeTruthy();

  await act(async () => {
    select.props.onChange({ target: { value: '' } });
  });

  expect(selectedValues).toEqual([null]);

  const saveButton = root.findByProps({ children: 'access.variants.saveChanges' });
  const saveAsButton = root.findByProps({ children: 'access.variants.saveAs' });
  const deleteButton = root.findByProps({ children: 'access.variants.delete' });

  await act(async () => {
    saveButton.props.onClick();
    saveAsButton.props.onClick();
    deleteButton.props.onClick();
  });

  expect(saveCount).toBe(1);
  expect(saveAsCount).toBe(1);
  expect(deleteCount).toBe(1);

  renderer.update(
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

  root = renderer.root;
  const disabledDeleteButton = root.findByProps({ children: 'access.variants.delete' });
  expect(disabledDeleteButton.props.disabled).toBe(true);
  expect(root.findByProps({ children: 'access.variants.save' })).toBeTruthy();
});
