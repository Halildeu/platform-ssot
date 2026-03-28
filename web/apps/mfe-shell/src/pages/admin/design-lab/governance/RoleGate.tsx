/**
 * Conditional render based on Design Lab role.
 *
 * Usage:
 *   <RoleGate minRole="maintainer">
 *     <ApproveButton />
 *   </RoleGate>
 *
 * Children are rendered only when the current user's role meets or exceeds
 * the specified minimum. An optional `fallback` prop can display alternative
 * content when the gate blocks rendering.
 */

import React from "react";
import {
  useDesignLabRBAC,
  type DesignLabRole,
} from "./useDesignLabRBAC";

interface RoleGateProps {
  /** Minimum role required to render children */
  minRole: DesignLabRole;
  /** Optional fallback when role is insufficient */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({
  minRole,
  fallback = null,
  children,
}: RoleGateProps): React.ReactElement | null {
  const { isAtLeast } = useDesignLabRBAC();

  if (!isAtLeast(minRole)) {
    return (fallback as React.ReactElement | null) ?? null;
  }

  return <>{children}</>;
}

export default RoleGate;
