import type { SearchableItem } from './header-search.config';

/* ------------------------------------------------------------------ */
/*  NL Search Engine — Client-side natural language matching            */
/*                                                                     */
/*  Tokenizes query, identifies intent verbs, then scores each         */
/*  searchable item using synonym expansion + Levenshtein fuzzy match. */
/*  Pure functions — no React, no side effects.                        */
/* ------------------------------------------------------------------ */

export interface NLMatch {
  item: SearchableItem;
  score: number;
  matchReason: string;
}

/* ---- Intent verb categories (multilingual) ---- */

const INTENT_VERBS: Record<string, string[]> = {
  navigate: [
    'go', 'open', 'show', 'navigate', 'visit', 'view',
    'git', 'ac', 'goster', 'goruntule', 'gez',
    'gehen', 'offnen', 'zeigen', 'ansehen',
    'ir', 'abrir', 'mostrar', 'ver', 'navegar',
  ],
  change: [
    'change', 'switch', 'toggle', 'set',
    'degistir', 'ayarla', 'sec',
    'andern', 'wechseln', 'einstellen',
    'cambiar', 'alternar', 'configurar',
  ],
  list: [
    'list', 'all', 'browse',
    'listele', 'tum', 'hepsi',
    'auflisten', 'alle', 'durchsuchen',
    'listar', 'todos', 'explorar',
  ],
};

/* ---- Target synonyms per searchable item ID ---- */

const TARGET_SYNONYMS: Record<string, string[]> = {
  'nav-home': ['home', 'anasayfa', 'ana', 'dashboard', 'konsol', 'startseite', 'inicio'],
  'nav-suggestions': ['suggestions', 'oneriler', 'fikir', 'idea', 'vorschlage', 'sugerencias'],
  'nav-ethic': ['ethic', 'etik', 'report', 'raporlama', 'ethik', 'etica'],
  'nav-users': ['users', 'people', 'accounts', 'kullanicilar', 'kisiler', 'hesaplar', 'benutzer', 'usuarios', 'personas'],
  'nav-access': ['access', 'erisim', 'yetki', 'permission', 'izin', 'zugriff', 'acceso', 'permisos'],
  'nav-audit': ['audit', 'denetim', 'log', 'kayit', 'prufung', 'auditoria'],
  'nav-services': ['services', 'servisler', 'server', 'sunucu', 'dienste', 'servicios'],
  'report-compensation': ['compensation', 'salary', 'ucret', 'maas', 'yan', 'haklar', 'verguetung', 'gehalt', 'compensacion', 'salario'],
  'report-demographic': ['demographic', 'demografik', 'yas', 'cinsiyet', 'demografie', 'demografia'],
  'report-users': ['users', 'kullanicilar', 'genel', 'overview', 'benutzer', 'usuarios'],
  'report-access': ['access', 'erisim', 'zugriff', 'acceso'],
  'report-audit': ['audit', 'denetim', 'prufung', 'auditoria'],
  'report-monthly-login': ['login', 'giris', 'aylik', 'monthly', 'monatlich', 'mensual'],
  'report-weekly-audit': ['weekly', 'haftalik', 'digest', 'ozet', 'wochentlich', 'semanal'],
  'cmd-theme-toggle': ['theme', 'tema', 'dark', 'light', 'karanlik', 'acik', 'thema', 'dunkel', 'hell', 'tema', 'oscuro', 'claro'],
  'cmd-lang-tr': ['turkish', 'turkce', 'tr', 'turkisch', 'turco'],
  'cmd-lang-en': ['english', 'ingilizce', 'en', 'englisch', 'ingles'],
  'cmd-notifications': ['notifications', 'bildirim', 'alert', 'uyari', 'benachrichtigungen', 'notificaciones'],
  'tool-schema-explorer': ['schema', 'database', 'db', 'tablo', 'table', 'veritabani', 'datenbank', 'esquema'],
  'tool-design-lab': ['design', 'lab', 'tasarim', 'component', 'bilesen', 'labor', 'diseno', 'laboratorio'],
  'tool-themes': ['themes', 'temalar', 'palette', 'palet', 'colors', 'renkler', 'themen', 'farben', 'temas', 'colores'],
};

/* ---- Levenshtein distance ---- */

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    let prev = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(dp[j] + 1, prev + 1, dp[j - 1] + cost);
      dp[j - 1] = prev;
      prev = val;
    }
    dp[n] = prev;
  }

  return dp[n];
}

/* ---- Core matching ---- */

function isIntentVerb(token: string): boolean {
  return Object.values(INTENT_VERBS).some((verbs) => verbs.includes(token));
}

function scoreItem(tokens: string[], item: SearchableItem): { score: number; reason: string } {
  const synonyms = TARGET_SYNONYMS[item.id] ?? [];
  const allTargets = [...(item.keywords ?? []), ...synonyms].map((s) => s.toLowerCase());
  let totalScore = 0;
  let bestReason = '';

  for (const token of tokens) {
    if (isIntentVerb(token)) {
      totalScore += 2;
      continue;
    }

    // Exact match
    if (allTargets.includes(token)) {
      totalScore += 10;
      bestReason = token;
      continue;
    }

    // Prefix match (token is prefix of target or target is prefix of token)
    const prefixMatch = allTargets.find(
      (t) => t.startsWith(token) || token.startsWith(t),
    );
    if (prefixMatch) {
      totalScore += 7;
      bestReason = `${token} ~ ${prefixMatch}`;
      continue;
    }

    // Fuzzy match (Levenshtein)
    const maxDist = token.length >= 5 ? 2 : 1;
    const fuzzyMatch = allTargets.find((t) => levenshtein(token, t) <= maxDist);
    if (fuzzyMatch) {
      totalScore += 5;
      bestReason = `${token} ~ ${fuzzyMatch}`;
    }
  }

  return { score: totalScore, reason: bestReason };
}

/* ---- Public API ---- */

const SCORE_THRESHOLD = 5;
const MAX_RESULTS = 5;

export function nlSearch(
  query: string,
  items: SearchableItem[],
): NLMatch[] {
  const normalized = query.toLowerCase().trim();
  if (normalized.length < 2) return [];

  const tokens = normalized.split(/\s+/).filter((t) => t.length >= 2);
  if (tokens.length === 0) return [];

  const results: NLMatch[] = [];

  for (const item of items) {
    const { score, reason } = scoreItem(tokens, item);
    if (score >= SCORE_THRESHOLD) {
      results.push({
        item,
        score,
        matchReason: reason,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, MAX_RESULTS);
}
