// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import {
  DesignSystemMCPServer,
  getComponentCatalog,
  getComponentDoc,
  getComponentTokens,
  getComponentExamples,
  searchComponents,
  getDesignTokens,
  suggestComponent,
  validateUsage,
  generateCode,
} from '../index';

/* ------------------------------------------------------------------ */
/*  getComponentCatalog                                                */
/* ------------------------------------------------------------------ */

describe('getComponentCatalog', () => {
  it('bilesen listesini dondurur', () => {
    const catalog = getComponentCatalog();
    expect(catalog.length).toBeGreaterThan(0);
  });

  it('her bilesenin zorunlu alanlari vardir', () => {
    const catalog = getComponentCatalog();
    for (const comp of catalog) {
      expect(comp.name).toBeTruthy();
      expect(comp.description).toBeTruthy();
      expect(comp.category).toBeTruthy();
      expect(['stable', 'beta']).toContain(comp.lifecycle);
      expect(comp.importStatement).toBeTruthy();
    }
  });

  it('bilinen bilesenleri icerir', () => {
    const catalog = getComponentCatalog();
    const names = catalog.map((c) => c.name);
    expect(names).toContain('Button');
    expect(names).toContain('Tabs');
    expect(names).toContain('Alert');
  });

  it('sadece component turundeki entry\'leri dondurur (hook/function haric)', () => {
    const catalog = getComponentCatalog();
    // Hook ve function isimleri genellikle kucuk harfle baslar veya "use" ile baslar
    for (const comp of catalog) {
      expect(comp.name[0]).toEqual(comp.name[0].toUpperCase());
    }
  });
});

/* ------------------------------------------------------------------ */
/*  getComponentDoc                                                    */
/* ------------------------------------------------------------------ */

