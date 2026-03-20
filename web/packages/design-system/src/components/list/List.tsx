import React from "react";
import {
  resolveAccessState,
  shouldBlockInteraction,
  type AccessControlledProps,
} from "../../internal/access-controller";
import { Badge, type BadgeVariant } from "../../primitives/badge/Badge";
import { EmptyState as Empty } from "../empty-state/EmptyState";
import { Skeleton } from "../../primitives/skeleton/Skeleton";
import { Text } from "../../primitives/text/Text";

/* ------------------------------------------------------------------ */
/*  List — Vertical list of interactive or static items               */
/* ------------------------------------------------------------------ */

export type ListDensity = "comfortable" | "compact";
export type ListTone = "default" | "info" | "success" | "warning" | "danger";

export type ListItem = {
  key: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  badges?: Array<React.ReactNode | string>;
  tone?: ListTone;
  disabled?: boolean;
};

export interface ListProps extends AccessControlledProps {
  items: ListItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  density?: ListDensity;
  bordered?: boolean;
  emptyStateLabel?: React.ReactNode;
  localeText?: {
    emptyFallbackDescription?: React.ReactNode;
  };
  loading?: boolean;
  selectedKey?: React.Key | null;
  onItemSelect?: (key: React.Key) => void;
  fullWidth?: boolean;
}

const densityClass: Record<ListDensity, string> = {
  comfortable: "px-4 py-4",
  compact: "px-4 py-3",
};

const listSurfaceClassName =
  "relative overflow-hidden rounded-[28px] bg-[var(--surface-card,linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,246,255,0.94)))] shadow-[0_22px_48px_-34px_var(--shadow-color,rgba(15,23,42,0.28))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-x-6 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[var(--surface-card,rgba(255,255,255,0.9))] before:to-transparent";

const toneClass: Record<ListTone, string> = {
  default:
    "border border-[var(--border-subtle)]/75 bg-[var(--surface-card-alt,linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,247,255,0.82)))] ring-1 ring-[var(--border-subtle)]/20 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(15,23,42,0.18))]",
  info:
    "border border-[var(--state-info-border)]/55 bg-[var(--surface-card-alt,linear-gradient(180deg,rgba(239,246,255,0.98),rgba(246,247,255,0.88)))] ring-1 ring-[var(--border-subtle)]/20 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(37,99,235,0.18))]",
  success:
    "border border-[var(--state-success-border)]/55 bg-[var(--surface-card-alt,linear-gradient(180deg,rgba(240,253,244,0.98),rgba(247,250,255,0.88)))] ring-1 ring-[var(--border-subtle)]/20 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(22,163,74,0.18))]",
  warning:
    "border border-[var(--state-warning-border)]/55 bg-[var(--surface-card-alt,linear-gradient(180deg,rgba(255,251,235,0.98),rgba(255,247,237,0.88)))] ring-1 ring-[var(--border-subtle)]/20 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(217,119,6,0.18))]",
  danger:
    "border border-[var(--state-danger-border)]/55 bg-[var(--surface-card-alt,linear-gradient(180deg,rgba(254,242,242,0.98),rgba(255,247,247,0.88)))] ring-1 ring-[var(--border-subtle)]/20 shadow-[0_16px_30px_-28px_var(--shadow-color,rgba(220,38,38,0.18))]",
};

