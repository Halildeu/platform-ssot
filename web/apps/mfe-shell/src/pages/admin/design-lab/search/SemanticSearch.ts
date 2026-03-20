/* ------------------------------------------------------------------ */
/*  SemanticSearch — TF-IDF based natural language component search     */
/*                                                                     */
/*  Features:                                                          */
/*  - TF-IDF scoring (pure JS, no external lib)                        */
/*  - Synonym expansion (notification → alert, toast, snackbar)        */
/*  - Fuzzy matching for typos                                         */
/*  - Relevance explanation                                            */
/*                                                                     */
/*  Unique: No competitor has natural language component search.        */
/* ------------------------------------------------------------------ */

export type SemanticResult = {
  componentName: string;
  score: number;
  explanation: string;
  matchedTerms: string[];
};

/* ---- Synonym Map ---- */

const SYNONYMS: Record<string, string[]> = {
  notification: ["alert", "toast", "snackbar", "banner", "message"],
  alert: ["notification", "toast", "warning", "banner", "message"],
  toast: ["notification", "alert", "snackbar", "popup"],
  button: ["btn", "cta", "action", "submit", "trigger"],
  input: ["field", "textbox", "text-field", "entry", "textinput"],
  select: ["dropdown", "picker", "combobox", "menu", "chooser", "listbox"],
  modal: ["dialog", "popup", "overlay", "lightbox", "sheet"],
  checkbox: ["check", "tick", "toggle-check", "selector"],
  switch: ["toggle", "flipswitch", "on-off"],
  tabs: ["tabbar", "tabstrip", "navigation", "segmented"],
  pagination: ["pager", "page-nav", "page-numbers", "paginator"],
  badge: ["chip", "tag", "label", "pill", "counter"],
  avatar: ["profile-pic", "user-icon", "photo", "gravatar"],
  tooltip: ["hint", "info-tip", "hover-card", "popover-hint"],
  drawer: ["sidebar", "panel", "slide-over", "sheet"],
  divider: ["separator", "line", "hr", "rule"],
  skeleton: ["placeholder", "loading", "shimmer", "ghost"],
  popover: ["popup", "floating", "dropdown-info", "callout"],
  table: ["datatable", "grid", "data-grid", "spreadsheet"],
  form: ["input-group", "fieldset", "form-group"],
  loading: ["spinner", "loader", "progress", "skeleton"],
  card: ["tile", "panel", "container", "box"],
  accordion: ["expandable", "collapsible", "details", "disclosure"],
  breadcrumb: ["nav-path", "trail", "location"],
  stepper: ["wizard", "multi-step", "progress-steps"],
  timeline: ["history", "activity-log", "feed"],
  upload: ["file-upload", "dropzone", "file-input", "attachment"],
  color: ["colour", "hue", "swatch", "palette"],
  // Use-case synonyms
  dismissible: ["closable", "removable", "hideable"],
  sortable: ["orderable", "reorderable"],
  searchable: ["filterable", "queryable"],
  responsive: ["adaptive", "fluid", "mobile-friendly"],
  accessible: ["a11y", "wcag", "aria"],
};

/* ---- Component Document Corpus ---- */

type ComponentDoc = {
  name: string;
  terms: string[];      // All searchable terms (lowercased)
  description: string;  // Human-readable description
  useCases: string[];   // Natural language use-case descriptions
};

