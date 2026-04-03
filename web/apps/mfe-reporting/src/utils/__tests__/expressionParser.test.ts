import { describe, expect, it } from 'vitest';
import { extractExpressionFields, validateExpression, evaluateExpression } from '../expressionParser';

describe('extractExpressionFields', () => {
  it('basit alan referansları', () => {
    expect(extractExpressionFields('price * quantity')).toEqual(['price', 'quantity']);
  });

  it('reserved kelimeler çıkarılır', () => {
    expect(extractExpressionFields('ROUND(price)')).toEqual(['price']);
  });

  it('duplicate kaldırılır', () => {
    expect(extractExpressionFields('price + price')).toEqual(['price']);
  });

  it('sayı ile başlayan token atlanır', () => {
    expect(extractExpressionFields('42 + price')).toEqual(['price']);
  });
});

describe('validateExpression', () => {
  const fields = ['price', 'quantity', 'tax'];

  it('geçerli ifade — 0 hata', () => {
    expect(validateExpression('price * quantity - tax', fields)).toEqual([]);
  });

  it('boş ifade — hata', () => {
    expect(validateExpression('', fields)).toContain('İfade boş olamaz');
  });

  it('bilinmeyen alan — hata', () => {
    const errors = validateExpression('price * unknown_field', fields);
    expect(errors.some((e) => e.includes('unknown_field'))).toBe(true);
  });

  it('dengesiz parantez — hata', () => {
    expect(validateExpression('(price * quantity', fields)).toContain('Parantezler dengesiz');
  });
});

describe('evaluateExpression', () => {
  it('basit çarpım', () => {
    expect(evaluateExpression('price * quantity', { price: 10, quantity: 5 })).toBe(50);
  });

  it('karmaşık ifade', () => {
    expect(evaluateExpression('(price * quantity) - tax', { price: 100, quantity: 2, tax: 36 })).toBe(164);
  });

  it('string değer → number dönüşüm', () => {
    expect(evaluateExpression('price * 2', { price: '15' })).toBe(30);
  });

  it('geçersiz değer → null', () => {
    expect(evaluateExpression('price * quantity', { price: 'abc', quantity: 5 })).toBeNull();
  });

  it('boş ifade → null', () => {
    expect(evaluateExpression('', {})).toBeNull();
  });
});
