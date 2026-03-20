import React from "react";
import { Button } from "../../primitives/button/Button";
import { EmptyState as Empty } from "../empty-state/EmptyState";
import { Skeleton } from "../../primitives/skeleton/Skeleton";
import { Spinner } from "../../primitives/spinner/Spinner";
import { Text } from "../../primitives/text/Text";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";

/* ------------------------------------------------------------------ */
/*  EmptyErrorLoading — Tri-state feedback recipe                       */
/*                                                                     */
/*  Displays one of: empty, error, or loading state with consistent    */
/*  styling. Combines Empty, Spinner, and Skeleton subcomponents.      */
/* ------------------------------------------------------------------ */

export type EmptyErrorLoadingMode = "empty" | "error" | "loading";

export interface EmptyErrorLoadingProps extends AccessControlledProps {
  mode: EmptyErrorLoadingMode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  errorLabel?: React.ReactNode;
  retryLabel?: string;
  onRetry?: () => void;
  loadingLabel?: string;
  showSkeleton?: boolean;
  className?: string;
}

export const EmptyErrorLoading: React.FC<EmptyErrorLoadingProps> = ({
  mode,
  title = "Durum tarifi",
  description = "Bos, hata ve yukleme durumlari ayni geri bildirim dilini kullanir.",
  errorLabel = "Something went wrong. Check the evidence set and upstream connections.",
  retryLabel = "Retry",
  onRetry,
  loadingLabel = "Loading",
  showSkeleton = true,
  className = "",
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  return (
    <section
      className={`rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-component="empty-error-loading"
      data-mode={mode}
      title={accessReason}
    >
      <Text
        as="div"
        className="text-base font-semibold text-[var(--text-primary)]"
      >
        {title}
      </Text>
      <Text variant="secondary" className="mt-1 block text-sm leading-6">
        {description}
      </Text>

      <div className="mt-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-default)] p-4">
        {mode === "loading" ? (
          <div className="space-y-4">
            <Spinner mode="block" label={loadingLabel} />
            {showSkeleton ? (
              <div className="grid grid-cols-1 gap-3">
                <Skeleton lines={2} />
                <Skeleton className="h-28" />
                <Skeleton height={40} />
              </div>
            ) : null}
          </div>
        ) : mode === "error" ? (
          <div className="space-y-4">
            <Empty
              description={
                typeof errorLabel === "string"
                  ? errorLabel
                  : "Bir hata olustu"
              }
            />
            {onRetry ? (
              <div className="flex justify-center">
                <Button
                  fullWidth={false}
                  variant="secondary"
                  onClick={onRetry}
                  access={access}
                >
                  {retryLabel}
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <Empty description="Veri bulunamadi." />
        )}
      </div>
    </section>
  );
};

EmptyErrorLoading.displayName = "EmptyErrorLoading";

export default EmptyErrorLoading;
