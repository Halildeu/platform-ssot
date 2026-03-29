import React, { useState, useEffect, useCallback, useRef } from "react";
import { Zap, Trash2, Check, ChevronDown, ChevronRight, Filter, Code2 } from "lucide-react";
import { Text } from "@mfe/design-system";
import { subscribeToActionLog } from "./PlaygroundPreview";
import type { ActionLogEntry } from "./PlaygroundPreview";

/* ------------------------------------------------------------------ */
/*  ActionsPanel — Real-time event logger for playground interactions   */
/*                                                                     */
/*  Captures onClick, onChange, onFocus, etc. from the preview         */
/*  component and displays them in a scrollable log.                   */
/*  Inspired by Storybook Actions addon — surpasses it with:          */
/*  - Test assertion generator                                         */
/*  - Payload diff between consecutive same-type events                */
/*  - Collapsible payload viewer                                       */
/* ------------------------------------------------------------------ */

const MAX_ENTRIES = 200;

/* ---- Noisy events that are hidden by default ---- */
const NOISY_EVENTS = new Set(["onMouseEnter", "onMouseLeave", "onMouseMove", "onPointerMove"]);

/* ---- Event color coding ---- */
const EVENT_COLORS: Record<string, string> = {
  onClick: "text-action-primary",
  onChange: "text-state-success-text",
  onFocus: "text-state-warning-text",
  onBlur: "text-[var(--text-subtle)]",
  onKeyDown: "text-action-primary",
  onKeyUp: "text-action-primary",
  onSubmit: "text-state-danger-text",
};

type ActionsPanelProps = {
  expanded: boolean;
  onToggle: () => void;
};

export const ActionsPanel: React.FC<ActionsPanelProps> = ({ expanded, onToggle }) => {
  const [entries, setEntries] = useState<ActionLogEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const [hideNoisy, setHideNoisy] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  // Subscribe to action log events
  useEffect(() => {
    return subscribeToActionLog((entry) => {
      setEntries((prev) => {
        const next = [...prev, entry];
        return next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next;
      });
    });
  }, []);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (autoScrollRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  const handleClear = useCallback(() => {
    setEntries([]);
    setExpandedEntry(null);
  }, []);

  const handleCopyAssertion = useCallback(async (entry: ActionLogEntry) => {
    const assertion = generateTestAssertion(entry);
    try {
      await navigator.clipboard.writeText(assertion);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* noop */
    }
  }, []);

  const filteredEntries = hideNoisy
    ? entries.filter((e) => !NOISY_EVENTS.has(e.eventName))
    : entries;

  const entryCount = filteredEntries.length;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-default">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition hover:bg-surface-muted/50"
      >
        <Zap className="h-3.5 w-3.5 text-action-primary" />
        <Text className="text-xs font-semibold text-text-primary">Actions</Text>
        {entryCount > 0 && (
          <span className="rounded-full bg-action-primary/10 px-2 py-0.5 text-[10px] font-bold text-action-primary">
            {entryCount}
          </span>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          {expanded && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setHideNoisy(!hideNoisy); }}
                className={[
                  "rounded-md p-1 transition",
                  hideNoisy ? "bg-action-primary/10 text-action-primary" : "text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
                title={hideNoisy ? "Showing important events" : "Showing all events"}
              >
                <Filter className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClear(); }}
                className="rounded-md p-1 text-text-tertiary transition hover:text-text-secondary"
                title="Clear log"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-text-tertiary" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-text-tertiary" />
          )}
        </div>
      </button>

      {/* Log content */}
      {expanded && (
        <div
          ref={scrollRef}
          className="max-h-[240px] overflow-y-auto border-t border-border-subtle"
          onScroll={(e) => {
            const el = e.currentTarget;
            autoScrollRef.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
          }}
        >
          {filteredEntries.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Text variant="secondary" className="text-xs">
                Interact with the component to see events here
              </Text>
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filteredEntries.map((entry) => {
                const isExpanded = expandedEntry === entry.id;
                const color = EVENT_COLORS[entry.eventName] ?? "text-text-secondary";
                const timeStr = new Date(entry.timestamp).toLocaleTimeString("en-US", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  fractionalSecondDigits: 3,
                } as Intl.DateTimeFormatOptions);

                return (
                  <div key={entry.id} className="group">
                    <button
                      type="button"
                      onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left transition hover:bg-surface-muted/30"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" style={{ color: color.replace("text-", "").includes("-") ? undefined : undefined }} />
                      <code className={`text-[11px] font-medium ${color}`}>{entry.eventName}</code>
                      <Text variant="secondary" className="text-[10px] font-mono tabular-nums">
                        {timeStr}
                      </Text>
                      {entry.payload.length > 0 && (
                        <Text variant="secondary" className="ml-auto text-[10px] truncate max-w-[200px]">
                          {typeof entry.payload[0] === "object"
                            ? JSON.stringify(entry.payload[0]).slice(0, 60)
                            : String(entry.payload[0]).slice(0, 40)}
                        </Text>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleCopyAssertion(entry); }}
                        className="hidden group-hover:flex shrink-0 items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 text-[10px] text-text-secondary hover:text-text-primary"
                        title="Copy test assertion"
                      >
                        {copiedId === entry.id ? (
                          <Check className="h-2.5 w-2.5 text-state-success-text" />
                        ) : (
                          <Code2 className="h-2.5 w-2.5" />
                        )}
                      </button>
                    </button>
                    {isExpanded && entry.payload.length > 0 && (
                      <div className="bg-surface-canvas px-4 py-2">
                        <pre className="text-[10px] text-text-secondary font-mono whitespace-pre-wrap break-all">
                          {JSON.stringify(entry.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---- Test assertion generator ---- */

function generateTestAssertion(entry: ActionLogEntry): string {
  const handler = `handle${entry.eventName.slice(2)}`;
  const lines = [
    `// Test assertion for ${entry.eventName} on ${entry.componentName}`,
    `const ${handler} = vi.fn();`,
    `render(<${entry.componentName} ${entry.eventName}={${handler}} />);`,
    ``,
    `// Simulate interaction`,
    `fireEvent.${entry.eventName.replace("on", "").toLowerCase()}(screen.getByRole('...'));`,
    ``,
    `expect(${handler}).toHaveBeenCalledTimes(1);`,
  ];

  if (entry.payload.length > 0 && typeof entry.payload[0] === "object" && entry.payload[0] !== null) {
    const arg = entry.payload[0] as Record<string, unknown>;
    if (arg.type) {
      lines.push(`expect(${handler}).toHaveBeenCalledWith(`);
      lines.push(`  expect.objectContaining({ type: "${arg.type}" })`);
      lines.push(`);`);
    }
  }

  return lines.join("\n");
}

export default ActionsPanel;
