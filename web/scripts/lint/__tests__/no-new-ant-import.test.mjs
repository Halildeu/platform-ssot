/**
 * Tests for the no-new-ant-import ESLint rule.
 *
 * Uses ESLint's RuleTester internally, wrapped in vitest for CI compatibility.
 */

import { describe, test } from 'vitest';
import { createRequire } from 'node:module';
import tsParser from '@typescript-eslint/parser';

const require = createRequire(import.meta.url);
const { RuleTester } = require('eslint');

import { rules } from '../eslint-plugin-no-ant-import.mjs';

const rule = rules['no-new-ant-import'];

describe('no-new-ant-import', () => {
  test('valid and invalid cases pass RuleTester', () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
    });

    ruleTester.run('no-new-ant-import', rule, {
      valid: [
        // --- Design-system import (allowed) ---
        {
          code: 'import { Button } from "@design-system/components";',
          filename: 'src/components/MyButton.tsx',
        },

        // --- Relative import from non-ant module (allowed) ---
        {
          code: 'import { utils } from "../shared/helpers";',
          filename: 'src/components/MyComponent.tsx',
        },

        // --- React import (allowed) ---
        {
          code: 'import React from "react";',
          filename: 'src/components/App.tsx',
        },

        // --- Test file (exempt) ---
        {
          code: 'import { Button } from "antd";',
          filename: 'src/components/__tests__/Button.test.tsx',
        },

        // --- Spec file (exempt) ---
        {
          code: 'import { Table } from "antd";',
          filename: 'src/components/Table.spec.ts',
        },

        // --- Stories file (exempt) ---
        {
          code: 'import { Card } from "antd";',
          filename: 'src/components/Card.stories.tsx',
        },

        // --- Legacy directory file (exempt) ---
        {
          code: 'import { DatePicker } from "antd";',
          filename: 'packages/design-system/src/legacy/AntDatePicker.tsx',
        },

        // --- Legacy sub-directory (exempt) ---
        {
          code: 'import { SearchOutlined } from "@ant-design/icons";',
          filename: 'src/legacy/icons/index.ts',
        },

        // --- Non-antd scoped package (allowed) ---
        {
          code: 'import { something } from "@ant-tools/helper";',
          filename: 'src/components/Helper.tsx',
        },
      ],

      invalid: [
        // --- Direct antd import ---
        {
          code: 'import { Button } from "antd";',
          filename: 'src/components/MyButton.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- antd sub-path import ---
        {
          code: 'import { Button } from "antd/es/button";',
          filename: 'src/components/MyButton.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- @ant-design/icons import ---
        {
          code: 'import { SearchOutlined } from "@ant-design/icons";',
          filename: 'src/components/Search.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- @ant-design/pro-layout import ---
        {
          code: 'import ProLayout from "@ant-design/pro-layout";',
          filename: 'src/layouts/MainLayout.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- Type import from antd (still flagged) ---
        {
          code: 'import type { TableProps } from "antd";',
          filename: 'src/components/DataTable.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- Multiple named imports ---
        {
          code: 'import { Button, Table, Modal } from "antd";',
          filename: 'src/pages/Dashboard.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },

        // --- Non-test file with test-like name ---
        {
          code: 'import { Input } from "antd";',
          filename: 'src/components/TestInput.tsx',
          errors: [{ messageId: 'noAntImport' }],
        },
      ],
    });
  });
});
