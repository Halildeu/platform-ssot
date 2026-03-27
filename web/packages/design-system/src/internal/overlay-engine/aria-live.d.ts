import React from "react";
/** Politeness level for screen reader announcements. */
export type AriaLivePoliteness = "polite" | "assertive" | "off";
/** Props for the AriaLiveRegion component. */
export interface AriaLiveRegionProps {
    /** Default politeness level for announcements. @default "polite" */
    defaultPoliteness?: AriaLivePoliteness;
    /** Auto-clear delay in milliseconds after announcement. @default 5000 */
    clearDelay?: number;
    /** Additional CSS class name for the container. */
    className?: string;
    /** Unique identifier for the live region. */
    id?: string;
    /** Whether the region is active and listening for announcements. @default true */
    enabled?: boolean;
    /** Callback fired when an announcement is made. */
    onAnnounce?: (message: string, politeness: AriaLivePoliteness) => void;
}
/**
 * Imperatively announce a message to screen readers.
 * Requires AriaLiveRegion to be mounted in the app.
 *
 * @example
 * ```ts
 * announce("3 items selected");
 * announce("Error: invalid input", "assertive");
 * ```
 */
export declare function announce(message: string, politeness?: AriaLivePoliteness): void;
/**
 * Renders an invisible aria-live region. Mount this once near the root
 * of your app. All `announce()` calls will be routed here.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <>
 *       <AriaLiveRegion />
 *       <Router />
 *     </>
 *   );
 * }
 * ```
 */
export declare const AriaLiveRegion: React.FC<AriaLiveRegionProps>;
/**
 * Hook version of announce for components that want to announce
 * messages without importing the global function.
 */
export declare function useAnnounce(): (message: string, politeness?: AriaLivePoliteness) => void;
