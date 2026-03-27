import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type MasterDetailRatio = "1:2" | "1:3" | "2:3" | "1:1";
/** Props for the MasterDetail component.
 * @example
 * ```tsx
 * <MasterDetail />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/master-detail)
 */
export interface MasterDetailProps extends AccessControlledProps {
    /** Master (list) panel content */
    master: React.ReactNode;
    /** Detail panel content */
    detail: React.ReactNode;
    /** Empty state when no detail selected */
    detailEmpty?: React.ReactNode;
    /** Whether a detail item is selected (show detail vs empty) */
    hasSelection?: boolean;
    /** Split ratio */
    ratio?: MasterDetailRatio;
    /** Master panel header */
    masterHeader?: React.ReactNode;
    /** Detail panel header */
    detailHeader?: React.ReactNode;
    /** Collapsible master panel */
    collapsible?: boolean;
    /** Divider between panels */
    divider?: boolean;
    /** Min width of master panel in px */
    masterMinWidth?: number;
    className?: string;
}
/** Split-pane layout with a list panel on the left and a detail panel on the right. */
export declare const MasterDetail: React.ForwardRefExoticComponent<MasterDetailProps & React.RefAttributes<HTMLDivElement>>;