const CORPUS: ComponentDoc[] = [
  {
    name: "Button",
    terms: ["button", "btn", "cta", "action", "submit", "click", "primary", "secondary", "ghost", "loading", "disabled", "icon-button"],
    description: "Interactive button for triggering actions",
    useCases: ["submit a form", "trigger an action", "navigate to page", "confirm dialog", "call to action", "primary action button", "destructive action"],
  },
  {
    name: "Input",
    terms: ["input", "text-field", "textbox", "field", "entry", "type", "placeholder", "validation", "password", "email", "search-input"],
    description: "Text input field for data entry",
    useCases: ["enter text", "type username", "search bar", "password field", "email field", "form field", "user data entry"],
  },
  {
    name: "Select",
    terms: ["select", "dropdown", "picker", "combobox", "menu", "option", "choice", "listbox", "multiselect"],
    description: "Dropdown selection from predefined options",
    useCases: ["choose from list", "pick an option", "dropdown menu", "filter selection", "select country", "multi-select tags"],
  },
  {
    name: "Modal",
    terms: ["modal", "dialog", "popup", "overlay", "lightbox", "sheet", "confirm", "alert-dialog"],
    description: "Overlay dialog for focused interactions",
    useCases: ["confirm action", "show details", "edit form overlay", "warning dialog", "full-screen overlay", "blocking interaction"],
  },
  {
    name: "Alert",
    terms: ["alert", "notification", "banner", "message", "warning", "error", "info", "success", "callout", "notice"],
    description: "Status message or notification banner",
    useCases: ["show error message", "success notification", "warning banner", "info callout", "status update", "inline feedback", "form validation message"],
  },
  {
    name: "Toast",
    terms: ["toast", "snackbar", "notification", "popup", "flash", "temporary", "auto-close", "dismissible"],
    description: "Temporary notification that auto-dismisses",
    useCases: ["show brief notification", "auto-closing message", "action confirmation", "undo notification", "temporary feedback", "save confirmation"],
  },
  {
    name: "Tabs",
    terms: ["tabs", "tabbar", "navigation", "segmented", "panel-switcher", "tab-panel", "view-switcher"],
    description: "Tabbed navigation between content panels",
    useCases: ["switch between views", "organize content sections", "tabbed interface", "segmented control", "content grouping"],
  },
  {
    name: "Pagination",
    terms: ["pagination", "pager", "page-numbers", "next-prev", "paginator", "page-navigation"],
    description: "Page navigation for paginated content",
    useCases: ["navigate pages", "table pagination", "list paging", "browse results", "page through data"],
  },
  {
    name: "Checkbox",
    terms: ["checkbox", "check", "tick", "multi-select", "toggle-check", "boolean", "agree"],
    description: "Toggle a boolean value on/off",
    useCases: ["agree to terms", "select multiple items", "toggle setting", "boolean preference", "filter option", "bulk select"],
  },
  {
    name: "Switch",
    terms: ["switch", "toggle", "on-off", "flipswitch", "binary", "enabled"],
    description: "Toggle switch for binary settings",
    useCases: ["enable feature", "toggle dark mode", "on/off setting", "binary choice", "feature flag"],
  },
  {
    name: "Badge",
    terms: ["badge", "chip", "tag", "label", "pill", "counter", "status-indicator"],
    description: "Small label or status indicator",
    useCases: ["show count", "status label", "category tag", "notification count", "version label", "filter chip"],
  },
  {
    name: "Avatar",
    terms: ["avatar", "profile", "user-icon", "photo", "initials", "gravatar", "profile-picture"],
    description: "User profile image or initials",
    useCases: ["show user photo", "profile picture", "user avatar in comments", "team member", "contact image"],
  },
  {
    name: "Tooltip",
    terms: ["tooltip", "hint", "info-tip", "hover", "help-text", "description"],
    description: "Contextual hint on hover",
    useCases: ["explain icon", "show help text", "additional info on hover", "abbreviation explanation", "icon label"],
  },
  {
    name: "Divider",
    terms: ["divider", "separator", "line", "hr", "rule", "border"],
    description: "Visual separator between content sections",
    useCases: ["separate sections", "visual break", "content divider", "menu separator", "list divider"],
  },
  {
    name: "Skeleton",
    terms: ["skeleton", "placeholder", "loading", "shimmer", "ghost", "content-loader"],
    description: "Loading placeholder animation",
    useCases: ["loading state", "content placeholder", "shimmer effect", "lazy load preview", "pre-render skeleton"],
  },
  {
    name: "Drawer",
    terms: ["drawer", "sidebar", "panel", "slide-over", "sheet", "off-canvas"],
    description: "Sliding panel from screen edge",
    useCases: ["side navigation", "detail panel", "filter sidebar", "settings panel", "slide-out menu"],
  },
  {
    name: "Popover",
    terms: ["popover", "popup", "floating", "dropdown", "callout", "floating-panel"],
    description: "Floating content panel anchored to trigger",
    useCases: ["show details on click", "rich tooltip", "action menu", "user card popup", "contextual info"],
  },
  {
    name: "DataTable",
    terms: ["datatable", "table", "grid", "data-grid", "spreadsheet", "sortable", "filterable"],
    description: "Data table with sorting and filtering",
    useCases: ["display tabular data", "sortable table", "filterable list", "data grid", "spreadsheet view", "report table"],
  },
];

