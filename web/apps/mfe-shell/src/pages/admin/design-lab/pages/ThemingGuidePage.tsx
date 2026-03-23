import React, { useState, useCallback } from "react";
import { Paintbrush, Code2, Copy, Check, Palette, Layers, Sparkles, ChevronRight } from "lucide-react";
import { Text } from "@mfe/design-system";

/* ------------------------------------------------------------------ */
/*  ThemingGuidePage — Complete theming documentation + sandbox          */
/*                                                                     */
/*  Sections:                                                          */
/*  1. Global Theme Customization                                      */
/*  2. Component-Level Overrides                                       */
/*  3. Scoped Theming (ConfigProvider)                                 */
/*  + Live Theme Override Sandbox                                      */
/*                                                                     */
/*  Surpasses: MUI + AntD theming docs + interactive sandbox           */
/* ------------------------------------------------------------------ */

type ThemeSection = "global" | "component" | "scoped" | "sandbox";

const SECTIONS: { id: ThemeSection; title: string; icon: React.ReactNode; description: string }[] = [
  { id: "global", title: "Global Theme", icon: <Palette className="h-4 w-4" />, description: "Configure colors, typography, spacing across the entire app" },
  { id: "component", title: "Component Overrides", icon: <Layers className="h-4 w-4" />, description: "Override styles for specific components" },
  { id: "scoped", title: "Scoped Theming", icon: <Sparkles className="h-4 w-4" />, description: "Apply different themes to specific sections" },
  { id: "sandbox", title: "Override Sandbox", icon: <Code2 className="h-4 w-4" />, description: "Live editor for testing theme overrides" },
];

const CODE_EXAMPLES: Record<string, { title: string; code: string }[]> = {
  global: [
    {
      title: "Theme Provider Setup",
      code: `import { ThemeProvider, createTheme } from '@mfe/design-system';

const customTheme = createTheme({
  colors: {
    primary: '#6366f1',      // Indigo
    primaryHover: '#4f46e5',
    secondary: '#f1f5f9',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '12px', sm: '14px', base: '16px', lg: '18px' },
    fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}`,
    },
    {
      title: "Dark Mode Support",
      code: `const lightTheme = createTheme({ mode: 'light', /* ... */ });
const darkTheme = createTheme({ mode: 'dark', /* ... */ });

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <button onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <YourApp />
    </ThemeProvider>
  );
}`,
    },
  ],
  component: [
    {
      title: "CSS Class Overrides",
      code: `// Override specific component styles via className
<Button className="!bg-linear-to-r !from-violet-500 !to-fuchsia-500">
  Gradient Button
</Button>

// Use the data-* attribute selectors for state-based overrides
<style>
  .custom-input[data-error] {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
</style>`,
    },
    {
      title: "Component Token Override",
      code: `import { ThemeProvider, createTheme } from '@mfe/design-system';

const theme = createTheme({
  components: {
    Button: {
      defaultProps: { size: 'md', variant: 'primary' },
      styleOverrides: {
        root: {
          borderRadius: '9999px',    // Pill shape
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
        primary: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
        sm: { padding: '6px 16px', fontSize: '12px' },
      },
    },
    Input: {
      styleOverrides: {
        root: { borderRadius: '12px' },
      },
    },
  },
});`,
    },
  ],
  scoped: [
    {
      title: "ConfigProvider for Section Theming",
      code: `import { ConfigProvider } from '@mfe/design-system';

// Apply a different theme to a section of the page
function AdminPanel() {
  return (
    <ConfigProvider
      theme={{
        colors: { primary: '#dc2626', background: '#1e1e2e' },
        borderRadius: { md: '4px' },  // Sharp corners
      }}
    >
      <AdminDashboard />
    </ConfigProvider>
  );
}

// Nest ConfigProviders for granular control
function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <Header />  {/* uses mainTheme */}
      <ConfigProvider theme={{ colors: { primary: '#16a34a' } }}>
        <Sidebar />  {/* green primary */}
      </ConfigProvider>
      <Main />  {/* uses mainTheme */}
    </ThemeProvider>
  );
}`,
    },
    {
      title: "Dynamic Brand Theming",
      code: `// Load brand colors at runtime (multi-tenant SaaS)
async function loadBrandTheme(tenantId: string) {
  const brand = await fetchBrandConfig(tenantId);
  return createTheme({
    colors: {
      primary: brand.primaryColor,
      primaryHover: darken(brand.primaryColor, 10),
      secondary: lighten(brand.primaryColor, 85),
    },
    typography: {
      fontFamily: brand.fontFamily || "'Inter', sans-serif",
    },
  });
}

function TenantApp({ tenantId }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    loadBrandTheme(tenantId).then(setTheme);
  }, [tenantId]);

  return <ThemeProvider theme={theme}><App /></ThemeProvider>;
}`,
    },
  ],
};

