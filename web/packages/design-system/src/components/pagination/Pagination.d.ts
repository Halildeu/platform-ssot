import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type PaginationSize = "sm" | "md";
export interface PaginationProps extends AccessControlledProps {
    /** Total number of items across all pages. */
    total?: number;
    /** Controlled current page number. */
    current?: number;
    /** Initial page for uncontrolled mode. Ignored when `current` is provided. */
    defaultCurrent?: number;
    /** Number of items per page. */
    pageSize?: number;
    /** Callback fired when the page changes. */
    onChange?: (page: number) => void;
    /** Max page buttons visible (excluding prev/next) */
    siblingCount?: number;
    /** Size variant for the pagination buttons. */
    size?: PaginationSize;
    /** Show total count */
    showTotal?: boolean;
    /** Additional CSS class name. */
    className?: string;
}
/**
 * Page navigation control with smart ellipsis, controlled/uncontrolled modes, and keyboard support.
 *
 * @example
 * ```tsx
 * <Pagination
 *   total={150}
 *   pageSize={10}
 *   current={currentPage}
 *   onChange={setCurrentPage}
 * />
 * ```
 */
export declare const Pagination: React.ForwardRefExoticComponent<PaginationProps & React.RefAttributes<HTMLElement>>;
