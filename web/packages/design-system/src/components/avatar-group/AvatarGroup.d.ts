import React from "react";
import { type AccessControlledProps } from "../../internal/access-controller";
export type AvatarGroupItem = {
    key: React.Key;
    src?: string;
    name?: string;
    icon?: React.ReactNode;
};
export type AvatarGroupSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarGroupShape = "circle" | "square";
export type AvatarGroupSpacing = "tight" | "normal" | "loose";
export interface AvatarGroupProps extends AccessControlledProps {
    /** Avatar items to display. */
    items: AvatarGroupItem[];
    /** Maximum number of avatars to show before the "+N" badge. */
    max?: number;
    /** Size variant. @default "md" */
    size?: AvatarGroupSize;
    /** Shape variant. @default "circle" */
    shape?: AvatarGroupShape;
    /** Overlap spacing. @default "normal" */
    spacing?: AvatarGroupSpacing;
    /** Custom renderer for the excess count badge. */
    renderExcess?: (count: number) => React.ReactNode;
    /** Called when an avatar is clicked. */
    onClick?: (item: AvatarGroupItem) => void;
    /** Additional class name for the root element. */
    className?: string;
}
export declare const AvatarGroup: React.ForwardRefExoticComponent<AvatarGroupProps & React.RefAttributes<HTMLDivElement>>;
export default AvatarGroup;
