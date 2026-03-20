// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAccordion } from '../hooks/useAccordion';
import { useCombobox } from '../hooks/useCombobox';
import type { ComboboxItem } from '../hooks/useCombobox';
import { useDialog } from '../hooks/useDialog';
import { useMenu } from '../hooks/useMenu';
import type { MenuItem } from '../hooks/useMenu';
import { useSelect } from '../hooks/useSelect';
import type { SelectItem } from '../hooks/useSelect';
import { useSlider } from '../hooks/useSlider';
import { useTabs } from '../hooks/useTabs';
import type { TabItem } from '../hooks/useTabs';
import { useTooltip } from '../hooks/useTooltip';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simulate a React.KeyboardEvent with minimal shape */
function keyEvent(key: string, extra: Partial<KeyboardEvent> = {}): React.KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ctrlKey: false,
    metaKey: false,
    ...extra,
  } as unknown as React.KeyboardEvent;
}

/** Simulate a React.ChangeEvent<HTMLInputElement> */
function changeEvent(value: string): React.ChangeEvent<HTMLInputElement> {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>;
}

/* ================================================================== */
/*  useAccordion                                                       */
/* ================================================================== */

describe('useAccordion', () => {
  it('initializes with no expanded keys by default', () => {
    const { result } = renderHook(() => useAccordion());
    expect(result.current.expandedKeys).toEqual([]);
  });

  it('respects defaultExpandedKeys', () => {
    const { result } = renderHook(() =>
      useAccordion({ defaultExpandedKeys: ['a', 'b'] }),
    );
    expect(result.current.expandedKeys).toEqual(['a', 'b']);
  });

  it('toggle expands and collapses an item (single mode)', () => {
    const { result } = renderHook(() => useAccordion());
    act(() => result.current.toggle('item1'));
    expect(result.current.expandedKeys).toEqual(['item1']);
    act(() => result.current.toggle('item1'));
    expect(result.current.expandedKeys).toEqual([]);
  });

  it('single mode replaces previously expanded key', () => {
    const { result } = renderHook(() => useAccordion());
    act(() => result.current.expand('a'));
    act(() => result.current.expand('b'));
    expect(result.current.expandedKeys).toEqual(['b']);
  });

  it('multiple mode allows several items expanded', () => {
    const { result } = renderHook(() => useAccordion({ multiple: true }));
    act(() => result.current.expand('a'));
    act(() => result.current.expand('b'));
    expect(result.current.expandedKeys).toEqual(['a', 'b']);
  });

  it('collapse removes an item from expandedKeys', () => {
    const { result } = renderHook(() =>
      useAccordion({ multiple: true, defaultExpandedKeys: ['a', 'b'] }),
    );
    act(() => result.current.collapse('a'));
    expect(result.current.expandedKeys).toEqual(['b']);
  });

  it('collapseAll empties expandedKeys', () => {
    const { result } = renderHook(() =>
      useAccordion({ multiple: true, defaultExpandedKeys: ['a', 'b'] }),
    );
    act(() => result.current.collapseAll());
    expect(result.current.expandedKeys).toEqual([]);
  });

  it('calls onExpandedChange callback', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useAccordion({ onExpandedChange: onChange }),
    );
    act(() => result.current.toggle('x'));
    expect(onChange).toHaveBeenCalledWith(['x']);
  });

  it('getItemState returns correct isExpanded and ARIA props', () => {
    const { result } = renderHook(() =>
      useAccordion({ defaultExpandedKeys: ['open'] }),
    );
    const openState = result.current.getItemState('open');
    const closedState = result.current.getItemState('closed');

    expect(openState.isExpanded).toBe(true);
    expect(closedState.isExpanded).toBe(false);

    const triggerProps = openState.getTriggerProps(0);
    expect(triggerProps.role).toBe('button');
    expect(triggerProps['aria-expanded']).toBe(true);
    expect(triggerProps.tabIndex).toBe(0);
    expect(triggerProps['aria-controls']).toContain('panel');

    const panelProps = openState.getPanelProps();
    expect(panelProps.role).toBe('region');
    expect(panelProps.hidden).toBe(false);
    expect(panelProps['aria-labelledby']).toContain('trigger');

    const closedPanel = closedState.getPanelProps();
    expect(closedPanel.hidden).toBe(true);
  });

  it('trigger onKeyDown Enter/Space toggles item', () => {
    const { result } = renderHook(() => useAccordion());
    const trigger = result.current.getItemState('k').getTriggerProps(0);

    act(() => trigger.onKeyDown(keyEvent('Enter')));
    expect(result.current.expandedKeys).toContain('k');

    const trigger2 = result.current.getItemState('k').getTriggerProps(0);
    act(() => trigger2.onKeyDown(keyEvent(' ')));
    expect(result.current.expandedKeys).not.toContain('k');
  });

  it('expand is no-op if already expanded', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useAccordion({ defaultExpandedKeys: ['a'], onExpandedChange: onChange }),
    );
    act(() => result.current.expand('a'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  useCombobox                                                        */
/* ================================================================== */

describe('useCombobox', () => {
  const items: ComboboxItem[] = [
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Cherry' },
    { id: '4', label: 'Date', disabled: true },
  ];

  it('initializes closed with no selection', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.inputValue).toBe('');
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it('open/close controls isOpen state', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('selectItem updates selection and input value', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    act(() => result.current.selectItem(items[1]));
    expect(result.current.selectedItem).toEqual(items[1]);
    expect(result.current.inputValue).toBe('Banana');
    expect(result.current.isOpen).toBe(false);
  });

  it('filters items based on input value', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    act(() => result.current.setInputValue('an'));
    expect(result.current.filteredItems).toEqual([
      items[1], // Banana
    ]);
  });

  it('reset clears selection and input', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    act(() => result.current.selectItem(items[0]));
    act(() => result.current.reset());
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.inputValue).toBe('');
    expect(result.current.isOpen).toBe(false);
  });

  it('getInputProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    const inputProps = result.current.getInputProps();
    expect(inputProps.role).toBe('combobox');
    expect(inputProps['aria-expanded']).toBe(false);
    expect(inputProps['aria-autocomplete']).toBe('list');
    expect(inputProps['aria-haspopup']).toBe('listbox');
    expect(inputProps.autoComplete).toBe('off');
    expect(inputProps['aria-activedescendant']).toBeUndefined();
  });

  it('getListboxProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    const listboxProps = result.current.getListboxProps();
    expect(listboxProps.role).toBe('listbox');
    expect(listboxProps['aria-labelledby']).toBeTruthy();
  });

  it('getOptionProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    act(() => result.current.selectItem(items[0]));
    const selectedOption = result.current.getOptionProps(items[0], 0);
    expect(selectedOption.role).toBe('option');
    expect(selectedOption['aria-selected']).toBe(true);

    const unselectedOption = result.current.getOptionProps(items[1], 1);
    expect(unselectedOption['aria-selected']).toBe(false);

    const disabledOption = result.current.getOptionProps(items[3], 3);
    expect(disabledOption['aria-disabled']).toBe(true);
  });

  it('shows all items when input is empty', () => {
    const { result } = renderHook(() => useCombobox({ items }));
    expect(result.current.filteredItems).toHaveLength(4);
  });

  it('respects defaultSelectedItem', () => {
    const { result } = renderHook(() =>
      useCombobox({ items, defaultSelectedItem: items[2] }),
    );
    expect(result.current.selectedItem).toEqual(items[2]);
    expect(result.current.inputValue).toBe('Cherry');
  });
});

