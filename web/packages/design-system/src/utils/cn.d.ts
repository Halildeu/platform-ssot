import { type ClassValue } from "clsx";
/**
 * Merge class names with Tailwind CSS conflict resolution.
 *
 * @example
 * cn("px-4 py-2", active && "bg-primary", className)
 */
export declare function cn(...inputs: ClassValue[]): string;
