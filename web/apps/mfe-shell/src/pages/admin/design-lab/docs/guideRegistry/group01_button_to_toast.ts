import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
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
  },};
