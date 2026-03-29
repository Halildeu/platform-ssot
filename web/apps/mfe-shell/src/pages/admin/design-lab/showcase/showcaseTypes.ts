import React from 'react';

export type DemoSurfaceKind = 'live' | 'reference' | 'recipe';
export type DesignLabPreviewPanelId = DemoSurfaceKind;

export type ComponentShowcaseSection = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: string[];
  kind?: DemoSurfaceKind;
  content: React.ReactNode;
};

export type DesignLabTranslate = (key: string, params?: Record<string, unknown>) => string;

/**
 * Accepts any component whose props are a superset of the base preview-panel
 * contract.  `children` is typed loosely so that components compiled against
 * different `@types/react` major versions (18 vs 19) remain assignable —
 * React 19 adds `bigint` to `ReactNode`, which makes the two definitions
 * structurally incompatible under strict variance checks.
 */
 
export type PreviewPanelComponent = React.ComponentType<{
  title: string;
  children: any;  
  className?: string;
  kind?: DemoSurfaceKind;
}>;

/* ---- Types extracted from DesignLabShowcaseContent.tsx ---- */

import type {
  AIActionAuditTimelineItem,
  ApprovalCheckpointItem,
  CitationPanelItem,
  DescriptionsItem,
  ListItem,
  PromptComposerScope,
  PromptComposerTone,
  SummaryStripItem,
  ThemePresetGalleryItem,
  TreeNode,
  UploadFileItem,
} from '@mfe/design-system';
import type { LibraryPreviewPanel } from '../../../../../../../packages/design-system/src/catalog/design-lab-internals';

export type DesignLabLifecycle = 'stable' | 'beta' | 'planned';
export type DesignLabDemoMode = 'live' | 'inspector' | 'planned';

/** Typed shape of the showcase state bag (avoids `unknown` from Record<string, unknown>). */
export type ShowcaseState = {
  anchorValue: string;
  approvalCheckpointState: 'pending' | 'approved' | 'rejected';
  approvalCheckpointSteps: ApprovalCheckpointItem[];
  auditTimelineItems: AIActionAuditTimelineItem[];
  avatarPreviewImageSrc: string;
  checkboxValue: boolean;
  citationPanelItems: CitationPanelItem[];
  commandPaletteItems: Array<{ id: string; title: string; description?: string; shortcut?: string; group?: string }>;
  commandPaletteOpen: boolean;
  commandPaletteQuery: string;
  commentValue: string;
  contextMenuAction: string;
  dateValue: string;
  detailDrawerOpen: boolean;
  dropdownAction: string;
  entitySummaryItems: DescriptionsItem[];
  formDrawerOpen: boolean;
  gridRows: Record<string, unknown>[];
  inviteInputValue: string;
  jsonViewerValue: Record<string, unknown> & { policy?: unknown };
  lastCommandSelection: string;
  listItems: ListItem[];
  modalOpen: boolean;
  pageHeaderMeta: React.ReactNode;
  policyTableRows: Record<string, unknown>[];
  promptBody: string;
  promptScope: PromptComposerScope;
  promptSubject: string;
  promptTone: PromptComposerTone;
  radioValue: string;
  readonlyFormDrawerOpen: boolean;
  recommendationDecision: 'pending' | 'applied' | 'review';
  reportStatus: string;
  rolloutDescriptionItems: DescriptionsItem[];
  searchInputValue: string;
  selectedAuditId: string | null;
  selectedCitationId: string | null;
  selectValue: string;
  serverGridRows: Array<{ id: string; name: string; owner: string; theme: string; status: string; track: string }>;
  sliderValue: number;
  stepsStatusRichValue: string;
  stepsValue: string;
  summaryStripItems: SummaryStripItem[];
  switchValue: boolean;
  tabsValue: string;
  textAreaValue: string;
  textInputValue: string;
  timeValue: string;
  tourOpen: boolean;
  tourStatus: string;
  tourStep: number;
  treeNodes: TreeNode[];
  treeTableNodes: React.ComponentProps<typeof import('@mfe/design-system').TreeTable>['nodes'];
  uploadFiles: UploadFileItem[];
  setAnchorValue: (nextValue: string) => void;
  setApprovalCheckpointState: (nextValue: 'pending' | 'approved' | 'rejected') => void;
  setCheckboxValue: (nextValue: boolean) => void;
  setCommandPaletteOpen: (nextValue: boolean) => void;
  setCommandPaletteQuery: (nextValue: string) => void;
  setCommentValue: (nextValue: string) => void;
  setContextMenuAction: (nextValue: string) => void;
  setDateValue: (nextValue: string) => void;
  setDetailDrawerOpen: (nextValue: boolean) => void;
  setDropdownAction: (nextValue: string) => void;
  setFormDrawerOpen: (nextValue: boolean) => void;
  setInviteInputValue: (nextValue: string) => void;
  setLastCommandSelection: (nextValue: string | null) => void;
  setModalOpen: (nextValue: boolean) => void;
  setPromptBody: (nextValue: string) => void;
  setPromptScope: (nextValue: PromptComposerScope) => void;
  setPromptSubject: (nextValue: string) => void;
  setPromptTone: (nextValue: PromptComposerTone) => void;
  setRadioValue: (nextValue: string) => void;
  setReadonlyFormDrawerOpen: (nextValue: boolean) => void;
  setRecommendationDecision: (nextValue: 'pending' | 'applied' | 'review') => void;
  setReportStatus: (nextValue: string) => void;
  setSearchInputValue: (nextValue: string) => void;
  setSelectedAuditId: (nextValue: string | null) => void;
  setSelectedCitationId: (nextValue: string | null) => void;
  setSelectValue: (nextValue: string) => void;
  setSliderValue: (nextValue: number) => void;
  setStepsStatusRichValue: (nextValue: string) => void;
  setStepsValue: (nextValue: string) => void;
  setSwitchValue: (nextValue: boolean) => void;
  setTabsValue: (nextValue: string) => void;
  setTextAreaValue: (nextValue: string) => void;
  setTextInputValue: (nextValue: string) => void;
  setTimeValue: (nextValue: string) => void;
  setTourOpen: (nextValue: boolean) => void;
  setTourStatus: (nextValue: string) => void;
  setTourStep: (nextValue: number) => void;
  setUploadFiles: (nextValue: UploadFileItem[]) => void;
  themePresetSummary: { compareAxes?: React.ReactNode[] } | null;
  themePresetGalleryItems: ThemePresetGalleryItem[];
  defaultThemePreset: ThemePresetGalleryItem | null;
  contrastThemePreset: ThemePresetGalleryItem | null;
  compactThemePreset: ThemePresetGalleryItem | null;
  descriptionsLocaleText: Record<string, unknown>;
  approvalCheckpointStateLabels: Record<string, string>;
  [key: string]: unknown;
};

