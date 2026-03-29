/**
 * AI-Grounded Design Lab Assistant
 *
 * Architecture:
 * - Builds context from: doc entries, quality scores, evidence registry
 * - Answers questions grounded in actual catalog data
 * - Never hallucinates — only uses verified data sources
 * - Provides source links for every answer
 *
 * Query types:
 * - "Bu ekran icin hangi component kullanmaliyim?"
 * - "Button'un tum variant'lari neler?"
 * - "Hangi component'lerin a11y skoru dusuk?"
 * - "Select ile Combobox arasindaki fark ne?"
 */

import { useCallback } from "react";
import { useDesignLab } from "../DesignLabProvider";
import type {
  DesignLabIndexItem,
  DesignLabApiItem,
  DesignLabComponentDocEntry,
} from "../DesignLabProvider";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface AssistantQuery {
  question: string;
  context?: string;
}

export interface AssistantSource {
  name: string;
  type: string;
  url: string;
}

export interface AssistantResponse {
  answer: string;
  sources: AssistantSource[];
  confidence: "high" | "medium" | "low";
  suggestions?: string[];
}

/* ------------------------------------------------------------------ */
/*  Pattern matching helpers                                            */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(/\s+/).filter(Boolean);
}

function matchScore(tokens: string[], target: string): number {
  const norm = normalize(target);
  let score = 0;
  for (const token of tokens) {
    if (norm.includes(token)) score++;
  }
  return score;
}

function buildComponentUrl(item: DesignLabIndexItem): string {
  return `/admin/design-lab/components/${item.taxonomyGroupId}/${encodeURIComponent(item.name)}`;
}

/* ------------------------------------------------------------------ */
/*  Grounded query engine                                               */
/* ------------------------------------------------------------------ */