describe('getComponentDoc', () => {
  it('bilinen bilesen icin dokumantasyon dondurur', () => {
    const doc = getComponentDoc('Button');
    expect(doc).not.toBeNull();
    expect(doc!.name).toBe('Button');
    expect(doc!.props.length).toBeGreaterThan(0);
  });

  it('buyuk/kucuk harf duyarsiz calisir', () => {
    const doc = getComponentDoc('button');
    expect(doc).not.toBeNull();
    expect(doc!.name).toBe('Button');
  });

  it('bilinmeyen bilesen icin null dondurur', () => {
    const doc = getComponentDoc('BilinmeyenBilesen');
    expect(doc).toBeNull();
  });

  it('props bilgisi dogru tiplerde gelir', () => {
    const doc = getComponentDoc('Button');
    expect(doc).not.toBeNull();
    for (const prop of doc!.props) {
      expect(typeof prop.name).toBe('string');
      expect(typeof prop.type).toBe('string');
      expect(typeof prop.required).toBe('boolean');
      expect(typeof prop.description).toBe('string');
    }
  });

  it('iliskili bilesen listesi dondurur', () => {
    const doc = getComponentDoc('Button');
    expect(doc).not.toBeNull();
    expect(Array.isArray(doc!.relatedComponents)).toBe(true);
  });

  it('erisilebilirlik notlari dondurur', () => {
    const doc = getComponentDoc('Button');
    expect(doc).not.toBeNull();
    expect(doc!.accessibilityNotes.length).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/*  getComponentTokens                                                 */
/* ------------------------------------------------------------------ */

describe('getComponentTokens', () => {
  it('Button tokenlari dondurur', () => {
    const tokens = getComponentTokens('Button');
    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens[0].cssVariable).toContain('var(');
    expect(tokens[0].category).toBe('color');
  });

  it('bilinmeyen bilesen icin bos liste dondurur', () => {
    const tokens = getComponentTokens('BilinmeyenBilesen');
    expect(tokens).toEqual([]);
  });

  it('her tokenin light ve dark degerleri vardir', () => {
    const tokens = getComponentTokens('Alert');
    for (const token of tokens) {
      expect(token.lightValue).toBeTruthy();
      expect(token.darkValue).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */
/*  getComponentExamples                                               */
/* ------------------------------------------------------------------ */

describe('getComponentExamples', () => {
  it('bilinen bilesen icin ornekler dondurur', () => {
    const examples = getComponentExamples('Button');
    expect(examples.length).toBeGreaterThan(0);
  });

  it('bilinmeyen bilesen icin bos dizi dondurur', () => {
    const examples = getComponentExamples('YokBilesen');
    expect(examples).toEqual([]);
  });

  it('ornek yapisinda zorunlu alanlar vardir', () => {
    const examples = getComponentExamples('Tabs');
    for (const ex of examples) {
      expect(ex.title).toBeTruthy();
      expect(ex.code).toBeTruthy();
      expect(ex.category).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */
/*  searchComponents                                                   */
/* ------------------------------------------------------------------ */

describe('searchComponents', () => {
  it('"button" aramasinda Button bilesenini bulur', () => {
    const results = searchComponents('button');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].component).toBe('Button');
  });

  it('"navigation" aramasinda navigasyon bilesenlerini bulur', () => {
    const results = searchComponents('navigation');
    expect(results.length).toBeGreaterThan(0);
    const names = results.map((r) => r.component);
    expect(names.some((n) => ['Tabs', 'Breadcrumb', 'NavigationRail', 'MenuBar'].includes(n))).toBe(true);
  });

  it('bos sorgu icin bos dizi dondurur', () => {
    const results = searchComponents('');
    expect(results).toEqual([]);
  });

  it('sonuclar relevance\'a gore siralanir', () => {
    const results = searchComponents('button');
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].relevance).toBeGreaterThanOrEqual(results[i].relevance);
    }
  });

  it('maksimum 10 sonuc dondurur', () => {
    const results = searchComponents('a');
    expect(results.length).toBeLessThanOrEqual(10);
  });
});

/* ------------------------------------------------------------------ */
/*  getDesignTokens                                                    */
/* ------------------------------------------------------------------ */

describe('getDesignTokens', () => {
  it('kategori filtresi olmadan tum tokenlari dondurur', () => {
    const tokens = getDesignTokens();
    expect(tokens.length).toBeGreaterThan(10);
    const categories = new Set(tokens.map((t) => t.category));
    expect(categories.size).toBeGreaterThan(1);
  });

  it('renk tokenlari filtreler', () => {
    const tokens = getDesignTokens('color');
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      expect(token.category).toBe('color');
    }
  });

  it('spacing tokenlari filtreler', () => {
    const tokens = getDesignTokens('spacing');
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      expect(token.category).toBe('spacing');
    }
  });

  it('motion tokenlari filtreler', () => {
    const tokens = getDesignTokens('motion');
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      expect(token.category).toBe('motion');
    }
  });
});

/* ------------------------------------------------------------------ */
/*  suggestComponent                                                   */
/* ------------------------------------------------------------------ */

describe('suggestComponent', () => {
  it('buton kullanim senaryosu icin Button onerir', () => {
    const suggestions = suggestComponent('kullanicinin tiklamasi icin bir buton lazim');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].component).toBe('Button');
    expect(suggestions[0].confidence).toBeGreaterThan(0);
  });

  it('tarih secimi icin DatePicker onerir', () => {
    const suggestions = suggestComponent('tarih secimi yapmak istiyorum');
    expect(suggestions.length).toBeGreaterThan(0);
    const components = suggestions.map((s) => s.component);
    expect(components).toContain('DatePicker');
  });

  it('bos girdi icin bos dizi dondurur', () => {
    const suggestions = suggestComponent('');
    expect(suggestions).toEqual([]);
  });

  it('oneri yapisinda ornek kod vardir', () => {
    const suggestions = suggestComponent('form input metin girisi');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].exampleCode).toBeTruthy();
    expect(suggestions[0].exampleCode).toContain('import');
  });

  it('onerileri confidence\'a gore siralar', () => {
    const suggestions = suggestComponent('button aksiyon');
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].confidence).toBeGreaterThanOrEqual(suggestions[i].confidence);
    }
  });
});