export type DesignLabIndexItem = {
  name: string;
  kind: 'component' | 'hook' | 'function' | 'const';
  importStatement: string;
  whereUsed: string[];
  group: string;
  subgroup: string;
  tags?: string[];
  availability: 'exported' | 'planned';
  lifecycle: DesignLabLifecycle;
  taxonomyGroupId: string;
  taxonomySubgroup: string;
  demoMode: DesignLabDemoMode;
  description: string;
  sectionIds: string[];
  qualityGates: string[];
  uxPrimaryThemeId?: string;
  uxPrimarySubthemeId?: string;
  roadmapWaveId?: string;
  acceptanceContractId?: string;
};

export type DesignLabShowcaseFamily = {
  recipeId: string;
  title?: string;
  clusterTitle?: string;
  clusterDescription?: string;
  intent: string;
  ownerBlocks: string[];
};

export type DesignLabIndex = {
  items: DesignLabIndexItem[];
  recipes?: {
    currentFamilies: DesignLabShowcaseFamily[];
  };
};

export type DesignLabShowcaseContentProps = {
  mode: 'components' | 'recipes' | 'pages' | 'foundations' | 'ecosystem';
  item: DesignLabIndexItem | null;
  family: DesignLabShowcaseFamily | null;
  designLabIndex: DesignLabIndex;
  activePreviewPanel: DesignLabPreviewPanelId;
  onPreviewPanelChange: (panelId: DesignLabPreviewPanelId) => void;
  statusLabel: Record<DesignLabLifecycle, string>;
  demoModeLabel: Record<DesignLabDemoMode, string>;
  trackMeta: Record<string, { label: string; note: string }>;
  resolveItemTrack: (item: DesignLabIndexItem) => string;
  toTestIdSuffix: (value: string) => string;
  onFocusComponentFromFamily: (item: DesignLabIndexItem) => void;
  showcaseState: Record<string, unknown>;
};

export type DesignLabRecipeComponentPreviewProps = {
  recipeId: string;
  showcaseState: Record<string, unknown>;
  layoutRecipeContext?: {
    avatarPreviewImageSrc: string;
    descriptionsLocaleText: Record<string, unknown>;
    dropdownAction: string;
    entitySummaryItems: DescriptionsItem[];
    pageHeaderMeta: React.ReactNode;
    rolloutDescriptionItems: DescriptionsItem[];
    searchInputValue: string;
    selectValue: string;
    summaryStripItems: SummaryStripItem[];
    setDropdownAction: (nextValue: string) => void;
    setSearchInputValue: (nextValue: string) => void;
    setSelectValue: (nextValue: string) => void;
  };
};

export type PreviewPanelProps = React.ComponentProps<typeof LibraryPreviewPanel> & {
  kind?: DemoSurfaceKind;
};

