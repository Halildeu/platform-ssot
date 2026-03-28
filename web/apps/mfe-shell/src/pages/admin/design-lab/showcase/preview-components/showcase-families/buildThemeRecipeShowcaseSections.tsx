import React from 'react';
import {
  ApprovalReview,
  ThemePresetCompare,
  ThemePresetGallery,
} from '@mfe/design-system';
import type {
  AIActionAuditTimelineItem,
  ApprovalCheckpointItem,
  CitationPanelItem,
} from '@mfe/design-system';
import type {
  ComponentShowcaseSection,
  DesignLabTranslate,
  PreviewPanelComponent,
} from '../../showcaseTypes';

type ApprovalCheckpointState = 'pending' | 'approved' | 'rejected';

type ThemeRecipeShowcaseContext = {
  PreviewPanel: PreviewPanelComponent;
  t: DesignLabTranslate;
  approvalCheckpointState: ApprovalCheckpointState;
  approvalCheckpointStateLabels: Record<ApprovalCheckpointState, string>;
  approvalCheckpointSteps: ApprovalCheckpointItem[];
  auditTimelineItems: AIActionAuditTimelineItem[];
  citationPanelItems: CitationPanelItem[];
  compactThemePreset: React.ComponentProps<typeof ThemePresetCompare>['rightPreset'] | null;
  contrastThemePreset: React.ComponentProps<typeof ThemePresetCompare>['rightPreset'] | null;
  defaultThemePreset: React.ComponentProps<typeof ThemePresetCompare>['leftPreset'] | null;
  renderRecipeComponentPreview: (recipeId: string) => React.ReactNode;
  selectedAuditId: string | null;
  selectedCitationId: string | null;
  setApprovalCheckpointState: (nextValue: ApprovalCheckpointState) => void;
  setSelectedAuditId: (nextValue: string | null) => void;
  setSelectedCitationId: (nextValue: string | null) => void;
  themePresetGalleryItems: React.ComponentProps<typeof ThemePresetGallery>['presets'];
  themePresetSummary: {
    compareAxes?: React.ComponentProps<typeof ThemePresetGallery>['compareAxes'];
  } | null;
};

