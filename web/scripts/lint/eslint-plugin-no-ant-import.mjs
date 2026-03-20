/**
 * ESLint rule: no-new-ant-import
 *
 * Flags direct imports from "antd" or "@ant-design/*" packages.
 * Part of the Faz 5 Ant Design exit strategy — new code should use
 * design-system equivalents instead of reaching for Ant directly.
 *
 * FLAGGED:
 *   import { Button } from "antd";
 *   import { SearchOutlined } from "@ant-design/icons";
 *   import type { TableProps } from "antd";
 *
 * ALLOWED:
 *   import { Button } from "@design-system/components";
 *   import { Button } from "../legacy";          // grandfathered
 *   // Any import inside test / spec / stories / legacy files
 */

// File patterns exempt from the rule
const EXEMPT_FILE_PATTERNS = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\.stories\.[jt]sx?$/,
  /\/legacy\//,
];

/**
 * Check if a file path matches any of the given patterns.
 */
function isExemptFile(filePath, patterns) {
  return patterns.some((pattern) => pattern.test(filePath));
}

/**
 * Check if an import source targets Ant Design.
 * Matches: "antd", "antd/...", "@ant-design/icons", "@ant-design/pro-layout", etc.
 */
function isAntDesignSource(source) {
  return source === 'antd' || source.startsWith('antd/') || source.startsWith('@ant-design/');
}

export const rules = {
  'no-new-ant-import': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow direct imports from antd or @ant-design/* packages. ' +
          'Use the design-system equivalent instead.',
        recommended: true,
      },
      messages: {
        noAntImport:
          'Direct Ant Design imports are deprecated. Use the design-system equivalent instead.',
      },
      schema: [],
    },

    create(context) {
      const filename = context.filename || context.getFilename();

      // Skip exempt files (tests, stories, legacy directory)
      if (isExemptFile(filename, EXEMPT_FILE_PATTERNS)) {
        return {};
      }

      return {
        ImportDeclaration(node) {
          const source = node.source.value;
          if (isAntDesignSource(source)) {
            context.report({
              node,
              messageId: 'noAntImport',
            });
          }
        },
      };
    },
  },
};
