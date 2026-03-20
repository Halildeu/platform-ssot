import React from "react";
import { cn } from "../../utils/cn";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";
import { focusRingClass, stateAttrs } from "../../internal/interaction-core";

/* ------------------------------------------------------------------ */
/*  AnchorToc — On-page table of contents with hash sync               */
/* ------------------------------------------------------------------ */

export type AnchorTocDensity = "comfortable" | "compact";

export interface AnchorTocItem {
  id: string;
  label: React.ReactNode;
  level?: 1 | 2 | 3;
  meta?: React.ReactNode;
  disabled?: boolean;
}

export interface AnchorTocProps extends AccessControlledProps {
  items: AnchorTocItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  title?: React.ReactNode;
  density?: AnchorTocDensity;
  sticky?: boolean;
  syncWithHash?: boolean;
  className?: string;
  localeText?: {
    title?: React.ReactNode;
    navigationLabel?: string;
  };
}

const densityClass: Record<AnchorTocDensity, string> = {
  comfortable: "gap-2 p-3 text-sm",
  compact: "gap-1.5 p-2.5 text-xs",
};

const levelClass: Record<1 | 2 | 3, string> = {
  1: "pl-0",
  2: "pl-4",
  3: "pl-8",
};

const readHashId = () => {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#/, "");
};

export const AnchorToc = React.forwardRef<HTMLElement, AnchorTocProps>(
  function AnchorToc(
    {
      items,
      value,
      defaultValue,
      onValueChange,
      title,
      density = "comfortable",
      sticky = false,
      syncWithHash = true,
      className,
      localeText,
      access = "full",
      accessReason,
    },
    ref,
  ) {
    const accessState = resolveAccessState(access);
    const firstItemId =
      items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? "";
    const hashItemId = syncWithHash ? readHashId() : "";
    const initialValue =
      hashItemId && items.some((item) => item.id === hashItemId)
        ? hashItemId
        : (defaultValue ?? firstItemId);
    const isControlled = typeof value === "string";
    const [internalValue, setInternalValue] = React.useState(initialValue);

    React.useEffect(() => {
      if (!syncWithHash || isControlled || typeof window === "undefined")
        return undefined;

      const applyHash = () => {
        const nextHashId = readHashId();
        if (nextHashId && items.some((item) => item.id === nextHashId)) {
          setInternalValue(nextHashId);
        }
      };

      applyHash();
      window.addEventListener("hashchange", applyHash);
      return () => window.removeEventListener("hashchange", applyHash);
    }, [isControlled, items, syncWithHash]);

    if (accessState.isHidden || items.length === 0) {
      return null;
    }

    const currentValue = isControlled ? value ?? firstItemId : internalValue;
    const blocked = accessState.isDisabled || accessState.isReadonly;
    const interactionState: AccessLevel = blocked
      ? "disabled"
      : accessState.state;
    const resolvedTitle = title ?? localeText?.title ?? "Bu sayfada";
    const resolvedNavigationLabel =
      localeText?.navigationLabel ?? "Sayfa ici navigasyon";

    const commit = (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      if (syncWithHash && typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${nextValue}`);
      }
      onValueChange?.(nextValue);
    };

    return (
      <nav
        ref={ref}
        aria-label={resolvedNavigationLabel}
        title={accessReason}
        {...stateAttrs({ component: "anchor-toc", disabled: blocked })}
        data-access-state={accessState.state}
        data-density={density}
        className={cn(
          "rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4 shadow-sm",
          sticky && "lg:sticky lg:top-6",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            {resolvedTitle}
          </span>
          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
            {items.length}
          </span>
        </div>

        <ol className="mt-4 flex flex-col gap-2">
          {items.map((item) => {
            const level = item.level ?? 1;
            const active = item.id === currentValue;
            const disabled = blocked || Boolean(item.disabled);
            return (
              <li
                key={item.id}
                className={cn("min-w-0", levelClass[level])}
                data-level={String(level)}
              >
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  aria-disabled={disabled || undefined}
                  data-active={active ? "true" : "false"}
                  className={cn(
                    "group flex min-w-0 items-center justify-between rounded-2xl border transition",
                    focusRingClass("ring"),
                    densityClass[density],
                    active
                      ? "border-[var(--accent-primary,var(--action-primary))] bg-[var(--accent-soft,rgba(79,70,229,0.06))] text-[var(--text-primary)] shadow-sm"
                      : "border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
                    disabled && "pointer-events-none opacity-55",
                  )}
                  onClick={withAccessGuard<
                    React.MouseEvent<HTMLAnchorElement>
                  >(
                    interactionState,
                    (event) => {
                      event.preventDefault();
                      commit(item.id);
                    },
                    disabled,
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {item.label}
                    </span>
                  </span>
                  {item.meta ? (
                    <span className="ml-3 shrink-0 text-[11px] font-medium text-[var(--text-secondary)]">
                      {item.meta}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

AnchorToc.displayName = "AnchorToc";

export default AnchorToc;
