/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/mfe-shell/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-suggestions/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-ethic/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-users/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-access/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-audit/src/**/*.{js,ts,jsx,tsx}',
    './apps/mfe-reporting/src/**/*.{js,ts,jsx,tsx}',
    './packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        control: 'var(--radius-control)',
        surface: 'var(--radius-surface)',
      },
      boxShadow: {
        surface: 'var(--elevation-surface)',
        overlay: 'var(--elevation-overlay)',
      },
      spacing: {
        density: 'var(--density-space)',
      },
      minHeight: {
        'row-density': 'var(--density-row-height)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        medium: 'var(--motion-duration-medium)',
        slow: 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--motion-easing-standard)',
        enter: 'var(--motion-easing-enter)',
        exit: 'var(--motion-easing-exit)',
      },
      colors: {
        surface: {
          DEFAULT: 'var(--surface-default-bg)',
          default: 'var(--surface-default-bg)',
          page: 'var(--surface-page-bg)',
          raised: 'var(--surface-raised-bg)',
          muted: 'var(--surface-muted-bg)',
          panel: 'var(--surface-panel-bg)',
          header: 'var(--surface-header-bg)',
          overlay: 'var(--surface-overlay-bg)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          subtle: 'var(--text-subtle)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          default: 'var(--border-default)',
          bold: 'var(--border-bold)',
        },
        selection: {
          DEFAULT: 'var(--selection-bg)',
          outline: 'var(--selection-outline)',
        },
        action: {
          primary: {
            DEFAULT: 'var(--action-primary-bg)',
            text: 'var(--action-primary-text)',
            border: 'var(--action-primary-border)',
          },
          secondary: {
            DEFAULT: 'var(--action-secondary-bg)',
            text: 'var(--action-secondary-text)',
            border: 'var(--action-secondary-border)',
          },
          ghost: {
            DEFAULT: 'var(--action-ghost-bg)',
            text: 'var(--action-ghost-text)',
            border: 'var(--action-ghost-border)',
          },
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          focus: 'var(--accent-focus)',
          soft: 'var(--accent-soft)',
        },
        state: {
          info: {
            DEFAULT: 'var(--state-info-bg)',
            bg: 'var(--state-info-bg)',
            text: 'var(--state-info-text)',
            border: 'var(--state-info-border)',
          },
          success: {
            DEFAULT: 'var(--state-success-bg)',
            bg: 'var(--state-success-bg)',
            text: 'var(--state-success-text)',
            border: 'var(--state-success-border)',
          },
          warning: {
            DEFAULT: 'var(--state-warning-bg)',
            bg: 'var(--state-warning-bg)',
            text: 'var(--state-warning-text)',
            border: 'var(--state-warning-border)',
          },
          danger: {
            DEFAULT: 'var(--state-danger-bg)',
            bg: 'var(--state-danger-bg)',
            text: 'var(--state-danger-text)',
            border: 'var(--state-danger-border)',
          },
        },
        // Alias: UI code uses `status-*`, tokens are `--state-*`.
        status: {
          info: {
            DEFAULT: 'var(--state-info-bg)',
            bg: 'var(--state-info-bg)',
            text: 'var(--state-info-text)',
            border: 'var(--state-info-border)',
          },
          success: {
            DEFAULT: 'var(--state-success-bg)',
            bg: 'var(--state-success-bg)',
            text: 'var(--state-success-text)',
            border: 'var(--state-success-border)',
          },
          warning: {
            DEFAULT: 'var(--state-warning-bg)',
            bg: 'var(--state-warning-bg)',
            text: 'var(--state-warning-text)',
            border: 'var(--state-warning-border)',
          },
          danger: {
            DEFAULT: 'var(--state-danger-bg)',
            bg: 'var(--state-danger-bg)',
            text: 'var(--state-danger-text)',
            border: 'var(--state-danger-border)',
          },
        },
        'data-table': {
          header: {
            DEFAULT: 'var(--data-table-header-bg)',
            text: 'var(--data-table-header-text)',
            divider: 'var(--data-table-header-divider)',
          },
          row: {
            hover: 'var(--data-table-row-hover)',
            selected: 'var(--data-table-row-selected)',
            border: 'var(--data-table-row-border)',
          },
        },
      },
      ringColor: {
        DEFAULT: 'var(--focus-outline)',
      },
    },
  },
  plugins: [],
}
