import React from "react";

/* ------------------------------------------------------------------ */
/*  StatePreviewWrapper — Preview-only visual wrapper for state demos  */
/*                                                                     */
/*  When a component doesn't natively support a state (e.g. Badge      */
/*  has no disabled prop), this wrapper applies visual indicators:     */
/*  - opacity reduction for disabled/readonly                          */
/*  - pointer-events:none for non-interactive states                   */
/*  - overlay label showing the active state                           */
/*  - data-preview-state attribute for contract testing                */
/*                                                                     */
/*  This is NOT a production component — it only wraps previews in     */
/*  the Design Lab's State Demonstrations section.                     */
/* ------------------------------------------------------------------ */

type StatePreviewWrapperProps = {
  /** The state being demonstrated */
  state: string;
  /** Whether the component natively handles this state */
  isNativelySupported: boolean;
  children: React.ReactNode;
};

/** States that should reduce opacity */
const OPACITY_STATES = new Set([
  "disabled",
  "hidden",
  "readonly",
  "readOnly",
]);

/** States that should block pointer events */
const NON_INTERACTIVE_STATES = new Set([
  "disabled",
  "hidden",
  "readonly",
  "readOnly",
  "loading",
]);

/** Human-readable Turkish labels for known states */
const STATE_LABELS: Record<string, string> = {
  disabled: "Devre disi",
  loading: "Yukleniyor",
  readonly: "Salt okunur",
  readOnly: "Salt okunur",
  hidden: "Gizli",
  full: "Tam erisim",
  error: "Hata",
  success: "Basarili",
  warning: "Uyari",
  invalid: "Gecersiz",
  compact: "Kompakt",
  fullWidth: "Tam genislik",
  pending: "Beklemede",
  approved: "Onaylandi",
  rejected: "Reddedildi",
  blocked: "Engellendi",
  open: "Acik",
  closed: "Kapali",
  expanded: "Genisletilmis",
  collapsed: "Daraltilmis",
  selected: "Secili",
  checked: "Isaretli",
  indeterminate: "Belirsiz",
  striped: "Cizgili",
  bordered: "Cerceveli",
  active: "Aktif",
  empty: "Bos",
};

/** Badge color for the state indicator overlay */
function getStateBadgeStyle(state: string): { bg: string; text: string; border: string } {
  if (OPACITY_STATES.has(state)) {
    return { bg: "rgba(239,68,68,0.1)", text: "rgb(185,28,28)", border: "rgba(239,68,68,0.3)" };
  }
  if (state === "loading") {
    return { bg: "rgba(59,130,246,0.1)", text: "rgb(29,78,216)", border: "rgba(59,130,246,0.3)" };
  }
  if (state === "error" || state === "invalid") {
    return { bg: "rgba(239,68,68,0.1)", text: "rgb(185,28,28)", border: "rgba(239,68,68,0.3)" };
  }
  if (state === "success" || state === "approved") {
    return { bg: "rgba(34,197,94,0.1)", text: "rgb(21,128,61)", border: "rgba(34,197,94,0.3)" };
  }
  if (state === "warning" || state === "pending") {
    return { bg: "rgba(245,158,11,0.1)", text: "rgb(180,83,9)", border: "rgba(245,158,11,0.3)" };
  }
  return { bg: "rgba(100,116,139,0.08)", text: "rgb(71,85,105)", border: "rgba(100,116,139,0.2)" };
}

export const StatePreviewWrapper: React.FC<StatePreviewWrapperProps> = ({
  state,
  isNativelySupported,
  children,
}) => {
  const shouldReduceOpacity = !isNativelySupported && OPACITY_STATES.has(state);
  const shouldBlockPointer = !isNativelySupported && NON_INTERACTIVE_STATES.has(state);
  const badgeStyle = getStateBadgeStyle(state);
  const label = STATE_LABELS[state] ?? state;

  return (
    <div
      className="relative"
      data-preview-state={state}
      data-state-native={isNativelySupported ? "true" : "false"}
    >
      {/* Wrapped component */}
      <div
        style={{
          opacity: shouldReduceOpacity ? 0.45 : undefined,
          pointerEvents: shouldBlockPointer ? "none" : undefined,
          filter: state === "hidden" && !isNativelySupported ? "blur(2px)" : undefined,
          transition: "opacity 200ms ease, filter 200ms ease",
        }}
      >
        {children}
      </div>

      {/* Fallback overlay indicator — only shown when component doesn't natively support the state */}
      {!isNativelySupported && (
        <div
          className="absolute -top-1 -right-1 z-10 flex items-center gap-1 rounded-md px-1.5 py-0.5"
          style={{
            backgroundColor: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`,
            fontSize: "9px",
            fontWeight: 600,
            color: badgeStyle.text,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: badgeStyle.text,
              opacity: 0.6,
            }}
          />
          {label}
        </div>
      )}
    </div>
  );
};

export default StatePreviewWrapper;