/* ------------------------------------------------------------------ */
/*  validateUsage                                                      */
/* ------------------------------------------------------------------ */

describe('validateUsage', () => {
  it('gecerli kullanimi onaylar', () => {
    const result = validateUsage('Button', { variant: 'primary', size: 'md' });
    expect(result.valid).toBe(true);
    expect(result.errors.filter((e) => e.severity === 'error')).toHaveLength(0);
  });

  it('bilinmeyen bilesen icin hata dondurur', () => {
    const result = validateUsage('YokBilesen', {});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('bilinmeyen prop icin uyari uretir', () => {
    const result = validateUsage('Button', { bilinmeyenProp: true });
    expect(result.errors.some((e) => e.prop === 'bilinmeyenProp')).toBe(true);
  });

  it('zorunlu prop eksikligini tespit eder', () => {
    // Tabs, items prop'u zorunlu
    const result = validateUsage('Tabs', {});
    const itemsError = result.errors.find((e) => e.prop === 'items');
    expect(itemsError).toBeDefined();
    expect(itemsError!.severity).toBe('error');
  });
});

/* ------------------------------------------------------------------ */
/*  generateCode                                                       */
/* ------------------------------------------------------------------ */

describe('generateCode', () => {
  it('bilesen icin kod uretir', () => {
    const result = generateCode('Button', 'primary buton');
    expect(result).not.toBeNull();
    expect(result!.code).toContain('Button');
    expect(result!.imports.length).toBeGreaterThan(0);
  });

  it('bilinmeyen bilesen icin null dondurur', () => {
    const result = generateCode('YokBilesen', 'herhangi bir sey');
    expect(result).toBeNull();
  });

  it('gereksinimlere gore props ekler', () => {
    const result = generateCode('Button', 'destructive variant');
    expect(result).not.toBeNull();
    expect(result!.code).toContain('destructive');
  });
});

/* ------------------------------------------------------------------ */
/*  DesignSystemMCPServer                                              */
/* ------------------------------------------------------------------ */

describe('DesignSystemMCPServer', () => {
  it('basarili bir sekilde olusturulur', () => {
    const server = new DesignSystemMCPServer();
    expect(server.componentCount).toBeGreaterThan(0);
  });

  it('bilesen isimlerini dondurur', () => {
    const server = new DesignSystemMCPServer();
    const names = server.getComponentNames();
    expect(names).toContain('Button');
    expect(names).toContain('Tabs');
  });

  it('tool listesini MCP formatinda dondurur', () => {
    const server = new DesignSystemMCPServer();
    const tools = server.listTools();
    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });

  it('tool cagrisini basariyla isler', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('getComponentDoc', { componentName: 'Button' });
    expect(result).not.toBeNull();
    expect((result as any).name).toBe('Button');
  });

  it('bilinmeyen tool icin hata dondurur', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('bilinmeyenTool', {});
    expect((result as any).error).toBeTruthy();
  });

  it('handleToolCall ile searchComponents calisir', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('searchComponents', { query: 'button' }) as any[];
    expect(result.length).toBeGreaterThan(0);
  });

  it('handleToolCall ile suggestComponent calisir', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('suggestComponent', { useCase: 'form input' }) as any[];
    expect(result.length).toBeGreaterThan(0);
  });

  it('handleToolCall ile validateUsage calisir', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('validateUsage', {
      componentName: 'Button',
      props: { variant: 'primary' },
    }) as any;
    expect(result.valid).toBe(true);
  });

  it('handleToolCall ile generateCode calisir', () => {
    const server = new DesignSystemMCPServer();
    const result = server.handleToolCall('generateCode', {
      componentName: 'Button',
      requirements: 'primary buton',
    }) as any;
    expect(result).not.toBeNull();
    expect(result.code).toContain('Button');
  });
});
