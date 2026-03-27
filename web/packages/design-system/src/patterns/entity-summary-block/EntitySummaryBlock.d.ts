import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
import { type DescriptionsItem } from "../../components/descriptions/Descriptions";
/** Props for {@link EntitySummaryBlock}.
 * @example
 * ```tsx
 * <EntitySummaryBlock />
 * ```
 * @since 1.0.0
 * @see [Docs](https://design.mfe.dev/components/entity-summary-block)
 */
export interface EntitySummaryBlockProps extends AccessControlledProps {
    /** Primary heading for the entity. */
    title: React.ReactNode;
    /** Secondary text displayed below the title. */
    subtitle?: React.ReactNode;
    /** Badge rendered inline next to the title. */
    badge?: React.ReactNode;
    /** Avatar configuration displayed beside the title area. */
    avatar?: {
        /** Image source URL for the avatar. */
        src?: string;
        /** Alt text for the avatar image. */
        alt?: string;
        /** Name used to derive initials when no image is available. */
        name?: string;
        /** Icon rendered as a fallback when no image or initials are available. */
        fallbackIcon?: React.ReactNode;
    };
    /** Action buttons rendered in the top-right corner. */
    actions?: React.ReactNode;
    /** Key-value description items displayed in a two-column grid. */
    items: DescriptionsItem[];
    /** Additional CSS class for the outer section element. */
    className?: string;
}
/** Summary card displaying an entity with avatar, title, badges, actions, and key-value items. */
export declare const EntitySummaryBlock: React.ForwardRefExoticComponent<EntitySummaryBlockProps & React.RefAttributes<HTMLElement>>;
export default EntitySummaryBlock;
/** Type alias for EntitySummaryBlock ref. */
export type EntitySummaryBlockRef = React.Ref<HTMLElement>;
/** Type alias for EntitySummaryBlock element. */
export type EntitySummaryBlockElement = HTMLElement;
/** Type alias for EntitySummaryBlock cssproperties. */
export type EntitySummaryBlockCSSProperties = React.CSSProperties;
