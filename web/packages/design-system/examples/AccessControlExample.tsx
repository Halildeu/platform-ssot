/**
 * Access Control Example -- Demonstrates the access control system.
 *
 * Shows how the `access` prop affects component behavior across
 * four levels: full, readonly, disabled, and hidden.
 */
import React, { useState } from "react";

import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Radio,
  RadioGroup,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Accordion,
  _Select,
  DesignSystemProvider,
} from "@mfe/design-system";
import type { AccessLevel } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Access level selector                                              */
/* ------------------------------------------------------------------ */

const ACCESS_LEVELS: { value: AccessLevel; label: string; description: string }[] = [
  { value: "full", label: "Full", description: "Fully interactive, no restrictions" },
  { value: "readonly", label: "Read-only", description: "Visible but not editable" },
  { value: "disabled", label: "Disabled", description: "Visible but completely non-interactive" },
  { value: "hidden", label: "Hidden", description: "Not rendered in the DOM" },
];

/* ------------------------------------------------------------------ */
/*  Demo section for a single access level                             */
/* ------------------------------------------------------------------ */

function AccessLevelDemo({ access }: { access: AccessLevel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Button */}
      <div>
        <label style={{ fontSize: 12, fontWeight: 500, marginBottom: 4, display: "block", color: "var(--text-secondary)" }}>
          Button
        </label>
        <Button
          variant="primary"
          access={access}
          accessReason={access !== "full" ? `This button is ${access}` : undefined}
        >
          Save Changes
        </Button>
      </div>

      {/* Input */}
      <Input
        label="Text Input"
        placeholder="Enter text..."
        defaultValue="Sample value"
        access={access}
        accessReason={access !== "full" ? `This input is ${access}` : undefined}
      />

      {/* Textarea */}
      <Textarea
        label="Textarea"
        defaultValue="Some multi-line content"
        rows={2}
        access={access}
        accessReason={access !== "full" ? `This textarea is ${access}` : undefined}
      />

      {/* Checkbox */}
      <Checkbox
        label="Agree to terms"
        defaultChecked
        access={access}
        accessReason={access !== "full" ? `This checkbox is ${access}` : undefined}
      />

      {/* Switch */}
      <Switch
        label="Enable feature"
        defaultChecked
        access={access}
        accessReason={access !== "full" ? `This switch is ${access}` : undefined}
      />

      {/* Radio */}
      <RadioGroup name={`radio-${access}`} defaultValue="a" direction="horizontal">
        <Radio
          value="a"
          label="Option A"
          access={access}
          accessReason={access !== "full" ? `This radio is ${access}` : undefined}
        />
        <Radio
          value="b"
          label="Option B"
          access={access}
          accessReason={access !== "full" ? `This radio is ${access}` : undefined}
        />
      </RadioGroup>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive demo                                                   */
/* ------------------------------------------------------------------ */

function InteractiveDemo() {
  const [selectedAccess, setSelectedAccess] = useState<AccessLevel>("full");

  return (
    <Card variant="elevated" padding="md">
      <CardHeader
        title="Interactive Demo"
        subtitle="Select an access level to see how all components respond"
      />
      <CardBody>
        {/* Access level selector */}
        <div style={{ marginBottom: 20 }}>
          <label
            style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 8 }}
          >
            Access Level
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ACCESS_LEVELS.map((level) => (
              <Button
                key={level.value}
                variant={selectedAccess === level.value ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedAccess(level.value)}
              >
                {level.label}
              </Button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>
            {ACCESS_LEVELS.find((l) => l.value === selectedAccess)?.description}
          </p>
        </div>

        {/* Current state indicator */}
        <div style={{ marginBottom: 16 }}>
          <Badge
            variant={
              selectedAccess === "full"
                ? "success"
                : selectedAccess === "readonly"
                  ? "info"
                  : selectedAccess === "disabled"
                    ? "warning"
                    : "error"
            }
          >
            access=&quot;{selectedAccess}&quot;
          </Badge>
        </div>

        {/* Components under the selected access level */}
        {selectedAccess === "hidden" ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              border: "2px dashed var(--border-default)",
              borderRadius: 12,
              color: "var(--text-secondary)",
            }}
          >
            All components are hidden (not rendered).
            <br />
            Inspect the DOM to confirm they are absent.
          </div>
        ) : null}

        <AccessLevelDemo access={selectedAccess} />
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Side-by-side comparison                                            */
/* ------------------------------------------------------------------ */

function SideBySideComparison() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader
        title="Side-by-Side Comparison"
        subtitle="Same components at every access level"
      />
      <CardBody>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {(["full", "readonly", "disabled"] as AccessLevel[]).map((access) => (
            <div key={access}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                <Badge
                  variant={
                    access === "full"
                      ? "success"
                      : access === "readonly"
                        ? "info"
                        : "warning"
                  }
                  size="sm"
                >
                  {access}
                </Badge>
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Button variant="primary" size="sm" access={access}>
                  Button
                </Button>
                <Input
                  placeholder="Input"
                  defaultValue="Value"
                  size="sm"
                  access={access}
                />
                <Checkbox label="Checkbox" defaultChecked access={access} size="sm" />
                <Switch label="Switch" defaultChecked access={access} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Accordion with access control                                      */
/* ------------------------------------------------------------------ */

function AccordionAccessDemo() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader
        title="Accordion with Access Control"
        subtitle="Accordion supports access at the container level"
      />
      <CardBody>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              access=&quot;full&quot;
            </h4>
            <Accordion
              access="full"
              items={[
                { value: "a", title: "Expandable section", content: <p>Content here.</p> },
                { value: "b", title: "Another section", content: <p>More content.</p> },
              ]}
            />
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              access=&quot;readonly&quot;
            </h4>
            <Accordion
              access="readonly"
              defaultValue={["a"]}
              items={[
                { value: "a", title: "Locked open", content: <p>Cannot collapse this.</p> },
                { value: "b", title: "Locked closed", content: <p>Cannot expand this.</p> },
              ]}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export function AccessControlExample() {
  return (
    <DesignSystemProvider>
      <div style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Access Control System
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          The <code>access</code> prop controls component interactivity across four levels:
          full, readonly, disabled, and hidden.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <InteractiveDemo />
          <SideBySideComparison />
          <AccordionAccessDemo />
        </div>
      </div>
    </DesignSystemProvider>
  );
}
