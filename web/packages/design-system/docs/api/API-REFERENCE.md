# API Reference

> Auto-generated on 2026-03-26 by `generate-api-reference.mjs`
> 107 component interfaces documented.

## Table of Contents

### Primitives

- [Alert](#alert)
- [Avatar](#avatar)
- [Badge](#badge)
- [ButtonDefault](#buttondefault)
- [Card](#card)
- [CardHeader](#cardheader)
- [Checkbox](#checkbox)
- [Dialog](#dialog)
- [Divider](#divider)
- [Drawer](#drawer)
- [Dropdown](#dropdown)
- [FieldControlShell](#fieldcontrolshell)
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
- [AppSidebar](#appsidebar)
- [AppSidebarFooter](#appsidebarfooter)
- [AppSidebarGroup](#appsidebargroup)
- [AppSidebarHeader](#appsidebarheader)
- [AppSidebarNav](#appsidebarnav)
- [AppSidebarNavItem](#appsidebarnavitem)
- [AppSidebarResizer](#appsidebarresizer)
- [AppSidebarSearch](#appsidebarsearch)
- [AppSidebarSection](#appsidebarsection)
- [AppSidebarSeparator](#appsidebarseparator)
- [AppSidebarTrigger](#appsidebartrigger)
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
| `variant` | `AlertVariant` | No | - | Semantic color variant. @default "info" |
| `severity` | `AlertVariant` | No | - | **DEPRECATED** (Use `variant` instead. Will be removed in v3.0.0.) |
| `title` | `React.ReactNode` | No | - | Optional bold heading above the message body. |
| `icon` | `React.ReactNode` | No | - | Custom leading icon; defaults to the variant's built-in icon. |
| `closable` | `boolean` | No | `false` | Show a close/dismiss button. @default false |
| `onClose` | `() => void` | No | - | Callback fired when the close button is clicked. |
| `action` | `React.ReactNode` | No | - | Action element (e.g. button) rendered below the message body. |
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
| `alt` | `string` | No | - | Alt text for the avatar image. |
| `initials` | `string` | No | - | Fallback initials (1-2 chars) |
| `size` | `AvatarSize` | No | `md` | Avatar dimensions. @default "md" |
| `shape` | `AvatarShape` | No | `circle` | Border radius shape. @default "circle" |
| `icon` | `React.ReactNode` | No | - | Fallback icon (when no src or initials) |

---

## Badge

**Category:** primitives
**Interface:** `BadgeProps`
**Source:** `src/primitives/badge/Badge.tsx`
**Extends:** `React.HTMLAttributes<HTMLSpanElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `BadgeVariant` | No | - | Visual color variant. @default "default" |
| `tone` | `BadgeVariant` | No | - | **DEPRECATED** (Use `variant` instead. Will be removed in v3.0.0.) |
| `size` | `BadgeSize` | No | `md` | Badge size controlling padding and font size. @default "md" |
| `dot` | `boolean` | No | `false` | Render as a dot (no children) |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges Badge props onto the child element. |

---

## ButtonDefault

**Category:** primitives
**Interface:** `ButtonDefaultProps`
**Source:** `src/primitives/button/Button.tsx`
**Extends:** `Omit<ButtonProps<'button'>, keyof React.ComponentPropsWithoutRef<'button'>>`

_No props defined._

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
| `orientation` | `"horizontal" \| "vertical"` | No | `horizontal` | Orientation of the divider line. @default "horizontal" |
| `label` | `string` | No | - | Label text displayed centered within the divider line. |
| `spacing` | `"none" \| "sm" \| "md" \| "lg"` | No | `md` | Margin spacing around the divider. @default "md" |
| `className` | `string` | No | - | Additional CSS class name for the divider element. |
| `role` | `React.AriaRole` | No | - | ARIA role override for the separator element. |

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
| `children` | `React.ReactElement` | Yes | - | Trigger element that toggles the dropdown on click. |
| `items` | `DropdownEntry[]` | Yes | - | Menu entries including items, separators, and group labels. |
| `placement` | `DropdownPlacement` | No | `bottom-start` | Position of the dropdown menu relative to the trigger. @default "bottom-start" |
| `minWidth` | `number` | No | `180` | Minimum width of the dropdown menu in pixels. @default 180 |
| `className` | `string` | No | - | Additional CSS class name for the dropdown menu panel. |
| `disabled` | `boolean` | No | `false` | Whether the dropdown is disabled and cannot be opened. |

---

## FieldControlShell

**Category:** primitives
**Interface:** `FieldControlShellProps`
**Source:** `src/primitives/_shared/FieldControlPrimitives.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `inputId` | `string` | Yes | - | ID of the associated input element for label association. |
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `error` | `React.ReactNode` | No | - | Error message displayed below the input. |
| `countLabel` | `string` | No | - | Character count label displayed beside the input. |
| `required` | `boolean` | No | `false` | Whether to show the required indicator. |
| `fullWidth` | `boolean` | No | `true` | Whether the shell spans the full container width. |
| `children` | `React.ReactNode` | Yes | - | Field input element(s) to wrap. |

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
| `icon` | `React.ReactNode` | Yes | - | Icon element rendered inside the button. |
| `label` | `string` | Yes | - | Accessible label (required since there's no visible text). |
| `variant` | `IconButtonVariant` | No | `ghost` | Visual style variant. @default "ghost" |
| `size` | `IconButtonSize` | No | `md` | Button dimensions. @default "md" |
| `loading` | `boolean` | No | `false` | Show a spinner instead of the icon. @default false |
| `rounded` | `boolean` | No | `false` | Use fully rounded (pill) border radius. @default false |
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
| `children` | `React.ReactNode` | Yes | - | Link content. |
| `tone` | `LinkInlineTone` | No | - | **DEPRECATED** (Visual tone. Use `variant` as a modern alias.) |
| `variant` | `LinkInlineTone` | No | - | Color variant for the link text. @default "primary" |
| `underline` | `LinkInlineUnderline` | No | `hover` | Underline behavior. @default "hover" |
| `current` | `boolean` | No | `false` | Whether this link represents the current page (sets aria-current). |
| `disabled` | `boolean` | No | `false` | Disable interaction and render as an inert span. |
| `external` | `boolean` | No | - | Force external link behavior (target="_blank", rel="noopener"). Auto-detected from href. |
| `leadingVisual` | `React.ReactNode` | No | - | Icon or element rendered before the link text. |
| `trailingVisual` | `React.ReactNode` | No | - | Icon or element rendered after the link text. |
| `localeText` | `{` | No | - | Locale text overrides. |
| `externalScreenReaderLabel` | `React.ReactNode` | No | - | Screen reader label for external link indicator. @default "External link" |
| `asChild` | `boolean` | No | `false` | Render via Slot — merges LinkInline props onto the child element. Useful for composing with router Link components. |

---

## Modal

**Category:** primitives
**Interface:** `ModalProps`
**Source:** `src/primitives/modal/Modal.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | Yes | - | Whether the modal is open and visible. |
| `children` | `React.ReactNode` | Yes | - | Content rendered inside the modal body. |
| `title` | `React.ReactNode` | No | - | Title displayed in the modal header. |
| `onClose` | `(reason?: OverlayCloseReason) => void` | No | - | Callback fired when the modal requests to close, with the close reason. |
| `footer` | `React.ReactNode` | No | - | Content rendered in the modal footer area. |
| `className` | `string` | No | - | Additional CSS class name for the dialog element. |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` | Size preset controlling the maximum width. @default "md" |
| `maxWidth` | `number \| string` | No | - | Custom maximum width as a number (px) or CSS string. |
| `fullWidth` | `boolean` | No | `false` | Whether the modal spans the full available width. |
| `surface` | `"base" \| "confirm" \| "destructive" \| "audit"` | No | - | **DEPRECATED** (Use `variant` instead. Visual surface style.) |
| `variant` | `"base" \| "confirm" \| "destructive" \| "audit"` | No | - | Visual surface variant controlling header styling. |
| `closeOnOverlayClick` | `boolean` | No | `true` | Whether clicking the overlay backdrop closes the modal. @default true |
| `closeOnEscape` | `boolean` | No | `true` | Whether pressing Escape closes the modal. @default true |
| `keepMounted` | `boolean` | No | `false` | Whether to keep the modal in the DOM when closed. |
| `destroyOnHidden` | `boolean` | No | `false` | Whether to destroy modal content when hidden. |
| `portalTarget` | `HTMLElement \| null` | No | - | Custom DOM element to render the portal into. |
| `disablePortal` | `boolean` | No | `false` | Whether to disable portal rendering and render inline. |
| `classes` | `ModalClasses` | No | - | Custom CSS class overrides for internal elements. |
| `slotProps` | `SlotProps<ModalSlot>` | No | - | Override props (className, style, etc.) on internal slot elements. |

---

## Popover

**Category:** primitives
**Interface:** `PopoverProps`
**Source:** `src/primitives/popover/Popover.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `trigger` | `React.ReactNode` | Yes | - | The element that anchors and triggers the popover. |
| `title` | `React.ReactNode` | No | - | Optional title rendered at the top of the panel. |
| `content` | `React.ReactNode` | Yes | - | Body content rendered inside the popover panel. |
| `align` | `PopoverAlign` | No | `center` | Horizontal alignment relative to the trigger. @default "center" |
| `side` | `PopoverSide` | No | `bottom` | Preferred side the popover appears on. @default "bottom" |
| `triggerMode` | `PopoverTriggerMode` | No | `click` | Interaction mode that opens the popover. @default "click" |
| `open` | `boolean` | No | - | Controlled open state. |
| `defaultOpen` | `boolean` | No | `false` | Initial open state for uncontrolled mode. @default false |
| `onOpenChange` | `(open: boolean) => void` | No | - | Callback fired when the open state changes. |
| `className` | `string` | No | `` | Additional CSS class name on the root wrapper. |
| `portalTarget` | `HTMLElement \| null` | No | - | DOM element to portal the panel into. @default document.body |
| `disablePortal` | `boolean` | No | `false` | Disable portaling and render the panel inline. @default false |
| `ariaLabel` | `string` | No | `Popover` | Accessible label for the popover dialog. @default "Popover" |
| `flipOnCollision` | `boolean` | No | `true` | Flip to the opposite side when clipped by viewport edges. @default true |
| `openDelay` | `number` | No | - | Delay in ms before showing on hover/focus triggers. |
| `closeDelay` | `number` | No | - | Delay in ms before hiding on hover/focus leave. |
| `showArrow` | `boolean` | No | `true` | Show a directional arrow pointing to the trigger. @default true |
| `arrowClassName` | `string` | No | `` | Additional CSS class name for the arrow element. |
| `panelClassName` | `string` | No | `` | Additional CSS class name for the panel element. |

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
| `children` | `React.ReactNode` | Yes | - | Single child element to merge parent props onto. |
| `className` | `string` | No | - | CSS class name merged with the child's existing className via `cn()`. |
| `style` | `React.CSSProperties` | No | - | Inline styles shallow-merged with the child's style (child wins on conflict). |
| `role` | `React.AriaRole` | No | - | ARIA role forwarded to the child element. |
| `id` | `string` | No | - | HTML id forwarded to the child element. |
| `tabIndex` | `number` | No | - | Tab index forwarded to the child element. |

---

## Spinner

**Category:** primitives
**Interface:** `SpinnerProps`
**Source:** `src/primitives/spinner/Spinner.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `SpinnerSize` | No | `md` | Spinner dimensions. @default "md" |
| `className` | `string` | No | - | Additional CSS class name. |
| `label` | `string` | No | `Loading` | Accessible label for screen readers. @default "Loading" |
| `mode` | `SpinnerMode` | No | `inline` | Display mode: inline (default) or block (centered with visible label). @default "inline" |

---

## Stack

**Category:** primitives
**Interface:** `StackProps`
**Source:** `src/primitives/stack/Stack.tsx`
**Extends:** `React.HTMLAttributes<HTMLDivElement>`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `direction` | `StackDirection` | No | `column` | Flex direction of the stack. |
| `align` | `StackAlign` | No | `center` | Cross-axis alignment of items. |
| `justify` | `StackJustify` | No | - | Main-axis justification of items. |
| `gap` | `StackGap` | No | `3` | Spacing gap between items. |
| `wrap` | `boolean` | No | `false` | Whether items wrap to multiple lines. |
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
| `label` | `React.ReactNode` | No | - | Field label displayed above the textarea. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the textarea. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `leadingVisual` | `React.ReactNode` | No | - | Visual element rendered before the text area. |
| `trailingVisual` | `React.ReactNode` | No | - | Visual element rendered after the text area. |
| `onChange` | `React.ChangeEventHandler<HTMLTextAreaElement>` | No | - | Native change event handler. |
| `onValueChange` | `(` | No | - | Callback fired with the new string value on change. |
| `value` | `string` | Yes | - |  |
| `event` | `React.ChangeEvent<HTMLTextAreaElement>` | Yes | - |  |
| `showCount` | `boolean` | No | `false` | Whether to display a character count indicator. |
| `fullWidth` | `boolean` | No | `true` | Whether the textarea spans the full container width. |
| `resize` | `TextAreaResize` | No | `vertical` | Resize behavior of the textarea. |
| `loading` | `boolean` | No | `false` | Show a loading indicator and disable editing |

---

## Tooltip

**Category:** primitives
**Interface:** `TooltipProps`
**Source:** `src/primitives/tooltip/Tooltip.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `React.ReactNode` | No | - | Tooltip content displayed in the overlay. |
| `placement` | `TooltipPlacement` | No | `top` | Side on which the tooltip appears. @default "top" |
| `align` | `TooltipAlign` | No | - | Horizontal alignment relative to the trigger. @default "center" |
| `delay` | `number` | No | - | **DEPRECATED** (Use `openDelay` instead. Delay before showing (ms).) |
| `openDelay` | `number` | No | - | Delay in ms before the tooltip appears. @default 200 |
| `closeDelay` | `number` | No | `0` | Delay in ms before the tooltip hides. @default 0 |
| `disabled` | `boolean` | No | `false` | Prevent the tooltip from appearing. @default false |
| `showArrow` | `boolean` | No | `false` | Show a directional arrow pointing to the trigger. @default false |
| `className` | `string` | No | - | Additional CSS class name for the wrapper span. |
| `asChild` | `boolean` | No | `false` | Render the trigger via Slot — merges tooltip event handlers directly onto the child element, removing the wrapper `<span>`. The child element must accept `className`, `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, and `onKeyDown` props. |
| `children` | `React.ReactNode` | Yes | - | Trigger element that the tooltip wraps. |

---

## Accordion

**Category:** components
**Interface:** `AccordionProps`
**Source:** `src/components/accordion/Accordion.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AccordionItem[]` | Yes | - | Accordion section items to render. |
| `value` | `string \| string[]` | No | - | Controlled expanded section value(s). |
| `defaultValue` | `string \| string[]` | No | - | Initially expanded section(s) for uncontrolled mode. |
| `onValueChange` | `(nextValue: string[]) => void` | No | - | Callback fired when the expanded sections change. |
| `onItemToggle` | `(itemValue: string, expanded: boolean) => void` | No | - | Callback fired when a single item is toggled. |
| `selectionMode` | `AccordionSelectionMode` | No | `multiple` | Whether one or multiple sections can be open simultaneously. |
| `ariaLabel` | `string` | No | `Accordion` | Accessible label for the accordion. |
| `size` | `AccordionSize` | No | `md` | Size variant for header and content spacing. |
| `bordered` | `boolean` | No | `true` | Whether to show borders between sections. |
| `ghost` | `boolean` | No | `false` | Whether to use the ghost (transparent) appearance. |
| `showArrow` | `boolean` | No | `true` | Whether to show the expand/collapse arrow indicator. |
| `expandIcon` | `React.ReactNode` | No | - | Custom expand icon element. |
| `expandIconPosition` | `AccordionExpandIconPosition` | No | `start` | Position of the expand icon relative to the header. |
| `disableGutters` | `boolean` | No | `false` | Whether to remove horizontal padding from sections. |
| `destroyOnHidden` | `boolean` | No | `true` | Whether to unmount collapsed section content from the DOM. |
| `collapsible` | `AccordionCollapsible` | No | `header` | Controls which part of the header triggers collapse. |
| `classes` | `AccordionClasses` | No | - | Custom class name overrides for sub-elements. |
| `className` | `string` | No | - | Additional CSS class name. |
| `slotProps` | `SlotProps<AccordionSlot>` | No | - | Override props (className, style, etc.) on internal slot elements |

---

## AdaptiveForm

**Category:** components
**Interface:** `AdaptiveFormProps`
**Source:** `src/components/adaptive-form/AdaptiveForm.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `fields` | `FormField[]` | Yes | - | Field definitions describing the form schema. |
| `values` | `Record<string, unknown>` | No | - | Controlled form values keyed by field key. |
| `onValuesChange` | `(values: Record<string, unknown>) => void` | No | - | Callback fired when any field value changes. |
| `onSubmit` | `(values: Record<string, unknown>) => void` | No | - | Callback fired on form submission with validated values. |
| `layout` | `FormLayout` | No | `vertical` | Layout direction for form fields. |
| `columns` | `1 \| 2` | No | `1` | Number of grid columns for the form layout. |
| `size` | `FormSize` | No | `md` | Size variant for input controls. |
| `submitLabel` | `string` | No | `Gonder` | Label for the submit button. |
| `resetLabel` | `string` | No | `Sifirla` | Label for the reset button. |
| `showReset` | `boolean` | No | `false` | Whether to show the reset button. |
| `loading` | `boolean` | No | `false` | Whether to show loading skeleton placeholders. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## AIActionAuditTimeline

**Category:** components
**Interface:** `AIActionAuditTimelineProps`
**Source:** `src/components/ai-action-audit-timeline/AIActionAuditTimeline.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AIActionAuditTimelineItem[]` | Yes | - | Timeline entries to render. |
| `title` | `React.ReactNode` | No | `Denetim zaman cizelgesi` | Heading text above the timeline. |
| `description` | `React.ReactNode` | No | `AI aksiyonlari ve insan onayi kronolojik iz olarak ayni timeline primitive ile gorunur.` | Descriptive text below the heading. |
| `selectedId` | `string \| null` | No | `null` | ID of the currently selected timeline entry. |
| `onSelectItem` | `(id: string, item: AIActionAuditTimelineItem) => void` | No | - | Callback fired when a timeline entry is selected. |
| `compact` | `boolean` | No | `false` | Whether to use a compact layout. |
| `emptyStateLabel` | `React.ReactNode` | No | `Timeline kaydi bulunamadi.` | Label shown when the timeline is empty. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## AIGuidedAuthoring

**Category:** components
**Interface:** `AIGuidedAuthoringProps`
**Source:** `src/components/ai-guided-authoring/AIGuidedAuthoring.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | `AI guided authoring` | Section heading. @default "AI guided authoring" |
| `description` | `React.ReactNode` | No | `Prompt yazimi, recommendation stack ve command palette ayni authoring recipe altinda birlikte calisir.` | Explanatory text below the title. |
| `promptComposerProps` | `Partial<PromptComposerProps>` | No | - | Props forwarded to the embedded PromptComposer. |
| `recommendations` | `AIGuidedAuthoringRecommendation[]` | No | - | List of recommendation cards to display alongside the composer. |
| `commandItems` | `CommandPaletteItem[]` | No | - | Items available in the command palette. |
| `confidenceLevel` | `ConfidenceLevel` | No | `medium` | Overall confidence level indicator. @default "medium" |
| `confidenceScore` | `number` | No | - | Numeric confidence score (0-100). |
| `sourceCount` | `number` | No | - | Number of sources contributing to the confidence. |
| `confidenceLabel` | `React.ReactNode` | No | `MEVCUT GUVEN` | Label above the confidence badge. |
| `paletteOpen` | `boolean` | No | - | Controlled open state for the command palette. |
| `defaultPaletteOpen` | `boolean` | No | `false` | Initial palette open state for uncontrolled mode. @default false |
| `onPaletteOpenChange` | `(open: boolean) => void` | No | - | Callback fired when the palette open state changes. |
| `onApplyRecommendation` | `(` | No | - | Callback fired when a recommendation's primary action is triggered. |
| `id` | `string` | Yes | - |  |
| `item` | `AIGuidedAuthoringRecommendation` | Yes | - |  |
| `onReviewRecommendation` | `(` | No | - | Callback fired when a recommendation's secondary action is triggered. |
| `id` | `string` | Yes | - |  |
| `item` | `AIGuidedAuthoringRecommendation` | Yes | - |  |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## AILayoutBuilder

**Category:** components
**Interface:** `AILayoutBuilderProps`
**Source:** `src/components/ai-layout-builder/AILayoutBuilder.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `blocks` | `LayoutBlock[]` | Yes | - | Array of content blocks to render in the grid. |
| `intent` | `LayoutIntent` | No | `overview` | Layout intent that controls block ordering and span heuristics. @default "overview" |
| `columns` | `1 \| 2 \| 3 \| 4` | No | `3` | Maximum number of grid columns. @default 3 |
| `density` | `LayoutDensity` | No | `comfortable` | Spacing density for the grid and block cards. @default "comfortable" |
| `onBlockReorder` | `(keys: string[]) => void` | No | - | Callback fired after a drag-and-drop reorder with the new key order. |
| `onBlockToggle` | `(key: string, collapsed: boolean) => void` | No | - | Callback fired when a block's collapsed state changes. |
| `draggable` | `boolean` | No | `false` | Enable drag-and-drop reordering of blocks. @default false |
| `title` | `string` | No | - | Optional section heading. |
| `description` | `string` | No | - | Optional subtitle below the heading. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## AnchorToc

**Category:** components
**Interface:** `AnchorTocProps`
**Source:** `src/components/anchor-toc/AnchorToc.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `AnchorTocItem[]` | Yes | - | Ordered list of table-of-contents entries. |
| `value` | `string` | No | - | Controlled active item ID. |
| `defaultValue` | `string` | No | - | Initial active item ID for uncontrolled mode. |
| `onValueChange` | `(value: string) => void` | No | - | Callback fired when the active item changes. |
| `title` | `React.ReactNode` | No | - | Heading text above the navigation list. |
| `density` | `AnchorTocDensity` | No | `comfortable` | Spacing density variant. |
| `sticky` | `boolean` | No | `false` | Whether the TOC sticks to the viewport on scroll. |
| `syncWithHash` | `boolean` | No | `true` | Whether to synchronize active item with the URL hash. |
| `className` | `string` | No | - | Additional CSS class name. |
| `localeText` | `{` | No | - | Locale-specific label overrides. |
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
| `title` | `React.ReactNode` | Yes | - | Heading text for the checkpoint card. |
| `summary` | `React.ReactNode` | Yes | - | Summary description of the approval context. |
| `status` | `ApprovalCheckpointStatus` | No | `pending` | Current approval status. |
| `checkpointLabel` | `React.ReactNode` | No | `Onay kapisi` | Label displayed on the checkpoint badge. |
| `approverLabel` | `React.ReactNode` | No | `Insan inceleme kurulu` | Label identifying the approver or review board. |
| `dueLabel` | `React.ReactNode` | No | `Yayindan once` | Due-date or deadline label. |
| `evidenceItems` | `string[]` | No | - | List of evidence item descriptions. |
| `steps` | `ApprovalCheckpointItem[]` | No | - | Checklist steps within the checkpoint. |
| `citations` | `string[]` | No | - | Citation labels rendered as badges. |
| `primaryActionLabel` | `string` | No | `Onayla` | Label for the primary action button. |
| `secondaryActionLabel` | `string` | No | `Inceleme talep et` | Label for the secondary action button. |
| `onPrimaryAction` | `() => void` | No | - | Callback fired when the primary action is triggered. |
| `onSecondaryAction` | `() => void` | No | - | Callback fired when the secondary action is triggered. |
| `footerNote` | `React.ReactNode` | No | - | Footer note displayed below actions. |
| `badges` | `React.ReactNode[]` | No | - | Additional badges rendered in the header. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## ApprovalReview

**Category:** components
**Interface:** `ApprovalReviewProps`
**Source:** `src/components/approval-review/ApprovalReview.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `React.ReactNode` | No | `Approval review` | Section heading. @default "Approval review" |
| `description` | `React.ReactNode` | No | `Human checkpoint, source evidence ve audit izleri ayni review recipe altinda gorunur.` | Explanatory text below the title. |
| `checkpoint` | `ApprovalCheckpointProps` | Yes | - | Props forwarded to the ApprovalCheckpoint sub-component. |
| `citations` | `CitationPanelItem[]` | Yes | - | Citation items displayed in the evidence panel. |
| `auditItems` | `AIActionAuditTimelineItem[]` | Yes | - | Audit trail entries for the AI action timeline. |
| `selectedCitationId` | `string \| null` | No | - | Controlled active citation ID. |
| `defaultSelectedCitationId` | `string \| null` | No | `null` | Initial citation ID for uncontrolled mode. |
| `onCitationSelect` | `(citationId: string, item: CitationPanelItem) => void` | No | - | Callback when a citation is selected. |
| `selectedAuditId` | `string \| null` | No | - | Controlled active audit item ID. |
| `defaultSelectedAuditId` | `string \| null` | No | `null` | Initial audit item ID for uncontrolled mode. |
| `onAuditSelect` | `(` | No | - | Callback when an audit item is selected. |
| `auditId` | `string` | Yes | - |  |
| `item` | `AIActionAuditTimelineItem` | Yes | - |  |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## AppSidebar

**Category:** components
**Interface:** `AppSidebarProps`
**Source:** `src/components/app-sidebar/AppSidebar.tsx`
**Extends:** `AppSidebarPropsBase`

_No props defined._

---

## AppSidebarFooter

**Category:** components
**Interface:** `AppSidebarFooterProps`
**Source:** `src/components/app-sidebar/AppSidebarFooter.tsx`
**Extends:** `AppSidebarFooterPropsBase`

_No props defined._

---

## AppSidebarGroup

**Category:** components
**Interface:** `AppSidebarGroupProps`
**Source:** `src/components/app-sidebar/AppSidebarGroup.tsx`
**Extends:** `AppSidebarGroupPropsBase`

_No props defined._

---

## AppSidebarHeader

**Category:** components
**Interface:** `AppSidebarHeaderProps`
**Source:** `src/components/app-sidebar/AppSidebarHeader.tsx`
**Extends:** `AppSidebarHeaderPropsBase`

_No props defined._

---

## AppSidebarNav

**Category:** components
**Interface:** `AppSidebarNavProps`
**Source:** `src/components/app-sidebar/AppSidebarNav.tsx`
**Extends:** `AppSidebarNavPropsBase`

_No props defined._

---

## AppSidebarNavItem

**Category:** components
**Interface:** `AppSidebarNavItemProps`
**Source:** `src/components/app-sidebar/AppSidebarNavItem.tsx`
**Extends:** `AppSidebarNavItemPropsBase`

_No props defined._

---

## AppSidebarResizer

**Category:** components
**Interface:** `AppSidebarResizerProps`
**Source:** `src/components/app-sidebar/AppSidebarResizer.tsx`
**Extends:** `AppSidebarResizerPropsBase`

_No props defined._

---

## AppSidebarSearch

**Category:** components
**Interface:** `AppSidebarSearchProps`
**Source:** `src/components/app-sidebar/AppSidebarSearch.tsx`
**Extends:** `AppSidebarSearchPropsBase`

_No props defined._

---

## AppSidebarSection

**Category:** components
**Interface:** `AppSidebarSectionProps`
**Source:** `src/components/app-sidebar/AppSidebarSection.tsx`
**Extends:** `AppSidebarSectionPropsBase`

_No props defined._

---

## AppSidebarSeparator

**Category:** components
**Interface:** `AppSidebarSeparatorProps`
**Source:** `src/components/app-sidebar/AppSidebarSeparator.tsx`
**Extends:** `AppSidebarSeparatorPropsBase`

_No props defined._

---

## AppSidebarTrigger

**Category:** components
**Interface:** `AppSidebarTriggerProps`
**Source:** `src/components/app-sidebar/AppSidebarTrigger.tsx`
**Extends:** `AppSidebarTriggerPropsBase`

_No props defined._

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
  >,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | No | - | Controlled input value. |
| `defaultValue` | `string` | No | `` | Initial value for uncontrolled mode. |
| `onChange` | `(value: string) => void` | No | - | Callback fired when the value changes. |
| `options` | `AutocompleteOption[]` | Yes | - | Available suggestion options. |
| `onSearch` | `(query: string) => void` | No | - | Async search handler — called on input change with debounce |
| `loading` | `boolean` | No | `false` | Whether a loading spinner is shown in the dropdown. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `disabled` | `boolean` | No | `false` | Whether the input is disabled. |
| `invalid` | `boolean` | No | `false` | Whether the input is in an invalid state. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `placeholder` | `string` | No | - | Placeholder text shown when empty. |
| `className` | `string` | No | - | Additional CSS class name. |
| `fullWidth` | `boolean` | No | `true` | Whether the input spans the full container width. |
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
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `BreadcrumbItem[]` | Yes | - | Ordered list of breadcrumb navigation items. |
| `separator` | `React.ReactNode` | No | - | Separator character |
| `maxItems` | `number` | No | - | Max items before collapsing |
| `className` | `string` | No | - | Additional CSS class name. |

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
| `options` | `CascaderOption[]` | Yes | - | Hierarchical option data for the cascade panels. |
| `value` | `string[]` | No | - | Controlled selected value path. |
| `defaultValue` | `string[]` | No | - | Initial value path for uncontrolled mode. |
| `placeholder` | `string` | No | `Select...` | Placeholder text shown when no value is selected. |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` | Size variant of the trigger control. |
| `multiple` | `boolean` | No | `false` | Whether multiple leaf values can be selected. |
| `searchable` | `boolean` | No | `false` | Whether inline search filtering is enabled. |
| `expandTrigger` | `"click" \| "hover"` | No | `click` | How child panels are revealed on parent options. |
| `displayRender` | `(labels: string[]) => string` | No | - | Custom renderer for the displayed selected value. |
| `onValueChange` | `(value: string[], selectedOptions: CascaderOption[]) => void` | No | - | Callback fired when the selected path changes. |
| `label` | `string` | No | - | Field label displayed above the trigger. |
| `error` | `boolean` | No | `false` | Whether to show the error state. |
| `description` | `string` | No | - | Descriptive text below the label. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## CitationPanel

**Category:** components
**Interface:** `CitationPanelProps`
**Source:** `src/components/citation-panel/CitationPanel.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `CitationPanelItem[]` | Yes | - | Citation items to display in the panel. |
| `title` | `React.ReactNode` | No | `Alintilar` | Heading text above the citation list. |
| `description` | `React.ReactNode` | No | `Kaynak seffafligi ve alinti parcasi tek panel yuzeyinde okunur.` | Descriptive text below the heading. |
| `compact` | `boolean` | No | `false` | Whether to use a compact layout. |
| `activeCitationId` | `string \| null` | No | `null` | ID of the currently selected citation. |
| `emptyStateLabel` | `React.ReactNode` | No | `Kaynak bulunamadi.` | Label shown when there are no citations. |
| `onOpenCitation` | `(id: string, item: CitationPanelItem) => void` | No | - | Callback fired when a citation is clicked. |
| `className` | `string` | No | `` | Additional CSS class name. |

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
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `invalid` | `boolean` | No | `false` | Whether the input is in an invalid state. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `selectionMode` | `ComboboxSelectionMode` | No | `single` | Selection behavior: single value, multiple values, or free-form tags. |
| `value` | `string \| null` | No | - | Controlled selected value for single mode. |
| `defaultValue` | `string \| null` | No | `null` | Initial selected value for uncontrolled single mode. |
| `values` | `string[]` | No | - | Controlled selected values for multiple/tag mode. |
| `defaultValues` | `string[]` | No | - | Initial selected values for uncontrolled multiple/tag mode. |
| `inputValue` | `string` | No | - | Controlled text in the search input. |
| `defaultInputValue` | `string` | No | - | Initial search text for uncontrolled mode. |
| `options` | `Array<ComboboxOption \| ComboboxOptionGroup>` | Yes | - | Available options or option groups. |
| `freeSolo` | `boolean` | No | `false` | Whether freeform text can be committed as a value. |
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
| `open` | `boolean` | Yes | - | Whether the command palette overlay is visible. |
| `items` | `CommandPaletteItem[]` | Yes | - | Available command items to search and select. |
| `title` | `React.ReactNode` | No | `Komut Paleti` | Heading text for the palette dialog. |
| `subtitle` | `React.ReactNode` | No | `Rota, komut ve AI destekli is akislarini tek yerden arayin.` | Subtitle text displayed below the heading. |
| `query` | `string` | No | - | Controlled search query value. |
| `defaultQuery` | `string` | No | `` | Initial search query for uncontrolled mode. |
| `onQueryChange` | `(query: string) => void` | No | - | Callback fired when the search query changes. |
| `onSelect` | `(id: string, item: CommandPaletteItem) => void` | No | - | Callback fired when a command item is selected. |
| `onClose` | `() => void` | No | - | Callback fired when the palette is dismissed. |
| `placeholder` | `string` | No | `Komut, rota, politika ara\u2026` | Placeholder text for the search input. |
| `emptyStateLabel` | `string` | No | `Eslesen komut bulunamadi.` | Label shown when no commands match the query. |
| `footer` | `React.ReactNode` | No | - | Custom content rendered in the palette footer. |

---

## ConfidenceBadge

**Category:** components
**Interface:** `ConfidenceBadgeProps`
**Source:** `src/components/confidence-badge/ConfidenceBadge.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `level` | `ConfidenceLevel` | No | `medium` | Confidence tier determining the badge tone. |
| `score` | `number` | No | - | Numeric confidence score (0-100). |
| `sourceCount` | `number` | No | - | Number of sources backing the confidence. |
| `compact` | `boolean` | No | `false` | Whether to render in compact mode with fewer details. |
| `showScore` | `boolean` | No | `true` | Whether to display the numeric score. |
| `label` | `React.ReactNode` | No | - | Custom label overriding the default level text. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## ContextMenu

**Category:** components
**Interface:** `ContextMenuProps`
**Source:** `src/components/context-menu/ContextMenu.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `ContextMenuEntry[]` | Yes | - | Menu entries (items, separators, and labels). |
| `children` | `React.ReactElement` | Yes | - | Trigger element that activates the context menu on right-click. |
| `disabled` | `boolean` | No | `false` | Whether the context menu is disabled. |
| `className` | `string` | No | - | Additional CSS class name for the menu panel. |
| `access` | `import('../../internal/access-controller').AccessLevel` | No | - | Access level controlling visibility and interactivity. |
| `accessReason` | `string` | No | - | Tooltip text explaining access restrictions. |

---

## DatePicker

**Category:** components
**Interface:** `DatePickerProps`
**Source:** `src/components/date-picker/DatePicker.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `invalid` | `boolean` | No | `false` | **DEPRECATED** (Use `error` instead. Whether the input is in an invalid state.) |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `onValueChange` | `(value: string, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - | Callback fired when the date value changes. |
| `fullWidth` | `boolean` | No | `true` | Whether the input spans the full container width. |
| `messages` | `DatePickerMessages` | No | - | Locale-specific message overrides. |

---

## Descriptions

**Category:** components
**Interface:** `DescriptionsProps`
**Source:** `src/components/descriptions/Descriptions.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `DescriptionsItem[]` | Yes | - | Array of key-value items to render. |
| `title` | `React.ReactNode` | No | - | Optional heading above the grid. |
| `description` | `React.ReactNode` | No | - | Optional subtitle below the heading. |
| `columns` | `1 \| 2 \| 3` | No | `2` | Number of grid columns. @default 2 |
| `density` | `"comfortable" \| "compact"` | No | `comfortable` | Vertical density of the grid cells. @default "comfortable" |
| `bordered` | `boolean` | No | `false` | Whether to render cell borders. @default false |
| `emptyStateLabel` | `React.ReactNode` | No | - | Custom label shown when items array is empty. |
| `localeText` | `{ emptyFallbackDescription?: React.ReactNode }` | No | - | Locale-specific text overrides. |
| `fullWidth` | `boolean` | No | `false` | Stretch grid to full container width. @default false |
| `className` | `string` | No | - | Additional CSS class name. |

---

## DetailSectionTabs

**Category:** components
**Interface:** `DetailSectionTabsProps`
**Source:** `src/components/detail-section-tabs/DetailSectionTabs.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `DetailSectionTabItem[]` | Yes | - | Tab items to render. |
| `activeTabId` | `string` | Yes | - | Currently active tab identifier. |
| `onTabChange` | `(tabId: string) => void` | Yes | - | Callback fired when the active tab changes. |
| `ariaLabel` | `string` | No | `Detay sekmeleri` | Accessible label for the tab strip. |
| `testIdPrefix` | `string` | No | - | Prefix for generated test IDs. |
| `className` | `string` | No | - | Additional CSS class name. |
| `sticky` | `boolean` | No | `true` | Whether the tab strip sticks to the top on scroll. |
| `density` | `SectionTabsDensity` | No | `compact` | Spacing density variant. |
| `autoWrapBreakpoint` | `SectionTabsBreakpoint` | No | `xl` | Breakpoint at which tabs switch from scroll to wrap layout. |
| `classes` | `SectionTabsClasses` | No | - | Custom class name overrides for sub-elements. |

---

## EmptyErrorLoading

**Category:** components
**Interface:** `EmptyErrorLoadingProps`
**Source:** `src/components/empty-error-loading/EmptyErrorLoading.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `mode` | `EmptyErrorLoadingMode` | Yes | - | Current display mode: empty, error, or loading. |
| `title` | `React.ReactNode` | No | `Durum tarifi` | Heading text displayed above the feedback area. |
| `description` | `React.ReactNode` | No | `Bos, hata ve yukleme durumlari ayni geri bildirim dilini kullanir.` | Descriptive text below the heading. |
| `errorLabel` | `React.ReactNode` | No | `Something went wrong. Check the evidence set and upstream connections.` | Message shown when mode is error. |
| `retryLabel` | `string` | No | `Retry` | Label for the retry button in error state. |
| `onRetry` | `() => void` | No | - | Callback fired when the retry button is clicked. |
| `loadingLabel` | `string` | No | `Loading` | Accessible label for the loading spinner. |
| `showSkeleton` | `boolean` | No | `true` | Whether to show skeleton placeholders during loading. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## EmptyState

**Category:** components
**Interface:** `EmptyStateProps`
**Source:** `src/components/empty-state/EmptyState.tsx`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | `React.ReactNode` | No | - | Illustration or icon displayed above the title. |
| `title` | `React.ReactNode` | No | - | Heading text for the empty state. |
| `description` | `React.ReactNode` | No | - | Descriptive text shown below the title. |
| `action` | `React.ReactNode` | No | - | Primary action element (e.g. Button). |
| `secondaryAction` | `React.ReactNode` | No | - | Secondary action element displayed beside the primary action. |
| `compact` | `boolean` | No | `false` | Compact variant with reduced padding for inline use. |
| `className` | `string` | No | - | Additional CSS class name for the root element. |
| `access` | `AccessLevel` | No | `full` | Access level — controls visibility |
| `accessReason` | `string` | No | - | Tooltip/title text explaining access restriction |

---

## ErrorBoundary

**Category:** components
**Interface:** `ErrorBoundaryProps`
**Source:** `src/components/error-boundary/ErrorBoundary.tsx`
**Extends:** `AccessControlledProps`

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
**Extends:** `AccessControlledProps`

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
  >,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `number \| null` | No | - | Controlled numeric value. |
| `defaultValue` | `number \| null` | No | - | Initial value for uncontrolled mode. |
| `onChange` | `(value: number \| null) => void` | No | - | Callback fired when the numeric value changes. |
| `min` | `number` | No | - | Minimum allowed value. |
| `max` | `number` | No | - | Maximum allowed value. |
| `step` | `number` | No | `1` | Increment/decrement step amount. |
| `precision` | `number` | No | - | Number of decimal places to display |
| `prefix` | `React.ReactNode` | No | - | Content rendered before the input. |
| `suffix` | `React.ReactNode` | No | - | Content rendered after the input. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `disabled` | `boolean` | No | `false` | Whether the input is disabled. |
| `readOnly` | `boolean` | No | `false` | Whether the input is read-only. |
| `invalid` | `boolean` | No | `false` | Whether the input is in an invalid state. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `required` | `boolean` | No | `false` | Whether the field is required. |
| `fullWidth` | `boolean` | No | `true` | Whether the input spans the full container width. |
| `placeholder` | `string` | No | - | Placeholder text shown when empty. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## JsonViewer

**Category:** components
**Interface:** `JsonViewerProps`
**Source:** `src/components/json-viewer/JsonViewer.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `unknown` | Yes | - | JSON data to display in the tree. |
| `title` | `React.ReactNode` | No | - | Heading text above the viewer. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the heading. |
| `rootLabel` | `string` | No | `payload` | Label for the root tree node. |
| `defaultExpandedDepth` | `number` | No | `1` | Number of tree levels expanded by default. |
| `maxHeight` | `number \| string` | No | `420` | Maximum height of the scrollable viewer area. |
| `fullWidth` | `boolean` | No | `true` | Whether the viewer spans full container width. |
| `showTypes` | `boolean` | No | `true` | Whether to show type badges on each node. |
| `emptyStateLabel` | `React.ReactNode` | No | - | Label shown when no data is available. |
| `localeText` | `{` | No | - | Locale-specific label overrides. |
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
| `items` | `ListItem[]` | Yes | - | Data items to render in the list. |
| `title` | `React.ReactNode` | No | - | Heading text above the list. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the heading. |
| `density` | `ListDensity` | No | `comfortable` | Row spacing density variant. |
| `bordered` | `boolean` | No | `true` | Whether to show a border around the list container. |
| `emptyStateLabel` | `React.ReactNode` | No | `No records found for this list.` | Label shown when the list is empty. |
| `localeText` | `{` | No | - | Locale-specific label overrides. |
| `emptyFallbackDescription` | `React.ReactNode` | No | - |  |
| `loading` | `boolean` | No | `false` | Whether to show loading skeleton rows. |
| `selectedKey` | `React.Key \| null` | No | `null` | Key of the currently selected item. |
| `onItemSelect` | `(key: React.Key) => void` | No | - | Callback fired when a list item is selected. |
| `fullWidth` | `boolean` | No | `true` | Whether the list spans the full container width. |

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
| `items` | `MenuBarItem[]` | Yes | - | Navigation items to render in the bar. |
| `value` | `string` | No | - | Controlled active item value. |
| `defaultValue` | `string` | No | - | Initial active item value for uncontrolled mode. |
| `onValueChange` | `(value: string) => void` | No | - | Callback fired when the active item changes. |
| `onItemClick` | `(value: string, event: React.MouseEvent<HTMLElement>) => void` | No | - | Callback fired when a bar item is clicked. |
| `onMenuItemSelect` | `(rootValue: string, item: MenuBarMenuItem) => void` | No | - | Callback fired when a submenu item is selected. |
| `openValue` | `string \| null` | No | - | Controlled open submenu value. |
| `defaultOpenValue` | `string \| null` | No | `null` | Initial open submenu value for uncontrolled mode. |
| `onOpenValueChange` | `(value: string \| null) => void` | No | - | Callback fired when the open submenu changes. |
| `ariaLabel` | `string` | No | `Application menu` | Accessible label for the navigation bar. |
| `menuAriaLabel` | `string` | No | `Menu bar submenu` | Accessible label for submenu surfaces. |
| `size` | `MenuBarSize` | No | `md` | Size variant of the menu bar. |
| `appearance` | `MenuBarAppearance` | No | `default` | Visual appearance variant. |
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
| `items` | `NavigationRailItem[]` | Yes | - | Navigation items to render in the rail. |
| `value` | `string` | No | - | Controlled active item value. |
| `defaultValue` | `string` | No | - | Initial active item value for uncontrolled mode. |
| `onValueChange` | `(value: string) => void` | No | - | Callback fired when the active item changes. |
| `onItemClick` | `(` | No | - | Callback fired when a navigation item is clicked. |
| `value` | `string` | Yes | - |  |
| `event` | `React.MouseEvent<HTMLElement>` | Yes | - |  |
| `ariaLabel` | `string` | No | `Navigation rail` | Accessible label for the navigation rail. |
| `align` | `NavigationRailAlignment` | No | `start` | Vertical alignment of items within the rail. |
| `compact` | `boolean` | No | `false` | Whether to use the narrow compact layout. |
| `size` | `NavigationRailSize` | No | `md` | Size variant for item spacing. |
| `appearance` | `NavigationRailAppearance` | No | `default` | Visual appearance variant. |
| `labelVisibility` | `NavigationRailLabelVisibility` | No | `always` | Controls when item labels are visible. |
| `currentPath` | `string` | No | - | Current URL path used for automatic active detection. |
| `footer` | `React.ReactNode` | No | - | Content rendered at the bottom of the rail. |
| `className` | `string` | No | - | Additional CSS class name. |
| `classes` | `NavigationRailClasses` | No | - | Custom class name overrides for sub-elements. |

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
| `open` | `boolean` | Yes | - | Whether the drawer is open. |
| `onClose` | `(reason: OverlayCloseReason) => void` | No | - | Callback fired when the drawer is dismissed. |
| `closeLabel` | `string` | No | `Bildirim merkezini kapat` | Accessible label for the close button. |
| `closeOnOverlayClick` | `boolean` | No | `true` | Whether clicking the overlay backdrop closes the drawer. |
| `closeOnEscape` | `boolean` | No | `true` | Whether pressing Escape closes the drawer. |
| `keepMounted` | `boolean` | No | `false` | Keep the drawer DOM mounted when closed. |
| `destroyOnHidden` | `boolean` | No | `true` | Destroy drawer content when hidden. |
| `portalTarget` | `HTMLElement \| null` | No | - | Target element for the portal. |
| `disablePortal` | `boolean` | No | `false` | Disable React portal rendering. |
| `dialogLabel` | `string` | No | `Bildirimler` | Accessible label for the drawer dialog. |
| `widthClassName` | `string` | No | `max-w-md` | Tailwind class controlling drawer width. |
| `panelClassName` | `string` | No | `` | Additional CSS class for the inner panel. |

---

## NotificationItemCard

**Category:** components
**Interface:** `NotificationItemCardProps`
**Source:** `src/components/notification-drawer/NotificationItemCard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `item` | `NotificationSurfaceItem` | Yes | - | Notification data to render. |
| `className` | `string` | No | `` | Additional CSS class name. |
| `removeLabel` | `string` | No | `Bildirimi kapat` | Accessible label for the remove button. |
| `getPrimaryActionLabel` | `(` | No | - | Returns the primary action button label for a given item, or null to hide it. |
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `onPrimaryAction` | `(item: NotificationSurfaceItem) => void` | No | - | Callback fired when the primary action button is clicked. |
| `onRemove` | `(id: string) => void` | No | - | Callback fired when the remove button is clicked. |
| `formatTimestamp` | `(` | No | - | Custom formatter for the notification timestamp. |
| `timestamp` | `number \| undefined` | Yes | - |  |
| `item` | `NotificationSurfaceItem` | Yes | - |  |
| `selectable` | `boolean` | No | `false` | Whether the card shows a selection checkbox. |
| `selected` | `boolean` | No | `false` | Whether the card is currently selected. |
| `selectLabel` | `string` | No | - | Accessible label for the selection checkbox. |
| `onSelectedChange` | `(` | No | - | Callback fired when the selection state changes. |
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
| `items` | `NotificationSurfaceItem[]` | Yes | - | Array of notification items to display. |
| `title` | `React.ReactNode` | No | `Bildirimler` | Panel heading text. |
| `summaryLabel` | `React.ReactNode` | No | - | Summary line shown below the title (e.g. unread count). |
| `emptyTitle` | `React.ReactNode` | No | `Su anda bildirim yok` | Title shown when the items array is empty. |
| `emptyDescription` | `string` | No | `Yeni olaylar geldiginde burada gorunecek.` | Description shown in the empty state. |
| `filteredEmptyTitle` | `React.ReactNode` | No | `Bu filtre icin bildirim yok` | Title shown when no items match the active filter. |
| `className` | `string` | No | `` | Additional CSS class name. |
| `markAllReadLabel` | `string` | No | `Tumunu okundu say` | Label for the "mark all as read" button. |
| `clearLabel` | `string` | No | `Temizle` | Label for the "clear" button. |
| `removeLabel` | `string` | No | `Bildirimi kapat` | Label for the per-item remove action. |
| `headerAccessory` | `React.ReactNode` | No | - | Custom element rendered in the header actions area. |
| `getPrimaryActionLabel` | `NotificationItemCardProps["getPrimaryActionLabel"]` | No | - | Returns a label for each item's primary action button. |
| `onPrimaryAction` | `NotificationItemCardProps["onPrimaryAction"]` | No | - | Callback fired when a notification's primary action is triggered. |
| `onRemoveItem` | `(id: string) => void` | No | - | Callback fired when a single notification is removed. |
| `onMarkAllRead` | `() => void` | No | - | Callback fired when "mark all as read" is clicked. |
| `onClear` | `() => void` | No | - | Callback fired when "clear" is clicked. |
| `formatTimestamp` | `NotificationItemCardProps["formatTimestamp"]` | No | - | Custom timestamp formatter for notification cards. |
| `showFilters` | `boolean` | No | `false` | Whether to show the filter bar. @default false |
| `availableFilters` | `NotificationPanelFilter[]` | No | - | Which filter options are available. |
| `activeFilter` | `NotificationPanelFilter` | No | - | Controlled active filter value. |
| `defaultFilter` | `NotificationPanelFilter` | No | `all` | Initial filter for uncontrolled mode. @default "all" |
| `onFilterChange` | `(filter: NotificationPanelFilter) => void` | No | - | Callback fired when the active filter changes. |
| `grouping` | `NotificationPanelGrouping` | No | `none` | Group items by priority. @default "none" |
| `filterLabels` | `Partial<Record<NotificationPanelFilter, string>>` | No | - | Custom labels for each filter option. |
| `sectionLabels` | `Partial<` | No | - | Custom labels for priority-based section headers. |
| `dateGrouping` | `NotificationPanelDateGrouping` | No | `none` | Group items by relative date. @default "none" |
| `dateSectionLabels` | `Partial<` | No | - | Custom labels for date-based section headers. |
| `dateGroupingReferenceTime` | `number` | No | - | Reference timestamp (epoch ms) used for date bucketing. @default Date.now() |
| `selectable` | `boolean` | No | `false` | Enable checkbox selection on notification items. @default false |
| `selectedIds` | `string[]` | No | - | Controlled set of selected item IDs. |
| `defaultSelectedIds` | `string[]` | No | - | Initial selected IDs for uncontrolled mode. |
| `onSelectedIdsChange` | `(ids: string[]) => void` | No | - | Callback fired when the selected IDs change. |
| `selectVisibleLabel` | `string` | No | `Gorunenleri sec` | Label for the "select visible" toggle button. |
| `clearSelectionLabel` | `string` | No | `Secimi temizle` | Label for the "clear selection" button. |
| `markSelectedReadLabel` | `string` | No | `Secimi okundu say` | Label for the "mark selected as read" button. |
| `removeSelectedLabel` | `string` | No | `Secilenleri sil` | Label for the "remove selected" button. |
| `selectionSummaryLabel` | `(count: number) => React.ReactNode` | No | - | Render function for the selection count badge. |
| `getSelectionLabel` | `(item: NotificationSurfaceItem) => string` | No | - | Returns an accessible label for each selectable item's checkbox. |
| `onMarkSelectedRead` | `(ids: string[]) => void` | No | - | Callback fired when selected items are marked as read. |
| `onRemoveSelected` | `(ids: string[]) => void` | No | - | Callback fired when selected items are removed. |

---

## Pagination

**Category:** components
**Interface:** `PaginationProps`
**Source:** `src/components/pagination/Pagination.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `total` | `number` | No | - | Total number of items across all pages. |
| `current` | `number` | No | - | Controlled current page number. |
| `defaultCurrent` | `number` | No | - | Initial page for uncontrolled mode. Ignored when `current` is provided. |
| `pageSize` | `number` | No | `10` | Number of items per page. |
| `onChange` | `(page: number) => void` | No | - | Callback fired when the page changes. |
| `siblingCount` | `number` | No | `1` | Max page buttons visible (excluding prev/next) |
| `size` | `PaginationSize` | No | `md` | Size variant for the pagination buttons. |
| `showTotal` | `boolean` | No | `false` | Show total count |
| `className` | `string` | No | - | Additional CSS class name. |

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
| `title` | `React.ReactNode` | No | `Prompt olusturucu` | Section heading. @default "Prompt olusturucu" |
| `description` | `React.ReactNode` | No | `Scope-safe prompt yazimi, tone guardrail ve source referanslari ayni composer yuzeyinde birlesir.` | Explanatory text below the title. |
| `subject` | `string` | No | - | Controlled prompt subject/title value. |
| `defaultSubject` | `string` | No | `` | Initial subject for uncontrolled mode. |
| `onSubjectChange` | `(value: string) => void` | No | - | Callback fired when the subject changes. |
| `value` | `string` | No | - | Controlled prompt body value. |
| `defaultValue` | `string` | No | `` | Initial body for uncontrolled mode. |
| `onValueChange` | `(value: string) => void` | No | - | Callback fired when the body text changes. |
| `scope` | `PromptComposerScope` | No | - | Controlled scope selection. |
| `defaultScope` | `PromptComposerScope` | No | `general` | Initial scope for uncontrolled mode. @default "general" |
| `onScopeChange` | `(value: PromptComposerScope) => void` | No | - | Callback fired when the scope changes. |
| `tone` | `PromptComposerTone` | No | - | Controlled tone selection. |
| `defaultTone` | `PromptComposerTone` | No | `neutral` | Initial tone for uncontrolled mode. @default "neutral" |
| `onToneChange` | `(value: PromptComposerTone) => void` | No | - | Callback fired when the tone changes. |
| `maxLength` | `number` | No | `1200` | Maximum character count for the prompt body. @default 1200 |
| `guardrails` | `string[]` | No | - | List of guardrail labels shown as warning badges. |
| `citations` | `string[]` | No | - | List of source anchor labels shown as reference badges. |
| `footerNote` | `React.ReactNode` | No | - | Optional footer note rendered below the side panel. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## QRCode

**Category:** components
**Interface:** `QRCodeProps`
**Source:** `src/components/qr-code/QRCode.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | Yes | - | Text or URL to encode in the QR code. |
| `size` | `number` | No | `128` | Size of the QR code in pixels. @default 128 |
| `color` | `string` | No | `var(--text-primary)` | Foreground color for QR modules. @default "var(--text-primary)" |
| `bgColor` | `string` | No | `var(--surface-canvas)` | Background color behind the QR code. @default "var(--surface-canvas)" |
| `errorLevel` | `QRErrorLevel` | No | `M` | Reed-Solomon error correction level. @default "M" |
| `icon` | `string` | No | - | URL of a center icon overlay image. |
| `iconSize` | `number` | No | - | Size of the center icon in pixels. Defaults to 25% of the QR size. |
| `bordered` | `boolean` | No | `true` | Render a border and padding around the QR code. @default true |
| `status` | `"active" \| "expired" \| "loading"` | No | `active` | Current status affecting the visual state. @default "active" |
| `onRefresh` | `() => void` | No | - | Callback fired when the "Refresh" button is clicked in expired state. |
| `className` | `string` | No | - | Additional CSS class name. |

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
| `title` | `React.ReactNode` | Yes | - | Recommendation heading. |
| `summary` | `React.ReactNode` | Yes | - | Brief summary of the recommendation. |
| `recommendationType` | `React.ReactNode` | No | `Recommendation` | Category label shown as a badge (e.g. "Recommendation"). |
| `rationale` | `string[]` | No | - | List of reasons supporting the recommendation. |
| `citations` | `string[]` | No | - | Source citation labels shown as muted badges. |
| `confidenceLevel` | `ConfidenceLevel` | No | `medium` | AI confidence level indicator. @default "medium" |
| `confidenceScore` | `number` | No | - | Numeric confidence score (0-100). |
| `sourceCount` | `number` | No | - | Number of sources used for the recommendation. |
| `primaryActionLabel` | `string` | No | `Apply` | Label for the primary action button. @default "Apply" |
| `secondaryActionLabel` | `string` | No | `Review` | Label for the secondary action button. @default "Review" |
| `onPrimaryAction` | `() => void` | No | - | Callback fired when the primary action is clicked. |
| `onSecondaryAction` | `() => void` | No | - | Callback fired when the secondary action is clicked. |
| `tone` | `RecommendationCardTone` | No | `info` | Semantic tone affecting the card's accent color. @default "info" |
| `compact` | `boolean` | No | `false` | Use compact layout for the confidence badge. @default false |
| `badges` | `React.ReactNode[]` | No | - | Additional badge elements rendered beside the type badge. |
| `footerNote` | `React.ReactNode` | No | - | Optional footer note below the action buttons. |
| `className` | `string` | No | `` | Additional CSS class name. |

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
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `SearchInputSize` | No | - | Component size |
| `searchSize` | `SearchInputSize` | No | - | **DEPRECATED** (Use `size` instead. Will be removed in v3.0.0.) |
| `loading` | `boolean` | No | `false` | Show loading spinner |
| `clearable` | `boolean` | No | `true` | Show clear button when value is non-empty |
| `onClear` | `() => void` | No | - | Callback fired when the clear button is clicked. |
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
| `items` | `SectionTabsItem[]` | Yes | - | Tab items to render. |
| `value` | `string` | No | - | Controlled active tab value. |
| `defaultValue` | `string` | No | - | Initial active tab value for uncontrolled mode. |
| `onValueChange` | `(nextValue: string) => void` | No | - | Callback fired when the active tab changes. |
| `ariaLabel` | `string` | No | `Section tabs` | Accessible label for the tab group. |
| `density` | `SectionTabsDensity` | No | `compact` | Spacing density variant. |
| `layout` | `SectionTabsLayout` | No | `scroll` | Layout strategy for tab overflow. |
| `autoWrapBreakpoint` | `SectionTabsBreakpoint` | No | `2xl` | Breakpoint at which auto layout switches from scroll to wrap. |
| `descriptionVisibility` | `SectionTabsDescriptionVisibility` | No | `active-or-hover` | Controls when tab descriptions become visible. |
| `descriptionDisplay` | `SectionTabsDescriptionDisplay` | No | `tooltip` | How descriptions are rendered (inline text or tooltip). |
| `className` | `string` | No | - | Additional CSS class name. |
| `classes` | `SectionTabsClasses` | No | - | Custom class name overrides for sub-elements. |

---

## Segmented

**Category:** components
**Interface:** `SegmentedProps`
**Source:** `src/components/segmented/Segmented.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `SegmentedItem[]` | Yes | - | Array of segment items to render. |
| `value` | `string \| string[]` | No | - | Controlled selected value(s). |
| `defaultValue` | `string \| string[]` | No | - | Default selected value(s) for uncontrolled mode. |
| `onValueChange` | `(nextValue: string \| string[]) => void` | No | - | Callback fired when the selection changes. |
| `onItemClick` | `(` | No | - | Callback fired when a segment item is clicked. |
| `value` | `string` | Yes | - |  |
| `event` | `React.MouseEvent<HTMLButtonElement>` | Yes | - |  |
| `selectionMode` | `"single" \| "multiple"` | No | `single` | Whether single or multiple segments can be selected. @default "single" |
| `size` | `"sm" \| "md" \| "lg"` | No | `md` | Size variant for the segment buttons. @default "md" |
| `orientation` | `"horizontal" \| "vertical"` | No | `horizontal` | Layout orientation of the segment group. @default "horizontal" |
| `appearance` | `"default" \| "outline" \| "ghost"` | No | - | **DEPRECATED** (Use `variant` instead. Visual appearance style.) |
| `variant` | `"default" \| "outline" \| "ghost"` | No | - | Visual style variant for the segmented control. |
| `shape` | `"rounded" \| "pill"` | No | `rounded` | Border radius shape of the container and items. @default "rounded" |
| `iconPosition` | `"start" \| "end" \| "top"` | No | `start` | Position of item icons relative to the label. @default "start" |
| `allowEmptySelection` | `boolean` | No | `false` | Whether deselecting all items is allowed. @default false |
| `fullWidth` | `boolean` | No | `false` | Whether the control spans the full container width. |
| `ariaLabel` | `string` | No | - | Accessible label for the segment group. |
| `classes` | `SegmentedClasses` | No | - | Custom CSS class overrides for internal elements. |
| `className` | `string` | No | - | Additional CSS class name for the root element. |

---

## Slider

**Category:** components
**Interface:** `SliderProps`
**Source:** `src/components/slider/Slider.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - | Field label displayed above the slider. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the slider. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `invalid` | `boolean` | No | `false` | **DEPRECATED** (Use `error` instead. Whether the slider is in an invalid state.) |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `onValueChange` | `(value: number, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - | Callback fired when the slider value changes. |
| `fullWidth` | `boolean` | No | `true` | Whether the slider spans the full container width. |
| `minLabel` | `React.ReactNode` | No | - | Label displayed at the minimum end of the track. |
| `maxLabel` | `React.ReactNode` | No | - | Label displayed at the maximum end of the track. |
| `valueFormatter` | `(value: number) => React.ReactNode` | No | - | Custom formatter for the displayed value. |

---

## SmartDashboard

**Category:** components
**Interface:** `SmartDashboardProps`
**Source:** `src/components/smart-dashboard/SmartDashboard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `widgets` | `DashboardWidget[]` | Yes | - | Widget definitions to display in the dashboard grid. |
| `title` | `string` | No | - | Heading text for the dashboard. |
| `description` | `string` | No | - | Descriptive text below the heading. |
| `greeting` | `string` | No | - | Personalized greeting message shown in a banner. |
| `onWidgetReorder` | `(keys: string[]) => void` | No | - | Callback fired when widget order changes. |
| `onWidgetPin` | `(key: string, pinned: boolean) => void` | No | - | Callback fired when a widget is pinned or unpinned. |
| `refreshAll` | `() => void` | No | - | Callback to refresh all widgets at once. |
| `timeRange` | `string` | No | - | Currently selected time range value. |
| `onTimeRangeChange` | `(range: string) => void` | No | - | Callback fired when the time range selector changes. |
| `columns` | `2 \| 3 \| 4` | No | `3` | Number of grid columns for the widget layout. |
| `density` | `DashboardDensity` | No | `comfortable` | Spacing density variant. |
| `className` | `string` | No | - | Additional CSS class name. |

---

## Steps

**Category:** components
**Interface:** `StepsProps`
**Source:** `src/components/steps/Steps.tsx`
**Extends:** `AccessControlledProps`

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
**Extends:** `AccessControlledProps`

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
| `leftPreset` | `ThemePresetGalleryItem \| null` | No | - | Left-side preset to compare. |
| `rightPreset` | `ThemePresetGalleryItem \| null` | No | - | Right-side preset to compare. |
| `title` | `React.ReactNode` | No | `Theme preset compare` | Heading displayed above the comparison. |
| `description` | `React.ReactNode` | No | `Presetler appearance, density, contrast ve intent eksenlerinde ayni compare matrisiyle okunur.` | Descriptive text below the heading. |
| `axes` | `string[]` | No | - | Theme axes to include in the comparison matrix. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## ThemePresetGallery

**Category:** components
**Interface:** `ThemePresetGalleryProps`
**Source:** `src/components/theme-preset/ThemePresetGallery.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `presets` | `ThemePresetGalleryItem[]` | Yes | - | Array of theme presets to display. |
| `title` | `React.ReactNode` | No | `Tema on tanim galerisi` | Gallery heading. |
| `description` | `React.ReactNode` | No | `Resmi preset ailesi docs, runtime ve release diliyle ayni preset kimlikleri uzerinden okunur.` | Explanatory text below the heading. |
| `compareAxes` | `React.ReactNode[]` | No | - | Comparison axis labels shown as badges above the grid. |
| `selectedPresetId` | `string \| null` | No | - | Controlled selected preset ID. |
| `defaultSelectedPresetId` | `string \| null` | No | `null` | Initial selected preset for uncontrolled mode. |
| `onSelectPreset` | `(presetId: string, preset: ThemePresetGalleryItem) => void` | No | - | Callback fired when a preset is selected. |
| `className` | `string` | No | `` | Additional CSS class name. |

---

## ThemePreviewCard

**Category:** components
**Interface:** `ThemePreviewCardProps`
**Source:** `src/components/theme-preview-card/ThemePreviewCard.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selected` | `boolean` | No | `false` | Whether this theme card is currently selected. |
| `className` | `string` | No | - | Additional CSS class name. |
| `localeText` | `{` | No | - | Locale-specific label overrides for the preview card. |
| `titleText` | `React.ReactNode` | No | - | Title text shown in the swatch. |
| `secondaryText` | `React.ReactNode` | No | - | Secondary descriptive text. |
| `saveLabel` | `React.ReactNode` | No | - | Label for the save action button. |
| `selectedLabel` | `React.ReactNode` | No | - | Accessible label for the selected indicator. |

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
| `label` | `React.ReactNode` | No | - | Field label displayed above the input. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `invalid` | `boolean` | No | `false` | Whether the input is in an invalid state. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `onValueChange` | `(value: string, event: React.ChangeEvent<HTMLInputElement>) => void` | No | - | Callback fired when the time value changes. |
| `fullWidth` | `boolean` | No | `true` | Whether the input spans the full container width. |
| `messages` | `TimePickerMessages` | No | - | Locale-specific message overrides. |

---

## ToastProvider

**Category:** components
**Interface:** `ToastProviderProps`
**Source:** `src/components/toast/Toast.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `position` | `ToastPosition` | No | `top-right` | Position of the toast container on screen. @default "top-right" |
| `duration` | `number` | No | `4000` | Default auto-dismiss duration in milliseconds. @default 4000 |
| `maxVisible` | `number` | No | `5` | Maximum number of toasts visible at once. @default 5 |
| `children` | `React.ReactNode` | Yes | - | Application content rendered within the toast context. |
| `className` | `string` | No | - | Additional CSS class name for the toast container. |
| `animated` | `boolean` | No | - | Whether toast animations are enabled. @default true |

---

## TourCoachmarks

**Category:** components
**Interface:** `TourCoachmarksProps`
**Source:** `src/components/tour-coachmarks/TourCoachmarks.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `steps` | `TourCoachmarkStep[]` | Yes | - | Ordered list of tour steps. |
| `title` | `React.ReactNode` | No | - | Heading text for the tour overlay. |
| `open` | `boolean` | No | - | Controlled open state of the tour. |
| `defaultOpen` | `boolean` | No | `false` | Initial open state for uncontrolled mode. |
| `currentStep` | `number` | No | - | Controlled current step index. |
| `defaultStep` | `number` | No | `0` | Initial step index for uncontrolled mode. |
| `onStepChange` | `(index: number) => void` | No | - | Callback fired when the active step changes. |
| `onClose` | `() => void` | No | - | Callback fired when the tour is dismissed. |
| `onFinish` | `() => void` | No | - | Callback fired when the final step is completed. |
| `allowSkip` | `boolean` | No | `true` | Whether the user can skip the tour. |
| `showProgress` | `boolean` | No | `true` | Whether to show the step progress indicator. |
| `mode` | `"guided" \| "readonly"` | No | `guided` | Interaction mode: guided allows navigation, readonly disables it. |
| `localeText` | `{` | No | - | Locale-specific label overrides. |
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
| `nodes` | `TreeNode[]` | Yes | - | Hierarchical node data to display. |
| `title` | `React.ReactNode` | No | - | Heading text above the tree. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the heading. |
| `density` | `TreeDensity` | No | `comfortable` | Node spacing density variant. |
| `emptyStateLabel` | `React.ReactNode` | No | - | Label shown when the tree is empty. |
| `loading` | `boolean` | No | `false` | Whether to show loading skeleton placeholders. |
| `selectedKey` | `React.Key \| null` | No | `null` | Key of the currently selected node. |
| `onNodeSelect` | `(key: React.Key) => void` | No | - | Callback fired when a node is selected. |
| `defaultExpandedKeys` | `React.Key[]` | No | - | Initially expanded node keys for uncontrolled mode. |
| `expandedKeys` | `React.Key[]` | No | - | Controlled set of expanded node keys. |
| `onExpandedKeysChange` | `(keys: React.Key[]) => void` | No | - | Callback fired when expanded keys change. |
| `fullWidth` | `boolean` | No | `true` | Whether the tree spans the full container width. |
| `localeText` | `TreeLocaleText` | No | - | Locale-specific label overrides. |

---

## Upload

**Category:** components
**Interface:** `UploadProps`
**Source:** `src/components/upload/Upload.tsx`
**Extends:** `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "children" | "value" | "defaultValue">,
    AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `React.ReactNode` | No | - | Field label displayed above the drop zone. |
| `description` | `React.ReactNode` | No | - | Descriptive text below the label. |
| `hint` | `React.ReactNode` | No | - | Help text displayed below the input. |
| `error` | `React.ReactNode` | No | - | Error message that activates the invalid state. |
| `invalid` | `boolean` | No | `false` | Whether the input is in an invalid state. |
| `size` | `FieldSize` | No | `md` | Size variant of the field control. |
| `onFilesChange` | `(files: UploadFileItem[], event: React.ChangeEvent<HTMLInputElement>) => void` | No | - | Callback fired when selected files change. |
| `fullWidth` | `boolean` | No | `true` | Whether the upload zone spans the full container width. |
| `files` | `UploadFileItem[]` | No | - | Controlled list of selected files. |
| `defaultFiles` | `UploadFileItem[]` | No | - | Initial file list for uncontrolled mode. |
| `maxFiles` | `number` | No | - | Maximum number of files allowed. |
| `emptyStateLabel` | `React.ReactNode` | No | `Dosya sec veya surukleyip birak` | Placeholder text shown when no files are selected. |

---

## Watermark

**Category:** components
**Interface:** `WatermarkProps`
**Source:** `src/components/watermark/Watermark.tsx`
**Extends:** `AccessControlledProps`

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `content` | `string \| string[]` | No | - | Text content for the watermark; pass an array for multi-line. |
| `image` | `string` | No | - | Image URL to use as watermark instead of text. |
| `rotate` | `number` | No | - | Rotation angle in degrees. @default -22 |
| `gap` | `[number, number]` | No | - | Horizontal and vertical gap between watermark tiles in pixels. @default [100,100] |
| `offset` | `[number, number]` | No | - | X/Y offset of the watermark within each tile. |
| `fontSize` | `number` | No | - | Font size in pixels for text watermarks. @default 14 |
| `fontColor` | `string` | No | `var(--text-disabled)` | CSS color value for text watermarks. |
| `opacity` | `number` | No | - | Opacity of the watermark layer (0-1). @default 0.15 |
| `zIndex` | `number` | No | - | CSS z-index of the watermark overlay. @default 9 |
| `children` | `React.ReactNode` | No | - | Content to render beneath the watermark. |
| `className` | `string` | No | - | Additional CSS class name. |

---
