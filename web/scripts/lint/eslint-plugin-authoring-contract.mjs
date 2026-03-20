import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SELF_PACKAGE_PREFIX = '@mfe/design-system';
const AUTHORING_META_FILENAME = 'component.authoring.v1.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILES_PATH = path.resolve(
  __dirname,
  '../../packages/design-system/docs/component-authoring.profiles.v1.json',
);
const profileConfig = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));

const isPascalCase = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name);

const unwrapExpression = (node) => {
  let current = node;

  while (
    current &&
    (current.type === 'TSAsExpression' ||
      current.type === 'TSSatisfiesExpression' ||
      current.type === 'TSNonNullExpression' ||
      current.type === 'ChainExpression')
  ) {
    current = current.expression;
  }

  return current;
};

const isForwardRefCall = (node) => {
  const current = unwrapExpression(node);
  if (!current || current.type !== 'CallExpression') {
    return false;
  }

  const callee = unwrapExpression(current.callee);
  if (!callee) {
    return false;
  }

  if (callee.type === 'Identifier') {
    return callee.name === 'forwardRef';
  }

  if (callee.type === 'MemberExpression' && !callee.computed) {
    return callee.object.type === 'Identifier'
      && callee.object.name === 'React'
      && callee.property.type === 'Identifier'
      && callee.property.name === 'forwardRef';
  }

  return false;
};

const isComponentInitializer = (node) => {
  const current = unwrapExpression(node);
  if (!current) {
    return false;
  }

  return (
    current.type === 'ArrowFunctionExpression'
    || current.type === 'FunctionExpression'
    || current.type === 'ClassExpression'
    || isForwardRefCall(current)
  );
};

const getAssignmentTargetName = (node) => {
  if (
    node?.type === 'AssignmentExpression'
    && node.operator === '='
    && node.left.type === 'MemberExpression'
    && !node.left.computed
    && node.left.object.type === 'Identifier'
    && node.left.property.type === 'Identifier'
    && node.left.property.name === 'displayName'
  ) {
    return node.left.object.name;
  }

  return null;
};

const hasStaticDisplayName = (node) => {
  if (!node?.body?.body) {
    return false;
  }

  return node.body.body.some((member) => {
    const isStatic = member.static === true;
    const key = member.key;
    return (
      isStatic
      && (member.type === 'PropertyDefinition' || member.type === 'ClassProperty')
      && key?.type === 'Identifier'
      && key.name === 'displayName'
    );
  });
};