export const buildThemeRecipeShowcaseSections = (
  componentName: string,
  context: ThemeRecipeShowcaseContext,
): ComponentShowcaseSection[] | null => {
  const {
    PreviewPanel,
    t,
    approvalCheckpointState,
    approvalCheckpointStateLabels,
    approvalCheckpointSteps,
    auditTimelineItems,
    citationPanelItems,
    compactThemePreset,
    contrastThemePreset,
    defaultThemePreset,
    renderRecipeComponentPreview,
    selectedAuditId,
    selectedCitationId,
    setApprovalCheckpointState,
    setSelectedAuditId,
    setSelectedCitationId,
    themePresetGalleryItems,
    themePresetSummary,
  } = context;

  switch (componentName) {
    case 'ThemePresetGallery':
      return [
        {
          id: 'theme-preset-gallery-catalog',
          eyebrow: 'Recipe 01',
          title: 'Theme preset gallery',
          description: 'Resmi preset ailesi docs ve runtime ile ayni semantic kimliklerle ayni galeriden okunur.',
          badges: ['wave-10', 'theme-presets', 'gallery'],
          content: (
            <ThemePresetGallery
              presets={themePresetGalleryItems}
              compareAxes={themePresetSummary?.compareAxes ?? []}
            />
          ),
        },
        {
          id: 'theme-preset-gallery-compare',
          eyebrow: 'Recipe 02',
          title: 'Preset compare handoff',
          description: 'Gallery secimi ile compare matrisi ayni preset dili uzerinden okunur.',
          badges: ['compare', 'contrast', 'density'],
          content: (
            <ThemePresetCompare
              leftPreset={defaultThemePreset}
              rightPreset={contrastThemePreset ?? compactThemePreset}
            />
          ),
        },
      ];
    case 'ThemePresetCompare':
      return [
        {
          id: 'theme-preset-compare-default',
          eyebrow: 'Recipe 01',
          title: 'Theme preset compare',
          description: 'Appearance, density, contrast ve intent farklari ayni compare matrisiyle okunur.',
          badges: ['wave-10', 'theme-presets', 'compare'],
          content: (
            <ThemePresetCompare
              leftPreset={defaultThemePreset}
              rightPreset={contrastThemePreset ?? compactThemePreset}
            />
          ),
        },
      ];
    case 'ApprovalReview':
      return [
        {
          id: 'approval-review-default',
          eyebrow: t('designlab.showcase.recipe.approvalReview.eyebrow'),
          title: t('designlab.showcase.recipe.approvalReview.title'),
          description: t('designlab.showcase.recipe.approvalReview.description'),
          badges: ['wave-11', 'recipes', 'approval'],
          content: renderRecipeComponentPreview('approval_review'),
        },
        {
          id: 'approval-review-governance-board',
          eyebrow: 'Recipe 02',
          title: 'Governance board review',
          description: 'Approval, citation ve audit izini tek review recipe icinde daha karar odakli toplar.',
          badges: ['governance', 'review-board', 'evidence'],
          content: (
            <ApprovalReview
              title="Governance board"
              description="Human checkpoint, kaynak kaniti ve audit izleri tek approval board uzerinde bulusur."
              checkpoint={{
                title: 'SEO/GEO readiness gate',
                summary: 'Metadata, summary ve breadcrumb evidence tek karar kapisinda birlesir.',
                status: approvalCheckpointState,
                steps: approvalCheckpointSteps,
                evidenceItems: ['seo-meta', 'summary-strip', 'breadcrumbs'],
                citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
                onPrimaryAction: () => setApprovalCheckpointState('approved'),
                onSecondaryAction: () => setApprovalCheckpointState('rejected'),
                footerNote: `Durum: ${approvalCheckpointStateLabels[approvalCheckpointState]}`,
              }}
              citations={citationPanelItems}
              auditItems={auditTimelineItems}
              selectedCitationId={selectedCitationId}
              defaultSelectedAuditId="audit-review"
              onCitationSelect={(id) => setSelectedCitationId(id)}
              onAuditSelect={(id) => setSelectedAuditId(id)}
            />
          ),
        },
        {
          id: 'approval-review-readonly-audit',
          eyebrow: 'Recipe 03',
          title: 'Readonly audit review',
          description: 'Aksiyonlari kapatip kanit ve audit akisini daha sakin bir review shell olarak sunar.',
          badges: ['readonly', 'audit', 'review'],
          content: (
            <ApprovalReview
              title="Readonly review surface"
              description="Review karari alinmis, yalnizca okunabilir audit ve citation gorunumu."
              access="readonly"
              checkpoint={{
                title: 'Approved rollout pack',
                summary: 'Surface final approval aldi; kalan is evidence ve audit izini gostermek.',
                status: 'approved',
                steps: approvalCheckpointSteps,
                evidenceItems: ['module-delivery', 'doctor:frontend', 'visual-regression'],
                citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
              }}
              citations={citationPanelItems}
              auditItems={auditTimelineItems}
              defaultSelectedCitationId="policy-4-2"
              defaultSelectedAuditId="audit-review"
            />
          ),
        },
        {
          id: 'approval-review-release-war-room',
          eyebrow: 'Recipe 04',
          title: 'Release war-room review',
          description: 'Go/no-go karari, evidence kaynaklari ve audit izleri daha operasyonel bir war-room review shell ile sunulur.',
          badges: ['release', 'go-no-go', 'war-room'],
          content: (
            <ApprovalReview
              title="Release war-room"
              description="Go/no-go checkpoint, kritik kanitlar ve audit izleri tek karar panosunda toplanir."
              checkpoint={{
                title: 'Wave 12 go/no-go',
                summary: 'Smoke, SEO/GEO evidence ve rollout readiness ayni gate altinda degerlendirilir.',
                status: approvalCheckpointState,
                steps: approvalCheckpointSteps,
                evidenceItems: ['playwright-green', 'seo-geo-ready', 'shell-build-pass', 'module-delivery-pass'],
                citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
                onPrimaryAction: () => setApprovalCheckpointState('approved'),
                onSecondaryAction: () => setApprovalCheckpointState('rejected'),
                footerNote: 'Karar: release owner + governance ortak checkpointi',
              }}
              citations={citationPanelItems}
              auditItems={auditTimelineItems}
              selectedCitationId={selectedCitationId}
              selectedAuditId={selectedAuditId}
              onCitationSelect={(id) => setSelectedCitationId(id)}
              onAuditSelect={(id) => setSelectedAuditId(id)}
            />
          ),
        },
        {
          id: 'approval-review-evidence-handoff',
          eyebrow: 'Recipe 05',
          title: 'Evidence handoff review',
          description: 'Approval shell daha sakin bir handoff modunda calisir; vurgu karar yerine citation ve audit aktarimina kayar.',
          badges: ['handoff', 'evidence', 'readonly'],
          content: (
            <ApprovalReview
              title="Evidence handoff"
              description="Karar alinmis bir yuzey icin kalan is, evidence paketini ve audit kaydini temiz sekilde aktarmaktir."
              checkpoint={{
                title: 'Approved handoff pack',
                summary: 'Decision tamam; focus artik citation bundle ve audit continuity.',
                status: 'approved',
                steps: approvalCheckpointSteps,
                evidenceItems: ['citation-bundle', 'audit-trail', 'support-summary'],
                citations: citationPanelItems.map((item) => String(item.locator ?? '—')),
              }}
              citations={citationPanelItems}
              auditItems={auditTimelineItems}
              defaultSelectedCitationId={selectedCitationId ?? 'policy-4-2'}
              defaultSelectedAuditId={selectedAuditId ?? 'audit-review'}
            />
          ),
        },
      ];
    case 'EmptyErrorLoading':
      return [
        {
          id: 'empty-error-loading-default',
          eyebrow: 'Recipe 01',
          title: 'State feedback recipe',
          description: 'Loading, error ve empty durumlari ayni feedback diliyle tekrar kullanilir.',
          badges: ['wave-11', 'recipes', 'feedback'],
          content: renderRecipeComponentPreview('empty_error_loading'),
        },
      ];
    case 'AIGuidedAuthoring':
      return [
        {
          id: 'ai-guided-authoring-default',
          eyebrow: 'Recipe 01',
          title: 'AI guided authoring',
          description: 'Prompt yazimi, recommendation ve command palette ayni authoring shell altinda toplanir.',
          badges: ['wave-11', 'recipes', 'ai-authoring'],
          content: renderRecipeComponentPreview('ai_guided_authoring'),
        },
      ];
    default:
      return null;
  }
};
