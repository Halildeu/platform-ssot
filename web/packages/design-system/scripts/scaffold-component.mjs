#!/usr/bin/env node

/**
 * scaffold-component.mjs
 *
 * Creates the baseline file structure for a new @mfe/design-system component.
 *
 * Usage:
 *   node scripts/scaffold-component.mjs ColorPicker --type component --profile composed
 *   node scripts/scaffold-component.mjs Badge --type primitive --profile display
 *   node scripts/scaffold-component.mjs DialogSurface --type primitive --profile overlay-modal --with-contract-test --with-doc-stub
 *   node scripts/scaffold-component.mjs --list-profiles
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PROFILES_PATH = path.join(ROOT, "docs", "component-authoring.profiles.v1.json");

const profileConfig = JSON.parse(fs.readFileSync(PROFILES_PATH, "utf-8"));

// ---------------------------------------------------------------------------
// Parse arguments
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.includes("--list-profiles")) {
  console.log("\nAvailable authoring profiles:\n");
  for (const [name, profile] of Object.entries(profileConfig.profiles)) {
    console.log(`- ${name}`);
    console.log(`  ${profile.summary}`);
    console.log(`  allowed types: ${profile.allowedTypes.join(", ")}`);
    console.log(
      `  artifacts: nextSteps=${profile.artifacts.nextSteps}, story=${profile.artifacts.story}, unitTest=${profile.artifacts.unitTest}, contractTest=${profile.artifacts.contractTest}, docStub=${profile.artifacts.docStub}, apiReference=${profile.artifacts.apiReference}`,
    );
  }
  console.log("\nDefaults:");
  console.log(`  primitive -> ${profileConfig.defaults.primitive}`);
  console.log(`  component -> ${profileConfig.defaults.component}`);
  process.exit(0);
}

if (args.length === 0 || args[0].startsWith("--")) {
  console.error(
    [
      "Usage:",
      "  node scripts/scaffold-component.mjs <ComponentName> [--type primitive|component] [--profile <profile>] [--with-contract-test] [--with-doc-stub]",
      "  node scripts/scaffold-component.mjs --list-profiles",
    ].join("\n"),
  );
  process.exit(1);
}

const componentName = args[0];
const typeFlag = args.indexOf("--type");
const componentType =
  typeFlag !== -1 && args[typeFlag + 1] ? args[typeFlag + 1] : "component";

if (!["primitive", "component"].includes(componentType)) {
  console.error(`Invalid --type: "${componentType}". Must be "primitive" or "component".`);
  process.exit(1);
}

const profileFlag = args.indexOf("--profile");
const profileName =
  profileFlag !== -1 && args[profileFlag + 1]
    ? args[profileFlag + 1]
    : profileConfig.defaults[componentType];
const withContractTest = args.includes("--with-contract-test");
const withDocStub = args.includes("--with-doc-stub");

const profile = profileConfig.profiles[profileName];

if (!profile) {
  console.error(`Unknown --profile: "${profileName}". Run --list-profiles to inspect valid options.`);
  process.exit(1);
}

if (!profile.allowedTypes.includes(componentType)) {
  console.error(
    `Profile "${profileName}" cannot be used with type "${componentType}". Allowed types: ${profile.allowedTypes.join(", ")}`,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Derive names
// ---------------------------------------------------------------------------

function toKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

const pascal = componentName;
const kebab = toKebab(pascal);
const baseDir = componentType === "primitive" ? "primitives" : "components";
const storybookBucket = componentType === "primitive" ? "Primitives" : "Components";
const storybookTitle = profile.storyCategory.replace("{bucket}", storybookBucket) + `/${pascal}`;
const relToSrc = "../..";
const authoringMetaFilename = "component.authoring.v1.json";
const authoringNextStepsFilename = "component.authoring.next-steps.md";
const fieldPrimitivesImport =
  componentType === "primitive"
    ? "../_shared/FieldControlPrimitives"
    : "../../primitives/_shared/FieldControlPrimitives";
const dir = path.join(ROOT, "src", baseDir, kebab);

if (fs.existsSync(dir)) {
  console.error(`Directory already exists: ${dir}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Template helpers
// ---------------------------------------------------------------------------

function withClientDirective(content) {
  return profile.clientDirective === "always" ? `"use client";\n\n${content}` : content;
}

function buildDisplayComponent() {
  return withClientDirective(`import React, { forwardRef } from "react";
import { cn } from "${relToSrc}/utils/cn";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export interface ${pascal}Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ${pascal} = forwardRef<HTMLDivElement, ${pascal}Props>(
  ({ className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

${pascal}.displayName = "${pascal}";
`);
}

function buildInteractiveAccessComponent() {
  return withClientDirective(`import React, { forwardRef } from "react";
import { cn } from "${relToSrc}/utils/cn";
import {
  resolveAccessState,
  shouldBlockInteraction,
  stateAttrs,
  focusRingClass,
  guardAria,
  type AccessControlledProps,
} from "${relToSrc}/internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export type ${pascal}Size = "sm" | "md" | "lg";

export interface ${pascal}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    AccessControlledProps {
  size?: ${pascal}Size;
  disabled?: boolean;
  children?: React.ReactNode;
}

const sizeStyles: Record<${pascal}Size, string> = {
  sm: "px-2 py-1 text-xs rounded-md",
  md: "px-3 py-2 text-sm rounded-lg",
  lg: "px-4 py-3 text-base rounded-xl",
};

export const ${pascal} = forwardRef<HTMLDivElement, ${pascal}Props>(
  (
    {
      size = "md",
      disabled = false,
      access = "full",
      accessReason,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const blocked = shouldBlockInteraction(access, disabled);

    return (
      <div
        ref={ref}
        title={accessReason}
        className={cn(
          "inline-flex items-center justify-center",
          focusRingClass("ring"),
          sizeStyles[size],
          blocked && "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={
          blocked
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : onClick
        }
        {...stateAttrs({
          access,
          disabled: blocked,
          component: "${kebab}",
        })}
        {...guardAria({ access, disabled: blocked })}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

${pascal}.displayName = "${pascal}";
`);
}

function buildFieldShellComponent() {
  return withClientDirective(`import React, { forwardRef, useId, useState } from "react";
import { cn } from "${relToSrc}/utils/cn";
import {
  resolveAccessState,
  withAccessGuard,
  stateAttrs,
  guardAria,
  type AccessControlledProps,
} from "${relToSrc}/internal/interaction-core";
import {
  FieldControlShell,
  getFieldFrameClass,
  getFieldTone,
} from "${fieldPrimitivesImport}";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export type ${pascal}Size = "sm" | "md" | "lg";

export interface ${pascal}Props
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "value" | "defaultValue" | "onChange"
    >,
    AccessControlledProps {
  size?: ${pascal}Size;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  hint?: React.ReactNode;
  error?: boolean | string | React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const ${pascal} = forwardRef<HTMLInputElement, ${pascal}Props>(
  (
    {
      size = "md",
      value,
      defaultValue = "",
      onValueChange,
      label,
      description,
      hint,
      error = false,
      fullWidth = true,
      loading = false,
      disabled = false,
      readOnly = false,
      required = false,
      access = "full",
      accessReason,
      className,
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    const isDisabled = disabled || loading || accessState.isDisabled;
    const isReadonly = readOnly || accessState.isReadonly;
    const tone = getFieldTone({
      invalid: Boolean(error),
      disabled: isDisabled,
      readonly: isReadonly,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onValueChange?.(event.target.value);
      rest.onChange?.(event);
    };

    const guardedChange = withAccessGuard<React.ChangeEvent<HTMLInputElement>>(
      access,
      handleChange,
      disabled,
    );

    return (
      <FieldControlShell
        id={inputId}
        label={label}
        description={description}
        hint={hint}
        error={error}
        required={required}
        disabled={isDisabled}
        className={fullWidth ? "w-full" : undefined}
      >
        <div
          title={accessReason}
          className={cn(getFieldFrameClass(size, tone, fullWidth, className), "relative")}
          {...stateAttrs({
            access,
            disabled: isDisabled,
            readonly: isReadonly,
            error: Boolean(error),
            loading,
            component: "${kebab}",
          })}
        >
          <input
            ref={ref}
            id={inputId}
            value={currentValue}
            disabled={isDisabled}
            readOnly={isReadonly}
            aria-invalid={Boolean(error) || undefined}
            className="w-full bg-transparent outline-none"
            onChange={guardedChange}
            {...guardAria({ access, disabled: isDisabled, loading })}
            {...rest}
          />
        </div>
      </FieldControlShell>
    );
  },
);

${pascal}.displayName = "${pascal}";
`);
}

function buildComposedComponent() {
  return withClientDirective(`import React, { forwardRef } from "react";
import { cn } from "${relToSrc}/utils/cn";
import {
  resolveAccessState,
  stateAttrs,
  type AccessControlledProps,
} from "${relToSrc}/internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export interface ${pascal}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    AccessControlledProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const ${pascal} = forwardRef<HTMLDivElement, ${pascal}Props>(
  ({ title, children, access = "full", accessReason, className, ...rest }, ref) => {
    const accessState = resolveAccessState(access);
    if (accessState.isHidden) return null;

    return (
      <section
        ref={ref}
        title={accessReason}
        className={cn("flex flex-col gap-3 rounded-xl", className)}
        {...stateAttrs({ access, component: "${kebab}" })}
        {...rest}
      >
        {title ? <header className="text-sm font-medium">{title}</header> : null}
        <div>{children}</div>
      </section>
    );
  },
);

${pascal}.displayName = "${pascal}";
`);
}

function buildOverlayModalComponent() {
  return withClientDirective(`import React, { useEffect, useId, useRef } from "react";
import ReactDOM from "react-dom";
import { cn } from "${relToSrc}/utils/cn";
import { stateAttrs } from "${relToSrc}/internal/interaction-core";
import {
  registerLayer,
  unregisterLayer,
  useEscapeKey,
  useScrollLock,
  useFocusRestore,
} from "${relToSrc}/internal/overlay-engine";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export interface ${pascal}Props {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export function ${pascal}({
  open,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  className,
}: ${pascal}Props) {
  const layerId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusRestore(open);
  useEscapeKey(open && closeOnEscape, onClose);

  useEffect(() => {
    if (!open) return;
    registerLayer(layerId, "modal");
    return () => unregisterLayer(layerId);
  }, [open, layerId]);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center"
      {...stateAttrs({ component: "${kebab}", state: "open" })}
    >
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "relative z-[1301] w-full max-w-lg rounded-xl bg-[var(--surface-default)] p-6 shadow-2xl",
          className,
        )}
      >
        {title ? <h2 className="mb-3 text-lg font-semibold">{title}</h2> : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}

${pascal}.displayName = "${pascal}";
`);
}

function buildOverlayNonModalComponent() {
  return withClientDirective(`import React, { useEffect, useId, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "${relToSrc}/utils/cn";
import { stateAttrs } from "${relToSrc}/internal/interaction-core";
import {
  registerLayer,
  unregisterLayer,
  useEscapeKey,
  useOutsideClick,
} from "${relToSrc}/internal/overlay-engine";

/* ------------------------------------------------------------------ */
/*  ${pascal} -- profile: ${profileName}                               */
/* ------------------------------------------------------------------ */

