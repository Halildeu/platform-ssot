/**
 * Kitchen Sink -- Every major component in one page.
 *
 * Usage: Import this into Storybook or a test app to see
 * all components rendered together.
 */
import React, { useState } from "react";

import {
  // Primitives
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Dialog,
  Modal,
  Tooltip,
  Popover,
  // Components
  Tabs,
  Accordion,
  ToastProvider,
  useToast,
  EmptyState,
  // Providers
  DesignSystemProvider,
} from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Section helper                                                     */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
          paddingBottom: 8,
          borderBottom: "1px solid var(--border-subtle, #e2e8f0)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast demo (needs to be inside ToastProvider)                      */
/* ------------------------------------------------------------------ */

function ToastDemo() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Button variant="primary" onClick={() => toast.success("Record saved successfully!")}>
        Success Toast
      </Button>
      <Button variant="secondary" onClick={() => toast.info("New version available.")}>
        Info Toast
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Disk space running low.")}>
        Warning Toast
      </Button>
      <Button variant="danger" onClick={() => toast.error("Failed to delete record.")}>
        Error Toast
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Kitchen Sink                                                  */
/* ------------------------------------------------------------------ */

export function KitchenSink() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [radioValue, setRadioValue] = useState("option-a");
  const [switchChecked, setSwitchChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <DesignSystemProvider>
      <ToastProvider position="top-right">
        <div style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            @mfe/design-system Kitchen Sink
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
            Every major component rendered on a single page.
          </p>

          {/* ---- Buttons ---- */}
          <Section title="Buttons">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </div>

            <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Sizes
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="md">MD</Button>
              <Button size="lg">LG</Button>
              <Button size="xl">XL</Button>
            </div>

            <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              States
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth variant="outline">
                Full Width
              </Button>
            </div>
          </Section>

          {/* ---- Form Elements ---- */}
          <Section title="Form Elements">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
              <Input
                label="Text Input"
                placeholder="Enter your name"
                description="Your full legal name"
                value={inputValue}
                onValueChange={(v) => setInputValue(v)}
              />

              <Input
                label="With Error"
                placeholder="Enter email"
                error="Invalid email address"
                defaultValue="not-an-email"
              />

              <Input
                label="With Character Count"
                placeholder="Short bio"
                maxLength={100}
                showCount
              />

              <Select
                options={[
                  { value: "react", label: "React" },
                  { value: "vue", label: "Vue" },
                  { value: "angular", label: "Angular" },
                  { value: "svelte", label: "Svelte" },
                ]}
                placeholder="Select a framework"
              />

              <Textarea
                label="Comments"
                placeholder="Write your thoughts..."
                rows={3}
                resize="vertical"
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Checkbox label="Accept terms and conditions" />
                <Checkbox label="Subscribe to newsletter" defaultChecked />
                <Checkbox label="Disabled option" disabled />
                <Checkbox label="Indeterminate" indeterminate />
              </div>

              <RadioGroup
                name="demo-radio"
                value={radioValue}
                onChange={setRadioValue}
                direction="vertical"
              >
                <Radio value="option-a" label="Option A" description="First option" />
                <Radio value="option-b" label="Option B" description="Second option" />
                <Radio value="option-c" label="Option C" disabled />
              </RadioGroup>

              <Switch
                label="Enable notifications"
                description="Receive email alerts"
                checked={switchChecked}
                onCheckedChange={setSwitchChecked}
              />

              <Switch label="Destructive variant" variant="destructive" defaultChecked />
            </div>
          </Section>

          {/* ---- Navigation ---- */}
          <Section title="Navigation">
            <h3 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Tabs (line variant)
            </h3>
            <Tabs
              items={[
                { key: "overview", label: "Overview", content: <p>Overview tab content.</p> },
                { key: "details", label: "Details", content: <p>Details tab content.</p> },
                { key: "settings", label: "Settings", content: <p>Settings tab content.</p> },
                { key: "disabled", label: "Disabled", content: <p>Disabled.</p>, disabled: true },
              ]}
            />

            <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Tabs (pill variant)
            </h3>
            <Tabs
              variant="pill"
              items={[
                { key: "all", label: "All", content: <p>All items.</p> },
                { key: "active", label: "Active", content: <p>Active items.</p> },
                { key: "archived", label: "Archived", content: <p>Archived items.</p> },
              ]}
            />

            <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Tabs (enclosed variant)
            </h3>
            <Tabs
              variant="enclosed"
              items={[
                { key: "tab1", label: "First", content: <p>First panel.</p> },
                { key: "tab2", label: "Second", content: <p>Second panel.</p> },
              ]}
            />
          </Section>

          {/* ---- Feedback ---- */}
          <Section title="Feedback">
            <h3 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Badges</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="muted">Muted</Badge>
              <Badge variant="success" dot />
            </div>

            <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Toasts
            </h3>
            <ToastDemo />

            <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Empty State
            </h3>
            <Card variant="outlined" padding="none">
              <EmptyState
                title="No results found"
                description="Try adjusting your search or filter criteria."
                action={<Button size="sm">Clear Filters</Button>}
              />
            </Card>
          </Section>

          {/* ---- Overlays ---- */}
          <Section title="Overlays">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                Open Modal
              </Button>

              <Tooltip content="This is a tooltip" placement="top">
                <Button variant="ghost">Hover for Tooltip</Button>
              </Tooltip>

              <Popover
                trigger={<Button variant="ghost">Click for Popover</Button>}
                content="This is popover content with additional details."
                title="Popover Title"
                side="bottom"
                triggerMode="click"
              />
            </div>

            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Dialog Title"
              description="This is a dialog description."
              size="md"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setDialogOpen(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <p>Dialog body content goes here. This dialog uses the native HTML dialog element.</p>
            </Dialog>

            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal Title"
              size="md"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>
                    Save Changes
                  </Button>
                </>
              }
            >
              <p>Modal body content. Supports surfaces: base, confirm, destructive, audit.</p>
            </Modal>
          </Section>

          {/* ---- Layout ---- */}
          <Section title="Layout">
            <h3 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Cards</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card variant="elevated">
                <CardHeader title="Elevated Card" subtitle="Default variant" />
                <CardBody>Card body content with elevated shadow.</CardBody>
                <CardFooter>
                  <Button size="sm" variant="ghost">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="outlined">
                <CardHeader
                  title="Outlined Card"
                  subtitle="With action"
                  action={<Badge variant="success">Active</Badge>}
                />
                <CardBody>Card body content with outlined border.</CardBody>
              </Card>

              <Card variant="filled" hoverable>
                <CardHeader title="Filled + Hoverable" />
                <CardBody>Hover over this card to see the effect.</CardBody>
              </Card>

              <Card variant="ghost">
                <CardHeader title="Ghost Card" />
                <CardBody>Transparent background, no border.</CardBody>
              </Card>
            </div>

            <h3 style={{ marginTop: 24, marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Accordion
            </h3>
            <Accordion
              selectionMode="multiple"
              items={[
                {
                  value: "item-1",
                  title: "What is the design system?",
                  content: (
                    <p>
                      A collection of reusable UI components built with React and Tailwind CSS,
                      following consistent design patterns.
                    </p>
                  ),
                },
                {
                  value: "item-2",
                  title: "How do I install it?",
                  content: <p>Install via npm: npm install @mfe/design-system</p>,
                },
                {
                  value: "item-3",
                  title: "Is it accessible?",
                  content: (
                    <p>
                      Yes. All components follow WAI-ARIA patterns with proper roles, keyboard
                      navigation, and focus management.
                    </p>
                  ),
                  defaultExpanded: true,
                },
              ]}
            />
          </Section>
        </div>
      </ToastProvider>
    </DesignSystemProvider>
  );
}
