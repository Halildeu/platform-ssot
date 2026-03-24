/* ------------------------------------------------------------------ */
/*  Guide Registry — Structured narrative guides per component          */
/*                                                                     */
/*  Each guide contains sections: overview, when-to-use, anatomy,      */
/*  best-practices, accessibility, related-components, anti-patterns    */
/*                                                                     */
/*  Inspired by: AntD "When to Use" + Storybook MDX + Shadcn docs     */
/*  Surpasses with: structured anatomy, anti-patterns, live demos      */
/* ------------------------------------------------------------------ */

export type GuideSection = {
  id: string;
  title: string;
  icon?: string;
  content: string;
  /** Optional component name for inline demo */
  demoProps?: Record<string, unknown>;
};

export type ComponentGuide = {
  componentName: string;
  summary: string;
  sections: GuideSection[];
  relatedComponents?: string[];
};

/* ---- Curated guides ---- */

const _guides: Record<string, ComponentGuide> = {
  Button: {
    componentName: "Button",
    summary: "Buttons trigger actions, submit forms, and navigate between states. They are the primary interactive element in any interface.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Button is the most fundamental interactive element. It communicates actions that users can take and allows them to interact with the interface.

Our Button supports multiple variants (primary, secondary, ghost), sizes (sm, md, lg), loading states, and icon composition. It is built on native \`<button>\` semantics for full accessibility.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Button when:**
- Triggering an action (save, delete, submit)
- Confirming a user decision in a dialog
- Starting a new workflow or process
- Toggling between states (with visual feedback)

**Do NOT use Button when:**
- Navigating to a different page → Use \`Link\` or \`NavLink\` instead
- Selecting from a list of options → Use \`Select\` or \`RadioGroup\`
- Toggling a boolean setting → Use \`Switch\` or \`Checkbox\`
- Showing more information → Use \`Accordion\` or \`Tooltip\``,
      },
      {
        id: "anatomy",
        title: "Anatomy",
        icon: "🔬",
        content: `A Button consists of these parts:

\`\`\`
┌──────────────────────────────────┐
│  [Icon?]  [Label]  [Loader?]    │
│  ← leading    trailing →        │
└──────────────────────────────────┘
\`\`\`

1. **Container** — The clickable area with padding, border-radius, and background
2. **Label** — The text content describing the action
3. **Leading Icon** (optional) — An icon before the label for visual context
4. **Trailing Element** (optional) — Loading spinner or trailing icon
5. **Focus Ring** — Visible on keyboard focus for accessibility`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Hierarchy:** Use only one Primary button per section. Secondary and Ghost for lesser actions.

**Labeling:** Use action verbs — "Save Changes" not "OK". Be specific about the outcome.

**Loading:** Always show loading state for async actions. Disable the button during loading to prevent double-submit.

**Sizing:** Use \`md\` (default) for most cases. \`sm\` for dense UIs (tables, toolbars). \`lg\` for hero CTAs.

**Grouping:** Place primary action on the right. Cancel/secondary on the left. Maintain consistent spacing with \`gap-2\`.

**Disabled state:** Don't rely solely on disabled state — add a tooltip explaining WHY it's disabled.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patterns",
        icon: "🚫",
        content: `**❌ Multiple primary buttons in the same section**
Users can't determine the main action.

**❌ Vague labels like "OK", "Click Here", "Submit"**
Users should know what will happen before they click.

**❌ Disabled button without explanation**
Users see a button they can't use but don't know why. Add a tooltip.

**❌ Using Button for navigation**
Screen readers announce different roles. Use \`<a>\` or \`Link\` for navigation.

**❌ Buttons that look like links**
Ghost buttons should still have button affordance (padding, hover state).`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Keyboard:** Fully accessible via Tab (focus) and Enter/Space (activate).

**Screen Readers:** Uses native \`<button>\` element. Add \`aria-label\` when using icon-only buttons.

**Focus Management:** Visible focus ring follows WCAG 2.1 AA contrast requirements.

**Disabled:** Uses \`aria-disabled\` to maintain focus for assistive technology while preventing activation.

**Loading:** Announces loading state to screen readers via \`aria-busy="true"\`.

**Color Contrast:** All variants meet WCAG 2.1 AA minimum contrast ratio (4.5:1 for text).`,
      },
    ],
    relatedComponents: ["IconButton", "Link", "ButtonGroup", "ToggleButton"],
  },

  Input: {
    componentName: "Input",
    summary: "Input captures user text. It supports labels, help text, validation, and various input types.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Input is a controlled or uncontrolled text field. It wraps native \`<input>\` with consistent styling, label management, error states, and helper text.

Supports all HTML input types: text, email, password, number, tel, url, search.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Input when:**
- Collecting free-text information (names, emails, passwords)
- A short, single-line text entry is needed
- Searching or filtering content

**Do NOT use Input when:**
- Multi-line text is expected → Use \`Textarea\`
- Selecting from predefined options → Use \`Select\`, \`RadioGroup\`, or \`Combobox\`
- A date/time value is needed → Use \`DatePicker\`
- Rich text formatting → Use a rich text editor`,
      },
      {
        id: "anatomy",
        title: "Anatomy",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────┐
│  [Prefix?]  [Value]  [Suffix?]  │
└──────────────────────────────────┘
  Helper text / Error message
\`\`\`

1. **Label** — Describes what to enter (above the field)
2. **Input Container** — Border, padding, focus ring
3. **Prefix** (optional) — Icon or text before the value
4. **Suffix** (optional) — Icon, clear button, or unit label
5. **Helper Text** — Additional context below the field
6. **Error Message** — Validation feedback replacing helper text`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Always provide a label.** Even if visually hidden, use \`aria-label\` for screen readers.

**Use placeholder as hint, not label.** Placeholder disappears on typing and fails accessibility.

**Show error messages inline.** Don't use alerts or toasts for field validation — show the error directly below.

**Match input type to data.** Use \`type="email"\` for emails — mobile keyboards show @ key.

**Consider autocomplete.** Use \`autoComplete\` for common fields (name, email, address) to reduce friction.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Label Association:** Always link label to input via \`htmlFor\` / \`id\` pair.

**Error Announcement:** Error messages are associated via \`aria-describedby\` for screen reader announcement.

**Required Fields:** Mark required fields with \`aria-required="true"\` and a visual indicator.

**Focus:** Clear focus indicator that meets WCAG 2.1 AA contrast requirements.`,
      },
    ],
    relatedComponents: ["Textarea", "Select", "Combobox", "SearchInput"],
  },

  Select: {
    componentName: "Select",
    summary: "Select allows users to choose from a predefined list of options in a dropdown.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Select provides a dropdown menu for choosing a single value from a list. It's built with proper ARIA patterns and keyboard navigation.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Select when:**
- Choosing from 5+ predefined options
- Space is limited (compared to RadioGroup)
- Only one selection is needed

**Do NOT use Select when:**
- Less than 5 options → Use \`RadioGroup\` for visibility
- Multiple selections needed → Use \`Checkbox\` group or \`MultiSelect\`
- User should search/filter → Use \`Combobox\`
- Just two options (on/off) → Use \`Switch\``,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Provide a placeholder.** "Select an option..." guides the user.

**Order options logically.** Alphabetical, most common first, or by natural order.

**Keep option labels short.** Long labels truncate and are hard to scan.

**Use grouping for 10+ options.** Group with \`OptGroup\` for easier scanning.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Keyboard Navigation:** Arrow keys to navigate options, Enter to select, Escape to close.

**Screen Reader:** Announces selected value, number of options, and group labels.

**Focus Management:** Focus returns to trigger after selection.`,
      },
    ],
    relatedComponents: ["Combobox", "MultiSelect", "RadioGroup"],
  },

  Alert: {
    componentName: "Alert",
    summary: "Alert displays contextual feedback messages with severity levels.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Alert communicates important information to the user. It supports four severity levels: info, success, warning, and error. Each level has a distinct color and icon.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Alert when:**
- Showing operation result feedback (success/failure)
- Warning before a destructive action
- Displaying important but non-blocking information
- System-level status messages

**Do NOT use Alert when:**
- Brief, auto-dismissing feedback → Use \`Toast\`
- Inline field validation → Use Input error state
- Blocking user interaction → Use \`Dialog\`
- Real-time notifications → Use notification system`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Be concise.** One or two sentences max. Link to details if needed.

**Use correct severity.** Don't use "error" for warnings — it causes alarm fatigue.

**Provide actionable content.** Tell users what to DO, not just what happened.

**Position consistently.** Top of page/section for page-level, inline for contextual.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**ARIA Role:** Uses \`role="alert"\` for error/warning, \`role="status"\` for info/success.

**Live Region:** Dynamically added alerts are announced by screen readers.

**Dismiss:** Dismissible alerts maintain focus on close button, then return focus to logical place.`,
      },
    ],
    relatedComponents: ["Toast", "Banner", "Callout"],
  },

  Modal: {
    componentName: "Modal",
    summary: "Modal presents content in a layer above the page, requiring user interaction before returning.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Modal (Dialog) creates a focused task overlay. It dims the background, traps focus, and prevents interaction with page content until dismissed.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Modal when:**
- Confirming a destructive action (delete, discard)
- Complex input that doesn't warrant a full page
- Displaying critical information requiring acknowledgment
- Short creation/edit workflows (< 5 fields)

**Do NOT use Modal when:**
- Simple yes/no confirmation → Use inline \`Alert\` or \`Popover\`
- Long forms (6+ fields) → Use a full page or \`Drawer\`
- Informational content → Use \`Tooltip\` or \`Popover\`
- Nested modals → Redesign the flow instead`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Keep it focused.** One task per modal. Don't cram a full page into it.

**Always provide a close mechanism.** X button, Cancel button, and Escape key.

**Don't open modals from modals.** This creates disorienting stacking. Redesign the flow.

**Use descriptive titles.** "Delete Project?" not "Confirm".`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Focus Trap:** Focus cycles within the modal. Tab wraps from last to first focusable element.

**Escape Key:** Closes the modal and returns focus to the trigger element.

**ARIA:** Uses \`role="dialog"\`, \`aria-modal="true"\`, and \`aria-labelledby\` pointing to the title.

**Scroll Lock:** Background scroll is disabled when modal is open.`,
      },
    ],
    relatedComponents: ["Dialog", "Drawer", "Popover", "Sheet"],
  },

  Pagination: {
    componentName: "Pagination",
    summary: "Pagination enables navigation across multiple pages of content.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Pagination splits content into discrete pages and provides navigation controls. It supports page numbers, prev/next buttons, and optional page size selector.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Pagination when:**
- Data set has 50+ items
- Server-side data loading (API pagination)
- User needs to see total count or jump to specific page

**Do NOT use Pagination when:**
- Small data sets (< 50 items) → Show all items
- Continuous content (social feed) → Use infinite scroll
- Content should load progressively → Use "Load More" button`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Show total count.** Users need context about how much content exists.

**Maintain scroll position.** After page change, scroll to top of the list.

**Show page size selector** when users might want to control density.

**Truncate intelligently.** Show first, last, and nearby pages with ellipsis.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**ARIA Navigation:** Wrapped in \`nav\` with \`aria-label="Pagination"\`.

**Current Page:** Active page marked with \`aria-current="page"\`.

**Keyboard:** All controls are focusable and activatable via Enter/Space.`,
      },
    ],
    relatedComponents: ["Table", "List", "InfiniteScroll"],
  },

  Checkbox: {
    componentName: "Checkbox",
    summary: "Checkbox allows users to select one or more items from a set, or toggle a boolean option.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Checkbox is a dual-state control (checked/unchecked) with optional indeterminate state. It supports labels, descriptions, and grouping.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Checkbox when:**
- Multiple selections from a list
- Toggling a boolean preference
- Accepting terms and conditions
- Selecting table rows

**Do NOT use Checkbox when:**
- Mutually exclusive options → Use \`RadioGroup\`
- Immediate effect toggle → Use \`Switch\`
- Only two options and one must be chosen → Use \`RadioGroup\``,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Use positive labels.** "Show notifications" not "Don't hide notifications".

**Group related checkboxes.** Use fieldset + legend for accessible grouping.

**Indeterminate state** for parent checkboxes in tree structures (some children selected).

**Don't use as action triggers.** Checkboxes set state; use Buttons to trigger actions.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Label:** Every checkbox must have an associated label (visible or aria-label).

**Group:** Related checkboxes should be in a \`fieldset\` with a \`legend\`.

**Keyboard:** Space key toggles the checkbox. Tab navigates between checkboxes.

**Indeterminate:** Use \`aria-checked="mixed"\` for the indeterminate state.`,
      },
    ],
    relatedComponents: ["Switch", "RadioGroup", "CheckboxGroup"],
  },

  Tabs: {
    componentName: "Tabs",
    summary: "Tabs organize content into separate views where only one is visible at a time.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Tabs organize related content into distinct panels that share a common context. Only one panel is visible at a time, reducing cognitive load.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Tabs when:**
- Content can be logically grouped into 2-7 categories
- Users need to switch between views without losing context
- Each tab contains different types of information about the same entity

**Do NOT use Tabs when:**
- Sequential process → Use \`Stepper\`
- More than 7 tabs → Use navigation or \`Select\`
- Content should be visible simultaneously → Use \`Accordion\`
- Navigating to different pages → Use navigation/routing`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Keep tab labels short.** 1-2 words max. Use icons for clarity.

**Order by priority.** Most-used tab first (default active).

**Don't nest tabs.** Creates confusion. Use another pattern.

**Persistent state.** Maintain content state when switching tabs (don't refetch).`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**ARIA Roles:** \`tablist\`, \`tab\`, \`tabpanel\` roles with proper associations.

**Keyboard:** Arrow keys move between tabs, Enter/Space activates. Home/End for first/last.

**Focus Management:** Only the active tab is in the tab order. Panels are associated via \`aria-labelledby\`.`,
      },
    ],
    relatedComponents: ["Accordion", "Stepper", "SegmentedControl"],
  },

  Toast: {
    componentName: "Toast",
    summary: "Toast shows brief, auto-dismissing feedback messages that don't interrupt the user's workflow.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        icon: "📖",
        content: `Toast (Snackbar) displays temporary messages at the edge of the screen. Messages auto-dismiss after a timeout and can optionally include an action button.`,
      },
      {
        id: "when-to-use",
        title: "When to Use",
        icon: "✅",
        content: `**Use Toast when:**
- Confirming a completed action ("Saved successfully")
- Showing non-critical information
- Providing undo opportunity for reversible actions
- Brief status updates

**Do NOT use Toast when:**
- Critical errors requiring action → Use \`Alert\` or \`Dialog\`
- Persistent information → Use \`Alert\` (inline)
- Multiple messages at once → Use notification center
- Field validation → Use inline error states`,
      },
      {
        id: "best-practices",
        title: "Best Practices",
        icon: "💡",
        content: `**Keep it brief.** Under 2 lines. Users glance, not read.

**Auto-dismiss timing.** 4-5 seconds for informational, longer for errors with actions.

**Limit to one at a time.** Stack max 3, oldest dismissed first.

**Position consistently.** Bottom-right or top-center. Be consistent across the app.`,
      },
      {
        id: "accessibility",
        title: "Accessibility",
        icon: "♿",
        content: `**Live Region:** Uses \`role="status"\` and \`aria-live="polite"\` for non-urgent, \`aria-live="assertive"\` for errors.

**Pause Timer:** Timer pauses on hover/focus so users have time to read.

**Action Button:** If an action is provided, it must be keyboard-accessible.`,
      },
    ],
    relatedComponents: ["Alert", "Notification", "Snackbar"],
  },
  SearchFilterListing: {
    componentName: "SearchFilterListing",
    summary: "Arama, filtreleme, siralama, toplu secim ve sonuc listeleme islemlerini tek bir recipe kompozisyonunda birlestiren ust duzey sayfa bloku. PageHeader, FilterBar, FilterChips, SelectionBar, SortDropdown, SummaryStrip ve sonuc yuzeyini dikey bir akista birlestirir. Yukleme iskeleti, compact mod, dark mode ve zengin ARIA destegi sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SearchFilterListing, karmasik liste sayfalarini standart bir yapiya oturtan bir **recipe bileseni**dir. Yedi ana katmandan olusur:

1. **PageHeader** — baslik, eyebrow, aciklama, meta bilgisi, durum badge'i ve aksiyonlar
2. **FilterBar + Toolbar** — arama, select ve diger filtre kontrolleri; sag tarafa toolbar ve reload aksiyonlari
3. **FilterChips** — aktif filtre chip'leri; tek tek kaldirilabilir veya toplu temizlenebilir
4. **SelectionBar** — secili oge sayisi, toplu aksiyon butonlari ve secimi temizleme
5. **SummaryStrip** — KPI kartlari (toplam, aktif, bekleyen gibi sayisal ozetler)
6. **SortDropdown** — siralama alani secimi ve yon degistirme (artan/azalan)
7. **Result Surface** — items listesi, ozel results renderer, totalCount badge'i veya contextual empty state

Her katman opsiyoneldir; yalnizca verilen prop'lara gore render edilir. \`access\` prop'u ile policy-temelli gorunurluk ve etkilesim kontrolu saglanir. Tum renkler CSS degiskenleri uzerinden tanimlanir ve **dark mode** uyumludur.

\`\`\`tsx
import { SearchFilterListing } from '@mfe/design-system';

// Tam ozellikli kullanim ornegi
<SearchFilterListing
  eyebrow="Envanter"
  title="Urun Listesi"
  description="Tum urunleri arayin, filtreleyin ve yonetin."
  actions={<Button>Yeni Urun</Button>}
  filters={<>
    <Input placeholder="Ara..." />
    <Select options={kategoriler} />
  </>}
  toolbar={<DensityToggle />}
  onReload={() => refetch()}
  activeFilters={[
    { key: "kategori", label: "Kategori", value: "Elektronik", onRemove: () => removeFilter("kategori") },
    { key: "durum", label: "Durum", value: "Aktif", onRemove: () => removeFilter("durum") },
  ]}
  onClearAllFilters={() => clearAllFilters()}
  sortOptions={[
    { key: "ad", label: "Urun Adi" },
    { key: "fiyat", label: "Fiyat" },
    { key: "tarih", label: "Eklenme Tarihi" },
  ]}
  activeSort={{ key: "tarih", direction: "desc" }}
  onSortChange={(key, direction) => setSort({ key, direction })}
  selectable
  selectedKeys={selectedIds}
  onSelectionChange={setSelectedIds}
  batchActions={<>
    <Button variant="danger" onClick={handleBulkDelete}>Sil</Button>
    <Button onClick={handleBulkExport}>Disa Aktar</Button>
  </>}
  totalCount={142}
  summaryItems={kpiItems}
  items={urunKartlari}
  loading={isLoading}
  size="compact"
  aria-label="Urun envanter listesi"
  role="region"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Politika envanteri, kullanici listesi veya varlik katalogu gibi **arama + filtre + sonuc** akisi gerektiren sayfalarda
- Ops triage kuyruklari, review handoff listeleri gibi operasyonel gorunumlerde
- Kaydedilmis gorunum kutuphanesi veya rapor filtreleme panellerinde
- Birden fazla KPI ozeti ve sonuc listesinin ayni sayfada gosterilmesi gerektiginde
- **Toplu islem gerektiren listelerde** — birden fazla ogeyi secip silme, disa aktarma veya durum guncelleme gibi batch aksiyon senaryolarinda
- **Siralanabilir sonuc listeleri** icin — fiyata, tarihe veya ada gore siralama gereken envanter, katalog veya raporlama sayfalarinda
- **Filtrelenmis envanter gorunumleri** icin — kullanicinin hangi filtreleri uyguladigini chip'lerle gormesi ve hizlica kaldirmasi gereken sayfalarda
- **Yogun veri listeleri** icin — \`size="compact"\` ile daha fazla veriyi ekrana sigdirmaniz gereken operasyonel panellerde

**Kullanmayin:**
- Tek bir veri tablosu yeterliyse — bunun yerine \`TableSimple\` veya \`AgGridServer\` kullanin
- Dashboard tarzinda birden fazla bagimsiz bolum varsa — bunun yerine \`PageLayout\` kullanin
- Detay/duzenleme formlari icin — bunun yerine \`DetailSummary\` veya \`FormDrawer\` kullanin
- Yalnizca filtre paneli gerekiyorsa — bunun yerine \`ReportFilterPanel\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `Bilesen yedi dikey katmandan olusur. Her katman bir \`panelClass\` ile sarmalanir:

\`\`\`
┌──────────────────────────────────────────────────┐
│  [eyebrow]                                       │
│  [title]                      [meta] [status]    │
│  [description]                       [actions]   │
│                          ← PageHeader            │
├──────────────────────────────────────────────────┤
│  ╔ FilterBar + Toolbar Panel ════════════════╗   │
│  ║ [filters...]    [filterExtra] │ [reload]  ║   │
│  ║                               │ [toolbar] ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ FilterChips ══════════════════════════════╗   │
│  ║ [Kategori: X ✕] [Durum: Y ✕] [Tumunu     ║   │
│  ║                                temizle]   ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ SelectionBar ═════════════════════════════╗   │
│  ║ (3) 3 oge secildi   [Sil] [Disa Aktar]   ║   │
│  ║                        [Secimi temizle]   ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ SummaryStrip Panel ═══════════════════════╗   │
│  ║ [KPI 1]    [KPI 2]    [KPI 3]            ║   │
│  ╚═══════════════════════════════════════════╝   │
├──────────────────────────────────────────────────┤
│  ╔ Results Panel ════════════════════════════╗   │
│  ║ [listTitle]    [SortDropdown] [142 sonuc] ║   │
│  ║ [listDescription]                         ║   │
│  ║ [item 1]                                  ║   │
│  ║ [item 2]                                  ║   │
│  ║ [item 3]                                  ║   │
│  ║ — veya —                                  ║   │
│  ║ [results: ozel renderer]                  ║   │
│  ║ — veya —                                  ║   │
│  ║ [Contextual Empty State]                  ║   │
│  ╚═══════════════════════════════════════════╝   │
└──────────────────────────────────────────────────┘
\`\`\`

**Alt Bilesenler (Sub-components):**

- **FilterChips** — \`activeFilters\` prop'u ile render edilir. Her chip \`label: value\` formatinda gosterilir ve \`onRemove\` ile tek tek kaldirilabilir. Birden fazla filtre varken \`onClearAllFilters\` ile "Tumunu temizle" butonu gosterilir. \`role="status"\` ve \`aria-label\` ile erisimli.
- **SelectionBar** — \`selectable\` ve \`selectedKeys\` aktifken render edilir. Secili oge sayisini badge olarak gosterir, \`batchActions\` slot'u ile toplu aksiyon butonlari ve "Secimi temizle" butonu icerir. \`role="status"\` ve \`aria-live="polite"\` ile canli duyuru saglar.
- **SortDropdown** — \`sortOptions\` prop'u ile render edilir. Bir \`<select>\` ve yon degistirme butonu (artan/azalan) icerir. \`aria-label="Siralama"\` ile erisimli.

**Stil & Mod:**
- **Panel stili:** \`rounded-[28px]\` kenar yuvarlama, \`backdrop-blur\` efekti, gradient arkaplan ve golge
- **size="compact"** ile padding ve bosluklar azaltilir; FilterChips ve SelectionBar da compact moda uyum saglar
- **loading=true** ile tum katmanlar pulse animasyonlu iskelet placeholder olarak gosterilir
- **Dark mode:** Tum renkler \`var(--surface-card)\`, \`var(--text-primary)\`, \`var(--border-subtle)\` gibi CSS degiskenleriyle tanimlanir
- **totalCount:** Sonuc paneli ust satirinda \`{n} sonuc\` badge'i olarak gosterilir
- **Contextual empty state:** \`activeFilters\` varken bos sonuc durumunda "Bu filtre kombinasyonu icin sonuc bulunamadi" mesaji ve "Filtreleri temizle" butonu gosterilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**1. Her zaman \`emptyStateLabel\` saglayin**
Kullanici filtreleri uygulayip sonuc bulamadiginda anlamli bir mesaj gormeli. Aktif filtre varken otomatik olarak contextual empty state gosterilir; ancak filtresiz durum icin \`emptyStateLabel\` ile ozel mesaj verin.

**2. \`summaryItems\` ile KPI ozeti ekleyin**
3 veya daha az KPI karti ekleyin: toplam, aktif, bekleyen gibi temel metrikler. Fazla KPI karti gorsel karisikliga neden olur.

**3. Filtre sayisini sinirli tutun**
FilterBar icinde 5-7 filtre kontrolu optimum sayidir. Daha fazla filtre gerekiyorsa \`ReportFilterPanel\` ile alt gruplama yapin.

**4. \`access\` prop'unu policy-temelli kontrol icin kullanin**
\`access="readonly"\` ile gosterim-only modu, \`access="disabled"\` ile devre disi modu, \`access="hidden"\` ile tamamen gizleme saglanir.

**5. \`results\` prop'unu ozel yuzeyler icin kullanin**
Grafik, harita veya ozel kart grid'i gibi standart liste disinda bir icerik gerektiginde \`results\` prop'u ile kendi bileseninizi render edin.

**6. \`loading\` prop'unu veri cekme sirasinda kullanin**
API cagirisi devam ederken \`loading={true}\` ile iskelet placeholder gosterin. Kullanici sayfanin yuklendigini anlar.

**7. \`activeFilters\` ile uygulanmis filtreleri her zaman gosterin**
Kullanicinin hangi filtrelerin aktif oldugunu bilmesi UX acisindan kritiktir. FilterBar'daki kontroller ile \`activeFilters\` chip'lerini senkron tutun:

\`\`\`tsx
activeFilters={Object.entries(filters)
  .filter(([, v]) => v)
  .map(([key, value]) => ({
    key,
    label: filterLabels[key],
    value: String(value),
    onRemove: () => removeFilter(key),
  }))
}
\`\`\`

**8. Toplu aksiyonlari dikkatli tasarlayin**
\`batchActions\` icinde yikici aksiyonlari (silme gibi) onay dialog'u ile koruma altina alin. Secim sayisini kullaniciya her zaman gosterin.

**9. \`totalCount\` ile sonuc sayisini bildirin**
Ozellikle sayfalamali listelerde toplam sonuc sayisini gostermek kullaniciya baglamsal bilgi saglar.

**10. Compact modu yogun operasyonel panellerde kullanin**
\`size="compact"\` yalnizca deneyimli kullanicilar icin operasyonel gorunumlerde kullanin. Son kullaniciya yonelik sayfalarda varsayilan boyutu tercih edin.

**11. Toolbar ve reload'u birlikte kullanin**
\`onReload\` verildiginde otomatik olarak reload ikonu gosterilir. Ek toolbar aksiyonlari (\`toolbar\` prop'u) ile yogunluk degistirici, disa aktarma butonu gibi kontroller ekleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**1. SearchFilterListing icinde SearchFilterListing kullanmayin**
Ic ice recipe bilesenleri gorsel karisikliga ve mantiksal hataya neden olur. Tek bir seviyede kullanin.

**2. Detay sayfalarinda kullanmayin**
Bu bilesen liste/arama sayfalari icindir. Tekil kayit detaylari icin \`DetailSummary\` kullanin.

**3. \`items\` ve \`results\` prop'unu ayni anda vermeyin**
\`results\` verildiginde \`items\` tamamen yoksayilir. Karisiklik onlemek icin yalnizca birini kullanin.

**4. SummaryStrip'i 4'ten fazla KPI ile sismirmeyin**
Dorten fazla KPI karti gorsel yogunluk yaratir ve mobilde tasma yaratir. 3 KPI optimal sayidir.

**5. Filtreleri FilterBar disinda render etmeyin**
Tum filtre kontrolleri \`filters\` prop'u uzerinden FilterBar icerisine yerlestirilmelidir. Dis filtreleme tutarsiz davranis yaratir.

**6. \`activeFilters\` ile FilterBar state'ini senkronsuz birakmayin**
FilterBar'daki kontrolleri guncelleyip \`activeFilters\` chip'lerini guncellememek kullanicida karisiklik yaratir. Her iki kaynak tek bir state'den turetilmelidir.

**7. Secim modunu gereksiz yere etkinlestirmeyin**
\`selectable\` prop'unu yalnizca toplu islem senaryolari icin kullanin. Secilecek bir aksiyon yokken secim modu gereksiz karmasiklik yaratir:

\`\`\`tsx
// YANLIS: batchActions olmadan selectable
<SearchFilterListing selectable items={items} />

// DOGRU: batchActions ile birlikte
<SearchFilterListing
  selectable
  selectedKeys={selected}
  onSelectionChange={setSelected}
  batchActions={<Button onClick={handleDelete}>Secilenleri Sil</Button>}
  items={items}
/>
\`\`\`

**8. Sort state'ini kontrolsuz birakmayin**
\`sortOptions\` verip \`activeSort\` ve \`onSortChange\` vermemek, siralama dropdown'unun calismayan bir goruntuye donusmesine neden olur. Her uc prop'u birlikte saglayin.

**9. \`loading\` durumunda eski veriyi gostermeyin**
\`loading={true}\` oldugunda bilesen otomatik olarak iskelet gosterir. Eski \`items\` verisini ayni anda gondermenize gerek yoktur; bilesen \`loading\` onceliklidir.

**10. Compact modu son kullanici arayuzlerinde kullanmayin**
\`size="compact"\` daha yogun bir layout sunar ve deneyimsiz kullanicilarda okuma zorlugu yaratabilir. Standart modu tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik Yapi:** Kok eleman \`<section>\` olarak render edilir. \`aria-label\` prop'u ile ekran okuyuculara bilesen amacini aciklayin. \`role\` prop'u ile ozel ARIA rolu atanabilir (ornegin \`role="region"\`).

\`\`\`tsx
<SearchFilterListing
  aria-label="Urun envanter listesi"
  role="region"
  // ...
/>
\`\`\`

**Yukleniyor Durumu:** \`loading={true}\` durumunda kok elemana \`aria-busy="true"\` atanir. Ekran okuyucular icerigin yuklenmekte oldugunu duyurur ve kullaniciyi bekletir.

**Erisim Kontrolu:** \`access\` prop'u \`AccessControlledProps\` sistemini kullanir:
- \`full\`: Tam etkilesim
- \`readonly\`: Salt okunur gorunum, etkilesim engellenir
- \`disabled\`: Devre disi gorunum
- \`hidden\`: DOM'dan tamamen kaldirilir

**FilterChips Erisilebilirlik:**
- Chip grubu \`role="status"\` ve \`aria-label="{n} aktif filtre"\` ile isaretlenir
- Her chip'in kaldir butonunda \`aria-label="{label} filtresini kaldir"\` bulunur
- Chip'ler arasinda Tab ile gezinilir; Enter veya Space ile kaldirilir

**SelectionBar Erisilebilirlik:**
- \`role="status"\` ve \`aria-live="polite"\` ile isaretlenir
- Secim degistiginde ekran okuyucu otomatik olarak "{n} oge secildi" duyurusunu yapar
- Toplu aksiyon butonlari ve "Secimi temizle" butonu Tab sirasi ile erisilebilir

**SortDropdown Erisilebilirlik:**
- \`<select>\` elemani \`aria-label="Siralama"\` ile isaretlenir
- Yon degistirme butonu \`aria-label="Azalan sirala"\` veya \`aria-label="Artan sirala"\` ile dinamik olarak guncellenir
- Klavye ile: Tab ile odaklanma, Space/Enter ile acma, ok tuslari ile secenek degistirme

**Bos Durum:** Empty bileseni \`role="status"\` ile asistan teknolojilere "sonuc yok" bilgisini iletir. Aktif filtre varken contextual empty state "Filtreleri temizle" butonunu Tab sirasi ile sunar.

**Klavye Navigasyonu:** Tum etkilesimli elemanlar (filtre chip'leri, secim temizle, sort dropdown, reload butonu, batch aksiyon butonlari) Tab sirasi ile erisilebilir ve Enter/Space ile etkinlestirilebilir. Dogal tab akisi korunur:
FilterBar kontrolleri → Toolbar/Reload → FilterChips → SelectionBar → SortDropdown → Sonuc listesi

**Focus Yonetimi:** Filtre sifirlandiginda, chip kaldirildiginda veya secim temizlendiginde focus kontrol kaybetmez. Kullanici aksiyondan sonra mantiksal bir sonraki elemana focus tasinir.`,
      },
    ],
    relatedComponents: ["PageHeader", "FilterBar", "SummaryStrip", "Empty", "ReportFilterPanel"],
  },

  Avatar: {
    componentName: "Avatar",
    summary: "Avatar, kullanicilari veya varliklari gorsel, bas harf veya ikon ile temsil eden bir kimlik gostergesidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Avatar, bir kullaniciyi veya varligi gorsel olarak temsil eder. Uc fallback katmani sunar: **resim**, **bas harfler** ve **ikon**.

Resim yuklenemediginde otomatik olarak \`initials\` veya varsayilan kullanici ikonuna duser. Alti farkli boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`, \`2xl\`) ve iki sekil (\`circle\`, \`square\`) destekler.

\`\`\`tsx
<Avatar src="/avatar.jpg" alt="Ahmet Yilmaz" size="lg" />
<Avatar initials="AY" size="md" shape="circle" />
<Avatar icon={<UserIcon />} size="sm" shape="square" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kullanici profil resimlerini gostermek icin (navbar, yorum listesi, ekip karti)
- Tablo satirlarinda kullanici/varlik temsili icin
- Chat veya mesajlasma arayuzlerinde gonderen kimligini belirtmek icin
- Kullanici listesi veya atama alanlarinda

**Kullanmayin:**
- Dekoratif gorseller icin — bunun yerine \`img\` veya \`Image\` kullanin
- Logo gosterimi icin — bunun yerine \`Icon\` veya ozel bilesen kullanin
- Durum gostergesi icin — bunun yerine \`Badge\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────┐
│                     │
│   [Image / Initials │
│    / Icon / Default]│
│                     │
└─────────────────────┘
\`\`\`

1. **Container** — \`span\` elemani; boyut, sekil (circle/square) ve arkaplan rengi
2. **Resim** — \`src\` verildiginde \`object-cover\` ile render edilir; \`onError\` ile fallback tetiklenir
3. **Bas Harfler** — \`initials\` prop'u ile maks 2 karakter, buyuk harf, ortalanmis
4. **Ikon** — Ozel \`icon\` ReactNode; SVG boyutu otomatik ayarlanir
5. **Varsayilan Ikon** — Hicbir prop verilmediginde standart kullanici silüeti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`alt\` metin saglayin.** Ekran okuyucular icin resmin neyi temsil ettigini aciklayin.

**Fallback stratejisi olusturun.** \`src\` + \`initials\` birlikte verin; resim yuklenemezse bas harfler gorunur.

**Boyutu baglamina gore secin.** Tablo icinde \`sm\`, profil sayfasinda \`xl\` veya \`2xl\` kullanin.

**Kare sekli varlik/kurum icin kullanin.** Kullanicilar icin \`circle\`, sirket veya urun icin \`square\` tercih edin.

**Grup gosteriminde ust uste bindirin.** Negatif margin ile avatar grubu olusturun: \`-ml-2\`.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`alt\` metin olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`alt\` veya \`aria-label\` ekleyin.

**❌ Cok buyuk resim dosyalari yuklemek**
Avatar resimleri kucuk boyutlu olmalidir. Thumbnail URL'leri kullanin.

**❌ Bas harfleri 2 karakterden uzun yapmak**
\`initials\` otomatik olarak 2 karaktere kesilir ancak tasarim icin 1-2 harf ideal.

**❌ Dekoratif gorsel olarak kullanmak**
Avatar kimlik temsili icindir; genel gorsel icin \`img\` elemani kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Alt Metin:** \`alt\` prop'u ile resim icin aciklayici metin saglanir. Bos \`alt="""\` dekoratif gorseller icin kullanilabilir.

**Rol:** Avatar bir \`span\` elemani olarak render edilir; ek \`role="img"\` ile birlikte \`aria-label\` eklenebilir.

**Kontrast:** Bas harf metni \`text-secondary\` renk tokeni ile yeterli kontrast orani saglar.

**Klavye:** Avatar tek basina etkilesimli degildir. Etkilesim gerekiyorsa bir \`button\` veya \`link\` icine sarin.`,
      },
    ],
    relatedComponents: ["Badge", "Tag", "Tooltip"],
  },

  Badge: {
    componentName: "Badge",
    summary: "Badge, durum bilgisi veya sayisal degerleri kucuk etiketlerle gosteren bir gostergedir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Badge, kisa durum veya miktar bilgisini kompakt bir etiket olarak sunar. Sekiz farkli varyant destekler: \`default\`, \`primary\`, \`success\`, \`warning\`, \`error\`, \`danger\`, \`info\` ve \`muted\`.

Uc boyut secenegi (\`sm\`, \`md\`, \`lg\`) ve \`dot\` modu ile sadece renkli nokta olarak da kullanilabilir.

\`\`\`tsx
<Badge variant="success">Aktif</Badge>
<Badge variant="error" size="sm">3 Hata</Badge>
<Badge variant="warning" dot />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Durum etiketleri gostermek icin (Aktif, Beklemede, Hata)
- Bildirim veya mesaj sayisi belirtmek icin
- Tablo hucresinde kategorik bilgi gosterimi icin
- Kucuk renkli gostergeler icin (\`dot\` modu)

**Kullanmayin:**
- Kaldirabilir etiketler icin — bunun yerine \`Tag\` kullanin
- Uzun aciklamalar icin — bunun yerine \`Alert\` kullanin
- Etkilesimli secim icin — bunun yerine \`Checkbox\` veya \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────┐
│  [Metin/Sayi]  │   ← Standart Badge
└────────────────┘

    ●                ← Dot modu (sadece renkli nokta)
\`\`\`

1. **Container** — \`rounded-full\` yuvarlak kenarli \`span\` elemani
2. **Icerik** — Metin veya sayi; \`font-medium\` ile vurgulanir
3. **Renk Katmani** — Varyanta gore arkaplan ve metin rengi CSS token'lari
4. **Dot Modu** — \`dot={true}\` ile icerik gosterilmez, sadece 8px renkli daire`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa tutun.** Badge icerigi 1-2 kelime veya kisa bir sayi olmalidir.

**Renk anlamini tutarli kullanin.** \`success\` = basari/aktif, \`error\` = hata, \`warning\` = uyari, \`info\` = bilgi.

**Dot modunu ince gostergeler icin kullanin.** Metin gerekmediginde \`dot\` ile minimal gorsel sag edin.

**Boyutu baglama gore secin.** Tablo icinde \`sm\`, standart UI'da \`md\`, buyuk kartlarda \`lg\`.

**Renklere tek basina guvenmeyin.** Renk koru kullanicilar icin badge icinde metin veya ikon de bulundurun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok uzun metin iceren badge kullanmak**
Badge kisa durum bilgisi icindir; uzun metinler icin \`Alert\` veya \`Tag\` kullanin.

**❌ Sayfada cok fazla badge kullanmak**
Gorsel karisiklik yaratir. Onemine gore filtreleyip yalnizca kritik durumlari gosterin.

**❌ Etkilesimli eleman olarak kullanmak**
Badge tiklanabilir degildir. Tiklanabilir etiket icin \`Tag\` veya \`Button\` kullanin.

**❌ Yalnizca renkle anlam iletmek**
Erisilebilirlik icin renk + metin veya renk + ikon birlikte kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Badge bir \`span\` elemanidir ve dekoratif bir gostergedir. Kritik bilgi icin \`aria-label\` ekleyin.

**Kontrast:** Tum varyantlar WCAG 2.1 AA minimum kontrast oranini (4.5:1) saglar.

**Dot Modu:** Sadece renk ile bilgi ilettigi icin yanina aciklayici metin ekleyin.

**Ekran Okuyucu:** Badge icerigini \`sr-only\` sinifi ile zenginlestirebilirsiniz: "3 okunmamis bildirim".`,
      },
    ],
    relatedComponents: ["Tag", "Avatar", "Alert"],
  },

  Tag: {
    componentName: "Tag",
    summary: "Tag, kaldirabilir etiketler (chip) olusturarak kategorileri, filtreleri veya secilmis degerleri gosterir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tag, bir ogeyi etiketlemek veya secilen filtreleri gostermek icin kullanilan kompakt bir bilesendir. Badge'den farki: **kaldirma butonu** (\`closable\`), **ikon destegi** ve **erisim kontrolu** (\`access\` prop) icermesidir.

Yedi varyant (\`default\`, \`primary\`, \`success\`, \`warning\`, \`error\`, \`info\`, \`danger\`), uc boyut (\`sm\`, \`md\`, \`lg\`) ve \`border\` stili ile gorsel ayrim saglar.

\`\`\`tsx
<Tag variant="primary" closable onClose={handleRemove}>React</Tag>
<Tag variant="success" icon={<CheckIcon />}>Onaylandi</Tag>
<Tag access="readonly" accessReason="Degistirilemez">Sistem</Tag>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Secilmis filtreleri gostermek ve kaldirmak icin (arama sonuclari, filtre cubugu)
- Kategorik etiketleme icin (etiketler, beceriler, teknolojiler)
- Coklu secim sonuclarini gostermek icin (Combobox secim ciktilari)
- Durum etiketleri ile birlikte ikon kullanmak istediginde

**Kullanmayin:**
- Sadece durum gostergesi icin — bunun yerine \`Badge\` kullanin
- Aksiyon tetiklemek icin — bunun yerine \`Button\` kullanin
- Uzun icerik icin — bunun yerine \`Alert\` veya \`Card\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│  [Icon?]  [Label]  [Close?] │
│  ← leading     trailing →   │
└──────────────────────────────┘
\`\`\`

1. **Container** — \`rounded-md\`, \`border\` ile cevrili \`span\` elemani
2. **Ikon** (opsiyonel) — \`icon\` prop'u ile sol tarafa yerlesen SVG/ReactNode
3. **Etiket** — \`truncate\` ile uzun metinler kesilir
4. **Kapat Butonu** (opsiyonel) — \`closable={true}\` ile X ikonu; \`onClose\` callback tetikler
5. **Erisim Katmani** — \`access\` prop'u ile \`hidden\`, \`disabled\`, \`readonly\` kontrol`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa etiket metni kullanin.** 1-3 kelime ideal; uzun metinler \`truncate\` ile kesilir.

**\`closable\` ile birlikte \`onClose\` saglayin.** Kapat butonu gorsel olarak varsa callback da olmalidir.

**Renk kodlarini tutarli tutun.** Filtre tag'leri icin \`default\`, durum tag'leri icin anlamsal varyantlari kullanin.

**\`access\` prop'unu politika kontrolu icin kullanin.** Sistem etiketlerini \`readonly\`, gizlenmesi gerekenleri \`hidden\` yapin.

**Gruplama icin \`gap-2\` kullanin.** Tag'ler arasinda tutarli bosluk birakin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tag'i buton olarak kullanmak**
Tag bir etiket bilesenidir. Aksiyon icin \`Button\` kullanin.

**❌ Kapat butonu olmadan \`onClose\` beklemek**
\`closable={true}\` olmadan \`onClose\` callback'i hicbir zaman tetiklenmez.

**❌ Cok fazla tag gostermek**
10+ tag gorsel yogunluk yaratir. "+5 daha" seklinde ozet gosterin.

**❌ Badge yerine Tag kullanmak**
Kaldirma gerektirmeyen kisa durum gostergeleri icin \`Badge\` yeterlidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Kapat Butonu:** Kapat butonu \`aria-label="Remove"\` ile isaretlenir. Ekran okuyucular etiketin kaldirabilir oldugunu duyurur.

**Klavye:** Kapat butonuna \`Tab\` ile ulasip \`Enter\` veya \`Space\` ile etkinlestirilir.

**Erisim Kontrolu:** \`access="disabled"\` durumunda \`opacity-50\` ve \`pointer-events-none\` uygulanir; etkilesim engellenir.

**Baslik:** \`accessReason\` prop'u ile kisitlama nedeni \`title\` olarak gosterilir ve hover'da aciklama sunar.`,
      },
    ],
    relatedComponents: ["Badge", "Combobox", "MultiSelect", "Button"],
  },

  Radio: {
    componentName: "Radio",
    summary: "Radio, bir grup secenek icerisinden yalnizca bir tanesinin secilmesini saglayan form kontroludur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Radio, birbirini dislayan seceneklerden birini secmek icin kullanilir. \`RadioGroup\` ile birlikte kullanildiginda \`name\`, \`value\` ve \`onChange\` otomatik yonetilir.

Uc boyut (\`sm\`, \`md\`, \`lg\`), etiket ve aciklama destegi sunar. Gorsel olarak daire icerisinde dolu nokta ile secili durumu belirtir.

\`\`\`tsx
<RadioGroup name="plan" value={selected} onChange={setSelected}>
  <Radio value="free" label="Ucretsiz" description="Temel ozellikler" />
  <Radio value="pro" label="Pro" description="Gelismis ozellikler" />
  <Radio value="enterprise" label="Kurumsal" description="Tam erisim" />
</RadioGroup>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- 2-7 birbirini dislayan secenek arasindan secim icin
- Tum seceneklerin ayni anda gorunur olmasi gerektiginde
- Kullanicinin secenekleri karsilastirmasi gerektiginde
- Form icinde tek secim gerektiren alanlarda

**Kullanmayin:**
- 7'den fazla secenek varsa — bunun yerine \`Select\` kullanin
- Birden fazla secim yapilacaksa — bunun yerine \`Checkbox\` kullanin
- Acik/kapali gecisi icin — bunun yerine \`Switch\` kullanin
- Sadece iki secenek ve az yer varsa — bunun yerine \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
○  Etiket
   Aciklama metni

●  Secili Etiket
   Aciklama metni
\`\`\`

1. **Radio Dairesi** — Dis cevre (\`border-2\`) ve ic dolu nokta (secili durumda)
2. **Gizli Input** — \`sr-only\` sinifi ile gorsel olarak gizlenir, \`type="radio"\`
3. **Etiket** — \`label\` prop'u ile \`text-sm font-medium\`
4. **Aciklama** — \`description\` prop'u ile \`text-xs text-secondary\`
5. **RadioGroup Container** — \`role="radiogroup"\`, yatay veya dikey duzenleme`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman RadioGroup icinde kullanin.** Tek basina Radio anlamsizdir; grup icerisinde kullanin.

**Varsayilan bir deger secin.** Kullanicinin hic secim yapmamasi genellikle istenmez; bir secenek on-secili olsun.

**Secenekleri mantiksal sirada dizin.** En yaygin/onerilen secenek en uste veya sola yerlestirin.

**Aciklama metni ekleyin.** Secenekler arasindaki farki netlestirmek icin \`description\` prop'unu kullanin.

**Dikey duzenlemeyi tercih edin.** 3+ secenek icin \`direction="vertical"\` daha okunaklir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek bir Radio kullanmak**
Radio her zaman bir grup icerisinde kullanilmalidir. Tek secim icin \`Checkbox\` veya \`Switch\` kullanin.

**❌ Cok fazla secenek gostermek**
7'den fazla secenek gorsel karisikliga neden olur; \`Select\` veya \`Combobox\` tercih edin.

**❌ Varsayilan deger olmadan kullanmak**
Kullanici formu gonderdiginde secim yapilmamis olabilir; her zaman bir varsayilan belirleyin.

**❌ Birden fazla secime izin vermeye calismak**
Radio tek secim icindir. Coklu secim icin \`Checkbox\` grubu kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`RadioGroup\` \`role="radiogroup"\` ile sarmalanir. Her Radio yerel \`<input type="radio">\` kullanir.

**Klavye:** \`Tab\` ile gruba odaklanilir. \`Arrow Up/Down\` veya \`Arrow Left/Right\` ile secenekler arasinda gezinilir. \`Space\` ile secim yapilir.

**Etiket Iliskilendirme:** \`htmlFor\` / \`id\` eslestirilmesi otomatik olarak \`useId()\` ile saglanir.

**Hata Durumu:** \`error={true}\` ile kenarlık rengi \`state-error-text\` olarak degisir.

**Devre Disi:** \`disabled\` durumunda \`opacity-50\` ve \`cursor-not-allowed\` uygulanir.`,
      },
    ],
    relatedComponents: ["Select", "Checkbox", "Switch", "RadioGroup"],
  },

  Switch: {
    componentName: "Switch",
    summary: "Switch, bir ayari aninda acip kapatmak icin kullanilan toggle kontroludur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Switch, bir boolean degeri gorsel olarak acik/kapali durumda gosteren toggle bilesenidir. Semantik olarak \`role="switch"\` kullanan bir \`<input type="checkbox">\` uzerine insadir.

Uc boyut (\`sm\`, \`md\`, \`lg\`), etiket ve aciklama destegi sunar. \`onCheckedChange\` callback'i ile kontrollü kullanim saglar.

\`\`\`tsx
<Switch
  label="Bildirimler"
  description="E-posta bildirimleri alin"
  checked={isEnabled}
  onCheckedChange={setIsEnabled}
/>
<Switch switchSize="sm" checked={darkMode} onCheckedChange={setDarkMode} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Bir ayari aninda acip kapatmak icin (bildirimler, karanlik mod, ozellik toggle)
- Degisikligin hemen etkili oldugu durumlarda (kaydet butonu gerektirmeyen)
- Acik/kapali ikili durumlar icin
- Ayar panelleri ve tercih ekranlarinda

**Kullanmayin:**
- Form icerisinde kaydet butonu ile birlikte — bunun yerine \`Checkbox\` kullanin
- Birden fazla secim gerektiren listeler icin — bunun yerine \`Checkbox\` grubu kullanin
- Birbirini dislayan secenekler icin — bunun yerine \`Radio\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────┐
│ ○─────    │  ← Kapali (track gri)
└───────────┘

┌───────────┐
│     ─────●│  ← Acik (track primary renk)
└───────────┘
  Etiket
  Aciklama
\`\`\`

1. **Track** — Yuvarlak arka plan; kapali: \`border-default\`, acik: \`action-primary\`
2. **Thumb** — Kayar beyaz daire; \`translate-x\` ile pozisyon degistirir
3. **Gizli Input** — \`sr-only\` sinifi ile gizlenen \`<input type="checkbox" role="switch">\`
4. **Etiket** — \`label\` prop'u ile sag tarafa yerlesen metin
5. **Aciklama** — \`description\` prop'u ile etiket altinda ek bilgi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aninda etki icin kullanin.** Switch degisikligi hemen uygulanmalidir; "Kaydet" butonu gerektirmemelidir.

**Olumlu etiketler kullanin.** "Bildirimleri ac" seklinde yazin, "Bildirimleri kapatma" seklinde degil.

**Her zaman etiket saglayin.** Gorsel olarak gizlenmis olsa bile \`label\` veya \`aria-label\` ekleyin.

**Boyutu baglama gore secin.** Ayar panellerinde \`md\`, toolbar icinde \`sm\`, ozellik kartlarinda \`lg\` kullanin.

**Baslangic durumunu netlestirin.** Kullanici Switch'i gordugunde mevcut durumu anlamalidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Form icinde kaydet butonu ile birlikte kullanmak**
Switch aninda etki eder. Form akisinda \`Checkbox\` daha uygun.

**❌ Etiketsiz Switch kullanmak**
Kullanici neyi toggle ettigini anlayamaz. Her zaman \`label\` ekleyin.

**❌ Ikiden fazla durum icin kullanmak**
Switch yalnizca acik/kapali icindir. Uc+ durum icin \`Select\` veya \`Radio\` kullanin.

**❌ Kritik/geri donulemez islemler icin kullanmak**
Hesap silme gibi islemler icin onay dialogu gerektiren \`Button\` + \`Modal\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="switch"\` ile ekran okuyucular bileseni toggle olarak tanir.

**Klavye:** \`Tab\` ile odaklanilir, \`Space\` ile durum degistirilir.

**Etiket Iliskilendirme:** \`htmlFor\` / \`id\` otomatik olarak \`useId()\` ile eslestirilir.

**Durum Duyurusu:** Ekran okuyucular \`checked\` durumunu "acik" veya "kapali" olarak duyurur.

**Devre Disi:** \`disabled\` durumunda \`opacity-50\` ve \`cursor-not-allowed\` uygulanir; etkilesim engellenir.`,
      },
    ],
    relatedComponents: ["Checkbox", "Radio", "Button"],
  },

  Divider: {
    componentName: "Divider",
    summary: "Divider, icerik bolumleri arasinda gorsel ayirim saglayan yatay veya dikey cizgi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Divider, sayfa icerisindeki bolumler arasinda gorsel bir ayrim cizgisi olusturur. \`horizontal\` (varsayilan) ve \`vertical\` yonlendirme, opsiyonel **etiket** (ortada metin) ve dort bosluk secenegi (\`none\`, \`sm\`, \`md\`, \`lg\`) destekler.

Etiketli mod, "veya", "ya da" gibi ayirici metinler icin idealdir.

\`\`\`tsx
<Divider />
<Divider label="veya" spacing="lg" />
<Divider orientation="vertical" spacing="md" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Icerik bolumleri arasinda gorsel ayirim icin
- Form gruplari veya kart bolumlerini ayirmak icin
- "veya" gibi ayirici metin gostermek icin (\`label\` prop)
- Yatay toolbar'larda elemanlar arasinda dikey ayirac icin

**Kullanmayin:**
- Dekoratif cerceve/cizgi icin — bunun yerine CSS \`border\` kullanin
- Bosluk olusturmak icin — bunun yerine \`Stack\` veya \`gap\` kullanin
- Liste ogelerini ayirmak icin — bunun yerine liste bileseninin kendi ayiricisini kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Yatay (varsayilan):
────────────────────────────

Etiketli:
──────────── veya ────────────

Dikey:
  │
  │
  │
\`\`\`

1. **Yatay Cizgi** — \`<hr>\` elemani, \`h-px\` ve \`border-subtle\` arkaplan
2. **Etiketli Mod** — Iki cizgi arasinda \`text-xs font-medium\` etiket metni
3. **Dikey Mod** — \`<div>\` elemani, \`w-px\` ve \`h-full\` ile tam yukseklik
4. **Bosluk** — \`spacing\` prop'u ile \`my-2/4/6\` (yatay) veya \`mx-2/4/6\` (dikey)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Bosluk ile birlikte kullanin.** \`spacing="md"\` varsayilandir; cogul durumda yeterlidir.

**Etiketli modu ozel durumlar icin saklayin.** "veya", "ya da", bolum basliklari gibi anlamli metinler icin.

**Asiri kullanmayin.** Her bolum arasina divider koymak yerine bosluk (\`gap\`) ile gorsel hiyerarsi kurun.

**Dikey modu toolbar'larda kullanin.** Buton gruplari veya ikon gruplari arasinda gorsel ayirim icin idealdir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Her yere divider koymak**
Asiri divider gorsel gurultu yaratir. Bosluk ve gruplama ile hiyerarsi kurun.

**❌ Bosluk amacli kullanmak**
Divider gorsel ayirim icindir. Bosluk icin \`Stack\`, \`gap\` veya \`margin\` kullanin.

**❌ Uzun etiket metni kullanmak**
Etiketli modda metin kisa olmalidir (1-3 kelime). Uzun metinler icin baslik bileseni kullanin.

**❌ Dikey divider'i blok icerik arasinda kullanmak**
Dikey mod sadece inline/flex icerik arasinda calisir; blok elemanlar arasinda yatay kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="separator"\` ile ekran okuyucular gorsel ayirimi tanir.

**Oryantasyon:** Dikey modda \`aria-orientation="vertical"\` otomatik olarak eklenir.

**Semantik:** Yatay mod native \`<hr>\` elemani kullanir; ekran okuyucular dogrudan "ayirici" olarak duyurur.

**Klavye:** Divider etkilesimli degildir; tab sirasinda atlanir.`,
      },
    ],
    relatedComponents: ["Stack", "Card", "Tabs"],
  },

  Tooltip: {
    componentName: "Tooltip",
    summary: "Tooltip, fare veya klavye odagi ile tetiklenen kisa bilgi baloncugu gosterir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tooltip, bir elemanin uzerine gelindiginde veya odaklanildiginda kisa aciklayici bilgi gosteren bir overlay bilesenidir. Dort yonlendirme (\`top\`, \`bottom\`, \`left\`, \`right\`), gecikme kontrolu (\`delay\`, \`openDelay\`, \`closeDelay\`) ve opsiyonel ok gostergesi (\`showArrow\`) destekler.

Icerik yoksa bilesen tamamen atlanir ve yalnizca children render edilir.

\`\`\`tsx
<Tooltip content="Dosyayi kaydet">
  <Button>Kaydet</Button>
</Tooltip>
<Tooltip content="Uzun aciklama metni" placement="right" showArrow>
  <IconButton icon={<InfoIcon />} />
</Tooltip>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Ikon-only butonlara aciklama eklemek icin
- Kisaltilmis veya truncate edilmis metinlerin tam halini gostermek icin
- Devre disi butonlarin nedenini aciklamak icin
- Form alanlarinda ek yardim bilgisi sunmak icin

**Kullanmayin:**
- Zengin icerik (resim, link, form) gostermek icin — bunun yerine \`Popover\` kullanin
- Kritik bilgi icin — Tooltip gizlidir; onemli bilgiyi her zaman gorunur yapin
- Mobil cihazlarda — hover yoktur; mobilde farkli bir yaklasim kullanin
- Uzun paragraflar icin — Tooltip kisa bilgi icindir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
          ┌─────────────┐
          │  Tooltip     │
          │  Icerigi     │
          └──────┬──────┘
                 ▼ (ok)
          [Trigger Element]
\`\`\`

1. **Wrapper** — \`relative inline-flex\` span; hover/focus olaylarini yakalar
2. **Trigger** — \`children\` olarak gecilen herhangi bir eleman
3. **Balon** — \`role="tooltip"\`, koyu arkaplan, beyaz metin, \`z-[1600]\`
4. **Ok** (opsiyonel) — \`showArrow={true}\` ile yonlendirmeye gore konumlanan ucgen
5. **Animasyon** — \`animate-in fade-in-0 zoom-in-95\` ile yumusak giris efekti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kisa tutun.** Tooltip 1-2 satir olmalidir. Uzun aciklamalar icin \`Popover\` kullanin.

**Gecikme ayarlayin.** Varsayilan \`200ms\` cogu durum icin uygundur. Sik kullanilan UI icin \`0ms\` dusunun.

**Ikon butonlarinda mutlaka kullanin.** Ikon-only butonlar icin tooltip zorunludur; kullanici aksiyonu anlamalidir.

**Kritik bilgiyi tooltip'e gizlemeyin.** Tooltip kesfedilmeyi gerektirir; onemli bilgi her zaman gorunur olmalidir.

**\`placement\` ile tasmayi onleyin.** Sayfa kenarindaki elemanlar icin uygun yon secin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Etkilesimli icerik koymak**
Tooltip \`pointer-events-none\` dir; icine buton veya link koymak calismaz. \`Popover\` kullanin.

**❌ Uzun paragraflar gostermek**
Tooltip kisa bilgi icindir. 2 satirdan uzun icerik icin \`Popover\` veya \`Drawer\` kullanin.

**❌ Tooltip icinde tooltip kullanmak**
Ic ice tooltip gorsel ve etkilesim sorunlari yaratir.

**❌ Mobilde tek bilgi kaynagi olarak kullanmak**
Mobil cihazlarda hover yoktur. Kritik bilgiyi alternatif yollarla sunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolu:** \`role="tooltip"\` ile ekran okuyucular balon icerigini duyurur.

**Klavye:** \`onFocus\` ile tetiklenir; \`Tab\` ile elemana odaklanildiginda tooltip gorunur olur.

**Gecikme:** \`delay\` / \`openDelay\` ile hover ve focus sonrasi bekleme suresi ayarlanir. \`closeDelay\` ile kapanma geciktirilir.

**Devre Disi:** \`disabled={true}\` ile tooltip tamamen devre disi birakilir; icerik gosterilmez.

**Renk Kontrasti:** Koyu arkaplan (\`text-primary\`) uzerinde acik metin (\`text-inverse\`) ile WCAG AA kontrastini saglar.`,
      },
    ],
    relatedComponents: ["Popover", "Modal", "Badge", "IconButton"],
  },

  Text: {
    componentName: "Text",
    summary: "Text, tutarli tipografi token'lari ile herhangi bir HTML metin elemanini render eden polimorfik bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Text, tasarim sistemi tipografi token'larini uygulayan polimorfik bir bilesendir. \`as\` prop'u ile \`p\`, \`span\`, \`h1-h6\`, \`label\`, \`code\`, \`kbd\` gibi herhangi bir HTML elemani olarak render edilebilir.

Yedi renk varyanti, sekiz boyut, dort font agirligi, \`truncate\`, \`lineClamp\` ve \`mono\` destegi sunar.

\`\`\`tsx
<Text as="h1" size="3xl" weight="bold">Sayfa Basligi</Text>
<Text variant="secondary" size="sm">Yardimci metin</Text>
<Text as="code" mono size="sm">const x = 42;</Text>
<Text truncate>Cok uzun bir metin burada kesilir...</Text>
<Text lineClamp={2}>Birden fazla satir icin line-clamp...</Text>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tum metin icerigi icin tutarli tipografi uygulamak istediginizde
- Basliklar, paragraflar, etiketler ve yardimci metinler icin
- Kod parcalari veya klavye kisayollarini gostermek icin (\`as="code"\`, \`as="kbd"\`)
- Metin kesme (\`truncate\`) veya satir siniri (\`lineClamp\`) gereken yerlerde

**Kullanmayin:**
- Zengin metin editoru icin — bunun yerine ozel rich-text bileseni kullanin
- Etkilesimli metin icin — bunun yerine \`Link\` veya \`Button\` kullanin
- Uzun form etiketleri icin — bunun yerine \`FormField\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
<Text as="p" variant="default" size="base" weight="normal">
  Metin icerigi
</Text>
\`\`\`

1. **Polimorfik Kok** — \`as\` prop'u ile belirlenen HTML elemani (varsayilan: \`span\`)
2. **Renk Katmani** — \`variant\` ile CSS token bazli renk: \`default\`, \`secondary\`, \`muted\`, \`success\`, \`warning\`, \`error\`, \`info\`
3. **Boyut Katmani** — \`size\` ile Tailwind boyut siniflari: \`xs\` ile \`4xl\` arasi
4. **Agirlik Katmani** — \`weight\` ile \`font-normal\`, \`font-medium\`, \`font-semibold\`, \`font-bold\`
5. **Metin Kontrolleri** — \`truncate\` (tek satir kesme), \`lineClamp\` (coklu satir siniri), \`mono\` (monospace font)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Dogru semantik elemani secin.** Basliklar icin \`as="h1-h6"\`, paragraflar icin \`as="p"\`, inline metin icin \`as="span"\` kullanin.

**Tipografi hiyerarsisi kurun.** Sayfa basligi icin \`size="3xl" weight="bold"\`, govde icin \`size="base"\`, yardimci metin icin \`size="sm" variant="secondary"\` kullanin.

**\`lineClamp\` ile uzun metinleri sinirlayin.** Kart aciklamalari gibi alanlarda \`lineClamp={2}\` veya \`lineClamp={3}\` kullanin.

**\`mono\` prop'unu kod icerigi icin kullanin.** \`as="code" mono\` kombinasyonu tutarli kod gosterimi saglar.

**Renk varyantlarini anlamsal kullanin.** \`error\` sadece hata mesajlari icin, \`success\` onay metinleri icin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Semantik uyumsuzluk**
Baslik gorunumlu bir metin icin \`as="span"\` kullanmak; \`as="h2"\` gibi dogru elemani secin.

**❌ Dogrudan stil vermek yerine token kullanmamak**
\`className="text-red-500"\` yerine \`variant="error"\` kullanin; tema degisimlerinde tutarlilik saglanir.

**❌ Her yerde \`weight="bold"\` kullanmak**
Asiri kalin metin okunabilirligi dusurur. Hiyerarsi icin \`weight\` ve \`size\` kombinasyonlarini kullanin.

**❌ \`truncate\` ile birlikte \`lineClamp\` kullanmak**
Bu iki prop birbirini dislar. \`truncate\` tek satir, \`lineClamp\` coklu satir icindir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik HTML:** \`as\` prop'u ile dogru HTML elemani secilir. \`h1-h6\` baslik hiyerarsisini ekran okuyucular kullanir.

**Renk Kontrasti:** Tum \`variant\` degerleri CSS token'lari uzerinden WCAG 2.1 AA kontrastini saglar.

**Metin Kesme:** \`truncate\` veya \`lineClamp\` kullanildiginda tam metin \`title\` attribute ile erisilebilir kilinabilir.

**Klavye:** Text bileseni etkilesimli degildir; tab sirasinda atlanir. Etkilesim gerekiyorsa \`as="label"\` ile form kontrolleriyle iliskilendirin.`,
      },
    ],
    relatedComponents: ["Badge", "Tag", "Link", "Input"],
  },

  Dropdown: {
    componentName: "Dropdown",
    summary: "Dropdown, bir tetikleyici elemana tiklandiginda menu ogeleri, ayiricilar ve ikon destegi sunan acilir menu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Dropdown, bir tetikleyici elemana tiklandiginda acilan menu paneli sunar. Menu ogeleri (\`DropdownItem\`), ayiricilar (\`separator\`) ve grup etiketleri (\`label\`) iceren esnek bir yapi saglar.

Her oge icin ikon, aciklama metni, devre disi durumu ve \`danger\` modu desteklenir. Dort yerlestirme secenegi (\`bottom-start\`, \`bottom-end\`, \`top-start\`, \`top-end\`) ve klavye navigasyonu ile tam erisim saglanir.

\`\`\`tsx
<Dropdown
  items={[
    { key: "edit", label: "Duzenle", icon: <EditIcon /> },
    { type: "separator" },
    { key: "delete", label: "Sil", danger: true, onClick: handleDelete },
  ]}
>
  <Button>Islemler</Button>
</Dropdown>

<Dropdown
  placement="bottom-end"
  items={[
    { type: "label", label: "HESAP" },
    { key: "profile", label: "Profil", description: "Hesap ayarlari" },
    { key: "logout", label: "Cikis Yap", danger: true },
  ]}
>
  <IconButton icon={<MoreIcon />} label="Menu" />
</Dropdown>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Birden fazla aksiyonu tek bir tetikleyici altinda gruplamak icin (islem menusu)
- Tablo satiri veya kart uzerinde contextual aksiyonlar sunmak icin
- Hesap menusu, ayarlar menusu gibi navigasyon disindaki menu ihtiyaclari icin
- Yer kisitlamasi olan alanlarda coklu aksiyon sunmak icin

**Kullanmayin:**
- Form secimi icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Navigasyon menusu icin — bunun yerine \`NavigationRail\` veya \`MenuBar\` kullanin
- Zengin icerik gostermek icin — bunun yerine \`Popover\` kullanin
- Sag tiklama menusu icin — bunun yerine \`ContextMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Trigger Button]
       │
       ▼
┌──────────────────────┐
│  GRUP ETIKETI        │
│  [Icon]  Oge 1       │
│          Aciklama     │
│  [Icon]  Oge 2       │
│  ─────────────────── │ ← separator
│  [Icon]  Sil (danger)│
└──────────────────────┘
\`\`\`

1. **Trigger** — \`children\` olarak gecilen eleman; \`aria-haspopup="menu"\` ve \`aria-expanded\` otomatik eklenir
2. **Menu Paneli** — \`role="menu"\`, \`rounded-xl\`, \`shadow-xl\`, \`z-[1500]\`, animasyonlu giris
3. **Menu Ogesi** — \`role="menuitem"\`, \`<button>\` elemani; ikon, etiket ve aciklama iceren satir
4. **Ayirici** — \`h-px\` yuksekliginde \`border-subtle\` renkte ince cizgi
5. **Grup Etiketi** — \`text-[10px]\` buyuk harf, \`uppercase tracking-wider\` stil`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aksiyonlari mantiksal gruplayin.** Ayirici ve grup etiketleri ile iliskili aksiyonlari bir arada tutun.

**Tehlikeli aksiyonlari \`danger\` ile isaretleyin.** Silme, kaldir gibi geri donulemez aksiyonlar icin \`danger: true\` kullanin.

**Ikon ile gorsel tutarlilik saglayin.** Tum ogelere ikon ekleyin veya hicbirine eklemeyin; karisik kullanim gorsel dengesizlik yaratir.

**\`description\` ile baglam saglayin.** Aksiyonun etkisini kisa bir aciklama ile netlestirin.

**Oge sayisini sinirli tutun.** 7-8 ogeden fazlasi gorsel yogunluk yaratir; gruplar ve ayiricilar ile organize edin.

**\`minWidth\` ile minimum genisligi ayarlayin.** Varsayilan 180px cogu durum icin yeterlidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Dropdown icinde form elemanlari kullanmak**
Menu ogeleri aksiyon tetikler; form kontrolleri icin \`Popover\` kullanin.

**❌ Cok fazla oge iceren menu olusturmak**
10+ oge gorsel karisiklik yaratir. Alt menulere bolun veya farkli bir yaklasim dusunun.

**❌ Navigasyon icin kullanmak**
Dropdown aksiyon menusudur; sayfa navigasyonu icin navigation bilesenleri kullanin.

**❌ \`danger\` ogelerini menunun basina koymak**
Tehlikeli aksiyonlar menunun sonunda olmalidir; kazara tiklama riskini azaltir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Trigger uzerinde \`aria-haspopup="menu"\` ve \`aria-expanded\` otomatik eklenir. Menu paneli \`role="menu"\`, ogeler \`role="menuitem"\` kullanir.

**Klavye:** \`Enter\`, \`Space\` veya \`ArrowDown\` ile menu acilir. \`ArrowUp/Down\` ile ogeler arasinda gezinilir. \`Enter/Space\` ile secim yapilir. \`Escape\` ile menu kapanir.

**Devre Disi:** \`disabled: true\` olan ogeler \`pointer-events-none\` ve \`opacity-40\` ile gosterilir; klavye navigasyonunda atlanir.

**Odak Yonetimi:** Dis tiklama ile menu kapanir. Odak yonetimi \`focusIndex\` state ile kontrol edilir.`,
      },
    ],
    relatedComponents: ["Select", "Popover", "ContextMenu", "IconButton"],
  },

  IconButton: {
    componentName: "IconButton",
    summary: "IconButton, yalnizca ikon iceren kare seklinde bir buton bilesenidir; erisim icin zorunlu \`label\` prop'u gerektirir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `IconButton, metin yerine yalnizca ikon gosteren kompakt bir buton bilesenidir. Bes varyant (\`primary\`, \`secondary\`, \`outline\`, \`ghost\`, \`danger\`), dort boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`), yukleme durumu ve yuvarlak (\`rounded\`) sekil destekler.

Erisim icin \`label\` prop'u zorunludur ve otomatik olarak \`aria-label\` olarak uygulanir. Yukleme durumunda ikon yerine \`Spinner\` gosterilir.

\`\`\`tsx
<IconButton icon={<EditIcon />} label="Duzenle" variant="ghost" />
<IconButton icon={<TrashIcon />} label="Sil" variant="danger" size="sm" />
<IconButton icon={<PlusIcon />} label="Ekle" variant="primary" rounded-xs />
<IconButton icon={<SaveIcon />} label="Kaydediyor" loading />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Toolbar, tablo satiri veya kart basliginda yer kisitli aksiyonlar icin
- Sik kullanilan ve ikonu ile taninan aksiyonlar icin (duzenle, sil, kapat)
- Dropdown veya Popover tetikleyicisi olarak
- Toggle butonlari icin (favorile, sabitle)

**Kullanmayin:**
- Metin etiketi ile anlam iletmek gerektiginde — bunun yerine \`Button\` kullanin
- Navigasyon icin — bunun yerine \`Link\` kullanin
- Dekoratif ikon gosterimi icin — bunun yerine \`Icon\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────┐
│         │
│  [Icon] │   ← Kare buton (varsayilan: rounded-lg)
│         │
└─────────┘

┌─────────┐
│  (···)  │   ← loading durumu (Spinner)
└─────────┘
\`\`\`

1. **Buton Container** — Native \`<button>\` elemani; kare boyut (\`h-9 w-9\` varsayilan)
2. **Ikon** — \`icon\` prop'u ile gecilen SVG/ReactNode; boyut otomatik ayarlanir (\`[&>svg]:h-4.5\`)
3. **Spinner** — \`loading={true}\` durumunda ikon yerine \`Spinner size="xs"\` gosterilir
4. **Odak Halkasi** — \`focus-visible:ring-2\` ile gorunur odak gostergesi
5. **Sekil** — \`rounded={false}\` (varsayilan): \`rounded-lg\`; \`rounded={true}\`: \`rounded-full\``,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`label\` saglayin.** \`label\` prop'u zorunludur ve \`aria-label\` olarak uygulanir. Anlami net olan bir metin yazin: "Sil" degil "Bu ogeyi sil".

**Tooltip ile eslestiirin.** Ikon-only butonlar icin \`Tooltip\` sarmalamasiyla gorsel aciklama ekleyin.

**Varyanti dogru secin.** Ana aksiyonlar icin \`primary\`, ikincil icin \`ghost\` (varsayilan), tehlikeli icin \`danger\` kullanin.

**Yukleme durumunu kullanin.** Async islemler icin \`loading={true}\` verin; buton otomatik olarak devre disi olur.

**Boyutu baglama gore secin.** Tablo icinde \`xs\` veya \`sm\`, standart UI'da \`md\`, hero alanlarda \`lg\`.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`label\` olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. \`label\` zorunlu bir prop'tur.

**❌ Anlamsiz ikon kullanmak**
Kullanici ikonu taniyamiyorsa metin etiketli \`Button\` tercih edin.

**❌ Buton yerine dekoratif ikon olarak kullanmak**
IconButton etkilesimli bir elemandir. Salt gorsel ikon icin \`<span>\` icinde SVG kullanin.

**❌ Cok kucuk boyutlarda (\`xs\`) kritik aksiyonlar icin kullanmak**
Kucuk dokunma alani mobilde kullanim zorlugu yaratir; en az \`sm\` tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Etiketi:** \`label\` prop'u otomatik olarak \`aria-label\` olarak uygulanir. Ekran okuyucular butonun amacini duyurur.

**Klavye:** Native \`<button>\` elemani kullanir; \`Tab\` ile odaklanilir, \`Enter/Space\` ile etkinlestirilir.

**Odak Gostergesi:** \`focus-visible:ring-2\` ile WCAG 2.1 AA uyumlu gorunur odak halkasi saglanir.

**Devre Disi:** \`disabled\` veya \`loading\` durumunda \`pointer-events-none\` ve \`opacity-50\` uygulanir.

**Yukleme:** \`loading={true}\` durumunda \`Spinner\` gorsel geri bildirim saglar; buton otomatik devre disi olur.`,
      },
    ],
    relatedComponents: ["Button", "Tooltip", "Dropdown", "Spinner"],
  },

  Popover: {
    componentName: "Popover",
    summary: "Popover, bir tetikleyici elemana baglanarak zengin icerik gosteren overlay paneli bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Popover, bir tetikleyici elemana tiklandiginda, hover veya focus ile acilan zengin icerikli overlay paneli sunar. Dort tetikleme modu (\`click\`, \`hover\`, \`focus\`, \`hover-focus\`), dort yon (\`top\`, \`bottom\`, \`left\`, \`right\`), uc hizalama (\`start\`, \`center\`, \`end\`) ve carpma algilama (\`flipOnCollision\`) destekler.

Kontrollü (\`open\` + \`onOpenChange\`) ve kontrolsuz (\`defaultOpen\`) kullanim modlari, portal destegi, ok gostergesi ve erisim kontrolu (\`access\` prop) saglar.

\`\`\`tsx
<Popover
  trigger={<Button>Detaylar</Button>}
  title="Bilgi"
  content="Bu alan hakkinda detayli aciklama."
/>

<Popover
  trigger={<IconButton icon={<HelpIcon />} label="Yardim" />}
  content={<HelpPanel />}
  triggerMode="hover"
  side="right"
  align="start"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Zengin icerik gostermek icin (metin + link + buton kombinasyonu)
- Ek bilgi panelleri ve yardim balonlari icin
- Mini formlar veya onay panelleri icin
- Etkilesimli icerik gerektiren durumlarda (Tooltip yetersiz kaldiginda)

**Kullanmayin:**
- Kisa, salt-okunur bilgi icin — bunun yerine \`Tooltip\` kullanin
- Tam ekran odak gerektiren islemler icin — bunun yerine \`Modal\` veya \`Dialog\` kullanin
- Navigasyon menusu icin — bunun yerine \`Dropdown\` veya \`MenuBar\` kullanin
- Uzun form akislari icin — bunun yerine \`Drawer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
                ┌──────────────────────┐
                │  [Baslik]            │
                │                      │
                │  Icerik alani        │
                │  (herhangi bir       │
                │   ReactNode)         │
                └──────────┬───────────┘
                           ▼ (ok)
                   [Trigger Element]
\`\`\`

1. **Wrapper** — \`relative inline-flex\` div; tetikleyici ve panel konumlandirmasi
2. **Trigger Anchor** — \`children\` veya \`trigger\` prop'u; ARIA prop'lari otomatik eklenir
3. **Panel** — \`role="dialog"\`, premium surface stili, \`rounded-[24px]\`, \`p-4\`, portal ile render
4. **Baslik** (opsiyonel) — \`title\` prop'u ile \`font-semibold\` baslik satiri
5. **Ok** (opsiyonel) — \`showArrow={true}\` (varsayilan) ile yonlendirmeye gore konumlanan ucgen
6. **Portal** — Varsayilan olarak \`document.body\`'ye portal ile render edilir; \`disablePortal\` ile devre disi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tetikleme modunu dogru secin.** Ek bilgi icin \`hover\` veya \`hover-focus\`, aksiyonlar icin \`click\` kullanin.

**Gecikme ayarlayin.** Hover modunda \`openDelay\` ve \`closeDelay\` ile kaza ile acilmayi onleyin; varsayilan 90ms cogu durum icin uygundur.

**\`flipOnCollision\` aktif birakin.** Sayfa kenarinda panelin tasmamasi icin varsayilan \`true\` degerini degistirmeyin.

**\`title\` prop'u ile baglam saglayin.** Baslik eklemek kullaniciya panelin amacini hizla iletir.

**Erisim kontrolu icin \`access\` kullanin.** \`readonly\` veya \`disabled\` modlari ile politika temelli kontrol saglayin.

**Icerik boyutunu sinirli tutun.** Popover kisa, odakli icerik icindir; uzun icerik icin \`Drawer\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Popover icinde Popover kullanmak**
Ic ice overlay panelleri kullanici deneyimini bozar. Akisi yeniden tasarlayin.

**❌ Uzun formlar icin kullanmak**
5+ alan iceren formlar icin \`Modal\` veya \`Drawer\` daha uygundur.

**❌ Tooltip yerine kullanmak**
Kisa, salt-okunur bilgi icin Popover asiri yer kaplar; \`Tooltip\` yeterlidir.

**❌ Hover modunda etkilesimli icerik koymak**
Hover ile acilan panele buton koymak mobilde calismaz ve masaustunde zorluk yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Panel \`role="dialog"\` ve \`aria-modal="false"\` kullanir. \`title\` varsa \`aria-labelledby\`, yoksa \`aria-label\` uygulanir. Trigger uzerinde \`aria-haspopup="dialog"\` ve \`aria-expanded\` otomatik eklenir.

**Klavye:** \`Enter/Space\` ile acilir/kapanir. \`Escape\` ile kapanir ve odak trigger'a doner. \`ArrowDown/Up\` ile de acilabilir.

**Odak Yonetimi:** Kapandiginda odak trigger elemanina geri doner (\`restoreFocus\`).

**Erisim Kontrolu:** \`access\` prop'u ile \`disabled\`, \`readonly\`, \`hidden\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Dis Tiklama:** Panel disina tiklandiginda otomatik kapanir.`,
      },
    ],
    relatedComponents: ["Tooltip", "Dropdown", "Modal", "Drawer"],
  },

  Skeleton: {
    componentName: "Skeleton",
    summary: "Skeleton, icerik yuklenirken gorunen nabiz animasyonlu yer tutucu bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Skeleton, veri yuklenirken sayfadaki icerik alanlarini temsil eden gorsel yer tutucu bilesenidir. Nabiz (\`animate-pulse\`) animasyonu ile yukleme durumunu iletir.

Ozel boyut (\`width\`, \`height\`), daire modu (\`circle\`), coklu satir (\`lines\`) ve animasyon kontrolu (\`animated\`) destekler. Coklu satir modunda son satir otomatik olarak %75 genislikte render edilir.

\`\`\`tsx
<Skeleton width={200} height={16} />
<Skeleton circle height={40} />
<Skeleton lines={3} />
<Skeleton width="100%" height={120} animated={false} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- API cagirisi sirasinda icerik alanlarini temsil etmek icin
- Profil resimleri, metin bloklari ve kart iskeletleri icin
- Kullaniciya icerik yapisini onyuzlemek icin (layout shift onleme)
- Sayfa ilk yukleme durumunda tam sayfa iskelet gosterimi icin

**Kullanmayin:**
- Kisa sureli islemler icin — bunun yerine \`Spinner\` kullanin
- Butona entegre yukleme icin — bunun yerine Button'un \`loading\` prop'unu kullanin
- Bos durum gosterimi icin — bunun yerine \`Empty\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Tekli:
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← animate-pulse
└──────────────────────────────┘

Daire:
    ┌───────┐
    │ ░░░░░ │
    └───────┘

Coklu satir (lines={3}):
┌──────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  100%
│  ░░░░░░░░░░░░░░░░░░░░░░░░░  │  100%
│  ░░░░░░░░░░░░░░░░░░░░      │  75% (son satir)
└──────────────────────────────┘
\`\`\`

1. **Container** — \`div\` elemani; \`rounded-lg\`, \`bg-[surface-muted]\`
2. **Animasyon** — \`animate-pulse\` ile nabiz efekti (varsayilan acik)
3. **Boyut** — \`width\` (varsayilan: 100%) ve \`height\` (varsayilan: 16px) ile kontrol
4. **Daire Modu** — \`circle={true}\` ile \`rounded-full\`; genislik \`height\` degerinden otomatik alinir
5. **Coklu Satir** — \`lines\` prop'u ile istifli satir gruplari; son satir %75 genislikte`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Gercek icerik yapisini taklit edin.** Kart skeleton'i, kartla ayni boyut ve yerlestirmede olmalidir; layout shift onlenir.

**Avatar icin \`circle\` kullanin.** \`circle={true} height={40}\` ile avatar placeholder olusturun.

**Metin bloklari icin \`lines\` kullanin.** \`lines={3}\` ile paragraf yer tutucusu olusturun; son satirin kisa olmasi dogal gorunur.

**Animasyonu yalnizca gerektiginde kapatin.** \`animated={false}\` sadece ozel animasyon gerektiren durumlarda kullanin.

**Boyutlari CSS degerleri ile eslestiirin.** Gercek icerik ile ayni \`width\` ve \`height\` degerlerini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Spinner yerine her yerde kullanmak**
Kisa islemler icin (buton tiklama, form gonderme) Skeleton asiri gorsel agirlik yaratir; \`Spinner\` yeterlidir.

**❌ Gercek icerik yapisindan farkli boyutlar kullanmak**
Skeleton ve gercek icerik boyut uyumsuzlugu layout shift yaratir; kullanici deneyimini bozar.

**❌ Surekli skeleton gostermek**
Uzun sureli yukleme durumlarinda (5+ saniye) skeleton yerine ilerleme gostergesi veya mesaj ekleyin.

**❌ Animasyonsuz skeleton'i stilsiz birakmak**
\`animated={false}\` kullandiginda bos gri kutu gibi gorunur; ozel stil eklemeyi dusunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Skeleton bir \`div\` elemanidir ve gorsel yer tutucudur. Icerik yuklenmekte oldugunu belirtmek icin container'a \`aria-busy="true"\` ekleyin.

**Ekran Okuyucu:** Skeleton kendisi erisim bilgisi tasimaz. Sarmalayan container'da \`aria-label="Icerik yukleniyor"\` kullanin.

**Animasyon:** \`prefers-reduced-motion\` medya sorgusuna duyarli olarak animasyon otomatik azaltilabilir.

**Kontrast:** \`surface-muted\` arkaplan rengi ile cevre arkaplan arasinda yeterli gorsel ayrim saglanir.`,
      },
    ],
    relatedComponents: ["Spinner", "Empty", "Card"],
  },

  Spinner: {
    componentName: "Spinner",
    summary: "Spinner, devam eden bir islemi gorsel olarak gosteren donme animasyonlu yukleme gostergesidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Spinner, bir islemin devam ettigini kullaniciya ileten donme animasyonlu SVG bilesenidir. Bes boyut (\`xs\`, \`sm\`, \`md\`, \`lg\`, \`xl\`) ve iki gorunum modu (\`inline\`, \`block\`) destekler.

\`inline\` modda sadece donen daire, \`block\` modda ortalanmis daire + etiket metni gosterilir. \`label\` prop'u hem gorsel hem de erisim icin metin saglar.

\`\`\`tsx
<Spinner />
<Spinner size="lg" label="Yukleniyor..." />
<Spinner mode="block" label="Veriler getiriliyor" />
<Spinner size="xs" />  {/* IconButton icinde kullanilir */}
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Buton veya form gonderim islemlerinde kisa sureli yukleme gostermek icin
- API cagirisi sirasinda inline yukleme gostergesi olarak
- Block modda bolum veya sayfa yukleme gostergesi olarak
- IconButton icinde yukleme durumu icin (\`size="xs"\`)

**Kullanmayin:**
- Sayfa icerik yapisi belli oldugunda — bunun yerine \`Skeleton\` kullanin
- Uzun sureli islemlerde ilerleme gostermek icin — bunun yerine ilerleme cubugu kullanin
- Dekoratif animasyon olarak — Spinner yalnizca yukleme durumu icin kullanilmalidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Inline mod:
  (○)  ← Donen daire SVG

Block mod:
┌──────────────────────────┐
│                          │
│          (○)             │
│    "Yukleniyor..."       │
│                          │
└──────────────────────────┘
\`\`\`

1. **SVG Daire** — \`animate-spin\` ile donen iki katmanli daire; dis halka %25 opaklik, ic yay %75
2. **Boyut** — \`size\` prop'u ile \`h-3 w-3\` (xs) ile \`h-8 w-8\` (xl) arasi
3. **Etiket** (block mod) — \`label\` prop'u ile dairenin altinda \`text-sm font-medium\` metin
4. **Block Container** — \`flex flex-col items-center justify-center gap-3 py-6\` ile ortalanmis gorunum
5. **Renk** — \`currentColor\` kullanir; ust bilesenin metin rengini devralir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli etiket saglayin.** Varsayilan "Loading" yerine baglama uygun bir metin kullanin: "Kaydediliyor...", "Veriler getiriliyor".

**Boyutu baglama gore secin.** Buton icinde \`xs\`/\`sm\`, inline gostergeler icin \`md\`, sayfa yuklemesi icin \`lg\`/\`xl\` kullanin.

**Block modu bolum yuklemesi icin tercih edin.** Ortalanmis gorunum + etiket ile kullaniciya net bilgi sunun.

**Spinner suresini makul tutun.** 5+ saniye suren islemler icin ilerleme gostergesi veya iptal secenegi ekleyin.

**Renk devralmayi kullanin.** \`currentColor\` sayesinde ust bilesenin rengi otomatik uygulanir; ozel renk icin \`className\` ile gecersiz kilin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa iskelet yapisi yerine kullanmak**
Icerik yapisi belli oldugunda Skeleton ile yer tutucu gosterin; Spinner yalnizca belirsiz sureli islemler icindir.

**❌ Etiketsiz kullanmak**
Ekran okuyucular icin \`label\` prop'u gereklidir. Varsayilan "Loading" genellikle yeterli degildir.

**❌ Cok kucuk boyutlarda tek basina kullanmak**
\`xs\` boyut yalnizca baska bir bilesen icinde (IconButton) kullanilmalidir; tek basina gorunmez olabilir.

**❌ Dekoratif animasyon olarak kullanmak**
Spinner yukleme durumunu iletir; animasyon gerektiren baska durumlar icin ozel animasyon kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`role="status"\` ile ekran okuyucular bileseni durum gostergesi olarak tanir. \`aria-label\` ile yukleme metni duyurulur.

**Ekran Okuyucu:** \`label\` prop'u \`aria-label\` olarak uygulanir. Block modda etiket gorsel olarak da gosterilir.

**Animasyon:** \`animate-spin\` CSS animasyonu kullanir; \`prefers-reduced-motion\` tercihleri icin Tailwind otomatik azaltma saglar.

**Renk Kontrasti:** \`currentColor\` ile ust bilesenin kontrastini devralir; ek ayarlama gerektirmez.`,
      },
    ],
    relatedComponents: ["Skeleton", "Button", "IconButton"],
  },

  Card: {
    componentName: "Card",
    summary: "Card, icerik gruplarina gorsel cerceve, golge ve bosluk saglayan yukseltilmis container bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Card, iliskili icerik gruplarini gorsel olarak cevreleme amaciyla kullanilan container bilesenidir. Dort varyant (\`elevated\`, \`outlined\`, \`filled\`, \`ghost\`), dort bosluk secenegi (\`none\`, \`sm\`, \`md\`, \`lg\`), hover efekti (\`hoverable\`) ve polimorfik eleman destegi (\`as\`) sunar.

Alt bilesenler olan \`CardHeader\`, \`CardBody\` ve \`CardFooter\` ile yapilandirilmis icerik duzeni saglar.

\`\`\`tsx
<Card variant="elevated" padding="md">
  <CardHeader title="Proje Ozeti" subtitle="Son guncelleme: bugun" action={<IconButton icon={<MoreIcon />} label="Daha fazla" />} />
  <CardBody>Proje icerik alani...</CardBody>
  <CardFooter>
    <Button variant="ghost" size="sm">Iptal</Button>
    <Button variant="primary" size="sm">Kaydet</Button>
  </CardFooter>
</Card>

<Card variant="outlined" hoverable onClick={handleClick}>
  Tiklanabilir kart icerigi
</Card>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Iliskili icerik gruplarini gorsel olarak ayirmak icin
- Dashboard widget'lari, istatistik kartlari, ozet panelleri icin
- Liste ogeleri veya grid kartlari olarak
- Tiklanabilir icerik konteynerleri icin (\`hoverable\` + \`onClick\`)

**Kullanmayin:**
- Sayfa duzeni icin — bunun yerine \`Stack\` veya layout bilesenleri kullanin
- Modal veya dialog penceresi icin — bunun yerine \`Modal\` kullanin
- Navigasyon paneli icin — bunun yerine \`NavigationRail\` kullanin
- Tek satir bilgi icin — bunun yerine \`Alert\` veya \`Badge\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Baslik]          [Aksiyon?]    │ ← CardHeader
│  [Alt baslik]                    │
├──────────────────────────────────┤
│                                  │
│  [Icerik alani]                  │ ← CardBody
│                                  │
├──────────────────────────────────┤
│  [Aksiyon 1]  [Aksiyon 2]       │ ← CardFooter
└──────────────────────────────────┘
\`\`\`

1. **Card Container** — \`div\` elemani; \`rounded-2xl\`, varyanta gore border/shadow/bg
2. **CardHeader** — \`title\`, \`subtitle\` ve \`action\` slotlari; flex layout
3. **CardBody** — \`mt-3\` ile basliktan ayrilmis ana icerik alani
4. **CardFooter** — \`mt-4\`, \`border-t\` ile ust ayirici, \`gap-2\` ile aksiyonlar
5. **Hover Efekti** — \`hoverable={true}\` ile \`cursor-pointer\`, border renk degisimi ve \`active:scale-[0.99]\``,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Varyanti amacina gore secin.** Dashboard icin \`elevated\`, form gruplari icin \`outlined\`, arka plan paneli icin \`filled\`, minimal gorunum icin \`ghost\`.

**Alt bilesenleri yapisal kullanin.** \`CardHeader\` + \`CardBody\` + \`CardFooter\` ile tutarli icerik hiyerarsisi kurun.

**Tiklanabilir kartlarda \`hoverable\` kullanin.** Gorsel geri bildirim saglar; \`active:scale\` ile tiklama hissi verir.

**Boslugu baglama gore ayarlayin.** \`padding="sm"\` yogun listeler icin, \`padding="lg"\` genis dashboard kartlari icin.

**\`as\` prop'unu semantik amaclir kullanin.** Blog kartlari icin \`as="article"\`, bolum gruplari icin \`as="section"\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Ic ice cok fazla kart kullanmak**
Kart icinde kart gorsel karisiklik yaratir. Bir seviye ile sinirli tutun.

**❌ Tum sayfa icerigini tek bir karta sarmak**
Kart, icerik gruplama icindir; sayfa duzeni icin layout bilesenleri kullanin.

**❌ \`hoverable\` ile birlikte \`onClick\` eklememek**
Hover efekti etkilesim beklentisi yaratir; tiklanabilirlik saglanmalidir.

**❌ \`ghost\` varyantini padding olmadan kullanmak**
\`variant="ghost" padding="none"\` icerigin cercevesiz gorunmesine neden olur; bosluk veya farkli varyant ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Varsayilan olarak \`div\` render eder. \`as="article"\` veya \`as="section"\` ile uygun semantik eleman secin.

**Tiklanabilir Kart:** \`as="button"\` ile \`role="button"\` ve \`tabIndex={0}\` otomatik eklenir; klavye ile etkilesim saglanir.

**Odak Gostergesi:** Tiklanabilir kartlar icin gorunur odak gostergesi saglanmalidir.

**Baslik Iliskilendirme:** \`CardHeader\` icerisindeki \`title\` ile \`aria-labelledby\` iliskisi kurun.

**Renk Kontrasti:** Tum varyantlar WCAG 2.1 AA uyumlu kontrast orani saglar.`,
      },
    ],
    relatedComponents: ["Stack", "Divider", "Alert", "Modal"],
  },

  Breadcrumb: {
    componentName: "Breadcrumb",
    summary: "Breadcrumb, sayfanin navigasyon hiyerarsisini gorsel olarak gosteren yol haritasi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Breadcrumb, kullanicinin sayfa hiyerarsisindeki konumunu gosteren ve ust sayfalara hizli donusu saglayan navigasyon bilesenidir. Her oge (\`BreadcrumbItem\`) icin etiket, ikon, \`href\` ve \`onClick\` desteklenir.

Ozel ayirici (\`separator\`), maksimum oge sayisi ile otomatik daralma (\`maxItems\`) ve son ogenin aktif sayfa olarak isaretlenmesi (\`aria-current="page"\`) saglanir.

\`\`\`tsx
<Breadcrumb items={[
  { label: "Ana Sayfa", icon: <HomeIcon />, onClick: () => navigate("/") },
  { label: "Projeler", onClick: () => navigate("/projects") },
  { label: "Proje Detay" },
]} />

<Breadcrumb
  items={longItems}
  maxItems={4}
  separator={<span>/</span>}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Cok seviyeli sayfa hiyerarsisini gostermek icin (2+ seviye)
- Kullanicinin konumunu netlestirmek icin
- Ust sayfalara hizli donusu saglamak icin
- Detay sayfalarinda ust baglami korumak icin

**Kullanmayin:**
- Tek seviyeli sayfalarda — breadcrumb gereksizdir
- Adim adim surecler icin — bunun yerine \`Steps\` bileseni kullanin
- Sekmeli navigasyon icin — bunun yerine \`Tabs\` kullanin
- Ana navigasyon olarak — bunun yerine \`NavigationRail\` veya \`MenuBar\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Icon] Ana Sayfa  >  Projeler  >  Proje Detay (aktif)
  ↑                    ↑             ↑
  link               link         aktif sayfa

Daraltilmis (maxItems=3):
[Icon] Ana Sayfa  >  ...  >  Alt Bolum  >  Proje Detay
\`\`\`

1. **Nav Container** — \`<nav aria-label="Breadcrumb">\` ile semantik navigasyon
2. **Liste** — \`<ol>\` elemani; \`flex items-center gap-1.5\` ile yatay duzenleme
3. **Oge (link)** — \`<button>\` elemani; \`text-xs text-secondary\`, hover ile renk degisimi
4. **Aktif Oge** — Son oge \`<span>\` olarak render; \`text-primary font-medium\`, \`aria-current="page"\`
5. **Ayirici** — Varsayilan chevron SVG ikonu; \`separator\` prop'u ile ozellestirilir
6. **Daralma** — \`maxItems\` asildiginda "..." ile ara ogeler gizlenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sayfa basliginin altina yerlestirin.** Breadcrumb genellikle sayfa basliginin uzerinde veya hemen altinda konumlanir.

**Ilk ogeye ikon ekleyin.** Ana Sayfa icin ev ikonu gorsel yol haritasini guclendirrir.

**\`maxItems\` ile uzun yollari daraltiin.** 5+ seviyeli hiyerarsilerde \`maxItems={4}\` ile gorsel temizlik saglayin.

**Son ogeyi tiklanabilir yapmayin.** Aktif sayfa breadcrumb'inda link olmamalidir; metin olarak gorunmelidir.

**Etiketleri kisa tutun.** 1-3 kelime ideal; uzun basliklar icin kisaltilmis versiyonlar kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek ogeli breadcrumb kullanmak**
Hiyerarsi yoksa breadcrumb gereksizdir; en az 2 seviye olmalidir.

**❌ Son ogeyi tiklanabilir yapmak**
Aktif sayfa zaten bulundugumuz sayfa; kendine link vermek anlamsizdir.

**❌ Cok uzun etiketler kullanmak**
Breadcrumb yer kaplar ve satir kirar. Kisa, ozet etiketler kullanin.

**❌ Ana navigasyon olarak kullanmak**
Breadcrumb yardimci navigasyondur; ana navigasyon icin sidebar veya navbar kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`<nav aria-label="Breadcrumb">\` ile ekran okuyucular navigasyon amacini tanir.

**Aktif Sayfa:** Son oge \`aria-current="page"\` ile isaretlenir; ekran okuyucular mevcut konumu duyurur.

**Klavye:** Tum link ogeleri \`<button>\` elemani kullanir; \`Tab\` ile gezinilir, \`Enter/Space\` ile etkinlestirilir. \`focus-visible:ring\` ile gorunur odak gostergesi saglanir.

**Ayirici:** Ayirici elemanlar \`aria-hidden\` ile isaretlenir; ekran okuyucular tarafindan atlanir.

**Semantik Liste:** \`<ol>\` elemani ile ogeler siralanir; ekran okuyucular hiyerarsiyi sirasina gore duyurur.`,
      },
    ],
    relatedComponents: ["Tabs", "Steps", "NavigationRail", "Link"],
  },

  Accordion: {
    componentName: "Accordion",
    summary: "Accordion, icerik bolumlerini acilip kapanabilen paneller halinde duzenleyerek gorsel yogunlugu azaltan bir bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Accordion, birden fazla icerik bolumunu baslik + acilir panel yapisinda sunar. Iki secim modu (\`single\`, \`multiple\`), iki boyut (\`sm\`, \`md\`), cerceveli (\`bordered\`) ve seffaf (\`ghost\`) gorunum, ok pozisyonu (\`expandIconPosition\`), ozel ikon ve ic ice accordion destekler.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) kullanim modlari, erisim kontrolu (\`access\` prop), panel yikma (\`destroyOnHidden\`) ve \`collapsible\` modlari (\`header\`, \`icon\`, \`disabled\`) saglar.

Uc hazir preset (\`faq\`, \`compact\`, \`settings\`) ile hizli yapilandirma mumkundur.

\`\`\`tsx
<Accordion
  items={[
    { value: "about", title: "Hakkinda", content: "Detayli aciklama..." },
    { value: "faq", title: "SSS", content: "Sik sorulan sorular...", description: "Yardim merkezi" },
    { value: "contact", title: "Iletisim", content: "Bize ulasin...", extra: <Badge variant="info">Yeni</Badge> },
  ]}
  selectionMode="single"
/>

<Accordion
  items={sections}
  ghost
  disableGutters
  expandIconPosition="end"
  collapsible="icon"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- SSS (FAQ) sayfalarinda soru-cevap bloklari icin
- Ayar panellerinde kategori bazli gruplama icin
- Uzun icerik listelerini daraltarak gorsel yogunlugu azaltmak icin
- Yan panel veya dar alanlarda icerik organizasyonu icin

**Kullanmayin:**
- Icerik ayni anda gorunur olmali ise — bunun yerine acik liste veya \`Card\` gruplari kullanin
- Navigasyon sekmeleri icin — bunun yerine \`Tabs\` kullanin
- Adim adim surecler icin — bunun yerine \`Steps\` kullanin
- Tek acilir bolum icin — bunun yerine \`Disclosure\` veya \`Collapsible\` dusunun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [▼]  Baslik 1           [Extra?]   │ ← trigger (acik)
│        Aciklama                      │
├──────────────────────────────────────┤
│  Panel icerigi...                    │ ← region
├──────────────────────────────────────┤
│  [▶]  Baslik 2           [Extra?]   │ ← trigger (kapali)
│        Aciklama                      │
├──────────────────────────────────────┤
│  [▶]  Baslik 3                       │ ← trigger (kapali)
└──────────────────────────────────────┘
\`\`\`

1. **Kok Container** — \`rounded-[24px]\`, premium surface stili (bordered modda)
2. **Item** — Her bolum; \`border-t\` ile ust ayirici (ilk haric)
3. **Trigger** — \`<button>\` veya \`<div>\` + ikon buton; \`aria-expanded\`, \`aria-controls\`
4. **Baslik Blogu** — \`title\`, \`description\` ve \`extra\` slotlari
5. **Ikon** — Chevron SVG; \`rotate-180\` ile acik durum animasyonu
6. **Panel** — \`role="region"\`, \`aria-labelledby\` ile iliskilendirilmis icerik alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secim modunu amacina gore secin.** SSS icin \`single\` (tek acik panel), ayar panelleri icin \`multiple\` (birden fazla acik) kullanin.

**Varsayilan acik panel belirleyin.** En onemli veya en sik kullanilan bolumu \`defaultExpanded: true\` ile acik baslatin.

**\`description\` ile baglam saglayin.** Her bolumun icerigini ozetleyen kisa aciklama ekleyin.

**\`extra\` slotunu durum gostergeleri icin kullanin.** Badge, ikon veya sayi ile ek bilgi sunun.

**Preset'leri kullanin.** \`createAccordionPreset("faq")\` ile standart yapilandirmalari hizla uygulayin.

**\`collapsible="icon"\` ile baslik alanini koruyun.** Sadece ok ikonuna tiklandiginda acilsin; baslik alani baska amaclar icin kullanilabilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla bolum eklemek**
10+ bolum gorsel yogunluk yaratir; gruplama veya alt navigasyon ile organize edin.

**❌ Cok kisa icerikli paneller olusturmak**
Tek satirlik icerik icin Accordion gereksiz agirlik ekler; dogrudan gosterin.

**❌ \`destroyOnHidden={false}\` ile buyuk icerik yuklemek**
Tum paneller DOM'da kalir ve performansi etkiler; varsayilan \`true\` degerini koruyun.

**❌ Ic ice accordion'u asiri derinlestirmek**
2 seviyeden fazla ic ice accordion kullanicida kaybolma hissine neden olur.

**❌ Tum panelleri kapali basllatmak**
En az bir paneli acik baslatin veya kullaniciya neyi acacagini gosteren net basliklar yazin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Her trigger \`aria-expanded\` ve \`aria-controls\` ile panele baglanir. Panel \`role="region"\` ve \`aria-labelledby\` ile baslika iliskilendirilir. Kok eleman \`aria-label\` ile amac belirtir.

**Klavye:** \`Tab\` ile trigger'lar arasinda gezinilir. \`Enter/Space\` ile panel acilir/kapanir.

**Baslik Semantigi:** Her trigger bir \`<h3>\` icinde yer alir; sayfa baslik hiyerarsisine uyum saglar.

**Devre Disi:** \`disabled: true\` veya \`collapsible: "disabled"\` durumunda \`aria-disabled\` eklenir, \`opacity-60\` uygulanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` ve \`readonly\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Panel Gizleme:** \`hidden\` attribute ve \`aria-hidden\` ile kapali paneller ekran okuyuculardan gizlenir.`,
      },
    ],
    relatedComponents: ["Tabs", "Card", "Steps", "Disclosure"],
  },

  DatePicker: {
    componentName: "DatePicker",
    summary: "DatePicker, kullanicidan tarih bilgisi almak icin kullanilan form alanidir. Native HTML date input uzerine kurulu olup label, hata durumu, erisim kontrolu ve kontrollü/kontrolsuz kullanim modlarini destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DatePicker, native \`<input type="date">\` uzerine insa edilmis bir tarih secim bileşenidir. FieldControlShell ile sarilanarak label, description, hint ve error yonetimini standart hale getirir.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari, \`min\`/\`max\` ile tarih araligi kisitlamasi, boyut varyantlari (\`sm\`, \`md\`, \`lg\`) ve erisim kontrolu (\`access\` prop) desteklenir. Secili tarih veya "Select date" etiketi bir badge ile gorsel olarak gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form icinde tarih bilgisi alinmasi gerektiginde (dogum tarihi, baslangic/bitis tarihi)
- Tarih araligini \`min\`/\`max\` ile sinirlamak istediginizde
- Mevcut form alanlari ile tutarli gorunum saglamak icin

**Kullanmayin:**
- Tarih ve saat birlikte gerekiyorsa — bunun yerine ozel bir datetime bileseni kullanin
- Tarih araligi (range) secimi gerekiyorsa — iki DatePicker veya ozel DateRangePicker kullanin
- Serbest metin tarih girisi gerekiyorsa — bunun yerine \`Input\` ile maskeleme kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────┐
│  [date input]     [tarih badge]  │
└──────────────────────────────────┘
  Helper text / Error message
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Frame** — Boyut ve ton'a gore stillendirilmis dis cerceve
3. **Native Input** — \`type="date"\` ile tarayici tarih secicisi
4. **Tarih Badge** — Secili tarihi veya placeholder metni gosteren etiket
5. **Focus Ring** — Klavye odagi icin gorunen halka`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Label kullanin.** Her DatePicker'a amacini aciklayan bir label ekleyin.

**\`min\`/\`max\` ile sinirlayin.** Gecmis veya gelecek tarih kisitlamalari icin min/max prop'larini kullanin.

**Hata mesajlarini aciklayici yapin.** "Gecersiz tarih" yerine "Baslangic tarihi bugunun tarihinden sonra olmalidir" yazin.

**\`fullWidth\` ayarini konuma gore secin.** Form icinde \`true\` (varsayilan), aralik veya filtre araclari icinde \`false\` kullanin.

**\`onValueChange\` tercih edin.** String tarih degeri dogrudan almak icin native \`onChange\` yerine \`onValueChange\` callback'ini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Label olmadan kullanmak**
Ekran okuyucular alani tanimlayamaz; her zaman \`label\` prop'u saglayin.

**❌ \`min\`/\`max\` olmadan tarih toplama**
Kullanici 1900 veya 2099 gibi anlamsiz tarihler girebilir.

**❌ Sadece \`onChange\` ile string parse etmek**
\`onValueChange\` dogrudan ISO string dondurur; gereksiz \`event.target.value\` isleminden kacinin.

**❌ \`disabled\` durumunu aciklama olmadan kullanmak**
Neden devre disi oldugunu \`accessReason\` ile belirtin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Native Semantik:** \`<input type="date">\` kullanildigi icin tarayicinin yerlesik tarih secicisi ve ekran okuyucu destegi otomatik saglanir.

**ARIA:** \`aria-invalid\`, \`aria-readonly\`, \`aria-disabled\` ve \`aria-describedby\` ile hint/error mesajlari iliskilendirilir.

**Klavye:** Tab ile odaklanilir, tarayici tarih secicisi klavye ile kullanilabilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`readonly\` (degisiklik engellenir) ve \`disabled\` modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Zorunlu Alan:** \`required\` prop'u ile \`required\` HTML attribute'u eklenir.`,
      },
    ],
    relatedComponents: ["Input", "Select", "TimePicker"],
  },

  Steps: {
    componentName: "Steps",
    summary: "Steps, cok adimli is akislarinda ilerleme durumunu gorsel olarak gosteren bir navigasyon bilesenidir. Yatay ve dikey yonlendirme, dot stili, hata durumu ve tiklanabilir adimlar destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Steps, cok adimli sureclerde kullanicinin hangi adimda oldugunu, tamamlanan adimlari ve kalan adimlari gorsel olarak iletir.

Her adim bir \`StepItem\` nesnesi ile tanimlanir ve \`title\`, \`description\`, \`icon\`, \`disabled\` gibi ozellikler icerir. Bileşen yatay (\`horizontal\`) ve dikey (\`vertical\`) yonlendirme, uc boyut (\`sm\`, \`md\`, \`lg\`), dot stili ve \`error\` durumu destekler. \`onChange\` ile adimlar arasi tiklanabilir navigasyon saglanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form sihirbazlarinda (wizard) adim ilerlemesini gostermek icin
- Basvuru, kayit veya siparis sureclerini gorsel olarak takip etmek icin
- Dikey zaman cizelgesi benzeri akislarda ilerleme gostermek icin

**Kullanmayin:**
- Icerik sekmeleri icin — bunun yerine \`Tabs\` kullanin
- Tek adimli islemler icin — Steps gereksiz karmasiklik ekler
- Sayfa navigasyonu icin — bunun yerine \`Breadcrumbs\` veya \`NavLink\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
Yatay:
───[1]────────[2]────────[3]───
  Adim 1      Adim 2      Adim 3
  Aciklama    Aciklama    Aciklama

Dikey:
  [1] Adim 1 — Aciklama
   │
  [2] Adim 2 — Aciklama
   │
  [3] Adim 3 — Aciklama
\`\`\`

1. **Container** — \`role="list"\` ile adim listesini sarar
2. **Step Indicator** — Numara, ikon veya check isareti gosteren yuvarlak buton
3. **Connector** — Adimlar arasi ilerleme cizgisi (\`bg-[var(--action-primary)]\` tamamlanan, \`bg-[var(--border-default)]\` bekleyen)
4. **Title** — Adim baslik metni
5. **Description** — Opsiyonel aciklama metni
6. **Dot Modu** — \`dot={true}\` ile kucuk daire gostergesi (numara yerine)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Adim sayisini sinirli tutun.** 3-7 adim idealdir; fazlasi kullaniciyi bunaltir.

**Aciklayici basliklar yazin.** "Adim 1" yerine "Kisisel Bilgiler" gibi anlam tasiyan basliklar kullanin.

**\`description\` ile baglam saglayin.** Her adimin icerigi hakkinda kisa bilgi ekleyin.

**\`dot\` stilini basit akislarda kullanin.** Adim numarasi gereksiz oldugunda \`dot={true}\` ile minimal gorunum saglayin.

**Hata durumunu belirtin.** Aktif adimda sorun varsa \`status="error"\` ile kullaniciyi bilgilendirin.

**Dar alanlarda dikey yonlendirme secin.** Yan panel veya mobil goruntulerde \`direction="vertical"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 10+ adimli is akisi olusturmak**
Kullanici sureci tamamlayamayacagini hisseder; adimlari gruplama ile saderlestirin.

**❌ Tamamlanmamis adima atlamaya izin vermek**
Dogrulama yapilmadan ileri adima gecis veri kayiplarına neden olur.

**❌ Adim basliklarini belirsiz birakmak**
"Adim 1", "Adim 2" gibi genel basliklar kullaniciya yol gostermez.

**❌ Yatay modda uzun basliklar kullanmak**
Basliklar tasar ve duzeni bozar; kisa basliklar veya dikey mod tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Kok eleman \`role="list"\` ve \`aria-label="Progress steps"\`, her adim \`role="listitem"\` ile isaretlenir.

**Aktif Adim:** \`aria-current="step"\` ile ekran okuyuculara mevcut adim bildirilir.

**Klavye:** Her adim gostergesi \`<button>\` elemanidir; \`Tab\` ile odaklanilir, \`Enter/Space\` ile tiklanir. \`disabled\` adimlar atlanir.

**Focus Ring:** \`focus-visible:ring-2\` ile gorunen odak halkasi WCAG 2.1 AA gereksinimlerini karsilar.

**Etiketleme:** Her buton \`aria-label\` ile "Step 1: Baslik" formatinda tanimlanir.`,
      },
    ],
    relatedComponents: ["Tabs", "Breadcrumbs", "ProgressBar", "Accordion"],
  },

  List: {
    componentName: "List",
    summary: "List, dikey duzende interaktif veya statik oge listesi goruntuleyen bilesendir. Secim, tonlama, badge, skeleton yukleme ve bos durum yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `List, veri ogelerini dikey bir liste halinde goruntuleyen cok amacli bilesendir. Her oge \`title\`, \`description\`, \`meta\`, \`prefix\`, \`suffix\` ve \`badges\` slotlari ile zenginlestirilebilir.

Premium surface stili, ton bazli renklendirme (\`default\`, \`info\`, \`success\`, \`warning\`, \`danger\`), iki yogunluk modu (\`comfortable\`, \`compact\`), skeleton yukleme durumu ve bos durum yonetimi destekler. \`onItemSelect\` ile secim yapilabilir; \`selectedKey\` ile secili oge vurgulanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kayit listelerini (kullanicilar, gorevler, bildirimler) goruntumek icin
- Secim yapilabilir oge listesi sunmak icin
- Badge ve meta bilgisi ile zenginlestirilmis liste gorunum gerektiren yerlerde

**Kullanmayin:**
- Tablo formatinda sutunlu veri gosterimi icin — bunun yerine \`Table\` veya \`TreeTable\` kullanin
- Navigasyon menusu icin — bunun yerine \`NavList\` veya \`Menu\` kullanin
- Kart duzeni gerektiren icerikler icin — bunun yerine \`Card\` gruplari kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik (title)
  Aciklama (description)
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ [Prefix] Title [Badge]   [Meta] │ │
│ │          Description    [Suffix]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Prefix] Title [Badge]   [Meta] │ │
│ │          Description    [Suffix]│ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
\`\`\`

1. **Section Container** — Baslik ve aciklama ile liste cercevesi
2. **Surface** — \`rounded-[28px]\`, premium gradient ve golge stili
3. **Item** — Ton bazli arka plan ile \`rounded-[24px]\` kart
4. **Prefix** — Sol tarafta ikon veya avatar alani
5. **Title & Badges** — Baslik metni ve etiketler
6. **Meta & Suffix** — Sag tarafta ust bilgi ve ek icerik`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Ton'u amaca gore kullanin.** Uyari mesajlari icin \`warning\`, hata durumlari icin \`danger\` tonu atanin.

**\`compact\` yogunlugu yogun listelerde kullanin.** 10+ ogeli listelerde dikey alani azaltir.

**Badge ile durum bilgisi ekleyin.** String badge'ler otomatik olarak ton'a uygun Badge bilesenine donusturulur.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile liste bos oldugunda anlamli mesaj gosterin.

**Yukleme durumunu belirtin.** \`loading={true}\` ile skeleton gostergesi otomatik olarak goruntulenir.

**Erisim kontrolunu uygulayin.** \`access\` prop'u ile kisitli kullanicilar icin goruntulemeyi yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 50+ oge icin sayfalama olmadan kullanmak**
Uzun listeler performans ve kullanilabilirlik sorunlari yaratir; sayfalama veya sanal kaydirma ekleyin.

**❌ Tum ogelere farkli ton atamak**
Renk carpanligi gorsel kaos yaratir; ton'u anlamli durumlara ayirin.

**❌ \`onItemSelect\` olmadan secim beklentisi olusturmak**
Hover efekti olan ancak tiklanamayan ogeler kullaniciyi yaniltir.

**❌ Bos durum mesajini yonetmemek**
Varsayilan Ingilizce mesaj yerine turkce \`emptyStateLabel\` saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Liste ogeleri \`<ul>\`/\`<li>\` ile isaretlenir. Interaktif modda her oge \`<button>\` icine alinir.

**Secim:** Secili oge \`aria-current="true"\` ile belirtilir.

**Yukleme:** \`aria-busy\` ile yukleme durumu ekran okuyuculara bildirilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` (etkilesim engellenir) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Devre Disi Oge:** \`disabled\` ogelere tiklandiginda \`event.preventDefault()\` ve \`event.stopPropagation()\` uygulanir.`,
      },
    ],
    relatedComponents: ["Table", "Card", "NavList", "TreeTable"],
  },

  Combobox: {
    componentName: "Combobox",
    summary: "Combobox, arama yapilabilir acilir secim alanidir. Tekli, coklu ve etiket modlari, grup destegi, serbest metin girisi (freeSolo), portal popup ve zengin klavye navigasyonu sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Combobox, Select bileseninin arama ve filtreleme yetenekleriyle genisletilmis halidir. Kullanici metin yazarak secenekleri daraltir veya \`freeSolo\` modunda yeni degerler olusturur.

Uc secim modu (\`single\`, \`multiple\`, \`tags\`), gruplandirmali secenekler, debounce'lu async arama (\`onQueryRequest\`), portal veya inline popup stratejisi, otomatik flip (ust/alt), kontrollü/kontrolsuz input ve deger yonetimi, erisim kontrolu ve zengin ARIA destegi sunar.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uzun secenek listesinde arama ile secim yapmak icin
- Birden fazla deger secimi veya etiket olusturma gerektiginde
- Sunucudan async secenek yuklemesi gerektiginde (\`onQueryRequest\`)
- Kullanicinin mevcut secenekler disinda yeni deger girmesi gerektiginde (\`freeSolo\`)

**Kullanmayin:**
- 5-10 sabit secenek icin — bunun yerine \`Select\` yeterlidir
- Arama olmadan basit secim icin — bunun yerine \`Select\` veya \`RadioGroup\` kullanin
- Tam metin girisi icin — bunun yerine \`Input\` veya \`Textarea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────────┐
│ [Tag] [Tag] [arama inputu...] [▾] [x]│
└──────────────────────────────────────┘
  ┌────────────────────────────────────┐
  │  GRUP BASLIGI                      │
  │  ┌──────────────────────────────┐  │
  │  │ Secenek 1         Secili     │  │
  │  │ Aciklama                     │  │
  │  └──────────────────────────────┘  │
  │  ┌──────────────────────────────┐  │
  │  │ Secenek 2                    │  │
  │  └──────────────────────────────┘  │
  └────────────────────────────────────┘
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Input Frame** — Etiketler ve arama alani iceren cerceve
3. **Tag'lar** — Coklu/etiket modunda secili degerlerin badge gosterimi
4. **Arama Input** — \`role="combobox"\` ile tanimli metin alani
5. **Clear Butonu** — Secimi temizleme (\`clearable\` prop)
6. **Popup Listbox** — Gruplanmis secenekler, highlight ve secim durumlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Dogru modu secin.** Tek deger icin \`single\`, birden fazla icin \`multiple\`, serbest etiketler icin \`tags\` kullanin.

**\`placeholder\` ile yonlendirin.** "Ulke secin..." gibi aciklayici placeholder metni ekleyin.

**Async arama icin \`onQueryRequest\` kullanin.** \`queryDebounceMs\` ile gereksiz API cagrilarini azaltin.

**Gruplandirma ile organize edin.** \`ComboboxOptionGroup\` ile uzun listeleri kategorize edin.

**\`renderOption\` ile ozellestirin.** Ozel secenek gorunumu icin render fonksiyonu kullanin.

**Portal stratejisini modal icinde kullanin.** Modal veya dialog icinde popup kesintisini onlemek icin \`popupStrategy="portal"\` secin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Az sayida secenek icin Combobox kullanmak**
5-10 sabit secenek icin \`Select\` daha basit ve hafiftir.

**❌ \`freeSolo\` modunda dogrulama yapmamak**
Kullanici anlamsiz degerler girebilir; \`onFreeSoloCommit\` ile dogrulayin.

**❌ Async aramada yukleme durumu gostermemek**
\`loading={true}\` ile "Yukleniyor..." mesaji gosterilmelidir.

**❌ Grup basliksiz uzun listeleri sunmak**
50+ secenek gruplanmazsa kullanici aradigi secenegi bulamaz.

**❌ \`clearable\` olmadan zorunlu olmayan alanlarda kullanmak**
Kullanici secimini geri alamaz; \`clearable={true}\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Input \`role="combobox"\`, \`aria-autocomplete="list"\`, \`aria-expanded\`, \`aria-controls\` ve \`aria-activedescendant\` ile popup listbox'a baglanir. Listbox \`role="listbox"\`, her secenek \`role="option"\` ve \`aria-selected\` ile isaretlenir.

**Klavye:** \`ArrowDown/Up\` ile secenekler arasinda gezinilir, \`Enter\` ile secilir, \`Escape\` ile popup kapanir, \`Backspace\` ile son etiket kaldirilir.

**Devre Disi Secenekler:** \`disabledItemFocusPolicy\` ile devre disi ogeler atlanir veya odaklanilabilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\`, \`readonly\` ve \`disabled\` modlari desteklenir. \`accessReason\` hint olarak gosterilir.

**Coklu Secim:** Listbox \`aria-multiselectable\` ile isaretlenir; etiket kaldir butonlari \`aria-label\` ile tanimlanir.`,
      },
    ],
    relatedComponents: ["Select", "Input", "TagInput", "CommandPalette"],
  },

  CommandPalette: {
    componentName: "CommandPalette",
    summary: "CommandPalette, Cmd+K tarzi arama overlay'i ile komutlara, rotalara ve AI destekli is akislarina hizli erisim saglayan diyalog bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandPalette, VS Code ve Spotlight benzeri bir arama diyalogu sunar. Kullanici metin yazarak komutlar, rotalar ve is akislari arasinda hizla arama yapar ve secim yapar.

Gruplandirmali ogeler, klavye kisayollari, badge gostergesi, bos durum yonetimi, kontrollü/kontrolsuz arama ve erisim kontrolu destekler. Overlay backdrop ve modal dialog ile tam ekran arama deneyimi saglar. \`TextInput\` ile entegre arama alani \`AI\` badge'i ile zenginlestirilmistir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamada hizli komut ve navigasyon erisimi saglamak icin (Cmd+K)
- Rotalar, islemler ve AI destekli is akislarini tek bir yerden aramatirmak icin
- Yonetici paneli veya karmasik uygulamalarda uzman kullanicilara hiz kazandirmak icin

**Kullanmayin:**
- Form icinde secenek aramasi icin — bunun yerine \`Combobox\` veya \`Select\` kullanin
- Basit arama alani icin — bunun yerine \`SearchInput\` veya \`Input\` kullanin
- Menu veya dropdown icin — bunun yerine \`DropdownMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────── Overlay ───────────────────┐
│                                               │
│  ┌─────────────── Dialog ──────────────────┐  │
│  │  Baslik                          [X]    │  │
│  │  Alt baslik                              │  │
│  │  ┌──────────────────────────────────┐    │  │
│  │  │ ⌘ Arama inputu...       [AI]    │    │  │
│  │  └──────────────────────────────────┘    │  │
│  ├──────────────────────────────────────────┤  │
│  │  GRUP BASLIGI                            │  │
│  │  ┌──────────────────────────────────┐    │  │
│  │  │ Komut basligi         [Kisayol]  │    │  │
│  │  │ Aciklama                         │    │  │
│  │  └──────────────────────────────────┘    │  │
│  ├──────────────────────────────────────────┤  │
│  │  Footer                                  │  │
│  └──────────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
\`\`\`

1. **Overlay** — Yari saydam arka plan (tiklaninca kapanir)
2. **Dialog** — \`role="dialog"\`, \`aria-modal="true"\` ile modal pencere
3. **Header** — Baslik, alt baslik ve kapat butonu
4. **Arama Alani** — TextInput ile filtreleme ve klavye navigasyonu
5. **Sonuc Grubu** — Grup basligi ile kategorize edilmis ogeler
6. **Komut Oge** — Baslik, aciklama, badge ve kisayol gosterimi
7. **Footer** — Opsiyonel alt bilgi alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Gruplandirilmis ogeler sunun.** Komutlari kategorilere ayirarak bulunabilirligi artirin.

**Klavye kisayollarini gosterin.** \`shortcut\` prop'u ile her komutun kisayolunu badge olarak goruntuleyin.

**\`keywords\` ile aramayi zenginlestirin.** Baslik ve aciklama disinda ek anahtar kelimeler ekleyerek aramayi iyilestirin.

**\`Escape\` ile kapanma saglayin.** Kullanici her zaman Escape tusu ile diyalogu kapatabilmelidir.

**\`emptyStateLabel\` ile bos durumu yonetin.** "Esleşen komut bulunamadi" gibi anlamli mesaj gosterin.

**\`footer\` ile yardim bilgisi ekleyin.** Klavye kisayol rehberi veya yardim linkleri icin footer alanini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Gruplama olmadan duz liste sunmak**
Gruplandirma olmadan 20+ komut arasinda gezinmek zordur.

**❌ Devre disi komutlari aciklama olmadan gostermek**
Kullanici neden tiklanilmadigini anlamaz; \`description\` ile neden belirtin.

**❌ Overlay'i kapatma mekanizmasi saglamadan kullanmak**
\`onClose\` prop'u her zaman saglanmali; Escape ve backdrop tiklama ile kapanmalidir.

**❌ Cok fazla sonuc gosterimi**
Filtrelenmemis uzun listeler performans ve kullanilabilirlik sorunlari yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog:** \`role="dialog"\`, \`aria-modal="true"\`, \`aria-labelledby\` ve \`aria-describedby\` ile tanimlanir.

**Klavye:** \`ArrowDown/Up\` ile ogeler arasinda gezinilir, \`Enter\` ile secilir, \`Escape\` ile diyalog kapanir.

**Aktif Oge:** Aktif oge \`aria-current="true"\` ile isaretlenir. Devre disi ogeler ok tuslari ile atlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (gosterilmez), \`readonly\` ve \`disabled\` modlari desteklenir. \`accessReason\` kapat butonunda \`title\` olarak gosterilir.

**Odak Yonetimi:** Diyalog acildiginda arama inputu otomatik odak alir.`,
      },
    ],
    relatedComponents: ["Combobox", "SearchInput", "Dialog", "DropdownMenu"],
  },

  TreeTable: {
    componentName: "TreeTable",
    summary: "TreeTable, hiyerarsik agac yapisini tablo sutunlari ile birlestiren bilesendir. Acilir/kapanir dugumler, cok sutunlu veri gosterimi, tonlama, secim ve skeleton yukleme destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TreeTable, agac yapisindaki verileri sutunlu tablo formatinda goruntuleyen gelismis bilesendir. Her dugum (\`TreeTableNode\`) \`label\`, \`description\`, \`meta\`, \`badges\`, \`tone\`, \`children\` ve \`data\` ozellikleri tasir.

Sutunlar (\`TreeTableColumn\`) \`accessor\`, \`render\`, \`align\`, \`width\` ve \`emphasis\` ile yapilandirilir. Kontrollü/kontrolsuz genisletme (\`expandedKeys\`), dugum secimi (\`onNodeSelect\`), yogunluk modlari, skeleton yukleme ve bos durum yonetimi desteklenir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Hiyerarsik veriyi (dosya sistemi, organizasyon yapisi, kategori agaci) tablo formatinda gostermek icin
- Agac dugumlerinin yaninda ek sutun verileri gosterilmesi gerektiginde
- Kullanicinin alt dugumleri acip kapatarak veriyi kesfetmesi istendiginde

**Kullanmayin:**
- Duz (flat) liste verisi icin — bunun yerine \`Table\` veya \`List\` kullanin
- Sadece agac yapisi (sutun olmadan) icin — bunun yerine \`Tree\` bileseni kullanin
- Az sayida veri icin — basit bir liste veya kart yeterlidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik
  Aciklama
┌──────────────┬──────────┬──────────┐
│ Yapi         │ Sutun A  │ Sutun B  │
├──────────────┼──────────┼──────────┤
│ ▾ Dugum 1    │ deger    │ deger    │
│   ▸ Alt 1.1  │ deger    │ deger    │
│   • Yaprak   │ deger    │ deger    │
│ ▸ Dugum 2    │ deger    │ deger    │
└──────────────┴──────────┴──────────┘
\`\`\`

1. **Section** — Baslik ve aciklama ile dis cerceve
2. **Table Header** — Agac sutunu etiketi + veri sutun basliklari
3. **Expand/Collapse Butonu** — Alt dugumleri ac/kapat (▾/▸)
4. **Yaprak Gostergesi** — Cocugu olmayan dugumler icin nokta (•)
5. **Dugum Etiketi** — Label, description, badges ve meta slotlari
6. **Veri Hucreleri** — Sutun tanimi ile eslesen degerler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedKeys\` ile baslangic durumunu ayarlayin.** En onemli dallari acik baslatin.

**Sutun sayisini sinirli tutun.** 3-5 sutun idealdir; fazlasi yatay kaydirma gerektirir.

**\`emphasis\` ile onemli sutunu vurgulayin.** Birincil veri sutununu \`emphasis: true\` ile one cikarin.

**\`treeColumnLabel\` ile agac sutununu adlandirin.** Varsayilan "Structure" yerine icerige uygun turkce etiket kullanin.

**Tonlama ile durum bildirin.** Sorunlu dugumleri \`danger\`, basarili olanlari \`success\` tonu ile isaretleyin.

**\`localeText\` ile metinleri turkcelestirin.** Bos durum, genisletme ve daraltma etiketlerini lokalize edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok derin hiyerarsi olusturmak (4+ seviye)**
Kullanici ic ice yapida kaybolur; 2-3 seviye ile sinirlayin.

**❌ Tum dugumleri kapali basllatmak**
Kullanici bos tablo gorur; en az ust seviye dugumleri acik baslatin.

**❌ Cok fazla sutun eklemek**
Yatay kaydirma mobil ve dar ekranlarda kullanilabilirlik sorunlari yaratir.

**❌ Agac ve tablo yapisini birlestirmeden basit liste kullanmak**
Hiyerarsi yoksa \`Table\` veya \`List\` daha uygun ve hafiftir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<tr>\`, \`<th>\`, \`<td>\` ile standart tablo semantigi kullanilir.

**Genisletme:** Expand/collapse butonlari \`aria-expanded\` ve aciklayici \`aria-label\` ile tanimlanir.

**Secim:** Secili dugum \`aria-current="true"\` ile belirtilir. \`ring-1\` ile gorsel vurgu eklenir.

**Yukleme:** Skeleton satirlari ile yukleme durumu gorsel olarak iletilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`disabled\` (etkilesim engellenir) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Devre Disi Dugum:** \`disabled\` dugumlere tiklandiginda etkilesim engellenir; \`cursor-not-allowed\` ve \`opacity-70\` uygulanir.`,
      },
    ],
    relatedComponents: ["Table", "Tree", "List", "DataGrid"],
  },

  Descriptions: {
    componentName: "Descriptions",
    summary: "Descriptions, anahtar-deger ciftlerini grid duzende goruntuleyen metadata bilesenidir. Sutun sayisi, yogunluk, tonlama, span ve bos durum yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Descriptions, yapilandirilmis metadata bilgilerini (anahtar-deger ciftleri) okunabilir bir grid duzende sunar. Her oge \`label\`, \`value\`, \`helper\`, \`tone\` ve \`span\` ozellikleri tasir.

1-3 sutun duzeni, \`comfortable\`/\`compact\` yogunluk modlari, kenarlıkli (\`bordered\`) gorunum, ton bazli sol kenarlık rengi (\`info\`, \`success\`, \`warning\`, \`danger\`) ve bos durum yonetimi desteklenir. \`<dl>\`/\`<dt>\`/\`<dd>\` semantik HTML yapisi kullanilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfalarinda nesne ozelliklerini gostermek icin (profil bilgileri, siparis detaylari)
- Ozet kartlarinda anahtar-deger ciftlerini listelemek icin
- Form sonrasi onizleme ekranlarinda gonderilecek verileri goruntumek icin

**Kullanmayin:**
- Duzenlenebilir form alanlari icin — bunun yerine \`Form\` bilesenleri kullanin
- Uzun listeler icin — bunun yerine \`Table\` veya \`List\` kullanin
- Tek baslik-deger cifti icin — basit bir \`Text\` yeterlidir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Baslik
  Aciklama
┌─────────────────┬─────────────────┐
│ Etiket          │ Etiket          │
│ Deger           │ Deger           │
│ Yardimci metin  │ Yardimci metin  │
├─────────────────┼─────────────────┤
│ Etiket (span=2)                   │
│ Deger                             │
└───────────────────────────────────┘
\`\`\`

1. **Container** — Baslik ve aciklama ile dis cerceve
2. **Grid** — \`<dl>\` ile CSS Grid duzeni (\`columns\` prop'una gore)
3. **Item** — Her anahtar-deger cifti; \`<dt>\` (etiket) + \`<dd>\` (deger/helper)
4. **Ton Kenarligi** — \`default\` disindaki tonlarda sol kenarlık rengi
5. **Span** — \`span\` prop'u ile birden fazla sutun kaplama`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sutun sayisini icerige gore ayarlayin.** Kisa degerler icin 3 sutun, uzun degerler icin 1-2 sutun kullanin.

**\`span\` ile uzun degerleri yayın.** Aciklama veya adres gibi uzun degerler icin \`span: 2\` veya \`span: 3\` kullanin.

**\`helper\` ile ek bilgi saglayin.** Degerin altinda aciklayici veya yonlendirici metin ekleyin.

**Ton'u onemli verileri vurgulamak icin kullanin.** Kritik bilgileri \`danger\`, basarili durumlari \`success\` ile isaretleyin.

**\`bordered\` modunu yapili gorunum icin aktiflesirin.** Kenarlıkli mod gorsel ayrimı ve okunabilirgi artirir.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` veya \`localeText\` ile turkce bos durum mesaji saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla oge eklemek (20+)**
Gorsel yogunluk okunabilirligi dusurur; gruplama veya sekmelerle organize edin.

**❌ Tum ogelere farkli ton atamak**
Renk karmasasi gorsel hiyerarsiyi bozar; ton'u anlamli durumlara ayirin.

**❌ Uzun degerleri \`span\` olmadan tek sutuna sıkıştırmak**
Metin tasar veya kesilir; \`span\` ile uygun alan saglayin.

**❌ Boş \`value\` icin fallback saglamadan kullanmak**
Bileseni otomatik olarak "—" gosterir ancak anlamli bir varsayilan deger tercih edilmelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<dl>\`, \`<dt>\`, \`<dd>\` ile standart tanim listesi semantigi kullanilir. Ekran okuyucular anahtar-deger iliskisini dogru sekilde iletir.

**Baslik:** \`<h3>\` ile baslik hiyerarsisine uyumlu baslik kullanilir.

**Grid Duzeni:** CSS Grid ile gorusel dizen saglanirken semantik yapi korunur.

**Ton Gostergesi:** Sol kenarlık rengi ile gorsel ipucu saglanir; renk tek basina anlam tasimamali, \`helper\` ile aciklanmalidir.

**Bos Durum:** Veri yoksa anlamli bir bos durum mesaji goruntulenir.`,
      },
    ],
    relatedComponents: ["Card", "Table", "List", "KeyValue"],
  },

  Slider: {
    componentName: "Slider",
    summary: "Slider, belirli bir araliktan sayisal deger secimi icin kullanilan form alanidir. Min/max sinirlar, adim degeri, deger formatlama, label ve hata yonetimi destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Slider, native \`<input type="range">\` uzerine insa edilmis bir aralik secim bilesenidir. FieldControlShell ile sarilanarak label, description, hint ve error yonetimini standart hale getirir.

Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari, \`min\`/\`max\`/\`step\` yapilandirmasi, \`valueFormatter\` ile ozel deger gosterimi, \`minLabel\`/\`maxLabel\` ile ucnokta etiketleri ve erisim kontrolu desteklenir. Mevcut deger bir badge ile gorsel olarak gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Belirli bir araliktan sayisal deger secimi icin (ses seviyesi, fiyat araligi, yuzde)
- Kullanicinin gorsel olarak degeri ayarlamasi istendiginde
- Min/max sinirlari olan surekli veya adimli deger girisi icin

**Kullanmayin:**
- Hassas sayi girisi icin — bunun yerine \`NumberInput\` veya \`Input type="number"\` kullanin
- Iki uclu aralik secimi icin — bunun yerine \`RangeSlider\` kullanin
- Boolean acik/kapali secimi icin — bunun yerine \`Switch\` kullanin
- Kategori secimi icin — bunun yerine \`RadioGroup\` veya \`Select\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Label
┌──────────────────────────────────────┐
│  ═══════●══════════════   [42]       │
└──────────────────────────────────────┘
  0                              100
  (minLabel)                (maxLabel)
  Helper text / Error message
\`\`\`

1. **FieldControlShell** — Label, description, hint ve error yonetimi
2. **Frame** — Boyut ve ton'a gore stillendirilmis dis cerceve
3. **Range Input** — Native \`<input type="range">\` surukle-birak kaydirici
4. **Deger Badge** — Mevcut degeri gosteren etiket (\`valueFormatter\` ile ozellestrilebilir)
5. **Min/Max Etiketleri** — Alt kisimda aralik ucnoktalarini gosteren etiketler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`valueFormatter\` ile anlamli deger gosterin.** Yuzde icin \`(v) => v + "%"\`, para birimi icin \`(v) => v + " TL"\` kullanin.

**\`minLabel\`/\`maxLabel\` ile ucnoktalari etiketleyin.** "Dusuk" / "Yuksek" gibi baglam saglayan etiketler ekleyin.

**\`step\` degerini amaca gore ayarlayin.** Yuzde icin \`step={1}\`, hassas olmayan degerler icin \`step={5}\` veya \`step={10}\` kullanin.

**Label ile amaci aciklayin.** "Deger" yerine "Ses Seviyesi" veya "Fiyat Araligi" gibi ozel etiketler kullanin.

**Hata mesajlarini aciklayici yapin.** "Gecersiz deger" yerine "Deger 10-90 arasinda olmalidir" yazin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok genis aralik ile kucuk adim kullanmak**
0-10000 araliginda \`step={1}\` ile hassas secim imkansizdir; sayi girisi ekleyin.

**❌ Label olmadan kullanmak**
Ekran okuyucular alani tanimlayamaz; her zaman \`label\` prop'u saglayin.

**❌ \`valueFormatter\` olmadan yuzde veya birim gostermek**
Kullanici "42" degerinin neyi temsil ettigini anlamaz; birim ekleyin.

**❌ \`disabled\` durumunu aciklama olmadan kullanmak**
Neden devre disi oldugunu \`accessReason\` ile belirtin.

**❌ Hassas sayi girisi icin tek basina slider kullanmak**
Slider yaklasik secim icindir; hassas deger girisi icin ek sayi alani gerekir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Native Semantik:** \`<input type="range">\` kullanildigi icin tarayicinin yerlesik ekran okuyucu destegi otomatik saglanir.

**ARIA:** \`aria-invalid\`, \`aria-readonly\`, \`aria-disabled\` ve \`aria-describedby\` ile hint/error mesajlari iliskilendirilir.

**Klavye:** Sol/Sag ok tuslari ile deger azaltilir/artirilir. Home/End ile min/max degere atlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir), \`readonly\` (degisiklik engellenir, \`cursor-default\`) ve \`disabled\` (\`cursor-not-allowed\`, \`opacity-70\`) modlari desteklenir. \`accessReason\` ile kisitlama nedeni \`title\` olarak gosterilir.

**Zorunlu Alan:** \`required\` prop'u ile \`required\` HTML attribute'u eklenir.`,
      },
    ],
    relatedComponents: ["Input", "NumberInput", "Switch", "ProgressBar"],
  },

  PageHeader: {
    componentName: "PageHeader",
    summary: "PageHeader, sayfa seviyesinde baslik, alt baslik, breadcrumb, etiketler, aksiyonlar ve footer alanlari sunan standart ust bilgi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PageHeader, her sayfanin ust kisminda tutarli bir baslik alani olusturur. Baslik, alt baslik, breadcrumb navigasyonu, avatar/ikon, etiketler (tags), aksiyonlar ve footer (sekmeler, metadata) slotlari icerir.

\`sticky\` prop'u ile sayfa kaydirmada sabit kalabilir. \`noBorder\` ile alt kenarlik kaldirilabilir. Tum slotlar \`ReactNode\` olarak esnek icerik kabul eder.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Her sayfanin ust kisminda tutarli baslik alani olusturmak icin
- Breadcrumb navigasyonu ile sayfa hiyerarsisini gostermek icin
- Sayfa seviyesi aksiyonlari (olustur, disa aktar) baslikla birlikte sunmak icin
- Sekmeler veya metadata bilgisi footer'da gostermek icin

**Kullanmayin:**
- Kart veya bolum basligi icin — bunun yerine \`Card\` veya \`SectionHeader\` kullanin
- Dialog/drawer basligi icin — ilgili bilesenin kendi baslik alani kullanilmalidir
- Ic ice baslik katmanlari icin — sayfa basina tek \`PageHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────┐
│  [Breadcrumb]                              │
│  [Avatar?] [Title] [Tags?]   [Actions →]   │
│            [Subtitle?]                     │
│  [Extra?]                                  │
│  [Footer? (Tabs / Metadata)]               │
└────────────────────────────────────────────┘
\`\`\`

1. **Breadcrumb** — Sayfa hiyerarsisini gosteren ust navigasyon
2. **Avatar** (opsiyonel) — Basligin solunda ikon veya gorsel
3. **Title** — Ana sayfa basligi (\`h1\`)
4. **Tags** (opsiyonel) — Baslik yaninda durum etiketleri
5. **Actions** (opsiyonel) — Sag tarafa hizalanmis aksiyon butonlari
6. **Subtitle** (opsiyonel) — Baslik altinda kisa aciklama
7. **Extra** (opsiyonel) — Baslik alani ile footer arasi ek icerik
8. **Footer** (opsiyonel) — Sekmeler veya metadata satiri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her sayfada tek PageHeader kullanin.** Birden fazla PageHeader gorsel hiyerarsiyi bozar.

**Breadcrumb ile navigasyon baglamini saglayin.** Kullanicinin sayfa hiyerarsisindeki konumunu anlamasi icin breadcrumb kullanin.

**Aksiyonlari mantikli sirada dizin.** Birincil aksiyon sag tarafa, ikincil aksiyonlar sola yerlestirilmelidir.

**\`sticky\` modunu uzun sayfalarda kullanin.** Kullanicinin baslik ve aksiyonlara her zaman erisebilmesini saglar.

**Tags ile durumu gorsel olarak belirtin.** Aktif/pasif, taslak/yayinda gibi durumlari etiketlerle gosterin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Birden fazla PageHeader kullanmak**
Sayfa basina tek baslik alani olmalidir; ic bolumlerde \`SectionHeader\` tercih edin.

**❌ Breadcrumb olmadan derin sayfa hiyerarsisi olusturmak**
Kullanici nerede oldugunu anlamaz; breadcrumb ile yol gosterin.

**❌ Cok fazla aksiyon butonu eklemek**
Baslik alani kalabalik gorsel kaosa neden olur; ikincil aksiyonlari bir menu altinda toplayin.

**❌ Footer'i karmasik icerikle doldurmak**
Footer yalnizca sekmeler veya kisa metadata icin kullanilmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<header>\` elementi ile sayfa basligi semantigi saglanir.

**Baslik Hiyerarsisi:** Baslik \`<h1>\` olarak render edilir; sayfa basina tek \`h1\` kullanilmalidir.

**Breadcrumb:** Navigasyon \`<nav>\` ile sarilir; \`aria-current="page"\` aktif sayfa icin eklenir.

**Sticky:** Sabit baslik z-index ile diger icerikler uzerinde kalir; fokus yonetimi etkilenmez.

**Renk Kontrasti:** Tum metin ogeleri WCAG 2.1 AA minimum kontrast oranini (4.5:1) karsilar.`,
      },
    ],
    relatedComponents: ["PageLayout", "Breadcrumb", "Tabs", "Button"],
  },

  PageLayout: {
    componentName: "PageLayout",
    summary: "PageLayout, baslik, breadcrumb, filtre, icerik, detay paneli ve footer alanlarini tek bir yapida birlestiren tam sayfa iskelet bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PageLayout, uygulamadaki sayfalar icin tutarli bir iskelet sunar. Baslik (title + description), breadcrumb, aksiyonlar, ikincil navigasyon, filtre cubugu, icerik header/toolbar, ana icerik, detay paneli ve footer alanlarini yonetir.

\`pageWidth\` ile genislik kontrolu (default, wide, full), \`stickyHeader\` ile sabit baslik, \`responsiveDetailCollapse\` ile responsive detay paneli daraltmasi desteklenir. \`createPageLayoutPreset\` ile \`content-only\`, \`detail-sidebar\` ve \`ops-workspace\` gibi hazir yapilandirmalar kullanilabilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Liste + detay duzeni gerektiren operasyonel sayfalarda
- Filtre cubugu ve icerik aracligi olan veri sayfalarinda
- Breadcrumb ve baslik ile standart sayfa yapisi olusturmak icin
- Detay panelinin responsive olarak daraltilmasi gereken durumlarda

**Kullanmayin:**
- Login, kayit gibi minimal sayfalarda — bunun yerine ozel layout kullanin
- Modal veya drawer ici icerik icin — bu bilesenler kendi layout'unu icerir
- Dashboard grid duzeni icin — bunun yerine \`Grid\` veya ozel layout kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────┐
│  Header (breadcrumb, title, actions)       │
├────────────────────────────────────────────┤
│  Secondary Nav                             │
├────────────────────────────────────────────┤
│  Filter Bar                                │
│  Content Header / Toolbar                  │
│  ┌──────────────────┬────────────────┐     │
│  │  Main Content     │  Detail Panel  │     │
│  └──────────────────┴────────────────┘     │
├────────────────────────────────────────────┤
│  Footer                                    │
└────────────────────────────────────────────┘
\`\`\`

1. **Header** — Breadcrumb, baslik, aciklama ve aksiyonlar
2. **Secondary Nav** — Sekmeler veya ikincil navigasyon
3. **Filter Bar** — Filtreleme kontrollerini barindirir
4. **Content Header / Toolbar** — Icerik ustundeki baslik ve arac cubugu
5. **Main Content** — Ana icerik alani (\`children\`)
6. **Detail Panel** (opsiyonel) — Yan detay paneli, responsive daraltma destekli
7. **Footer** — Alt bilgi alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Preset kullanarak tutarlilik saglayin.** \`createPageLayoutPreset\` ile standart sayfa tipleri icin onceden yapilandirilmis ayarlar kullanin.

**\`pageWidth\` secimini icerige gore yapin.** Dar icerikler icin \`default\`, genis tablolar icin \`wide\` veya \`full\` kullanin.

**Detay paneli icin responsive daraltma aktifleyin.** \`responsiveDetailCollapse\` mobil cihazlarda kullanilabilirligi arttirir.

**Breadcrumb ile navigasyon baglamini koruyun.** \`createPageLayoutBreadcrumbItems\` ile kolay breadcrumb olusturun.

**\`stickyHeader\` ile uzun sayfalarda baslik erisimini saglayin.** Operasyonel sayfalarda basligin her zaman gorunmesi kullanici deneyimini iyilestirir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ PageLayout icinde PageLayout kullanmak**
Ic ice layout bilesenler gorsel ve yapisal sorunlara yol acar.

**❌ \`full\` genislikte dar icerik gostermek**
Genis bosluklar gorsel dengesizlik yaratir; icerige uygun genislik secin.

**❌ Detay panelini responsive daraltma olmadan kullanmak**
Mobil cihazlarda yatay tasma ve kullanilabilirlik sorunlari olusur.

**❌ Tum slotlari ayni anda doldurmak**
Karmasik sayfalar bile sadece gerekli slotlari kullanmali; gereksiz alanlar bos birakilmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<header>\` ve \`<footer>\` elementleri ile sayfa yapisi semantik olarak tanimlanir.

**Breadcrumb:** \`<nav aria-label>\` ile breadcrumb navigasyonu erisilebilir kilinir; \`aria-current="page"\` aktif sayfa icin eklenir.

**Landmark:** \`ariaLabel\` prop'u ile sayfa landmark olarak tanimlanabilir.

**Baslik Hiyerarsisi:** Baslik \`<h1>\` olarak render edilir; dogru baslik hiyerarsisi korunur.

**Responsive:** Detay paneli daraltmasi mobil cihazlarda icerik erisimini iyilestirir.`,
      },
    ],
    relatedComponents: ["PageHeader", "FilterBar", "SummaryStrip", "Tabs"],
  },

  FilterBar: {
    componentName: "FilterBar",
    summary: "FilterBar, yatay filtre kontrollerini, arama alanini, ek filtreler panelini ve aksiyonlari tek satirda organize eden filtre cubugu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `FilterBar, veri listelerinin ustunde filtreleme kontrollerini duzenlemeye yarar. Birincil filtreler her zaman gorunurken, ikincil/gelismis filtreler acilir-kapanir bir "More filters" panelinde saklanabilir.

Arama slotu (solda), filtre kontrolleri (ortada), aksiyon butonlari (sagda) ve aktif filtre sayaci badge'i desteklenir. \`compact\` modu ile daha az padding uygulanir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo, liste veya grid uzerinde filtreleme kontrolleri sunmak icin
- Birincil ve gelismis filtreleri ayirmak icin
- Arama + filtreler + aksiyonlari tek satirda organize etmek icin

**Kullanmayin:**
- Tek bir arama alani icin — bunun yerine \`Input\` veya \`SearchInput\` kullanin
- Form icinde filtre duzeni icin — bunun yerine \`Form\` layout'u kullanin
- Navigasyon veya sekme secimi icin — bunun yerine \`Tabs\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Search?] [Filters...] [More ▼ (badge)] [Actions]│
├──────────────────────────────────────────────────┤
│ [More Filters Panel (collapsible)]               │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Search** (opsiyonel) — En solda arama alani
2. **Primary Filters** — Her zaman gorunen filtre kontrolleri (\`children\`)
3. **More Filters Toggle** — Ek filtreleri acar/kapar; aktif filtre sayaci badge ile gosterilir
4. **Actions** (opsiyonel) — Sag tarafa hizalanmis aksiyon butonlari (Sifirla, Uygula)
5. **More Filters Panel** — Acilir-kapanir gelismis filtre alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**En cok kullanilan filtreleri birincil satirda gosterin.** Nadir kullanilan filtreleri "More filters" paneline tasiyarak gorsel karmasayi azaltin.

**Aktif filtre sayacini gosterin.** \`activeCount\` ile kullanicinin kac filtre uyguladigini bildirin.

**Sifirla aksiyonu ekleyin.** Kullanicinin tum filtreleri tek tikla temizlemesini saglayin.

**\`compact\` modunu yogun arayuzlerde kullanin.** Tablo veya dashboard iceriginde daha az dikey alan kaplar.

**Arama alanini sol tarafa yerlestirin.** \`search\` slotu ile tutarli yerlesim saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla filtre kontrolunu birincil satirda gostermek**
Gorsel yogunluk artarak kullanilabilirligi dusurur; fazla filtreleri \`moreFilters\` alanina tasiyiniz.

**❌ Aktif filtre sayacini gostermeden gizli filtreler barindirmak**
Kullanici aktif filtrelerin farkinda olmaz; \`activeCount\` her zaman saglanmalidir.

**❌ FilterBar'i form icerisinde kullanmak**
FilterBar bagimsiz filtreleme icin tasarlanmistir; form duzeninde kendi layout bilesenlerini kullanin.

**❌ Filtreleri aksiyonsuz birakmak**
Sifirla ve Uygula butonlari olmadan kullanici filtreleri yonetemez.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Klavye:** Tum filtre kontrolleri Tab ile erisilebilir; "More filters" butonu Enter/Space ile acilir.

**Focus:** Toggle butonu \`focus-visible\` ile gorunen fokus halkasi saglar.

**Animasyon:** Ek filtreler paneli \`animate-in\` ile yumusak gecis animasyonu kullanir.

**Badge:** Aktif filtre sayaci gorsel olarak gosterilir; ekran okuyucular buton etiketinden bilgi alir.

**Responsive:** Filtre kontrolleri \`flex-wrap\` ile dar ekranlarda alt satirlara sarilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "Input", "Select", "Button"],
  },

  SummaryStrip: {
    componentName: "SummaryStrip",
    summary: "SummaryStrip, yatay KPI ve metrik kartlarini grid duzende gosteren ozet seridi bilesenidir. Ikon, trend badge, ton kenarligi ve not alanlari destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SummaryStrip, sayfa veya bolum ustunde onemli metrikleri ve KPI'lari yatay kartlar halinde sunar. Her kart etiket, deger, not, trend badge ve ikon icerebilir.

\`columns\` prop'u ile 2, 3 veya 4 sutunlu grid duzeni ayarlanabilir. \`tone\` ile (info, success, warning) sol kenarlik rengi uygulanir. Baslik ve aciklama alanlari opsiyonel olarak ust kisimda gosterilebilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Dashboard veya detay sayfalarinda KPI'lari ozetlemek icin
- Sayfa basinda onemli metrikleri vurgulamak icin
- Durum veya trend bilgisi ile birlikte degerleri gostermek icin

**Kullanmayin:**
- Uzun veri listesi icin — bunun yerine \`Table\` veya \`List\` kullanin
- Tek bir istatistik karti icin — bunun yerine \`StatCard\` veya \`Card\` kullanin
- Detayli grafik icin — bunun yerine \`Chart\` bilesenleri kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  [Baslik?]
  [Aciklama?]
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ [Trend →]    │ [Trend →]    │ [Trend →]    │ [Trend →]    │
│ [Icon?]      │ [Icon?]      │ [Icon?]      │ [Icon?]      │
│ Etiket       │ Etiket       │ Etiket       │ Etiket       │
│ **Deger**    │ **Deger**    │ **Deger**    │ **Deger**    │
│ [Not?]       │ [Not?]       │ [Not?]       │ [Not?]       │
└──────────────┴──────────────┴──────────────┴──────────────┘
\`\`\`

1. **Baslik** (opsiyonel) — Seridin ust kisminda aciklayici baslik
2. **Aciklama** (opsiyonel) — Baslik altinda ek bilgi
3. **Kart** — Her bir metrik ogesi; kenarlıkli yuvarlatilmis kart
4. **Ton Kenarligi** — \`tone\` prop'una gore sol kenarlik rengi (info, success, warning)
5. **Trend Badge** — Sag ust kosede trend gostergesi
6. **Icon** (opsiyonel) — Metrik ikonu
7. **Etiket** — Metrigin adini tanimlayan kucuk metin
8. **Deger** — Buyuk ve kalin ana metrik degeri
9. **Not** (opsiyonel) — Degerin altinda ek aciklama`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sutun sayisini metrik adedine gore secin.** 4 veya daha az metrik icin \`columns={4}\`, 2-3 metrik icin daha kucuk degerler kullanin.

**Ton'u anlamli durumlarda kullanin.** Basarili metrikleri \`success\`, uyari gerekenleri \`warning\`, bilgilendirme icin \`info\` secin.

**Trend badge ile degisimi gosterin.** Yuzde artis/azalis gibi trend bilgileri deger baglamini guclendirmek icin kullanin.

**Not alani ile ek bilgi saglayin.** Degerin neyi temsil ettigini veya hangi doneme ait oldugunu belirtin.

**Ikonlari tutarli kullanin.** Ya tum kartlarda ikon kullanin ya da hicbirinde; karisik kullanim gorsel dengesizlik yaratir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla metrik karti eklemek (8+)**
Gorsel yogunluk okunabilirligi dusurur; en onemli 4-6 metrigi secin.

**❌ Tum kartlara farkli ton atamak**
Renk karmasasi gorsel hiyerarsiyi bozar; ton'u anlamli durumlara ayirin.

**❌ Uzun deger metinleri kullanmak**
Kartlar kisa ve okunabilir degerler icin tasarlanmistir; uzun metinler icin \`Descriptions\` kullanin.

**❌ Trend badge olmadan yon belirten degerler gostermek**
Artis/azalis bilgisi trend badge ile gorsellestirilmeli, yalnizca sayi gosterilmemelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Her kart \`<article>\` elementi ile sarilanir; bagimsiz icerik birimi olarak tanimlanir.

**Baslik:** Seri basligi \`<h3>\` ile hiyerarsiye uyumlu render edilir.

**Grid Duzeni:** CSS Grid ile gorsel dizen saglanir; ekran okuyucular dogrusal sirada icerik okur.

**Ton:** Sol kenarlik rengi gorsel ipucu saglar; renk tek basina anlam tasimamali, etiket ve deger ile desteklenmelidir.

**Responsive:** Grid sutunlari dar ekranlarda yigilanabilir; \`columns\` prop'u ile kontrol edilir.`,
      },
    ],
    relatedComponents: ["PageHeader", "DetailSummary", "Card", "Descriptions"],
  },

  DetailDrawer: {
    componentName: "DetailDrawer",
    summary: "DetailDrawer, sagdan kayan salt-okunur detay paneli bilesenidir. Baslik, alt baslik, etiketler, bolumler, sekmeler ve footer alanlari ile zengin icerik sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailDrawer, liste veya tablo satirina tiklandiginda ilgili kaydin detaylarini gosteren sagdan kayan bir paneldir. Baslik, alt baslik, etiketler, aksiyonlar, bolumler (sections), sekmeler (tabs) ve footer destekler.

\`size\` prop'u ile genislik (md, lg, xl, full) ayarlanabilir. Escape tusu ve backdrop tiklamasi ile kapatilabilir. Body scroll otomatik olarak kilitleninir. \`sections\` veya \`children\` ile icerik saglanabilir; legacy \`tabs\` prop'u ile sekmeli gorunum de desteklenir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya liste kaydinin detaylarini sayfadan ayrilmadan gostermek icin
- Salt-okunur detay goruntuleme icin (profil, siparis, log kaydı)
- Bolumlu veya sekmeli detay icerigi sunmak icin

**Kullanmayin:**
- Form veya duzenleme islemi icin — bunun yerine \`FormDrawer\` kullanin
- Kucuk onay veya bilgilendirme icin — bunun yerine \`Dialog\` veya \`Modal\` kullanin
- Tam sayfa detay gorunumu icin — bunun yerine ayri bir detay sayfasi kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Title] [Tags?]    [Actions] ✕ │
│  [Subtitle?]                    │
├─────────────────────────────────┤
│  [Section Title]                │
│  [Section Content]              │
│  ───────────────                │
│  [Section Title]                │
│  [Section Content]              │
├─────────────────────────────────┤
│  [Footer?]                      │
└─────────────────────────────────┘
\`\`\`

1. **Backdrop** — Arkadaki karartilmis alan; tiklandiginda drawer kapanir
2. **Panel** — Sagdan kayan ana icerik alani
3. **Header** — Baslik, alt baslik, etiketler, aksiyonlar ve kapatma butonu
4. **Body** — Kaydirma destekli icerik alani; bolumler veya serbest icerik
5. **Sections** — Kenarlıkla ayrilmis icerik bolumleri
6. **Footer** (opsiyonel) — Alt aksiyon alani`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`size\` secimini icerik miktarina gore yapin.** Kisa detaylar icin \`md\`, zengin icerikler icin \`lg\` veya \`xl\` kullanin.

**Bolumleri mantikli gruplar halinde organize edin.** Iliskili bilgileri ayni bolumde, farkli kategorileri ayri bolumlerde gosterin.

**Aksiyonlari header'a yerlestirin.** Duzenle, sil gibi islemleri \`actions\` slotuna ekleyin.

**Footer'i onay veya navigasyon icin kullanin.** Alt aksiyon butanlari icin \`footer\` slotu idealdir.

**Salt-okunur icerik icin kullanin.** Duzenleme islemleri icin \`FormDrawer\` tercih edin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ DetailDrawer icinde form elementleri kullanmak**
Salt-okunur detay icin tasarlanmistir; form girisleri icin \`FormDrawer\` kullanin.

**❌ Cok fazla bolum eklemek (10+)**
Uzun kaydirma gerektiren icerik kullanilabilirligi dusurur; sekmelerle organize edin.

**❌ \`full\` boyutunu gereksiz kullanmak**
Tam genislik detay paneli modal gibi calisir; cogu durumda \`lg\` yeterlidir.

**❌ Kapatma mekanizmasi olmadan kullanmak**
Kullanici sikisilmis hisseder; Escape ve backdrop tiklamasini devre disi birakmayiniz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Rolu:** \`role="dialog"\` ve \`aria-modal="true"\` ile modal dialog semantigi saglanir.

**Fokus Yonetimi:** Acildiginda panel otomatik olarak fokuslanir; Escape ile kapatilir.

**Body Scroll Kilitleme:** Acikken arkadaki icerik kaydirma devre disi birakilir.

**Klavye:** Escape tusu ile kapatma, Tab ile icerik icerisinde gezinme desteklenir.

**Etiket:** \`aria-label\` baslik string ise otomatik olarak uygulanir.`,
      },
    ],
    relatedComponents: ["FormDrawer", "Dialog", "Modal", "PageLayout"],
  },

  FormDrawer: {
    componentName: "FormDrawer",
    summary: "FormDrawer, yandan kayan form paneli bilesenidir. Olusturma ve duzenleme islemleri icin baslik, form icerigi, footer ve yukleme durumu destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `FormDrawer, yeni kayit olusturma veya mevcut kaydi duzenleme islemleri icin sagdan veya soldan kayan bir form panelidir. Baslik, alt baslik, form icerigi (\`children\`), footer (gonder/iptal butonlari) ve yukleme durumu destekler.

\`size\` prop'u ile genislik (sm, md, lg, xl), \`placement\` ile yon (right, left) ayarlanabilir. Escape tusu ve backdrop tiklamasi ile kapatilabilir. \`loading\` durumunda yarı saydam bir yukleme katmani gosterilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yeni kayit olusturma formu icin (musteriler, urunler, kurallar)
- Mevcut kaydi duzenleme formu icin
- Sayfadan ayrilmadan form islemi gerceklestirmek icin

**Kullanmayin:**
- Salt-okunur detay gosterimi icin — bunun yerine \`DetailDrawer\` kullanin
- Kisa onay veya bilgi girisi icin — bunun yerine \`Dialog\` kullanin
- Karmasik cok adimli sihirbazlar icin — bunun yerine tam sayfa form kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Title]                      ✕ │
│  [Subtitle?]                    │
├─────────────────────────────────┤
│  [Loading Overlay?]             │
│  [Form Content]                 │
│  (scrollable)                   │
├─────────────────────────────────┤
│  [Footer? (Cancel / Submit)]    │
└─────────────────────────────────┘
\`\`\`

1. **Backdrop** — Arkadaki karartilmis alan
2. **Panel** — Yandan kayan ana form alani
3. **Header** — Baslik, alt baslik ve kapatma butonu
4. **Body** — Kaydirma destekli form icerik alani
5. **Loading Overlay** — \`loading\` durumunda yari saydam yukleme katmani
6. **Footer** (opsiyonel) — Gonder ve iptal butonlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Footer'da tutarli buton duzeni kullanin.** Iptal solda, Kaydet/Gonder sagda olmalidir.

**\`loading\` durumunu async islemlerde gosterin.** Form gonderimi sirasinda kullaniciyi yukleme durumundan haberdar edin.

**Form validasyonunu inline yapin.** Hatalari dogrudan ilgili alanin altinda gosterin.

**\`size\` secimini form karmasikligina gore yapin.** Basit formlar icin \`sm\` veya \`md\`, karmasik formlar icin \`lg\` kullanin.

**\`placement\` tercihini sayfa duzenine gore belirleyin.** Detay paneli sagda ise formu soldan acmayi degerlendirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ FormDrawer'i salt-okunur icerik icin kullanmak**
Form paneli duzenleme amaclidir; goruntuleme icin \`DetailDrawer\` kullanin.

**❌ Footer olmadan form gostermek**
Kullanici formu nasil gonderecegini veya iptal edecegini bilemez; her zaman footer ekleyin.

**❌ \`loading\` durumunu gostermeden async islem yapmak**
Kullanici formun islenip islenmedigini anlamaz; yukleme gostergesi saglayin.

**❌ Escape ve backdrop kapatmayi devre disi birakmak**
Kullanici sikisilmis hisseder; her zaman kapatma mekanizmasi sunun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Rolu:** \`role="dialog"\` ve \`aria-modal="true"\` ile modal dialog semantigi saglanir.

**Fokus Yonetimi:** Acildiginda panel otomatik olarak fokuslanir; Escape ile kapatilir.

**Body Scroll Kilitleme:** Acikken arkadaki icerik kaydirma devre disi birakilir.

**Klavye:** Escape tusu ile kapatma (yapilandirmaya bagli), Tab ile form alanlari arasinda gezinme desteklenir.

**Etiket:** \`aria-label\` baslik string ise otomatik olarak uygulanir.`,
      },
    ],
    relatedComponents: ["DetailDrawer", "Dialog", "Form", "Button"],
  },

  DetailSummary: {
    componentName: "DetailSummary",
    summary: "DetailSummary, detay sayfalarinda baslik, KPI seridi, varlik ozeti, anahtar-deger listesi ve JSON gorunumunu tek bir yapilandirmada birlestiren kompozit bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailSummary, detay sayfalarindaki tum ozet bilgilerini tek bilesenle sunar. PageHeader (baslik, aciklama, durum, aksiyonlar), SummaryStrip (KPI kartlari), EntitySummaryBlock (varlik ozeti) ve Descriptions (anahtar-deger listesi) bilesenlerini icerir.

Opsiyonel olarak inline JSON viewer ile ham veri gosterimi de desteklenir. Erisim kontrolu (\`access\`, \`accessReason\`) ile tum alt bilesen erisimleri merkezi olarak yonetilir. Premium gorsel yuzey ile zengin detay sayfasi deneyimi sunar.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kayit detay sayfalarinda baslik + KPI + varlik ozeti + ozellikler bilesenini olusturmak icin
- Tek bilesenle zengin detay sayfasi yapisi kurmak icin
- JSON payload ile birlikte detay bilgisi gostermek icin

**Kullanmayin:**
- Basit baslik alani icin — bunun yerine \`PageHeader\` kullanin
- Yalnizca KPI gosterimi icin — bunun yerine \`SummaryStrip\` kullanin
- Form veya duzenleme sayfasi icin — bunun yerine \`FormDrawer\` veya ozel form layout kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  PageHeader (eyebrow, title, status,     │
│              description, actions, aside)│
├──────────────────────────────────────────┤
│  SummaryStrip (KPI kartlari)             │
├───────────────────┬──────────────────────┤
│  EntitySummary    │  Descriptions        │
│  Block            │  (anahtar-deger)     │
│                   ├──────────────────────┤
│                   │  JSON Viewer         │
│                   │  (opsiyonel)          │
└───────────────────┴──────────────────────┘
\`\`\`

1. **PageHeader** — Eyebrow (breadcrumb), baslik, aciklama, durum, aksiyonlar ve yan icerik
2. **SummaryStrip** — Yatay KPI kartlari (4 sutun)
3. **EntitySummaryBlock** — Varlik kimlik ve ozet bilgisi
4. **Descriptions** — Anahtar-deger ciftleri listesi
5. **JSON Viewer** (opsiyonel) — Ham JSON veri gorunumu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tum alanlari anlamli degerlerle doldurun.** Bos kalan alanlar gorsel dengesizlik yaratir; gereksiz alanlari prop olarak gondermeyin.

**KPI kartlarini 4 ile sinirlayin.** \`summaryItems\` icin en onemli 4 metrigi secin.

**JSON viewer'i yalnizca teknik kullanicilar icin gosterin.** Denetim, debug ve destek akislarinda faydalidir.

**Erisim kontrolunu merkezi olarak yonetin.** \`access\` prop'u ile tum alt bilesenlerin erisim durumu tek noktadan kontrol edilir.

**\`detailTitle\` ve \`jsonTitle\` ile bolum basliklarini ozellestirin.** Varsayilan basliklar yerine icerige uygun basliklar kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ DetailSummary'yi liste sayfasinda kullanmak**
Bu bilesen tekil kayit detay sayfasi icindir; listeler icin \`Table\` ve \`Card\` kullanin.

**❌ Cok fazla \`detailItems\` eklemek (20+)**
Uzun ozellik listesi okunabilirligi dusurur; gruplama veya sekmelerle organize edin.

**❌ JSON viewer'i son kullanicilara gostermek**
Ham JSON verisi teknik olmayan kullanicilar icin anlamsizdir; yalnizca teknik roller icin gosterin.

**❌ Erisim kontrolunu alt bilesenlerde ayri ayri yonetmek**
Merkezi \`access\` prop'u kullanin; alt bilesenler otomatik olarak miras alir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile icerik bolumu tanimlanir; \`data-component\` ile bilesen turu belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` (DOM'dan kaldirilir) modu desteklenir. \`accessReason\` \`title\` olarak gosterilir.

**Alt Bilesen Erisimi:** PageHeader, SummaryStrip, EntitySummaryBlock ve Descriptions erisim ayarlari otomatik olarak miras alinir.

**Baslik Hiyerarsisi:** PageHeader \`h1\`, Descriptions \`h3\` ile dogru baslik sirasi korunur.

**Gorsel:** Premium yuzey gorunumu gorsel cekicilik saglarken icerik semantigi korunur.`,
      },
    ],
    relatedComponents: ["PageHeader", "SummaryStrip", "EntitySummaryBlock", "Descriptions"],
  },

  NavigationRail: {
    componentName: "NavigationRail",
    summary: "NavigationRail, dikey navigasyon rayı bilesenidir. Ikon, etiket, badge, aciklama ve footer destekli kompakt veya genis modlarda calisan yan navigasyon sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NavigationRail, uygulama icinde dikey bir navigasyon rayi saglar. Her oge ikon, etiket, aciklama ve badge icerebilir. Kontrollü (\`value\` + \`onValueChange\`) ve kontrolsuz (\`defaultValue\`) modlari ile URL path eslestirmesi (\`currentPath\`) destekler.

\`compact\` modda yalnizca ikonlar gosterilir (80px genislik), normal modda etiketler ve aciklamalar goruntulenir (256px). \`appearance\` (default, outline, ghost), \`size\` (sm, md), \`labelVisibility\` (always, active, none) ve \`align\` (start, center) ile gorunum ozellestirilebilir. \`createNavigationRailPreset\` ile hazir yapilandirmalar (\`workspace\`, \`compact_utility\`, \`ops_side_nav\`) kullanilabilir.`,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama veya modul seviyesinde yan navigasyon olusturmak icin
- 3-8 arasi navigasyon hedefi olan sayfalarda
- Kompakt ikon navigasyonu gereken durumlarda
- URL tabanli sayfa gecisi ile senkronize navigasyon icin

**Kullanmayin:**
- Yatay navigasyon icin — bunun yerine \`Tabs\` veya \`Navbar\` kullanin
- Cok sayida (10+) navigasyon ogesi icin — bunun yerine agac yapisi veya menu kullanin
- Icerik icinde bolum secimi icin — bunun yerine \`Tabs\` kullanin
- Tek seferlik aksiyon listesi icin — bunun yerine \`Menu\` veya \`ActionList\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────┐
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │  ← Aktif oge
│ │        [Badge?]  │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │  ← Normal oge
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ [Icon] Label     │ │
│ │        Desc      │ │
│ └──────────────────┘ │
│ ──────────────────── │
│ [Footer]             │
└──────────────────────┘
\`\`\`

1. **Container** — Yuvarlatilmis dis cerceve (\`<nav>\`), premium gorunum yuzey
2. **Item List** — Dikey siralanmis navigasyon ogeleri (\`<ul>\`)
3. **Item** — Her navigasyon hedefi; \`<a>\` (href varsa) veya \`<button>\`
4. **Icon** (opsiyonel) — Ogeyi temsil eden ikon
5. **Label** — Navigasyon etiket metni
6. **Description** (opsiyonel) — Etiket altinda kisa aciklama
7. **Badge** (opsiyonel) — Bildirim veya sayac gostergesi
8. **Footer** (opsiyonel) — Listenin altinda ayrimci ile ek icerik`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Preset ile tutarlilik saglayin.** \`createNavigationRailPreset\` ile \`workspace\`, \`compact_utility\` veya \`ops_side_nav\` yapilandirmalarini kullanin.

**3-8 arasi navigasyon ogesi kullanin.** Cok az oge gereksiz bosluk, cok fazla oge gorsel karisiklik yaratir.

**\`currentPath\` ile URL senkronizasyonu saglayin.** Sayfa URL'si ile aktif oge otomatik eslesmesi icin \`currentPath\` ve \`matchPath\` kullanin.

**Kompakt modda ikonlari anlamli secin.** Yalnizca ikon gorunumunde etiket \`title\` ve \`aria-label\` olarak otomatik uygulanir.

**Badge ile bildirimleri gosterin.** Okunmamis bildirim veya bekleyen islem sayisini badge ile belirtin.

**Footer'i yardimci icerik icin kullanin.** Ayarlar, profil veya yardim baglantilari icin footer alanini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 10'dan fazla navigasyon ogesi eklemek**
Uzun navigasyon listesi kaydirma gerektirir ve kullanilabilirligi dusurur; gruplama veya hiyerarsi kullanin.

**❌ Kompakt modda etiket gorunurlugunu zorlamak**
\`compact\` mod otomatik olarak \`labelVisibility: "none"\` uygular; etiket gorunurlugunu ayri kontrol etmeyin.

**❌ \`disabled\` ogeler icin aciklama saglamadan kullanmak**
Devre disi ogelerin neden erisilemez oldugu \`accessReason\` ile belirtilmelidir.

**❌ Hem \`value\` hem \`defaultValue\` prop'unu ayni anda vermek**
Kontrollü ve kontrolsuz mod karistirilmamalidir; birini secin.

**❌ NavigationRail'i icerik bolumleri arasinda tab olarak kullanmak**
Sayfa/modul navigasyonu icindir; icerik sekmeleri icin \`Tabs\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<nav aria-label>\` ile navigasyon landmark olarak tanimlanir. Ogeler \`<ul>\`/\`<li>\` ile listelensinir.

**Klavye:** Yukari/Asagi ok tuslari ile ogeler arasi gezinme, Home/End ile ilk/son ogeye atlama, Enter/Space ile secim desteklenir. Roving tabindex paterni uygulanir.

**Aktif Oge:** \`aria-current="page"\` ile aktif sayfa ekran okuyuculara bildirilir.

**Devre Disi:** \`aria-disabled\` ile devre disi ogeler isaretlenir; erisim nedeni \`title\` olarak gosterilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\`, \`readonly\` ve \`disabled\` modlari desteklenir.

**Kompakt Mod:** Yalnizca ikon gorunumunde etiket \`aria-label\` ve \`title\` olarak otomatik uygulanir.`,
      },
    ],
    relatedComponents: ["Tabs", "Sidebar", "Menu", "PageLayout"],
  },

  TextInput: {
    componentName: "TextInput",
    summary: "TextInput, label, yardimci metin, hata mesaji, karakter sayaci ve erisim kontrolu ile tek satirlik metin girisi saglayan form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TextInput, tek satirlik metin girisi icin kullanilan temel form elemanidir. \`FieldControlShell\` altyapisi uzerinde label, description, hint, error ve karakter sayaci destegi sunar.

Uc farkli boyut (\`sm\`, \`md\`, \`lg\`), leading/trailing gorsel slotlari, kontrol edilebilir (controlled) ve kontrolsuz (uncontrolled) deger yonetimi ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TextInput label="Ad Soyad" placeholder="Adinizi girin" size="md" />
<TextInput label="E-posta" error="Gecersiz e-posta adresi" />
<TextInput label="Arama" leadingVisual={<SearchIcon />} showCount maxLength={100} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kisa metin verisi toplamak icin (isim, e-posta, telefon, arama)
- Form alanlari icin label ve dogrulama geri bildirimi gerektiginde
- Karakter siniri ve sayac gosterimi gereken alanlarda
- Ikon ile zenginlestirilmis giris alanlari olusturmak icin

**Kullanmayin:**
- Cok satirlik metin girisi icin — bunun yerine \`TextArea\` kullanin
- Tarih veya saat secimi icin — bunun yerine \`DatePicker\` veya \`TimePicker\` kullanin
- Secenekler arasindan secim icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Dosya yuklemesi icin — bunun yerine \`Upload\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Leading?]  [Input]  [Trailing?]    │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
│                        [Count?]      │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile input'a baglanir
2. **Input** — Native \`<input>\` elemani; \`type\`, \`placeholder\`, \`maxLength\` destekler
3. **Leading Visual** (opsiyonel) — Input oncesinde ikon veya gorsel slot
4. **Trailing Visual** (opsiyonel) — Input sonrasinda ikon veya gorsel slot
5. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi
6. **Count** — Karakter sayaci (\`showCount\` veya \`maxLength\` ile aktif)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman \`label\` ekleyin.** Gorsel etiket olmadan alan amaci belirsiz kalir; ekran okuyucular icin de kritiktir.

**\`error\` prop'u ile dogrulama geri bildirimi saglayin.** Hata mesajlari spesifik ve yonlendirici olmalidir: "E-posta formati hatali" gibi.

**\`maxLength\` ile birlikte \`showCount\` kullanin.** Kullanici kalan karakter sayisini gorebilir.

**Boyutu baglamina gore secin.** Tablolarda \`sm\`, formlarda \`md\`, hero alanlarda \`lg\` kullanin.

**\`leadingVisual\` ile gorsel baglam saglayin.** Arama alani icin buyutec ikonu, e-posta icin zarf ikonu gibi.

**\`access\` prop'u ile erisim kontrolu yapin.** \`readonly\`, \`disabled\` ve \`hidden\` modlari merkezi olarak yonetilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Label olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`label\` veya \`aria-label\` ekleyin.

**❌ Cok satirlik icerik icin TextInput kullanmak**
Uzun metinler icin \`TextArea\` bileseni kullanin; TextInput tek satir icindir.

**❌ Belirsiz placeholder metinleri**
"Deger girin" yerine spesifik yonlendirme yapin: "ornek@email.com" gibi.

**❌ Yalnizca renk ile hata durumunu belirtmek**
Renk degisikliginin yaninda mutlaka \`error\` metin mesaji ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile input'a baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji input'a baglanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`readonly\` ve \`disabled\` durumlarinda \`aria-readonly\` ve \`aria-disabled\` otomatik uygulanir.

**Karakter Sayaci:** \`showCount\` aktifken sayac \`sr-only\` class ile ekran okuyuculara sunulur.

**Klavye:** Native \`<input>\` semantigi ile tam klavye destegi saglanir.`,
      },
    ],
    relatedComponents: ["TextArea", "Select", "Combobox", "TimePicker"],
  },

  TextArea: {
    componentName: "TextArea",
    summary: "TextArea, cok satirlik metin girisi icin auto-resize, karakter sayaci ve dogrulama destegi sunan form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TextArea, uzun metin girisi gerektiren senaryolar icin tasarlanmis cok satirlik form elemanidir. \`FieldControlShell\` altyapisi uzerinde label, description, hint, error ve karakter sayaci destegi sunar.

Uc farkli boyut (\`sm\`, \`md\`, \`lg\`), uc resize modu (\`vertical\`, \`none\`, \`auto\`), kontrol edilebilir ve kontrolsuz deger yonetimi ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TextArea label="Aciklama" rows={4} resize="vertical" />
<TextArea label="Notlar" resize="auto" showCount maxLength={500} />
<TextArea label="Yorum" error="Bu alan zorunludur" required />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Cok satirlik metin girisi icin (aciklama, yorum, not, mesaj)
- Uzun icerik yazimi gereken form alanlarinda
- Otomatik yukseklik ayarlama gereken serbest metin alanlarinda
- Karakter sinirlamasi olan uzun metin girisi alanlarinda

**Kullanmayin:**
- Kisa, tek satirlik girisler icin — bunun yerine \`TextInput\` kullanin
- Zengin metin duzenlemesi icin — bunun yerine rich text editor kullanin
- Kod yazimi icin — bunun yerine code editor bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Leading?]                          │
│  [Textarea                         ] │
│  [                                 ] │
│  [                      Trailing?] ] │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
│                        [Count?]      │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile textarea'ya baglanir
2. **Textarea** — Native \`<textarea>\` elemani; \`rows\`, \`resize\`, \`maxLength\` destekler
3. **Leading / Trailing Visual** (opsiyonel) — Gorsel slot alanlari
4. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi
5. **Count** — Karakter sayaci (\`showCount\` veya \`maxLength\` ile aktif)`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`rows\` ile baslangic yuksekligini ayarlayin.** Varsayilan 4 satirdir; icerik tipine gore 2-8 arasi ayarlanabilir.

**\`resize="auto"\` ile dinamik yukseklik saglayin.** Kullanici yazdikca alan otomatik buyur; uzun metinlerde kullanici deneyimini iyilestirir.

**\`maxLength\` ve \`showCount\` birlikte kullanin.** Kullaniciya kalan karakter sinirini gostermek veri kalitesini arttirir.

**\`error\` ile spesifik dogrulama mesaji verin.** "Bu alan zorunludur" veya "Minimum 10 karakter gerekli" gibi yonlendirici mesajlar kullanin.

**\`access\` ile erisim kontrolu yapin.** Goruntuleme modunda \`readonly\`, devre disi durumda \`disabled\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Kisa girisler icin TextArea kullanmak**
Tek satirlik veriler icin \`TextInput\` kullanin; TextArea gereksiz alan kaplar.

**❌ \`resize="none"\` ile kullaniciyi kisitlamak**
Kullanicinin alani boyutlandirabilmesi genellikle daha iyi bir deneyim saglar; zorunlu olmadikca \`vertical\` veya \`auto\` tercih edin.

**❌ Cok yuksek \`rows\` degeri vermek**
Baslangicta 10+ satir gostermek sayfayi gereksiz uzatir; \`resize="auto"\` ile dinamik buyume tercih edin.

**❌ Label olmadan kullanmak**
Erisim sorunlarina yol acar; her zaman \`label\` veya \`aria-label\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile textarea'ya baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji textarea'ya baglanir.

**Resize:** \`data-resize\` attribute ile resize modu belirtilir; \`auto\` modunda yukseklik icerige gore otomatik ayarlanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`readonly\` ve \`disabled\` durumlarinda native attribute'lar otomatik uygulanir.

**Klavye:** Native \`<textarea>\` semantigi ile tam klavye destegi saglanir; Tab ile navigasyon mumkundur.`,
      },
    ],
    relatedComponents: ["TextInput", "Select", "Upload"],
  },

  TimePicker: {
    componentName: "TimePicker",
    summary: "TimePicker, saat ve dakika secimi icin native time input ve gorsel etiket birlestiren form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TimePicker, saat degeri secimi icin native \`<input type="time">\` uzerine insa edilmis form elemanidir. \`FieldControlShell\` altyapisi ile label, description, hint, error destegi sunar.

Uc boyut (\`sm\`, \`md\`, \`lg\`), \`min\`/\`max\`/\`step\` kisitlamalari, kontrol edilebilir ve kontrolsuz deger yonetimi ve \`access\` tabanli erisim kontrolu icerir. Secilen saat gorsel bir etiket olarak gosterilir.

\`\`\`tsx
<TimePicker label="Baslangic Saati" />
<TimePicker label="Bitis Saati" min="09:00" max="18:00" step={900} />
<TimePicker label="Randevu" error="Gecersiz saat" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Saat ve dakika degeri secmek icin (randevu, zamanlama, planlama)
- Form icerisinde zaman bilgisi toplamak icin
- Belirli saat araligi kisitlamasi gereken senaryolarda
- Tarih bilesiyle birlikte tarih-saat kombinasyonu olusturmak icin

**Kullanmayin:**
- Tarih secimi icin — bunun yerine \`DatePicker\` kullanin
- Serbest metin olarak saat girisi icin — bunun yerine \`TextInput\` kullanin
- Sure (duration) secimi icin — ozel bilesenler kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  [Time Input]       [Time Badge]     │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar; \`<label>\` ile input'a baglanir
2. **Time Input** — Native \`<input type="time">\` elemani; tarayici saat secicisini acar
3. **Time Badge** — Secilen saati gorsel olarak gosteren kompakt etiket
4. **Description / Hint / Error** — Yardimci metin veya dogrulama hatasi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`min\` ve \`max\` ile saat araligini kisitlayin.** Mesai saatleri gibi belirli araliklarla sinirlamak veri kalitesini arttirir.

**\`step\` ile dakika araligini belirleyin.** 15 dakikalik araliklar icin \`step={900}\` (saniye cinsinden) kullanin.

**\`onValueChange\` ile deger degisikliklerini yakayin.** String formatinda saat degerini dogrudan alir.

**Label ile amaci net belirtin.** "Saat" yerine "Baslangic Saati" veya "Randevu Saati" gibi spesifik etiketler kullanin.

**DatePicker ile birlikte kullanin.** Tarih-saat kombinasyonu gereken senaryolarda iki bileseni yan yana konumlandirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Serbest metin input'u olarak saat toplamak**
Kullanicilarin farkli formatlarda saat girmesi dogrulama sorunlarina yol acar; TimePicker kullanin.

**❌ Label olmadan kullanmak**
Ekran okuyucular icin erisim sorunu yaratir. Her zaman \`label\` ekleyin.

**❌ Cok dar \`min\`-\`max\` araligi vermek**
Kullanicinin secim yapamayacagi kadar dar araliklar kullanilabilirlik sorunlarina yol acar.

**❌ \`step\` degeri olmadan dakika hassasiyeti beklemek**
Varsayilan olarak dakika bazinda secim yapilir; daha buyuk araliklar icin \`step\` belirtin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile time input'a baglanir; ekran okuyucular alan amacini bildirir.

**Hata Bildirimi:** \`aria-invalid\` ile gecersiz durum isaretlenir; \`aria-describedby\` ile hata mesaji input'a baglanir.

**Native Tarayici Destegi:** \`<input type="time">\` kullanildigi icin tarayici yerlesik saat secicisi ve klavye navigasyonu saglar.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`readonly\` durumda degisiklik engellenir, \`disabled\` durumda input devre disi kalir.

**Gorsel Etiket:** Secilen saat \`Text\` bileseni ile gorsel olarak gosterilir; deger yokken \`emptyValueLabel\` mesaji sunulur.`,
      },
    ],
    relatedComponents: ["DatePicker", "TextInput", "Select"],
  },

  Upload: {
    componentName: "Upload",
    summary: "Upload, dosya secimi ve surukle-birak ile dosya yukleme islemi saglayan, dosya listesi ve dogrulama destekli form primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Upload, dosya yukleme islemi icin surukle-birak alani ve dosya secim diyalogu sunan form elemanidir. \`FieldControlShell\` altyapisi ile label, description, hint, error destegi icerir.

Dosya listesi yonetimi (kontrol edilebilir ve kontrolsuz), \`maxFiles\` sinirlamasi, \`accept\` ile dosya tipi filtreleme, \`multiple\` secim destegi ve \`access\` tabanli erisim kontrolu saglar. Secilen dosyalar chip formatinda listelenir.

\`\`\`tsx
<Upload label="Belge Yukle" accept=".pdf,.doc" />
<Upload label="Gorseller" multiple maxFiles={5} accept="image/*" />
<Upload label="Rapor" error="Dosya boyutu cok buyuk" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Form icerisinde dosya yukleme alani gereken senaryolarda
- Surukle-birak ile dosya secimi sunmak icin
- Birden fazla dosya yukleme gereken durumlarda
- Dosya tipi ve sayi kisitlamasi uygulamak icin

**Kullanmayin:**
- Gorsel onizleme ve crop gerektiren senaryolarda — ozel gorsel yukleme bileseni kullanin
- Buyuk dosya transferi ve progress bar gerektiren durumlarda — ozel yukleme yoneticisi kullanin
- Metin veya deger girisi icin — bunun yerine \`TextInput\` veya \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Label]                 [Required?] │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │  [Empty State Label]    [Count]│  │
│  │  [Accept Info]                 │  │
│  └────────────────────────────────┘  │
│  [File Chip] [File Chip] ...         │
├──────────────────────────────────────┤
│  [Description / Hint / Error]        │
└──────────────────────────────────────┘
\`\`\`

1. **Label** — Alan basligini tanimlar
2. **Drop Zone** — Kesikli kenarli surukle-birak alani; tiklanabilir
3. **Empty State Label** — Kullaniciya dosya secme/surekleme yonlendirmesi
4. **Count Badge** — Mevcut dosya sayisi ve \`maxFiles\` siniri
5. **Accept Info** — Izin verilen dosya tipleri bilgisi
6. **File Chips** — Secilen dosyalarin adi ve boyutu ile listelenmesi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`accept\` ile dosya tiplerini kisitlayin.** Kullanicinin yanlis dosya tipi secmesini onler: \`accept="image/*"\` veya \`accept=".pdf,.doc"\`.

**\`maxFiles\` ile dosya sayisini sinirlayin.** Cok fazla dosya yuklenmesini onlemek icin makul bir sinir belirleyin.

**\`multiple\` prop'unu ihtiyaca gore ayarlayin.** Tek dosya gereken senaryolarda varsayilan \`false\` degerini koruyun.

**Hata mesajlarini spesifik yapin.** "Dosya boyutu 5MB'i asamaz" veya "Yalnizca PDF formatinda dosya yuklenir" gibi.

**\`onFilesChange\` ile dosya listesini yonetin.** Kontrol edilebilir modda dosya ekleme ve cikarma islemlerini yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Dosya tipi kisitlamasi olmadan kullanmak**
Kullanicinin uygunsuz dosya tiplerini yuklemesine izin vermek guvenlik ve kullanilabilirlik sorunu yaratir.

**❌ \`maxFiles\` siniri olmadan \`multiple\` kullanmak**
Sinirlandirma olmadan cok fazla dosya yuklenmesi performans sorunlarina yol acar.

**❌ Buyuk dosyalar icin progress geri bildirimi vermemek**
Upload bileseni dosya secimini yonetir; sunucu yukleme sureci icin ayri progress gostergesi ekleyin.

**❌ Label olmadan kullanmak**
Erisim sorunlarina yol acar; her zaman \`label\` ekleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Label Baglantisi:** \`<label>\` elemani \`htmlFor\` ile gizli file input'a baglanir; tiklandiginda dosya secici acilir.

**Gizli Input:** \`<input type="file">\` \`sr-only\` class ile gorsel olarak gizlenir; klavye ile erisim \`label\` uzerinden saglanir.

**Hata Bildirimi:** \`aria-invalid\` ve \`aria-describedby\` ile hata mesaji file input'a baglanir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`readonly\` ve \`disabled\` durumlarinda dosya secimi engellenir.

**Dosya Bilgisi:** Secilen dosyalarin adi ve boyutu gorsel chip olarak sunulur; ekran okuyucular icerigini okuyabilir.`,
      },
    ],
    relatedComponents: ["TextInput", "TextArea", "Button"],
  },

  Segmented: {
    componentName: "Segmented",
    summary: "Segmented, tek veya coklu secim modunda gorsel segment kontrolu sunan, roving tabindex ve klavye navigasyonu destekleyen bilesen.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Segmented, bir grup secenekten birini veya birden fazlasini secmeye yarayan segmentli kontrol bilesenidir. Tab bar, filtre cubugu ve toolbar senaryolarinda kullanilir.

Uc gorunum modu (\`default\`, \`outline\`, \`ghost\`), uc boyut (\`sm\`, \`md\`, \`lg\`), iki sekil (\`rounded\`, \`pill\`), dikey/yatay oryantasyon, ikon, badge ve aciklama destegi sunar. \`single\` ve \`multiple\` secim modlari ile roving tabindex klavye navigasyonu icerir.

\`\`\`tsx
<Segmented
  items={[
    { value: "list", label: "Liste" },
    { value: "grid", label: "Izgara" },
    { value: "board", label: "Pano" },
  ]}
  value="list"
  onValueChange={(v) => setView(v)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Gorunum modu degistirme icin (liste/grid/pano)
- Filtre cubugu olarak secenekler arasinda hizli gecis icin
- Toolbar icerisinde mod secimi icin
- Az sayida (2-5) secenekten birini veya birden fazlasini secmek icin

**Kullanmayin:**
- Sayfa navigasyonu icin — bunun yerine \`Tabs\` kullanin
- Cok fazla secenek (6+) icin — bunun yerine \`Select\` veya \`Dropdown\` kullanin
- Form icerisinde deger secimi icin — bunun yerine \`Radio\` veya \`Select\` kullanin
- Boolean acma/kapama icin — bunun yerine \`Switch\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  ┌──────┐ ┌──────────┐ ┌──────┐     │
│  │[Icon]│ │ [Active] │ │[Icon]│     │
│  │[Lbl] │ │ [Label]  │ │[Lbl] │     │
│  │      │ │ [Badge]  │ │      │     │
│  └──────┘ └──────────┘ └──────┘     │
└──────────────────────────────────────┘
\`\`\`

1. **Container** — Segment grubunun dis cercevesi; gorunum ve sekil stillerini tasir
2. **Segment Item** — Tekil secim dugmesi; \`role="radio"\` ile isaretlenir
3. **Icon** (opsiyonel) — Baslangic, bitis veya ust konumda ikon
4. **Label** — Secenek metni
5. **Badge** (opsiyonel) — Sayi veya durum gostergesi
6. **Description** (opsiyonel) — Secenek alt aciklamasi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secenek sayisini 2-5 arasinda tutun.** Fazla secenek gorsel karisiklik yaratir; 6+ secenek icin \`Select\` kullanin.

**Tutarli gorunum modu secin.** \`default\` genel kullanim, \`outline\` vurgulu secimler, \`ghost\` minimal gorunum icin uygundur.

**\`ariaLabel\` ile grubun amacini belirtin.** Ekran okuyucular icin "Gorunum modu" veya "Filtre secenekleri" gibi etiket ekleyin.

**\`createSegmentedPreset\` ile tutarlilik saglayin.** \`toolbar\`, \`filter_bar\`, \`pill_tabs\` preset'leri ile standart yapilandirmalar kullanin.

**\`allowEmptySelection\` ile bos secim davranisini kontrol edin.** Varsayilan olarak en az bir secenek secili kalmalidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa navigasyonu icin kullanmak**
Segmented gorunum degistirme icindir; sayfa gecisleri icin \`Tabs\` veya \`NavigationRail\` kullanin.

**❌ 6'dan fazla secenek eklemek**
Cok fazla segment gorsel olarak tasima kapasitesini asar; \`Select\` veya \`Dropdown\` tercih edin.

**❌ \`ariaLabel\` olmadan kullanmak**
Ekran okuyucular grubun amacini bilemez; her zaman \`ariaLabel\` ekleyin.

**❌ Farkli boyutlarda segment'leri yan yana kullanmak**
Ayni sayfada farkli \`size\` degerleri gorsel tutarsizlik yaratir; standart preset'ler kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA Rolleri:** Container \`role="group"\`, segment'ler \`role="radio"\` ile isaretlenir; \`aria-checked\` ile secim durumu bildirilir.

**Roving Tabindex:** Yalnizca aktif segment \`tabIndex={0}\` alir; diger segment'ler \`tabIndex={-1}\` ile Tab sirasindan cikarilir.

**Klavye Navigasyonu:** Ok tuslari ile segment'ler arasinda gecis, Home/End ile ilk/son segmente atlama desteklenir.

**Devre Disi:** \`disabled\` segment'ler \`pointer-events-none\` ve dusuk opakllik ile gorsel ve islevsel olarak devre disi birakilir.

**Focus Ring:** Klavye odagi \`focus-visible:ring-2\` ile gorsel olarak belirtilir.`,
      },
    ],
    relatedComponents: ["Tabs", "Radio", "Switch", "Dropdown"],
  },

  MobileStepper: {
    componentName: "MobileStepper",
    summary: "MobileStepper, kucuk ekran senaryolarinda dots, text veya progress varyantli kompakt adim gostergesi sunan navigasyon primitividir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `MobileStepper, mobil ve dar viewport senaryolarinda cok adimli sureclerin ilerlemesini gosteren kompakt navigasyon bilesenidir. Masaustu \`Steps\` bileseninin mobil optimizasyonlu karsiligi olarak tasarlanmistir.

Uc varyant destekler: **dots** (nokta gostergeleri), **text** (metin tabanli ilerleme, orn. "3 / 5") ve **progress** (ilerleme cubugu). Ileri/geri navigasyon butonlari ile adimlar arasi gecis saglar.

\`\`\`tsx
<MobileStepper variant="dots" steps={5} activeStep={2}
  onNext={handleNext} onBack={handleBack} />
<MobileStepper variant="text" steps={3} activeStep={0} />
<MobileStepper variant="progress" steps={4} activeStep={1} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Mobil cihazlarda cok adimli form veya sihirbaz sureci icin
- Dar alanlarda adim sayisi ve ilerleme gostermek icin
- Onboarding akislarinda sayfa gecisini yonetmek icin
- Carousel veya slider navigasyonunda konum gostermek icin

**Kullanmayin:**
- Genis ekranlarda detayli adim bilgisi gerektiren surecler icin — bunun yerine \`Steps\` kullanin
- Sayfa navigasyonu icin — bunun yerine \`Tabs\` veya \`NavigationRail\` kullanin
- Yalnizca ilerleme durumu gostermek icin — bunun yerine \`Progress\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Back]  [● ● ○ ○ ○ / 2/5]  [Next] │
│          [════════░░░░░░░]           │
└──────────────────────────────────────┘
\`\`\`

1. **Back Button** — Onceki adima donme aksiyonu
2. **Indicator** — Varyanta gore dots, text veya progress bar
3. **Next Button** — Sonraki adima ilerleme aksiyonu
4. **Dots** — Her adim icin bir nokta; aktif adim dolu gosterilir
5. **Text** — "activeStep / totalSteps" formatinda metin
6. **Progress Bar** — Yuzdeli ilerleme cubugu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Adim sayisini 7 ile sinirlayin.** Cok fazla adim mobil ekranda dots varyantinda okunakliligi dusurur.

**Varyanti icerige gore secin.** Az adim (3-5) icin \`dots\`, cok adim icin \`text\`, gorsel ilerleme icin \`progress\` kullanin.

**Ileri/geri butonlarini kosullu devre disi birakin.** Ilk adimda "Geri", son adimda "Ileri" butonunu devre disi birakin.

**Steps bileseni ile tutarlilik saglayin.** Masaustunde \`Steps\`, mobilde \`MobileStepper\` kullanarak responsive deneyim sunun.

**Adim gecislerinde ilerlemeyi kaydedin.** Kullanici geri donebilmeli ve veri kaybetmemelidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Masaustu gorunumde MobileStepper kullanmak**
Genis ekranlarda \`Steps\` bileseni daha iyi icerik ve etiket gosterimi saglar.

**❌ 7'den fazla adimla dots varyanti kullanmak**
Cok fazla nokta gorsel olarak okunamaz hale gelir; \`text\` veya \`progress\` varyantina gecin.

**❌ Navigasyon butonlarini gizlemek**
Kullanicinin adimlar arasi gecis yapabilmesi icin her zaman ileri/geri butonlarini gosterin.

**❌ Adim sayisini dinamik olarak degistirmek**
Surecin ortasinda adim sayisi degismesi kullaniciyi sasirtir; adim yapisi sabit olmalidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** Bilesen \`role="navigation"\` ile isaretlenir; \`aria-label\` ile amac belirtilir (orn. "Adim ilerleme").

**Ilerleme Bildirimi:** Aktif adim degistiginde \`aria-valuenow\`, \`aria-valuemin\` ve \`aria-valuemax\` ile ilerleme durumu ekran okuyuculara bildirilir.

**Buton Etiketleri:** Ileri ve geri butonlari \`aria-label\` ile "Sonraki adim" ve "Onceki adim" olarak etiketlenir.

**Klavye:** Tab ile butonlar arasinda gecis, Enter/Space ile aksiyon tetikleme desteklenir.

**Devre Disi:** Ilk ve son adimlarda ilgili butonlar \`disabled\` ve \`aria-disabled\` ile isaretlenir.`,
      },
    ],
    relatedComponents: ["Steps", "Pagination", "Tabs"],
  },

  TablePagination: {
    componentName: "TablePagination",
    summary: "TablePagination, tablo ve liste gorunumlerinde sayfa boyutu, aralik bilgisi ve navigasyon butonlari ile sayfalama kontrolu saglayan bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TablePagination, veri tablolari ve listeler icin ozellestirilmis sayfalama kontrolu sunar. Sayfa boyutu degistiricisi, aralik etiketi ve ileri/geri/ilk/son sayfa navigasyon butonlarini tek bilesenle birlesitirir.

Kontrol edilebilir ve kontrolsuz sayfa/sayfa boyutu yonetimi, \`totalItemsKnown\` ile belirsiz toplam kayit destegi, \`localeText\` ile dil ozellestirmesi, \`slots\` ile aksiyon bileseni degistirme ve \`access\` tabanli erisim kontrolu icerir.

\`\`\`tsx
<TablePagination totalItems={250} page={1} pageSize={20}
  onPageChange={setPage} onPageSizeChange={setSize} />
<TablePagination totalItems={0} totalItemsKnown={false}
  hasNextPage={true} showFirstLastButtons />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Veri tablolarinda sayfalama kontrolu icin
- Liste gorunumlerinde sayfa boyutu ve navigasyon saglamak icin
- Sunucu tarafli sayfalamada sayfa degisikliklerini yonetmek icin
- Toplam kayit sayisi bilinmeyen (infinite) veri kaynaklarinda

**Kullanmayin:**
- Genel amacli sayfa navigasyonu icin — bunun yerine \`Pagination\` kullanin
- Sonsuz kaydirma (infinite scroll) senaryolarinda — ozel cozum kullanin
- Icerik karuseli veya slayt gosterisinde — bunun yerine \`MobileStepper\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────────────────────────────────┐
│  [Rows per page: [Select]]  [1-20 of 250]       │
│                             [« ‹ › »]            │
└─────────────────────────────────────────────────┘
\`\`\`

1. **Rows Per Page Label** — Sayfa boyutu etiketi (orn. "Satir sayisi:")
2. **Size Changer** — Sayfa boyutu secim kontrolu (\`PaginationSizeChanger\`)
3. **Range Label** — Gosterilen aralik bilgisi (orn. "1-20 of 250")
4. **Navigation Actions** — Ilk/onceki/sonraki/son sayfa butonlari
5. **Container** — Premium gorunumlu dis cerceve`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`pageSizeOptions\` ile makul degerler sunun.** Varsayilan \`[10, 20, 50, 100]\` cogu senaryo icin uygundur.

**\`localeText\` ile Turkce etiketler saglayin.** \`rowsPerPageLabel\`, \`rangeLabel\`, buton etiketleri gibi metin alanlarini ozellestirin.

**\`showFirstLastButtons\` ile hizli navigasyon ekleyin.** Cok sayfalik veri setlerinde ilk/son sayfa butonlari kullanici deneyimini iyilestirir.

**\`resetPageOnPageSizeChange\` ayarini yapin.** Sayfa boyutu degistiginde ilk sayfaya donme genellikle beklenen davranistir.

**Belirsiz toplam icin \`totalItemsKnown={false}\` kullanin.** Sunucu toplam sayiyi bilmiyorsa \`hasNextPage\` ile sonraki sayfa varligini belirtin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Sayfa boyutu seceneklerini cok kucuk veya buyuk yapmak**
\`[1, 2, 5]\` gibi cok kucuk veya \`[1000, 5000]\` gibi cok buyuk degerler performans ve kullanilabilirlik sorunlarina yol acar.

**❌ Tablo disinda genel sayfalama icin kullanmak**
TablePagination tablo/liste odaklidir; genel navigasyon icin \`Pagination\` kullanin.

**❌ \`localeText\` olmadan coklu dil destegi beklemek**
Varsayilan etiketler Ingilizce'dir; Turkce arayuzlerde \`localeText\` ile cevirileri saglayin.

**❌ \`onPageChange\` ve \`onPageSizeChange\` olmadan kullanmak**
Kontrolsuz modda bile callback'ler veri cekme islemlerini tetiklemek icin gereklidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Buton Etiketleri:** Ileri, geri, ilk ve son sayfa butonlari \`aria-label\` ile etiketlenir (orn. "Previous page", "Next page").

**Devre Disi Durumu:** Ilk sayfada "onceki" ve "ilk" butonlari, son sayfada "sonraki" ve "son" butonlari \`disabled\` olarak isaretlenir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen render edilmez. \`access\` degeri alt bilesenlere (butonlar, size changer) aktarilir.

**Sayfa Boyutu Secimi:** \`PaginationSizeChanger\` bileseni erisim kontrol destegi ile render edilir.

**Semantik:** \`data-component="table-pagination"\` ile bilesen turu belirtilir; \`data-access-state\` ile erisim durumu isaretlenir.`,
      },
    ],
    relatedComponents: ["Pagination", "Steps", "MobileStepper"],
  },

  Empty: {
    componentName: "Empty",
    summary: "Empty, veri bulunmadiginda veya icerik bos oldugunda kullaniciya gorsel geri bildirim ve aksiyon yonlendirmesi sunan bos durum bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Empty (EmptyState), tablo, liste veya icerik alani bos oldugunda kullaniciya durumu bildiren ve sonraki adimi yonlendiren placeholder bilesendir.

Ikon, baslik, aciklama, birincil ve ikincil aksiyon butonu destekler. \`compact\` modu ile dar alanlarda (tablo satiri, kart ici) gomulu olarak kullanilabilir. \`access\` ile erisim kontrolu saglanir.

\`\`\`tsx
<Empty icon={<InboxIcon />} title="Kayit bulunamadi"
  description="Arama kriterlerinizi degistirmeyi deneyin."
  action={<Button>Yeni Ekle</Button>} />
<Empty compact title="Veri yok" />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya listede veri bulunmadiginda bos durum mesaji gostermek icin
- Arama sonucu bos oldugunda kullaniciya geri bildirim vermek icin
- Ilk kullanim senaryolarinda (onboarding) icerik olusturma yonlendirmesi icin
- Filtre sonucu bos oldugunda filtreleri sifirlamaya yonlendirmek icin

**Kullanmayin:**
- Yukleme durumu gostermek icin — bunun yerine \`Skeleton\` veya \`Spinner\` kullanin
- Hata durumu gostermek icin — bunun yerine \`Alert\` veya hata sayfasi kullanin
- Basarili islem bildirimi icin — bunun yerine \`Toast\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│            ┌────────┐                │
│            │ [Icon] │                │
│            └────────┘                │
│          [Title / Baslik]            │
│       [Description / Aciklama]       │
│  [Primary Action]  [Secondary Action]│
└──────────────────────────────────────┘
\`\`\`

1. **Icon** (opsiyonel) — Durumu gorsel olarak ifade eden ikon veya illustrasyon
2. **Title** — Bos durumu ozetleyen baslik metni
3. **Description** (opsiyonel) — Ek aciklama ve yonlendirme
4. **Primary Action** (opsiyonel) — Ana aksiyon butonu (orn. "Yeni Ekle")
5. **Secondary Action** (opsiyonel) — Alternatif aksiyon butonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli baslik ve aciklama yazin.** "Veri yok" yerine "Kayit bulunamadi — arama kriterlerinizi degistirmeyi deneyin" gibi yonlendirici mesajlar kullanin.

**Aksiyon butonu ile sonraki adimi yonlendirin.** "Yeni kayit ekle" veya "Filtreleri temizle" gibi aksiyonlar kullaniciyi yonlendirir.

**\`compact\` modunu dar alanlar icin kullanin.** Tablo ici, kart ici veya sidebar gibi kisitli alanlarda \`compact\` modu daha az yer kaplar.

**Ikon ile gorsel baglam saglayin.** Bos kutu, arama ikonu veya dosya ikonu gibi duruma uygun gorseller ekleyin.

**Tutarli bos durum tasarimi uygulayin.** Tum uygulama genelinde ayni Empty bileseni ve mesaj dilini kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Yalnizca bos alan birakmak**
Kullanici verinin yuklenip yuklenmedigi, hata mi oldugu yoksa gercekten bos mu oldugunu ayirt edemez.

**❌ Cok uzun aciklama metinleri yazmak**
Bos durum mesaji kisa ve net olmalidir; paragraf uzunlugunda aciklamalar okunmaz.

**❌ Aksiyon butonu olmadan kullanmak**
Kullanici ne yapacagini bilemez; en azindan bir yonlendirme aksiyonu ekleyin.

**❌ Yukleme durumunda Empty gostermek**
Veri henuz yuklenmemisse \`Skeleton\` veya \`Spinner\` gosterin; Empty yalnizca veri gercekten bos oldugunda kullanilir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Bilesen \`<div>\` ile render edilir; icerik merkezi hizalanmis metin olarak sunulur.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir; diger durumlarda normal render edilir.

**Ikon Erisimi:** Ikon alani \`[&>svg]\` ile boyutlandirilir; dekoratif ikon icin ek \`aria-hidden\` uygulanabilir.

**Aksiyon Butonlari:** \`action\` ve \`secondaryAction\` alanlarina verilen butonlar kendi erisim ozelliklerini tasir.

**Compact Mod:** \`compact\` modda padding ve font boyutu kucultulur ancak icerik erisimi korunur.`,
      },
    ],
    relatedComponents: ["Skeleton", "Spinner", "Alert", "Toast"],
  },

  EmptyErrorLoading: {
    componentName: "EmptyErrorLoading",
    summary: "EmptyErrorLoading, bos, hata ve yukleniyor durumlarini Empty, Spinner ve Skeleton katmanlariyla tek bir feedback recipe altinda birlestiren uc-durumlu geri bildirim bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EmptyErrorLoading, uc farkli durumu (\`empty\`, \`error\`, \`loading\`) tek bir bilesen icerisinde yoneten **recipe** bilesendir. Her mod icin uygun alt bilesen otomatik olarak render edilir:

- **loading** — \`Spinner\` ve istege bagli \`Skeleton\` placeholder katmanlari
- **error** — \`Empty\` ile hata mesaji ve istege bagli \`onRetry\` aksiyonu
- **empty** — \`Empty\` ile bos durum geri bildirimi

\`access\` prop'u ile policy-temelli gorunurluk ve etkilesim kontrolu saglanir. Tum renkler CSS degiskenleri uzerinden tanimlanir ve dark mode uyumludur.

\`\`\`tsx
import { EmptyErrorLoading } from '@mfe/design-system';

<EmptyErrorLoading
  mode="loading"
  title="Veri Yukleniyor"
  description="Lutfen bekleyin, veriler getiriliyor."
  loadingLabel="Yukleniyor..."
  showSkeleton={true}
/>

<EmptyErrorLoading
  mode="error"
  title="Hata Olustu"
  errorLabel="Baglanti saglanamadi. Lutfen tekrar deneyin."
  retryLabel="Tekrar Dene"
  onRetry={() => refetch()}
/>

<EmptyErrorLoading
  mode="empty"
  title="Kayit Bulunamadi"
  description="Bu kriterlere uygun veri bulunmuyor."
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Veri cekme isleminin bos, hata veya yukleniyor sonuclarina gore farkli geri bildirim gostermek icin
- Liste, tablo veya kart iceriginde tri-state feedback gerektiren sayfalarda
- Tutarli yukleme, hata ve bos durum deneyimi saglamak icin
- Retry mekanizmasi ile hata kurtarma akisi sunmak icin

**Kullanmayin:**
- Yalnizca yukleme durumu gostermek icin — bunun yerine \`Spinner\` veya \`Skeleton\` kullanin
- Yalnizca bos durum gostermek icin — bunun yerine \`Empty\` kullanin
- Toast veya bildirim turunde geri bildirim icin — bunun yerine \`Toast\` kullanin
- Form validasyon hatalari icin — bunun yerine inline hata mesajlari kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│  [Title]                             │
│  [Description]                       │
│  ┌────────────────────────────────┐  │
│  │  mode=loading:                 │  │
│  │    [Spinner] + [Skeleton?]     │  │
│  │  mode=error:                   │  │
│  │    [Empty] + [Retry Button?]   │  │
│  │  mode=empty:                   │  │
│  │    [Empty]                     │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
\`\`\`

1. **Section Container** — Dis cerceve; \`rounded-3xl\`, border ve golge ile stillendirilmis alan
2. **Title** — Durumu ozetleyen baslik metni
3. **Description** — Ek aciklama metni
4. **Content Panel** — Ic cerceve; mod'a gore icerik render edilir
5. **Spinner** (loading) — Blok modda donem animasyonu
6. **Skeleton** (loading, opsiyonel) — Text, rect ve table-row placeholder'lari
7. **Empty** (error/empty) — Bos durum veya hata mesaji
8. **Retry Button** (error, opsiyonel) — \`onRetry\` verildiginde gosterilen aksiyon butonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman anlamli \`title\` ve \`description\` saglayin.** Kullanici hangi durumda oldugunu net olarak anlamalidir.

**Hata durumunda \`onRetry\` ekleyin.** Kullaniciya kurtarma yolu sunmak UX kalitesini arttirir.

**\`showSkeleton\` ile icerik beklentisi olusturun.** Yukleme sirasinda skeleton placeholder'lari sayfa duzeni hakkinda ipucu verir.

**Tek bir state kaynagindan \`mode\` turetiri.** API cagrisinizin durumuna gore \`loading\`, \`error\` veya \`empty\` secin:

\`\`\`tsx
const mode = isLoading ? 'loading' : isError ? 'error' : 'empty';
<EmptyErrorLoading mode={mode} onRetry={refetch} />
\`\`\`

**\`access\` prop'unu policy kontrolu icin kullanin.** \`access="hidden"\` ile bilesen tamamen gizlenebilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Uc durumu ayri ayri yonetmek**
Ayri \`Spinner\`, \`Empty\` ve hata bilesenleri kullanmak tutarsiz gorunum ve tekrar eden kod yaratir. EmptyErrorLoading bu uc durumu birlestirmek icin tasarlanmistir.

**❌ \`onRetry\` olmadan hata durumu gostermek**
Kullanici hatanin ne oldugunu gorur ama ne yapacagini bilemez. Her zaman bir kurtarma aksiyonu ekleyin.

**❌ \`mode\` prop'unu statik olarak sabitlemek**
\`mode="loading"\` seklinde sabit deger vermek bileseni anlamini yitirir. API durumuna gore dinamik turetim kullanin.

**❌ Yukleme durumunda eski veriyi gostermek**
\`mode="loading"\` aktifken eski icerik yerine skeleton gosterilmelidir. Eski veriyi bilesene gecirmenize gerek yoktur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik Yapi:** Bilesen \`<section>\` olarak render edilir. \`data-component="empty-error-loading"\` ve \`data-mode\` ile bilesen turu ve aktif mod isaretlenir.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan tamamen kaldirilir. Diger durumlarda \`data-access-state\` ile erisim seviyesi isaretlenir.

**Yukleniyor Durumu:** \`Spinner\` \`mode="block"\` ile render edilir ve \`label\` prop'u ile ekran okuyuculara durum bildirimi yapilir.

**Hata Kurtarma:** Retry butonu \`access\` prop'unu miras alir ve klavye ile erisilebilir.

**Klavye Navigasyonu:** Retry butonu Tab sirasi ile erisilebilir ve Enter/Space ile etkinlestirilebilir.`,
      },
    ],
    relatedComponents: ["Empty", "Spinner", "Skeleton", "Alert"],
  },

  LinkInline: {
    componentName: "LinkInline",
    summary: "LinkInline, internal, external ve current-state davranisini ortak bir API ile sunan inline link primitiveidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `LinkInline, metin akisi icerisinde kullanilan bir **inline anchor** primitivedir. Iki ton (\`primary\`, \`secondary\`), uc underline modu (\`always\`, \`hover\`, \`none\`) ve otomatik external link tespiti sunar.

Harici linklerde \`target="_blank"\` ve \`rel="noopener noreferrer"\` otomatik uygulanir. \`current\` prop'u ile aktif sayfayi isaretler. \`disabled\` veya \`access\` ile blocked durumda \`<span>\` fallback render edilir.

\`\`\`tsx
import { LinkInline } from '@mfe/design-system';

<LinkInline href="/dashboard">Dashboard</LinkInline>
<LinkInline href="https://example.com" external>Harici Kaynak</LinkInline>
<LinkInline href="/settings" current>Ayarlar</LinkInline>
<LinkInline variant="secondary" underline="always" href="/help">Yardim</LinkInline>
<LinkInline disabled>Erisim Engellendi</LinkInline>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Metin akisi icerisinde baska bir sayfaya veya kaynaga yonlendirme icin
- Harici web sitelerine guvenli link vermek icin
- Breadcrumb, aciklama metni veya bilgi panellerinde inline navigasyon icin
- Aktif sayfayi \`current\` ile isaretlemek icin

**Kullanmayin:**
- Bir aksiyonu tetiklemek icin — bunun yerine \`Button\` kullanin
- Navigasyon menusunde ana link olarak — bunun yerine \`MenuBar\` veya \`NavigationMenu\` kullanin
- Kart veya liste ogesi olarak tiklanabilir alan icin — bunun yerine \`Card\` veya \`ListItem\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────┐
│ [LeadingVisual?] [Label] [TrailingVisual? | ↗] │
└────────────────────────────────────┘
\`\`\`

1. **Anchor / Span** — \`<a>\` (aktif) veya \`<span>\` (blocked) olarak render edilen kok eleman
2. **Leading Visual** (opsiyonel) — Ikon veya gorsel; \`aria-hidden\` ile dekoratif
3. **Label** — Link metni; \`children\` prop'u ile saglanir
4. **Trailing Visual** (opsiyonel) — Sag taraftaki ikon veya gorsel
5. **External Indicator** — Harici linklerde trailing visual yoksa otomatik \`↗\` ikonu
6. **Screen Reader Label** — Harici linklerde \`sr-only\` ile "External link" duyurusu
7. **Focus Ring** — \`focus-visible\` ile halka gorunumu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Anlamli link metni kullanin.** "Buraya tiklayin" yerine "Dokumantasyona gidin" gibi aciklayici metinler yazin.

**Harici linkler icin \`external\` prop'unu kullanin.** Otomatik olarak \`target="_blank"\` ve \`rel="noopener noreferrer"\` uygulanir.

**Aktif sayfayi \`current\` ile isaretleyin.** \`aria-current="page"\` otomatik atanir ve gorsel olarak vurgulanir.

**Tone secimini baglama gore yapin.** Birincil navigasyon icin \`primary\`, yardimci veya ikincil bilgi icin \`secondary\` tone kullanin.

**Blocked durumda \`accessReason\` saglayin.** Kullanici neden erisemedigini \`title\` uzerinden gorebilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Link'i buton olarak kullanmak**
\`onClick\` ile aksiyon tetiklemek icin \`<a>\` kullanmak ekran okuyucu semantigini bozar. Aksiyonlar icin \`Button\` kullanin.

**❌ \`href\` olmadan link render etmek**
\`href\` verilmediginde \`<span>\` olarak render edilir ve kullanici tiklanamayan bir metin gorur.

**❌ \`underline="none"\` ile erisilebilirligi azaltmak**
Alt cizgisiz linkler metin icerisinde ayirt edilemeyebilir. Renk tek basina yeterli degildir; \`hover\` veya \`always\` tercih edin.

**❌ Cok uzun link metinleri kullanmak**
Paragraf uzunlugunda link metinleri okunabilirligi dusurur. Link metnini kisa ve net tutun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Aktif durumda \`<a>\` olarak render edilir; blocked durumda \`<span>\` fallback kullanilir ve \`aria-disabled="true"\` atanir.

**Current State:** \`current={true}\` durumunda \`aria-current="page"\` otomatik atanir. Ekran okuyucular aktif sayfayi duyurur.

**External Link:** Harici linklerde \`sr-only\` ile "External link" duyurusu yapilir. \`target="_blank"\` ve \`rel="noopener noreferrer"\` guvenlik icin otomatik uygulanir.

**Focus Ring:** \`focus-visible\` ile \`ring-2\` odak halkasi gorunur. WCAG 2.1 AA kontrast gereksinimlerini karsilar.

**Erisim Kontrolu:** \`access="hidden"\` durumunda bilesen DOM'dan kaldirilir. \`disabled\` veya \`readonly\` durumda tiklanamaz \`<span>\` olarak render edilir.

**Klavye:** Tab ile odaklanma, Enter ile etkinlestirme.`,
      },
    ],
    relatedComponents: ["Button", "MenuBar", "Breadcrumb"],
  },

  MenuBar: {
    componentName: "MenuBar",
    summary: "MenuBar, yatay uygulama komutlari ve navigasyon aksiyonlari icin popup submenu, overflow kontrolu, search handoff ve responsive fallback destekli menubar primitiveidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `MenuBar, karmasik navigasyon ve komut mimarilerini tek bir yatay cubukta birlestiren **primitive** bilesendir. Ana ozellikleri:

- **Root Items** — Label, ikon, badge, submenu ve aksiyon destekli ust-seviye ogeler
- **Submenu** — Popup menu yuzeyinde ikonlu, kisayollu, gruplu ve ayiriciyla zengin menu icerigi
- **Overflow** — \`collapse-to-more\` ile tasan ogeleri "Daha Fazla" menusune toplama
- **Search Handoff** — Ust bar icerisinde route ve aksiyon arama paneli
- **Responsive** — \`mobileFallback="menu"\` ile dar gorunumde menu moda gecis
- **Gruplar** — \`primary\`, \`secondary\`, \`utility\` segmentleri ile item ayirimi

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "dashboard", label: "Dashboard", icon: <HomeIcon />, href: "/dashboard" },
    { value: "users", label: "Kullanicilar", icon: <UsersIcon />,
      menuItems: [
        { key: "list", label: "Liste", onClick: () => navigate("/users") },
        { key: "add", label: "Yeni Ekle", onClick: () => navigate("/users/new") },
      ]
    },
    { value: "settings", label: "Ayarlar", icon: <GearIcon />, href: "/settings" },
  ]}
  currentPath="/dashboard"
  size="md"
  appearance="default"
  ariaLabel="Ana navigasyon"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama ust bari veya ana navigasyon cubugu icin
- Birden fazla ust-seviye route ve submenu iceren navigasyon mimarisinde
- Komut paleti benzeri arama destekli header icin
- Overflow kontrolu gerektiren yogun navigasyon listelerinde
- Desktop menubar ritmi (File/View/Tools) gerektiren arayuzlerde

**Kullanmayin:**
- Basit sayfa ici link listesi icin — bunun yerine \`LinkInline\` veya \`NavLink\` kullanin
- Dikey sidebar navigasyonu icin — bunun yerine \`Sidebar\` kullanin
- Sag tik baglam menusu icin — bunun yerine \`ContextMenu\` kullanin
- Tab navigasyonu icin — bunun yerine \`Tabs\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [StartSlot?] │ [RootItem] [RootItem] ... [More?] │ [Utility?] [EndSlot?] │
│              │  ↓ active                          │                       │
│              │ ┌──────────────┐                   │                       │
│              │ │ [MenuItem]   │                   │                       │
│              │ │ [Separator]  │                   │                       │
│              │ │ [MenuItem]   │                   │                       │
│              │ └──────────────┘                   │                       │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Menubar Container** — \`role="menubar"\` ile yatay kok cubuk
2. **Start Slot** (opsiyonel) — Sol tarafta marka veya ek icerik
3. **Root Items** — Her biri aksiyon, link veya submenu tetikleyicisi olabilen ust-seviye ogeler
4. **Submenu Popup** — \`MenuSurface\` ile render edilen popup menu
5. **Overflow Trigger** — Tasan ogeleri toplayan "Daha Fazla" butonu
6. **Utility Slot** (opsiyonel) — Sag tarafta ek kontroller
7. **End Slot** (opsiyonel) — Sag uc alan
8. **Search Header** (opsiyonel) — \`enableSearchHandoff\` ile arama paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`currentPath\` ile aktif root'u otomatik isaretleyin.** Route-aware navigasyon icin \`currentPath\` ve \`matchPath\` birlikte kullanin.

**Overflow icin \`overflowPriority\` kullanin.** Onemli ogelere yuksek oncelik verin; tasan ogeler More menusune tasinir.

**\`ariaLabel\` ile menubar'i tanimlarin.** Ekran okuyucular icin "Ana navigasyon" gibi anlamli bir etiket verin.

**Submenu'leri mantiksal olarak gruplayin.** \`menuItems\` icinde separator ve label kullanarak ogeleri kategorize edin.

**\`appearance\` secimini baglama gore yapin.** \`default\` ana navigasyon icin, \`ghost\` gomulu toolbar icin, \`outline\` vurgulu alanlar icin kullanin.

**Responsive davranisi planlayin.** \`mobileFallback="menu"\` ile dar ekranlarda hamburger menu fallback'i etkinlestirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla root item eklemek**
7'den fazla kok oge gorsel karisiklik yaratir. \`overflowBehavior="collapse-to-more"\` ile tasanlar yonetin.

**❌ Submenu icinde submenu (ic ice) kullanmak**
Cok katmanli menuler erisim ve kullanim zorluklari yaratir. Tek seviye submenu tercih edin.

**❌ \`currentPath\` olmadan navigasyon menusu olusturmak**
Aktif sayfa isaretlenmezse kullanici nerede oldugunu bilemez.

**❌ \`ariaLabel\` vermeden kullanmak**
Ekran okuyucular menubar'in amacini anlayamaz. Anlamli bir ARIA etiketi saglayin.

**❌ Link ve aksiyon karisimini kontrolsuz birakmak**
Navigasyon linkleri ile komut aksiyonlarini ayni seviyede grupsuz kullanmak kullaniciyi sasirtir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Kok eleman \`role="menubar"\` ile isaretlenir. \`ariaLabel\` ile menubar landmark'i tanimlanir.

**Klavye Navigasyonu:** Sol/Sag ok tuslari ile root item'lar arasinda roving focus. Asagi ok ile submenu acilir. Escape ile submenu kapanir.

**Submenu:** Popup menu \`role="menu"\` ile render edilir. Menu item'lari \`role="menuitem"\` tasir. Ok tuslari ile gezinilir, Enter/Space ile secilir.

**Aktif Root:** \`aria-current\` ile aktif root isaretlenir. \`currentPath\` degistiginde otomatik guncellenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Focus Yonetimi:** Submenu kapatildiginda focus root item'a doner. Overflow menusunden cikista focus korunur.`,
      },
    ],
    relatedComponents: ["ContextMenu", "NavigationMenu", "AppHeader", "DesktopMenubar"],
  },

  AppHeader: {
    componentName: "AppHeader",
    summary: "AppHeader, MenuBar primitive'i ustunde branding, utility cluster, responsive shell ve subdomain hissi veren ust uygulama header recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AppHeader, \`MenuBar\` primitive'ini kullanarak uygulama ust bari recipe'leri sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Brand-first shell** — Logo, uygulama adi ve marka alani ile baslayan header
- **Utility cluster** — Sag tarafta bildirim, hesap ve ayarlar gibi ek kontroller
- **Responsive fallback** — Dar gorunumde ikon-only veya hamburger menu modu
- **Subdomain ritmi** — Farkli alt uygulamalar icin tutarli header yuzey hissi

MenuBar'in tum ozelliklerini (submenu, overflow, search handoff, gruplar) miras alir ve uzerine header-spesifik recipe varyantlari ekler.

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  startSlot={<Logo />}
  items={[
    { value: "home", label: "Ana Sayfa", icon: <HomeIcon />, href: "/" },
    { value: "products", label: "Urunler", icon: <BoxIcon />,
      menuItems: [
        { key: "list", label: "Urun Listesi" },
        { key: "categories", label: "Kategoriler" },
      ]
    },
  ]}
  endSlot={<UserMenu />}
  currentPath="/"
  appearance="default"
  ariaLabel="Uygulama header"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamanin ana ust bari icin marka + navigasyon + utility bilesiminde
- SaaS uygulama shell'lerinde tutarli header deneyimi icin
- Subdomain veya modul bazli header varyantlari icin
- Utility cluster (bildirim, profil, ayarlar) iceren header icin

**Kullanmayin:**
- Yalnizca navigasyon listesi icin — bunun yerine \`NavigationMenu\` kullanin
- Sayfa ici toolbar icin — bunun yerine \`ActionHeader\` kullanin
- Mobil tab bar icin — bunun yerine \`BottomNavigation\` kullanin
- Basit breadcrumb header icin — bunun yerine \`PageHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Brand/Logo] │ [Nav Items...] │ [Utility Cluster] │
│  startSlot   │  MenuBar core  │  endSlot          │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Start Slot** — Logo, uygulama adi veya marka alani
2. **MenuBar Core** — Navigasyon item'lari, submenu'ler ve overflow
3. **End Slot** — Bildirim, profil, ayarlar gibi utility kontrolleri
4. **Responsive Layer** — Dar ekranlarda ikon-only veya menu fallback`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Marka alanini \`startSlot\` ile sabitleyin.** Logo ve uygulama adi her zaman gorunur olmalidir.

**Utility kontrolleri \`endSlot\` ile sag tarafa yerlestitin.** Bildirim, profil ve ayarlar sag tarafta beklenir.

**Responsive davranisi test edin.** \`mobileFallback="menu"\` veya \`labelVisibility="responsive"\` ile dar ekran davranisini planlayin.

**\`currentPath\` ile aktif navigasyonu isaretleyin.** Kullanici uygulamada nerede oldugunu her zaman bilmelidir.

**Subdomain varyantlari icin tutarli tasarim dili kullanin.** Farkli moduller icin ayni header yapis ve renk sistemi uzerinden calisin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla utility ogesi eklemek**
Sag tarafta 4-5'ten fazla ikon gorsel karisiklik yaratir. Daha az onemli aksiyonlari submenu'ye tasiyin.

**❌ Marka alanini responsive'de gizlemek**
Logo ve uygulama adi her zaman gorunur olmalidir; gizlemek kimlik kaybina neden olur.

**❌ Header icinde form veya detay icerigi yerlestirmek**
Header yalnizca navigasyon ve utility kontrolleri icindir. Icerik icin sayfa govdesini kullanin.

**❌ \`ariaLabel\` vermeden kullanmak**
Ekran okuyucular header'in amacini anlayamaz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile header landmark'i tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile navigasyon, Asagi ok ile submenu, Escape ile kapatma. Tab ile utility slot'a gecis.

**Responsive:** Dar gorunumde hamburger menu focus trap ile acilir ve Escape ile kapanir.

**Utility Cluster:** End slot icindeki butonlar Tab sirasi ile erisilebilir. Her biri kendi \`aria-label\` bilgisini tasir.

**Marka Alani:** Logo \`alt\` metni ile ekran okuyuculara uygulama adini bildirir.`,
      },
    ],
    relatedComponents: ["MenuBar", "NavigationMenu", "DesktopMenubar", "ActionHeader"],
  },

  NavigationMenu: {
    componentName: "NavigationMenu",
    summary: "NavigationMenu, MenuBar primitive'i ustunde buyuk bilgi mimarisi, overflow kontrolu ve top-level link akisi icin navigation menu recipe vitrini sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NavigationMenu, \`MenuBar\` primitive'ini kullanarak buyuk olcekli navigasyon mimarileri icin recipe varyantlari sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Information scent** — Ust-seviye route'lari acik etiketler ve ikonlarla sunma
- **Priority-managed overflow** — \`overflowPriority\` ile onemli ogeleri koruyarak tasan ogeleri More menusune tasima
- **Pinned destinations** — Favori veya kritik rotalari sabitleyerek overflow'dan koruma
- **Subdomain navigation** — Alt uygulama veya modul bazli navigasyon gruplamalari
- **Route-aware emphasis** — \`currentPath\` ile aktif root'u otomatik vurgulama

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "overview", label: "Genel Bakis", icon: <DashboardIcon />, href: "/overview", pinned: true },
    { value: "analytics", label: "Analitik", icon: <ChartIcon />, href: "/analytics" },
    { value: "reports", label: "Raporlar", icon: <FileIcon />,
      menuItems: [
        { key: "daily", label: "Gunluk Rapor" },
        { key: "weekly", label: "Haftalik Rapor" },
      ],
      overflowPriority: 2,
    },
    { value: "settings", label: "Ayarlar", icon: <GearIcon />, href: "/settings", group: "utility" },
  ]}
  currentPath="/overview"
  overflowBehavior="collapse-to-more"
  ariaLabel="Ana navigasyon menusu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Buyuk bilgi mimarisi olan uygulamalarda ana navigasyon icin
- Cok sayida ust-seviye route'un overflow ile yonetilmesi gereken sayfalarda
- Subdomain veya modul bazli navigasyon gruplamalari icin
- Pinned/favori destination destegi gerektiren senaryolarda
- Route-aware aktif sayfa vurgulama icin

**Kullanmayin:**
- Komut paleti veya aksiyon odakli toolbar icin — bunun yerine \`ActionHeader\` kullanin
- Desktop uygulamasi menubar ritmi icin — bunun yerine \`DesktopMenubar\` kullanin
- Marka + utility cluster iceren tam header icin — bunun yerine \`AppHeader\` kullanin
- Basit 3-4 linkli navigasyon icin — bunun yerine dogrudan \`LinkInline\` listesi kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [NavItem] [NavItem] [NavItem] ... [More ▾] │ [Utility] │
│  ↑ pinned  ↑ active                        │           │
│            ↓                               │           │
│  ┌──────────────┐                          │           │
│  │ [SubItem]    │                          │           │
│  │ [SubItem]    │                          │           │
│  └──────────────┘                          │           │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Navigation Bar** — \`role="menubar"\` ile yatay navigasyon cubugu
2. **Nav Items** — Route linkleri veya submenu tetikleyicileri
3. **Pinned Indicator** — Sabitlenmis ogelerde gorsel isaret
4. **Overflow Menu** — Tasan ogeleri toplayan More butonu
5. **Submenu** — Alt navigasyon ogeleri
6. **Utility Segment** — Sag tarafta yardimci ogeler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`overflowPriority\` ile onemli ogeleri koruyun.** Yuksek oncelikli ogeler overflow sirasinda gorunur kalir.

**\`pinned\` ile kritik destination'lari sabitleyin.** Kullanicinin her zaman erismesi gereken rotalari pinned yapin.

**Gruplari mantiksal olarak ayirin.** \`primary\`, \`secondary\`, \`utility\` gruplari ile navigasyonu segmentleyin.

**\`currentPath\` ile aktif route'u isaretleyin.** Kullanici her zaman nerede oldugunu bilmelidir.

**Overflow davranisini test edin.** Farkli ekran boyutlarinda \`collapse-to-more\` davranisini dogrulayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tum ogelere ayni \`overflowPriority\` vermek**
Oncelik farkliligi olmadan overflow mantiksiz calisir. Onemli ogelere yuksek, ikincil ogelere dusuk oncelik verin.

**❌ Cok fazla pinned oge kullanmak**
Her ogeyi sabitlemek overflow amacini ortadan kaldirir. Yalnizca gercekten kritik ogeleri sabitleyin.

**❌ Submenu'leri cok derin yapmak**
Tek seviye submenu yeterlidir. Derin hiyerarsi icin sayfa ici navigasyon kullanin.

**❌ Gruplar arasi dengesiz dagilim**
Primary grubunda 10 oge, utility'de 1 oge gibi dengesiz dagilim gorsel uyumsuzluk yaratir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ile navigasyon landmark'i olusturulur.

**Klavye:** Sol/Sag ok tuslari ile root item gezinme. Asagi ok ile submenu acma. Escape ile kapatma.

**Aktif Route:** \`currentPath\` ile \`aria-current\` otomatik atanir. Ekran okuyucular aktif sayfayi duyurur.

**Overflow:** More menusu klavye ile erisilebilir. Tasan ogeler menu icinde Tab/ok tuslari ile gezinilir.

**Pinned Items:** Sabitlenmis ogeler gorsel olarak isaretlenir ve overflow hesaplamasinda her zaman korunur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "DesktopMenubar", "ActionHeader"],
  },

  ActionHeader: {
    componentName: "ActionHeader",
    summary: "ActionHeader, MenuBar primitive'i ustunde selection-driven bulk actions, dense ops header ve governance akisini sunan aksiyon odakli header recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ActionHeader, \`MenuBar\` primitive'ini kullanarak aksiyon ve komut odakli header recipe'leri sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Selection-driven bulk actions** — Secili ogelere gore toplu aksiyon butonlari gosterme
- **Dense operations toolbar** — Yogun operasyonel panellerde kompakt aksiyon cubugu
- **Governance-safe readonly** — \`access="readonly"\` ile salt okunur mod
- **Task-oriented grouping** — Aksiyonlari gorev turune gore gruplama

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "delete", label: "Sil", icon: <TrashIcon />, emphasis: "promoted" },
    { value: "export", label: "Disa Aktar", icon: <DownloadIcon /> },
    { value: "archive", label: "Arsivle", icon: <ArchiveIcon /> },
  ]}
  size="sm"
  appearance="ghost"
  ariaLabel="Toplu islem aksiyonlari"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Secili ogelere toplu islem uygulamak icin (silme, disa aktarma, arsivleme)
- Operasyonel panellerde yogun aksiyon cubugu icin
- Governance ve yetki tabanli aksiyon kontrolu icin
- Tablo veya liste ustunde kontextuel aksiyon bari olarak

**Kullanmayin:**
- Ana uygulama navigasyonu icin — bunun yerine \`NavigationMenu\` veya \`AppHeader\` kullanin
- Sayfa basligi ve meta bilgisi icin — bunun yerine \`PageHeader\` kullanin
- Form submit aksiyonlari icin — bunun yerine form ici \`Button\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Selection Badge?] │ [Action] [Action] ... │ [Utility?] │
│   3 oge secildi     │  Sil  Disa Aktar      │            │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Action Bar** — \`role="menubar"\` ile yatay aksiyon cubugu
2. **Selection Badge** (opsiyonel) — Secili oge sayisini gosteren isaret
3. **Action Items** — Toplu islem butonlari (silme, disa aktarma, arsivleme vb.)
4. **Promoted Actions** — \`emphasis="promoted"\` ile vurgulanan kritik aksiyonlar
5. **Utility Slot** (opsiyonel) — Ek kontroller`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Yikici aksiyonlari vurgulayin.** \`emphasis="promoted"\` veya gorsel farklilik ile silme gibi kritik aksiyonlari one cikarin.

**Secim durumuna gore aksiyonlari gosterin.** Secili oge yokken aksiyon bari gizlenebilir veya disabled olabilir.

**\`size="sm"\` ile yogun panellerde kullanin.** Kompakt boyut operasyonel gorunumlerde yer tasarrufu saglar.

**\`access="readonly"\` ile governance kontrolu saglayin.** Yetkisiz kullanicilarin aksiyonlari gormesi ancak kullanamamasi gerektiginde readonly mod kullanin.

**Aksiyon gruplari olusturun.** Iliskili aksiyonlari yan yana, farkli kategorileri gruplar arasi bosluk ile ayirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Navigasyon linkleri ile karistirmak**
ActionHeader aksiyonlar icindir; navigasyon linkleri \`NavigationMenu\` ile yonetilmelidir.

**❌ Cok fazla aksiyon ogesi eklemek**
5-6'dan fazla aksiyon gorsel karisiklik yaratir. Daha az onemli aksiyonlari submenu'ye tasiyin.

**❌ Yikici aksiyonlari onaysiz calistirmak**
Silme gibi geri donulemez aksiyonlar onay dialog'u ile korunmalidir.

**❌ Secim olmadan aksiyon bari gostermek**
Hicbir oge secili degilken toplu aksiyon bari gosterilmemelidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile aksiyon bari tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile aksiyon butonlari arasinda gezinme. Enter/Space ile etkinlestirme.

**Selection Badge:** Secim degistiginde ekran okuyucu \`aria-live\` ile oge sayisini duyurur.

**Readonly:** \`access="readonly"\` durumunda butonlar gorsel olarak devre disi gorunur ve etkilesim engellenir.

**Yikici Aksiyonlar:** Silme gibi aksiyonlar gorsel olarak farklilasitirilir ve onay dialog'u ile ek katman eklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "NavigationMenu", "Button"],
  },

  ContextMenu: {
    componentName: "ContextMenu",
    summary: "ContextMenu, sag tik veya uzun basma ile etkinlesen, aksiyon ve komut listesi sunan overlay baglam menusu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ContextMenu, bir hedef elemanin uzerinde sag tiklama ile etkinlesen **overlay menu** bilesenidir. Menu ogeleri, ayiricilar ve etiket gruplari destekler.

Temel ozellikleri:
- **Right-click trigger** — Hedef elemanin uzerinde sag tik ile acilma
- **Keyboard navigation** — Ok tuslari, Enter/Space ve Escape destegi
- **Viewport clamping** — Menu konumunun ekran sinirlari icinde tutulmasi
- **Danger items** — Yikici aksiyonlar icin gorsel farklilik
- **Shortcuts** — Menu ogelerinde klavye kisayolu gosterimi

\`\`\`tsx
import { ContextMenu } from '@mfe/design-system';

<ContextMenu
  items={[
    { key: "edit", label: "Duzenle", icon: <EditIcon />, shortcut: "Ctrl+E", onClick: handleEdit },
    { type: "separator", key: "sep1" },
    { type: "label", key: "label1", label: "Tehlikeli Islemler" },
    { key: "delete", label: "Sil", icon: <TrashIcon />, danger: true, onClick: handleDelete },
  ]}
>
  <Card>Sag tiklayin</Card>
</ContextMenu>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo satirlari, kartlar veya liste ogeleri uzerinde hizli erisim menusu icin
- Sag tik ile kontextuel aksiyonlar sunmak icin
- Dosya yonetimi, metin editoru veya kanban tahtasi gibi zengin etkilesim alanlarinda
- Kisayol bilgisi ile desteklenmis aksiyon listeleri icin

**Kullanmayin:**
- Ana navigasyon icin — bunun yerine \`MenuBar\` veya \`NavigationMenu\` kullanin
- Dropdown secim listesi icin — bunun yerine \`Select\` veya \`Combobox\` kullanin
- Tooltip benzeri bilgi gosterimi icin — bunun yerine \`Tooltip\` kullanin
- Kalici aksiyon paneli icin — bunun yerine \`ActionHeader\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
[Trigger Element]  ← children prop
        ↓ right-click
┌────────────────────────┐
│ [Label Header]         │
│ ───────────────────    │
│ [Icon] [Label] [⌘+E]  │
│ [Icon] [Label] [⌘+D]  │
│ ───────────────────    │
│ [Icon] [Label] (danger)│
└────────────────────────┘
\`\`\`

1. **Trigger Wrapper** — \`children\` prop'u ile sarmalanan sag-tik alani
2. **Menu Surface** — \`role="menu"\` ile overlay menu paneli
3. **Menu Item** — \`role="menuitem"\` ile her bir aksiyon ogesi
4. **Separator** — \`role="separator"\` ile gorsel ayirici cizgi
5. **Label** — Grup basligi; tiklanabilir degildir
6. **Icon Slot** (opsiyonel) — Oge ikonlari
7. **Shortcut** (opsiyonel) — Klavye kisayolu metni`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Separator ile aksiyonlari gruplayin.** Iliskili aksiyonlari bir arada, tehlikeli aksiyonlari ayri bir grupta tutun.

**Danger ogelerini alt kisimda konumlandirin.** Yikici aksiyonlar menunun sonunda beklenilir.

**Klavye kisayollarini gosterin.** \`shortcut\` prop'u ile kullanicilara hizli erisim bilgisi verin.

**Disabled ogeleri aciklayin.** \`disabled\` ogelerde neden kullanilamadigini ipucu olarak gosterin.

**Menu uzunlugunu sinirli tutun.** 8-10 ogeden fazla menu karisiklik yaratir. Alt gruplama veya ayri arayuz dusunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla menu ogesi eklemek**
10'dan fazla oge tarama zorluklari yaratir. Iliskili aksiyonlari gruplayin veya farkli arayuzlere tasiyin.

**❌ Sag tik disinda baska tetikleyici olmadan birakmak**
Dokunmatik cihazlarda sag tik yoktur. Alternatif erisim yolu (buton, uzun basma) dusunun.

**❌ Tehlikeli aksiyonlari onaysiz calistirmak**
Silme gibi aksiyonlar dogrudan context menu'den calistirilmamali; onay dialog'u ekleyin.

**❌ Navigasyon linkleri icin kullanmak**
Context menu aksiyonlar icindir; sayfa navigasyonu icin \`LinkInline\` veya \`MenuBar\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Menu yuzeyinde \`role="menu"\` kullanilir. Her oge \`role="menuitem"\` tasir. Ayiricilar \`role="separator"\` ile isaretlenir.

**Klavye Navigasyonu:** Asagi/Yukari ok tuslari ile ogeler arasinda gezinme. Enter/Space ile oge etkinlestirme. Escape ile menu kapatma.

**Focus Yonetimi:** Menu acildiginda ilk ogeye focus atanir. Menu kapandiginda focus tetikleyici elemana doner.

**Dis Tiklama:** Menu disina tiklandiginda otomatik kapanir.

**Disabled Items:** \`disabled\` ogeler gorsel olarak devre disi gorunur (\`opacity-50\`) ve tiklanamaz.

**Danger Items:** Tehlikeli ogeler gorsel olarak farkli renk ile (kirmizi) vurgulanir.`,
      },
    ],
    relatedComponents: ["MenuBar", "DropdownMenu", "ActionHeader"],
  },

  DesktopMenubar: {
    componentName: "DesktopMenubar",
    summary: "DesktopMenubar, MenuBar primitive'i ustunde File/View/Tools odakli, hover trigger ve typed submenu ile masaustu menubar ritmine yakin bir ust menu deneyimi sunan recipe galerisidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DesktopMenubar, \`MenuBar\` primitive'ini kullanarak masaustu uygulama menubar'larini taklit eden **recipe galeri** bilesenidir. Temel odak alanlari:

- **File/View/Tools root modeli** — Klasik masaustu uygulama menu yapisi
- **Hover submenu trigger** — \`submenuTrigger="hover"\` ile fareyle uzerine gelince submenu acma
- **Typed submenu patterns** — Komut, secim ve ayar turlerinde alt menu icerikleri
- **Keyboard continuity** — Masaustu menubar klavye navigasyon ritmi

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "file", label: "Dosya",
      menuItems: [
        { key: "new", label: "Yeni", shortcut: "Ctrl+N" },
        { key: "open", label: "Ac", shortcut: "Ctrl+O" },
        { key: "sep1", type: "separator" },
        { key: "save", label: "Kaydet", shortcut: "Ctrl+S" },
        { key: "save-as", label: "Farkli Kaydet" },
      ]
    },
    { value: "edit", label: "Duzenle",
      menuItems: [
        { key: "undo", label: "Geri Al", shortcut: "Ctrl+Z" },
        { key: "redo", label: "Yinele", shortcut: "Ctrl+Y" },
      ]
    },
    { value: "view", label: "Gorunum",
      menuItems: [
        { key: "zoom-in", label: "Yakinlastir" },
        { key: "zoom-out", label: "Uzaklastir" },
      ]
    },
  ]}
  submenuTrigger="hover"
  size="sm"
  appearance="ghost"
  ariaLabel="Uygulama menusu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Masaustu uygulamasi hissi veren web uygulamalarinda
- File/Edit/View/Tools gibi klasik menu yapisi gerektiren editoer ve araclarada
- IDE benzeri arayuzlerde komut menusu icin
- Hover ile submenu acma beklenen deneyimli kullanici arayuzlerinde

**Kullanmayin:**
- Mobil oncelikli uygulamalarda — hover destegi sinirlidir
- Ana site navigasyonu icin — bunun yerine \`NavigationMenu\` kullanin
- Uygulama header'i icin — bunun yerine \`AppHeader\` kullanin
- Kontextuel aksiyonlar icin — bunun yerine \`ContextMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│ [Dosya ▾] [Duzenle ▾] [Gorunum ▾] [Araclar ▾]   │
│     ↓ hover                                      │
│ ┌──────────────────┐                             │
│ │ Yeni       Ctrl+N│                             │
│ │ Ac         Ctrl+O│                             │
│ │ ────────────────  │                             │
│ │ Kaydet     Ctrl+S│                             │
│ │ Farkli Kaydet     │                             │
│ └──────────────────┘                             │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Menubar** — \`role="menubar"\` ile yatay menu cubugu
2. **Root Triggers** — Her biri submenu tetikleyicisi olan ust-seviye etiketler
3. **Submenu Panel** — Hover veya tikla ile acilan popup menu
4. **Menu Items** — Komut aksiyonlari; isteğe bagli ikon ve kisayol
5. **Separators** — Aksiyon gruplarini ayiran cizgiler`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Klasik menu yapisi izleyin.** File/Edit/View/Tools siralamasini kullanicilar taniyor; bu ritmi koruyun.

**\`submenuTrigger="hover"\` ile masaustu hissi verin.** Hover trigger deneyimli kullanicilar icin hiz saglar.

**Kisayollari gosterin.** \`shortcut\` ile Ctrl+S, Ctrl+Z gibi kisayol bilgisini menu icinde sunun.

**\`size="sm"\` ve \`appearance="ghost"\` tercih edin.** Masaustu menubar kompakt ve minimal olmalidir.

**Separator ile mantiksal gruplama yapin.** Iliskili komutlari bir arada, farkli kategorileri ayiricilarla bolumlendirin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Mobil arayuzlerde hover trigger kullanmak**
Dokunmatik cihazlarda hover yoktur. Mobil icin \`submenuTrigger="click"\` tercih edin.

**❌ Cok derin submenu hiyerarsileri**
Ic ice iki seviye submenu bile kullaniciyi zorlayabilir. Tek seviye submenu yeterlidir.

**❌ Navigasyon linkleri ile karistirmak**
DesktopMenubar komut ve aksiyonlar icindir; sayfa navigasyonu icin \`NavigationMenu\` kullanin.

**❌ Buyuk boyut ve goze batan gorunum kullanmak**
Masaustu menubar kompakt olmalidir. \`size="md"\` ve \`appearance="default"\` gereksiz alan harcar.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ile menu landmark'i olusturulur.

**Klavye Navigasyonu:** Sol/Sag ok tuslari ile root menuler arasi gecis. Asagi ok ile submenu acma. Escape ile kapatma. Home/End ile ilk/son root'a atlama.

**Hover ve Klavye Paritesi:** Hover ile acilan menuler ayni zamanda klavye ile de erisilebilir olmalidir. \`submenuTrigger="hover"\` kullanildiginda klavye destegi korunur.

**Submenu Gecisleri:** Bir root'tan digerine geciste onceki submenu otomatik kapanir ve yeni submenu acilir. Focus hicbir zaman kaybolmaz.

**Kisayol Gosterimi:** Kisayol bilgileri \`<span>\` ile render edilir ve ekran okuyuculara duyurulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "AppHeader", "NavigationMenu", "ContextMenu"],
  },

  NotificationDrawer: {
    componentName: "NotificationDrawer",
    summary: "NotificationDrawer, bildirim merkezini sag taraftan kayan bir overlay panel olarak sunar. OverlaySurface uzerinde NotificationPanel'i sarar ve acma/kapama, portal ve erisim kontrolu saglar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationDrawer, \`OverlaySurface\` ile \`NotificationPanel\` bilesenlerini birlestirerek bildirim merkezini sag taraftan kayan bir cekmece (drawer) olarak sunar. Overlay tiklamasi, Escape tusu ve portal destegi ile tam kontrol saglar.

\`\`\`tsx
import { NotificationDrawer } from '@mfe/design-system';

<NotificationDrawer
  open={drawerOpen}
  onClose={(reason) => setDrawerOpen(false)}
  items={notifications}
  onMarkAllRead={handleMarkAllRead}
  onRemoveItem={handleRemove}
  showFilters
  grouping="priority"
  dialogLabel="Bildirim merkezi"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulamanin herhangi bir sayfasindan bildirim merkezine erismek istediginde
- Kullaniciya bildirimlerini goruntuleyip yonetebilecegi bir yan panel sunmak istediginde
- Overlay ile mevcut sayfa iceriginin ustunde bildirim listesi gostermek istediginde

**Kullanmayin:**
- Bildirim listesini sayfa icine gomulu gostermek istiyorsaniz — \`NotificationPanel\` kullanin
- Tek bir bildirim toast'u gostermek icin — \`ToastProvider\` kullanin
- Bildirim icerigi kucuk ve basitse — \`NotificationItemCard\` tek basina yeterli olabilir`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌─────────────────────────────────────┐
│  [Overlay Backdrop]                 │
│                    ┌───────────────┐│
│                    │ × Kapat       ││
│                    │ ─────────────  ││
│                    │ Bildirimler   ││
│                    │ [Filtreler]   ││
│                    │ [Kart 1]      ││
│                    │ [Kart 2]      ││
│                    │ [Kart 3]      ││
│                    └───────────────┘│
└─────────────────────────────────────┘
\`\`\`

1. **OverlaySurface** — Sag taraftan kayan overlay konteyner; backdrop, ESC ve dis tiklama destegi
2. **Kapat Butonu** — \`×\` ikonu ile drawer'i kapatir
3. **NotificationPanel** — Tum bildirim listesi, filtreler ve aksiyonlar
4. **Portal** — \`portalTarget\` ile DOM agacinda baska yere render edilebilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`closeOnOverlayClick\` ve \`closeOnEscape\` acik birakin.** Varsayilan degerler \`true\`; kullanicinin hizlica kapatabilmesi icin bu davranisi koruyun.

**\`destroyOnHidden\` ile bellek tasarruf edin.** Varsayilan \`true\`; kapali drawer DOM'dan kaldirilir. Animasyon korumak istiyorsaniz \`keepMounted\` kullanin.

**\`widthClassName\` ile genislik kontrol edin.** Varsayilan \`max-w-md\`; buyuk bildirim listeleri icin \`max-w-lg\` tercih edebilirsiniz.

**\`dialogLabel\` ile erisilebilir etiket verin.** Ekran okuyuculari icin anlamli bir baslik belirleyin.

**Portal kullanimini degerlendirin.** Karmasik z-index yapilari icin \`portalTarget\` veya \`disablePortal\` tercihini bilineli yapin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Drawer'i surekli acik birakmak**
Drawer overlay tabanli bir bilesen; surekli gorunur panel icin \`NotificationPanel\` kullanin.

**❌ \`closeOnEscape={false}\` ile Escape desteigini kapatmak**
Klavye kullanicilari icin temel erisim yontemidir, kaldirmayin.

**❌ \`keepMounted\` ve \`destroyOnHidden={false}\` birlikte kullanmak**
Gereksiz DOM birikimi olusturur. Birini secin.

**❌ Drawer icine karmasik formlar yerlestirmek**
Drawer bildirim goruntulemesi icindir; veri girisi icin \`Dialog\` veya ayri sayfa kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Semantigi:** OverlaySurface \`role="dialog"\` ve \`aria-label\` ile isaretlenir. \`dialogLabel\` prop'u ile erisim etiketi belirlenir.

**Klavye Destegi:** Escape tusu ile drawer kapatilir. Focus drawer acildiginda iceriye, kapandiginda tetikleyici elemana doner.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Readonly ve disabled durumlarda kapat butonu ile aksiyonlar engellenir.

**Overlay Tiklamasi:** \`closeOnOverlayClick\` ile dis alana tiklayarak kapatma. Fare kullanicilari icin beklenen davranis.`,
      },
    ],
    relatedComponents: ["NotificationPanel", "NotificationItemCard", "ToastProvider"],
  },

  NotificationPanel: {
    componentName: "NotificationPanel",
    summary: "NotificationPanel, bildirim ogelerini filtreleme, gruplama, secim ve toplu aksiyonlarla listeleyen premium yuzeydir. Drawer icinde veya sayfa icine gomulu kullanilabilir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationPanel, \`NotificationItemCard\` ogelerini filtreleme (\`all\`, \`unread\`, \`high-priority\`, \`pinned\`), gruplama (\`priority\`, \`relative-day\`) ve toplu aksiyonlarla (tumunu okundu say, temizle, secimi yonet) sunan tam donanimli bildirim listesi bilesenidir.

\`\`\`tsx
import { NotificationPanel } from '@mfe/design-system';

<NotificationPanel
  items={notifications}
  showFilters
  activeFilter="unread"
  onFilterChange={setFilter}
  grouping="priority"
  dateGrouping="relative-day"
  onMarkAllRead={handleMarkAllRead}
  onRemoveItem={handleRemove}
  selectable
  onMarkSelectedRead={handleMarkSelectedRead}
  onRemoveSelected={handleRemoveSelected}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Bildirim listesini sayfa icine gomulu gostermek istediginde
- Filtreleme, gruplama ve toplu aksiyonlar gerektiren bildirim merkezlerinde
- \`NotificationDrawer\` icinde icerik olarak
- Dashboard'larda bildirim bolumleri olusturmak icin

**Kullanmayin:**
- Tek bir bildirim gostermek icin — \`NotificationItemCard\` yeterlidir
- Anlik bildirimler icin — \`ToastProvider\` kullanin
- Overlay panel olarak gostermek icin — \`NotificationDrawer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────┐
│ Bildirimler    [Okundu Say] [Temizle] │
│ 3 okunmamis, toplam 12 olay          │
├───────────────────────────────────────┤
│ [Tumu(12)] [Okunmamis(3)] [Oncelikli]│
├───────────────────────────────────────┤
│ ▸ Pinlenmis                           │
│   [Kart 1]                            │
│ ▸ Yuksek oncelik                      │
│   [Kart 2]                            │
│ ▸ Diger bildirimler                   │
│   [Kart 3]                            │
│   [Kart 4]                            │
└───────────────────────────────────────┘
\`\`\`

1. **Header** — Baslik, ozet bilgisi ve toplu aksiyon butonlari
2. **Filtre Cubugu** — all/unread/high-priority/pinned filtre butonlari
3. **Bolum Etiketleri** — Gruplama aktifse bolum basliklarini gosterir
4. **Bildirim Kartlari** — \`NotificationItemCard\` ogeleri
5. **Bos Durum** — Bildirim yokken veya filtre bossa gosterilen mesaj
6. **Secim Araclari** — Selectable modda checkbox ve toplu secim butonlari`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`showFilters\` ile filtreleme sunun.** Cok sayida bildirim oldugunda kullanicilar okunmamis veya oncelikli olanlara hizlica erismek ister.

**\`grouping="priority"\` ile gorsel hiyerarsi olusturun.** Pinlenmis ve yuksek oncelikli bildirimlerin ayri bolumde gorunmesi onem sirasini netlestirir.

**\`dateGrouping="relative-day"\` ile zaman bağlami ekleyin.** Bugun/Dun/Daha eski gruplamasi ile bildirimlerin zamansal baglamini gosterin.

**Toplu aksiyonlari sunun.** \`onMarkAllRead\` ve \`onClear\` ile bildirim yonetimini hizlandirin.

**\`selectable\` modunu dikkatli kullanin.** Cok sayida bildirim uzerinde toplu islem gerektiginde aktif edin; aksi halde arayuzu gereksiz karistirmayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Filtreleme olmadan yuzlerce bildirim listelemek**
Uzun listeler performansi dusurur ve kullaniciyi bunaltir. \`showFilters\` aktif edin.

**❌ Kontrolllu ve kontrolsuz filtre state'ini karistirmak**
\`activeFilter\` verdiyseniz \`onFilterChange\` ile guncellemeyi de yonetin; ikisini karistirmayin.

**❌ Bos durum mesajlarini ozellestirmemek**
Varsayilan mesajlar yeterli olsa da uygulamaya ozel mesajlar kullanici deneyimini iyilestirir.

**❌ \`grouping\` ve \`dateGrouping\` ikisini birden agresif kullanmak**
Ic ice gruplama gorsel karmasikliga yol acar. Genellikle birini secmek yeterlidir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile bildirim paneli isaretlenir. \`data-component="notification-panel"\` ile tanımlanir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Readonly/disabled durumda butonlar ve aksiyonlar engellenir.

**Filtre Butonlari:** Her filtre butonu aktif durumu gorsel olarak belirtir (\`variant="primary"\`). Disabled state korunur.

**Secim Modu:** Checkbox'lar \`aria-label\` ile isaretlenir. Secim ozeti ekran okuyuculara duyurulur.

**Bos Durum:** Bildirim yokken veya filtre bossa aciklayici mesaj goruntulenir.`,
      },
    ],
    relatedComponents: ["NotificationDrawer", "NotificationItemCard", "ToastProvider"],
  },

  NotificationItemCard: {
    componentName: "NotificationItemCard",
    summary: "NotificationItemCard, tek bir bildirimi tip, oncelik, pin durumu ve aksiyonlarla goruntuleyen premium kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `NotificationItemCard, bir \`NotificationSurfaceItem\` verisini tip badge'i (success/info/warning/error/loading), oncelik ve pin gostergeleri, zaman damgasi, birincil aksiyon butonu ve kaldirma butonu ile goruntuleyen kart bilesenidir.

\`\`\`tsx
import { NotificationItemCard } from '@mfe/design-system';

<NotificationItemCard
  item={{
    id: "n1",
    message: "Deploy basarili",
    description: "v2.4.1 production ortamina yuklendi",
    type: "success",
    priority: "high",
    pinned: false,
    read: false,
    createdAt: Date.now(),
  }}
  getPrimaryActionLabel={(item) => "Detay"}
  onPrimaryAction={(item) => navigateTo(item.id)}
  onRemove={(id) => removeNotification(id)}
  formatTimestamp={(ts) => new Date(ts!).toLocaleString("tr-TR")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- \`NotificationPanel\` icinde bildirim ogeleri olarak
- Tekil bildirim kartlari gostermek icin
- Ozel bildirim listeleri olustururken yapi tasi olarak

**Kullanmayin:**
- Anlik gecici bildirim gostermek icin — \`ToastProvider\` kullanin
- Liste ve filtreleme gerekiyorsa — \`NotificationPanel\` kullanin
- Genel amacli kart icin — \`Card\` bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────┐
│ [☐?] [SUCCESS] [ONCELIKLI?] [PIN?]  │
│      Baslik mesaji                   │
│      Aciklama metni                  │
│      12.03.2025 14:30       [Detay]  │
│                               [×]   │
└──────────────────────────────────────┘
\`\`\`

1. **Secim Checkbox'i** (opsiyonel) — \`selectable\` aktifse goruntulenir
2. **Tip Badge'i** — success/info/warning/error/loading durumunu gosterir
3. **Oncelik Badge'i** (opsiyonel) — Yuksek oncelikli bildirimlerde ONCELIKLI etiketi
4. **Pin Badge'i** (opsiyonel) — Pinlenmis bildirimlerde PINLENMIS etiketi
5. **Mesaj** — Ana bildirim metni; okunmamis ise kalin, okunmus ise normal
6. **Aciklama** (opsiyonel) — Detay bilgisi
7. **Zaman Damgasi** — \`formatTimestamp\` ile ozellestirilebilir
8. **Birincil Aksiyon** (opsiyonel) — \`getPrimaryActionLabel\` ile dinamik etiketli buton
9. **Kaldirma Butonu** — \`onRemove\` ile bildirimi kapatir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`formatTimestamp\` ile yerel tarih formati kullanin.** Varsayilan \`toLocaleString()\` yeterli olsa da \`tr-TR\` locale'i ile tutarli gorunum saglayin.

**\`getPrimaryActionLabel\` ile baglamsal aksiyon etiketleri verin.** Farkli bildirim turlerine gore "Detay", "Incele", "Onayla" gibi etiketler kullanin.

**Okunmus/okunmamis farki gorsel olarak belirgindir.** Okunmamis kartlar kalin yazi, okunmuslar \`opacity-80\` ile farklilasir.

**\`type\` prop'unu dogru kullanin.** success/info/warning/error/loading turleri renk ve badge ile gorsel anlam tasir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tip bilgisi olmadan kart kullanmak**
Varsayilan \`info\` atanir ama bildirim turunu dogru belirlemek gorsel netlik saglar.

**❌ Cok uzun mesaj ve aciklama metinleri**
Kart kompakt olmali; uzun icerikler icin detay sayfasina yonlendirin.

**❌ \`onRemove\` olmadan kart gostermek**
Kullanici bildirimi kapatamaz hale gelir. Temizleme mekanizmasi sunun.

**❌ \`selectable\` modda \`onSelectedChange\` sagamamak**
Secim checkbox'i calisir ama ust bilesene bilgi iletilmez.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elementi ile her bildirim karti isaretlenir. \`data-type\`, \`data-priority\`, \`data-read\` nitelikleri eklenir.

**Kaldirma Butonu:** \`aria-label\` ile "Bildirimi kapat" etiketi tasinir.

**Secim Checkbox'i:** \`aria-label\` ile bildirim mesajini iceren etiket otomatik olusturulur.

**Erisim Kontrolu:** \`access\` prop'u ile butonlar ve checkbox disabled edilebilir. \`accessReason\` ile \`title\` niteligi uzerinden neden bilgisi sunulur.

**Renk Kontrastı:** Tip badge'leri WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["NotificationPanel", "NotificationDrawer", "ToastProvider"],
  },

  ToastProvider: {
    componentName: "ToastProvider",
    summary: "ToastProvider, uygulama genelinde gecici bildirim (toast) gosterimi icin Context tabanli provider ve useToast hook'u sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ToastProvider, React Context API uzerinde calisan bir toast bildirim sistemidir. Uygulamayi \`<ToastProvider>\` ile sararsiniz, ardindan herhangi bir bilesenede \`useToast()\` hook'u ile \`info\`, \`success\`, \`warning\`, \`error\` toast'lari tetiklersiniz.

\`\`\`tsx
import { ToastProvider, useToast } from '@mfe/design-system';

// Uygulamanin kok seviyesinde
<ToastProvider position="top-right" duration={4000} maxVisible={5}>
  <App />
</ToastProvider>

// Herhangi bir bilesenede
function SaveButton() {
  const toast = useToast();
  return (
    <button onClick={() => toast.success("Kaydedildi!", { title: "Basarili" })}>
      Kaydet
    </button>
  );
}
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Kullaniciya anlik geri bildirim vermek istediginde (kaydetme, silme, hata)
- Gecici ve otomatik kaybolan bildirimler icin
- Form gonderimi, API cagrilari veya islem sonuclari icin

**Kullanmayin:**
- Kalici bildirim listesi icin — \`NotificationPanel\` kullanin
- Kullanicinin aksiyon almasi gereken durumlar icin — \`Dialog\` veya \`Alert\` kullanin
- Uzun icerikli bildirimler icin — \`NotificationDrawer\` kullanin
- Sayfa ici uyari mesajlari icin — \`Banner\` veya \`Callout\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
                        ┌──────────────────────┐
                        │ ● Baslik (opsiyonel)  │
                        │   Mesaj metni     [×] │
                        ├──────────────────────┤
                        │ ● Basarili!           │
                        │   Kayit olusturuldu[×]│
                        └──────────────────────┘
\`\`\`

1. **ToastProvider** — Context saglayici; position, duration, maxVisible yapilandirir
2. **Toast Container** — Fixed pozisyonlu, z-[1700] katmaninda toast yigini
3. **ToastItem** — Tek bir toast karti; variant renk gostergesi, baslik, mesaj ve kapat butonu
4. **Renk Gostergesi** — Kucuk yuvarlak nokta ile variant turunu (info/success/warning/error) belirtir
5. **Kapat Butonu** — Kullanici toastu manuel kapatabilir
6. **Auto-dismiss Timer** — \`duration\` ms sonra otomatik kaybolur`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`ToastProvider\`'i kok seviyede sarin.** Tum bilesenler \`useToast()\` erisebilsin.

**\`duration\` suresini isleme gore ayarlayin.** Basarili islemler icin 3-4 saniye, hata mesajlari icin daha uzun sureler (6-8 saniye) kullanin.

**\`title\` ile baglamsal baslik ekleyin.** Sadece mesaj degil, baslik ile toast'un onemini belirtin.

**\`maxVisible\` ile yigin sinirlayin.** Varsayilan 5; cok fazla toast ekranda gorsel kirliligi olusturur.

**\`position\` ile uygun konum secin.** Sag ust (\`top-right\`) en yaygin kaliptir; form alanlarinin uzerini kapatmamaya dikkat edin.

**Dogru variant kullanin.** \`success\` basarili islemler, \`error\` hatalar, \`warning\` uyarilar, \`info\` genel bilgilendirme icin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`ToastProvider\` olmadan \`useToast()\` cagirmak**
Context bulunmazsa hata firlatilir. Provider'i kok seviyede tanimlayın.

**❌ Kritik hatalari sadece toast ile gostermek**
Toast gecici ve kaybolur; kritik hatalar icin kalici UI ogeleri (Alert, Banner) kullanin.

**❌ Cok kisa duration ile onemli mesajlar gostermek**
Kullanici mesaji okuyamadan kaybolur. En az 3 saniye verin.

**❌ Her API cagrisindan sonra toast gostermek**
Toast spam'i kullaniciyi bunaltir. Sadece anlamli sonuclari bildirin.

**❌ Uzun metin icerikli toast kullanmak**
Toast kompakt olmalidir; detayli bilgi icin baska bilesen tercih edin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Canli Bolge:** Toast konteyneri \`aria-live="polite"\` ile isaretlenir. Yeni toast'lar ekran okuyuculara otomatik duyurulur.

**Role:** Her toast \`role="alert"\` tasir ve acil bildirim olarak islenir.

**Kapat Butonu:** \`aria-label="Dismiss"\` ile erisilebilir sekilde isaretlenir.

**Animasyon:** \`slide-in-from-right-full\` ve \`fade-in\` animasyonlari ile gorsel geris.

**Z-index:** \`z-[1700]\` ile diger UI ogelerinin ustunde kalir; modal ve drawer catismalarini onler.`,
      },
    ],
    relatedComponents: ["NotificationDrawer", "NotificationPanel", "NotificationItemCard"],
  },

  TourCoachmarks: {
    componentName: "TourCoachmarks",
    summary: "TourCoachmarks, adim adim rehberlik turu sunan onboarding bilesenidir. Kontrolllu/kontrolsuz adim yonetimi, ilerleme gostergesi ve guided/readonly modlari destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TourCoachmarks, kullaniciyi adim adim yonlendiren bir tur/onboarding bilesenidir. Her adim baslik, aciklama ve opsiyonel meta bilgisi icerr. Ileri/geri navigasyon, atlama, ilerleme gostergesi ve klavye destegi saglar.

\`\`\`tsx
import { TourCoachmarks } from '@mfe/design-system';

<TourCoachmarks
  steps={[
    { id: "welcome", title: "Hosgeldiniz", description: "Bu tur size uygulamayi tanitacak." },
    { id: "dashboard", title: "Dashboard", description: "Ana metrikleri buradan takip edin.", tone: "info" },
    { id: "settings", title: "Ayarlar", description: "Tercihlerinizi buradan yapilandirin.", meta: "Son adim", tone: "success" },
  ]}
  open={tourOpen}
  onClose={() => setTourOpen(false)}
  onFinish={handleTourComplete}
  showProgress
  allowSkip
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yeni kullanici onboarding akislari icin
- Karmasik ozellik tanitimlarinda adim adim rehberlik vermek icin
- Urun ici egitim turlari olusturmak icin
- Ozellik guncellemelerini kullaniciya tanitmak icin

**Kullanmayin:**
- Tooltip veya popover ile kucuk ipucu gostermek icin — \`Tooltip\` kullanin
- Uzun form sihirbazlari icin — \`Stepper\` veya \`Wizard\` kullanin
- Kalici yardim icerigi icin — dokumantasyon sayfasi olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────┐
│ ▔▔▔▔▔▔▔▔▔▔ (gradient bar)            │
│ GUIDED TOUR              2 / 3       │
│ Dashboard                             │
│                                       │
│ Ana metrikleri buradan takip edin.    │
│ [info badge]                          │
│                                       │
│ [1. welcome] [2. dashboard] [3. ayar] │
│                                       │
│ [Atla] [Geri]          [Sonraki Adim] │
└───────────────────────────────────────┘
\`\`\`

1. **Gradient Bar** — Ust kenarda renkli cizgi ile gorsel vurgu
2. **Tur Basligi** — Genel tur adi (ozellestirilebilir)
3. **Adim Basligi** — Aktif adimin basligi
4. **Aciklama** — Adim detay metni
5. **Meta Badge** (opsiyonel) — Adim hakkinda ek bilgi; \`tone\` ile renk degisir
6. **Adim Navigasyonu** — Tum adimlari gosteren tiklanabilir grid
7. **Ilerleme Gostergesi** — "2 / 3" formatinda suanki adim
8. **Aksiyon Butonlari** — Atla, Geri, Sonraki Adim, Bitir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`allowSkip={true}\` ile atlama izni verin.** Kullanicilar turu zorunlu hissetmemeli; istedikleri zaman cikaabilsinler.

**\`showProgress\` ile ilerlemeyi gosterin.** Kullanicilar kac adim kaldigini bilmek ister.

**Adim sayisini sinirli tutun.** 3-7 adim idealdir; cok uzun turlar terk edilir.

**\`onFinish\` ile turu tamamlanmis olarak isaretleyin.** Kullaniciya tekrar gosterilmemesi icin tamamlanma durumunu kaydedin.

**\`tone\` ile gorsel ipucu verin.** Onemli adimlarda \`warning\`, basarili sonuclarda \`success\` kullanin.

**\`mode="readonly"\` ile sadece goruntuleme sunun.** Turun tekrar incelenmesi icin readonly mod kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Turu atlanamaz yapmak**
\`allowSkip={false}\` ile kullaniciyi zorlamak kotu deneyim yaratir.

**❌ 10+ adimlik turlar olusturmak**
Uzun turlar kullaniciyi bunaltir ve terk oranini arttirir. Bolumleyin.

**❌ Kontrolllu \`currentStep\` ile \`onStepChange\` sagamamak**
Adim degisiklikleri calismaz; her ikisini birlikte kullanin.

**❌ Turu her sayfa yuklenisinde tekrar gostermek**
Tamamlanma durumunu persist edin; kullaniciyi tekrar zorlamamayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Dialog Semantigi:** Tur paneli \`role="dialog"\` ve \`aria-labelledby\` / \`aria-describedby\` ile isaretlenir.

**Klavye Destegi:** Escape tusu ile tur kapatilir. Butonlar Tab ile erisilebilinir. Enter/Space ile etkinlestirilir.

**Adim Navigasyonu:** Her adim butonu \`aria-current="step"\` ile aktif durumu belirtir.

**Erisim Kontrolu:** \`access\` prop'u ile tum etkisimler kontrol edilir. Readonly modda adim butonlari tiklanamaz olur.

**Focus Yonetimi:** Tur acildiginda panel icine focus atanir.`,
      },
    ],
    relatedComponents: ["Button", "Tooltip"],
  },

  JsonViewer: {
    componentName: "JsonViewer",
    summary: "JsonViewer, JSON verisini tip badge'leri ve genisletilebilir agac yapisiyla interaktif olarak goruntuleyen premium bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `JsonViewer, herhangi bir JSON degerini hiyerarsik agac yapisiyla goruntuleyen interaktif bilesendir. Her dugum tip badge'i (null, array, object, boolean, number, string) tasir, genisletilebilir/daraltilabilir ve varsayilan derinlik kontrol edilebilir.

\`\`\`tsx
import { JsonViewer } from '@mfe/design-system';

<JsonViewer
  value={{
    kullanici: { ad: "Ahmet", yas: 28, aktif: true },
    roller: ["admin", "editor"],
    metadata: null,
  }}
  title="API Yaniti"
  description="Son istek sonucu"
  rootLabel="response"
  defaultExpandedDepth={2}
  showTypes
  maxHeight={500}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- API yanitlarini veya JSON payload'larini goruntulelemek icin
- Debug araclari ve gelistirici panellerinde veri inceleme icin
- Yapilandirma dosyalarini veya meta verileri gostermek icin
- Karmasik nesne yapilarini kullaniciya sunmak icin

**Kullanmayin:**
- JSON duzenleme/editleme icin — JSON editor bileseni kullanin
- Tablolar halinde gosterilecek duz listeler icin — \`DataTable\` kullanin
- Log kayitlari icin — terminal veya log bileseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  API Yaniti
  Son istek sonucu

┌──────────────────────────────────────┐
│ ▾ response              [object]     │
│   {3 key}                            │
│   ┌─────────────────────────────┐    │
│   │ ▾ kullanici       [object]  │    │
│   │   ┌──────────────────────┐  │    │
│   │   │ ad           [string]│  │    │
│   │   │ "Ahmet"              │  │    │
│   │   └──────────────────────┘  │    │
│   │ ▸ roller          [array]   │    │
│   │ metadata           [null]   │    │
│   └─────────────────────────────┘    │
└──────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** (opsiyonel) — Ustunde goruntulenen baslik ve aciklama metni
2. **Konteyner** — Premium yuzey ile sarili scrollable alan; \`maxHeight\` ile sinirlanir
3. **Genisletilebilir Dugum** — Object/array icin ▸/▾ ile acilip kapanir
4. **Tip Badge'i** — \`Badge\` bileseni ile null/array/object/boolean/number turunu gosterir
5. **Ozet Bilgisi** — Object icin \`{N key}\`, array icin \`[N item]\` gosterir
6. **Primitive Deger** — String, number, boolean, null icin renk kodlu code blogu
7. **Bos Durum** — \`undefined\` deger icin Empty bileseni gosterilir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedDepth\` ile varsayilan aciklik seviyesini ayarlayin.** Buyuk JSON'lar icin \`1\`, kucuk yapilar icin \`2-3\` uygun.

**\`maxHeight\` ile yuksekligi sinirlayin.** Cok buyuk JSON'lar sayfayi kaplamasin; scroll ile erisilebilir olsun.

**\`showTypes={true}\` ile tip bilgisini gosterin.** Gelistiriciler icin deger turlerinin gorulmesi onemlidir.

**\`rootLabel\` ile anlamli kok etiketi verin.** "payload", "response", "config" gibi kok adi baglamsal anlam katar.

**\`localeText\` ile yerellestirilmis etiketler saglayin.** Turkce arayuzde \`arraySummary\`, \`objectSummary\` gibi etiketleri cevirip tutarlilik olusturun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok buyuk JSON'lari tamamen acik gostermek**
\`defaultExpandedDepth\` yuksek deger ile binlerce satir render edilir ve performansi dusurur.

**❌ \`maxHeight\` belirlemeden kullanmak**
Buyuk veri setleri sayfayi tamamen kaplar. Her zaman yukseklik siniri koyun.

**❌ Hassas verileri filtrelemeden gostermek**
API anahtarlari, sifreler gibi hassas alanlar JsonViewer ile goruntulenmemeli.

**❌ Duzenleme beklentisi olusturmak**
JsonViewer salt-okunur bir goruntuleme bilasenidir; duzenleme islevselliği yoktur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile sarili; \`data-component="json-viewer"\` niteligi tasinir.

**Genisletme/Daraltma:** Her agac dugumu \`<button>\` olarak tiklanabilir; klavye ile Enter/Space destegi vardir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Renk Kodlamasi:** String (mavi), number (yesil), boolean (sari), null (gri) ile tip farklilastirmasi gorsel olarak saglanir.

**Overflow:** \`overflow-auto\` ile buyuk veri setleri icin kaydirma destegi.`,
      },
    ],
    relatedComponents: ["Badge", "Empty", "Text"],
  },

  AnchorToc: {
    componentName: "AnchorToc",
    summary: "AnchorToc, sayfa ici basliklarla senkronize calisan, hash destekli icerik tablosu (table of contents) navigasyon bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AnchorToc, sayfa icindeki bolumlere hizli navigasyon sunan bir icerik tablosu bilesenidir. URL hash'i ile senkronize calisir, 3 seviye girintileme destekler ve sticky konumlandirma ile sayfada sabit kalabilir.

\`\`\`tsx
import { AnchorToc } from '@mfe/design-system';

<AnchorToc
  items={[
    { id: "giris", label: "Giris", level: 1 },
    { id: "kurulum", label: "Kurulum", level: 1 },
    { id: "npm", label: "npm ile", level: 2 },
    { id: "yarn", label: "yarn ile", level: 2 },
    { id: "yapilandirma", label: "Yapilandirma", level: 1, meta: "Yeni" },
    { id: "api", label: "API Referansi", level: 1 },
  ]}
  title="Bu sayfada"
  density="comfortable"
  sticky
  syncWithHash
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uzun dokumantasyon veya icerik sayfalarinda bolumler arasi navigasyon icin
- Yan panel olarak sayfa ici icerik tablosu gostermek icin
- Hash tabanli bolum navigasyonu gerektiren sayfalarda
- Admin paneli ayar sayfalari gibi uzun form bolumlerinde

**Kullanmayin:**
- Sayfa arasi navigasyon icin — \`NavigationMenu\` veya \`Sidebar\` kullanin
- Sekme tabanli icerik icin — \`Tabs\` kullanin
- Dikey adim sihirbazi icin — \`Stepper\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│ BU SAYFADA                [6]│
│                              │
│ ● Giris                      │
│ ● Kurulum                    │
│     ● npm ile                │
│     ● yarn ile               │
│ ● Yapilandirma         Yeni  │
│ ● API Referansi              │
└──────────────────────────────┘
\`\`\`

1. **Baslik** — Ust kenarda "Bu sayfada" veya ozel etiket
2. **Oge Sayaci** — Toplam oge sayisini gosteren badge
3. **Navigasyon Listesi** — \`<ol>\` ile siralanmis bolum baglantilari
4. **Seviye Girintisi** — \`level\` 1/2/3 ile sol girinti (\`pl-0\` / \`pl-4\` / \`pl-8\`)
5. **Aktif Gosterge** — Secili oge vurgulu kenarllik ve arka plan ile isaretlenir
6. **Meta Bilgisi** (opsiyonel) — Sag tarafta "Yeni", "Beta" gibi ek bilgi
7. **Sticky Konum** (opsiyonel) — \`sticky\` ile sayfa kaydirmada sabit kalir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`syncWithHash={true}\` ile URL hash senkronizasyonu saglayin.** Sayfa yenilendiginde veya link paylasildiginda dogru bolum aktif olur.

**\`sticky\` ile yan panelde sabit tutun.** Uzun sayfalarda kullanici her zaman icerik tablosuna erisebilinsin.

**\`level\` ile hiyerarsiyi dogru belirtin.** Girintileme gorsel hiyerarsi olusturur ve okuyucularin yapti kavramasini kolaylastirir.

**\`density="compact"\` ile sik listelerde yer kazanin.** Cok sayida bolum varsa compact modu tercih edin.

**\`meta\` ile yeni veya onemli bolumleri vurgulayin.** "Yeni", "Beta" gibi etiketler dikkat ceker.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ 3'ten fazla girintileme seviyesi kullanmak**
Bilesen en fazla 3 seviye destekler; daha derin yapilari duzlestirin.

**❌ \`syncWithHash\` kapali iken hash baglantilari kullanmak**
Hash degisiklikleri yansimaz ve tutarsiz davranis olusur.

**❌ Kontrolllu \`value\` ile \`onValueChange\` sagamamak**
Kullanici tiklamasi state'i guncellemez; her ikisini birlikte kullanin.

**❌ Cok uzun etiketler kullanmak**
Etiketler kisa ve okunakli olmali; uzun metinler \`truncate\` ile kesilir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<nav>\` elementi ile navigasyon landmark'i olusturulur. \`aria-label\` ile "On-page navigation" etiketi tasinir.

**Aktif Durum:** Secili oge \`aria-current="location"\` ile isaretlenir.

**Disabled Ogeler:** \`aria-disabled\` ile devre disi ogeler belirtilir ve \`pointer-events-none\` ile tiklanmasi engellenir.

**Klavye Navigasyonu:** Tab ile ogeler arasinda gezinme; Enter ile bolume atlama. Focus ring WCAG 2.1 AA kontrastini saglar.

**Erisim Kontrolu:** \`access\` prop'u ile tum etklesimler kontrol edilir. Disabled/readonly durumlarda tiklamalar engellenir.`,
      },
    ],
    relatedComponents: ["NavigationMenu", "Tabs"],
  },

  Tree: {
    componentName: "Tree",
    summary: "Tree, hiyerarsik verileri genisletilebilir/daraltilabilir agac yapisinda goruntuleyen, secim ve badge destekli bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `Tree, ic ice \`TreeNode\` ogelerinden olusan hiyerarsik veriyi agac yapisiyla goruntuleyen bilesendir. Her dugum etiket, aciklama, meta, badge'ler ve tone ile zenginlestirilebilir. Genisletme/daraltma kontrolllu veya kontrolsuz olarak yonetilebilir.

\`\`\`tsx
import { Tree } from '@mfe/design-system';

<Tree
  nodes={[
    {
      key: "src", label: "src", description: "Kaynak kodlar",
      children: [
        { key: "components", label: "components", badges: ["12 dosya"], tone: "info" },
        { key: "utils", label: "utils", badges: ["5 dosya"] },
      ],
    },
    {
      key: "tests", label: "tests", description: "Test dosyalari",
      tone: "success", meta: "100% kapsam",
      children: [
        { key: "unit", label: "unit" },
        { key: "e2e", label: "e2e", disabled: true },
      ],
    },
  ]}
  title="Proje Yapisi"
  description="Dosya ve klasor hiyerarsisi"
  density="comfortable"
  defaultExpandedKeys={["src"]}
  selectedKey="components"
  onNodeSelect={(key) => console.log("Secilen:", key)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Dosya/klasor hiyerarsisi gostermek icin
- Organizasyon sema ve yapilari goruntulelemek icin
- Kategori agaci veya taksonomi goruntuleme icin
- Ic ice menu veya yapilandirma agaclari icin

**Kullanmayin:**
- Duz (flat) liste icin — \`List\` veya \`DataTable\` kullanin
- Ag/graf yapilari icin — ozel graf bileseni kullanin
- Accordion tarzli icerik acma/kapama icin — \`Accordion\` kullanin
- Navigasyon menuleri icin — \`NavigationMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
  Proje Yapisi
  Dosya ve klasor hiyerarsisi

┌──────────────────────────────────────┐
│ ▾ src                                │
│   Kaynak kodlar                      │
│   │ ● components     [12 dosya] info │
│   │ ● utils          [5 dosya]       │
│ ▸ tests                  100% kapsam │
│   Test dosyalari                     │
└──────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** (opsiyonel) — Agacin ust basligi ve aciklamasi
2. **Konteyner** — Rounded border, shadow ile sarili agac alani
3. **Genisletme Butonu** — ▸/▾ ile cocuk dugumlerini ac/kapat
4. **Yaprak Gostergesi** — Cocugu olmayan dugumler icin \`•\` nokta ikonu
5. **Dugum Etiketi** — Ana etiket metni
6. **Aciklama** (opsiyonel) — Etiket altinda ek aciklama
7. **Badge'ler** (opsiyonel) — Dugum yaninda bilgi etiketleri
8. **Meta** (opsiyonel) — Sag tarafta ust bilgi
9. **Tone** — default/info/success/warning/danger ile renk kodlamasi
10. **Loading State** — \`loading\` true iken Skeleton ile yukleme gosterimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`defaultExpandedKeys\` ile baslangic durumunu belirleyin.** Kullanicinin ilk gorunumde onemli dallari acik gormesini saglayin.

**\`tone\` ile gorsel anlam katın.** Basarili islemler icin \`success\`, uyari gerektiren ogeler icin \`warning\` kullanin.

**\`badges\` ile ek bilgi verin.** Dosya sayisi, durum etiketi gibi bilgileri badge ile gosterin.

**\`density="compact"\` ile yogun agaclarda yer kazanin.** Cok sayida dugum varsa compact modu tercih edin.

**\`selectedKey\` ile secili dugumu vurgulayin.** Kullanicinin hangi dugumde oldugunu ring ile belirtin.

**\`loading\` state'ini kullanin.** Asenkron veri yuklenirken Skeleton ile bekleme gosterimi sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok derin hiyerarsiler olusturmak**
5+ seviye derinlik gorsel olarak takibi zorlastirir. Yapti saderlestirin.

**❌ Kontrolllu \`expandedKeys\` ile \`onExpandedKeysChange\` sagamamak**
Genisletme/daraltma calismaz; her ikisini birlikte kullanin.

**❌ Tum dugumleri baslangicta acik birakmak**
Buyuk agaclarda performansi dusurur ve gorsel karmasiklik yaratir.

**❌ \`disabled\` dugumleri aciklamadan isaretlemek**
Kullanici neden tiklanmadigini anlamaz; gorsel ipucu veya tooltip ekleyin.

**❌ Duz liste verisini zorla agac yapisina donusturmek**
Hiyerarsi yoksa \`List\` veya \`DataTable\` daha uygun.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile sarili; \`<ul>\`/\`<li>\` ile agac yapisi isaretlenir.

**Genisletme Butonu:** \`aria-expanded\` ve \`aria-label\` ile "Expand branch" / "Collapse branch" etiketi tasinir.

**Secim:** Secili dugum \`aria-current="true"\` ile isaretlenir.

**Disabled:** \`shouldBlockInteraction\` ile disabled dugumler tiklanamaz; gorsel olarak \`opacity-70\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Loading:** Yukleme durumunda Skeleton bileseni ile gorsel yer tutucu sunulur.`,
      },
    ],
    relatedComponents: ["Accordion", "NavigationMenu", "JsonViewer"],
  },

  ApprovalReview: {
    componentName: "ApprovalReview",
    summary: "ApprovalReview, insan onay noktasi, kaynak kanitlari ve denetim izlerini tek bir inceleme recipe yuzeyinde birlestiren ust duzey bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ApprovalReview, \`ApprovalCheckpoint\`, \`CitationPanel\` ve \`AIActionAuditTimeline\` bilesenlerini tek bir premium yuzeyde bir araya getirir. Baslik, aciklama, onay noktasi, kaynak listesi ve denetim zamancizgisini dikey akista sunar.

Kontrol edilebilir (controlled) ve kontrolsuz (uncontrolled) kullanimi destekler: \`selectedCitationId\` / \`selectedAuditId\` ile controlled; \`defaultSelectedCitationId\` / \`defaultSelectedAuditId\` ile uncontrolled mod kullanilir.

\`\`\`tsx
<ApprovalReview
  title="Yayin Onay Incelemesi"
  description="Checkpoint, kaynaklar ve denetim izleri"
  checkpoint={{ title: "v2.1 Release", summary: "Uretim oncesi onay", status: "pending" }}
  citations={[{ id: "c1", title: "Politika Belgesi", excerpt: "Kaynak alintisi...", source: "Compliance DB" }]}
  auditItems={[{ id: "a1", actor: "ai", title: "Taslak olusturuldu", timestamp: "10:30" }]}
  onCitationSelect={(id) => console.log(id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI uretimli icerigi insan onayi ile dogrulamak gereken akislarda
- Kaynak seffafligi ve denetim izinin birlikte gosterilmesi gerektiginde
- Yayin, politika veya uyumluluk onay surecleri icin
- Coklu kanit ve audit kaydinin tek gorunumde sunulmasi gerektiginde

**Kullanmayin:**
- Yalnizca onay butonu gerektiginde — bunun yerine \`ApprovalCheckpoint\` kullanin
- Yalnizca kaynak listesi gosterecekseniz — bunun yerine \`CitationPanel\` kullanin
- Basit onay dialoglari icin — bunun yerine \`Modal\` + \`Button\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Baslik]                                │
│  [Aciklama]                              │
│                                          │
│  ┌─────────────────┐ ┌────────────────┐  │
│  │ ApprovalCheck-  │ │ CitationPanel  │  │
│  │ point           │ │                │  │
│  └─────────────────┘ └────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ AIActionAuditTimeline            │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border ve backdrop-blur
2. **Baslik & Aciklama** — Inceleme amacini ozetler
3. **ApprovalCheckpoint** — Onay durumu, adimlar ve aksiyonlar
4. **CitationPanel** — Kaynak kanit parcalari
5. **AIActionAuditTimeline** — Kronolojik denetim izleri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her zaman anlamli baslik ve aciklama saglayin.** Inceleme kapsamini acikca belirtin.

**Checkpoint status'unu dogru eslestirin.** \`pending\`, \`approved\`, \`rejected\`, \`blocked\` durumlarini is akisina gore secin.

**Kaynak ve audit ogelerini iliskili tutun.** Citation ve audit verileri ayni karar surecine ait olmalidir.

**Controlled mod'u karmasik formlarda tercih edin.** Ust bilesenden state yonetimi yaparak tutarli UI saglayin.

**Access prop'unu yetki seviyesine gore ayarlayin.** Okuma yetkisi olanlara \`readonly\`, yetkisizlere \`hidden\` verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Bos citation ve audit listeleri ile kullanmak**
Icerik yoksa ApprovalReview yerine daha basit bir onay bileseni tercih edin.

**❌ Checkpoint olmadan kullanmak**
\`checkpoint\` prop'u zorunludur; yalnizca kaynaklar gerekiyorsa \`CitationPanel\` kullanin.

**❌ Cok fazla audit ogesi yuklemek**
Performans icin audit ogelerini sayfalama veya filtreleme ile sinirlandin.

**❌ Access kontrolu olmadan hassas veriler gostermek**
\`access\` prop'unu her zaman yetki seviyesine gore ayarlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; alt bilesenler kendi ARIA rollerini tasir.

**Secim:** Citation ve audit secim durumlari \`aria-current="true"\` ile isaretlenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.

**Disabled:** \`disabled\` veya \`readonly\` durumda alt bilesenler etkilesime kapatilir; gorsel olarak \`opacity\` ve \`cursor-not-allowed\` ile belirtilir.

**Klavye:** Alt bilesenlerdeki butonlar Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.`,
      },
    ],
    relatedComponents: ["ApprovalCheckpoint", "CitationPanel", "AIActionAuditTimeline"],
  },

  ApprovalCheckpoint: {
    componentName: "ApprovalCheckpoint",
    summary: "ApprovalCheckpoint, insan onay surecini durum, adimlar, kanit baglantilari ve aksiyon butonlari ile yoneten kontrol noktasi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ApprovalCheckpoint, bir onay surecinin tum yasam dongusunu tek bir premium kartta gosterir. Durum badge'leri (\`pending\`, \`approved\`, \`rejected\`, \`blocked\`), kontrol listesi adimlari, kanit baglantilari ve birincil/ikincil aksiyon butonlari sunar.

\`Descriptions\` ile onaylayan, son tarih ve kanit ozetini, \`List\` ile checklist maddelerini gosterir.

\`\`\`tsx
<ApprovalCheckpoint
  title="v2.1 Release Onayi"
  summary="Uretim ortamina gecis icin insan onayi gereklidir."
  status="pending"
  approverLabel="Guvenlik Ekibi"
  dueLabel="15 Mart 2026"
  steps={[
    { key: "1", label: "Kod incelemesi", status: "approved" },
    { key: "2", label: "Guvenlik taramas", status: "ready" },
  ]}
  onPrimaryAction={() => console.log("Onaylandi")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan uretilen icerigin insan onayi gerektirdigi sureclerde
- Yayin, dagitim veya politika onay akislarinda
- Coklu adimli checklist tabanli onay surecleri icin
- Kanit baglantilari ile desteklenen karar noktalarinda

**Kullanmayin:**
- Basit evet/hayir onaylari icin — bunun yerine \`Modal\` + \`Button\` kullanin
- Form dogrulama adimlari icin — bunun yerine \`Stepper\` veya \`Wizard\` kullanin
- Salt okunur durum gosterimi icin — bunun yerine \`Badge\` veya \`StatusIndicator\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Checkpoint Badge] [Status Badge]       │
│  [Baslik]                                │
│  [Ozet]                                  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Descriptions (approver/due/      │    │
│  │               evidence)          │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Checklist (List)                 │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [Citations Badges]                      │
│  [Primary Button]  [Secondary Button]    │
│  [Footer Note]                           │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`article\` elemani; premium yuzeyli rounded-xs border
2. **Badge Satirı** — Checkpoint etiketi ve durum badge'i
3. **Baslik & Ozet** — Onay noktasinin amaci
4. **Descriptions** — Onaylayan, son tarih ve kanit sayisi
5. **Checklist** — List bileseni ile adim durumlari
6. **Citations** — Badge olarak kaynak referanslari
7. **Aksiyonlar** — Birincil (Approve) ve ikincil (Request review) butonlar`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Status'u is akisina gore dogru secin.** \`pending\` baslangic, \`approved\` onaylanmis, \`rejected\` reddedilmis, \`blocked\` engellenmis durum icindir.

**Her adima anlamli durum verin.** Checklist maddelerinde \`todo\`, \`ready\`, \`approved\`, \`blocked\` durumlarini dogru kullanin.

**Kanit baglantilari ekleyin.** \`evidenceItems\` ile karar dayanaklarini gorsel olarak destekleyin.

**Aksiyon etiketlerini ozellestirin.** \`primaryActionLabel\` ve \`secondaryActionLabel\` ile baska dillere de uyumlu etiketler kullanin.

**Footer note ile ek baglam saglayin.** Onay kosullari veya uyari bilgisini \`footerNote\` ile ekleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Status olmadan kullanmak**
Onay durumu her zaman gorsel olarak belirtilmelidir; varsayilan \`pending\` bile olsa bilinçli secilmelidir.

**❌ Cok fazla checklist adimi eklemek**
5-7 adimdan fazlasi kullanici icin bunaltici olabilir. Adimlari gruplandirin.

**❌ Aksiyon callback'leri olmadan buton gostermek**
\`onPrimaryAction\` veya \`onSecondaryAction\` tanimlanmadan butonlar islevsiz kalir.

**❌ Access kontrolu ayarlamamak**
Yetkisiz kullanicilarin onay islemleri yapmasini onlemek icin \`access\` prop'unu kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elemani ile sarili; durum \`data-status\` attribute ile belirtilir.

**Butonlar:** Birincil ve ikincil butonlar standart \`<button>\` elemani; Tab ile odaklanabilir, Enter/Space ile etkinlesir.

**Disabled:** \`access="disabled"\` durumda butonlar \`aria-disabled\` ile isaretlenir, tiklanmasi engellenir.

**Kontrast:** Badge durum renkleri WCAG 2.1 AA minimum kontrast oranini karsilar.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "List", "Descriptions"],
  },

  AIGuidedAuthoring: {
    componentName: "AIGuidedAuthoring",
    summary: "AIGuidedAuthoring, prompt yazimi, oneri karti yigini, guven gostergesi ve komut paletini tek bir AI destekli yazim recipe yuzeyinde birlestiren ust duzey bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AIGuidedAuthoring, \`PromptComposer\`, \`RecommendationCard\`, \`ConfidenceBadge\` ve \`CommandPalette\` bilesenlerini tek bir yazim yuzeyinde bir araya getirir. Prompt yazimi, AI onerilerini inceleme, guven seviyesini izleme ve hizli komutlara erisimi ayni recipe icerisinde sunar.

Controlled ve uncontrolled palette acik/kapali durumu icin \`paletteOpen\` / \`defaultPaletteOpen\` destekler.

\`\`\`tsx
<AIGuidedAuthoring
  title="AI Destekli Icerik Yazimi"
  confidenceLevel="high"
  confidenceScore={87}
  sourceCount={12}
  promptComposerProps={{ scope: "policy", maxLength: 800 }}
  recommendations={[
    { id: "r1", title: "Baslik Onerisi", summary: "SEO uyumlu baslik", confidenceLevel: "high" },
  ]}
  commandItems={[{ id: "cmd1", label: "Ton Analizi", description: "Metnin tonunu analiz et" }]}
  onApplyRecommendation={(id) => console.log("Uygulandi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI destekli icerik uretim akislarinda prompt ve oneriler birlikte sunulmak istendiginde
- Yazim surecinde guven skoru ve kaynak sayisi takibi gerektiginde
- Prompt, oneri ve komut paletinin entegre calistigi yazim arayuzlerinde
- Politika, yayin veya uyumluluk icerigi hazirlama surecleri icin

**Kullanmayin:**
- Yalnizca prompt alani gerekiyorsa — bunun yerine \`PromptComposer\` kullanin
- Yalnizca oneri gosterimi icin — bunun yerine \`RecommendationCard\` kullanin
- Basit metin duzenleyici icin — bunun yerine \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────┐
│  [Baslik]                [ConfidenceBadge]   │
│  [Aciklama]              [Command Palette    │
│                           Butonu]            │
│                                              │
│  ┌──────────────────┐ ┌───────────────────┐  │
│  │ PromptComposer   │ │ RecommendationCard│  │
│  │                  │ │ (liste)           │  │
│  └──────────────────┘ └───────────────────┘  │
│                                              │
│  [CommandPalette (modal)]                    │
└──────────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; rounded-xs border ve surface-muted arkaplan
2. **Baslik & Aciklama** — Yazim amacini ozetler
3. **ConfidenceBadge** — Genel guven seviyesi gostergesi
4. **Command Palette Butonu** — Hizli komut erisimi
5. **PromptComposer** — Prompt baslik, govde, kapsam ve ton kontrolleri
6. **RecommendationCard Listesi** — AI onerilerini gosterir
7. **CommandPalette** — Modal komut arama paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Guven seviyesini gercekci yansitın.** \`confidenceLevel\` ve \`confidenceScore\` degerlerini AI model ciktisina dayandirin.

**Oneri sayisini makul tutun.** 3-5 arasi oneri ideal; daha fazlasi icin sayfalama veya filtreleme ekleyin.

**Command palette ogelerini kategorize edin.** Komut ogelerini mantiksal gruplara ayirin.

**PromptComposer props'larini ozellestirin.** \`scope\`, \`maxLength\` ve \`guardrails\` degerlerini kullanim baglamina gore ayarlayin.

**Apply ve Review callback'lerini ayri yonetin.** \`onApplyRecommendation\` dogrudan uygulama, \`onReviewRecommendation\` detayli inceleme icin kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Bos oneri listesi ile kullanmak**
En az bir oneri veya anlamli bir bos durum mesaji saglayin.

**❌ Guven skoru olmadan high seviye gostermek**
\`confidenceLevel="high"\` kullanirken \`confidenceScore\` ile somut bir deger de saglayin.

**❌ Command palette ogesi olmadan buton gostermek**
\`commandItems\` bos ise palette butonu otomatik gizlenir; gereksiz prop gecmeyin.

**❌ PromptComposer'i tamamen degistirmek**
\`promptComposerProps\` ile ozellestirin; alt bileseni disaridan degistirmeyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; alt bilesenler kendi ARIA rollerini tasir.

**Klavye:** PromptComposer alanlari Tab ile odaklanabilir; CommandPalette Escape ile kapatilir.

**Erisim Kontrolu:** \`access\` prop'u ile tum alt bilesenler ayni yetki seviyesini devralir.

**ConfidenceBadge:** \`aria-label\` ile guven seviyesi ekran okuyuculara bildirilir.

**Disabled:** \`access="disabled"\` durumda tum etkilesimler engellenir; gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["PromptComposer", "RecommendationCard", "ConfidenceBadge", "CommandPalette"],
  },

  AIActionAuditTimeline: {
    componentName: "AIActionAuditTimeline",
    summary: "AIActionAuditTimeline, AI aksiyonlari ve insan onaylarini kronolojik denetim izi olarak gorselleyen zamancizgisi bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AIActionAuditTimeline, AI ve insan eylemlerini kronolojik sirada dikey bir zamancizgisi olarak sunar. Her oge; aktor tipi (\`ai\`, \`human\`, \`system\`), durum (\`drafted\`, \`approved\`, \`executed\`, \`rejected\`, \`observed\`), baslik, zaman damgasi ve opsiyonel ozet icerir.

Secim destegi ile detay paneli acma veya vurgulama senaryolarina uyum saglar. Bos durum icin ozellestirebilir mesaj sunar.

\`\`\`tsx
<AIActionAuditTimeline
  title="Denetim Zamancizgisi"
  items={[
    { id: "1", actor: "ai", title: "Taslak olusturuldu", timestamp: "10:30", status: "drafted" },
    { id: "2", actor: "human", title: "Inceleme tamamlandi", timestamp: "11:15", status: "approved" },
    { id: "3", actor: "system", title: "Dagitim baslatildi", timestamp: "11:45", status: "executed" },
  ]}
  selectedId="2"
  onSelectItem={(id) => console.log("Secildi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan gerceklestirilen aksiyonlarin denetim izini gostermek icin
- Insan ve AI isbirliginin kronolojik kaydi gerektiginde
- Onay surecleri icerisinde karar gecmisini sergilemek icin
- Uyumluluk ve seffaflik raporlama arayuzlerinde

**Kullanmayin:**
- Genel etkinlik akisi icin — bunun yerine \`ActivityFeed\` kullanin
- Yalnizca durum gostergesi gerekiyorsa — bunun yerine \`Badge\` veya \`StatusIndicator\` kullanin
- Zaman odakli gant semalari icin — bunun yerine \`Timeline\` veya \`Gantt\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Baslik]                                │
│  [Aciklama]                              │
│                                          │
│  ● ─── [Actor Badge] [Status Badge]     │
│  │     [Baslik]              [Zaman]     │
│  │     [Ozet]                            │
│  │                                       │
│  ● ─── [Actor Badge] [Status Badge]     │
│  │     [Baslik]              [Zaman]     │
│  │     [Ozet]                            │
│  │                                       │
│  ● ─── [Actor Badge] [Status Badge]     │
│        [Baslik]              [Zaman]     │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border
2. **Baslik & Aciklama** — Zamancizgisi amacini aciklar
3. **Zaman Cizgisi** — Dikey cizgi ile baglanan dugumler
4. **Dugum Noktasi** — Dolu daire; secili ise vurgulanir
5. **Oge Karti** — Aktor badge, durum badge, baslik, zaman ve ozet
6. **Bos Durum** — \`Empty\` bileseni ile ozellestirilmis mesaj`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Aktor tiplerini dogru atanin.** \`ai\` yapay zeka aksiyonlari, \`human\` insan mudahaleleri, \`system\` otomatik sistem islemleri icin kullanilir.

**Durum degerlerini tutarli kullanin.** \`drafted\` → \`approved\` → \`executed\` dogal bir akis izler.

**Ozet alanini kisa tutun.** \`summary\` iki satiri gecmemelidir; detay icin secim ile ayri panel acin.

**Compact mod'u yogun arayuzlerde tercih edin.** \`compact={true}\` ile daha siki bir gorunum elde edin.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile baglama uygun bir mesaj saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla oge yuklemek**
Performans ve okunabilirlik icin 20-30 ogeden fazlasini sayfalama ile sinirlandin.

**❌ Zaman damgasi olmadan kullanmak**
Her ogenin \`timestamp\` alani zorunludur; kronolojik siralamayi bozmayin.

**❌ Actor tipi belirtmeden kullanmak**
\`actor\` alani zorunludur; her ogenin kaynagini (ai/human/system) acikca belirtin.

**❌ Secim callback'i olmadan secim durumu gostermek**
\`selectedId\` kullaniyorsaniz \`onSelectItem\` callback'ini de tanimlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` ile sarili; zamancizgisi \`<ol>\`/\`<li>\` ile sirali liste olarak isaretlenir.

**Secim:** Secili oge \`aria-current="true"\` ile isaretlenir.

**Klavye:** Secim butonlari Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.

**Disabled:** \`access="disabled"\` veya \`"readonly"\` durumda butonlar tiklanamaz; gorsel olarak \`opacity-80\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "Empty"],
  },

  PromptComposer: {
    componentName: "PromptComposer",
    summary: "PromptComposer, kapsam guvenli prompt yazimi, ton kontrolu, guardrail gostergesi ve kaynak referanslarini tek bir composer yuzeyinde birlestiren bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `PromptComposer, AI yardimcisina verilecek gorev tanimini yazmak icin ozel olarak tasarlanmis bir yazim yuzeyidir. Prompt basligi (\`subject\`), govde metni (\`value\`), kapsam (\`scope\`: general/approval/policy/release) ve ton (\`tone\`: neutral/strict/exploratory) kontrolleri sunar.

Yan panelde aktif sozlesme (scope, tone, karakter sayisi), guardrail'ler ve kaynak referanslari gorunur. Tum alanlar controlled ve uncontrolled modda kullanilabilir.

\`\`\`tsx
<PromptComposer
  title="Politika Prompt'u"
  scope="policy"
  tone="strict"
  maxLength={800}
  guardrails={["PII filtreleme", "Dil kontrolu"]}
  citations={["ISO 27001", "KVKK Rehberi"]}
  onValueChange={(val) => console.log(val)}
  onScopeChange={(scope) => console.log(scope)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI'a verilecek yapisal prompt'larin yazilmasi gerektiginde
- Kapsam ve ton kontrolu ile sinirlandirilmis yazim arayuzlerinde
- Guardrail ve kaynak referanslarinin prompt ile birlikte gosterilmesi gerektiginde
- AIGuidedAuthoring recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Serbest metin giris alanı icin — bunun yerine \`TextArea\` kullanin
- Chat tarzı mesajlasma icin — bunun yerine ozel chat bileseni kullanin
- Basit form alanlari icin — bunun yerine \`Input\` veya \`TextArea\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────┐
│  [Baslik]                                    │
│  [Aciklama]                                  │
│                                              │
│  ┌──────────────────┐ ┌───────────────────┐  │
│  │ Prompt Title     │ │ Current Contract  │  │
│  │ (TextInput)      │ │ (scope/tone/chars)│  │
│  │                  │ │                   │  │
│  │ Prompt Body      │ │ Guardrails        │  │
│  │ (TextArea)       │ │ (Badge listesi)   │  │
│  │                  │ │                   │  │
│  │ [Scope Butonlari]│ │ Source Anchors    │  │
│  │ [Tone Butonlari] │ │ (Badge listesi)   │  │
│  └──────────────────┘ └───────────────────┘  │
└──────────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; rounded-xs border, surface-muted arkaplan
2. **Baslik & Aciklama** — Composer amacini ozetler
3. **Prompt Title** — Tek satirlik baslik giris alani
4. **Prompt Body** — Cok satirlik govde alani, karakter sayaci ile
5. **Scope Butonlari** — general, approval, policy, release secenekleri
6. **Tone Butonlari** — neutral, strict, exploratory secenekleri
7. **Current Contract** — Aktif kapsam, ton ve karakter bilgisi
8. **Guardrails** — Uyari badge'leri ile sinir kurallari
9. **Source Anchors** — Referans kaynaklari badge'leri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kapsam ve tonu baglama gore varsayilan olarak ayarlayin.** Politika icerigi icin \`scope="policy"\` ve \`tone="strict"\` mantikli bir baslangictir.

**maxLength'i icerigi ture gore sinirlandin.** Kisa prompt'lar icin 400-600, detayli gorevler icin 1000-1200 karakter idealdir.

**Guardrail'leri acik ve anlasilir tutun.** Her guardrail maddesi tek bir kurali ifade etmelidir.

**Citation'lari kaynak gosterimi icin kullanin.** Prompt'un dayandigi belge veya standartlari listeleyin.

**Controlled mod'u karmasik formlarda tercih edin.** \`value\`, \`scope\`, \`tone\` prop'larini ust bilesenden yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ maxLength siniri koymamak**
Kontrolsuz uzun prompt'lar AI performansini dusurur; her zaman bir ust sinir belirleyin.

**❌ Scope ve tone kontrollerini gizlemek**
Kullanicinin prompt kapsamini ve tonunu gormesi seffaflik icin onemlidir.

**❌ Guardrail olmadan hassas kapsam kullanmak**
\`scope="policy"\` kullanirken ilgili guardrail'leri mutlaka ekleyin.

**❌ Bos citation listesi ile kaynak paneli gostermek**
Citation yoksa panel otomatik gizlenir; bos dizi gecmeyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; giris alanlari \`<label>\` ile iliskilendirilmistir.

**Klavye:** TextInput ve TextArea Tab ile odaklanabilir; Scope ve Tone butonlari klavye ile secilebilir.

**Karakter Sayaci:** \`showCount\` ile metin uzunlugu gorsel ve programatik olarak sunulur.

**Erisim Kontrolu:** \`access\` prop'u ile tum giris alanlari ve butonlar ayni yetki seviyesini devralir. \`readonly\` durumda alanlar duzenlenemez ancak okunabilir.

**Disabled:** \`access="disabled"\` durumda tum etkilesimler engellenir; gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["AIGuidedAuthoring", "TextArea", "TextInput", "Badge"],
  },

  RecommendationCard: {
    componentName: "RecommendationCard",
    summary: "RecommendationCard, AI tarafindan uretilen onerileri baslik, ozet, gerekce, guven gostergesi ve aksiyon butonlari ile sunan kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `RecommendationCard, bir AI onerisini yapisal olarak sunar. Oneri turu badge'i, guven seviyesi (\`ConfidenceBadge\`), baslik, ozet, gerekce (rationale) listesi, kaynak referanslari ve birincil/ikincil aksiyon butonlari icerir.

Uc farkli ton destekler: \`info\` (bilgilendirme), \`success\` (olumlu), \`warning\` (dikkat). Compact mod ile daha siki gorunum saglar.

\`\`\`tsx
<RecommendationCard
  title="Baslik Iyilestirme Onerisi"
  summary="SEO performansini artirmak icin baslik yapisini degistirin."
  recommendationType="SEO"
  confidenceLevel="high"
  confidenceScore={92}
  sourceCount={8}
  rationale={["Anahtar kelime yogunlugu dusuk", "Baslik uzunlugu optimal degil"]}
  citations={["Google SEO Rehberi", "Ahrefs Raporu"]}
  tone="success"
  onPrimaryAction={() => console.log("Uygulandi")}
  onSecondaryAction={() => console.log("Inceleniyor")}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI tarafindan uretilen onerileri kullaniciya sunmak icin
- Oneri gerekceleri ve kaynak referanslari birlikte gosterilecekse
- Uygula/Incele gibi iki asamali aksiyon akislarinda
- AIGuidedAuthoring recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Bilgilendirme mesajlari icin — bunun yerine \`Alert\` kullanin
- Basit durum kartlari icin — bunun yerine \`Card\` kullanin
- Liste ogeleri icin — bunun yerine \`ListItem\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Type Badge] [ConfidenceBadge] [Badges] │
│  [Baslik]                                │
│  [Ozet]                                  │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Why this recommendation          │    │
│  │ • Gerekce 1                      │    │
│  │ • Gerekce 2                      │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [Citation Badges]                       │
│  [Primary Button]  [Secondary Button]    │
│  [Footer Note]                           │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`article\` elemani; rounded-xs border, surface-muted arkaplan
2. **Badge Satirı** — Oneri turu, guven gostergesi ve ek badge'ler
3. **Baslik & Ozet** — Onerinin icerigini ozetler
4. **Gerekce Paneli** — Madde isaretli gerekce listesi
5. **Citations** — Kaynak referans badge'leri
6. **Aksiyonlar** — Apply (uygula) ve Review (incele) butonlari
7. **Footer Note** — Opsiyonel ek bilgi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Guven seviyesini somut verilerle destekleyin.** \`confidenceScore\` ve \`sourceCount\` degerleri seffaflik saglar.

**Gerekce listesini 2-4 madde ile sinirlandin.** Cok fazla gerekce odaği dagitir.

**Ton'u oneri niteligine gore secin.** Olumlu oneriler icin \`success\`, dikkat gerektiren icin \`warning\`, genel icin \`info\` kullanin.

**Aksiyon etiketlerini anlamli yapin.** "Apply" yerine "Baslik Guncelle" gibi spesifik etiketler kullanin.

**Compact mod'u liste gorunumlerinde kullanin.** Birden fazla oneri kartı yan yana gosterilecekse \`compact={true}\` ile alan kazanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Gerekce olmadan oneri sunmak**
Kullanicilar neden bu onerinin yapildigini bilmek ister; \`rationale\` alanini doldurun.

**❌ Guven skoru olmadan yuksek seviye gostermek**
\`confidenceLevel="high"\` kullanirken \`confidenceScore\` ile numerik deger de saglayin.

**❌ Aksiyon callback'i tanimlamadan buton gostermek**
\`onPrimaryAction\` ve \`onSecondaryAction\` tanimlanmadan butonlar islevsiz kalir.

**❌ Tek bir kart icin cok fazla badge kullanmak**
2-3 badge'den fazlasi gorsel karisiklik yaratir; en onemli bilgileri on plana cikarin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<article>\` elemani ile sarili; oneri icerik blogu olarak isaretlenir.

**Guven Gostergesi:** \`ConfidenceBadge\` \`aria-label\` ile guven seviyesini ekran okuyuculara bildirir.

**Butonlar:** Birincil ve ikincil butonlar standart \`<button>\` elemani; Tab ile odaklanabilir, Enter/Space ile etkinlesir.

**Gerekce Listesi:** \`<ul>\`/\`<li>\` ile semantik liste olarak isaretlenir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. Disabled durumda butonlar tiklanamaz.`,
      },
    ],
    relatedComponents: ["AIGuidedAuthoring", "ConfidenceBadge", "Badge", "Button"],
  },

  ConfidenceBadge: {
    componentName: "ConfidenceBadge",
    summary: "ConfidenceBadge, AI ciktisinin guven seviyesini renkli badge ile gorselleyen kompakt gosterge bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ConfidenceBadge, bir AI sonucunun guvenilirligini dort seviyede (\`low\`, \`medium\`, \`high\`, \`very-high\`) gorsellestirir. Opsiyonel olarak numerik skor yuzdesi ve kaynak sayisi gosterir.

Badge renkleri seviyeye gore otomatik ayarlanir: \`low\` → warning, \`medium\` → info, \`high\`/\`very-high\` → success. Compact mod ile skor ve seviye bilgisini dar alanlarda gosterir.

\`\`\`tsx
<ConfidenceBadge level="high" score={92} sourceCount={8} />
<ConfidenceBadge level="low" compact />
<ConfidenceBadge level="medium" score={65} sourceCount={3} showScore={false} />
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI uretimi icerigin guvenilirligini gostermek icin
- Oneri kartlari, yazim yardimcilari ve analiz sonuclarinda
- Kaynak sayisi ile seffaflik saglanmasi gerektiginde
- Tablo veya liste icerisinde kompakt guven gostergesi olarak

**Kullanmayin:**
- Genel durum gostergesi icin — bunun yerine \`Badge\` kullanin
- Ilerleme gostergesi icin — bunun yerine \`ProgressBar\` kullanin
- Sayisal metrik gosterimi icin — bunun yerine \`Statistic\` veya \`Metric\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────┐
│  [Seviye Etiketi] · [Skor%] ·   │
│  [Kaynak Sayisi]                 │
└──────────────────────────────────┘
\`\`\`

1. **Badge Container** — \`Badge\` bileseni; seviyeye gore renk tonu
2. **Seviye Etiketi** — "Low confidence", "Medium confidence" vb. veya ozel \`label\`
3. **Skor Yuzdesi** — \`score\` degeri normalize edilmis yuzde (0-100)
4. **Kaynak Sayisi** — "N sources" formatinda; compact modda gizlenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Seviye ile skoru tutarli tutun.** \`level="high"\` ise skor 70+ olmalidir; uyumsuz degerler kullaniciyi yaniltir.

**Kaynak sayisini saglayin.** \`sourceCount\` seffaflik icin onemlidir; kullanici kac kaynaga dayaldigini gormek ister.

**Compact mod'u dar alanlarda tercih edin.** Tablo hücreleri veya badge yiginlarinda \`compact={true}\` kullanin.

**showScore ile goruntüyü kontrol edin.** Skor gosterimi gereksizse \`showScore={false}\` ile gizleyin.

**Ozel label ile baglamsal metin kullanin.** \`label\` prop'u ile "Model guven skoru" gibi aciklayici metin verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Seviye ve skor arasinda uyumsuzluk**
\`level="high"\` ile \`score={30}\` gibi celiskili degerler kullaniciyi yaniltir.

**❌ Her yerde non-compact mod kullanmak**
Dar alanlarda (tablo, badge grubu) compact kullanmazsaniz tasma sorunu yasanir.

**❌ Kaynak sayisi olmadan yuksek guven gostermek**
\`sourceCount\` olmadan yuksek guven iddasi seffaflik ilkesine aykiridir.

**❌ Dekoratif amacla kullanmak**
ConfidenceBadge yalnizca AI ciktisinin guvenilirligini gostermek icin tasarlanmistir; genel badge olarak kullanmayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**ARIA:** \`aria-label\` ile guven seviyesi etiketi ekran okuyuculara aktarilir (orn. "High confidence").

**Data Attribute:** \`data-confidence-level\` ile seviye programatik olarak okunabilir.

**Kontrast:** Badge renk tonlari (warning, info, success) WCAG 2.1 AA minimum kontrast oranini karsilar.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` durumda bilesen render edilmez.

**Klavye:** Badge tek basina etkilesimli degildir; etkilesim gerekiyorsa bir buton icine sarin.`,
      },
    ],
    relatedComponents: ["Badge", "RecommendationCard", "AIGuidedAuthoring"],
  },

  CitationPanel: {
    componentName: "CitationPanel",
    summary: "CitationPanel, kaynak seffafligi icin alinti parcalarini, kaynak bilgilerini ve tur etiketlerini tek bir panel yuzeyinde listeleyen bilesendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CitationPanel, AI ciktisinin dayandigi kaynaklari yapisal olarak listeler. Her kaynak ogesi; baslik, alinti parcasi (excerpt), kaynak bilgisi (source), konum referansi (locator) ve kaynak turu (\`policy\`, \`doc\`, \`code\`, \`log\`, \`dataset\`) icerir.

Secim destegi ile aktif kaynagi vurgulama ve detay acma senaryolarina uyum saglar. Bos durum icin ozellestirilmis mesaj sunar.

\`\`\`tsx
<CitationPanel
  title="Kaynaklar"
  items={[
    { id: "c1", title: "Veri Koruma Politikasi", excerpt: "Kisisel veriler...", source: "Compliance DB", kind: "policy", locator: "Bolum 3.2" },
    { id: "c2", title: "API Dokumantasyonu", excerpt: "Endpoint tanimi...", source: "Dev Portal", kind: "doc" },
  ]}
  activeCitationId="c1"
  onOpenCitation={(id) => console.log("Kaynak acildi:", id)}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- AI ciktisinin dayandigi kaynaklari seffaf olarak gostermek icin
- Onay surecleri icerisinde kanit referanslarini listelemek icin
- Alinti parcalari ile kaynak dogrulamasini kolaylastirmak icin
- ApprovalReview recipe icerisinde alt bilesen olarak

**Kullanmayin:**
- Basit link listesi icin — bunun yerine \`List\` veya \`LinkList\` kullanin
- Dosya listesi icin — bunun yerine \`FileList\` kullanin
- Genel icerik kartlari icin — bunun yerine \`Card\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Baslik]                                │
│  [Aciklama]                              │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [Kind Badge] [Locator Badge]     │    │
│  │ [Kaynak Basligi]                 │    │
│  │ [Kaynak Bilgisi]                 │    │
│  │ ┌────────────────────────────┐   │    │
│  │ │ Alinti Parcasi (excerpt)   │   │    │
│  │ └────────────────────────────┘   │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ [Bir sonraki kaynak...]          │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
\`\`\`

1. **Container** — \`section\` elemani; premium yuzeyli rounded-xs border
2. **Baslik & Aciklama** — Panel amacini ozetler
3. **Kaynak Karti** — Tiklanabilir veya statik kaynak ogesi
4. **Kind Badge** — Kaynak turu (policy, doc, code, log, dataset)
5. **Locator Badge** — Kaynaktaki konum referansi
6. **Baslik & Source** — Kaynak adi ve kaynak bilgisi
7. **Excerpt** — Alinti parcasi; ozel bir ic kartta sunulur
8. **Bos Durum** — \`Empty\` bileseni ile ozellestirilmis mesaj`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her kaynaga anlamli baslik ve source verin.** Kullanicilar kaynagi hizla tanimlayabilmelidir.

**Kind alanini dogru secin.** \`policy\` politika belgeleri, \`doc\` genel dokumantasyon, \`code\` kod parcalari, \`log\` sistem kayitlari, \`dataset\` veri setleri icin kullanilir.

**Locator ile kesin konum belirtin.** "Bolum 3.2", "Satir 45-67" gibi referanslar dogrulama hizini arttirir.

**Excerpt'i kisa ve odakli tutun.** Alinti parcasi 2-3 cumleyi gecmemelidir.

**Bos durum mesajini ozellestirin.** \`emptyStateLabel\` ile "Henuz kaynak eklenmedi" gibi baglamsal mesaj verin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Excerpt olmadan kaynak listelemek**
Alinti parcasi olmadan kaynak dogrulamasi yapilamaz; her ogeye \`excerpt\` ekleyin.

**❌ Cok fazla kaynak yuklemek**
10-15 kaynaktan fazlasi icin sayfalama veya filtreleme ekleyin.

**❌ Kind belirtmeden kullanmak**
Kaynak turu badge'i kullaniciyi hizli yonlendirir; \`kind\` alanini doldurun.

**❌ Secim callback'i olmadan aktif durum gostermek**
\`activeCitationId\` kullaniyorsaniz \`onOpenCitation\` callback'ini de tanimlayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; kaynak ogeleri \`<button>\` veya \`<div>\` olarak render edilir.

**Secim:** Aktif kaynak \`aria-current="true"\` ile isaretlenir.

**Klavye:** Tiklanabilir kaynak ogeleri Tab ile odaklanabilir, Enter/Space ile etkinlestirilir.

**Disabled:** \`access="disabled"\` veya \`"readonly"\` durumda kaynak ogeleri tiklanamaz; gorsel olarak \`opacity-70\` ve \`cursor-not-allowed\` ile belirtilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir.`,
      },
    ],
    relatedComponents: ["ApprovalReview", "Badge", "Empty"],
  },

  CommandHeader: {
    componentName: "CommandHeader",
    summary: "CommandHeader, MenuBar primitive uzerine kurulu arama oncelikli komut yuzeyidir. Recent roots, favorites ve submenu aksiyonlarini one cikaran search/command header recipe sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandHeader, MenuBar bileseni uzerine insa edilmis bir recipe'dir. Arama (search handoff), son erisilen ogeler (recent roots) ve favori yonetimi davranislarini tek bir navigasyon cubugunda birlestirir.

Workspace header, ops command bar ve ghost utility gibi preset turleriyle farkli kullanim senaryolarina uyum saglar. Submenu destegi, badge, ikon ve klavye navigasyonu icerir.

\`\`\`tsx
<MenuBar
  preset="ops_command_bar"
  routes={routes}
  activeValue={activeRoute}
  onSelect={handleSelect}
  searchable
  favoritable
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama genelinde arama oncelikli navigasyon cubugu olusturmak icin
- Kullanicinin son eristigi sayfalari (recent roots) hizli erisime sunmak icin
- Favori oge yonetimi gerektiren komut yuzeylerinde
- Ops/admin panellerinde hizli komut handoff akislarinda

**Kullanmayin:**
- Basit sayfa navigasyonu icin — bunun yerine \`NavigationRail\` veya \`Tabs\` kullanin
- Sadece arama kutusu gerekiyorsa — bunun yerine \`SearchInput\` kullanin
- Mobil alt navigasyon icin — bunun yerine \`BottomNavigation\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌───────────────────────────────────────────────────────┐
│  [Search]  [Primary Items]  [Secondary]  [Utility]   │
│            [Submenu Surface ▼]                        │
└───────────────────────────────────────────────────────┘
\`\`\`

1. **Search Alani** — Arama handoff tetikleyicisi; komut kesfini baslatir
2. **Primary Items** — Ana navigasyon ogeleri; ikon, etiket ve badge icerirler
3. **Secondary Items** — Ikincil navigasyon gruplari
4. **Utility Items** — Ayarlar, profil gibi yardimci ogeler
5. **Submenu Surface** — Alt menu yüzeyi; baslik, aciklama, meta ve footer icerirler
6. **Favorites** — Favorilere ekleme/cikarma toggle'i`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Arama onceligi verin.** Search handoff, command header'in ana deger onerisidir; her zaman gorunur tutun.

**Recent roots'u sinirli tutun.** Son erisilen ogeleri 5-8 oge ile sinirlandirin; cok fazla oge karmasa yaratir.

**Preset secimi yapin.** \`workspace_header\`, \`ops_command_bar\` veya \`ghost_utility\` arasindan kullanim senaryonuza uygun olani secin.

**Klavye navigasyonu test edin.** Tab, Ok tuslari ve Enter ile tum ogeler arasinda gezinilebildiginden emin olun.

**Submenu icerigini zenginlestirin.** \`menuSurfaceTitle\`, \`menuSurfaceDescription\` ve \`menuSurfaceMeta\` ile kullaniciya daha fazla baglam sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla primary item eklemek**
Navigasyon cubugu tasar ve kullanici odagini dagatir. 5-7 primary item ideal.

**❌ Arama alanini gizlemek**
Command header'in ana amaci arama oncelikli kesfetmedir; aramay gizlemek deger kaybina yol acar.

**❌ Favorileri kontrolsuz birakmak**
Favori durumunu state'te yonetmeyin; sunucu ile senkronize edin.

**❌ Submenu'suz karmasik hiyerarsiler kurmak**
Derin navigasyon yapilarinda submenu surface kullanmazsaniz kullanici kaybolur.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Klavye:** Tab ile ogeler arasi gezinme, Ok tuslari ile submenu navigasyonu, Enter/Space ile etkinlestirme destekler.

**Rol:** \`role="menubar"\` ve \`role="menuitem"\` ile ARIA menubar pattern'ini uygular.

**Aktif Durum:** Aktif oge \`aria-current="true"\` ile isaretlenir.

**Submenu:** Alt menuler \`aria-expanded\` ile acik/kapali durumu bildirir.

**Arama:** Search alani \`aria-label\` ile erisilebilir sekilde etiketlenir.`,
      },
    ],
    relatedComponents: ["MenuBar", "NavigationRail", "Tabs", "SearchInput"],
  },

  CommandWorkspace: {
    componentName: "CommandWorkspace",
    summary: "CommandWorkspace, arama oncelikli komut yuzeyi, son calisma kuyrugu ve aksiyon odakli sonuc panelini tek sayfa shell icinde birlestiren template recipe'dir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CommandWorkspace, PageLayout uzerine kurulu bir sayfa sablonudur. Search-first is akisi, recent work queue ve action-ready result panelini ayni sayfa icinde bir araya getirir.

\`pageWidth\`, \`stickyHeader\` ve \`responsiveDetailCollapse\` prop'lari ile esneklik saglar. Genis arama ve sonuc paneli icin \`wide\` genislik onerilir.

\`\`\`tsx
<PageLayout
  pageWidth="wide"
  stickyHeader
  title="Komut Merkezi"
  filterBar={<FilterBar />}
  detail={<ResultPanel />}
>
  <RecentWorkQueue />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Arama oncelikli is akisi gerektiren admin panellerinde
- Son calismalar kuyrugunu ve sonuc panelini birlikte gostermek icin
- Hizli komut handoff ve kesfetme gerektiren operasyon ekranlarinda
- Command bar + tablo + detay paneli birlesiminde

**Kullanmayin:**
- Basit CRUD liste sayfalarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard/ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Sticky Search Header]                  │
├──────────────────────────────────────────┤
│  [Recent Work Queue]  │  [Result Panel]  │
│  (main content)       │  (detail rail)   │
│                       │                  │
└──────────────────────────────────────────┘
\`\`\`

1. **Sticky Search Header** — Scroll sirasinda sabit kalan arama ve filtre cubugu
2. **Recent Work Queue** — Son erisilen oge listesi; hizli erisim saglar
3. **Result Panel** — Secilen komutun sonuclarini gosteren detay paneli
4. **Page Shell** — PageLayout ile saglanan responsive sayfa iskeleti`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sticky header kullanin.** Arama cubugu her zaman gorunur olmali; \`stickyHeader: true\` varsayilan degerdir.

**Wide genislik tercih edin.** Arama sonuclari ve detay paneli icin \`pageWidth="wide"\` yeterli alan saglar.

**Recent queue'yu kisa tutun.** Son calismalar listesini 10-15 oge ile sinirlayin.

**Responsive collapse aktif edin.** Kucuk ekranlarda detay paneli otomatik collapse olmali; \`responsiveDetailCollapse: true\` kullanin.

**Sonuc panelinde aksiyon butonlari sunun.** Kullanici sonucu gorup hemen aksiyon alabilmeli.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Arama alanini sticky yapmamak**
Kullanici scroll edince arama erisimini kaybeder; command workspace'in temel deger onerisi zayiflar.

**❌ Dar genislik kullanmak**
\`pageWidth="default"\` ile arama sonuclari ve detay paneli sikisir; \`wide\` veya \`full\` tercih edin.

**❌ Recent queue'yu sinirsiz birakmak**
Cok fazla oge performans ve okunabilirlik sorunlarina yol acar.

**❌ Detay panelini mobilde gizlememek**
Kucuk ekranda iki panel yan yana sikisir; \`responsiveDetailCollapse\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout \`<main>\` ve \`<aside>\` landmark'lari ile icerik bolumlerini ayirir.

**Arama:** Sticky search header \`aria-label\` ile erisilebilir sekilde isaretlenir.

**Klavye:** Tab ile arama, recent queue ve result panel arasinda gezinme desteklenir.

**Responsive:** Collapse durumunda icerik gizlenmez; accordion veya tab ile erisim korunur.

**Focus Yonetimi:** Komut secildikten sonra focus result paneline aktarilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "FilterBar", "SummaryStrip", "TableSimple", "Tabs"],
  },

  CrudTemplate: {
    componentName: "CrudTemplate",
    summary: "CrudTemplate, filtre cubugu, ozet metrikleri ve veri tablosunu tek CRUD shell icinde birlestiren liste ve yonetim sayfasi sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `CrudTemplate, PageLayout uzerine kurulu bir sayfa sablonudur. Filter bar, summary metrics ve data table akisini standart bir CRUD (Create-Read-Update-Delete) shell icinde organize eder.

Farkli filtre modlari (\`search-bar\`, \`search-select\`, \`full-filter-bar\`), yogunluk ayarlari ve detail sidebar destegi sunar.

\`\`\`tsx
<PageLayout
  title="Kullanicilar"
  actions={<Button>Yeni Ekle</Button>}
  filterBar={<FilterBar />}
  contentHeader={<SummaryStrip items={metrics} />}
>
  <TableSimple columns={columns} data={users} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Admin panellerinde kayit listesi ve yonetim ekranlarinda
- Filtre, arama ve toplu islem gerektiren tablo sayfalarinda
- Ozet metrikleri + tablo kombinasyonu gereken CRUD akislarinda
- Kullanici, urun, siparis gibi entity yonetim sayfalarinda

**Kullanmayin:**
- Dashboard veya KPI ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Ayarlar/konfigürasyon sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Breadcrumb]                            │
│  [Title]              [Actions]          │
├──────────────────────────────────────────┤
│  [Filter Bar]                            │
│  [Summary Metrics]                       │
├──────────────────────────────────────────┤
│  [Data Table]         │  [Detail Rail?]  │
│                       │                  │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Baslik, breadcrumb ve aksiyon butonlari
2. **Filter Bar** — Arama, filtre ve siralama kontrolleri
3. **Summary Metrics** — SummaryStrip ile ozet istatistikler
4. **Data Table** — Ana veri tablosu; siralama, secim ve sayfalama destekli
5. **Detail Rail** (opsiyonel) — Secilen kaydin detay paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Summary-first yaklasim benimseyin.** Tablo uzerinde SummaryStrip ile toplam kayit, filtreli sonuc gibi metrikleri gosterin.

**Filter bar'i her zaman saglayin.** CRUD listelerinde arama ve filtreleme temel gereksinimdir.

**Sticky header'i uzun tablolarda etkinlestirin.** \`stickyHeader: true\` ile header ve filtre cubugu scroll sirasinda sabit kalir.

**Detail rail'i ihtiyaca gore kullanin.** Satir tiklandiginda yan panel aciliyorsa \`detail\` prop'u ile ekleyin.

**Tam genislik icin \`wide\` veya \`full\` kullanin.** Admin tablolari icin varsayilan genislik yeterli olmayabilir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Summary metrikleri atlayip direkt tabloya gecmek**
Kullanici toplam kayit sayisini ve filtrelenmis sonuc bilgisini goremez.

**❌ Filtresiz uzun tablo gostermek**
Yuzlerce satir icinde arama yapamayan kullanici kaybolur.

**❌ Detail rail'i mobilde acik birakmak**
Kucuk ekranda tablo ve detay paneli yan yana sikisir; \`responsiveDetailCollapse\` kullanin.

**❌ Tablo aksiyonlarini sadece context menu'ye koymak**
Toplu islemler icin tablo uzerinde gorunur aksiyon butonlari saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout ile \`<main>\` landmark'i otomatik saglanir; tablo \`<table>\` semantigi kullanir.

**Klavye:** Tab ile filtre, tablo ve aksiyonlar arasi gezinme; Ok tuslari ile tablo satirlari arasi navigasyon.

**Arama:** Filter bar'daki arama alani \`aria-label\` ile etiketlenir.

**Secim:** Tablo secim durumu \`aria-selected\` ile bildirilir.

**Sayfalama:** Sayfalama kontrolleri \`aria-label\` ile gorev aciklamasi tasir.`,
      },
    ],
    relatedComponents: ["PageLayout", "FilterBar", "SummaryStrip", "TableSimple"],
  },

  DashboardTemplate: {
    componentName: "DashboardTemplate",
    summary: "DashboardTemplate, KPI strip, ozet kartlari ve dashboard genel bakis bloklarini tek sayfa shell icinde toplayan yonetici dashboard sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DashboardTemplate, PageLayout uzerine kurulu bir executive dashboard sablonudur. KPI strip, summary cards ve overview bloklarini organize ederek metrics-first bir sayfa deneyimi sunar.

Tab destekli ikincil navigasyon, header aksiyonlari ve responsive yogunluk ayarlari icerir.

\`\`\`tsx
<PageLayout
  pageWidth="wide"
  title="Dashboard"
  actions={<DateRangePicker />}
  contentHeader={<SummaryStrip items={kpiMetrics} />}
  secondaryNav={<Tabs items={tabItems} />}
>
  <DashboardCards />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Yonetici ozet ekranlarinda (executive dashboard)
- KPI metrikleri ve ozet kartlarin birlikte gosterildigi sayfalarda
- Tab ile bolunmus coklu dashboard gorunumlerinde
- Operasyonel genel bakis (overview) sayfalarinda

**Kullanmayin:**
- Kayit listesi ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin
- Sadece grafik gerektiren raporlama sayfalarinda — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]              [Actions]          │
├──────────────────────────────────────────┤
│  [KPI / Summary Strip]                   │
│  [Secondary Nav (Tabs)]                  │
├──────────────────────────────────────────┤
│  [Overview Cards / Blocks]               │
│  [Charts / Widgets]                      │
│                       │  [Sidebar?]      │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Dashboard basligi ve tarih filtresi, aksiyonlar
2. **KPI Strip** — SummaryStrip ile temel performans gostergeleri
3. **Secondary Nav** — Tabs ile farkli dashboard gorunumleri arasi gecis
4. **Overview Cards** — Ozet kartlari ve veri bloklari
5. **Sidebar** (opsiyonel) — Ek baglam bilgisi paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Metrics-first yaklasim benimseyin.** KPI strip'i sayfanin en ustunde konumlandirin; kullanici ilk bakista temel metrikleri gormeli.

**Wide genislik kullanin.** Dashboard kartlari icin \`pageWidth="wide"\` yeterli alan saglar.

**Tab ile gorunumleri bolumlendirin.** Cok fazla icerik tek gorunumde sikismak yerine tab'larla organize edilmeli.

**Responsive yigilma test edin.** Kucuk ekranlarda kartlarin dogru sekilde yigildigini dogrulayin.

**Header aksiyonlarini sinirli tutun.** Dashboard header'inda 2-3 aksiyondan fazlasi karmasikliga neden olur.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ KPI strip olmadan dashboard gostermek**
Kullanici sayfaya girdiginde temel metrikleri goremez; dashboard amacini yitirir.

**❌ Cok fazla karti tek gorunumde gostermek**
Scroll gerektiren uzun dashboard'lar kullanici dikkatini dagatir; tab'larla bolumlendirin.

**❌ Dar genislik kullanmak**
\`pageWidth="default"\` ile dashboard kartlari sikisir; \`wide\` onerilir.

**❌ Sidebar'i her zaman acik birakmak**
Dashboard'da ana icerik alani daraltilmamali; sidebar opsiyonel kalmali.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** PageLayout ile \`<main>\` landmark'i saglanir; dashboard kartlari \`<section>\` ile gruplandiririr.

**Klavye:** Tab ile KPI'lar, navigasyon ve kartlar arasi gezinme desteklenir.

**Basliklar:** Her dashboard bolumu \`<h2>\` veya \`<h3>\` ile hiyerarsik baslik tasir.

**Responsive:** Kucuk ekranlarda kartlar tek kolon yigilmaya gecer; icerik kaybolmaz.

**Kontrast:** KPI degerleri ve etiketler WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["PageLayout", "SummaryStrip", "Descriptions", "Tabs"],
  },

  DetailTemplate: {
    componentName: "DetailTemplate",
    summary: "DetailTemplate, entity ozeti, inspector rail ve detay bloklari ile kayit inceleme ekranlari icin standart detay sayfasi sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailTemplate, PageLayout uzerine kurulu bir detay sayfasi sablonudur. Entity summary, inspector rail ve detail blocks ile karar verme veya kayit inceleme ekranlarini standart bir yapiya oturtur.

\`responsiveDetailCollapse\` ve \`responsiveDetailBreakpoint\` prop'lari ile inspector rail kucuk ekranlarda otomatik collapse olabilir.

\`\`\`tsx
<PageLayout
  title="Siparis #1234"
  breadcrumbItems={breadcrumbs}
  actions={<Button>Duzenle</Button>}
  detail={<InspectorRail metadata={orderMeta} />}
  responsiveDetailCollapse
>
  <EntitySummaryBlock entity={order} />
  <Descriptions items={orderDetails} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tek kayit detay sayfalarinda (siparis detayi, kullanici profili, urun detayi)
- Entity ozeti + metadata kombinasyonu gereken ekranlarda
- Karar verme veya onay inceleme akislarinda
- Inspector rail ile ek baglam bilgisi gosterilen sayfalarda

**Kullanmayin:**
- Liste ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard ozet ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Ayarlar sayfalarinda — bunun yerine \`SettingsTemplate\` kullanin
- Coklu entity karsilastirma ekranlarinda — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Breadcrumb]                            │
│  [Entity Title]       [Actions]          │
├──────────────────────────────────────────┤
│  [Entity Summary]     │  [Inspector      │
│  [Detail Blocks]      │   Rail]          │
│  [Descriptions]       │  [Metadata]      │
│                       │  [Status]        │
├──────────────────────────────────────────┤
│  [Footer?]                               │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Breadcrumb, entity basligi ve aksiyon butonlari
2. **Entity Summary** — EntitySummaryBlock ile kaydin ozet bilgileri
3. **Detail Blocks** — Descriptions ve diger icerik bloklari
4. **Inspector Rail** — Yan panel; metadata, durum ve ek baglam bilgisi
5. **Footer** (opsiyonel) — Sticky ozet veya aksiyon cubugu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Summary-to-detail ilerleme saglayin.** Sayfa ustten alta dogru genel bilgiden detaya dogru akmali.

**Inspector rail'i baglam icin kullanin.** Metadata, durum, tarihce gibi yardimci bilgileri yan panelde gosterin.

**Responsive collapse'i etkinlestirin.** \`responsiveDetailCollapse: true\` ile mobilde inspector rail otomatik kapanir.

**Breadcrumb ile geri navigasyon saglayin.** Detay sayfalarindan liste sayfasina donus icin breadcrumb kritiktir.

**Footer'da sticky aksiyonlar sunun.** Uzun detay sayfalarinda "Kaydet" veya "Onayla" butonlari her zaman gorunur olmali.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Inspector rail'i cok genis yapmak**
Ana icerik alani daralir; rail genisligi icerige orantili olmali.

**❌ Entity summary'yi atlayip direkt detaya gecmek**
Kullanici hangi kaydi inceledigini hizla goremez; ozet blogu her zaman olmali.

**❌ Breadcrumb olmadan detay sayfasi gostermek**
Kullanici geri navigasyon yapamaz; breadcrumb zorunludur.

**❌ Responsive collapse'i devre disi birakmak**
Mobilde iki panel yan yana sikisir; \`responsiveDetailCollapse\` kullanin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Ana icerik \`<main>\`, inspector rail \`<aside>\` landmark'i ile ayrilir.

**Breadcrumb:** \`<nav aria-label="breadcrumb">\` ile erisilebilir navigasyon saglanir.

**Klavye:** Tab ile icerik ve inspector rail arasi gecis; aksiyon butonlari Tab ile odaklanabilir.

**Basliklar:** Entity basligi \`<h1>\`, alt bolumler \`<h2>\` ile hiyerarsik yapidadir.

**Responsive:** Collapse durumunda icerik kaybolmaz; accordion veya tab ile erisim korunur.`,
      },
    ],
    relatedComponents: ["PageLayout", "EntitySummaryBlock", "Descriptions", "SummaryStrip"],
  },

  SettingsTemplate: {
    componentName: "SettingsTemplate",
    summary: "SettingsTemplate, bolum tablari, konfigürasyon ozetleri ve policy-aware aside paneli ile ayarlar ekranlari icin standart sablon sunar.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SettingsTemplate, PageLayout uzerine kurulu bir ayarlar sayfasi sablonudur. Section tabs, configuration summaries ve guardrail aside paneli ile ayarlar ekranlarini standart bir yapida sunar.

\`stickyHeader\` varsayilan olarak aktiftir; section tabs ile uzun ayarlar sayfalarinda hizli bolum navigasyonu saglar.

\`\`\`tsx
<PageLayout
  title="Ayarlar"
  stickyHeader
  secondaryNav={<Tabs items={settingSections} />}
  detail={<GuardrailAside policies={activePolicies} />}
>
  <Descriptions items={generalSettings} />
  <SummaryStrip items={configSummary} />
</PageLayout>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Uygulama veya modul ayarlar sayfalarinda
- Tab ile bolumlendirilmis konfigürasyon ekranlarinda
- Policy/guardrail bilgisi gosterilen ayarlar sayfalarinda
- Kullanici tercihleri ve hesap ayarlarinda

**Kullanmayin:**
- Liste ve yonetim ekranlarinda — bunun yerine \`CrudTemplate\` kullanin
- Dashboard ekranlarinda — bunun yerine \`DashboardTemplate\` kullanin
- Tek kayit detay sayfalarinda — bunun yerine \`DetailTemplate\` kullanin
- Form wizard/adim adim akislarda — ozel wizard biliseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]              [Actions]          │
│  [Section Tabs]                          │
├──────────────────────────────────────────┤
│  [Configuration       │  [Guardrail     │
│   Summaries]          │   Aside]        │
│  [Settings Groups]    │  [Policy Info]  │
│  [Descriptions]       │                 │
└──────────────────────────────────────────┘
\`\`\`

1. **Header** — Ayarlar basligi ve kaydetme/iptal aksiyonlari
2. **Section Tabs** — Ayarlar bolumleri arasi navigasyon tab'lari
3. **Configuration Summaries** — Mevcut konfigürasyon durumunu ozetleyen strip
4. **Settings Groups** — Descriptions ile gruplanmis ayarlar
5. **Guardrail Aside** (opsiyonel) — Policy ve kisitlama bilgileri paneli`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sticky header kullanin.** \`stickyHeader: true\` ile section tabs scroll sirasinda gorunur kalir; uzun ayarlar sayfalarinda kritik.

**Tab'larla bolumlendirin.** Tum ayarlari tek sayfaya koymak yerine mantiksal gruplara ayirin (Genel, Bildirimler, Guvenlik vb.).

**Configuration summary saglayin.** Mevcut ayarlar durumunu SummaryStrip ile ozetleyin; kullanici hizla mevcut durumu gorsun.

**Guardrail aside ile policy bilgisi gosterin.** Kisitlamalar ve kurallar yan panelde gorunur olmali.

**Kaydedilmemis degisiklikleri uyarin.** Sayfa terk edilirken kaydedilmemis degisiklik varsa kullaniciya uyari gosterin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tum ayarlari tek uzun sayfada gostermek**
Tab ile bolumlendirme yapilmazsa kullanici istenen ayari bulmakta zorlanir.

**❌ Sticky header'i devre disi birakmak**
Section tabs gorunmez olur ve kullanici baska bolume gecmek icin sayfanin basina scroll etmek zorunda kalir.

**❌ Kaydetme butonunu sadece sayfanin altina koymak**
Uzun sayfalarda kullanici kaydetme butonunu gormeyebilir; sticky footer veya header'da aksiyon saglayin.

**❌ Guardrail bilgisini gizlemek**
Policy kisitlamalari kullaniciya gorunmezse neden bazi ayarlarin degistirelemedigini anlayamaz.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Ana icerik \`<main>\`, guardrail aside \`<aside>\` landmark'i ile ayrilir.

**Tab Navigasyonu:** Section tabs \`role="tablist"\` ve \`role="tab"\` ile ARIA tab pattern'ini uygular.

**Klavye:** Tab ile bolumler arasi gecis, form alanlari arasi navigasyon desteklenir.

**Form Erisilebilirligi:** Tum ayar alanlari \`<label>\` ile iliskilendirilmis olmali; hata mesajlari \`aria-describedby\` ile baglenir.

**Durum Bildirimi:** Ayar kaydedildiginde basarili/hata durumu \`aria-live\` ile ekran okuyuculara bildirilir.`,
      },
    ],
    relatedComponents: ["PageLayout", "Tabs", "Descriptions", "SummaryStrip"],
  },

  ThemePresetCompare: {
    componentName: "ThemePresetCompare",
    summary: "ThemePresetCompare, iki tema preset'ini appearance, density, contrast ve intent eksenlerinde yan yana karsilastiran bileskendir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePresetCompare, iki ThemePresetGalleryItem'i karsilastirma matrisinde yan yana gosterir. Her preset icin ThemePreviewCard onizlemesi ve konfigurasyon eksenlerindeki farklari tablo formatinda sunar.

\`axes\` prop'u ile hangi eksenlerin karsilastirilacagi belirlenir. Access control destegi ile readonly veya disabled modda kullanilabilir.

\`\`\`tsx
<ThemePresetCompare
  leftPreset={presetA}
  rightPreset={presetB}
  axes={["appearance", "density", "intent", "contrast"]}
  title="Tema Karsilastirmasi"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Iki tema preset'ini detayli karsilastirmak icin
- Tema secimi oncesinde farklari gorsel olarak incelemek icin
- Design lab veya tema yonetim sayfalarinda
- Appearance, density ve contrast farklarini acikca gostermek icin

**Kullanmayin:**
- Tek preset goruntuleme icin — bunun yerine \`ThemePreviewCard\` kullanin
- Preset galerisi/listesi icin — bunun yerine \`ThemePresetGallery\` kullanin
- Ucten fazla preset karsilastirmasi icin — ozel layout olusturun`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]                                 │
│  [Description]                           │
├────────────────────┬─────────────────────┤
│  [Left Preset]     │  [Comparison Table] │
│  [Preview Card]    │  Axis | Left | Right│
│  [Right Preset]    │  ─────┼──────┼──────│
│  [Preview Card]    │  mode │  ... │ ...  │
│                    │  dens │  ... │ ...  │
└────────────────────┴─────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** — Karsilastirma amacini tanimlayan metin
2. **Sol Preset** — ThemePreviewCard ile sol preset onizlemesi ve etiketi
3. **Sag Preset** — ThemePreviewCard ile sag preset onizlemesi ve etiketi
4. **Karsilastirma Tablosu** — Eksen bazinda deger karsilastirma matrisi
5. **Empty State** — Iki preset secilmediginde bos durum bildirimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Her iki preset'i de saglayin.** \`leftPreset\` veya \`rightPreset\` eksik olursa bos durum gosterilir.

**Anlamli eksenler secin.** Varsayilan \`["appearance", "density", "intent", "contrast"]\` cogu senaryo icin yeterlidir.

**Aciklayici baslik kullanin.** \`title\` ve \`description\` ile kullaniciya neden bu karsilastirmayi yaptigini anlamlandirin.

**Access control uygulayin.** Sadece goruntuleme gerektiren durumlarda \`access="readonly"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tek preset ile karsilastirma gostermek**
Bos preset bos durum tetikler; her iki preset de saglanmali.

**❌ Cok fazla eksen eklemek**
Karsilastirma tablosu okunaksiz hale gelir; 4-6 eksen ideal.

**❌ Karsilastirmayi aciklama olmadan gostermek**
Kullanici hangi presetleri neden karsilastirdigini anlamali; baslik ve aciklama ekleyin.

**❌ Access state'i gormezden gelmek**
\`hidden\` durumda bilesen render edilmemeli; access control prop'larini iletin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; \`data-component="theme-preset-compare"\` ile tanimlanir.

**Karsilastirma Tablosu:** Grid yapisi ile eksen etiketleri ve degerler okunabilir sekilde sunulur.

**Access State:** \`data-access-state\` attribute'u ile erisim durumu bildirilir; \`title\` ile neden bilgisi saglanir.

**Bos Durum:** Empty bileseni ile preset eksik oldugunda erisilebilir geri bildirim verilir.

**Kontrast:** Tum metin ve etiketler WCAG 2.1 AA kontrast gereksinimlerini karsilar.`,
      },
    ],
    relatedComponents: ["ThemePresetGallery", "ThemePreviewCard", "Empty", "Text"],
  },

  ThemePresetGallery: {
    componentName: "ThemePresetGallery",
    summary: "ThemePresetGallery, tema preset koleksiyonunu gorsel onizleme kartlari ve metadata ile listeleyen ve secim yapmayi saglayan galeri bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePresetGallery, tema presetlerini grid layout icinde ThemePreviewCard onizlemeleri ile sunar. Her preset icin mode, appearance, density ve contrast bilgilerini gosterir.

Kontrollü ve kontrolsuz secim modlarini destekler. Badge'ler ile default ve high contrast presetleri vurgular. Access control ile readonly veya disabled mod saglar.

\`\`\`tsx
<ThemePresetGallery
  presets={presetList}
  selectedPresetId="dark-compact"
  onSelectPreset={(id, preset) => handleSelect(id)}
  title="Tema Presetleri"
  compareAxes={["Appearance", "Density"]}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tema preset koleksiyonunu gorsel olarak listelemek icin
- Kullanicinin preset secimi yapmasi gereken ekranlarda
- Design lab veya tema yonetim sayfalarinda
- Preset ozelliklerini (mode, appearance, density) gorsel olarak gostermek icin

**Kullanmayin:**
- Iki preset karsilastirmasi icin — bunun yerine \`ThemePresetCompare\` kullanin
- Tek tema onizlemesi icin — bunun yerine \`ThemePreviewCard\` kullanin
- Tema ayarlarini duzenlemek icin — bunun yerine form bilisenleri kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│  [Title]                                 │
│  [Description]                           │
│  [Compare Axes Badges]                   │
├──────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ │
│  │ [Preview Card]  │ │ [Preview Card]  │ │
│  │ [Label] [Badges]│ │ [Label] [Badges]│ │
│  │ Mode|Appearance │ │ Mode|Appearance │ │
│  │ Density|Contrast│ │ Density|Contrast│ │
│  └─────────────────┘ └─────────────────┘ │
└──────────────────────────────────────────┘
\`\`\`

1. **Baslik ve Aciklama** — Galeri baslik ve tanim metni
2. **Compare Axes** — Badge ile gosterilen karsilastirma eksenleri
3. **Preset Kartlari** — Her biri ThemePreviewCard, etiket, badge'ler ve metadata icerirler
4. **Metadata Grid** — Mode, Appearance, Density, Contrast bilgi kutulari
5. **Empty State** — Preset bulunamadiginda bos durum gosterimi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Kontrollü mod kullanin.** \`selectedPresetId\` ve \`onSelectPreset\` ile secim durumunu ust bilesende yonetin.

**Preset metadata'sini eksiksiz saglayin.** \`themeMode\`, \`appearance\`, \`density\` ve \`isHighContrast\` alanlari dolu olmali.

**Default preset'i isaretleyin.** \`isDefaultMode: true\` ile varsayilan preset badge ile vurgulanir.

**Compare axes kullanin.** \`compareAxes\` prop'u ile kullaniciya presetler arasi farklarin hangi eksenlerde oldugunu gosterin.

**Access control uygulayin.** Sadece goruntuleme gerekiyorsa \`access="readonly"\` kullanin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Metadata'siz preset listesi gostermek**
Kullanici presetler arasindaki farklari goremez; mode, appearance ve density bilgileri olmali.

**❌ Cok fazla preset'i tek sayfada gostermek**
10'dan fazla preset kullaniciyi bunaltir; gruplama veya filtreleme ekleyin.

**❌ Secim geri bildirimini atlayip gecmek**
Secilen preset gorsel olarak vurgulanmali; \`aria-current\` ile isaretlenmeli.

**❌ Bos durum mesajini ozellestirmemek**
Varsayilan bos durum mesaji yerine baglamina uygun bir mesaj saglayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elemani ile sarili; \`data-component="theme-preset-gallery"\` ile tanimlanir.

**Secim:** Secilen preset \`aria-current="true"\` ile isaretlenir; ekran okuyuculara aktif secim bildirilir.

**Klavye:** Preset butonlari Tab ile odaklanabilir, Enter/Space ile secilebilir.

**Disabled Durum:** \`access="disabled"\` veya \`"readonly"\` durumda butonlar tiklanamaz; gorsel olarak belirtilir.

**Bos Durum:** Empty bileseni ile preset bulunamadiginda erisilebilir geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["ThemePresetCompare", "ThemePreviewCard", "Badge", "Empty"],
  },

  ThemePreviewCard: {
    componentName: "ThemePreviewCard",
    summary: "ThemePreviewCard, bir tema preset'inin minyatur gorsel onizlemesini sunan swatch kartidir. Tema secim arayuzlerinde preset gorsellerini temsil eder.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ThemePreviewCard, mevcut temanin gorsel ozelliklerini (renkler, yuzeyler, tipografi) minyatur bir kart icinde yansitir. Tema tokenlarini (\`--surface-default\`, \`--action-primary\`, \`--text-primary\` vb.) kullanarak canli onizleme saglar.

\`selected\` durumunda onay isareti ve vurgu kenarligi gosterir. \`localeText\` ile tum metin etiketleri lokalize edilebilir.

\`\`\`tsx
<ThemePreviewCard selected />
<ThemePreviewCard
  localeText={{
    titleText: "Baslik metni",
    secondaryText: "Ikincil metin",
    saveLabel: "Kaydet",
    selectedLabel: "Secili tema onizlemesi",
  }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tema secim arayuzlerinde preset onizlemesi olarak
- ThemePresetGallery icinde preset gorseli olarak
- ThemePresetCompare icinde karsilastirma gorseli olarak
- Tema yonetim sayfalarinda kucuk tema swatch'i olarak

**Kullanmayin:**
- Tam boyutlu tema onizlemesi icin — bunun yerine canli preview kullanin
- Renk paleti gosterimi icin — bunun yerine ozel swatch biliseni kullanin
- Dekoratif gorsel olarak — bunun yerine uygun gorsel biliseni kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────┐
│  [✓ Selected Badge?]    (sag ust)
│  ┌──────────────────────┐    │
│  │  [Navbar Placeholder]│    │
│  │  [Title Text]        │    │
│  │  [Secondary Text]    │    │
│  │         [Save Button]│    │
│  └──────────────────────┘    │
│  [Progress Bar Placeholder]  │
└──────────────────────────────┘
\`\`\`

1. **Container** — Rounded border, tema yuzey rengi arkaplan
2. **Selected Badge** — Secili durumda sag ustte onay isareti
3. **Inner Surface** — Muted yuzey uzerinde minyatur UI elemanlari
4. **Title / Secondary Text** — Tema tipografi ve renk tokenlarini yansitan metinler
5. **Save Button** — Primary action renk tokenini gosteren minyatur buton
6. **Progress Bar** — Muted yuzey rengini gosteren placeholder cubuk`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Tema tokenlari ile canli onizleme saglayin.** Kart, CSS custom property'leri kullanarak aktif temanin gorselini canli yansitir.

**\`localeText\` ile lokalize edin.** Farkli diller icin tum metin etiketlerini \`localeText\` prop'u ile saglayin.

**\`selected\` durumunu dogru yonetin.** Secili preset gorsel olarak vurgulanmali; onay isareti ekran okuyuculara bildirilmeli.

**Kucuk boyutda kullanin.** ThemePreviewCard minyatur onizleme icin tasarlanmistir; buyuk boyutlarda kullanmayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Tema tokenlari disinda sabit renkler kullanmak**
Kart tema degistiginde guncellenmelidir; sabit renkler canli onizlemeyi bozar.

**❌ \`selectedLabel\` saglamadan \`selected\` kullanmak**
Ekran okuyuculari secili durumu goremez; \`localeText.selectedLabel\` ile erisilebilirlik saglayin.

**❌ Buyuk boyutlarda kullanmak**
ThemePreviewCard minyatur onizleme icindir; tam boyutlu tema onizlemesi icin ozel bilesen kullanin.

**❌ Tiklanabilir yapmak icin direkt onClick eklemek**
ThemePreviewCard'i ThemePresetGallery icinde kullanin; galeri secim mantigi ile tiklanabilirlik saglanir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Secili Durum:** \`selected\` aktifken onay isareti \`aria-hidden="true"\` ile gizlenir ve \`sr-only\` metin ile ekran okuyuculara bildirilir.

**Kontrast:** Tema tokenlari ile render edildigi icin kontrast aktif temanin token degerlerine baglidir.

**Dekoratif Ogeler:** Progress bar ve navbar placeholder'lari dekoratiftir; ek ARIA isaretleme gerektirmez.

**Lokalizasyon:** \`localeText\` ile tum metin etiketleri lokalize edilebilir; farkli dillerde erisilebilirlik korunur.`,
      },
    ],
    relatedComponents: ["ThemePresetGallery", "ThemePresetCompare"],
  },

  AgGridServer: {
    componentName: "AgGridServer",
    summary: "AgGridServer, sunucu tarafli veri kaynagi ile calisarak buyuk veri kumelerini sayfa sayfa yukleyen AG Grid tabanli veri tablosu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AgGridServer, AG Grid Community/Enterprise altyapisini kullanarak **sunucu tarafli veri modeli** (Server-Side Row Model) ile buyuk veri kumelerini verimli sekilde goruntuleyen bir veri tablosu bilesenidir. Temel yetenekleri:

- **Server-side data fetching** — \`getData\` callback'i ile sayfa sayfa veri cekme
- **Column definitions** — \`columnDefs\` ile esnek sutun tanimlari ve gruplama
- **Grid options** — AG Grid'in tum yapilandirma secenekleri \`gridOptions\` ile desteklenir
- **Mesajlasma** — \`messages.loadingLabel\` ile yerellestirilmis yukleniyor metni

\`\`\`tsx
import { AgGridServer } from '@mfe/design-system';

<AgGridServer
  columnDefs={[
    { field: "ad", headerName: "Ad" },
    { field: "email", headerName: "E-posta" },
    { field: "rol", headerName: "Rol" },
  ]}
  getData={async (request) => {
    const res = await fetchUsers(request);
    return { rows: res.data, total: res.total };
  }}
  height={500}
  messages={{ loadingLabel: "Veriler yukleniyor..." }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Binlerce veya milyonlarca satir iceren buyuk veri kumelerini goruntulemek icin
- Sunucu tarafli siralama, filtreleme ve sayfalama gerektiren senaryolarda
- API'den sayfa sayfa veri cekilmesi gereken listeleme ekranlarinda
- Performansin kritik oldugu veri yogun panellerde

**Kullanmayin:**
- Kucuk ve statik veri kumeleri icin — bunun yerine \`TableSimple\` kullanin
- Istemci tarafinda filtreleme ve siralama yeterli oldugunda — bunun yerine \`EntityGridTemplate\` (client modu) kullanin
- Basit liste gorunumu icin — bunun yerine \`List\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│  [Column Header] [Column Header] [Column Header] │
│  ─────────────────────────────────────────────── │
│  row 1 data      data            data             │
│  row 2 data      data            data             │
│  ...             ...             ...              │
│  ─────────────────────────────────────────────── │
│  [Loading indicator / Pagination]                 │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Grid Container** — Belirtilen \`height\` ile boyutlandirilan ana kapsayici
2. **Column Headers** — \`columnDefs\` ile tanimlanan sutun basliklari; siralama ve filtreleme destegi
3. **Row Data** — \`getData\` callback'i ile sunucudan cekilen satir verileri
4. **Loading State** — Veri cekilirken gosterilen yukleniyor gostergesi
5. **Default Col Def** — \`defaultColDef\` ile tum sutunlara uygulanan varsayilan ayarlar`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`getData\` callback'ini optimize edin.** Sunucu isteklerini minimize etmek icin debounce veya cache stratejisi kullanin.

**\`defaultColDef\` ile ortak ayarlari merkezilestirin.** Her sutunda tekrar etmek yerine varsayilan siralama, filtreleme ve boyutlandirma ayarlarini bir kez tanimlayin.

**\`height\` prop'unu icerige uygun secin.** Sayfanin genel duzeniyle uyumlu sabit veya dinamik yukseklik kullanin.

**\`messages\` ile yerellestirilmis metinler saglayin.** \`loadingLabel\` gibi mesajlari kullanicinin diline uygun tanimlayin.

**Column group'lari ile karmasik sutunlari organize edin.** \`ColGroupDef\` kullanarak iliskili sutunlari mantiksal olarak gruplayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Kucuk veri kumeleri icin sunucu tarafli model kullanmak**
100'den az satir icin istemci tarafli \`TableSimple\` veya \`EntityGridTemplate\` daha uygun ve basittir.

**❌ \`getData\` icinde gereksiz API cagirilari yapmak**
Her siralama/filtreleme degisikliginde tam veri cekimi performans sorunlarina yol acar. Sunucu tarafinda uygun sayfalama yapin.

**❌ Sabit yukseklik vermeden kullanmak**
AG Grid yukseklik belirtilmeden dogru render edemez. Her zaman \`height\` prop'unu belirtin.

**❌ \`gridOptions\` ile asiri yapilandirma**
Tum AG Grid ozelliklerini acmak karmasiklik yaratir. Yalnizca ihtiyac duyulan ozellikleri etkinlestirin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** AG Grid, \`role="grid"\` ile tablo semantigini otomatik saglar. Sutun basliklari \`role="columnheader"\` ile tanimlanir.

**Klavye Navigasyonu:** Ok tuslari ile hucreler arasi gecis. Enter ile hucre duzenleme. Tab ile grid disina cikis.

**Ekran Okuyucu:** AG Grid dahili ARIA ozellikleri ile hucre iceriklerini, siralama durumunu ve filtreleme bilgisini duyurur.

**Yukleniyor Durumu:** \`messages.loadingLabel\` ile yukleniyor metni ekran okuyuculara bildirilir.

**Buyuk Veri:** Sanal kaydirma (virtual scrolling) ile yalnizca gorunen satirlar DOM'da yer alir; bu hem performansi hem erisilebilirlik agacini iyilestirir.`,
      },
    ],
    relatedComponents: ["EntityGridTemplate", "TableSimple", "TreeTable"],
  },

  EntityGridTemplate: {
    componentName: "EntityGridTemplate",
    summary: "EntityGridTemplate, AG Grid ustune toolbar, sayfalama, varyant yonetimi, tema secimi ve disa aktarma yetenekleri ekleyen kapsamli veri tablosu sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EntityGridTemplate, AG Grid altyapisini kullanarak **tam donanimli bir veri tablosu deneyimi** sunan sablon bilesenidir. Icerisinde toolbar, hizli filtre, tema secimi, yogunluk ayari, varyant yonetimi, disa aktarma ve sayfalama gibi ozellikler hazir olarak gelir.

- **Grid Variant Management** — Kullanicilarin grid durumunu (kolon sirasi, filtreler) kaydetmesi ve yuklemesi
- **Quick Filter** — Toolbar'da anlik metin arama
- **Theme & Density** — Quartz, Balham, Alpine gibi temalar ve compact/comfortable yogunluk
- **Export** — Excel ve CSV disa aktarma destegi
- **Server/Client Mode** — \`dataSourceMode\` ile sunucu veya istemci tarafli veri modeli

\`\`\`tsx
import { EntityGridTemplate } from '@mfe/design-system';

<EntityGridTemplate
  gridId="kullanici-listesi"
  gridSchemaVersion={1}
  columnDefs={[
    { field: "ad", headerName: "Ad Soyad" },
    { field: "email", headerName: "E-posta" },
    { field: "durum", headerName: "Durum" },
  ]}
  rowData={users}
  total={totalCount}
  page={currentPage}
  pageSize={20}
  onPageChange={(page, size) => fetchPage(page, size)}
  exportConfig={{ fileBaseName: "kullanicilar" }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Karmasik veri tablolari icin tam donanimli grid deneyimi gerektiren ekranlarda
- Kolon siralama, filtreleme, gruplama ve disa aktarma gereken listeleme sayfalarinda
- Kullanicilarin grid gorunumunu kisisellestirmesi (varyant kaydetme) gereken senaryolarda
- Sayfalama ile buyuk veri kumeleri gosterilecek entity listeleme ekranlarinda

**Kullanmayin:**
- Basit ve statik tablolar icin — bunun yerine \`TableSimple\` kullanin
- Salt okunur ozet tablo icin — bunun yerine \`Descriptions\` kullanin
- Hiyerarsik veri icin — bunun yerine \`TreeTable\` kullanin
- Yalnizca sunucu tarafli minimal grid icin — bunun yerine \`AgGridServer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────┐
│ Toolbar: [Quick Filter] [Theme] [Density] [Variants] [Export] [Extras?] │
│ ──────────────────────────────────────────────────────── │
│  [Column Headers with sort/filter indicators]            │
│  ────────────────────────────────────────────            │
│  Row 1 ...                                               │
│  Row 2 ...                                               │
│  ...                                                     │
│ ──────────────────────────────────────────────────────── │
│ Footer: [Page Size] [Record Count] [< 1 2 3 ... >]      │
└──────────────────────────────────────────────────────────┘
\`\`\`

1. **Toolbar** — Hizli filtre, tema, yogunluk, varyant secici, disa aktarma butonlari ve \`toolbarExtras\` slot'u
2. **Grid Area** — AG Grid ile render edilen kolon basliklari ve satir verileri
3. **Column Headers** — Siralama, filtreleme ve yeniden boyutlandirma destegi
4. **Row Data** — Istemci veya sunucu modunda yuklenen veri satirlari
5. **Footer / Pagination** — Sayfa boyutu, toplam kayit sayisi ve sayfa navigasyonu
6. **Variant Manager** — Grid durumunu kaydetme, yukleme ve yonetme modali`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`gridId\` ve \`gridSchemaVersion\` benzersiz tanimlayin.** Varyant kaydetme ve state persistance icin her grid'in benzersiz kimlige ihtiyaci vardir. Schema degistiginde versiyonu artirin.

**\`exportConfig\` ile anlamli dosya adi verin.** \`fileBaseName\` alanini icerikle iliskili sekilde tanimlayin (ornegin "musteri-listesi").

**\`defaultColDef\` ile ortak kolon davranislarini merkezilestirin.** Siralama, yeniden boyutlandirma ve filtre ayarlarini tek noktadan yonetin.

**\`toolbarExtras\` ile ozel kontroller ekleyin.** Toolbar'a ek butonlar veya filtreler eklemek icin bu slot'u kullanin.

**\`messages\` ile tum metinleri yerelselestirin.** 80'den fazla mesaj anahtari ile tam yerelselestirme destegi saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`gridSchemaVersion\` guncellememek**
Kolon tanimlari degistiginde eski varyantlar bozulur. Schema her degistiginde versiyonu artirin.

**❌ Kucuk ve degismeyen veriler icin EntityGridTemplate kullanmak**
5-10 satirlik statik veriler icin \`TableSimple\` cok daha hafif ve uygun bir secimdir.

**❌ \`gridOptions\` ile tum AG Grid ozelliklerini acmak**
Kullanilmayan ozellikleri etkinlestirmek performansi dusurup kullanici deneyimini karistirabilir.

**❌ Sayfalama olmadan buyuk veri kumesi yuklemek**
\`page\` ve \`pageSize\` prop'lari olmadan binlerce satir yuklemek tarayici performansini olumsuz etkiler.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** AG Grid'in dahili \`role="grid"\` semantigi miras alinir. Toolbar elemanlari uygun ARIA etiketleri ile tanimlanir.

**Klavye:** Grid icinde ok tuslari ile hucre navigasyonu. Toolbar'da Tab ile kontroller arasi gecis. Enter/Space ile buton etkinlestirme.

**Quick Filter:** Arama alani \`aria-label\` ile tanimlanir ve anlik sonuc sayisi ekran okuyucuya bildirilir.

**Sayfalama:** Sayfa navigasyon butonlari \`aria-label\` ile tanimlanir (\`firstPageLabel\`, \`nextPageLabel\` vb.).

**Disa Aktarma:** Export butonlari aciklayici etiketler tasir ve klavye ile erisilebilirdir.

**Yogunluk ve Tema:** Ayar degisiklikleri gorsel olarak aninda yansir ve ekran okuyucuya bildirilir.`,
      },
    ],
    relatedComponents: ["AgGridServer", "TableSimple", "TreeTable", "FilterBar"],
  },

  TableSimple: {
    componentName: "TableSimple",
    summary: "TableSimple, statik ve kucuk veri kumeleri icin hafif, semantik HTML tablo bilesenidir. Erisim kontrolu, yogunluk ayari ve yukleniyor durumu destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TableSimple, native \`<table>\` elementini kullanarak **hafif ve semantik** bir tablo deneyimi sunan bilesendir. AG Grid bagimliligi olmadan basit veri goruntulemesi icin ideal bir secimdir.

- **Kolon tanimlari** — \`columns\` ile accessor, render, hizalama ve vurgulama destegi
- **Yogunluk** — \`comfortable\` ve \`compact\` modlari
- **Zebra satirlar** — \`striped\` ile alternatif satir renklendirmesi
- **Sticky header** — \`stickyHeader\` ile kaydirmada sabit baslik
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri

\`\`\`tsx
import { TableSimple } from '@mfe/design-system';

<TableSimple
  caption="Son Islemler"
  description="Son 30 gundeki islem gecmisi"
  columns={[
    { key: "tarih", label: "Tarih", emphasis: true },
    { key: "aciklama", label: "Aciklama" },
    { key: "tutar", label: "Tutar", align: "right" },
  ]}
  rows={transactions}
  density="compact"
  striped
  stickyHeader
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- 100'den az satirlik statik veya az degisen veri kumeleri icin
- Basit listeleme tablolari (son islemler, ozet bilgiler vb.) icin
- Siralama ve filtreleme gerekmeyen salt okunur tablolar icin
- Hafif ve hizli render gereken durumlarda

**Kullanmayin:**
- Buyuk veri kumeleri icin — bunun yerine \`AgGridServer\` veya \`EntityGridTemplate\` kullanin
- Siralama, filtreleme veya kolon yeniden siralama gerektiren tablolar icin — bunun yerine \`EntityGridTemplate\` kullanin
- Hiyerarsik veri icin — bunun yerine \`TreeTable\` kullanin
- Anahtar-deger cift gorunumu icin — bunun yerine \`Descriptions\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│ Caption (opsiyonel)                      │
│ Description (opsiyonel)                  │
│ ┌──────────────────────────────────────┐ │
│ │ [TH: Tarih] [TH: Aciklama] [TH: Tutar] │
│ │ ──────────────────────────────────── │ │
│ │  2024-01-15  Odeme alindi     150 TL │ │
│ │  2024-01-14  Fatura           200 TL │ │
│ │  2024-01-13  Iade              50 TL │ │
│ └──────────────────────────────────────┘ │
│ [Empty State — kayit yoksa]              │
└──────────────────────────────────────────┘
\`\`\`

1. **Caption** — Tablo basligi (opsiyonel)
2. **Description** — Tablo aciklamasi (opsiyonel)
3. **Table Container** — Yuvarlatilmis kenarli, golge ve border ile sarili alan
4. **Column Headers** (\`<th>\`) — Uppercase, tracking ile stilize edilmis basliklar
5. **Table Body** — Zebra satir destegi ile veri satirlari
6. **Empty State** — Kayit yoksa \`Empty\` bileseni ile bos durum gosterimi
7. **Loading State** — \`Skeleton\` satirlari ile yukleniyor animasyonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`caption\` ve \`description\` ile baglam saglayin.** Tablonun ne gosterdigi hakkinda kullaniciya acik bilgi verin.

**\`getRowKey\` ile benzersiz satir anahtari saglayin.** React renderlamasi icin satir indeksi yerine anlamli bir anahtar kullanin.

**\`emphasis\` ile onemli kolonlari vurgulayin.** Birincil veri kolonu (isim, baslik vb.) icin \`emphasis: true\` kullanin.

**\`density="compact"\` ile yogun arayuzlerde kullanin.** Dashboard veya yan panel tablolarinda kompakt yogunluk tercih edin.

**\`truncate\` ile uzun metinleri kesin.** Aciklama gibi degisken uzunluktaki kolonlarda \`truncate: true\` ile tasmayi onleyin.

**\`localeText\` ile yerellestirilmis bos durum mesaji verin.** Bos tablo gosterildiginde anlamli bir mesaj sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Buyuk veri kumeleri icin TableSimple kullanmak**
Yuzlerce satir DOM performansini dusurur. AG Grid tabanli bilesenler sanal kaydirma saglar.

**❌ \`getRowKey\` vermeden dinamik veriler gostermek**
React, satir indeksini anahtar olarak kullandiginda guncelleme sorunlari yasanabilir.

**❌ \`caption\` olmadan bagimsiz tablo kullanmak**
Ekran okuyucular tablonun amacini anlayamaz. En azindan \`caption\` veya \`aria-label\` saglayin.

**❌ Tum kolonlara \`emphasis\` vermek**
Her kolon vurgulandiginda hicbiri one cikmaz. Yalnizca birincil veri kolonunu vurgulayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Native \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th scope="col">\` elementleri kullanilir. Tam semantik tablo yapisi saglanir.

**Caption:** \`caption\` prop'u tablo amacini tanimlar ve ekran okuyucular tarafindan duyurulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. \`accessReason\` ile tooltip aciklamasi saglanir.

**Sticky Header:** \`stickyHeader\` aktifken basliklar her zaman gorunurdur ve baglam kaybi onlenir.

**Bos Durum:** Kayit yokken \`Empty\` bileseni goruntulenir ve ekran okuyucuya aciklama sunulur.

**Yukleniyor:** \`loading\` durumunda \`Skeleton\` satirlari render edilir ve gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["EntityGridTemplate", "AgGridServer", "TreeTable", "Descriptions", "List"],
  },

  EntitySummaryBlock: {
    componentName: "EntitySummaryBlock",
    summary: "EntitySummaryBlock, avatar, baslik, alt baslik, badge ve anahtar-deger ciftleri ile bir varligin ozet bilgilerini goruntuleyen kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EntitySummaryBlock, bir varligin (kullanici, musteri, urun vb.) ozet bilgilerini **premium gorunumlu kart** icerisinde sunan bilesendir. Avatar, baslik, alt baslik, badge, aksiyon butonlari ve anahtar-deger ciftleri tek bir blokta birlestirilir.

- **Avatar** — Varlik gorseli, isim bas harfleri veya fallback ikon destegi
- **Title & Subtitle** — Ana baslik ve destekleyici alt baslik
- **Badge** — Durum veya kategori gostergesi
- **Actions** — Sag ust kosede aksiyon butonlari slot'u
- **Descriptions** — \`items\` ile anahtar-deger ciftleri (Descriptions bileseni kullanilir)

\`\`\`tsx
import { EntitySummaryBlock } from '@mfe/design-system';

<EntitySummaryBlock
  title="Ahmet Yilmaz"
  subtitle="Yazilim Muhendisi — Istanbul"
  avatar={{ name: "Ahmet Yilmaz", src: "/avatars/ahmet.jpg" }}
  badge={<Badge variant="success">Aktif</Badge>}
  actions={<Button size="sm" variant="secondary">Duzenle</Button>}
  items={[
    { label: "E-posta", value: "ahmet@ornek.com" },
    { label: "Telefon", value: "+90 555 123 4567" },
    { label: "Departman", value: "Muhendislik" },
    { label: "Baslangic", value: "15 Ocak 2023" },
  ]}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfasinin ust kisminda varlik ozet bilgisi gostermek icin
- Musteri, caliskan, urun gibi varliklarin profil kartini olusturmak icin
- Avatar, baslik ve anahtar-deger ciftlerini tek blokta birlestirmek icin
- Dashboard'larda onemli varliklarin ozet gorunumlerinde

**Kullanmayin:**
- Uzun form detaylari icin — bunun yerine \`Descriptions\` kullanin
- Navigasyon karti olarak — bunun yerine \`Card\` kullanin
- Coklu varliklari liste halinde gostermek icin — bunun yerine \`List\` kullanin
- Basit istatistik gosterimi icin — bunun yerine \`SummaryStrip\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────────────┐
│  ┌────┐  Ahmet Yilmaz  [Aktif]      [Duzenle]     │
│  │ AY │  Yazilim Muhendisi — Istanbul              │
│  └────┘                                            │
│  ───────────────────────────────────────────────── │
│  E-posta:    ahmet@ornek.com                       │
│  Telefon:    +90 555 123 4567                      │
│  Departman:  Muhendislik                           │
│  Baslangic:  15 Ocak 2023                          │
└────────────────────────────────────────────────────┘
\`\`\`

1. **Premium Surface** — Yuvarlatilmis kenarlar, gradyan arka plan, golge ve parlak ust cizgi
2. **Avatar** (opsiyonel) — XL boyutlu Avatar bileseni; gorsel, bas harf veya fallback ikon
3. **Title** — Varlik adi veya birincil tanimlayici
4. **Badge** (opsiyonel) — Durum veya kategori etiketi
5. **Subtitle** (opsiyonel) — Destekleyici ek bilgi
6. **Actions Slot** (opsiyonel) — Sag ust kosede buton veya kontroller
7. **Descriptions** — Ayirici cizgi altinda anahtar-deger ciftleri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`avatar\` ile gorsel kimliklendirme saglayin.** Kullanici varliklari icin profil resmi veya bas harfler; diger varliklar icin ikon kullanin.

**\`items\` sayisini makul tutun.** 4-8 anahtar-deger cifti ideal bir ozet saglar. Daha fazla bilgi icin detay sekmelerine yonlendirin.

**\`badge\` ile durum bilgisi verin.** Aktif/Pasif, Onaylandi/Beklemede gibi durum bilgilerini badge ile gosterin.

**\`actions\` slot'unu sade tutun.** En fazla 1-2 birincil aksiyon butonu yeterlidir. Daha fazla aksiyon icin dropdown menu kullanin.

**\`access\` prop'u ile erisim kontrolu saglayin.** Yetkisiz kullanicilara \`readonly\` veya \`hidden\` mod ile uygun gosterim yapin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla anahtar-deger cifti eklemek**
10'dan fazla oge gorsel kalabalik yaratir. Detay bilgileri icin ayri sekmeler kullanin.

**❌ Navigasyon linki olarak kullanmak**
EntitySummaryBlock bir gosterim bilesenidir; tiklanabilir kart olarak kullanmak icin \`Card\` tercih edin.

**❌ Actions slot'una form elemanlari yerlestirmek**
Aksiyon alani yalnizca butonlar ve basit kontroller icindir. Form alanlari ayri bolumde olmalidir.

**❌ Avatar olmadan profil karti olusturmak**
Kisi veya varlik kartlarinda avatar gorsel kimliklendirme saglar; eksikligi deneyimi zayiflatir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile bolumlendirme saglanir. \`data-component="entity-summary-block"\` ile tanimlanir.

**Avatar:** Avatar bileseni \`alt\` veya \`initials\` ile ekran okuyucu destegi saglar.

**Descriptions:** Anahtar-deger ciftleri \`Descriptions\` bileseni uzerinden render edilir ve semantik dl/dt/dd yapisi kullanilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. \`hidden\` durumunda bilesen tamamen gizlenir.

**Aksiyonlar:** Actions slot'undaki butonlar kendi ARIA etiketlerini tasimalidir.`,
      },
    ],
    relatedComponents: ["Descriptions", "Avatar", "Badge", "Card", "SummaryStrip", "DetailSummary"],
  },

  ReportFilterPanel: {
    componentName: "ReportFilterPanel",
    summary: "ReportFilterPanel, rapor ve listeleme sayfalarinda yatay filtre formu ile gonder/sifirla aksiyonlarini bir arada sunan panel bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ReportFilterPanel, rapor ve listeleme sayfalarinda **yatay filtre formu** sunan bir bilesendir. Filtre alanlari \`children\` olarak eklenir ve otomatik olarak esit genislikte yan yana dizilir. Sagda gonder ve sifirla butonlari yer alir.

- **Form semantigi** — Native \`<form>\` elementi ile submit/reset islemleri
- **Auto layout** — Alt bilesenleri esit \`flex-1\` genislikte yatay dizme
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri
- **Loading state** — \`loading\` ile submit butonunu devre disi birakma

\`\`\`tsx
import { ReportFilterPanel } from '@mfe/design-system';

<ReportFilterPanel
  onSubmit={() => fetchReport(filters)}
  onReset={() => resetFilters()}
  submitLabel="Filtrele"
  resetLabel="Sifirla"
  loading={isLoading}
>
  <Select label="Donem" value={period} onChange={setPeriod} options={periodOptions} />
  <Select label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
  <DatePicker label="Baslangic" value={startDate} onChange={setStartDate} />
</ReportFilterPanel>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Rapor sayfalarinda filtreleme formu icin
- Listeleme sayfalarinin ustunde filtre paneli olarak
- Birden fazla filtre alanini yatay olarak dizmeniz gerektiginde
- Gonder/sifirla butonlari ile form akisi gerektiren durumlarda

**Kullanmayin:**
- Tablo ustunde inline filtreler icin — bunun yerine \`FilterBar\` kullanin
- Karmasik ve cok adimli form arayuzleri icin — bunun yerine \`FormDrawer\` kullanin
- Tek bir arama alani icin — bunun yerine \`SearchFilterListing\` kullanin
- Grid ici kolon filtreleri icin — bunun yerine \`EntityGridTemplate\` dahili filtrelerini kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────┐
│ [Donem ▾] [Kategori ▾] [Baslangic] │ [Filtrele] [Sifirla] │
│  flex-1     flex-1       flex-1      │  butonlar            │
└──────────────────────────────────────────────────────┘
\`\`\`

1. **Form Container** — \`<form>\` elementi ile submit event yonetimi
2. **Filter Fields** — \`children\` olarak eklenen filtre bilesenlerinin her biri \`flex-1 min-w-[200px]\` ile yatay dizilir
3. **Submit Button** — Birincil stilte gonder butonu; \`submitLabel\` ile etiketlenir
4. **Reset Button** (opsiyonel) — Ikincil stilte sifirla butonu; \`onReset\` verildiginde gorunur
5. **Loading Guard** — \`loading=true\` iken submit butonu devre disi olur`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Filtre sayisini makul tutun.** 3-5 filtre alani yatay dizilimde ideal calisir. Daha fazla filtre icin gruplama veya iki satir duzeni dusunun.

**\`submitLabel\` ve \`resetLabel\` ile anlamli etiketler verin.** "Filtrele", "Rapor Olustur", "Sifirla" gibi beklenen aksiyonu acikca ifade eden metinler kullanin.

**\`loading\` prop'unu API cagirilari sirasinda etkinlestirin.** Kullanicinin cift submit yapmasini onleyin.

**\`testId\`, \`submitTestId\`, \`resetTestId\` ile test etiketleri tanimlayin.** Otomasyon testlerinde guvenilir element secimi saglayin.

**\`access\` ile erisim kontrolu saglayin.** Yetkisiz kullanicilarin filtreleme yapamasini \`readonly\` veya \`disabled\` ile engelleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla filtre alani eklemek**
6'dan fazla yatay filtre gorsel karisiklik yaratir ve mobilde bozulur. Oncelikli filtreleri secin.

**❌ \`onReset\` vermeden kullanmak**
Kullanicilar filtreleri sifirlayamazsa hayal kirikligi yasarlar. Daima sifirla secenegi sunun.

**❌ Form disi icerik yerlestirmek**
ReportFilterPanel bir filtre formudur. Tablo, grafik veya aciklama metni gibi icerikler panel disinda olmalidir.

**❌ \`loading\` durumunu yonetmemek**
Uzun suren API cagirilari sirasinda buton aktif kalirsa kullanici tekrar tekrar tiklar.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Native \`<form>\` elementi kullanilir. Submit ve reset butonlari \`type="submit"\` ve \`type="button"\` ile dogru rolleri tasir.

**Klavye:** Enter tusu ile form gonderilir. Tab ile filtre alanlari ve butonlar arasinda gezilir.

**Erisim Kontrolu:** \`access\` prop'u ile butonlar \`disabled\` veya \`aria-disabled\` ile isaretlenir. \`accessReason\` ile tooltip aciklamasi saglanir.

**Loading:** \`loading\` durumunda submit butonu \`disabled\` olur ve tekrar gonderim engellenir.

**Filtre Alanlari:** Her filtre bileseni kendi \`label\` ve \`aria-label\` ozelliklerini tasimalidir.`,
      },
    ],
    relatedComponents: ["FilterBar", "SearchFilterListing", "Select", "DatePicker", "Button"],
  },

  DetailSectionTabs: {
    componentName: "DetailSectionTabs",
    summary: "DetailSectionTabs, detay sayfalarinda bolum navigasyonu icin sticky, kompakt ve otomatik sarmalanan sekme bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `DetailSectionTabs, detay sayfalarinda farkli bolumleri gecis yapmak icin kullanilan **ozellestirilmis sekme** bilesenidir. Dahili olarak \`SectionTabs\` primitive'ini kullanir ve detay sayfalarina ozgu varsayilanlar saglar.

- **Sticky positioning** — Sayfa kaydirmada sekmeler ust kisimda sabit kalir
- **Compact density** — Varsayilan olarak \`compact\` yogunluk
- **Auto wrap** — \`autoWrapBreakpoint\` ile genis ekranlarda satirlara sarmalama
- **Badge & Description** — Her sekmede sayac badge'i ve tooltip aciklamasi
- **Disabled tabs** — Erisimi kisitlanmis sekmeleri devre disi birakma

\`\`\`tsx
import { DetailSectionTabs } from '@mfe/design-system';

<DetailSectionTabs
  tabs={[
    { id: "genel", label: "Genel Bilgiler", badge: "3" },
    { id: "islemler", label: "Islemler", badge: "28", description: "Son 30 gun" },
    { id: "belgeler", label: "Belgeler", description: "Yuklu dosyalar" },
    { id: "notlar", label: "Notlar", disabled: true },
  ]}
  activeTabId={activeTab}
  onTabChange={setActiveTab}
  ariaLabel="Musteri detay sekmeleri"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfalarinda bolumleri (genel bilgi, islemler, belgeler vb.) ayirmak icin
- Uzun sayfalarda sticky sekme ile hizli bolum navigasyonu saglamak icin
- Her bolumdeki oge sayisini badge ile gostermek icin
- Belirli bolumleri yetki durumuna gore devre disi birakmak icin

**Kullanmayin:**
- Sayfa seviyesinde navigasyon icin — bunun yerine \`Tabs\` veya \`NavigationMenu\` kullanin
- Form adimlari icin — bunun yerine \`Steps\` veya \`MobileStepper\` kullanin
- Ayarlar/tercihler sekmeleri icin — bunun yerine \`Segmented\` kullanin
- Ic ice sekme katmanlari icin — tek seviye sekme kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────┐
│ [Genel Bilgiler (3)] [Islemler (28) i] [Belgeler i] [Notlar] │
│  aktif sekme           badge  tooltip    tooltip   disabled   │
└──────────────────────────────────────────────────────────────┘
  sticky — sayfa kaydirmada sabit kalir
\`\`\`

1. **Container** — \`sticky top-4 z-10\` ile ust kisimda sabitlenen kapsayici
2. **SectionTabs (Internal)** — \`Segmented\` bileseni uzerine kurulu sekme altyapisi
3. **Tab Items** — Etiket, badge ve aciklama tooltip'u iceren sekme ogeleri
4. **Active State** — Aktif sekme golge ve vurgu ile belirginlestirilir
5. **Badge** (opsiyonel) — Sekme icindeki oge sayisi veya durum gostergesi
6. **Description Tooltip** — Info ikonu ile hover'da gosterilen aciklama
7. **Disabled State** — Devre disi sekmelerde etkilesim engellenir`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Sekme sayisini 3-7 arasinda tutun.** Fazla sekme kaydirma gerektirerek kullanici deneyimini dusurur.

**\`badge\` ile icerik sayisini gosterin.** Kullanicilar ilgili bolume gecmeden once icerik sayisini gormelidir.

**\`description\` ile her sekmenin amacini aciklayin.** Tooltip ile kisa aciklama eklemek ozellikle yeni kullanicilar icin faydalidir.

**\`sticky\` varsayilanini koruyun.** Uzun detay sayfalarinda sticky sekmeler bolum navigasyonunu kolaylastirir.

**\`ariaLabel\` ile baglam verin.** "Musteri detay sekmeleri" gibi aciklayici etiket ekran okuyucular icin onemlidir.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Ic ice DetailSectionTabs kullanmak**
Iki katmanli sekme yapisi kullanicilari karistirir. Tek seviye sekme ile bolum ayirimi yeterlidir.

**❌ Navigasyon linki olarak kullanmak**
DetailSectionTabs sayfa ici bolum gecisi icindir. Farkli sayfalara yonlendirme icin \`NavigationMenu\` kullanin.

**❌ 10'dan fazla sekme eklemek**
Cok fazla sekme gorsel karisiklik yaratir. Sekmeleri gruplama veya alt sayfalara bolmeyi dusunun.

**❌ Tum sekmeleri disabled yapmak**
Kullanici hicbir bolume erisemezse bilesen gosterilmemelidir (\`hidden\` tercih edin).`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Dahili \`Segmented\` bileseni ARIA tab pattern'ini uygular. \`ariaLabel\` ile sekme grubu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile sekmeler arasi gecis. Enter/Space ile sekme etkinlestirme. Home/End ile ilk/son sekmeye atlama.

**Badge:** Badge icerigi ekran okuyucular tarafindan etiketle birlikte okunur.

**Description Tooltip:** Info ikonu \`title\` ozelligi ile tanimlanir ve tooltip icerigi ekran okuyuculara sunulur.

**Disabled:** Devre disi sekmeler \`aria-disabled\` ile isaretlenir ve Tab sirasinda atlanmaz, boylece kullanicilar neden devre disi oldugunu anlayabilir.

**Sticky:** Sticky konumlandirma ekran okuyucu akisini etkilemez; DOM sirasi korunur.`,
      },
    ],
    relatedComponents: ["SectionTabs", "Tabs", "Segmented", "Steps"],
  },

  SectionTabs: {
    componentName: "SectionTabs",
    summary: "SectionTabs, Segmented primitive'i ustune scroll/wrap layout, yogunluk ayari, aciklama tooltip'u ve erisim kontrolu ekleyen gelismis sekme bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `SectionTabs, \`Segmented\` bileseni uzerine kurulu olan ve **bolum navigasyonu** icin optimize edilmis gelismis sekme bilesenidir. Responsive layout, yogunluk ayari, aciklama tooltip'u ve erisim kontrolu gibi yetenekler sunar.

- **Layout modlari** — \`scroll\` (yatay kaydirma), \`wrap\` (satira sarma) ve \`auto\` (breakpoint'e gore otomatik)
- **Yogunluk** — \`compact\` ve \`comfortable\` modlari
- **Description display** — \`inline\` veya \`tooltip\` modunda aciklama gosterimi
- **Description visibility** — \`always\`, \`hover\`, \`active\`, \`active-or-hover\` gorunurluk secenekleri
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri

\`\`\`tsx
import { SectionTabs } from '@mfe/design-system';

<SectionTabs
  items={[
    { value: "ozet", label: "Ozet", description: "Genel gorunum", badge: "5" },
    { value: "detay", label: "Detay", description: "Tum alanlar" },
    { value: "gecmis", label: "Gecmis", badge: "142" },
  ]}
  value={activeSection}
  onValueChange={setActiveSection}
  layout="auto"
  autoWrapBreakpoint="xl"
  density="compact"
  descriptionDisplay="tooltip"
  descriptionVisibility="hover"
  ariaLabel="Bolum sekmeleri"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Sayfa ici bolumleri ayirmak icin
- Responsive sekme navigasyonu gerektiren durumlarda (dar ekranlarda kaydirma, genis ekranlarda sarma)
- Badge ve aciklama ile zenginlestirilmis sekme deneyimi icin
- Erisim kontrolu ile yetki tabanli sekme kisitlamasi icin

**Kullanmayin:**
- Detay sayfalarinda sticky sekme icin — bunun yerine \`DetailSectionTabs\` kullanin (hazir varsayilanlar saglar)
- Basit segmented kontrol icin — bunun yerine \`Segmented\` kullanin
- Form adimlari icin — bunun yerine \`Steps\` kullanin
- Sayfa seviyesinde navigasyon icin — bunun yerine \`Tabs\` veya \`NavigationMenu\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│ Viewport (scroll veya wrap)                                      │
│ ┌────────────────────────────────────────────────────────────┐   │
│ │ [Ozet (5) i]  [Detay i]  [Gecmis (142)]                   │   │
│ │  aktif         hover da tooltip    badge                   │   │
│ └────────────────────────────────────────────────────────────┘   │
│  scroll modunda yatay kaydirma, wrap modunda satira sarma        │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

1. **Root** — \`data-component="section-tabs"\` ile tanimlanan kapsayici
2. **Viewport** — Scroll veya wrap layout'a gore kaydirma alani
3. **Segmented (Internal)** — Pill seklinde ghost gorunumlu segment kontrol
4. **Tab Items** — Etiket, badge ve aciklama iceren sekme ogeleri
5. **Badge** (opsiyonel) — Sekme icerik sayaci
6. **Description** — Inline metin veya tooltip olarak gosterilen aciklama
7. **Info Icon** — Tooltip modunda aciklama tetikleyicisi`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`layout="auto"\` ile responsive davranis saglayin.** \`autoWrapBreakpoint\` ile dar ekranlarda yatay kaydirma, genis ekranlarda satirlara sarma otomatik yonetilir.

**\`descriptionDisplay="tooltip"\` tercih edin.** Aciklamalar tooltip olarak gosterildiginde alan tasarrufu saglanir ve arayuz temiz kalir.

**\`density="compact"\` ile yogun arayuzlerde kullanin.** Detay sayfalarinda ve panellerde kompakt yogunluk tercih edin.

**\`classes\` prop'u ile ince ayar yapin.** \`root\`, \`list\`, \`item\`, \`activeItem\`, \`viewport\` gibi slotlar ile gorunumu ozellestirin.

**Kontrollu mod (\`value\` + \`onValueChange\`) kullanin.** Aktif sekme durumunu ust bilesenden yonetin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`layout="scroll"\` ile cok genis sekmeler kullanmak**
Scroll modunda sekmeler gorunmez olabilir. Sekme etiketlerini kisa tutun veya \`auto\` layout kullanin.

**❌ \`descriptionVisibility="always"\` ile uzun aciklamalar vermek**
Daima gorunen uzun aciklamalar alan harcar. \`hover\` veya \`tooltip\` tercih edin.

**❌ \`Segmented\` yerine SectionTabs'i basit toggle icin kullanmak**
Aciklama, badge ve layout yetenekleri gerekmiyorsa \`Segmented\` daha uygun ve hafiftir.

**❌ \`autoWrapBreakpoint\` olmadan \`layout="auto"\` kullanmak**
Varsayilan breakpoint (\`2xl\`) cogu durumda cok gec sarar. Icerige uygun breakpoint belirleyin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Dahili \`Segmented\` bileseni uzerinden ARIA tab/tablist pattern'i uygulanir. \`ariaLabel\` ile sekme grubu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile sekmeler arasi gezinme. Enter/Space ile etkinlestirme.

**Tooltip:** Info ikonu \`title\` ozelligi tasir. Tooltip icerigi \`Tooltip\` bileseni uzerinden erisilebilir sekilde sunulur.

**Description:** \`inline\` modda aciklama gorunur metin olarak yer alir. \`tooltip\` modda gorunmeyen aciklama \`sr-only\` ile ekran okuyuculara sunulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`hidden\` durumunda bilesen tamamen gizlenir. \`disabled\` ve \`readonly\` modlarda etkilesim kisitlanir.

**Scroll:** Yatay kaydirma alani scrollbar gizlenerek sunulur ancak klavye ile navigasyon korunur.`,
      },
    ],
    relatedComponents: ["DetailSectionTabs", "Segmented", "Tabs", "Steps"],
  },

  ActionBar: {
    componentName: "ActionBar",
    summary: "ActionBar, MenuBar primitive'i ustunde selection-driven bulk actions, dense ops header ve readonly governance akisini ayri bir action bar galerisi olarak sunan recipe bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ActionBar, \`MenuBar\` primitive'ini kullanarak secim odakli toplu aksiyonlar, yogun operasyon header'lari ve governance-safe readonly modunu sunan bir **recipe galeri** bilesenidir. Temel odak alanlari:

- **Selection-driven bulk actions** — Secili ogelere gore toplu aksiyon butonlari gosterme
- **Dense operations toolbar** — Yogun operasyonel panellerde kompakt aksiyon cubugu
- **Governance-safe readonly** — \`access="readonly"\` ile salt okunur mod
- **Task-oriented grouping** — Aksiyonlari gorev turune gore gruplama
- **High-signal operational header** — Operasyonel veri ve aksiyonlari tek satirda birlestirme

\`\`\`tsx
import { MenuBar } from '@mfe/design-system';

<MenuBar
  items={[
    { value: "select-all", label: "Tumunu Sec", icon: <CheckAllIcon /> },
    { value: "delete", label: "Sil", icon: <TrashIcon />, emphasis: "promoted" },
    { value: "export", label: "Disa Aktar", icon: <DownloadIcon /> },
    { value: "move", label: "Tasi", icon: <MoveIcon /> },
  ]}
  size="sm"
  appearance="filled"
  ariaLabel="Toplu islem cubugu"
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Tablo veya liste secimi sonrasi toplu islem cubugu olarak
- Operasyonel panellerde yogun aksiyon bari icin
- Governance ve yetki tabanli aksiyon kontrolu gerektiren senaryolarda
- Grid veya liste ustunde kontextuel aksiyon header'i olarak
- Secili oge sayisini gosterip ilgili aksiyonlari sunmak icin

**Kullanmayin:**
- Uygulama navigasyonu icin — bunun yerine \`NavigationMenu\` veya \`AppHeader\` kullanin
- Sayfa basligi ve meta bilgisi icin — bunun yerine \`PageHeader\` kullanin
- Kontextuel sag-tik menusu icin — bunun yerine \`ContextMenu\` kullanin
- Tekil aksiyon butonu icin — bunun yerine \`Button\` veya \`IconButton\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────────┐
│ [Tumunu Sec] │ [Sil] [Disa Aktar] [Tasi] │ [5 oge secildi]  │
│  sol grup      orta aksiyonlar              sag bilgi        │
└──────────────────────────────────────────────────────────────┘
\`\`\`

1. **Action Bar Container** — \`role="menubar"\` ile yatay aksiyon cubugu
2. **Selection Controls** — Tumunu sec/kaldir gibi secim yonetimi butonlari
3. **Bulk Action Items** — Silme, disa aktarma, tasima gibi toplu islem butonlari
4. **Promoted Actions** — \`emphasis="promoted"\` ile vurgulanan kritik aksiyonlar (ornegin silme)
5. **Selection Info** — Secili oge sayisini gosteren bilgi alani
6. **Access Guard** — \`access\` prop'u ile aksiyonlarin yetki kontrolu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Secim durumuna gore ActionBar'i gosterin.** Secili oge yokken cubuk gizli veya devre disi olmalidir.

**Yikici aksiyonlari gorsel olarak ayirin.** \`emphasis="promoted"\` ve farkli renk ile silme gibi aksiyonlari belirginlestirin.

**\`size="sm"\` ile yogun panellerde kompakt gorunum saglayin.** Tablo ustunde ek alan harcamamak icin kucuk boyut tercih edin.

**Aksiyon gruplarini mantiksal olarak ayirin.** Iliskili aksiyonlari bir arada tutun; farkli kategorileri gorsel bosluk ile bolumlendirin.

**Onay dialog'u ile yikici aksiyonlari koruyun.** Silme, kalici tasima gibi geri donulemez islemler icin ek onay adimi ekleyin.

**\`access="readonly"\` ile governance kontrolu saglayin.** Yetkisiz kullanicilar aksiyonlari gorebilir ancak kullanamaz.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Secim olmadan ActionBar'i gostermek**
Hicbir oge secili degilken toplu aksiyon cubugu gosterilmesi kullanicilari karistirir.

**❌ Navigasyon linkleri ile karistirmak**
ActionBar islem ve komut icindir. Sayfa navigasyonu icin \`NavigationMenu\` kullanin.

**❌ Cok fazla aksiyon ogesi eklemek**
5-6'dan fazla aksiyon gorsel karisiklik yaratir. Daha az onemli aksiyonlari overflow menuye tasiyin.

**❌ Yikici aksiyonlari onaysiz calistirmak**
Silme gibi geri donulemez aksiyonlar mutlaka onay dialog'u ile korunmalidir.

**❌ Baskil filled gorunum kullanmak**
Tablo ustunde kullanildiginda \`ghost\` veya hafif gorunum tercih edin; filled gorunum asiri dikkat ceker.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** MenuBar'in tum ARIA ozelliklerini miras alir. \`role="menubar"\` ve \`ariaLabel\` ile aksiyon cubugu tanimlanir.

**Klavye:** Sol/Sag ok tuslari ile aksiyon butonlari arasinda gezinme. Enter/Space ile etkinlestirme. Escape ile focusu cubuktan cikartma.

**Secim Durumu:** Secili oge sayisi degistiginde \`aria-live\` bolge ile ekran okuyucuya duyurulur.

**Readonly:** \`access="readonly"\` durumunda butonlar gorsel olarak devre disi gorunur ve \`aria-disabled\` ile isaretlenir.

**Yikici Aksiyonlar:** Silme gibi aksiyonlar gorsel renk farki ve onay dialog'u ile ek guvenlik katmani saglar.

**Focus Yonetimi:** Bir aksiyon tamamlandiginda (ornegin silme) focus uygun bir sonraki elemente tasinir.`,
      },
    ],
    relatedComponents: ["MenuBar", "ActionHeader", "Button", "ContextMenu"],
  },

};
/* ---- Public API ---- */

export function getGuideForComponent(componentName: string): ComponentGuide | null {
  return _guides[componentName] ?? null;
}

export function hasGuide(componentName: string): boolean {
  return componentName in _guides;
}

export function getGuideSectionIds(guide: ComponentGuide): string[] {
  return guide.sections.map((s) => s.id);
}
