import React from "react";
import { Badge } from "../../primitives/badge/Badge";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";

export type ConfidenceLevel = "low" | "medium" | "high" | "very-high";

export interface ConfidenceBadgeProps extends AccessControlledProps {
  level?: ConfidenceLevel;
  score?: number;
  sourceCount?: number;
  compact?: boolean;
  showScore?: boolean;
  label?: React.ReactNode;
  className?: string;
}

const toneByLevel: Record<
  ConfidenceLevel,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  low: "warning",
  medium: "info",
  high: "success",
  "very-high": "success",
};

const labelByLevel: Record<ConfidenceLevel, string> = {
  low: "Dusuk guven",
  medium: "Orta guven",
  high: "Yuksek guven",
  "very-high": "Cok yuksek guven",
};

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  level = "medium",
  score,
  sourceCount,
  compact = false,
  showScore = true,
  label,
  className,
  access = "full",
}) => {
  const accessState = resolveAccessState(access);
  if (accessState.isHidden) {
    return null;
  }

  const parts: React.ReactNode[] = [];
  parts.push(label ?? labelByLevel[level]);

  if (showScore && typeof score === "number") {
    const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
    parts.push(`${normalizedScore}%`);
  }

  if (!compact && typeof sourceCount === "number") {
    parts.push(`${sourceCount} source${sourceCount === 1 ? "" : "s"}`);
  }

  return (
    <Badge
      variant={toneByLevel[level]}
      className={className}
      aria-label={labelByLevel[level]}
      data-confidence-level={level}
    >
      {compact ? parts.slice(0, 2).join(" · ") : parts.join(" · ")}
    </Badge>
  );
};

ConfidenceBadge.displayName = 'ConfidenceBadge';

export default ConfidenceBadge;