/* ---- TF-IDF Engine ---- */

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function expandWithSynonyms(tokens: string[]): string[] {
  const expanded = new Set(tokens);
  tokens.forEach((token) => {
    const syns = SYNONYMS[token];
    if (syns) {
      syns.forEach((s) => expanded.add(s));
    }
    // Also check if token is a synonym value
    Object.entries(SYNONYMS).forEach(([key, values]) => {
      if (values.includes(token)) {
        expanded.add(key);
      }
    });
  });
  return Array.from(expanded);
}

function fuzzyMatch(query: string, target: string): boolean {
  if (target.includes(query) || query.includes(target)) return true;
  // Simple Levenshtein distance check for short tokens
  if (query.length < 3 || target.length < 3) return false;
  const maxDist = Math.floor(Math.max(query.length, target.length) * 0.3);
  return levenshtein(query, target) <= maxDist;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// IDF: log(N / df) where df = number of docs containing term
function computeIDF(term: string): number {
  const N = CORPUS.length;
  let df = 0;
  CORPUS.forEach((doc) => {
    const allTerms = [...doc.terms, ...tokenize(doc.description), ...doc.useCases.flatMap(tokenize)];
    if (allTerms.some((t) => t.includes(term) || fuzzyMatch(term, t))) {
      df++;
    }
  });
  return df > 0 ? Math.log(N / df) + 1 : 0;
}

function scoreDocument(doc: ComponentDoc, queryTokens: string[], expandedTokens: string[]): { score: number; matched: string[]; explanation: string } {
  const allDocTerms = [...doc.terms, ...tokenize(doc.description), ...doc.useCases.flatMap(tokenize)];
  let score = 0;
  const matched: string[] = [];
  const reasons: string[] = [];

  expandedTokens.forEach((qToken) => {
    // Direct term match
    const directMatch = doc.terms.some((t) => t.includes(qToken) || fuzzyMatch(qToken, t));
    if (directMatch) {
      const idf = computeIDF(qToken);
      const isOriginal = queryTokens.includes(qToken);
      const weight = isOriginal ? 3 : 1.5; // Original terms weighted more
      score += idf * weight;
      matched.push(qToken);
      if (isOriginal) reasons.push(`matches "${qToken}" in component terms`);
    }

    // Use-case match (higher signal)
    const useCaseMatch = doc.useCases.some((uc) => {
      const ucTokens = tokenize(uc);
      return ucTokens.some((t) => t.includes(qToken) || fuzzyMatch(qToken, t));
    });
    if (useCaseMatch) {
      const idf = computeIDF(qToken);
      const isOriginal = queryTokens.includes(qToken);
      score += idf * (isOriginal ? 4 : 2);
      if (!matched.includes(qToken)) matched.push(qToken);
      if (isOriginal) reasons.push(`use-case match for "${qToken}"`);
    }

    // Description match
    const descTokens = tokenize(doc.description);
    const descMatch = descTokens.some((t) => t.includes(qToken) || fuzzyMatch(qToken, t));
    if (descMatch) {
      score += computeIDF(qToken) * 1.5;
      if (!matched.includes(qToken)) matched.push(qToken);
    }
  });

  // Bonus for name match
  const nameMatch = queryTokens.some((t) => doc.name.toLowerCase().includes(t));
  if (nameMatch) {
    score *= 1.5;
    reasons.unshift("name match");
  }

  const explanation = reasons.length > 0
    ? reasons.slice(0, 3).join(", ")
    : matched.length > 0
      ? `related terms: ${matched.slice(0, 3).join(", ")}`
      : "";

  return { score, matched, explanation };
}

/* ---- Public API ---- */

export function semanticSearch(query: string, maxResults = 8): SemanticResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const expandedTokens = expandWithSynonyms(queryTokens);

  const results: SemanticResult[] = CORPUS.map((doc) => {
    const { score, matched, explanation } = scoreDocument(doc, queryTokens, expandedTokens);
    return {
      componentName: doc.name,
      score,
      explanation,
      matchedTerms: matched,
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  // Normalize scores to 0-100
  const maxScore = results[0]?.score ?? 1;
  results.forEach((r) => {
    r.score = Math.round((r.score / maxScore) * 100);
  });

  return results;
}

export function getSearchSuggestions(): string[] {
  return [
    "dismissible notification that auto-closes",
    "data entry with validation",
    "confirm before destructive action",
    "loading placeholder while fetching",
    "choose one option from list",
    "toggle feature on or off",
    "show additional info on hover",
    "tabbed content navigation",
    "paginated data table",
    "sliding panel from side",
  ];
}
