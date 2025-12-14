const COLOR_KEYS = new Set([
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'boxShadow',
]);

const DISALLOWED_PATTERN = /(#[0-9a-fA-F]{3,8}\b)|(rgba?\()|(hsla?\()/;

const isPlainTemplateLiteral = (node) =>
  node.type === 'TemplateLiteral' && node.expressions.length === 0;

const extractTemplateValue = (node) =>
  node.quasis.length ? node.quasis[0].value.cooked ?? '' : '';

const getPropertyName = (key) => {
  if (!key) return null;
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'Literal') return String(key.value);
  return null;
};

const valueMatches = (node) => {
  if (!node) return false;
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return matchesString(node.value);
  }
  if (isPlainTemplateLiteral(node)) {
    return matchesString(extractTemplateValue(node));
  }
  return false;
};

const matchesString = (value) => {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith('var(')) {
    return false;
  }
  return DISALLOWED_PATTERN.test(trimmed);
};

export const rules = {
  'no-inline-color-literals': {
    meta: {
      type: 'suggestion',
      docs: {
        description:
          'Avoid inline hex/rgb color literals in style props; use semantic tokens instead.',
      },
      messages: {
        inlineColor:
          'Inline renk değeri tespit edildi. Lütfen semantic token (var(--...)) kullanın.',
      },
      schema: [],
    },
    create(context) {
      return {
        'JSXAttribute[name.name="style"] ObjectExpression > Property'(node) {
          const keyName = getPropertyName(node.key);
          if (!keyName || !COLOR_KEYS.has(keyName)) {
            return;
          }
          if (valueMatches(node.value)) {
            context.report({
              node: node.value,
              messageId: 'inlineColor',
            });
          }
        },
      };
    },
  },
};
