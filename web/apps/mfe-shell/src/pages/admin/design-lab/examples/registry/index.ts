import type { ExampleEntry, ExampleCategory } from './types';

import { examples as examples1 } from './group01_button_to_toast';
import { examples as examples2 } from './group02_searchfilterlisting_to_tag';
import { examples as examples3 } from './group03_radio_to_skeleton';
import { examples as examples4 } from './group04_spinner_to_combobox';
import { examples as examples5 } from './group05_commandpalette_to_summarystrip';
import { examples as examples6 } from './group06_detaildrawer_to_upload';
import { examples as examples7 } from './group07_segmented_to_actionheader';
import { examples as examples8 } from './group08_contextmenu_to_anchortoc';
import { examples as examples9 } from './group09_tree_to_sectiontabs';
import { examples as examples10 } from './group10_actionbar_to_citationpanel';
import { examples as examples11 } from './group11_commandheader_to_themepresetcompare';
import { examples as examples12 } from './group12_themepresetgallery_to_tabs';

export type { ExampleEntry, ExampleCategory } from './types';
export { EXAMPLE_CATEGORY_META } from './types';

const _registry: Record<string, ExampleEntry[]> = {
  ...examples1,
  ...examples2,
  ...examples3,
  ...examples4,
  ...examples5,
  ...examples6,
  ...examples7,
  ...examples8,
  ...examples9,
  ...examples10,
  ...examples11,
  ...examples12,
};

/* ---- Public API ---- */

export function getExamplesForComponent(componentName: string): ExampleEntry[] {
  return _registry[componentName] ?? [];
}

export function getExampleCategories(examples: ExampleEntry[]): ExampleCategory[] {
  const cats = new Set(examples.map((e) => e.category));
  const order: ExampleCategory[] = ["basic", "form", "layout", "advanced", "patterns"];
  return order.filter((c) => cats.has(c));
}

export function hasExamples(componentName: string): boolean {
  return (componentName in _registry) && _registry[componentName].length > 0;
}
