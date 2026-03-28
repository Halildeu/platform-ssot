import React from "react";
import { type DescriptionsItem } from "../../components/descriptions/Descriptions";
import { type SummaryStripItem } from "../summary-strip/SummaryStrip";
import { type EntitySummaryBlockProps } from "../entity-summary-block/EntitySummaryBlock";
import { type AccessControlledProps } from "../../internal/access-controller";
/** Props for the DetailSummary component.
 * @example
 * ```tsx
 * <DetailSummary />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/detail-summary)
 */
export interface DetailSummaryProps extends AccessControlledProps {
    /** Breadcrumb or eyebrow text above the title */
    eyebrow?: React.ReactNode;
    /** Primary heading for the detail page */
    title: React.ReactNode;
    /** Subtitle or description below the title */
    description?: React.ReactNode;
    /** Secondary metadata (version, date, etc.) */
    meta?: React.ReactNode;
    /** Status badge or indicator */
    status?: React.ReactNode;
    /** Action buttons (edit, delete, etc.) */
    actions?: React.ReactNode;
    /** Aside slot rendered next to the header */
    aside?: React.ReactNode;
    /** KPI items for the summary strip */
    summaryItems?: SummaryStripItem[];
    /** Entity summary block configuration */
    entity: EntitySummaryBlockProps;
    /** Key-value description list items */
    detailItems?: DescriptionsItem[];
    /** Heading for the detail descriptions panel */
    detailTitle?: React.ReactNode;
    /** Description for the detail descriptions panel */
    detailDescription?: React.ReactNode;
    /** Raw JSON value for the debug viewer panel */
    jsonValue?: unknown;
    /** Heading for the JSON viewer panel */
    jsonTitle?: React.ReactNode;
    /** Description for the JSON viewer panel */
    jsonDescription?: React.ReactNode;
    /** Additional CSS class for the root section */
    className?: string;
}
/**
 * Full detail page layout combining page header, summary strip, entity block,
 * description list and optional JSON viewer into a single composable pattern.
 */
export declare const DetailSummary: React.ForwardRefExoticComponent<DetailSummaryProps & React.RefAttributes<HTMLElement>>;
export default DetailSummary;
/** Type alias for DetailSummary ref. */
export type DetailSummaryRef = React.Ref<HTMLElement>;
/** Type alias for DetailSummary element. */
export type DetailSummaryElement = HTMLElement;
/** Type alias for DetailSummary cssproperties. */
export type DetailSummaryCSSProperties = React.CSSProperties;