const badgeToneMap: Record<ListTone, BadgeVariant> = {
  default: "default",
  info: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export const List: React.FC<ListProps> = ({
  items,
  title,
  description,
  density = "comfortable",
  bordered = true,
  emptyStateLabel = "No records found for this list.",
  localeText,
  loading = false,
  selectedKey = null,
  onItemSelect,
  fullWidth = true,
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  const resolvedEmptyFallbackDescription =
    localeText?.emptyFallbackDescription ??
    (typeof emptyStateLabel === "string" ? emptyStateLabel : "No records found.");

  if (accessState.isHidden) {
    return null;
  }

  const showEmpty = !loading && items.length === 0;

  return (
    <section
      className={fullWidth ? "w-full" : undefined}
      data-access-state={accessState.state}
      data-component="list"
      data-surface-appearance="premium"
      data-loading={loading ? "true" : "false"}
      data-testid="list-loading-state"
      aria-busy={loading || undefined}
      title={accessReason}
    >
      {title ? (
        <Text as="div" className="text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text variant="secondary" className="mt-1 block text-sm leading-6">
          {description}
        </Text>
      ) : null}

      <div
        className={[
          "mt-4",
          listSurfaceClassName,
          bordered ? "border border-[var(--border-subtle)]/80" : "border border-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {showEmpty ? (
          <div className="p-5">
            <Empty description={resolvedEmptyFallbackDescription} />
          </div>
        ) : (
          <ul className="space-y-3 p-3">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={`loading-${index}`}
                    className={`${toneClass.default} overflow-hidden rounded-[24px]`}
                  >
                    <div className={densityClass[density]}>
                      <div className="flex items-start gap-3">
                        <Skeleton circle height={40} className="shrink-0" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton lines={1} />
                          <Skeleton lines={1} animated={false} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              : items.map((item) => {
                  const itemTone = item.tone ?? "default";
                  const selected = selectedKey === item.key;
                  const interactive = typeof onItemSelect === "function";
                  const blocked = shouldBlockInteraction(accessState.state, item.disabled);
                  const sharedClassName = [
                    "w-full rounded-[24px] text-left transition duration-200",
                    densityClass[density],
                    selected
                      ? "bg-[var(--action-primary-soft)]/60 shadow-[0_18px_34px_-28px_rgba(79,70,229,0.38)]"
                      : "",
                    blocked
                      ? "cursor-not-allowed opacity-70"
                      : interactive
                        ? "hover:-translate-y-px hover:bg-[var(--surface-card,rgba(255,255,255,0.88))] hover:shadow-[0_18px_30px_-26px_var(--shadow-color,rgba(15,23,42,0.18))] active:translate-y-0"
                        : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  const content = (
                    <div className="flex items-start gap-3">
                      {item.prefix ? <div className="flex shrink-0 pt-0.5">{item.prefix}</div> : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Text as="div" className="min-w-0 text-sm font-semibold text-[var(--text-primary)]">
                                {item.title}
                              </Text>
                              {item.badges?.map((badge, badgeIndex) =>
                                typeof badge === "string" ? (
                                  <Badge key={`${item.key}-badge-${badgeIndex}`} variant={badgeToneMap[itemTone]}>
                                    {badge}
                                  </Badge>
                                ) : (
                                  <React.Fragment key={`${item.key}-badge-${badgeIndex}`}>{badge}</React.Fragment>
                                ),
                              )}
                            </div>
                            {item.description ? (
                              <Text variant="secondary" className="block text-sm leading-6">
                                {item.description}
                              </Text>
                            ) : null}
                          </div>
                          {(item.meta || item.suffix) ? (
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              {item.meta ? (
                                <Text variant="secondary" className="rounded-full border border-[var(--border-subtle)]/70 bg-[var(--surface-card,rgba(255,255,255,0.72))] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] shadow-[0_12px_24px_-24px_var(--shadow-color,rgba(15,23,42,0.16))] ring-1 ring-[var(--border-subtle)]/20 backdrop-blur-sm">
                                  {item.meta}
                                </Text>
                              ) : null}
                              {item.suffix}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );

                  return (
                    <li
                      key={item.key}
                      className={`${toneClass[itemTone]} overflow-hidden rounded-[24px]`}
                      data-selected={selected ? "true" : "false"}
                    >
                      {interactive ? (
                        <button
                          type="button"
                          className={sharedClassName}
                          aria-current={selected ? "true" : undefined}
                          onClick={(event) => {
                            if (blocked) {
                              event.preventDefault();
                              event.stopPropagation();
                              return;
                            }
                            onItemSelect?.(item.key);
                          }}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className={sharedClassName}>{content}</div>
                      )}
                    </li>
                  );
                })}
          </ul>
        )}
      </div>
    </section>
  );
};

List.displayName = "List";

export default List;