export interface ${pascal}Props {
  triggerLabel?: string;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function ${pascal}({
  triggerLabel = "${pascal}",
  defaultOpen = false,
  children,
  className,
}: ${pascal}Props) {
  const [open, setOpen] = useState(defaultOpen);
  const layerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    registerLayer(layerId, "popover");
    return () => unregisterLayer(layerId);
  }, [open, layerId]);

  useEscapeKey(open, () => setOpen(false));
  useOutsideClick({
    active: open,
    onOutsideClick: () => setOpen(false),
    excludeRefs: [triggerRef, panelRef],
  });

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen((v) => !v)}>
        {triggerLabel}
      </button>
      {open
        ? ReactDOM.createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="false"
              className={cn(
                "fixed left-1/2 top-24 z-[1500] w-80 -translate-x-1/2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 shadow-xl",
                className,
              )}
              {...stateAttrs({ component: "${kebab}", state: "open" })}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

${pascal}.displayName = "${pascal}";
`);
}

function buildComponentFile() {
  switch (profileName) {
    case "display":
      return buildDisplayComponent();
    case "interactive-access":
      return buildInteractiveAccessComponent();
    case "field-shell":
      return buildFieldShellComponent();
    case "composed":
      return buildComposedComponent();
    case "overlay-modal":
      return buildOverlayModalComponent();
    case "overlay-nonmodal":
      return buildOverlayNonModalComponent();
    default:
      throw new Error(`No template implementation for profile "${profileName}".`);
  }
}

function buildIndexFile() {
  return `export { ${pascal} } from "./${pascal}";\nexport type { ${pascal}Props } from "./${pascal}";\n`;
}

function buildContractTestFile() {
  const renderBlock =
    profileName === "field-shell"
      ? `<${pascal} aria-label="${kebab}" label="${pascal}" />`
      : profileName === "overlay-modal"
        ? `<${pascal} open onClose={() => {}} title="${pascal}" />`
        : profileName === "overlay-nonmodal"
          ? `<${pascal} triggerLabel="${pascal}">Panel</${pascal}>`
          : `<${pascal}>Contract</${pascal}>`;

  const rootExpectation =
    profileName === "field-shell"
      ? `const ref = React.createRef<HTMLInputElement>();
    render(<${pascal} ref={ref} aria-label="${kebab}" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);`
      : profileName === "overlay-modal" || profileName === "overlay-nonmodal"
        ? `render(${renderBlock});
    expect(typeof ${pascal}.displayName).toBe("string");`
        : `const ref = React.createRef<HTMLDivElement>();
    render(<${pascal} ref={ref}>Contract</${pascal}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);`;

  const renderExpectation =
    profileName === "overlay-modal"
      ? `expect(screen.getByRole("dialog")).toBeInTheDocument();`
      : profileName === "overlay-nonmodal"
        ? `expect(screen.getByRole("button", { name: "${pascal}" })).toBeInTheDocument();`
        : `expect(screen.getByText(/${pascal}|Contract/)).toBeInTheDocument();`;

  const containerKey =
    profileName === "overlay-modal" || profileName === "overlay-nonmodal"
      ? "baseElement"
      : "container";

  return `// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ${pascal} } from "../${pascal}";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

afterEach(() => {
  cleanup();
});

describe("${pascal} contract", () => {
  it("has displayName", () => {
    expect(${pascal}.displayName).toBe("${pascal}");
  });

  it("renders without crashing", () => {
    render(${renderBlock});
    ${renderExpectation}
  });

  it("preserves the expected root contract", () => {
    ${rootExpectation}
  });
});

describe("${pascal} contract -- accessibility", () => {
  it("has no axe violations", async () => {
    const { ${containerKey} } = render(${renderBlock});
    await expectNoA11yViolations(${containerKey});
  });
});
`;
}

function buildTestFile() {
  const commonImports = `// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ${pascal} } from "../${pascal}";
import { expectNoA11yViolations } from "../../../__tests__/a11y-utils";

afterEach(() => {
  cleanup();
});
`;

  switch (profile.testPreset) {
    case "display":
      return `${commonImports}
describe("${pascal} -- render", () => {
  it("renders children", () => {
    render(<${pascal}>Test</${pascal}>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("${pascal} -- ref forwarding", () => {
  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<${pascal} ref={ref}>Test</${pascal}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("${pascal} -- accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<${pascal}>Accessible</${pascal}>);
    await expectNoA11yViolations(container);
  });
});
`;

    case "field-shell":
      return `${commonImports}
describe("${pascal} -- render", () => {
  it("renders with label", () => {
    render(<${pascal} label="Label" />);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });
});

describe("${pascal} -- ref forwarding", () => {
  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<${pascal} ref={ref} aria-label="field" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

describe("${pascal} -- controlled / uncontrolled", () => {
  it("supports uncontrolled mode", async () => {
    const user = userEvent.setup();
    render(<${pascal} aria-label="field" defaultValue="a" />);
    const input = screen.getByLabelText("field");
    await user.clear(input);
    await user.type(input, "b");
    expect(input).toHaveValue("b");
  });

  it("supports controlled mode", async () => {
    const handleValueChange = vi.fn();
    render(
      <${pascal}
        aria-label="field"
        value="fixed"
        onValueChange={handleValueChange}
      />,
    );
    expect(screen.getByLabelText("field")).toHaveValue("fixed");
  });
});

describe("${pascal} -- access control", () => {
  it("returns null when access=hidden", () => {
    const { container } = render(<${pascal} access="hidden" aria-label="field" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("${pascal} -- a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<${pascal} label="Label" aria-label="field" />);
    await expectNoA11yViolations(container);
  });
});
`;

    case "overlay-modal":
      return `${commonImports}
describe("${pascal} -- render", () => {
  it("does not render when closed", () => {
    const { container } = render(<${pascal} open={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders when open", () => {
    render(<${pascal} open onClose={vi.fn()} title="Overlay" />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("${pascal} -- interaction", () => {
  it("calls onClose on overlay click", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<${pascal} open onClose={onClose} />);
    await user.click(document.querySelector('[aria-hidden="true"]'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("${pascal} -- a11y", () => {
  it("has no axe violations when open", async () => {
    const { baseElement } = render(<${pascal} open onClose={vi.fn()} title="Overlay" />);
    await expectNoA11yViolations(baseElement);
  });
});
`;

    case "overlay-nonmodal":
      return `${commonImports}
describe("${pascal} -- render", () => {
  it("renders trigger", () => {
    render(<${pascal} triggerLabel="Open" />);
    expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
  });
});

describe("${pascal} -- interaction", () => {
  it("opens the panel", async () => {
    const user = userEvent.setup();
    render(<${pascal} triggerLabel="Open">Panel</${pascal}>);
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("${pascal} -- a11y", () => {
  it("has no axe violations", async () => {
    const { baseElement } = render(<${pascal} triggerLabel="Open">Panel</${pascal}>);
    await expectNoA11yViolations(baseElement);
  });
});
`;

    case "interactive-access":
    case "composed":
    default:
      return `${commonImports}
describe("${pascal} -- render", () => {
  it("renders children", () => {
    render(<${pascal}>Test</${pascal}>);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

describe("${pascal} -- ref forwarding", () => {
  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<${pascal} ref={ref}>Test</${pascal}>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("${pascal} -- access control", () => {
  it("returns null when access=hidden", () => {
    const { container } = render(<${pascal} access="hidden">Test</${pascal}>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("${pascal} -- interaction", () => {
  it("handles click events when interactive props are passed", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<${pascal} onClick={handleClick}>Click</${pascal}>);
    await user.click(screen.getByText("Click"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("${pascal} -- a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<${pascal}>Accessible</${pascal}>);
    await expectNoA11yViolations(container);
  });
});
`;
  }
}

function buildStoryFile() {
  const argTypesByProfile = {
    display: "",
    "interactive-access": `
    access: {
      control: "select",
      options: ["full", "disabled", "readonly", "hidden"],
    },
`,
    "field-shell": `
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    access: {
      control: "select",
      options: ["full", "disabled", "readonly", "hidden"],
    },
    loading: { control: "boolean" },
`,
    composed: `
    access: {
      control: "select",
      options: ["full", "disabled", "readonly", "hidden"],
    },
`,
    "overlay-modal": `
    open: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    closeOnOverlayClick: { control: "boolean" },
`,
    "overlay-nonmodal": `
    defaultOpen: { control: "boolean" },
`,
  };

  const defaultArgsByProfile = {
    display: `
  args: {
    children: "${pascal} content",
  },
`,
    "interactive-access": `
  args: {
    children: "${pascal} content",
    access: "full",
  },
`,
    "field-shell": `
  args: {
    label: "${pascal} label",
    placeholder: "${pascal} placeholder",
    access: "full",
  },
`,
    composed: `
  args: {
    title: "${pascal} title",
    children: "${pascal} content",
    access: "full",
  },
`,
    "overlay-modal": `
  args: {
    open: true,
    title: "${pascal} title",
    children: "${pascal} content",
  },
`,
    "overlay-nonmodal": `
  args: {
    triggerLabel: "${pascal}",
    children: "${pascal} content",
  },
`,
  };

  return `import type { Meta, StoryObj } from "@storybook/react";
import { ${pascal} } from "./${pascal}";

const meta: Meta<typeof ${pascal}> = {
  title: "${storybookTitle}",
  component: ${pascal},
  tags: ["autodocs"],
  argTypes: {${argTypesByProfile[profileName] ?? ""}
  },
};

export default meta;
type Story = StoryObj<typeof ${pascal}>;

export const Default: Story = {${defaultArgsByProfile[profileName] ?? ""}
};
`;
}

function buildDocStubFile() {
  return `import type { DesignLabComponentDocEntry } from "../types";

const entry: DesignLabComponentDocEntry = {
  name: "${pascal}",
  indexItem: {
    name: "${pascal}",
    kind: "component",
    availability: "planned",
    lifecycle: "planned",
    maturity: "experimental",
    group: "scaffolded",
    subgroup: "${componentType}",
    taxonomyGroupId: "scaffolded",
    taxonomySubgroup: "${pascal}",
    demoMode: "planned",
    description: "TODO: replace scaffolded description for ${pascal}.",
    sectionIds: [],
    qualityGates: [],
    tags: ["scaffolded", "profile:${profileName}"],
    importStatement: "import { ${pascal} } from '@mfe/design-system';",
    whereUsed: [],
  },
  apiItem: {
    name: "${pascal}",
    variantAxes: [],
    previewStates: [],
    behaviorModel: [],
    props: [],
    previewFocus: [],
    regressionFocus: [],
  },
};

export default entry;
`;
}

function buildAuthoringMetadata() {
  const artifacts = {
    ...profile.artifacts,
    contractTest: withContractTest,
    docStub: withDocStub,
  };

  return `${JSON.stringify(
    {
      version: 1,
      name: pascal,
      kebabName: kebab,
      type: componentType,
      profile: profileName,
      storyTitle: storybookTitle,
      artifacts,
      paths: {
        componentDir: `src/${baseDir}/${kebab}`,
        sourceFile: `src/${baseDir}/${kebab}/${pascal}.tsx`,
        barrelFile: `src/${baseDir}/${kebab}/index.ts`,
        categoryBarrelFile: `src/${baseDir}/index.ts`,
        storyFile: `src/${baseDir}/${kebab}/${pascal}.stories.tsx`,
        unitTestFile: `src/${baseDir}/${kebab}/__tests__/${pascal}.test.tsx`,
        contractTestFile: withContractTest
          ? `src/${baseDir}/${kebab}/__tests__/${pascal}.contract.test.tsx`
          : null,
        nextStepsFile: `src/${baseDir}/${kebab}/${authoringNextStepsFilename}`,
        docStubFile: withDocStub
          ? `src/catalog/component-docs/entries/${pascal}.doc.ts`
          : null,
        docIndexFile: 'src/catalog/component-docs/index.ts',
        apiReferenceFile: 'docs/api/api-reference.json',
      },
      registrations: {
        categoryBarrelExport: `export { ${pascal}, type ${pascal}Props } from "./${kebab}";`,
        designLabDocIndexRequired: withDocStub,
        designLabManifestRecommended: withDocStub,
        apiReferenceRequired: artifacts.apiReference !== false,
      },
      commands: {
        refreshApiReference: 'npm run docs:api',
        authoringCheck: 'npm run check:authoring',
        typecheck: 'npm run typecheck',
        test: 'npm test',
      },
    },
    null,
    2,
  )}\n`;
}

function buildAuthoringNextStepsFile() {
  const lines = [
    `# ${pascal} — Authoring Next Steps`,
    "",
    `Profile: \`${profileName}\``,
    `Bucket: \`${baseDir}\``,
    "",
    "## Required",
    "",
    `- [ ] Add category barrel export in \`src/${baseDir}/index.ts\`:`,
    `  \`export { ${pascal}, type ${pascal}Props } from "./${kebab}";\``,
    "- [ ] Align the generated baseline with the closest live reference from `docs/AUTHORING-REFERENCE-MAP.md`.",
    "- [ ] Expand tests to match the real interaction model for the selected profile.",
    "- [ ] Regenerate API reference with `npm run docs:api` so `docs/api/api-reference.json` includes the new component.",
    "- [ ] Run `npm run check:component-completeness`.",
    "- [ ] Run `npm run typecheck`.",
    "- [ ] Run `npm test`.",
    "",
    "## Optional / Conditional",
    "",
  ];

  if (withContractTest) {
    lines.push(`- [ ] Fill in \`src/${baseDir}/${kebab}/__tests__/${pascal}.contract.test.tsx\` with real contract coverage.`);
  } else {
    lines.push("- [ ] Add a contract test if this component introduces cross-cutting API or behavior guarantees.");
  }

  if (withDocStub) {
    lines.push(
      `- [ ] Register \`./entries/${pascal}.doc\` in \`src/catalog/component-docs/index.ts\`.`,
    );
    lines.push(
      "- [ ] If the component belongs in Design Lab, add manifest item(s) in `src/catalog/component-manifest.items.part-*.v1.json` and rebuild the root Design Lab index.",
    );
  } else {
    lines.push("- [ ] If the component should appear in Design Lab, re-run scaffold with `--with-doc-stub` or add the doc entry manually.");
  }

  lines.push(
    "- [ ] Run the canonical release gate before publish-ready work: `node scripts/release/pre-release-check.mjs`.",
    "",
  );

  return `${lines.join("\n")}\n`;
}

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------

function writeFile(filePath, content) {
  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  created ${path.relative(ROOT, filePath)}`);
}

console.log(
  `\nScaffolding ${pascal} (${componentType}, profile=${profileName}) in src/${baseDir}/${kebab}/\n`,
);

writeFile(path.join(dir, `${pascal}.tsx`), buildComponentFile());
writeFile(path.join(dir, "index.ts"), buildIndexFile());
writeFile(path.join(dir, authoringMetaFilename), buildAuthoringMetadata());
writeFile(path.join(dir, authoringNextStepsFilename), buildAuthoringNextStepsFile());
writeFile(path.join(dir, "__tests__", `${pascal}.test.tsx`), buildTestFile());
writeFile(path.join(dir, `${pascal}.stories.tsx`), buildStoryFile());

if (withContractTest) {
  writeFile(path.join(dir, "__tests__", `${pascal}.contract.test.tsx`), buildContractTestFile());
}

if (withDocStub) {
  writeFile(
    path.join(ROOT, "src", "catalog", "component-docs", "entries", `${pascal}.doc.ts`),
    buildDocStubFile(),
  );
}

console.log(`
Done! Next steps:
  1. Add your component to src/${baseDir}/index.ts:
     export { ${pascal}, type ${pascal}Props } from "./${kebab}";
  2. Open src/${baseDir}/${kebab}/${authoringNextStepsFilename}
  3. Compare the generated baseline with docs/COMPONENT-AUTHORING.md
  4. Use docs/AUTHORING-REFERENCE-MAP.md to align with the closest live example
  5. Expand tests to match the actual profile behavior
  6. Run checks:
     npm run docs:api
     npm run check:component-completeness
     npm run typecheck
     npm test
`);
