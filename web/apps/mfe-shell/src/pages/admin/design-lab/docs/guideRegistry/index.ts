import type { ComponentGuide } from './types';

import { guides as guides1 } from './group01_button_to_toast';
import { guides as guides2 } from './group02_searchfilterlisting_to_radio';
import { guides as guides3 } from './group03_switch_to_iconbutton';
import { guides as guides4 } from './group04_popover_to_accordion';
import { guides as guides5 } from './group05_datepicker_to_treetable';
import { guides as guides6 } from './group06_descriptions_to_detaildrawer';
import { guides as guides7 } from './group07_formdrawer_to_timepicker';
import { guides as guides8 } from './group08_upload_to_emptyerrorloading';
import { guides as guides9 } from './group09_linkinline_to_actionheader';
import { guides as guides10 } from './group10_contextmenu_to_notificationitemcard';
import { guides as guides11 } from './group11_toastprovider_to_tree';
import { guides as guides12 } from './group12_approvalreview_to_promptcomposer';
import { guides as guides13 } from './group13_recommendationcard_to_crudtemplate';
import { guides as guides14 } from './group14_dashboardtemplate_to_themepreviewcard';
import { guides as guides15 } from './group15_aggridserver_to_reportfilterpanel';
import { guides as guides16 } from './group16_detailsectiontabs_to_actionbar';

export type { GuideSection, ComponentGuide } from './types';

const _guides: Record<string, ComponentGuide> = {
  ...guides1,
  ...guides2,
  ...guides3,
  ...guides4,
  ...guides5,
  ...guides6,
  ...guides7,
  ...guides8,
  ...guides9,
  ...guides10,
  ...guides11,
  ...guides12,
  ...guides13,
  ...guides14,
  ...guides15,
  ...guides16,
};

/* ---- Public API ---- */

export function getGuideForComponent(componentName: string): ComponentGuide | null {
  return _guides[componentName] ?? null;
}

export function hasGuide(componentName: string): boolean {
  return componentName in _guides;
}

export function getGuideSectionIds(guide: ComponentGuide): string[] {
  return guide.sections.map((s) => s.id);
}
