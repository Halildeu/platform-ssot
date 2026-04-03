/**
 * AI Query Types — Natural language to report.
 */

import type { ColumnMeta } from '@mfe/design-system/advanced/data-grid';
import type { ChartType } from '../visualization/types';

export interface AiQueryRequest {
  prompt: string;
  schema: string;
  context?: {
    tables?: string[];
    domains?: string[];
    recentQueries?: string[];
  };
}

export interface AiQueryResponse {
  sql: string;
  columns: ColumnMeta[];
  chartSuggestion: ChartType;
  explanation: string;
  confidence: number;
  suggestedTitle: string;
  warnings?: string[];
}

export interface AiSuggestion {
  id: string;
  prompt: string;
  category: string;
  icon: string;
}

export const QUICK_SUGGESTIONS: AiSuggestion[] = [
  { id: 'top-customers', prompt: 'En çok alışveriş yapan 10 müşteriyi göster', category: 'Satış', icon: '👥' },
  { id: 'monthly-revenue', prompt: 'Son 12 aydaki gelir trendi', category: 'Finans', icon: '📈' },
  { id: 'employee-distribution', prompt: 'Departmanlara göre çalışan dağılımı', category: 'İK', icon: '👥' },
  { id: 'overdue-invoices', prompt: 'Vadesi geçmiş faturaları listele', category: 'Finans', icon: '⚠️' },
  { id: 'audit-errors', prompt: 'Son 7 günde ERROR seviyesindeki denetim olayları', category: 'Denetim', icon: '🔴' },
  { id: 'stock-low', prompt: 'Minimum stok seviyesinin altındaki ürünler', category: 'Stok', icon: '📦' },
];