const getAuthoringMetadata = (filename) => {
  try {
    const metaPath = path.join(path.dirname(filename), AUTHORING_META_FILENAME);
    if (!fs.existsSync(metaPath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return null;
  }
};

export const rules = {
  'no-self-package-imports': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Disallow importing @mfe/design-system public subpaths from within the package source itself.',
        recommended: true,
      },
      schema: [],
      messages: {
        noSelfPackageImport:
          'Package source must not import from "{{source}}". Use repo-local relative imports instead.',
      },
    },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value;
          if (typeof source !== 'string') {
            return;
          }

          if (source === SELF_PACKAGE_PREFIX || source.startsWith(`${SELF_PACKAGE_PREFIX}/`)) {
            context.report({
              node,
              messageId: 'noSelfPackageImport',
              data: { source },
            });
          }
        },
      };
    },
  },
  'require-display-name': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require exported PascalCase React component definitions to set displayName.',
        recommended: true,
      },
      schema: [],
      messages: {
        missingDisplayName:
          'Exported component "{{name}}" should define displayName for DevTools and authoring consistency.',
      },
    },
    create(context) {
      const exportedComponents = new Map();
      const displayNames = new Set();

      return {
        Program() {
          exportedComponents.clear();
          displayNames.clear();
        },
        ExportNamedDeclaration(node) {
          const declaration = node.declaration;
          if (!declaration) {
            return;
          }

          if (declaration.type === 'FunctionDeclaration' && declaration.id?.name) {
            const name = declaration.id.name;
            if (isPascalCase(name)) {
              exportedComponents.set(name, declaration.id);
            }
            return;
          }

          if (declaration.type === 'ClassDeclaration' && declaration.id?.name) {
            const name = declaration.id.name;
            if (isPascalCase(name) && hasStaticDisplayName(declaration)) {
              displayNames.add(name);
            }
            if (isPascalCase(name)) {
              exportedComponents.set(name, declaration.id);
            }
            return;
          }

          if (declaration.type === 'VariableDeclaration') {
            for (const declarator of declaration.declarations) {
              if (declarator.id.type !== 'Identifier') {
                continue;
              }

              const name = declarator.id.name;
              if (!isPascalCase(name) || !isComponentInitializer(declarator.init)) {
                continue;
              }

              exportedComponents.set(name, declarator.id);
            }
          }
        },
        ExpressionStatement(node) {
          const assignedName = getAssignmentTargetName(node.expression);
          if (assignedName) {
            displayNames.add(assignedName);
          }
        },
        'Program:exit'() {
          for (const [name, identifierNode] of exportedComponents.entries()) {
            if (displayNames.has(name)) {
              continue;
            }

            context.report({
              node: identifierNode,
              messageId: 'missingDisplayName',
              data: { name },
            });
          }
        },
      };
    },
  },
  'require-forward-ref-by-profile': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Require scaffold-managed components whose authoring profile mandates forwardRef to export via forwardRef.',
        recommended: true,
      },
      schema: [],
      messages: {
        missingForwardRef:
          'Scaffold-managed component "{{name}}" uses profile "{{profile}}" and should be exported via forwardRef.',
      },
    },
    create(context) {
      const metadata = getAuthoringMetadata(context.filename);
      if (!metadata) {
        return {};
      }

      const profile = profileConfig.profiles?.[metadata.profile];
      if (!profile || profile.usesForwardRef !== 'required') {
        return {};
      }

      const expectedName = metadata.name;
      const declarations = new Map();
      const exportedNames = new Set();

      const rememberDeclaration = (name, node, isForwardRef) => {
        if (name !== expectedName) {
          return;
        }

        declarations.set(name, { node, isForwardRef });
      };

      return {
        FunctionDeclaration(node) {
          if (node.id?.name === expectedName) {
            rememberDeclaration(expectedName, node.id, false);
          }
        },
        ClassDeclaration(node) {
          if (node.id?.name === expectedName) {
            rememberDeclaration(expectedName, node.id, false);
          }
        },
        VariableDeclaration(node) {
          for (const declarator of node.declarations) {
            if (declarator.id.type !== 'Identifier' || declarator.id.name !== expectedName) {
              continue;
            }

            rememberDeclaration(expectedName, declarator.id, isForwardRefCall(declarator.init));
          }
        },
        ExportNamedDeclaration(node) {
          const declaration = node.declaration;
          if (declaration?.type === 'FunctionDeclaration' && declaration.id?.name === expectedName) {
            exportedNames.add(expectedName);
          }

          if (declaration?.type === 'ClassDeclaration' && declaration.id?.name === expectedName) {
            exportedNames.add(expectedName);
          }

          if (declaration?.type === 'VariableDeclaration') {
            for (const declarator of declaration.declarations) {
              if (declarator.id.type === 'Identifier' && declarator.id.name === expectedName) {
                exportedNames.add(expectedName);
              }
            }
          }

          for (const specifier of node.specifiers ?? []) {
            if (
              specifier.type === 'ExportSpecifier'
              && specifier.local.type === 'Identifier'
              && specifier.local.name === expectedName
            ) {
              exportedNames.add(expectedName);
            }
          }
        },
        'Program:exit'() {
          if (!exportedNames.has(expectedName)) {
            return;
          }

          const declaration = declarations.get(expectedName);
          if (declaration?.isForwardRef) {
            return;
          }

          context.report({
            node: declaration?.node ?? context.sourceCode.ast,
            messageId: 'missingForwardRef',
            data: {
              name: expectedName,
              profile: metadata.profile,
            },
          });
        },
      };
    },
  },
};
