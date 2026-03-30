import type { DesignLabComponentDocEntry } from '../types';
const entry: DesignLabComponentDocEntry = {
  name: 'Image',
  indexItem: {
    name: 'Image', kind: 'component', availability: 'exported', lifecycle: 'stable', maturity: 'beta',
    group: 'data_display', subgroup: 'media', taxonomyGroupId: 'general', taxonomySubgroup: 'Data Display',
    demoMode: 'live',
    description: 'Smart image with click-to-preview (zoom via scroll wheel), fallback on error, lazy loading via IntersectionObserver, and gallery grouping. Compound: Image + Image.Group.',
    sectionIds: ['component_library_management'], qualityGates: ['design_tokens', 'preview_visibility', 'a11y_keyboard_support'],
    tags: ['wave-3', 'data-display', 'image', 'media', 'beta'],
    importStatement: "import { Image } from '@mfe/design-system';", whereUsed: [], dependsOn: [],
  },
  apiItem: {
    name: 'Image',
    variantAxes: ['objectFit: cover | contain | fill | none', 'rounded: boolean | sm | md | lg | xl | full'],
    previewStates: ['default', 'with-fallback', 'preview', 'gallery', 'lazy-load', 'rounded'],
    behaviorModel: ['IntersectionObserver lazy load (200px rootMargin)', 'click-to-preview modal with zoom', 'scroll wheel zoom (0.5x-3x)', 'Escape to close preview', 'error fallback src swap'],
    props: [
      { name: 'src', type: 'string', default: '-', required: false, description: 'Image source URL.' },
      { name: 'fallback', type: 'string', default: '-', required: false, description: 'Fallback src on error.' },
      { name: 'preview', type: 'boolean | PreviewConfig', default: 'false', required: false, description: 'Enable click-to-preview.' },
      { name: 'lazy', type: 'boolean', default: 'true', required: false, description: 'Lazy load via IntersectionObserver.' },
      { name: 'rounded', type: "boolean | 'sm' | 'md' | 'lg' | 'xl' | 'full'", default: 'false', required: false, description: 'Border radius.' },
      { name: 'objectFit', type: "'cover' | 'contain' | 'fill' | 'none'", default: "'cover'", required: false, description: 'Object-fit mode.' },
    ],
    previewFocus: ['preview modal with zoom', 'fallback on 404', 'gallery layout', 'lazy load trigger'],
    regressionFocus: ['IntersectionObserver cleanup', 'Escape key closes preview', 'zoom bounds clamping', 'error → fallback swap'],
  },
};
export default entry;
