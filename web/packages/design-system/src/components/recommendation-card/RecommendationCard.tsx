import React from "react";
import { Badge } from "../../primitives/badge/Badge";
import { Button } from "../../primitives/button/Button";
import { Text } from "../../primitives/text/Text";
import {
  ConfidenceBadge,
  type ConfidenceLevel,
} from "../confidence-badge/ConfidenceBadge";
import {
  resolveAccessState,
  withAccessGuard,
  type AccessControlledProps,
  type AccessLevel,
} from "../../internal/access-controller";

export type RecommendationCardTone = "info" | "success" | "warning";

export interface RecommendationCardProps extends AccessControlledProps {
  title: React.ReactNode;
  summary: React.ReactNode;
  recommendationType?: React.ReactNode;
  rationale?: string[];
  citations?: string[];
  confidenceLevel?: ConfidenceLevel;
  confidenceScore?: number;
  sourceCount?: number;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  tone?: RecommendationCardTone;
  compact?: boolean;
  badges?: React.ReactNode[];
  footerNote?: React.ReactNode;
  className?: string;
}

const toneClasses: Record<RecommendationCardTone, string> = {
  info: "border-state-info-border bg-state-info",
  success: "border-state-success-border bg-state-success",
  warning: "border-state-warning-border bg-state-warning",
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  summary,
  recommendationType = "Recommendation",
  rationale = [],
  citations = [],
  confidenceLevel = "medium",
  confidenceScore,
  sourceCount,
  primaryActionLabel = "Apply",
  secondaryActionLabel = "Review",
  onPrimaryAction,
  onSecondaryAction,
  tone = "info",
  compact = false,
  badges = [],
  footerNote,
  className = "",
  access = "full",
  accessReason,
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const interactionState: AccessLevel = accessState.isDisabled
    ? "disabled"
    : accessState.isReadonly
      ? "readonly"
      : accessState.state;

  return (
    <article
      className={`rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-5 shadow-sm ${className}`.trim()}
      data-access-state={accessState.state}
      data-tone={tone}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={tone} className={toneClasses[tone]}>
              {recommendationType}
            </Badge>
            <ConfidenceBadge
              level={confidenceLevel}
              score={confidenceScore}
              sourceCount={sourceCount}
              compact={compact}
            />
            {badges.map((badge, index) => (
              <React.Fragment key={`recommendation-badge-${index}`}>
                {badge}
              </React.Fragment>
            ))}
          </div>
          <div>
            <Text as="h3" size="lg" weight="semibold">{title}</Text>
            <Text
              variant="secondary"
              className="mt-2 block leading-7"
            >
              {summary}
            </Text>
          </div>
        </div>
      </div>

      {rationale.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
          <Text variant="secondary" size="xs" weight="medium">Why this recommendation</Text>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            {rationale.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true">&bull;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {citations.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {citations.map((citation) => (
            <Badge key={citation} variant="muted">
              {citation}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            fullWidth={false}
            onClick={withAccessGuard(
              interactionState,
              () => onPrimaryAction?.(),
              accessState.isDisabled,
            )}
            access={accessState.isReadonly ? "readonly" : access}
            title={accessReason}
          >
            {primaryActionLabel}
          </Button>
          <Button
            variant="secondary"
            fullWidth={false}
            onClick={withAccessGuard(
              interactionState,
              () => onSecondaryAction?.(),
              accessState.isDisabled,
            )}
            access={accessState.isReadonly ? "readonly" : access}
            title={accessReason}
          >
            {secondaryActionLabel}
          </Button>
        </div>
        {footerNote ? (
          <Text variant="secondary">{footerNote}</Text>
        ) : null}
      </div>
    </article>
  );
};

RecommendationCard.displayName = 'RecommendationCard';

export default RecommendationCard;
