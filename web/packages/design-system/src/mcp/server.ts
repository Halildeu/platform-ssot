/* ------------------------------------------------------------------ */
/*  MCP Server — Design System Model Context Protocol                  */
/*                                                                     */
/*  AI agent'larin tasarim sistemini kesfetmesi ve kullanmasi icin     */
/*  MCP protokolune uygun sunucu sinifi.                              */
/* ------------------------------------------------------------------ */

import type {
  MCPComponentInfo,
  MCPToolDefinition,
} from './types';
import {
  getComponentCatalog,
  getComponentDoc,
  getComponentTokens,
  getComponentExamples,
  searchComponents,
  getDesignTokens,
  suggestComponent,
  validateUsage,
  generateCode,
  // MCP v2 tools
  proposeLayout,
  reviewAccessibility,
  suggestTestCases,
  explainComponent,
  compareComponents,
  optimizeBundle,
  auditTokenUsage,
  suggestPattern,
  getComponentDependencies,
  getQualityReport,
  migrateComponent,
  generateFormSchema,
} from './tools';

export class DesignSystemMCPServer {
  private catalog: Map<string, MCPComponentInfo>;

  constructor() {
    this.catalog = this.buildCatalog();
  }

  /** Catalog doc entry'lerinden bilesen haritasini olusturur (lowercase key) */
  private buildCatalog(): Map<string, MCPComponentInfo> {
    const map = new Map<string, MCPComponentInfo>();
    const components = getComponentCatalog();
    for (const comp of components) {
      map.set(comp.name.toLowerCase(), comp);
    }
    return map;
  }

  /** Katalogtaki toplam bilesen sayisini dondurur */
  get componentCount(): number {
    return this.catalog.size;
  }

  /** Tum bilesen isimlerini dondurur (orijinal case) */
  getComponentNames(): string[] {
    return Array.from(this.catalog.values()).map(c => c.name);
  }

  /** MCP tool cagrisini isler ve sonucu dondurur */
  handleToolCall(toolName: string, args: Record<string, unknown>): unknown {
    switch (toolName) {
      case 'getComponentCatalog':
        return getComponentCatalog();

      case 'getComponentDoc':
        return getComponentDoc(args.componentName as string);

      case 'getComponentTokens':
        return getComponentTokens(args.componentName as string);

      case 'getComponentExamples':
        return getComponentExamples(args.componentName as string);

      case 'searchComponents':
        return searchComponents(args.query as string);

      case 'getDesignTokens':
        return getDesignTokens(args.category as string | undefined);

      case 'suggestComponent':
        return suggestComponent(args.useCase as string);

      case 'validateUsage':
        return validateUsage(
          args.componentName as string,
          args.props as Record<string, unknown>,
        );

      case 'generateCode':
        return generateCode(
          args.componentName as string,
          args.requirements as string,
        );

      // MCP v2 tools
      case 'proposeLayout':
        return proposeLayout(args.description as string, this.catalog);
      case 'reviewAccessibility':
        return reviewAccessibility(args.componentName as string, (args.props as Record<string, unknown>) ?? {}, this.catalog);
      case 'suggestTestCases':
        return suggestTestCases(args.componentName as string, this.catalog);
      case 'explainComponent':
        return explainComponent(args.componentName as string, this.catalog);
      case 'compareComponents':
        return compareComponents(args.a as string, args.b as string, this.catalog);
      case 'optimizeBundle':
        return optimizeBundle(args.components as string[]);
      case 'auditTokenUsage':
        return auditTokenUsage(args.code as string);
      case 'suggestPattern':
        return suggestPattern(args.components as string[], this.catalog);
      case 'getComponentDependencies':
        return getComponentDependencies(args.componentName as string, this.catalog);
      case 'getQualityReport':
        return getQualityReport(args.componentName as string | undefined, this.catalog);
      case 'migrateComponent':
        return migrateComponent(args.componentName as string, args.fromVersion as string, this.catalog);
      case 'generateFormSchema':
        return generateFormSchema(args.description as string);

      default:
        return { error: `Bilinmeyen tool: "${toolName}"` };
    }
  }