/* ================================================================== */
/*  useDialog                                                          */
/* ================================================================== */

describe('useDialog', () => {
  it('initializes closed by default', () => {
    const { result } = renderHook(() => useDialog());
    expect(result.current.isOpen).toBe(false);
  });

  it('respects defaultOpen', () => {
    const { result } = renderHook(() => useDialog({ defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it('open/close/toggle control state', () => {
    const { result } = renderHook(() => useDialog());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('calls onOpenChange and onClose callbacks', () => {
    const onOpenChange = vi.fn();
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useDialog({ onOpenChange, onClose }),
    );
    act(() => result.current.open());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    act(() => result.current.close());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalled();
  });

  it('getTriggerProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useDialog());
    const triggerProps = result.current.getTriggerProps();
    expect(triggerProps['aria-haspopup']).toBe('dialog');
    expect(triggerProps['aria-expanded']).toBe(false);

    act(() => result.current.open());
    const triggerPropsOpen = result.current.getTriggerProps();
    expect(triggerPropsOpen['aria-expanded']).toBe(true);
  });

  it('getContentProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() =>
      useDialog({ 'aria-label': 'Test dialog', modal: true }),
    );
    const contentProps = result.current.getContentProps();
    expect(contentProps.role).toBe('dialog');
    expect(contentProps['aria-modal']).toBe(true);
    expect(contentProps['aria-label']).toBe('Test dialog');
    expect(contentProps.tabIndex).toBe(-1);
  });

  it('getContentProps Escape key closes dialog when closeOnEscape is true', () => {
    const { result } = renderHook(() => useDialog());
    act(() => result.current.open());
    const contentProps = result.current.getContentProps();
    act(() => contentProps.onKeyDown(keyEvent('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('getContentProps Escape key does NOT close when closeOnEscape is false', () => {
    const { result } = renderHook(() => useDialog({ closeOnEscape: false }));
    act(() => result.current.open());
    const contentProps = result.current.getContentProps();
    act(() => contentProps.onKeyDown(keyEvent('Escape')));
    expect(result.current.isOpen).toBe(true);
  });

  it('non-modal dialog has aria-modal undefined', () => {
    const { result } = renderHook(() => useDialog({ modal: false }));
    const contentProps = result.current.getContentProps();
    expect(contentProps['aria-modal']).toBeUndefined();
  });

  it('getTitleProps and getDescriptionProps return stable IDs', () => {
    const { result } = renderHook(() => useDialog());
    const titleProps = result.current.getTitleProps();
    const descProps = result.current.getDescriptionProps();
    expect(titleProps.id).toBeTruthy();
    expect(descProps.id).toBeTruthy();
    expect(titleProps.id).not.toBe(descProps.id);
  });

  it('trigger onClick toggles dialog', () => {
    const { result } = renderHook(() => useDialog());
    act(() => result.current.getTriggerProps().onClick());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.getTriggerProps().onClick());
    expect(result.current.isOpen).toBe(false);
  });
});

/* ================================================================== */
/*  useMenu                                                            */
/* ================================================================== */

describe('useMenu', () => {
  const items: MenuItem[] = [
    { id: 'cut', label: 'Cut' },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'disabled', label: 'Disabled', disabled: true },
    { id: 'submenu', label: 'More', hasSubmenu: true },
  ];

  it('initializes closed with highlightedIndex -1', () => {
    const { result } = renderHook(() => useMenu({ items }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it('open sets highlightedIndex to 0', () => {
    const { result } = renderHook(() => useMenu({ items }));
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.highlightedIndex).toBe(0);
  });

  it('close resets highlightedIndex to -1', () => {
    const { result } = renderHook(() => useMenu({ items }));
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it('toggle switches open state', () => {
    const { result } = renderHook(() => useMenu({ items }));
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('getTriggerProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useMenu({ items }));
    const triggerProps = result.current.getTriggerProps();
    expect(triggerProps['aria-haspopup']).toBe('menu');
    expect(triggerProps['aria-expanded']).toBe(false);
    expect(triggerProps['aria-controls']).toBeTruthy();
  });

  it('getMenuProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() =>
      useMenu({ items, orientation: 'horizontal' }),
    );
    const menuProps = result.current.getMenuProps();
    expect(menuProps.role).toBe('menu');
    expect(menuProps['aria-orientation']).toBe('horizontal');
    expect(menuProps.tabIndex).toBe(-1);
    expect(menuProps['aria-labelledby']).toBeTruthy();
  });

  it('getItemProps returns correct ARIA for normal, disabled, and submenu items', () => {
    const { result } = renderHook(() => useMenu({ items }));
    const normalItem = result.current.getItemProps(items[0], 0);
    expect(normalItem.role).toBe('menuitem');
    expect(normalItem['aria-disabled']).toBeUndefined();
    expect(normalItem['aria-haspopup']).toBeUndefined();

    const disabledItem = result.current.getItemProps(items[3], 3);
    expect(disabledItem['aria-disabled']).toBe(true);

    const submenuItem = result.current.getItemProps(items[4], 4);
    expect(submenuItem['aria-haspopup']).toBe('menu');
  });

  it('onAction is called when item is activated via Enter', () => {
    const onAction = vi.fn();
    const { result } = renderHook(() => useMenu({ items, onAction }));
    act(() => result.current.open());
    const menuProps = result.current.getMenuProps();
    act(() => menuProps.onKeyDown(keyEvent('Enter')));
    expect(onAction).toHaveBeenCalledWith('cut');
  });

  it('Escape key closes menu', () => {
    const { result } = renderHook(() => useMenu({ items }));
    act(() => result.current.open());
    const menuProps = result.current.getMenuProps();
    act(() => menuProps.onKeyDown(keyEvent('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('empty items does not crash', () => {
    const { result } = renderHook(() => useMenu({ items: [] }));
    act(() => result.current.open());
    expect(result.current.highlightedIndex).toBe(0);
  });
});

/* ================================================================== */
/*  useSelect                                                          */
/* ================================================================== */

describe('useSelect', () => {
  const items: SelectItem[] = [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
    { id: 'c', label: 'Charlie' },
    { id: 'd', label: 'Delta', disabled: true },
  ];

  it('initializes closed with no selection', () => {
    const { result } = renderHook(() => useSelect({ items }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedItem).toBeNull();
    expect(result.current.highlightedIndex).toBe(-1);
  });

  it('open sets highlightedIndex to 0 when nothing selected', () => {
    const { result } = renderHook(() => useSelect({ items }));
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    expect(result.current.highlightedIndex).toBe(0);
  });

  it('open highlights selected item when one exists', () => {
    const { result } = renderHook(() =>
      useSelect({ items, defaultSelectedItem: items[2] }),
    );
    act(() => result.current.open());
    expect(result.current.highlightedIndex).toBe(2);
  });

  it('selectItem updates selection and closes', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useSelect({ items, onSelectedItemChange: onChange }),
    );
    act(() => result.current.open());
    act(() => result.current.selectItem(items[1]));
    expect(result.current.selectedItem).toEqual(items[1]);
    expect(result.current.isOpen).toBe(false);
    expect(onChange).toHaveBeenCalledWith(items[1]);
  });

  it('getTriggerProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useSelect({ items }));
    const trigger = result.current.getTriggerProps();
    expect(trigger.role).toBe('combobox');
    expect(trigger['aria-haspopup']).toBe('listbox');
    expect(trigger['aria-expanded']).toBe(false);
    expect(trigger.tabIndex).toBe(0);
    expect(trigger['aria-activedescendant']).toBeUndefined();
  });

  it('getListboxProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useSelect({ items }));
    const listbox = result.current.getListboxProps();
    expect(listbox.role).toBe('listbox');
    expect(listbox.tabIndex).toBe(-1);
    expect(listbox['aria-labelledby']).toBeTruthy();
  });

  it('getOptionProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() =>
      useSelect({ items, defaultSelectedItem: items[0] }),
    );
    const selected = result.current.getOptionProps(items[0], 0);
    expect(selected.role).toBe('option');
    expect(selected['aria-selected']).toBe(true);

    const unselected = result.current.getOptionProps(items[1], 1);
    expect(unselected['aria-selected']).toBe(false);

    const disabled = result.current.getOptionProps(items[3], 3);
    expect(disabled['aria-disabled']).toBe(true);
  });

  it('Escape key closes the select', () => {
    const { result } = renderHook(() => useSelect({ items }));
    act(() => result.current.open());
    const trigger = result.current.getTriggerProps();
    act(() => trigger.onKeyDown(keyEvent('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('ArrowDown on closed trigger opens select', () => {
    const { result } = renderHook(() => useSelect({ items }));
    const trigger = result.current.getTriggerProps();
    act(() => trigger.onKeyDown(keyEvent('ArrowDown')));
    expect(result.current.isOpen).toBe(true);
  });
});

/* ================================================================== */
/*  useSlider                                                          */
/* ================================================================== */

describe('useSlider', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSlider());
    expect(result.current.value).toBe(0);
    expect(result.current.percentage).toBe(0);
    expect(result.current.isRange).toBe(false);
  });

  it('respects defaultValue', () => {
    const { result } = renderHook(() => useSlider({ defaultValue: 50 }));
    expect(result.current.value).toBe(50);
    expect(result.current.percentage).toBe(50);
  });

  it('setValue clamps to min/max', () => {
    const { result } = renderHook(() =>
      useSlider({ min: 0, max: 100 }),
    );
    act(() => result.current.setValue(150));
    expect(result.current.value).toBe(100);
    act(() => result.current.setValue(-10));
    expect(result.current.value).toBe(0);
  });

  it('increment and decrement by step', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultValue: 50, step: 5 }),
    );
    act(() => result.current.increment());
    expect(result.current.value).toBe(55);
    act(() => result.current.decrement());
    expect(result.current.value).toBe(50);
  });

  it('increment does nothing when disabled', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultValue: 50, disabled: true }),
    );
    act(() => result.current.increment());
    expect(result.current.value).toBe(50);
  });

  it('getTrackProps returns correct attributes', () => {
    const { result } = renderHook(() =>
      useSlider({ orientation: 'vertical', disabled: true }),
    );
    const track = result.current.getTrackProps();
    expect(track.role).toBe('none');
    expect(track['data-orientation']).toBe('vertical');
    expect(track['data-disabled']).toBe('');
  });

  it('getThumbProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() =>
      useSlider({
        min: 0,
        max: 200,
        defaultValue: 100,
        'aria-label': 'Volume',
      }),
    );
    const thumb = result.current.getThumbProps();
    expect(thumb.role).toBe('slider');
    expect(thumb['aria-valuemin']).toBe(0);
    expect(thumb['aria-valuemax']).toBe(200);
    expect(thumb['aria-valuenow']).toBe(100);
    expect(thumb['aria-label']).toBe('Volume');
    expect(thumb['aria-orientation']).toBe('horizontal');
    expect(thumb.tabIndex).toBe(0);
  });

  it('disabled thumb has tabIndex -1', () => {
    const { result } = renderHook(() => useSlider({ disabled: true }));
    expect(result.current.getThumbProps().tabIndex).toBe(-1);
  });

  it('range mode works with defaultRangeValue', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultRangeValue: [20, 80] }),
    );
    expect(result.current.isRange).toBe(true);
    expect(result.current.rangeValues).toEqual([20, 80]);
    expect(result.current.rangePercentages).toEqual([20, 80]);
  });

  it('range mode increment/decrement per thumb', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultRangeValue: [20, 80], step: 5 }),
    );
    act(() => result.current.increment(0));
    expect(result.current.rangeValues[0]).toBe(25);
    act(() => result.current.decrement(1));
    expect(result.current.rangeValues[1]).toBe(75);
  });

  it('getValueText formatter is used in aria-valuetext', () => {
    const { result } = renderHook(() =>
      useSlider({
        defaultValue: 50,
        getValueText: (v) => `${v}%`,
      }),
    );
    const thumb = result.current.getThumbProps();
    expect(thumb['aria-valuetext']).toBe('50%');
  });

  it('thumb keyboard ArrowRight increments (horizontal)', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultValue: 50, step: 1 }),
    );
    const thumb = result.current.getThumbProps();
    act(() => thumb.onKeyDown(keyEvent('ArrowRight')));
    expect(result.current.value).toBe(51);
  });

  it('thumb keyboard Home sets to min', () => {
    const { result } = renderHook(() =>
      useSlider({ defaultValue: 50, min: 10, max: 90 }),
    );
    const thumb = result.current.getThumbProps();
    act(() => thumb.onKeyDown(keyEvent('Home')));
    expect(result.current.value).toBe(10);
  });
});

