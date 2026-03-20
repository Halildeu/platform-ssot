/* ------------------------------------------------------------------ */
/*  MCP Server — Design System Model Context Protocol                  */
/*                                                                     */
/*  AI agent'larin tasarim sistemini kesfetmesi ve kullanmasi icin     */
/*  MCP protokolune uygun sunucu sinifi.                              */
/* ------------------------------------------------------------------ */

import { designLabComponentDocEntries } from '../catalog/component-docs';
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
} from './tools';

export class DesignSystemMCPServer {
  private catalog: Map<string, MCPComponentInfo>;

  constructor() {
    this.catalog = this.buildCatalog();
  }

  /** Catalog doc entry'lerinden bilesen haritasini olusturur */
  private buildCatalog(): Map<string, MCPComponentInfo> {
    const map = new Map<string, MCPComponentInfo>();
    const components = getComponentCatalog();
    for (const comp of components) {
      map.set(comp.name, comp);
    }
    return map;
  }

  /** Katalogtaki toplam bilesen sayisini dondurur */
  get componentCount(): number {
    return this.catalog.size;
  }

  /** Tum bilesen isimlerini dondurur */
  getComponentNames(): string[] {
    return Array.from(this.catalog.keys());
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
            componentName: {
              type: 'string',
              description: 'Kod uretilecek bilesenin adi.',
            },
            requirements: {
              type: 'string',
              description: 'Gereksinimlerin dogal dil aciklamasi.',
            },
          },
          required: ['componentName', 'requirements'],
        },
      },
    ];
  }
}
