"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { variants } from "../../system/variants";
import { setDisplayName } from "../../system/compose";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

const avatarVariants = variants({
  base: "relative inline-flex items-center justify-center overflow-hidden bg-surface-muted select-none shrink-0",
  variants: {
    size: {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  initials?: string;
  fallbackIcon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(props, ref) {
    const {
      className,
      src,
      alt = "",
      initials,
      fallbackIcon,
      size,
      shape,
      ...rest
    } = props;

    const [imgError, setImgError] = React.useState(false);

    React.useEffect(() => { setImgError(false); }, [src]);

    const showImage = src && !imgError;

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size, shape }), className)}
        role="img"
        aria-label={alt || initials || "avatar"}
        {...rest}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : initials ? (
          <span className="font-medium text-text-primary uppercase leading-none">
            {initials.slice(0, 2)}
          </span>
        ) : fallbackIcon ? (
          <span className="flex items-center justify-center [&>svg]:h-[60%] [&>svg]:w-[60%]">
            {fallbackIcon}
          </span>
        ) : (
          <svg className="h-[60%] w-[60%] text-text-secondary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        )}
      </span>
    );
  },
);

setDisplayName(Avatar, "Avatar");

export { Avatar, avatarVariants };