/* ================================================================== */
/*  useTabs                                                            */
/* ================================================================== */

describe('useTabs', () => {
  const tabs: TabItem[] = [
    { id: 'tab1' },
    { id: 'tab2' },
    { id: 'tab3' },
    { id: 'tab4', disabled: true },
  ];

  it('initializes with first non-disabled tab selected', () => {
    const { result } = renderHook(() => useTabs({ tabs }));
    expect(result.current.selectedId).toBe('tab1');
  });

  it('respects defaultSelectedId', () => {
    const { result } = renderHook(() =>
      useTabs({ tabs, defaultSelectedId: 'tab2' }),
    );
    expect(result.current.selectedId).toBe('tab2');
  });

  it('select changes selected tab', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useTabs({ tabs, onSelectedChange: onChange }),
    );
    act(() => result.current.select('tab3'));
    expect(result.current.selectedId).toBe('tab3');
    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  it('select ignores disabled tabs', () => {
    const { result } = renderHook(() => useTabs({ tabs }));
    act(() => result.current.select('tab4'));
    expect(result.current.selectedId).toBe('tab1');
  });

  it('getTabListProps returns correct ARIA', () => {
    const { result } = renderHook(() =>
      useTabs({ tabs, orientation: 'vertical' }),
    );
    const tabListProps = result.current.getTabListProps();
    expect(tabListProps.role).toBe('tablist');
    expect(tabListProps['aria-orientation']).toBe('vertical');
  });

  it('getTabProps returns correct ARIA for selected/unselected tabs', () => {
    const { result } = renderHook(() =>
      useTabs({ tabs, defaultSelectedId: 'tab1' }),
    );
    const selected = result.current.getTabProps(tabs[0], 0);
    expect(selected.role).toBe('tab');
    expect(selected['aria-selected']).toBe(true);
    expect(selected.tabIndex).toBe(0);
    expect(selected['aria-controls']).toContain('panel');

    const unselected = result.current.getTabProps(tabs[1], 1);
    expect(unselected['aria-selected']).toBe(false);
    expect(unselected.tabIndex).toBe(-1);

    const disabled = result.current.getTabProps(tabs[3], 3);
    expect(disabled['aria-disabled']).toBe(true);
  });

  it('getPanelProps returns correct ARIA and hidden state', () => {
    const { result } = renderHook(() =>
      useTabs({ tabs, defaultSelectedId: 'tab1' }),
    );
    const activePanel = result.current.getPanelProps(tabs[0]);
    expect(activePanel.role).toBe('tabpanel');
    expect(activePanel.hidden).toBe(false);
    expect(activePanel.tabIndex).toBe(0);
    expect(activePanel['aria-labelledby']).toContain('tab-tab1');

    const hiddenPanel = result.current.getPanelProps(tabs[1]);
    expect(hiddenPanel.hidden).toBe(true);
  });

  it('tab panel id matches tab aria-controls', () => {
    const { result } = renderHook(() => useTabs({ tabs }));
    const tabProps = result.current.getTabProps(tabs[0], 0);
    const panelProps = result.current.getPanelProps(tabs[0]);
    expect(tabProps['aria-controls']).toBe(panelProps.id);
  });

  it('empty tabs list does not crash', () => {
    const { result } = renderHook(() => useTabs({ tabs: [] }));
    expect(result.current.selectedId).toBe('');
  });
});