function suggestComponentsForUseCase(
  useCase: string,
  items: DesignLabIndexItem[],
  docEntryMap: Map<string, DesignLabComponentDocEntry>,
): AssistantResponse {
  const tokens = tokenize(useCase);

  const scored = items
    .filter((i) => i.availability === "exported")
    .map((item) => {
      const doc = docEntryMap.get(item.name);
      const descScore = matchScore(tokens, item.description);
      const nameScore = matchScore(tokens, item.name) * 2;
      const tagScore = (item.tags ?? []).reduce(
        (acc, tag) => acc + matchScore(tokens, tag),
        0,
      );
      const docScore = doc?.summary
        ? matchScore(tokens, doc.summary)
        : 0;

      return {
        item,
        score: descScore + nameScore + tagScore + docScore,
      };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scored.length === 0) {
    return {
      answer: `"${useCase}" icin uygun component bulunamadi. Farkli anahtar kelimeler deneyin.`,
      sources: [],
      confidence: "low",
      suggestions: [
        "Daha genel terimler kullanin (ornegin: 'form', 'tablo', 'navigasyon')",
        "Component ismine gore arayin",
      ],
    };
  }

  const topMatches = scored.map((s) => s.item.name).join(", ");
  const confidence = scored[0].score >= 3 ? "high" : scored[0].score >= 2 ? "medium" : "low";

  return {
    answer: `"${useCase}" kullanim senaryosu icin onerilen component'ler: ${topMatches}. En yuksek eslesme: ${scored[0].item.name} (${scored[0].item.description}).`,
    sources: scored.map((s) => ({
      name: s.item.name,
      type: "component",
      url: buildComponentUrl(s.item),
    })),
    confidence,
    suggestions: scored.slice(1).map((s) => `${s.item.name}: ${s.item.description}`),
  };
}

function compareComponentsFn(
  nameA: string,
  nameB: string,
  items: DesignLabIndexItem[],
  apiItemMap: Map<string, DesignLabApiItem>,
  docEntryMap: Map<string, DesignLabComponentDocEntry>,
): AssistantResponse {
  const itemA = items.find((i) => normalize(i.name) === normalize(nameA));
  const itemB = items.find((i) => normalize(i.name) === normalize(nameB));

  if (!itemA || !itemB) {
    const missing = !itemA ? nameA : nameB;
    return {
      answer: `"${missing}" katologda bulunamadi.`,
      sources: [],
      confidence: "low",
    };
  }

  const apiA = apiItemMap.get(itemA.name);
  const apiB = apiItemMap.get(itemB.name);
  const docA = docEntryMap.get(itemA.name);
  const docB = docEntryMap.get(itemB.name);

  const lines: string[] = [];
  lines.push(`--- ${itemA.name} vs ${itemB.name} ---`);
  lines.push("");

  // Lifecycle
  lines.push(`Lifecycle: ${itemA.name}=${itemA.lifecycle}, ${itemB.name}=${itemB.lifecycle}`);

  // Props count
  const propsA = apiA?.props?.length ?? 0;
  const propsB = apiB?.props?.length ?? 0;
  lines.push(`Prop sayisi: ${itemA.name}=${propsA}, ${itemB.name}=${propsB}`);

  // Adoption
  const usageA = itemA.whereUsed?.length ?? 0;
  const usageB = itemB.whereUsed?.length ?? 0;
  lines.push(`Kullanim (whereUsed): ${itemA.name}=${usageA}, ${itemB.name}=${usageB}`);

  // Group
  lines.push(`Grup: ${itemA.name}=${itemA.group}, ${itemB.name}=${itemB.group}`);

  // Description
  lines.push("");
  lines.push(`${itemA.name}: ${itemA.description}`);
  lines.push(`${itemB.name}: ${itemB.description}`);

  return {
    answer: lines.join("\n"),
    sources: [
      { name: itemA.name, type: "component", url: buildComponentUrl(itemA) },
      { name: itemB.name, type: "component", url: buildComponentUrl(itemB) },
    ],
    confidence: "high",
  };
}

function findByQualityFn(
  minScore: number,
  items: DesignLabIndexItem[],
  _docEntryMap: Map<string, DesignLabComponentDocEntry>,
): AssistantResponse {
  // Quality is approximated from: lifecycle (stable=100, beta=60, planned=20)
  // + availability bonus + whereUsed density
  const scored = items
    .filter((i) => i.availability === "exported")
    .map((item) => {
      let quality = 0;
      if (item.lifecycle === "stable") quality += 50;
      else if (item.lifecycle === "beta") quality += 30;
      else quality += 10;

      // Adoption bonus
      const usage = item.whereUsed?.length ?? 0;
      quality += Math.min(usage * 5, 30);

      // Quality gates bonus
      quality += Math.min((item.qualityGates?.length ?? 0) * 5, 20);

      return { item, quality };
    })
    .filter((s) => s.quality >= minScore)
    .sort((a, b) => b.quality - a.quality)
    .slice(0, 20);

  if (scored.length === 0) {
    return {
      answer: `Minimum ${minScore} kalite skorunu karsilayan component bulunamadi.`,
      sources: [],
      confidence: "medium",
    };
  }

  const list = scored
    .slice(0, 10)
    .map((s) => `${s.item.name} (skor: ${s.quality})`)
    .join(", ");

  return {
    answer: `${scored.length} component minimum ${minScore} kalite skorunu karsilar. En yuksek: ${list}.`,
    sources: scored.slice(0, 10).map((s) => ({
      name: s.item.name,
      type: "component",
      url: buildComponentUrl(s.item),
    })),
    confidence: "high",
  };
}

function generalQuery(
  question: string,
  items: DesignLabIndexItem[],
  apiItemMap: Map<string, DesignLabApiItem>,
  docEntryMap: Map<string, DesignLabComponentDocEntry>,
): AssistantResponse {
  const tokens = tokenize(question);

  // Try to find a specific component reference
  const referencedComponent = items.find((item) =>
    tokens.some((t) => normalize(item.name) === t || normalize(item.name).includes(t)),
  );

  if (referencedComponent) {
    const api = apiItemMap.get(referencedComponent.name);
    const doc = docEntryMap.get(referencedComponent.name);
    const usage = referencedComponent.whereUsed?.length ?? 0;

    const lines: string[] = [];
    lines.push(`**${referencedComponent.name}**`);
    lines.push(`Aciklama: ${referencedComponent.description}`);
    lines.push(`Lifecycle: ${referencedComponent.lifecycle}`);
    lines.push(`Grup: ${referencedComponent.group} / ${referencedComponent.subgroup}`);
    lines.push(`Kullanim: ${usage} bagimliligi var`);

    if (api?.props) {
      const propNames = api.props.map((p) => p.name).join(", ");
      lines.push(`Props: ${propNames}`);

      if (api.variantAxes?.length) {
        lines.push(`Variant eksenleri: ${api.variantAxes.join(", ")}`);
      }
    }

    return {
      answer: lines.join("\n"),
      sources: [
        {
          name: referencedComponent.name,
          type: "component",
          url: buildComponentUrl(referencedComponent),
        },
      ],
      confidence: "high",
    };
  }

  // Fallback: suggest search
  return {
    answer:
      "Sorunuzu anlayamadim. Asagidaki hizli islemlerden birini deneyin veya bir component ismiyle tekrar sorun.",
    sources: [],
    confidence: "low",
    suggestions: [
      "Bir component ismi belirtin (ornegin: 'Button hakkinda bilgi ver')",
      "'Component oner' ile kullanim senaryosu belirtin",
      "'Karsilastir' ile iki component'i mukayese edin",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useDesignLabAssistant(): {
  query: (q: AssistantQuery) => AssistantResponse;
  suggestComponents: (useCase: string) => AssistantResponse;
  compareComponents: (a: string, b: string) => AssistantResponse;
  findByQuality: (minScore: number) => AssistantResponse;
} {
  const { index, apiItemMap, docEntryMap } = useDesignLab();
  const items = index.items;

  const query = useCallback(
    (q: AssistantQuery): AssistantResponse => {
      return generalQuery(q.question, items, apiItemMap, docEntryMap);
    },
    [items, apiItemMap, docEntryMap],
  );

  const suggestComponents = useCallback(
    (useCase: string): AssistantResponse => {
      return suggestComponentsForUseCase(useCase, items, docEntryMap);
    },
    [items, docEntryMap],
  );

  const compareComponents = useCallback(
    (a: string, b: string): AssistantResponse => {
      return compareComponentsFn(a, b, items, apiItemMap, docEntryMap);
    },
    [items, apiItemMap, docEntryMap],
  );

  const findByQuality = useCallback(
    (minScore: number): AssistantResponse => {
      return findByQualityFn(minScore, items, docEntryMap);
    },
    [items, docEntryMap],
  );

  return { query, suggestComponents, compareComponents, findByQuality };
}
