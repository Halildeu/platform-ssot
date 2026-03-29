#!/usr/bin/env node
/**
 * Component API Lint — checks doc entries for API consistency
 *
 * Rules:
 *   1. Every component with kind="component" should have a className prop
 *   2. Every component should have a size prop OR a documented exclusion
 *   3. Every component should have at least one a11y prop (aria-label, label, title, role)
 *
 * Usage:
 *   node scripts/lint-component-api.mjs
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Discover component source files
// ---------------------------------------------------------------------------
const COMPONENT_DIRS = [
  'packages/design-system/src/primitives',
  'packages/design-system/src/components',
  'packages/design-system/src/advanced',
];

// Components excluded from className requirement (composite/wrapper components)
const CLASSNAME_EXCLUSIONS = new Set([
  'CommandPalette', 'EntityGridTemplate', 'JsonViewer', 'List',
  'NotificationDrawer', 'TableSimple', 'Toast', 'Tree', 'TreeTable',
  'VariantIntegration',
]);

// Props that indicate a11y support
const A11Y_PROPS = ['aria-label', 'ariaLabel', 'label', 'title', 'role', 'aria-labelledby', 'ariaLabelledBy', 'aria-describedby'];

// Components excluded from size prop requirement (layout/utility/composite components)
const SIZE_EXCLUSIONS = new Set([
  'Divider', 'Spacer', 'Layout', 'Grid', 'Stack', 'Box', 'Flex',
  'Container', 'Section', 'Card', 'CardHeader', 'CardBody', 'CardFooter',
  'Accordion', 'AccordionItem', 'AccordionPanel',
  'Modal', 'ModalHeader', 'ModalBody', 'ModalFooter',
  'Drawer', 'DrawerHeader', 'DrawerBody', 'DrawerFooter',
  'Tabs', 'TabList', 'TabPanel', 'Tab',
  'Table', 'TableHead', 'TableBody', 'TableRow', 'TableCell',
  'Form', 'FormField', 'FormLabel', 'FormHelperText', 'FormErrorMessage',
  'Breadcrumb', 'BreadcrumbItem',
  'Sidebar', 'SidebarGroup', 'SidebarItem',
  'Popover', 'PopoverTrigger', 'PopoverContent',
  'Tooltip', 'TooltipTrigger', 'TooltipContent',
  'Dialog', 'DialogTrigger', 'DialogContent',
  'DropdownMenu', 'DropdownMenuItem', 'DropdownMenuTrigger',
  'Alert', 'AlertTitle', 'AlertDescription',
  'Toast', 'Toaster',
  'Skeleton', 'Progress',
  'DataGrid', 'Chart', 'Scheduler', 'Kanban', 'Editor', 'FormBuilder',
  // Utility/internal primitives
  'Slot', 'LinkInline', 'Dropdown', 'ErrorBoundary',
  // Composite advanced components (size managed by children)
  'AIActionAuditTimeline', 'AIGuidedAuthoring', 'AILayoutBuilder',
  'ApprovalCheckpoint', 'ApprovalReview', 'CitationPanel',
  'CommandPalette', 'ContextMenu', 'DetailDrawer', 'FormDrawer',
  'NotificationDrawer', 'SmartDashboard', 'VariantIntegration',
  // Additional design-by-design exclusions
  'AnchorToc', 'ConfidenceBadge', 'Descriptions', 'DetailSectionTabs',
  'EmptyErrorLoading', 'EmptyState', 'NotificationItemCard',
  'TablePagination', 'ThemePresetCompare', 'ThemePresetGallery',
  'ThemePreviewCard', 'Watermark',
  'JsonViewer', 'List', 'TableSimple', 'Tree', 'TreeTable',
  'GridShell', 'GridToolbar', 'EntityGridTemplate',
  'SearchFilterListing', 'MasterDetail', 'AgGridServer',
  'PageLayout', 'CrudTemplate', 'DashboardTemplate',
  'DetailTemplate', 'SettingsTemplate', 'CommandWorkspace',
  'TourCoachmarks', 'ToastProvider', 'PromptComposer',
  'RecommendationCard', 'NotificationPanel',
]);

// Components excluded from a11y prop requirement (layout/container/decorative)
const A11Y_EXCLUSIONS = new Set([
  'Slot', 'Stack', 'Divider', 'Spacer', 'Skeleton', 'Spinner',
  'Card', 'Badge', 'Tag', 'Timeline', 'Steps',
  'Avatar', 'AvatarGroup', 'ErrorBoundary',
  'GridShell', 'GridToolbar', 'VariantIntegration',
  'PageLayout', 'EntityGridTemplate', 'AgGridServer',
  'SearchFilterListing', 'MasterDetail', 'SmartDashboard',
  'CrudTemplate', 'DashboardTemplate', 'DetailTemplate',
  'SettingsTemplate', 'CommandWorkspace', 'NotificationPanel',
  'Watermark', // Decorative — no semantic content
]);

function findComponentFiles() {
  const files = [];

  for (const dir of COMPONENT_DIRS) {
    const absDir = resolve(ROOT, dir);
    if (!existsSync(absDir)) continue;

    walkDir(absDir, (filePath) => {
      const name = basename(filePath);
      // Only check .tsx files that look like component definitions
      if (name.endsWith('.tsx') && !name.includes('.test.') && !name.includes('.spec.') && !name.includes('.stories.')) {
        files.push(filePath);
      }
    });
  }

  return files;
}

function walkDir(dir, callback) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__tests__') {
        walkDir(full, callback);
      } else if (entry.isFile()) {
        callback(full);
      }
    }
  } catch {
    // skip unreadable dirs
  }
}

function extractComponentName(filePath) {
  const name = basename(filePath, '.tsx');
  // PascalCase file = component name
  if (/^[A-Z]/.test(name)) return name;
  // index.tsx — use parent dir name
  if (name === 'index') return basename(dirname(filePath));
  return null;
}

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const componentName = extractComponentName(filePath);

  if (!componentName || /^[a-z]/.test(componentName)) return null;

  // Check if this file actually exports a React component
  const hasJSX = content.includes('JSX') || content.includes('React.FC') ||
    content.includes('React.forwardRef') || content.includes('return (') ||
    content.includes('=> (') || content.includes('createElement');
  const hasExport = content.includes('export');

  if (!hasJSX || !hasExport) return null;

  const issues = [];

  // Rule 1: className prop
  const hasClassName = content.includes('className') && (
    content.includes('className?:') || content.includes('className:') ||
    content.includes('...props') || content.includes('HTMLAttributes') ||
    content.includes('ComponentProps')
  );
  if (!hasClassName && !CLASSNAME_EXCLUSIONS.has(componentName)) {
    issues.push('missing className prop (customizability)');
  }

  // Rule 2: size prop (with exclusions)
  if (!SIZE_EXCLUSIONS.has(componentName)) {
    const hasSize = content.includes('size') && (
      content.includes("size?:") || content.includes("size:") ||
      content.includes("'sm'") || content.includes("'md'") || content.includes("'lg'")
    );
    if (!hasSize) {
      issues.push('missing size prop (or add to SIZE_EXCLUSIONS)');
    }
  }

  // Rule 3: a11y prop (skip layout/container/decorative components)
  if (!A11Y_EXCLUSIONS.has(componentName)) {
    const hasA11y = A11Y_PROPS.some((prop) => content.includes(prop));
    if (!hasA11y) {
      issues.push('missing a11y prop (aria-label, label, title, or role)');
    }
  }

  if (issues.length === 0) return null;

  return {
    component: componentName,
    file: filePath.replace(ROOT + '/', ''),
    issues,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const files = findComponentFiles();
const violations = [];

for (const file of files) {
  const result = checkFile(file);
  if (result) violations.push(result);
}

console.log('=== Component API Lint ===\n');
console.log(`Scanned: ${files.length} component files`);
console.log(`Violations: ${violations.length}\n`);

if (violations.length > 0) {
  for (const v of violations) {
    console.log(`  ${v.component} (${v.file})`);
    for (const issue of v.issues) {
      console.log(`    - ${issue}`);
    }
    console.log('');
  }
  console.log('Component API lint found issues. Review and fix or update exclusions.');
  // Informational for now — exit 0 to not block verify:release
  // Change to process.exit(1) when ready to enforce
  process.exit(0);
} else {
  console.log('All components pass API lint checks.');
  process.exit(0);
}