  /** Mevcut MCP tool listesini dondurur (MCP protokolune uygun) */
  listTools(): MCPToolDefinition[] {
    return [
      {
        name: 'getComponentCatalog',
        description: 'Tum tasarim sistemi bilesenlerinin katalogunu dondurur. Her bilesen icin isim, aciklama, kategori ve yasam dongusu bilgisi icerir.',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'getComponentDoc',
        description: 'Belirli bir bilesenin tam dokumantasyonunu dondurur. Props, ornekler, erisilebilirlik notlari ve iliskili bilesenleri icerir.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'Dokumantasyonu istenen bilesenin adi (orn: "Button", "Tabs").',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'getComponentTokens',
        description: 'Bir bilesenin kullandigi tasarim tokenlarini dondurur. CSS degiskeni, acik/koyu tema degerleri icerir.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'Tokenlari istenen bilesenin adi.',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'getComponentExamples',
        description: 'Bir bilesenin ornek kodlarini dondurur.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'Ornekleri istenen bilesenin adi.',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'searchComponents',
        description: 'Bilesenleri isim, aciklama, etiket ve prop uzerinden arar. Semantik eslestirme yapar.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Arama sorgusu (orn: "navigation", "form input", "date selection").',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'getDesignTokens',
        description: 'Tum tasarim tokenlarini dondurur. Kategori filtresi ile daraltilabilir.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Token kategorisi filtresi.',
              enum: ['color', 'spacing', 'typography', 'border', 'shadow', 'motion', 'sizing'],
            },
          },
          required: [],
        },
      },
      {
        name: 'suggestComponent',
        description: 'Kullanim senaryosuna gore en uygun bileseni/bilesenleri onerir. AI agent\'lar icin optimize edilmis cikti uretir.',
        inputSchema: {
          type: 'object',
          properties: {
            useCase: {
              type: 'string',
              description: 'Kullanim senaryosunun dogal dil aciklamasi (orn: "kullanicidan tarih secmesini istiyorum").',
            },
          },
          required: ['useCase'],
        },
      },
      {
        name: 'validateUsage',
        description: 'Bilesen prop kullanimini dogrular ve duzeltme onerileri sunar.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'Dogrulanacak bilesenin adi.',
            },
            props: {
              type: 'string',
              description: 'Dogrulanacak prop objesi (JSON).',
            },
          },
          required: ['componentName', 'props'],
        },
      },
      {
        name: 'generateCode',
        description: 'Dogal dil gereksinimlerinden bilesen kullanim kodu uretir.',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: { type: 'string', description: 'Kod uretilecek bilesenin adi.' },
            requirements: { type: 'string', description: 'Gereksinimlerin dogal dil aciklamasi.' },
          },
          required: ['componentName', 'requirements'],
        },
      },
      // MCP v2 tools
      { name: 'proposeLayout', description: 'Dogal dil aciklamasindan layout konfigurasyonu olusturur.', inputSchema: { type: 'object', properties: { description: { type: 'string', description: 'Layout aciklamasi (orn: "KPI dashboard with charts and data table")' } }, required: ['description'] } },
      { name: 'reviewAccessibility', description: 'Bilesen erisilebilirlik denetimi yapar ve duzeltme onerir.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Denetlenecek bilesen' }, props: { type: 'string', description: 'Prop objesi (JSON)' } }, required: ['componentName'] } },
      { name: 'suggestTestCases', description: 'Bilesen API\'sindan test senaryolari olusturur.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Test senaryolari icin bilesen' } }, required: ['componentName'] } },
      { name: 'explainComponent', description: 'Bilesenin ne zaman kullanilacagini, ne zaman kullanilmayacagini ve alternatiflerini aciklar.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Aciklanacak bilesen' } }, required: ['componentName'] } },
      { name: 'compareComponents', description: 'Iki bileseni props, kullanim alani ve performans acisindan karsilastirir.', inputSchema: { type: 'object', properties: { a: { type: 'string', description: 'Birinci bilesen' }, b: { type: 'string', description: 'Ikinci bilesen' } }, required: ['a', 'b'] } },
      { name: 'optimizeBundle', description: 'Bilesen listesinin bundle etkisini analiz eder ve optimizasyon onerir.', inputSchema: { type: 'object', properties: { components: { type: 'string', description: 'Bilesen listesi (JSON array)' } }, required: ['components'] } },
      { name: 'auditTokenUsage', description: 'Kodda hardcoded renk/boyut degerleri tespit eder ve token onerir.', inputSchema: { type: 'object', properties: { code: { type: 'string', description: 'Denetlenecek kaynak kodu' } }, required: ['code'] } },
      { name: 'suggestPattern', description: 'Bilesen kombinasyonundan layout pattern onerir.', inputSchema: { type: 'object', properties: { components: { type: 'string', description: 'Bilesen listesi (JSON array)' } }, required: ['components'] } },
      { name: 'getComponentDependencies', description: 'Bilesenin bagimlilik agacini dondurur.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Bilesen adi' } }, required: ['componentName'] } },
      { name: 'getQualityReport', description: 'Bilesen veya genel kalite metriklerini dondurur.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Bilesen adi (bos = genel rapor)' } }, required: [] } },
      { name: 'migrateComponent', description: 'Bilesen versiyon gecis rehberi olusturur.', inputSchema: { type: 'object', properties: { componentName: { type: 'string', description: 'Bilesen adi' }, fromVersion: { type: 'string', description: 'Mevcut versiyon' } }, required: ['componentName', 'fromVersion'] } },
      { name: 'generateFormSchema', description: 'Dogal dil aciklamasindan Zod schema ve form konfigurasyonu uretir.', inputSchema: { type: 'object', properties: { description: { type: 'string', description: 'Form aciklamasi (orn: "login form with email and password")' } }, required: ['description'] } },
    ];
  }
}