/* ================================================================== */
/*  useTooltip                                                         */
/* ================================================================== */

describe('useTooltip', () => {
  it('initializes closed by default', () => {
    const { result } = renderHook(() => useTooltip());
    expect(result.current.isOpen).toBe(false);
  });

  it('respects defaultOpen', () => {
    const { result } = renderHook(() => useTooltip({ defaultOpen: true }));
    expect(result.current.isOpen).toBe(true);
  });

  it('show/hide control state immediately', () => {
    const { result } = renderHook(() => useTooltip());
    act(() => result.current.show());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.hide());
    expect(result.current.isOpen).toBe(false);
  });

  it('calls onOpenChange callback', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useTooltip({ onOpenChange: onChange }));
    act(() => result.current.show());
    expect(onChange).toHaveBeenCalledWith(true);
    act(() => result.current.hide());
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('getTriggerProps returns correct attributes', () => {
    const { result } = renderHook(() => useTooltip());
    const triggerClosed = result.current.getTriggerProps();
    expect(triggerClosed['aria-describedby']).toBeUndefined();

    act(() => result.current.show());
    const triggerOpen = result.current.getTriggerProps();
    expect(triggerOpen['aria-describedby']).toBeTruthy();
  });

  it('getTooltipProps returns correct ARIA attributes', () => {
    const { result } = renderHook(() => useTooltip());
    const propsHidden = result.current.getTooltipProps();
    expect(propsHidden.role).toBe('tooltip');
    expect(propsHidden['aria-hidden']).toBe(true);

    act(() => result.current.show());
    const propsVisible = result.current.getTooltipProps();
    expect(propsVisible['aria-hidden']).toBe(false);
    expect(propsVisible.id).toBeTruthy();
  });

  it('Escape key hides tooltip via trigger onKeyDown', () => {
    const { result } = renderHook(() => useTooltip());
    act(() => result.current.show());
    expect(result.current.isOpen).toBe(true);
    const trigger = result.current.getTriggerProps();
    act(() => trigger.onKeyDown(keyEvent('Escape')));
    expect(result.current.isOpen).toBe(false);
  });

  it('Escape key is no-op when already closed', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useTooltip({ onOpenChange: onChange }));
    const trigger = result.current.getTriggerProps();
    act(() => trigger.onKeyDown(keyEvent('Escape')));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('tooltip id links trigger aria-describedby to tooltip', () => {
    const { result } = renderHook(() => useTooltip());
    act(() => result.current.show());
    const triggerId = result.current.getTriggerProps()['aria-describedby'];
    const tooltipId = result.current.getTooltipProps().id;
    expect(triggerId).toBe(tooltipId);
  });
});
