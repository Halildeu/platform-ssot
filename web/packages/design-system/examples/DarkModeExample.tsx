/**
 * Dark Mode Example -- Demonstrates theme switching with ThemeProvider.
 *
 * Uses the useTheme hook to toggle between light, dark, and high-contrast
 * appearances, and shows how components automatically adapt.
 */
import React from "react";

import {
  ThemeProvider,
  useTheme,
  Button,
  Card,
  CardHeader,
  CardBody,
  _CardFooter,
  Badge,
  Input,
  Switch,
  Select,
  Tabs,
} from "@mfe/design-system";
import type { ThemeAppearance, ThemeDensity } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  Theme controls                                                     */
/* ------------------------------------------------------------------ */

function ThemeControls() {
  const { axes, setAppearance, setDensity, update } = useTheme();

  return (
    <Card variant="outlined" padding="md">
      <CardHeader title="Theme Controls" subtitle="Change the active theme axes" />
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Appearance switcher */}
          <div>
            <label
              style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Appearance
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["light", "dark", "high-contrast"] as ThemeAppearance[]).map((mode) => (
                <Button
                  key={mode}
                  variant={axes.appearance === mode ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setAppearance(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Density switcher */}
          <div>
            <label
              style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Density
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["comfortable", "compact"] as ThemeDensity[]).map((d) => (
                <Button
                  key={d}
                  variant={axes.density === d ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setDensity(d)}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Radius switcher */}
          <div>
            <label
              style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Border Radius
            </label>
            <Select
              options={[
                { value: "rounded", label: "Rounded" },
                { value: "sharp", label: "Sharp" },
              ]}
              value={axes.radius}
              onChange={(e) => update({ radius: e.target.value as "rounded" | "sharp" })}
              fullWidth={false}
              size="sm"
            />
          </div>

          {/* Elevation switcher */}
          <div>
            <label
              style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}
            >
              Elevation
            </label>
            <Select
              options={[
                { value: "raised", label: "Raised" },
                { value: "flat", label: "Flat" },
              ]}
              value={axes.elevation}
              onChange={(e) => update({ elevation: e.target.value as "raised" | "flat" })}
              fullWidth={false}
              size="sm"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Component preview (reacts to theme changes)                        */
/* ------------------------------------------------------------------ */

function ComponentPreview() {
  return (
    <Card variant="elevated" padding="md">
      <CardHeader title="Component Preview" subtitle="See how components adapt to the theme" />
      <CardBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="info">Info</Badge>
          </div>

          {/* Input */}
          <Input
            label="Sample Input"
            placeholder="Type something..."
            description="This input adapts to the current theme."
          />

          {/* Switch */}
          <Switch
            label="Dark mode toggle"
            description="Controlled by the theme controls above"
          />

          {/* Tabs */}
          <Tabs
            variant="enclosed"
            items={[
              { key: "preview", label: "Preview", content: <p>Preview content in current theme.</p> },
              { key: "code", label: "Code", content: <p>Code sample would go here.</p> },
            ]}
          />
        </div>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Current theme state display                                        */
/* ------------------------------------------------------------------ */

function ThemeStateDisplay() {
  const { axes } = useTheme();

  return (
    <Card variant="filled" padding="md">
      <CardHeader title="Current Theme State" />
      <CardBody>
        <pre
          style={{
            fontSize: 12,
            padding: 12,
            borderRadius: 8,
            background: "var(--surface-default)",
            border: "1px solid var(--border-subtle)",
            overflow: "auto",
          }}
        >
          {JSON.stringify(axes, null, 2)}
        </pre>
      </CardBody>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export function DarkModeExample() {
  return (
    <ThemeProvider defaultAxes={{ appearance: "light" }}>
      <div style={{ padding: 32, maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
          Dark Mode / Theme Switching
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          Use the controls below to switch between theme axes and see components adapt in real time.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ThemeControls />
          <ComponentPreview />
          <ThemeStateDisplay />
        </div>
      </div>
    </ThemeProvider>
  );
}
