# API Reference

> Auto-generated on 2026-03-23 by `generate-api-reference.mjs`
> 94 component interfaces documented.

## Table of Contents

### Primitives

- [Alert](#alert)
- [Avatar](#avatar)
- [Badge](#badge)
- [Card](#card)
- [CardHeader](#cardheader)
- [Checkbox](#checkbox)
- [Dialog](#dialog)
- [Divider](#divider)
- [Drawer](#drawer)
- [Dropdown](#dropdown)
- [HStack](#hstack)
- [IconButton](#iconbutton)
- [Input](#input)
- [LinkInline](#linkinline)
- [Modal](#modal)
- [Popover](#popover)
- [Radio](#radio)
- [RadioGroup](#radiogroup)
- [Select](#select)
- [Skeleton](#skeleton)
- [Slot](#slot)
- [Spinner](#spinner)
- [Stack](#stack)
- [Switch](#switch)
- [Tag](#tag)
- [Text](#text)
- [Textarea](#textarea)
- [Tooltip](#tooltip)

### Components

- [Accordion](#accordion)
- [AdaptiveForm](#adaptiveform)
- [AIActionAuditTimeline](#aiactionaudittimeline)
- [AIGuidedAuthoring](#aiguidedauthoring)
- [AILayoutBuilder](#ailayoutbuilder)
- [AnchorToc](#anchortoc)
- [ApprovalCheckpoint](#approvalcheckpoint)
- [ApprovalReview](#approvalreview)
- [AreaChart](#areachart)
- [Autocomplete](#autocomplete)
- [AvatarGroup](#avatargroup)
- [BarChart](#barchart)
- [Breadcrumb](#breadcrumb)
- [Calendar](#calendar)
- [Carousel](#carousel)
- [Cascader](#cascader)
- [CitationPanel](#citationpanel)
- [ColorPicker](#colorpicker)
- [Combobox](#combobox)
- [CommandPalette](#commandpalette)
- [ConfidenceBadge](#confidencebadge)
- [ContextMenu](#contextmenu)
- [DatePicker](#datepicker)
- [Descriptions](#descriptions)
- [DetailSectionTabs](#detailsectiontabs)
- [EmptyErrorLoading](#emptyerrorloading)
- [EmptyState](#emptystate)
- [ErrorBoundary](#errorboundary)
- [FloatButton](#floatbutton)
- [FormField](#formfield)
- [InputNumber](#inputnumber)
- [JsonViewer](#jsonviewer)
- [LineChart](#linechart)
- [List](#list)
- [Mentions](#mentions)
- [MenuBar](#menubar)
- [NavigationRail](#navigationrail)
- [NotificationDrawer](#notificationdrawer)
- [NotificationItemCard](#notificationitemcard)
- [NotificationPanel](#notificationpanel)
- [Pagination](#pagination)
- [PieChart](#piechart)
- [PromptComposer](#promptcomposer)
- [QRCode](#qrcode)
- [Rating](#rating)
- [RecommendationCard](#recommendationcard)
- [SearchFilterListing](#searchfilterlisting)
- [SearchInput](#searchinput)
- [SectionTabs](#sectiontabs)
- [Segmented](#segmented)
- [Slider](#slider)
- [SmartDashboard](#smartdashboard)
- [Steps](#steps)
- [Tabs](#tabs)
- [ThemePresetCompare](#themepresetcompare)
- [ThemePresetGallery](#themepresetgallery)
- [ThemePreviewCard](#themepreviewcard)
- [Timeline](#timeline)
- [TimelineItem](#timelineitem)
- [TimePicker](#timepicker)
- [ToastProvider](#toastprovider)
- [TourCoachmarks](#tourcoachmarks)
- [Transfer](#transfer)
- [Tree](#tree)
- [Upload](#upload)
- [Watermark](#watermark)

---

## Alert

**Category:** primitives
**Interface:** `AlertProps`
**Source:** `src/primitives/alert/Alert.tsx`
**Extends:** `Omit<React.HTMLAttributes<HTMLDivElement>, "title">`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `AlertVariant` | No | - |  |
| `severity` | `AlertVariant` | No | - | **DEPRECATED** (Use `variant` instead. Will be removed in v3.0.0.) |
| `title` | `React.ReactNode` | No | - | Title (optional) |
| `icon` | `React.ReactNode` | No | - | Leading icon |
| `closable` | `boolean` | No | `false` | Closable |
| `onClose` | `() => void` | No | - |  |
| `action` | `React.ReactNode` | No | - | Action node (e.g. button) |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Alert root styling onto the child element. When asChild is true, Alert's internal layout (icon, title, close button) is not rendered; only the root styling and role are merged. |

---

## Avatar

**Category:** primitives
**Interface:** `AvatarProps`
**Source:** `src/primitives/avatar/Avatar.tsx`
**Extends:** `React.HTMLAttributes<HTMLSpanElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | No | - | Image URL |
| `alt` | `string` | No | - |  |
| `initials` | `string` | No | - | Fallback initials (1-2 chars) |
| `size` | `AvatarSize` | No | `md` |  |
| `shape` | `AvatarShape` | No | `circle` |  |
| `icon` | `React.ReactNode` | No | - | Fallback icon (when no src or initials) |

---

## Badge

**Category:** primitives
**Interface:** `BadgeProps`
**Source:** `src/primitives/badge/Badge.tsx`
**Extends:** `React.HTMLAttributes<HTMLSpanElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `BadgeVariant` | No | - |  |
| `tone` | `BadgeVariant` | No | - | **DEPRECATED** (Use `variant` instead. Will be removed in v3.0.0.) |
| `size` | `BadgeSize` | No | `md` |  |
| `dot` | `boolean` | No | `false` | Render as a dot (no children) |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Badge props onto the child element. |

---

## Card

**Category:** primitives
**Interface:** `CardProps`
**Source:** `src/primitives/card/Card.tsx`
**Extends:** `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `CardVariant` | No | `elevated` |  |
| `padding` | `CardPadding` | No | `md` |  |
| `hoverable` | `boolean` | No | `false` | Interactive — adds hover effects |
| `as` | `"div" \| "button" \| "article" \| "section"` | No | - | Full-width click target |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Card props onto the child element. Modern alternative to `as` for polymorphism. |
| `slotProps` | `SlotProps<CardSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## CardHeader

**Category:** primitives
**Interface:** `CardHeaderProps`
**Source:** `src/primitives/card/Card.tsx`
**Extends:** `Omit<React.HTMLAttributes<HTMLDivElement>, "title">`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | - |  |
| `subtitle` | `React.ReactNode` | No | - |  |
| `action` | `React.ReactNode` | No | - |  |

---

## Checkbox

**Category:** primitives
**Interface:** `CheckboxProps`
**Source:** `src/primitives/checkbox/Checkbox.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `size` | `CheckboxSize` | No | - | Component size |
| `checkboxSize` | `CheckboxSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `defaultChecked` | `boolean` | No | - | Initial checked state for uncontrolled mode. Ignored when `checked` is provided. |
| `indeterminate` | `boolean` | No | `false` | Indeterminate state |
| `error` | `boolean \| string \| React.ReactNode` | No | `false` |  |
| `density` | `"compact" \| "comfortable" \| "spacious"` | No | `comfortable` | Density controls gap and text size |
| `variant` | `"default" \| "card"` | No | `default` | Visual variant — "card" wraps the checkbox in a bordered card container |
| `loading` | `boolean` | No | `false` | Show a loading indicator on the checkbox; makes it non-interactive |

---

## Dialog

**Category:** primitives
**Interface:** `DialogProps`
**Source:** `src/primitives/dialog/Dialog.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - |  |
| `onClose` | `() => void` | Yes | - |  |
| `size` | `DialogSize` | No | `md` |  |
| `closable` | `boolean` | No | `true` | Show close button |
| `closeOnBackdrop` | `boolean` | No | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | No | `true` | Close on Escape key |
| `title` | `React.ReactNode` | No | - | Title for header |
| `description` | `React.ReactNode` | No | - | Description below title |
| `footer` | `React.ReactNode` | No | - | Footer content (actions) |
| `className` | `string` | No | - |  |
| `children` | `React.ReactNode` | Yes | - |  |
| `slotProps` | `SlotProps<DialogSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## Divider

**Category:** primitives
**Interface:** `DividerProps`
**Source:** `src/primitives/divider/Divider.tsx`
**Extends:** `React.HTMLAttributes<HTMLHRElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `orientation` | `"horizontal" \| "vertical"` | No | `horizontal` | Orientation |
| `label` | `string` | No | - | Label in the center |
| `spacing` | `"none" \| "sm" \| "md" \| "lg"` | No | `md` | Margin spacing |

---

## Drawer

**Category:** primitives
**Interface:** `DrawerProps`
**Source:** `src/primitives/drawer/Drawer.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - | Controlled open state |
| `onClose` | `() => void` | Yes | - | Close callback |
| `placement` | `DrawerPlacement` | No | `right` | Which edge the drawer slides in from |
| `size` | `DrawerSize` | No | `md` | Width/height preset |
| `title` | `React.ReactNode` | No | - | Drawer title |
| `description` | `React.ReactNode` | No | - | Description below title |
| `children` | `React.ReactNode` | Yes | - | Main content |
| `footer` | `React.ReactNode` | No | - | Footer content (actions) |
| `closeOnOverlayClick` | `boolean` | No | `true` | Close when clicking the overlay backdrop |
| `closeOnEscape` | `boolean` | No | `true` | Close when pressing Escape |
| `showOverlay` | `boolean` | No | `true` | Show the backdrop overlay |
| `className` | `string` | No | - | Additional class name on the panel |

---

## Dropdown

**Category:** primitives
**Interface:** `DropdownProps`
**Source:** `src/primitives/dropdown/Dropdown.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactElement` | Yes | - | Trigger element |
| `items` | `DropdownEntry[]` | Yes | - |  |
| `placement` | `DropdownPlacement` | No | `bottom-start` |  |
| `minWidth` | `number` | No | `180` | Min width in px |
| `className` | `string` | No | - |  |
| `disabled` | `boolean` | No | `false` | Disable the dropdown — prevents opening |

---

## HStack

**Category:** primitives
**Interface:** `HStackProps`
**Source:** `src/primitives/stack/Stack.tsx`

_No props defined._

---

## IconButton

**Category:** primitives
**Interface:** `IconButtonProps`
**Source:** `src/primitives/icon-button/IconButton.tsx`
**Extends:** `React.ButtonHTMLAttributes<HTMLButtonElement>,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `React.ReactNode` | Yes | - | Icon element |
| `label` | `string` | Yes | - | Accessible label (required since there's no visible text) |
| `variant` | `IconButtonVariant` | No | `ghost` |  |
| `size` | `IconButtonSize` | No | `md` |  |
| `loading` | `boolean` | No | `false` |  |
| `rounded` | `boolean` | No | `false` | Rounded pill shape |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges IconButton props onto the child element. |

---

## Input

**Category:** primitives
**Interface:** `InputProps`
**Source:** `src/primitives/input/Input.tsx`
**Extends:** `Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "children" | "prefix"
    >,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `size` | `FieldSize` | No | - |  |
| `inputSize` | `FieldSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `density` | `FieldDensity` | No | `comfortable` |  |
| `leadingVisual` | `React.ReactNode` | No | - |  |
| `trailingVisual` | `React.ReactNode` | No | - |  |
| `prefix` | `React.ReactNode` | No | - | Alias — same as leadingVisual |
| `suffix` | `React.ReactNode` | No | - | Alias — same as trailingVisual |
| `onChange` | `React.ChangeEventHandler<HTMLInputElement>` | No | - |  |
| `onValueChange` | `(` | No | - |  |
| `value` | `string` | Yes | - |  |
| `event` | `React.ChangeEvent<HTMLInputElement>` | Yes | - |  |
| `showCount` | `boolean` | No | `false` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `loading` | `boolean` | No | `false` | Show a loading spinner in the trailing slot and make the input readonly |

---

## LinkInline

**Category:** primitives
**Interface:** `LinkInlineProps`
**Source:** `src/primitives/link-inline/LinkInline.tsx`
**Extends:** `Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - |  |
| `tone` | `LinkInlineTone` | No | - | Visual tone. Use `variant` as a modern alias. |
| `variant` | `LinkInlineTone` | No | - | Alias for `tone` — aligns with the standard component API. |
| `underline` | `LinkInlineUnderline` | No | `hover` |  |
| `current` | `boolean` | No | `false` |  |
| `disabled` | `boolean` | No | `false` |  |
| `external` | `boolean` | No | - |  |
| `leadingVisual` | `React.ReactNode` | No | - |  |
| `trailingVisual` | `React.ReactNode` | No | - |  |
| `localeText` | `{` | No | - |  |
| `externalScreenReaderLabel` | `React.ReactNode` | No | - |  |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges LinkInline props onto the child element. Useful for composing with router Link components. |

---

## Modal

**Category:** primitives
**Interface:** `ModalProps`
**Source:** `src/primitives/modal/Modal.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - |  |
| `children` | `React.ReactNode` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `onClose` | `(reason?: OverlayCloseReason) => void` | No | - |  |
| `footer` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | - |  |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` |  |
| `maxWidth` | `number \| string` | No | - |  |
| `fullWidth` | `boolean` | No | `false` |  |
| `surface` | `"base" \| "confirm" \| "destructive" \| "audit"` | No | - |  |
| `variant` | `"base" \| "confirm" \| "destructive" \| "audit"` | No | - | Alias for `surface` — aligns with the standard component API. |
| `closeOnOverlayClick` | `boolean` | No | `true` |  |
| `closeOnEscape` | `boolean` | No | `true` |  |
| `keepMounted` | `boolean` | No | `false` |  |
| `destroyOnHidden` | `boolean` | No | `false` |  |
| `portalTarget` | `HTMLElement \| null` | No | - |  |
| `disablePortal` | `boolean` | No | `false` |  |
| `classes` | `ModalClasses` | No | - |  |
| `slotProps` | `SlotProps<ModalSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## Popover

**Category:** primitives
**Interface:** `PopoverProps`
**Source:** `src/primitives/popover/Popover.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `trigger` | `React.ReactNode` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `content` | `React.ReactNode` | Yes | - |  |
| `align` | `PopoverAlign` | No | `center` |  |
| `side` | `PopoverSide` | No | `bottom` |  |
| `triggerMode` | `PopoverTriggerMode` | No | `click` |  |
| `open` | `boolean` | No | - |  |
| `defaultOpen` | `boolean` | No | `false` |  |
| `onOpenChange` | `(open: boolean) => void` | No | - |  |
| `className` | `string` | No | `` |  |
| `portalTarget` | `HTMLElement \| null` | No | - |  |
| `disablePortal` | `boolean` | No | `false` |  |
| `ariaLabel` | `string` | No | `Popover` |  |
| `flipOnCollision` | `boolean` | No | `true` |  |
| `openDelay` | `number` | No | - |  |
| `closeDelay` | `number` | No | - |  |
| `showArrow` | `boolean` | No | `true` |  |
| `arrowClassName` | `string` | No | `` |  |
| `panelClassName` | `string` | No | `` |  |

---

## Radio

**Category:** primitives
**Interface:** `RadioProps`
**Source:** `src/primitives/radio/Radio.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | No | - |  |
| `description` | `string` | No | - |  |
| `size` | `RadioSize` | No | - | Component size |
| `radioSize` | `RadioSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `density` | `"compact" \| "comfortable" \| "spacious"` | No | `comfortable` | Density controls gap and text size |
| `error` | `boolean \| string \| React.ReactNode` | No | `false` |  |
| `loading` | `boolean` | No | `false` | Show a loading indicator on the radio; makes it non-interactive |

---

## RadioGroup

**Category:** primitives
**Interface:** `RadioGroupProps`
**Source:** `src/primitives/radio/Radio.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | Yes | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | - | Initial selected value for uncontrolled mode. Ignored when `value` is provided. |
| `onChange` | `(value: string) => void` | No | - |  |
| `direction` | `"horizontal" \| "vertical"` | No | `vertical` | Layout direction |
| `className` | `string` | No | - |  |
| `children` | `React.ReactNode` | Yes | - |  |

---

## Select

**Category:** primitives
**Interface:** `SelectProps`
**Source:** `src/primitives/select/Select.tsx`
**Extends:** `Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `SelectSize` | No | - | Component size |
| `selectSize` | `SelectSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `options` | `SelectOption[]` | Yes | - |  |
| `defaultValue` | `string` | No | - | Initial selected value for uncontrolled mode. Ignored when `value` is provided. |
| `placeholder` | `string` | No | - | Placeholder (first disabled option) |
| `error` | `boolean \| string \| React.ReactNode` | No | `false` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `loading` | `boolean` | No | `false` | Show a loading spinner replacing the chevron and disable the select |
| `density` | `SelectDensity` | No | `comfortable` | Density controls vertical padding and text size |
| `slotProps` | `SlotProps<SelectSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## Skeleton

**Category:** primitives
**Interface:** `SkeletonProps`
**Source:** `src/primitives/skeleton/Skeleton.tsx`
**Extends:** `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | `string \| number` | No | - | Width — CSS value or "full" |
| `height` | `string \| number` | No | - | Height — CSS value |
| `circle` | `boolean` | No | `false` | Circle shape |
| `lines` | `number` | No | - | Number of lines (renders stacked skeletons) |
| `animated` | `boolean` | No | `true` | Enable/disable pulse animation (defaults to true) |

---

## Slot

**Category:** primitives
**Interface:** `SlotProps`
**Source:** `src/primitives/_shared/Slot.tsx`
**Extends:** `React.HTMLAttributes<HTMLElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `React.ReactNode` | Yes | - |  |

---

## Spinner

**Category:** primitives
**Interface:** `SpinnerProps`
**Source:** `src/primitives/spinner/Spinner.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `SpinnerSize` | No | `md` |  |
| `className` | `string` | No | - |  |
| `label` | `string` | No | `Loading` | Accessible label |
| `mode` | `SpinnerMode` | No | `inline` | Display mode: inline (default) or block (centered with visible label) |

---

## Stack

**Category:** primitives
**Interface:** `StackProps`
**Source:** `src/primitives/stack/Stack.tsx`
**Extends:** `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `direction` | `StackDirection` | No | `column` |  |
| `align` | `StackAlign` | No | `center` |  |
| `justify` | `StackJustify` | No | - |  |
| `gap` | `StackGap` | No | `3` |  |
| `wrap` | `boolean` | No | `false` |  |
| `as` | `"div" \| "section" \| "article" \| "nav" \| "main" \| "aside" \| "ul" \| "ol"` | No | - | Render as another element |

---

## Switch

**Category:** primitives
**Interface:** `SwitchProps`
**Source:** `src/primitives/switch/Switch.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | No | - | Label text |
| `description` | `string` | No | - | Description below label |
| `size` | `SwitchSize` | No | - | Component size |
| `switchSize` | `SwitchSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `variant` | `SwitchVariant` | No | `default` | Visual variant — "destructive" uses error color when checked |
| `density` | `SwitchDensity` | No | `comfortable` | Density controls scale of the switch |
| `defaultChecked` | `boolean` | No | - | Initial checked state for uncontrolled mode. Ignored when `checked` is provided. |
| `checked` | `boolean` | No | - | Checked state (controlled) |
| `onCheckedChange` | `(checked: boolean) => void` | No | - |  |
| `error` | `boolean \| string \| React.ReactNode` | No | `false` | Error state — sets aria-invalid when truthy |
| `loading` | `boolean` | No | `false` | Show a loading indicator on the thumb; makes the switch non-interactive |

---

## Tag

**Category:** primitives
**Interface:** `TagProps`
**Source:** `src/primitives/tag/Tag.tsx`
**Extends:** `React.HTMLAttributes<HTMLSpanElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `TagVariant` | No | - |  |
| `tone` | `TagVariant` | No | - | **DEPRECATED** (Use `variant` instead. Will be removed in v3.0.0.) |
| `size` | `TagSize` | No | `md` |  |
| `closable` | `boolean` | No | `false` | Show close button |
| `onClose` | `() => void` | No | - | Close callback |
| `icon` | `React.ReactNode` | No | - | Icon before text |
| `access` | `AccessLevel` | No | `full` | Access level — controls visibility/disabled state |
| `accessReason` | `string` | No | - | Tooltip/title text explaining access restriction |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Tag props onto the child element. |

---

## Text

**Category:** primitives
**Interface:** `TextProps`
**Source:** `src/primitives/text/Text.tsx`
**Extends:** `React.HTMLAttributes<HTMLElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `as` | `TextElement \| (string & {})` | No | - | HTML element to render |
| `variant` | `TextVariant` | No | `default` |  |
| `size` | `TextSize` | No | - |  |
| `weight` | `TextWeight` | No | - |  |
| `truncate` | `boolean` | No | `false` | Truncate with ellipsis |
| `lineClamp` | `1 \| 2 \| 3 \| 4 \| 5` | No | - | Limit visible lines (uses line-clamp) |
| `mono` | `boolean` | No | `false` | Monospace font |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Text props onto the child element. Modern alternative to `as` for polymorphism. |

---

## Textarea

**Category:** primitives
**Interface:** `TextareaProps`
**Source:** `src/primitives/input/Textarea.tsx`
**Extends:** `Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "onChange" | "children"
    >,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `size` | `FieldSize` | No | `md` |  |
| `leadingVisual` | `React.ReactNode` | No | - |  |
| `trailingVisual` | `React.ReactNode` | No | - |  |
| `onChange` | `React.ChangeEventHandler<HTMLTextAreaElement>` | No | - |  |
| `onValueChange` | `(` | No | - |  |
| `value` | `string` | Yes | - |  |
| `event` | `React.ChangeEvent<HTMLTextAreaElement>` | Yes | - |  |
| `showCount` | `boolean` | No | `false` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `resize` | `TextAreaResize` | No | `vertical` |  |
| `loading` | `boolean` | No | `false` | Show a loading indicator and disable editing |

---

## Tooltip

**Category:** primitives
**Interface:** `TooltipProps`
**Source:** `src/primitives/tooltip/Tooltip.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `React.ReactNode` | No | - | Tooltip content — primary prop |
| `placement` | `TooltipPlacement` | No | `top` |  |
| `align` | `TooltipAlign` | No | - |  |
| `delay` | `number` | No | - | Delay before showing (ms) |
| `openDelay` | `number` | No | - | Alias for delay — delay before showing (ms) |
| `closeDelay` | `number` | No | `0` | Delay before hiding (ms) |
| `disabled` | `boolean` | No | `false` | Disable tooltip |
| `showArrow` | `boolean` | No | `false` | Show arrow indicator |
| `className` | `string` | No | - | Additional class for the wrapper |
| `asChild` | `boolean` | No | `false` | Render the trigger via Slot — merges tooltip event handlers directly onto the child element, removing the wrapper `<span>`. The child element must accept `className`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, and `onKeyDown` props. |
| `children` | `React.ReactNode` | Yes | - |  |

---

## Accordion

**Category:** components
**Interface:** `AccordionProps`
**Source:** `src/components/accordion/Accordion.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AccordionItem[]` | Yes | - |  |
| `value` | `string \| string[]` | No | - |  |
| `defaultValue` | `string \| string[]` | No | - |  |
| `onValueChange` | `(nextValue: string[]) => void` | No | - |  |
| `onItemToggle` | `(itemValue: string, expanded: boolean) => void` | No | - |  |
| `selectionMode` | `AccordionSelectionMode` | No | `multiple` |  |
| `ariaLabel` | `string` | No | `Accordion` |  |
| `size` | `AccordionSize` | No | `md` |  |
| `bordered` | `boolean` | No | `true` |  |
| `ghost` | `boolean` | No | `false` |  |
| `showArrow` | `boolean` | No | `true` |  |
| `expandIcon` | `React.ReactNode` | No | - |  |
| `expandIconPosition` | `AccordionExpandIconPosition` | No | `start` |  |
| `disableGutters` | `boolean` | No | `false` |  |
| `destroyOnHidden` | `boolean` | No | `true` |  |
| `collapsible` | `AccordionCollapsible` | No | `header` |  |
| `classes` | `AccordionClasses` | No | - |  |
| `className` | `string` | No | - |  |
| `slotProps` | `SlotProps<AccordionSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## AdaptiveForm

**Category:** components
**Interface:** `AdaptiveFormProps`
**Source:** `src/components/adaptive-form/AdaptiveForm.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `FormField[]` | Yes | - |  |
| `values` | `Record<string, unknown>` | No | - |  |
| `onValuesChange` | `(values: Record<string, unknown>) => void` | No | - |  |
| `onSubmit` | `(values: Record<string, unknown>) => void` | No | - |  |
| `layout` | `FormLayout` | No | `vertical` |  |
| `columns` | `1 \| 2` | No | `1` |  |
| `size` | `FormSize` | No | `md` |  |
| `submitLabel` | `string` | No | `Gonder` |  |
| `resetLabel` | `string` | No | `Sifirla` |  |
| `showReset` | `boolean` | No | `false` |  |
| `loading` | `boolean` | No | `false` |  |
| `className` | `string` | No | - |  |

---

## AIActionAuditTimeline

**Category:** components
**Interface:** `AIActionAuditTimelineProps`
**Source:** `src/components/ai-action-audit-timeline/AIActionAuditTimeline.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AIActionAuditTimelineItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Denetim zaman cizelgesi` |  |
| `description` | `React.ReactNode` | No | `AI aksiyonlari ve insan onayi kronolojik iz olarak ayni timeline primitive ile gorunur.` |  |
| `selectedId` | `string \| null` | No | `null` |  |
| `onSelectItem` | `(id: string, item: AIActionAuditTimelineItem) => void` | No | - |  |
| `compact` | `boolean` | No | `false` |  |
| `emptyStateLabel` | `React.ReactNode` | No | `Timeline kaydi bulunamadi.` |  |
| `className` | `string` | No | `` |  |

---

## AIGuidedAuthoring

**Category:** components
**Interface:** `AIGuidedAuthoringProps`
**Source:** `src/components/ai-guided-authoring/AIGuidedAuthoring.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | `AI guided authoring` |  |
| `description` | `React.ReactNode` | No | `Prompt yazimi, recommendation stack ve command palette ayni authoring recipe altinda birlikte calisir.` |  |
| `promptComposerProps` | `Partial<PromptComposerProps>` | No | - |  |
| `recommendations` | `AIGuidedAuthoringRecommendation[]` | No | - |  |
| `commandItems` | `CommandPaletteItem[]` | No | - |  |
| `confidenceLevel` | `ConfidenceLevel` | No | `medium` |  |
| `confidenceScore` | `number` | No | - |  |
| `sourceCount` | `number` | No | - |  |
| `confidenceLabel` | `React.ReactNode` | No | `MEVCUT GUVEN` |  |
| `paletteOpen` | `boolean` | No | - |  |
| `defaultPaletteOpen` | `boolean` | No | `false` |  |
| `onPaletteOpenChange` | `(open: boolean) => void` | No | - |  |
| `onApplyRecommendation` | `(` | No | - |  |
| `id` | `string` | Yes | - |  |
| `item` | `AIGuidedAuthoringRecommendation` | Yes | - |  |
| `onReviewRecommendation` | `(` | No | - |  |
| `id` | `string` | Yes | - |  |
| `item` | `AIGuidedAuthoringRecommendation` | Yes | - |  |
| `className` | `string` | No | `` |  |

---

## AILayoutBuilder

**Category:** components
**Interface:** `AILayoutBuilderProps`
**Source:** `src/components/ai-layout-builder/AILayoutBuilder.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `blocks` | `LayoutBlock[]` | Yes | - |  |
| `intent` | `LayoutIntent` | No | `overview` |  |
| `columns` | `1 \| 2 \| 3 \| 4` | No | `3` |  |
| `density` | `LayoutDensity` | No | `comfortable` |  |
| `onBlockReorder` | `(keys: string[]) => void` | No | - |  |
| `onBlockToggle` | `(key: string, collapsed: boolean) => void` | No | - |  |
| `draggable` | `boolean` | No | `false` |  |
| `title` | `string` | No | - |  |
| `description` | `string` | No | - |  |
| `className` | `string` | No | - |  |

---

## AnchorToc

**Category:** components
**Interface:** `AnchorTocProps`
**Source:** `src/components/anchor-toc/AnchorToc.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AnchorTocItem[]` | Yes | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | - |  |
| `onValueChange` | `(value: string) => void` | No | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `density` | `AnchorTocDensity` | No | `comfortable` |  |
| `sticky` | `boolean` | No | `false` |  |
| `syncWithHash` | `boolean` | No | `true` |  |
| `className` | `string` | No | - |  |
| `localeText` | `{` | No | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `navigationLabel` | `string` | No | - |  |

---

## ApprovalCheckpoint

**Category:** components
**Interface:** `ApprovalCheckpointProps`
**Source:** `src/components/approval-checkpoint/ApprovalCheckpoint.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | Yes | - |  |
| `summary` | `React.ReactNode` | Yes | - |  |
| `status` | `ApprovalCheckpointStatus` | No | `pending` |  |
| `checkpointLabel` | `React.ReactNode` | No | `Onay kapisi` |  |
| `approverLabel` | `React.ReactNode` | No | `Insan inceleme kurulu` |  |
| `dueLabel` | `React.ReactNode` | No | `Yayindan once` |  |
| `evidenceItems` | `string[]` | No | - |  |
| `steps` | `ApprovalCheckpointItem[]` | No | - |  |
| `citations` | `string[]` | No | - |  |
| `primaryActionLabel` | `string` | No | `Onayla` |  |
| `secondaryActionLabel` | `string` | No | `Inceleme talep et` |  |
| `onPrimaryAction` | `() => void` | No | - |  |
| `onSecondaryAction` | `() => void` | No | - |  |
| `footerNote` | `React.ReactNode` | No | - |  |
| `badges` | `React.ReactNode[]` | No | - |  |
| `className` | `string` | No | `` |  |

---

## ApprovalReview

**Category:** components
**Interface:** `ApprovalReviewProps`
**Source:** `src/components/approval-review/ApprovalReview.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | `Approval review` |  |
| `description` | `React.ReactNode` | No | `Human checkpoint, source evidence ve audit izleri ayni review recipe altinda gorunur.` |  |
| `checkpoint` | `ApprovalCheckpointProps` | Yes | - |  |
| `citations` | `CitationPanelItem[]` | Yes | - |  |
| `auditItems` | `AIActionAuditTimelineItem[]` | Yes | - |  |
| `selectedCitationId` | `string \| null` | No | - |  |
| `defaultSelectedCitationId` | `string \| null` | No | `null` |  |
| `onCitationSelect` | `(citationId: string, item: CitationPanelItem) => void` | No | - |  |
| `selectedAuditId` | `string \| null` | No | - |  |
| `defaultSelectedAuditId` | `string \| null` | No | `null` |  |
| `onAuditSelect` | `(` | No | - |  |
| `auditId` | `string` | Yes | - |  |
| `item` | `AIActionAuditTimelineItem` | Yes | - |  |
| `className` | `string` | No | `` |  |

---

## AreaChart

**Category:** components
**Interface:** `AreaChartProps`
**Source:** `src/components/charts/AreaChart.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `series` | `ChartSeries[]` | Yes | - | Series to render as filled areas. |
| `labels` | `string[]` | Yes | - | X-axis labels. |
| `size` | `ChartSize` | No | `md` | Visual size variant. @default "md" |
| `stacked` | `boolean` | No | `false` | Stack areas on top of each other. @default false |
| `showDots` | `boolean` | No | `true` | Show dot markers at data points. @default true |
| `showGrid` | `boolean` | No | `true` | Show grid lines. @default true |
| `showLegend` | `boolean` | No | `false` | Show legend below the chart. @default false |
| `gradient` | `boolean` | No | `true` | Use gradient fills instead of flat color. @default true |
| `curved` | `boolean` | No | `false` | Use bezier curves instead of straight lines. @default false |
| `valueFormatter` | `(value: number) => string` | No | - | Custom value formatter. |
| `animate` | `boolean` | No | `true` | Animate on mount. @default true |
| `title` | `string` | No | - | Chart title. |
| `description` | `string` | No | - | Accessible description. |
| `localeText` | `ChartLocaleText` | No | - | Locale overrides. |
| `className` | `string` | No | - | Additional class name. |

---

## Autocomplete

**Category:** components
**Interface:** `AutocompleteProps`
**Source:** `src/components/autocomplete/Autocomplete.tsx`
**Extends:** `Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "value" | "defaultValue" | "children"
  >`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | `` |  |
| `onChange` | `(value: string) => void` | No | - |  |
| `options` | `AutocompleteOption[]` | Yes | - |  |
| `onSearch` | `(query: string) => void` | No | - | Async search handler — called on input change with debounce |
| `loading` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `disabled` | `boolean` | No | `false` |  |
| `invalid` | `boolean` | No | `false` |  |
| `error` | `React.ReactNode` | No | - |  |
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `placeholder` | `string` | No | - |  |
| `className` | `string` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `allowCustomValue` | `boolean` | No | `true` | If true, allows freeform text; if false, only options can be selected |
| `maxSuggestions` | `number` | No | `10` | Max number of suggestions shown |

---

## AvatarGroup

**Category:** components
**Interface:** `AvatarGroupProps`
**Source:** `src/components/avatar-group/AvatarGroup.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AvatarGroupItem[]` | Yes | - | Avatar items to display. |
| `max` | `number` | No | - | Maximum number of avatars to show before the "+N" badge. |
| `size` | `AvatarGroupSize` | No | `md` | Size variant. @default "md" |
| `shape` | `AvatarGroupShape` | No | `circle` | Shape variant. @default "circle" |
| `spacing` | `AvatarGroupSpacing` | No | `normal` | Overlap spacing. @default "normal" |
| `renderExcess` | `(count: number) => React.ReactNode` | No | - | Custom renderer for the excess count badge. |
| `onClick` | `(item: AvatarGroupItem) => void` | No | - | Called when an avatar is clicked. |
| `className` | `string` | No | - | Additional class name for the root element. |

---

## BarChart

**Category:** components
**Interface:** `BarChartProps`
**Source:** `src/components/charts/BarChart.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `ChartDataPoint[]` | Yes | - | Data points to render as bars. |
| `orientation` | `"vertical" \| "horizontal"` | No | `vertical` | Bar orientation. @default "vertical" |
| `size` | `ChartSize` | No | `md` | Visual size variant. @default "md" |
| `showValues` | `boolean` | No | `false` | Show value labels on bars. @default false |
| `showGrid` | `boolean` | No | `true` | Show grid lines. @default true |
| `showLegend` | `boolean` | No | `false` | Show legend below the chart. @default false |
| `valueFormatter` | `(value: number) => string` | No | - | Custom value formatter. |
| `animate` | `boolean` | No | `true` | Animate bars on mount. @default true |
| `colors` | `string[]` | No | - | Override default chart colors. |
| `title` | `string` | No | - | Chart title. |
| `description` | `string` | No | - | Accessible description. |
| `localeText` | `ChartLocaleText` | No | - | Locale overrides. |
| `className` | `string` | No | - | Additional class name. |
| `series` | `{ field: string; name: string; color?: string }[]` | No | - | Multi-series: second value field for grouped bars. |

---

## Breadcrumb

**Category:** components
**Interface:** `BreadcrumbProps`
**Source:** `src/components/breadcrumb/Breadcrumb.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `BreadcrumbItem[]` | Yes | - |  |
| `separator` | `React.ReactNode` | No | - | Separator character |
| `maxItems` | `number` | No | - | Max items before collapsing |
| `className` | `string` | No | - |  |

---

## Calendar

**Category:** components
**Interface:** `CalendarProps`
**Source:** `src/components/calendar/Calendar.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `Date \| Date[] \| null` | No | - | Selected date(s) |
| `defaultValue` | `Date \| null` | No | - | Default value |
| `mode` | `CalendarMode` | No | `single` | Selection mode |
| `month` | `Date` | No | - | Current viewed month |
| `defaultMonth` | `Date` | No | - | Default month to display |
| `minDate` | `Date` | No | - | Min selectable date |
| `maxDate` | `Date` | No | - | Max selectable date |
| `disabledDates` | `(date: Date) => boolean` | No | - | Disabled specific dates |
| `highlightedDates` | `Date[]` | No | - | Highlight specific dates |
| `firstDayOfWeek` | `0 \| 1` | No | `1` | First day of week (0=Sun, 1=Mon) |
| `showWeekNumbers` | `boolean` | No | `false` | Show week numbers |
| `size` | `CalendarSize` | No | `md` | Size |
| `showOutsideDays` | `boolean` | No | `true` | Show outside days (prev/next month) |
| `numberOfMonths` | `1 \| 2 \| 3` | No | `1` | Number of months to display |
| `renderDay` | `(date: Date) => React.ReactNode` | No | - | Custom day render |
| `events` | `CalendarEvent[]` | No | - | Event dots/badges per day |
| `localeText` | `CalendarLocaleText` | No | - | Locale text |
| `onValueChange` | `(value: Date \| Date[] \| null) => void` | No | - | Called when value changes |
| `onMonthChange` | `(month: Date) => void` | No | - | Called when displayed month changes |
| `className` | `string` | No | - | Additional CSS class |

---

## Carousel

**Category:** components
**Interface:** `CarouselProps`
**Source:** `src/components/carousel/Carousel.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `{ key: React.Key; content: React.ReactNode }[]` | Yes | - | Slides to render. Each must have a unique key. |
| `autoPlay` | `boolean` | No | `false` | Enable auto-play. @default false |
| `autoPlayInterval` | `number` | No | `5000` | Auto-play interval in ms. @default 5000 |
| `showDots` | `boolean` | No | `true` | Show dot indicators. @default true |
| `showArrows` | `boolean` | No | `true` | Show prev/next arrows. @default true |
| `loop` | `boolean` | No | `true` | Loop back to start after last slide. @default true |
| `slidesPerView` | `1 \| 2 \| 3` | No | `1` | Number of slides visible at once. @default 1 |
| `gap` | `number` | No | `0` | Gap between slides in px. @default 0 |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` | Size variant. @default "md" |
| `orientation` | `"horizontal" \| "vertical"` | No | `horizontal` | Orientation. @default "horizontal" |
| `onSlideChange` | `(index: number) => void` | No | - | Called when active slide changes. |
| `className` | `string` | No | - | Additional class name for the root element. |

---

## Cascader

**Category:** components
**Interface:** `CascaderProps`
**Source:** `src/components/cascader/Cascader.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `CascaderOption[]` | Yes | - |  |
| `value` | `string[]` | No | - |  |
| `defaultValue` | `string[]` | No | - |  |
| `placeholder` | `string` | No | `Select...` |  |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` |  |
| `multiple` | `boolean` | No | `false` |  |
| `searchable` | `boolean` | No | `false` |  |
| `expandTrigger` | `"click" \| "hover"` | No | `click` |  |
| `displayRender` | `(labels: string[]) => string` | No | - |  |
| `onValueChange` | `(value: string[], selectedOptions: CascaderOption[]) => void` | No | - |  |
| `label` | `string` | No | - |  |
| `error` | `boolean` | No | `false` |  |
| `description` | `string` | No | - |  |
| `className` | `string` | No | - |  |

---

## CitationPanel

**Category:** components
**Interface:** `CitationPanelProps`
**Source:** `src/components/citation-panel/CitationPanel.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `CitationPanelItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Alintilar` |  |
| `description` | `React.ReactNode` | No | `Kaynak seffafligi ve alinti parcasi tek panel yuzeyinde okunur.` |  |
| `compact` | `boolean` | No | `false` |  |
| `activeCitationId` | `string \| null` | No | `null` |  |
| `emptyStateLabel` | `React.ReactNode` | No | `Kaynak bulunamadi.` |  |
| `onOpenCitation` | `(id: string, item: CitationPanelItem) => void` | No | - |  |
| `className` | `string` | No | `` |  |

---

## ColorPicker

**Category:** components
**Interface:** `ColorPickerProps`
**Source:** `src/components/color-picker/ColorPicker.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | - | Controlled color value (hex string). |
| `defaultValue` | `string` | No | `#3b82f6` | Default value for uncontrolled usage. @default "#3b82f6" |
| `format` | `ColorPickerFormat` | No | `hex` | Display format for the input. @default "hex" |
| `presets` | `ColorPickerPreset[]` | No | - | Preset color palettes. |
| `showInput` | `boolean` | No | `true` | Show the text input for manual entry. @default true |
| `showPresets` | `boolean` | No | `true` | Show preset palettes section. @default true |
| `size` | `ColorPickerSize` | No | `md` | Visual size variant. @default "md" |
| `onValueChange` | `(color: string) => void` | No | - | Callback when color changes. |
| `label` | `string` | No | - | Label displayed above the picker. |
| `description` | `string` | No | - | Description text displayed below the label. |
| `className` | `string` | No | - | Additional class name for the root element. |

---

## Combobox

**Category:** components
**Interface:** `ComboboxProps`
**Source:** `src/components/combobox/Combobox.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'onSelect'>,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `invalid` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `selectionMode` | `ComboboxSelectionMode` | No | `single` |  |
| `value` | `string \| null` | No | - |  |
| `defaultValue` | `string \| null` | No | `null` |  |
| `values` | `string[]` | No | - |  |
| `defaultValues` | `string[]` | No | - |  |
| `inputValue` | `string` | No | - |  |
| `defaultInputValue` | `string` | No | - |  |
| `options` | `Array<ComboboxOption \| ComboboxOptionGroup>` | Yes | - |  |
| `freeSolo` | `boolean` | No | `false` |  |
| `onInputChange` | `(inputValue: string, event?: React.ChangeEvent<HTMLInputElement>) => void` | No | - |  |
| `onQueryRequest` | `(query: string) => void` | No | - |  |
| `queryDebounceMs` | `number` | No | `250` |  |
| `onValueChange` | `(value: string \| null, option: ComboboxOption \| null) => void` | No | - |  |
| `onValuesChange` | `(values: string[], options: ComboboxResolvedOption[]) => void` | No | - |  |
| `onSelect` | `(value: string, option: ComboboxOption) => void` | No | - |  |
| `onTagRemove` | `(value: string, option: ComboboxResolvedOption \| null) => void` | No | - |  |
| `onFreeSoloCommit` | `(value: string) => void` | No | - |  |
| `onHighlightChange` | `(value: string \| null, option: ComboboxOption \| null) => void` | No | - |  |
| `open` | `boolean` | No | - |  |
| `defaultOpen` | `boolean` | No | `false` |  |
| `onOpenChange` | `(open: boolean) => void` | No | - |  |
| `onClose` | `() => void` | No | - |  |
| `loading` | `boolean` | No | `false` |  |
| `loadingText` | `React.ReactNode` | No | `Yukleniyor...` |  |
| `noOptionsText` | `React.ReactNode` | No | `Sonuc bulunamadi.` |  |
| `clearable` | `boolean` | No | `false` |  |
| `clearLabel` | `string` | No | `Secimi temizle` |  |
| `emptyStateLabel` | `React.ReactNode` | No | - |  |
| `showAccessReasonHint` | `boolean` | No | `true` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `renderOption` | `(option: ComboboxResolvedOption, state: ComboboxRenderOptionState) => React.ReactNode` | No | - |  |
| `disabledItemFocusPolicy` | `ComboboxDisabledItemFocusPolicy` | No | `skip` |  |
| `popupStrategy` | `ComboboxPopupStrategy` | No | `inline` |  |
| `popupSide` | `ComboboxPopupSide` | No | `bottom` |  |
| `popupAlign` | `ComboboxPopupAlign` | No | `start` |  |
| `portalTarget` | `HTMLElement \| null` | No | - |  |
| `popupClassName` | `string` | No | - |  |
| `listboxClassName` | `string` | No | - |  |
| `flipOnCollision` | `boolean` | No | `true` |  |
| `popupCollisionPadding` | `number` | No | `8` |  |
| `tagRemoveLabel` | `string` | No | `Etiketi kaldir` |  |

---

## CommandPalette

**Category:** components
**Interface:** `CommandPaletteProps`
**Source:** `src/components/command-palette/CommandPalette.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - |  |
| `items` | `CommandPaletteItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Komut Paleti` |  |
| `subtitle` | `React.ReactNode` | No | `Rota, komut ve AI destekli is akislarini tek yerden arayin.` |  |
| `query` | `string` | No | - |  |
| `defaultQuery` | `string` | No | `` |  |
| `onQueryChange` | `(query: string) => void` | No | - |  |
| `onSelect` | `(id: string, item: CommandPaletteItem) => void` | No | - |  |
| `onClose` | `() => void` | No | - |  |
| `placeholder` | `string` | No | `Komut, rota, politika ara\u2026` |  |
| `emptyStateLabel` | `string` | No | `Eslesen komut bulunamadi.` |  |
| `footer` | `React.ReactNode` | No | - |  |

---

## ConfidenceBadge

**Category:** components
**Interface:** `ConfidenceBadgeProps`
**Source:** `src/components/confidence-badge/ConfidenceBadge.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `level` | `ConfidenceLevel` | No | `medium` |  |
| `score` | `number` | No | - |  |
| `sourceCount` | `number` | No | - |  |
| `compact` | `boolean` | No | `false` |  |
| `showScore` | `boolean` | No | `true` |  |
| `label` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | - |  |

---

## ContextMenu

**Category:** components
**Interface:** `ContextMenuProps`
**Source:** `src/components/context-menu/ContextMenu.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `ContextMenuEntry[]` | Yes | - | Menu entries |
| `children` | `React.ReactElement` | Yes | - | Trigger element |
| `disabled` | `boolean` | No | `false` | Disable the context menu |
| `className` | `string` | No | - |  |

---

## DatePicker

**Category:** components
**Interface:** `DatePickerProps`
**Source:** `src/components/date-picker/DatePicker.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `invalid` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `onValueChange` | `(value: string, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `messages` | `DatePickerMessages` | No | - |  |

---

## Descriptions

**Category:** components
**Interface:** `DescriptionsProps`
**Source:** `src/components/descriptions/Descriptions.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `DescriptionsItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `columns` | `1 \| 2 \| 3` | No | `2` |  |
| `density` | `"comfortable" \| "compact"` | No | `comfortable` |  |
| `bordered` | `boolean` | No | `false` |  |
| `emptyStateLabel` | `React.ReactNode` | No | - |  |
| `localeText` | `{ emptyFallbackDescription?: React.ReactNode }` | No | - |  |
| `fullWidth` | `boolean` | No | `false` |  |
| `className` | `string` | No | - |  |

---

## DetailSectionTabs

**Category:** components
**Interface:** `DetailSectionTabsProps`
**Source:** `src/components/detail-section-tabs/DetailSectionTabs.tsx`

_No props defined._

---

## EmptyErrorLoading

**Category:** components
**Interface:** `EmptyErrorLoadingProps`
**Source:** `src/components/empty-error-loading/EmptyErrorLoading.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `EmptyErrorLoadingMode` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Durum tarifi` |  |
| `description` | `React.ReactNode` | No | `Bos, hata ve yukleme durumlari ayni geri bildirim dilini kullanir.` |  |
| `errorLabel` | `React.ReactNode` | No | `Something went wrong. Check the evidence set and upstream connections.` |  |
| `retryLabel` | `string` | No | `Retry` |  |
| `onRetry` | `() => void` | No | - |  |
| `loadingLabel` | `string` | No | `Loading` |  |
| `showSkeleton` | `boolean` | No | `true` |  |
| `className` | `string` | No | `` |  |

---

## EmptyState

**Category:** components
**Interface:** `EmptyStateProps`
**Source:** `src/components/empty-state/EmptyState.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `React.ReactNode` | No | - | Illustration or icon |
| `title` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `action` | `React.ReactNode` | No | - | Primary action (e.g. Button) |
| `secondaryAction` | `React.ReactNode` | No | - | Secondary action |
| `compact` | `boolean` | No | `false` | Compact variant for inline use |
| `className` | `string` | No | - |  |
| `access` | `AccessLevel` | No | `full` | Access level — controls visibility |
| `accessReason` | `string` | No | - | Tooltip/title text explaining access restriction |

---

## ErrorBoundary

**Category:** components
**Interface:** `ErrorBoundaryProps`
**Source:** `src/components/error-boundary/ErrorBoundary.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Child components to wrap |
| `fallback` | `ErrorBoundaryFallback` | No | - | Static fallback element, or render function receiving (error, reset) |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | No | - | Callback fired when an error is caught — use for logging / reporting |
| `className` | `string` | No | - | Additional CSS class merged onto the wrapper |

---

## FloatButton

**Category:** components
**Interface:** `FloatButtonProps`
**Source:** `src/components/float-button/FloatButton.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `React.ReactNode` | No | - | Icon rendered inside the button. |
| `label` | `string` | No | - | Text label displayed next to the icon. |
| `tooltip` | `string` | No | - | Tooltip text. @default label value |
| `shape` | `FloatButtonShape` | No | `circle` | Button shape. @default "circle" |
| `size` | `FloatButtonSize` | No | `md` | Visual size variant. @default "md" |
| `position` | `FloatButtonPosition` | No | `bottom-right` | Fixed position on the viewport. @default "bottom-right" |
| `offset` | `[number, number]` | No | - | Pixel offset from the positioned edge [horizontal, vertical]. @default [24, 24] |
| `badge` | `number \| boolean` | No | - | Badge indicator. Number shows count, true shows a dot. |
| `onClick` | `() => void` | No | - | Click handler for the primary button. |
| `items` | `FloatButtonGroupItem[]` | No | - | Speed-dial / group items that expand from the primary button. |
| `trigger` | `FloatButtonTrigger` | No | `click` | How the group menu is triggered. @default "click" |
| `open` | `boolean` | No | - | Controlled open state for the group menu. |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback when group menu open state changes. |
| `className` | `string` | No | - | Additional class name for the root wrapper. |

---

## FormField

**Category:** components
**Interface:** `FormFieldProps`
**Source:** `src/components/form-field/FormField.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - | Field label |
| `help` | `React.ReactNode` | No | - | Help text below the input |
| `error` | `React.ReactNode` | No | - | Error message — also sets error state on input |
| `required` | `boolean` | No | `false` | Mark as required |
| `optional` | `boolean` | No | `false` | Mark as optional (mutually exclusive with required) |
| `disabled` | `boolean` | No | `false` | Disabled state |
| `horizontal` | `boolean` | No | `false` | Horizontal layout |
| `htmlFor` | `string` | No | - | Custom ID for the input |
| `className` | `string` | No | - |  |
| `children` | `React.ReactNode` | Yes | - |  |

---

## InputNumber

**Category:** components
**Interface:** `InputNumberProps`
**Source:** `src/components/input-number/InputNumber.tsx`
**Extends:** `Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "value" | "defaultValue" | "type" | "prefix"
  >`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `number \| null` | No | - |  |
| `defaultValue` | `number \| null` | No | - |  |
| `onChange` | `(value: number \| null) => void` | No | - |  |
| `min` | `number` | No | - |  |
| `max` | `number` | No | - |  |
| `step` | `number` | No | `1` |  |
| `precision` | `number` | No | - | Number of decimal places to display |
| `prefix` | `React.ReactNode` | No | - |  |
| `suffix` | `React.ReactNode` | No | - |  |
| `size` | `FieldSize` | No | `md` |  |
| `disabled` | `boolean` | No | `false` |  |
| `readOnly` | `boolean` | No | `false` |  |
| `invalid` | `boolean` | No | `false` |  |
| `error` | `React.ReactNode` | No | - |  |
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `required` | `boolean` | No | `false` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `placeholder` | `string` | No | - |  |
| `className` | `string` | No | - |  |

---

## JsonViewer

**Category:** components
**Interface:** `JsonViewerProps`
**Source:** `src/components/json-viewer/JsonViewer.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `unknown` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `rootLabel` | `string` | No | `payload` |  |
| `defaultExpandedDepth` | `number` | No | `1` |  |
| `maxHeight` | `number \| string` | No | `420` |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `showTypes` | `boolean` | No | `true` |  |
| `emptyStateLabel` | `React.ReactNode` | No | - |  |
| `localeText` | `{` | No | - |  |
| `emptyStateLabel` | `React.ReactNode` | No | - |  |
| `emptyFallbackDescription` | `React.ReactNode` | No | - |  |
| `emptyNodeDescription` | `React.ReactNode` | No | - |  |
| `arraySummary` | `(count: number) => React.ReactNode` | No | - |  |
| `objectSummary` | `(count: number) => React.ReactNode` | No | - |  |
| `nullTypeLabel` | `string` | No | - |  |
| `arrayTypeLabel` | `string` | No | - |  |
| `objectTypeLabel` | `string` | No | - |  |
| `booleanTypeLabel` | `string` | No | - |  |
| `numberTypeLabel` | `string` | No | - |  |

---

## LineChart

**Category:** components
**Interface:** `LineChartProps`
**Source:** `src/components/charts/LineChart.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `series` | `ChartSeries[]` | Yes | - | Series to render as lines. |
| `labels` | `string[]` | Yes | - | X-axis labels. |
| `size` | `ChartSize` | No | `md` | Visual size variant. @default "md" |
| `showDots` | `boolean` | No | `true` | Show dot markers at data points. @default true |
| `showGrid` | `boolean` | No | `true` | Show grid lines. @default true |
| `showLegend` | `boolean` | No | `false` | Show legend below the chart. @default false |
| `showArea` | `boolean` | No | `false` | Fill area under the lines. @default false |
| `curved` | `boolean` | No | `false` | Use bezier curves instead of straight lines. @default false |
| `valueFormatter` | `(value: number) => string` | No | - | Custom value formatter. |
| `animate` | `boolean` | No | `true` | Animate line drawing on mount. @default true |
| `title` | `string` | No | - | Chart title. |
| `description` | `string` | No | - | Accessible description. |
| `localeText` | `ChartLocaleText` | No | - | Locale overrides. |
| `className` | `string` | No | - | Additional class name. |

---

## List

**Category:** components
**Interface:** `ListProps`
**Source:** `src/components/list/List.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `ListItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `density` | `ListDensity` | No | `comfortable` |  |
| `bordered` | `boolean` | No | `true` |  |
| `emptyStateLabel` | `React.ReactNode` | No | `No records found for this list.` |  |
| `localeText` | `{` | No | - |  |
| `emptyFallbackDescription` | `React.ReactNode` | No | - |  |
| `loading` | `boolean` | No | `false` |  |
| `selectedKey` | `React.Key \| null` | No | `null` |  |
| `onItemSelect` | `(key: React.Key) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |

---

## Mentions

**Category:** components
**Interface:** `MentionsProps`
**Source:** `src/components/mentions/Mentions.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | - | Current value (controlled). |
| `defaultValue` | `string` | No | `` | Default value for uncontrolled usage. |
| `options` | `MentionOption[]` | Yes | - | Available mention options. |
| `trigger` | `string` | No | `@` | Trigger character. @default "@" |
| `placeholder` | `string` | No | `Bir sey yazin...` | Placeholder text. @default "Bir sey yazin..." |
| `rows` | `number` | No | `3` | Number of textarea rows. @default 3 |
| `onValueChange` | `(value: string) => void` | No | - | Called when value changes. |
| `onSelect` | `(option: MentionOption) => void` | No | - | Called when a mention option is selected. |
| `onSearch` | `(text: string, trigger: string) => void` | No | - | Called when search text changes after trigger. |
| `filterOption` | `(input: string, option: MentionOption) => boolean` | No | - | Custom filter function. |
| `label` | `string` | No | - | Label for the textarea. |
| `error` | `boolean` | No | `false` | Error state. @default false |
| `description` | `string` | No | - | Description text below the textarea. |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` | Size variant. @default "md" |
| `className` | `string` | No | - | Additional class name for the root element. |

---

## MenuBar

**Category:** components
**Interface:** `MenuBarProps`
**Source:** `src/components/menu-bar/MenuBar.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `MenuBarItem[]` | Yes | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | - |  |
| `onValueChange` | `(value: string) => void` | No | - |  |
| `onItemClick` | `(value: string, event: React.MouseEvent<HTMLElement>) => void` | No | - |  |
| `onMenuItemSelect` | `(rootValue: string, item: MenuBarMenuItem) => void` | No | - |  |
| `openValue` | `string \| null` | No | - |  |
| `defaultOpenValue` | `string \| null` | No | `null` |  |
| `onOpenValueChange` | `(value: string \| null) => void` | No | - |  |
| `ariaLabel` | `string` | No | `Application menu` |  |
| `menuAriaLabel` | `string` | No | `Menu bar submenu` |  |
| `size` | `MenuBarSize` | No | `md` |  |
| `appearance` | `MenuBarAppearance` | No | `default` |  |
| `labelVisibility` | `MenuBarLabelVisibility` | No | `always` |  |
| `overflowBehavior` | `MenuBarOverflowBehavior` | No | `none` |  |
| `overflowLabel` | `React.ReactNode` | No | - |  |
| `maxVisibleItems` | `number` | No | - |  |
| `defaultFavoriteValues` | `string[]` | No | - |  |
| `favoriteValues` | `string[]` | No | - |  |
| `onFavoriteValuesChange` | `(values: string[]) => void` | No | - |  |
| `showFavoriteToggle` | `boolean` | No | `false` |  |
| `defaultRecentValues` | `string[]` | No | - |  |
| `recentValues` | `string[]` | No | - |  |
| `onRecentValuesChange` | `(values: string[]) => void` | No | - |  |
| `recentLimit` | `number` | No | `5` |  |
| `enableSearchHandoff` | `boolean` | No | `false` |  |
| `searchPlaceholder` | `string` | No | `Search menu` |  |
| `searchEmptyStateLabel` | `React.ReactNode` | No | `No matching routes or actions.` |  |
| `submenuTrigger` | `MenuBarSubmenuTrigger` | No | `click` |  |
| `startSlot` | `React.ReactNode` | No | - |  |
| `endSlot` | `React.ReactNode` | No | - |  |
| `currentPath` | `string` | No | - |  |
| `labelCollapseBreakpoint` | `string` | No | - |  |
| `responsiveBreakpoint` | `string` | No | - |  |
| `mobileFallback` | `MenuBarMobileFallback` | No | `none` |  |
| `utilityCollapse` | `MenuBarUtilityCollapse` | No | `preserve` |  |
| `utility` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | - |  |
| `classes` | `MenuBarClasses` | No | - |  |

---

## NavigationRail

**Category:** components
**Interface:** `NavigationRailProps`
**Source:** `src/components/navigation-rail/NavigationRail.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `NavigationRailItem[]` | Yes | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | - |  |
| `onValueChange` | `(value: string) => void` | No | - |  |
| `onItemClick` | `(` | No | - |  |
| `value` | `string` | Yes | - |  |
| `event` | `React.MouseEvent<HTMLElement>` | Yes | - |  |
| `ariaLabel` | `string` | No | `Navigation rail` |  |
| `align` | `NavigationRailAlignment` | No | `start` |  |
| `compact` | `boolean` | No | `false` |  |
| `size` | `NavigationRailSize` | No | `md` |  |
| `appearance` | `NavigationRailAppearance` | No | `default` |  |
| `labelVisibility` | `NavigationRailLabelVisibility` | No | `always` |  |
| `currentPath` | `string` | No | - |  |
| `footer` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | - |  |
| `classes` | `NavigationRailClasses` | No | - |  |

---

## NotificationDrawer

**Category:** components
**Interface:** `NotificationDrawerProps`
**Source:** `src/components/notification-drawer/NotificationDrawer.tsx`
**Extends:** `AccessControlledProps,
    Omit<
      NotificationPanelProps,
      "className" | "access" | "accessReason" | "headerAccessory"
    >`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - |  |
| `onClose` | `(reason: OverlayCloseReason) => void` | No | - |  |
| `closeLabel` | `string` | No | `Bildirim merkezini kapat` |  |
| `closeOnOverlayClick` | `boolean` | No | `true` |  |
| `closeOnEscape` | `boolean` | No | `true` |  |
| `keepMounted` | `boolean` | No | `false` |  |
| `destroyOnHidden` | `boolean` | No | `true` |  |
| `portalTarget` | `HTMLElement \| null` | No | - |  |
| `disablePortal` | `boolean` | No | `false` |  |
| `dialogLabel` | `string` | No | `Bildirimler` |  |
| `widthClassName` | `string` | No | `max-w-md` |  |
| `panelClassName` | `string` | No | `` |  |

---

## NotificationItemCard

**Category:** components
**Interface:** `NotificationItemCardProps`
**Source:** `src/components/notification-drawer/NotificationItemCard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `className` | `string` | No | `` |  |
| `removeLabel` | `string` | No | `Bildirimi kapat` |  |
| `getPrimaryActionLabel` | `(` | No | - |  |
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `onPrimaryAction` | `(item: NotificationSurfaceItem) => void` | No | - |  |
| `onRemove` | `(id: string) => void` | No | - |  |
| `formatTimestamp` | `(` | No | - |  |
| `timestamp` | `number \| undefined` | Yes | - |  |
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `selectable` | `boolean` | No | `false` |  |
| `selected` | `boolean` | No | `false` |  |
| `selectLabel` | `string` | No | - |  |
| `onSelectedChange` | `(` | No | - |  |
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `selected` | `boolean` | Yes | `false` |  |

---

## NotificationPanel

**Category:** components
**Interface:** `NotificationPanelProps`
**Source:** `src/components/notification-drawer/NotificationPanel.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `NotificationSurfaceItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Bildirimler` |  |
| `summaryLabel` | `React.ReactNode` | No | - |  |
| `emptyTitle` | `React.ReactNode` | No | `Su anda bildirim yok` |  |
| `emptyDescription` | `string` | No | `Yeni olaylar geldiginde burada gorunecek.` |  |
| `filteredEmptyTitle` | `React.ReactNode` | No | `Bu filtre icin bildirim yok` |  |
| `className` | `string` | No | `` |  |
| `markAllReadLabel` | `string` | No | `Tumunu okundu say` |  |
| `clearLabel` | `string` | No | `Temizle` |  |
| `removeLabel` | `string` | No | `Bildirimi kapat` |  |
| `headerAccessory` | `React.ReactNode` | No | - |  |
| `getPrimaryActionLabel` | `NotificationItemCardProps["getPrimaryActionLabel"]` | No | - |  |
| `onPrimaryAction` | `NotificationItemCardProps["onPrimaryAction"]` | No | - |  |
| `onRemoveItem` | `(id: string) => void` | No | - |  |
| `onMarkAllRead` | `() => void` | No | - |  |
| `onClear` | `() => void` | No | - |  |
| `formatTimestamp` | `NotificationItemCardProps["formatTimestamp"]` | No | - |  |
| `showFilters` | `boolean` | No | `false` |  |
| `availableFilters` | `NotificationPanelFilter[]` | No | - |  |
| `activeFilter` | `NotificationPanelFilter` | No | - |  |
| `defaultFilter` | `NotificationPanelFilter` | No | `all` |  |
| `onFilterChange` | `(filter: NotificationPanelFilter) => void` | No | - |  |
| `grouping` | `NotificationPanelGrouping` | No | `none` |  |
| `filterLabels` | `Partial<Record<NotificationPanelFilter, string>>` | No | - |  |
| `sectionLabels` | `Partial<` | No | - |  |
| `dateGrouping` | `NotificationPanelDateGrouping` | No | `none` |  |
| `dateSectionLabels` | `Partial<` | No | - |  |
| `dateGroupingReferenceTime` | `number` | No | - |  |
| `selectable` | `boolean` | No | `false` |  |
| `selectedIds` | `string[]` | No | - |  |
| `defaultSelectedIds` | `string[]` | No | - |  |
| `onSelectedIdsChange` | `(ids: string[]) => void` | No | - |  |
| `selectVisibleLabel` | `string` | No | `Gorunenleri sec` |  |
| `clearSelectionLabel` | `string` | No | `Secimi temizle` |  |
| `markSelectedReadLabel` | `string` | No | `Secimi okundu say` |  |
| `removeSelectedLabel` | `string` | No | `Secilenleri sil` |  |
| `selectionSummaryLabel` | `(count: number) => React.ReactNode` | No | - |  |
| `getSelectionLabel` | `(item: NotificationSurfaceItem) => string` | No | - |  |
| `onMarkSelectedRead` | `(ids: string[]) => void` | No | - |  |
| `onRemoveSelected` | `(ids: string[]) => void` | No | - |  |

---

## Pagination

**Category:** components
**Interface:** `PaginationProps`
**Source:** `src/components/pagination/Pagination.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `total` | `number` | No | - |  |
| `current` | `number` | No | - |  |
| `defaultCurrent` | `number` | No | - | Initial page for uncontrolled mode. Ignored when `current` is provided. |
| `pageSize` | `number` | No | `10` |  |
| `onChange` | `(page: number) => void` | No | - |  |
| `siblingCount` | `number` | No | `1` | Max page buttons visible (excluding prev/next) |
| `size` | `PaginationSize` | No | `md` |  |
| `showTotal` | `boolean` | No | `false` | Show total count |
| `className` | `string` | No | - |  |

---

## PieChart

**Category:** components
**Interface:** `PieChartProps`
**Source:** `src/components/charts/PieChart.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `ChartDataPoint[]` | Yes | - | Data points to render as slices. |
| `size` | `ChartSize` | No | `md` | Visual size variant. @default "md" |
| `donut` | `boolean` | No | `false` | Donut mode (ring instead of filled). @default false |
| `showLabels` | `boolean` | No | `false` | Show labels beside slices. @default false |
| `showLegend` | `boolean` | No | `false` | Show legend below the chart. @default false |
| `showPercentage` | `boolean` | No | `false` | Show percentage on slices. @default false |
| `valueFormatter` | `(value: number) => string` | No | - | Custom value formatter. |
| `innerLabel` | `React.ReactNode` | No | - | Center content for donut mode. |
| `animate` | `boolean` | No | `true` | Animate slices on mount. @default true |
| `title` | `string` | No | - | Chart title. |
| `description` | `string` | No | - | Accessible description. |
| `localeText` | `ChartLocaleText` | No | - | Locale overrides. |
| `className` | `string` | No | - | Additional class name. |

---

## PromptComposer

**Category:** components
**Interface:** `PromptComposerProps`
**Source:** `src/components/prompt-composer/PromptComposer.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | `Prompt olusturucu` |  |
| `description` | `React.ReactNode` | No | `Scope-safe prompt yazimi, tone guardrail ve source referanslari ayni composer yuzeyinde birlesir.` |  |
| `subject` | `string` | No | - |  |
| `defaultSubject` | `string` | No | `` |  |
| `onSubjectChange` | `(value: string) => void` | No | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | `` |  |
| `onValueChange` | `(value: string) => void` | No | - |  |
| `scope` | `PromptComposerScope` | No | - |  |
| `defaultScope` | `PromptComposerScope` | No | `general` |  |
| `onScopeChange` | `(value: PromptComposerScope) => void` | No | - |  |
| `tone` | `PromptComposerTone` | No | - |  |
| `defaultTone` | `PromptComposerTone` | No | `neutral` |  |
| `onToneChange` | `(value: PromptComposerTone) => void` | No | - |  |
| `maxLength` | `number` | No | `1200` |  |
| `guardrails` | `string[]` | No | - |  |
| `citations` | `string[]` | No | - |  |
| `footerNote` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | `` |  |

---

## QRCode

**Category:** components
**Interface:** `QRCodeProps`
**Source:** `src/components/qr-code/QRCode.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - |  |
| `size` | `number` | No | `128` |  |
| `color` | `string` | No | `var(--text-primary, #000000)` |  |
| `bgColor` | `string` | No | `var(--surface-canvas, #ffffff)` |  |
| `errorLevel` | `QRErrorLevel` | No | `M` |  |
| `icon` | `string` | No | - |  |
| `iconSize` | `number` | No | - |  |
| `bordered` | `boolean` | No | `true` |  |
| `status` | `"active" \| "expired" \| "loading"` | No | `active` |  |
| `onRefresh` | `() => void` | No | - |  |
| `className` | `string` | No | - |  |

---

## Rating

**Category:** components
**Interface:** `RatingProps`
**Source:** `src/components/rating/Rating.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `number` | No | - | Current value (0-max). Makes the component controlled. |
| `defaultValue` | `number` | No | `0` | Default value for uncontrolled usage. |
| `max` | `number` | No | `5` | Maximum number of stars. @default 5 |
| `allowHalf` | `boolean` | No | `false` | Allow half-star precision. @default false |
| `allowClear` | `boolean` | No | `true` | Allow clearing by clicking the current value. @default true |
| `size` | `RatingSize` | No | `md` | Visual size variant. @default "md" |
| `icon` | `React.ReactNode` | No | - | Custom filled icon. |
| `emptyIcon` | `React.ReactNode` | No | - | Custom empty icon. |
| `halfIcon` | `React.ReactNode` | No | - | Custom half icon (used when allowHalf is true). |
| `colors` | `string[]` | No | - | Array of colors applied per value (index 0 = value 1). |
| `showValue` | `boolean` | No | `false` | Show numeric value label beside the stars. @default false |
| `valueFormatter` | `(value: number) => string` | No | - | Formatter for the value label. |
| `labels` | `Record<number, string>` | No | - | Description labels keyed by value (e.g. { 1: "Kotu", 5: "Mukemmel" }). |
| `onValueChange` | `(value: number) => void` | No | - | Called when value changes. |
| `onHoverChange` | `(value: number \| null) => void` | No | - | Called when hovered value changes. null when hover ends. |
| `className` | `string` | No | - | Additional class name for the root element. |

---

## RecommendationCard

**Category:** components
**Interface:** `RecommendationCardProps`
**Source:** `src/components/recommendation-card/RecommendationCard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | Yes | - |  |
| `summary` | `React.ReactNode` | Yes | - |  |
| `recommendationType` | `React.ReactNode` | No | `Recommendation` |  |
| `rationale` | `string[]` | No | - |  |
| `citations` | `string[]` | No | - |  |
| `confidenceLevel` | `ConfidenceLevel` | No | `medium` |  |
| `confidenceScore` | `number` | No | - |  |
| `sourceCount` | `number` | No | - |  |
| `primaryActionLabel` | `string` | No | `Apply` |  |
| `secondaryActionLabel` | `string` | No | `Review` |  |
| `onPrimaryAction` | `() => void` | No | - |  |
| `onSecondaryAction` | `() => void` | No | - |  |
| `tone` | `RecommendationCardTone` | No | `info` |  |
| `compact` | `boolean` | No | `false` |  |
| `badges` | `React.ReactNode[]` | No | - |  |
| `footerNote` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | `` |  |

---

## SearchFilterListing

**Category:** components
**Interface:** `SearchFilterListingProps`
**Source:** `src/components/search-filter-listing/SearchFilterListing.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `eyebrow` | `React.ReactNode` | No | - | Baslik ustundeki kategori/context etiketi |
| `title` | `React.ReactNode` | Yes | - | Ana baslik (zorunlu) |
| `description` | `React.ReactNode` | No | - | Baslik altindaki aciklama metni |
| `meta` | `React.ReactNode` | No | - | Header sag tarafindaki meta bilgisi |
| `status` | `React.ReactNode` | No | - | Header sag tarafindaki durum badge'i |
| `actions` | `React.ReactNode` | No | - | Header aksiyonlari (butonlar vb.) |
| `filters` | `React.ReactNode` | No | - | FilterBar icerigi |
| `onReset` | `() => void` | No | - | Filtre sifirlama handler'i |
| `onSaveView` | `() => void` | No | - | Gorunum kaydetme handler'i |
| `filterExtra` | `React.ReactNode` | No | - | FilterBar ek aksiyonlari |
| `toolbar` | `React.ReactNode` | No | - | Toolbar aksiyonlari — FilterBar'in sag tarafina eklenir (reload, density vb.) |
| `onReload` | `() => void` | No | - | Yeniden yukleme handler'i — verildiginde FilterBar'da reload ikonu gosterilir |
| `activeFilters` | `ActiveFilter[]` | No | - | Uygulanmis filtre chip'leri |
| `onClearAllFilters` | `() => void` | No | - | Tum filtreleri temizle handler'i |
| `summaryItems` | `SummaryStripItem[]` | No | - | SummaryStrip KPI verileri |
| `listTitle` | `React.ReactNode` | No | `Sonuclar` | Sonuc listesi basligi |
| `listDescription` | `React.ReactNode` | No | - | Sonuc listesi aciklamasi |
| `items` | `React.ReactNode[]` | No | - | Sonuc ogeleri listesi |
| `emptyStateLabel` | `React.ReactNode` | No | `Eslesen sonuc bulunamadi.` | Bos durum mesaji |
| `results` | `React.ReactNode` | No | - | Tamamen ozel sonuc yuzeyi (items yerine kullanilir) |
| `totalCount` | `number` | No | - | Toplam sonuc sayisi — gosterildiginde "X sonuc" etiketi render edilir |
| `sortOptions` | `SortOption[]` | No | - | Siralama secenekleri |
| `activeSort` | `SortState` | No | - | Aktif siralama durumu |
| `onSortChange` | `(key: string, direction: "asc" \| "desc") => void` | No | - | Siralama degistiginde |
| `selectable` | `boolean` | No | `false` | Secim modunu etkinlestir |
| `selectedKeys` | `React.Key[]` | No | - | Secili oge key'leri |
| `onSelectionChange` | `(keys: React.Key[]) => void` | No | - | Secim degistiginde |
| `batchActions` | `React.ReactNode` | No | - | Toplu aksiyon butonlari — secim aktifken gosterilir |
| `className` | `string` | No | `` | Ek CSS siniflari |
| `role` | `string` | No | - | Section elementinin ARIA rolu |
| `loading` | `boolean` | No | `false` | Yukleniyor durumunda iskelet placeholder gosterir |
| `size` | `"default" \| "compact"` | No | `default` | Yogunluk modu: default veya compact |

---

## SearchInput

**Category:** components
**Interface:** `SearchInputProps`
**Source:** `src/components/search-input/SearchInput.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `SearchInputSize` | No | - | Component size |
| `searchSize` | `SearchInputSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `loading` | `boolean` | No | `false` | Show loading spinner |
| `clearable` | `boolean` | No | `true` | Show clear button when value is non-empty |
| `onClear` | `() => void` | No | - |  |
| `shortcutHint` | `string` | No | - | Keyboard shortcut hint (e.g. "⌘K") |
| `disabled` | `boolean` | No | `false` | Disable the search input |

---

## SectionTabs

**Category:** components
**Interface:** `SectionTabsProps`
**Source:** `src/components/detail-section-tabs/SectionTabs.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `SectionTabsItem[]` | Yes | - |  |
| `value` | `string` | No | - |  |
| `defaultValue` | `string` | No | - |  |
| `onValueChange` | `(nextValue: string) => void` | No | - |  |
| `ariaLabel` | `string` | No | `Section tabs` |  |
| `density` | `SectionTabsDensity` | No | `compact` |  |
| `layout` | `SectionTabsLayout` | No | `scroll` |  |
| `autoWrapBreakpoint` | `SectionTabsBreakpoint` | No | `2xl` |  |
| `descriptionVisibility` | `SectionTabsDescriptionVisibility` | No | `active-or-hover` |  |
| `descriptionDisplay` | `SectionTabsDescriptionDisplay` | No | `tooltip` |  |
| `className` | `string` | No | - |  |
| `classes` | `SectionTabsClasses` | No | - |  |

---

## Segmented

**Category:** components
**Interface:** `SegmentedProps`
**Source:** `src/components/segmented/Segmented.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `SegmentedItem[]` | Yes | - |  |
| `value` | `string \| string[]` | No | - |  |
| `defaultValue` | `string \| string[]` | No | - |  |
| `onValueChange` | `(nextValue: string \| string[]) => void` | No | - |  |
| `onItemClick` | `(` | No | - |  |
| `value` | `string` | Yes | - |  |
| `event` | `React.MouseEvent<HTMLButtonElement>` | Yes | - |  |
| `selectionMode` | `"single" \| "multiple"` | No | `single` |  |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` |  |
| `orientation` | `"horizontal" \| "vertical"` | No | `horizontal` |  |
| `appearance` | `"default" \| "outline" \| "ghost"` | No | - |  |
| `variant` | `"default" \| "outline" \| "ghost"` | No | - | Alias for `appearance` — aligns with the standard component API. |
| `shape` | `"rounded" \| "pill"` | No | `rounded` |  |
| `iconPosition` | `"start" \| "end" \| "top"` | No | `start` |  |
| `allowEmptySelection` | `boolean` | No | `false` |  |
| `fullWidth` | `boolean` | No | `false` |  |
| `ariaLabel` | `string` | No | - |  |
| `classes` | `SegmentedClasses` | No | - |  |
| `className` | `string` | No | - |  |

---

## Slider

**Category:** components
**Interface:** `SliderProps`
**Source:** `src/components/slider/Slider.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `invalid` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `onValueChange` | `(value: number, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `minLabel` | `React.ReactNode` | No | - |  |
| `maxLabel` | `React.ReactNode` | No | - |  |
| `valueFormatter` | `(value: number) => React.ReactNode` | No | - |  |

---

## SmartDashboard

**Category:** components
**Interface:** `SmartDashboardProps`
**Source:** `src/components/smart-dashboard/SmartDashboard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `widgets` | `DashboardWidget[]` | Yes | - |  |
| `title` | `string` | No | - |  |
| `description` | `string` | No | - |  |
| `greeting` | `string` | No | - |  |
| `onWidgetReorder` | `(keys: string[]) => void` | No | - |  |
| `onWidgetPin` | `(key: string, pinned: boolean) => void` | No | - |  |
| `refreshAll` | `() => void` | No | - |  |
| `timeRange` | `string` | No | - |  |
| `onTimeRangeChange` | `(range: string) => void` | No | - |  |
| `columns` | `2 \| 3 \| 4` | No | `3` |  |
| `density` | `DashboardDensity` | No | `comfortable` |  |
| `className` | `string` | No | - |  |

---

## Steps

**Category:** components
**Interface:** `StepsProps`
**Source:** `src/components/steps/Steps.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `StepItem[]` | Yes | - | Step definitions |
| `current` | `number` | No | - | Currently active step index (0-based) |
| `defaultCurrent` | `number` | No | - | Initial active step index for uncontrolled mode. Ignored when `current` is provided. |
| `direction` | `StepsDirection` | No | `horizontal` | Direction |
| `size` | `StepsSize` | No | `md` | Size |
| `onChange` | `(index: number) => void` | No | - | Called when a step is clicked |
| `status` | `StepStatus` | No | - | Mark current step as error |
| `dot` | `boolean` | No | `false` | Use dot style instead of numbers |
| `className` | `string` | No | - |  |

---

## Tabs

**Category:** components
**Interface:** `TabsProps`
**Source:** `src/components/tabs/Tabs.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `TabItem[]` | Yes | - |  |
| `variant` | `TabsVariant` | No | - |  |
| `size` | `TabsSize` | No | `md` |  |
| `activeKey` | `string` | No | - | Controlled active key |
| `defaultActiveKey` | `string` | No | - |  |
| `onChange` | `(key: string) => void` | No | - |  |
| `onCloseTab` | `(key: string) => void` | No | - | Called when a closable tab's close button is clicked |
| `fullWidth` | `boolean` | No | - | Full width tabs |
| `className` | `string` | No | - |  |
| `density` | `TabsDensity` | No | `comfortable` | Density controls gap, text size, and padding of tab buttons |
| `slotProps` | `SlotProps<TabsSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## ThemePresetCompare

**Category:** components
**Interface:** `ThemePresetCompareProps`
**Source:** `src/components/theme-preset/ThemePresetCompare.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `leftPreset` | `ThemePresetGalleryItem \| null` | No | - |  |
| `rightPreset` | `ThemePresetGalleryItem \| null` | No | - |  |
| `title` | `React.ReactNode` | No | `Theme preset compare` |  |
| `description` | `React.ReactNode` | No | `Presetler appearance, density, contrast ve intent eksenlerinde ayni compare matrisiyle okunur.` |  |
| `axes` | `string[]` | No | - |  |
| `className` | `string` | No | `` |  |

---

## ThemePresetGallery

**Category:** components
**Interface:** `ThemePresetGalleryProps`
**Source:** `src/components/theme-preset/ThemePresetGallery.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `presets` | `ThemePresetGalleryItem[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | `Tema on tanim galerisi` |  |
| `description` | `React.ReactNode` | No | `Resmi preset ailesi docs, runtime ve release diliyle ayni preset kimlikleri uzerinden okunur.` |  |
| `compareAxes` | `React.ReactNode[]` | No | - |  |
| `selectedPresetId` | `string \| null` | No | - |  |
| `defaultSelectedPresetId` | `string \| null` | No | `null` |  |
| `onSelectPreset` | `(presetId: string, preset: ThemePresetGalleryItem) => void` | No | - |  |
| `className` | `string` | No | `` |  |

---

## ThemePreviewCard

**Category:** components
**Interface:** `ThemePreviewCardProps`
**Source:** `src/components/theme-preview-card/ThemePreviewCard.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selected` | `boolean` | No | `false` |  |
| `className` | `string` | No | - |  |
| `localeText` | `{` | No | - |  |
| `titleText` | `React.ReactNode` | No | - |  |
| `secondaryText` | `React.ReactNode` | No | - |  |
| `saveLabel` | `React.ReactNode` | No | - |  |
| `selectedLabel` | `React.ReactNode` | No | - |  |

---

## Timeline

**Category:** components
**Interface:** `TimelineProps`
**Source:** `src/components/timeline/Timeline.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `TimelineItemProps[]` | Yes | - | Timeline items |
| `mode` | `TimelineMode` | No | `left` | Layout mode — left-aligned, right-aligned, or alternating |
| `reverse` | `boolean` | No | `false` | Reverse order of items |
| `pending` | `React.ReactNode` | No | - | Pending item content shown at the end |
| `pendingDot` | `React.ReactNode` | No | - | Custom pending dot |
| `size` | `TimelineSize` | No | `md` | Size variant |
| `showConnector` | `boolean` | No | `true` | Show connector line between dots (default: true) |
| `className` | `string` | No | - | Additional CSS class |

---

## TimelineItem

**Category:** components
**Interface:** `TimelineItemProps`
**Source:** `src/components/timeline/Timeline.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `key` | `React.Key` | Yes | - | Unique key for the item |
| `children` | `React.ReactNode` | Yes | - | Item content |
| `color` | `TimelineColor` | No | `default` | Dot color/variant |
| `dot` | `React.ReactNode` | No | - | Custom dot icon — replaces the default dot |
| `label` | `React.ReactNode` | No | - | Label (shown on opposite side in alternate mode, or above content in left/right mode) |
| `meta` | `React.ReactNode` | No | - | Timestamp or meta info |
| `pending` | `boolean` | No | - | Pending state — shows a pulsing dot animation |

---

## TimePicker

**Category:** components
**Interface:** `TimePickerProps`
**Source:** `src/components/time-picker/TimePicker.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `invalid` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `onValueChange` | `(value: string, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `messages` | `TimePickerMessages` | No | - |  |

---

## ToastProvider

**Category:** components
**Interface:** `ToastProviderProps`
**Source:** `src/components/toast/Toast.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `position` | `ToastPosition` | No | `top-right` |  |
| `duration` | `number` | No | `4000` | Default auto-dismiss duration in ms |
| `maxVisible` | `number` | No | `5` | Max visible toasts |
| `children` | `React.ReactNode` | Yes | - |  |

---

## TourCoachmarks

**Category:** components
**Interface:** `TourCoachmarksProps`
**Source:** `src/components/tour-coachmarks/TourCoachmarks.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `steps` | `TourCoachmarkStep[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `open` | `boolean` | No | - |  |
| `defaultOpen` | `boolean` | No | `false` |  |
| `currentStep` | `number` | No | - |  |
| `defaultStep` | `number` | No | `0` |  |
| `onStepChange` | `(index: number) => void` | No | - |  |
| `onClose` | `() => void` | No | - |  |
| `onFinish` | `() => void` | No | - |  |
| `allowSkip` | `boolean` | No | `true` |  |
| `showProgress` | `boolean` | No | `true` |  |
| `mode` | `"guided" \| "readonly"` | No | `guided` |  |
| `localeText` | `{` | No | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `skipLabel` | `React.ReactNode` | No | - |  |
| `closeLabel` | `React.ReactNode` | No | - |  |
| `previousLabel` | `React.ReactNode` | No | - |  |
| `nextStepLabel` | `React.ReactNode` | No | - |  |
| `finishLabel` | `React.ReactNode` | No | - |  |
| `readonlyFinishLabel` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | `` |  |
| `testIdPrefix` | `string` | No | - |  |

---

## Transfer

**Category:** components
**Interface:** `TransferProps`
**Source:** `src/components/transfer/Transfer.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataSource` | `TransferItem[]` | Yes | - | All available items |
| `targetKeys` | `string[]` | No | - | Keys of items in the right (target) list |
| `defaultTargetKeys` | `string[]` | No | - | Default target keys (uncontrolled) |
| `searchable` | `boolean` | No | `false` | Filter/search enabled |
| `filterOption` | `(inputValue: string, item: TransferItem) => boolean` | No | - | Custom filter function |
| `titles` | `[string, string]` | No | - | Titles for left/right panels |
| `size` | `TransferSize` | No | `md` | Size variant |
| `showSelectAll` | `boolean` | No | `true` | Show select all checkbox |
| `renderItem` | `(item: TransferItem) => React.ReactNode` | No | - | Custom item render |
| `localeText` | `TransferLocaleText` | No | - | Locale text |
| `onChange` | `(` | No | - | Called when items are moved |
| `targetKeys` | `string[]` | Yes | - |  |
| `direction` | `TransferDirection` | Yes | - |  |
| `moveKeys` | `string[]` | Yes | - |  |
| `onSearch` | `(direction: TransferDirection, value: string) => void` | No | - | Called when search input changes |
| `className` | `string` | No | - |  |

---

## Tree

**Category:** components
**Interface:** `TreeProps`
**Source:** `src/components/tree/Tree.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `nodes` | `TreeNode[]` | Yes | - |  |
| `title` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `density` | `TreeDensity` | No | `comfortable` |  |
| `emptyStateLabel` | `React.ReactNode` | No | - |  |
| `loading` | `boolean` | No | `false` |  |
| `selectedKey` | `React.Key \| null` | No | `null` |  |
| `onNodeSelect` | `(key: React.Key) => void` | No | - |  |
| `defaultExpandedKeys` | `React.Key[]` | No | - |  |
| `expandedKeys` | `React.Key[]` | No | - |  |
| `onExpandedKeysChange` | `(keys: React.Key[]) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `localeText` | `TreeLocaleText` | No | - |  |

---

## Upload

**Category:** components
**Interface:** `UploadProps`
**Source:** `src/components/upload/Upload.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children" | "value" | "defaultValue">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - |  |
| `description` | `React.ReactNode` | No | - |  |
| `hint` | `React.ReactNode` | No | - |  |
| `error` | `React.ReactNode` | No | - |  |
| `invalid` | `boolean` | No | `false` |  |
| `size` | `FieldSize` | No | `md` |  |
| `onFilesChange` | `(files: UploadFileItem[], event: React.ChangeEvent<HTMLInputElement>) => void` | No | - |  |
| `fullWidth` | `boolean` | No | `true` |  |
| `files` | `UploadFileItem[]` | No | - |  |
| `defaultFiles` | `UploadFileItem[]` | No | - |  |
| `maxFiles` | `number` | No | - |  |
| `emptyStateLabel` | `React.ReactNode` | No | `Dosya sec veya surukleyip birak` |  |

---

## Watermark

**Category:** components
**Interface:** `WatermarkProps`
**Source:** `src/components/watermark/Watermark.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string \| string[]` | No | - |  |
| `image` | `string` | No | - |  |
| `rotate` | `number` | No | - |  |
| `gap` | `[number, number]` | No | - |  |
| `offset` | `[number, number]` | No | - |  |
| `fontSize` | `number` | No | - |  |
| `fontColor` | `string` | No | `var(--text-disabled, rgba(0,0,0,0.15))` |  |
| `opacity` | `number` | No | - |  |
| `zIndex` | `number` | No | - |  |
| `children` | `React.ReactNode` | No | - |  |
| `className` | `string` | No | - |  |

---
