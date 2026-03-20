import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

test('AccessVariantToolbar variant secim ve aksiyon davranisini surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: AccessVariantToolbar } = await import('./AccessVariantToolbar.ui');

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
      onSaveVariant={() => {
        saveCount += 1;
      }}
      onSaveAsVariant={() => {
        saveAsCount += 1;
      }}
      onDeleteVariant={() => {
        deleteCount += 1;
      }}
      t={(key) => key}
    />,
  );

  let root = renderer.root;
  const select = root.findByType('select');
  assert.equal(select.props.value, 'variant-1');
  assert.ok(root.findByProps({ children: 'access.variants.saveChanges' }));
  assert.ok(root.findByProps({ children: 'access.variants.unsavedChanges' }));

  await act(async () => {
    select.props.onChange({ target: { value: '' } });
  });

  assert.deepEqual(selectedValues, [null]);

  const saveButton = root.findByProps({ children: 'access.variants.saveChanges' });
  const saveAsButton = root.findByProps({ children: 'access.variants.saveAs' });
  const deleteButton = root.findByProps({ children: 'access.variants.delete' });

  await act(async () => {
    saveButton.props.onClick();
    saveAsButton.props.onClick();
    deleteButton.props.onClick();
  });

  assert.equal(saveCount, 1);
  assert.equal(saveAsCount, 1);
  assert.equal(deleteCount, 1);

  renderer.update(
    <AccessVariantToolbar
      selectedVariantId={null}
      variantOptions={[
        { value: 'variant-1', label: 'Variant 1' },
        { value: 'variant-2', label: 'Variant 2' },
      ]}
      isDirty={false}
      onSelectVariant={(value) => selectedValues.push(value)}
      onSaveVariant={() => {
        saveCount += 1;
      }}
      onSaveAsVariant={() => {
        saveAsCount += 1;
      }}
      onDeleteVariant={() => {
        deleteCount += 1;
      }}
      t={(key) => key}
    />,
  );

  root = renderer.root;
  const disabledDeleteButton = root.findByProps({ children: 'access.variants.delete' });
  assert.equal(disabledDeleteButton.props.disabled, true);
  assert.ok(root.findByProps({ children: 'access.variants.save' }));
});
