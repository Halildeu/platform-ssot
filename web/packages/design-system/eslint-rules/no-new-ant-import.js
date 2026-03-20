/**
 * ESLint rule: no-new-ant-import
 *
 * Prevents new imports from 'antd' or '@ant-design/*' packages.
 * Suggests the @mfe/design-system equivalent when one exists.
 *
 * Severity behaviour:
 *   - Files that existed before the rule was enabled ("legacy"): WARN
 *   - New files (not in the legacy allow-list):                  ERROR
 *
 * Usage in .eslintrc:
 *
 *   rules: {
 *     "@mfe/no-new-ant-import": ["error", {
 *       legacyFiles: []   // glob patterns of files allowed to warn-only
 *     }]
 *   }
 *
 * Because the audit found ZERO existing antd imports, the legacyFiles list
 * defaults to empty and every new import will error.
 */

"use strict";

// ---------------------------------------------------------------------------
// Mapping: Ant component name -> native @mfe/design-system replacement
// Keep in sync with packages/design-system/src/legacy/ant-exit-plan.ts
// ---------------------------------------------------------------------------
const ANT_TO_NATIVE = {
  // Layout
  Space: "Stack / HStack / VStack",
  Divider: "Divider",

  // General
  Button: "Button / IconButton",
  Typography: "Text",

  // Navigation
  Breadcrumb: "Breadcrumb",
  Menu: "MenuBar / NavigationRail / ContextMenu",
  Pagination: "Pagination",
  Steps: "Steps",
  Tabs: "Tabs",
  Dropdown: "Dropdown",

  // Data Entry
  AutoComplete: "Combobox",
  Cascader: "Cascader",
  Checkbox: "Checkbox",
  ColorPicker: "ColorPicker",
  DatePicker: "DatePicker",
  Form: "FormField / AdaptiveForm",
  Input: "Input / TextInput / Textarea",
  InputNumber: "Input (type='number')",
  Mentions: "Mentions",
  Radio: "Radio / RadioGroup",
  Rate: "Rating",
  Select: "Select / Combobox",
  Slider: "Slider",
  Switch: "Switch",
  TimePicker: "TimePicker",
  Transfer: "Transfer",
  TreeSelect: "Tree / Combobox",
  Upload: "Upload",

  // Data Display
  Avatar: "Avatar / AvatarGroup",
  Badge: "Badge",
  Calendar: "Calendar",
  Card: "Card",
  Carousel: "Carousel",
  Collapse: "Accordion",
  Descriptions: "Descriptions",
  Empty: "EmptyState / Empty",
  List: "List",
  Popover: "Popover",
  QRCode: "QRCode",
  Segmented: "Segmented",
  Table: "TableSimple / TreeTable",
  Tag: "Tag",
  Timeline: "Timeline",
  Tooltip: "Tooltip",
  Tree: "Tree / TreeTable",

  // Feedback
  Alert: "Alert",
  Drawer: "Dialog / Modal",
  Message: "useToast",
  Modal: "Modal / Dialog",
  Notification: "useToast / NotificationDrawer",
  Popconfirm: "Dialog (confirmation variant)",
  Result: "EmptyErrorLoading",
  Skeleton: "Skeleton",
  Spin: "Spinner",

  // Other
  Anchor: "AnchorToc",
  FloatButton: "FloatButton",
  Tour: "TourCoachmarks",
  Watermark: "Watermark",
  ConfigProvider: "DesignSystemProvider / ThemeProvider",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Check if a source string is an antd-family import.
 */
function isAntImport(source) {
  return source === "antd" || source.startsWith("antd/") || source.startsWith("@ant-design");
}

/**
 * Match a file path against a list of glob-like patterns.
 * Supports simple * and ** wildcards -- no external deps needed.
 */
function matchesAny(filePath, patterns) {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some((pattern) => {
    const regex = new RegExp(
      "^" +
        pattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&")
          .replace(/\*\*/g, "{{GLOBSTAR}}")
          .replace(/\*/g, "[^/]*")
          .replace(/\{\{GLOBSTAR\}\}/g, ".*") +
        "$",
    );
    return regex.test(filePath);
  });
}

/**
 * Build a human-readable suggestion string for an imported component.
 */
function buildSuggestion(componentName) {
  const native = ANT_TO_NATIVE[componentName];
  if (native) {
    return ` Use @mfe/design-system '${native}' instead.`;
  }
  return " Consider using a @mfe/design-system equivalent.";
}

// ---------------------------------------------------------------------------
// Rule definition
// ---------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow new imports from antd or @ant-design packages",
      category: "Migration",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          legacyFiles: {
            type: "array",
            items: { type: "string" },
            description:
              "Glob patterns for files that are allowed to import antd with a warning instead of an error. " +
              "Default: [] (no legacy files -- all antd imports error).",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noAntImportError:
        "Do not import '{{component}}' from '{{source}}'.{{suggestion}}",
      noAntImportWarn:
        "[legacy] '{{component}}' is imported from '{{source}}' -- plan migration.{{suggestion}}",
      noAntModuleError:
        "Do not import from '{{source}}'. Use @mfe/design-system instead.",
      noAntModuleWarn:
        "[legacy] Import from '{{source}}' -- plan migration to @mfe/design-system.",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const legacyFiles = options.legacyFiles || [];
    const filePath = context.getFilename();
    const isLegacy = matchesAny(filePath, legacyFiles);

    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value;
        if (!source || !isAntImport(source)) return;

        const specifiers = node.specifiers || [];

        if (specifiers.length === 0) {
          // Side-effect import:  import 'antd/dist/reset.css'
          context.report({
            node,
            messageId: isLegacy ? "noAntModuleWarn" : "noAntModuleError",
            data: { source },
          });
          return;
        }

        for (const specifier of specifiers) {
          const componentName =
            specifier.type === "ImportSpecifier"
              ? (specifier.imported && specifier.imported.name) || specifier.local.name
              : specifier.local.name;

          const suggestion = buildSuggestion(componentName);

          context.report({
            node: specifier,
            messageId: isLegacy ? "noAntImportWarn" : "noAntImportError",
            data: {
              component: componentName,
              source,
              suggestion,
            },
          });
        }
      },

      // Also catch require() calls:  const { Button } = require('antd')
      CallExpression(node) {
        if (
          node.callee.type !== "Identifier" ||
          node.callee.name !== "require" ||
          !node.arguments.length ||
          node.arguments[0].type !== "Literal"
        ) {
          return;
        }

        const source = node.arguments[0].value;
        if (!source || !isAntImport(source)) return;

        context.report({
          node,
          messageId: isLegacy ? "noAntModuleWarn" : "noAntModuleError",
          data: { source },
        });
      },
    };
  },
};