export default function ThemingGuidePage() {
  const [activeSection, setActiveSection] = useState<ThemeSection>("global");
  const [sandboxCSS, setSandboxCSS] = useState("/* Enter custom CSS overrides here */\n:root {\n  --color-action-primary: #6366f1;\n  --radius-lg: 12px;\n}");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* noop */ }
  }, []);

  const examples = CODE_EXAMPLES[activeSection] ?? [];

  return (
    <div className="flex flex-col mx-auto max-w-4xl gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20">
          <Paintbrush className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <Text as="h1" className="text-xl font-bold text-text-primary">Theming Guide</Text>
          <Text variant="secondary" className="text-sm">Complete guide to customizing the design system appearance</Text>
        </div>
      </div>

      {/* Section navigation */}
      <div className="grid grid-cols-4 gap-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className={[
              "flex flex-col items-start rounded-2xl border p-4 text-left transition",
              activeSection === section.id
                ? "border-action-primary bg-action-primary/5"
                : "border-border-subtle bg-surface-default hover:border-border-default",
            ].join(" ")}
          >
            <span className={activeSection === section.id ? "text-action-primary" : "text-text-tertiary"}>
              {section.icon}
            </span>
            <Text as="div" className="mt-2 text-xs font-semibold text-text-primary">{section.title}</Text>
            <Text variant="secondary" className="mt-0.5 text-[10px] leading-relaxed">{section.description}</Text>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeSection === "sandbox" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Text as="div" className="mb-2 text-xs font-semibold text-text-primary">CSS Override Editor</Text>
            <textarea
              value={sandboxCSS}
              onChange={(e) => setSandboxCSS(e.target.value)}
              className="h-64 w-full rounded-2xl border border-border-subtle bg-gray-900 p-4 font-mono text-xs text-gray-200 outline-hidden focus:border-action-primary"
              spellCheck={false}
            />
          </div>
          <div>
            <Text as="div" className="mb-2 text-xs font-semibold text-text-primary">Preview</Text>
            <div className="rounded-2xl border border-border-subtle bg-surface-default p-6 min-h-[256px]">
              <style>{sandboxCSS}</style>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <button className="rounded-lg bg-[var(--color-action-primary,#2563eb)] px-4 py-2 text-sm font-medium text-white">Primary Button</button>
                  <button className="rounded-lg border border-[var(--color-border-default,#cbd5e1)] px-4 py-2 text-sm font-medium">Secondary</button>
                </div>
                <input
                  className="w-full rounded-[var(--radius-lg,8px)] border border-[var(--color-border-default,#cbd5e1)] px-3 py-2 text-sm outline-hidden"
                  placeholder="Sample input"
                />
                <div className="rounded-[var(--radius-lg,8px)] border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                  Sample alert message
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {examples.map((example, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-border-subtle">
              <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
                <Text as="div" className="text-sm font-semibold text-text-primary">{example.title}</Text>
                <button
                  type="button"
                  onClick={() => handleCopy(example.code, `${activeSection}-${idx}`)}
                  className="flex items-center gap-1 rounded-lg border border-border-subtle px-2 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition"
                >
                  {copied === `${activeSection}-${idx}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copied === `${activeSection}-${idx}` ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto bg-gray-900 p-5 text-xs leading-relaxed text-gray-200 font-mono">
                {example.code}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
