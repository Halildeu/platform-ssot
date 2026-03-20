import React from "react";
import {
  resolveAccessState,
  type AccessControlledProps,
} from "../../internal/access-controller";
import {
  OverlaySurface,
  premiumOverlayPanelClassName,
  premiumOverlayCloseButtonClassName,
  type OverlayCloseReason,
} from "../../internal/OverlaySurface";
import {
  NotificationPanel,
  type NotificationPanelProps,
} from "./NotificationPanel";

/* ------------------------------------------------------------------ */
/*  NotificationDrawer                                                  */
/* ------------------------------------------------------------------ */

export interface NotificationDrawerProps
  extends AccessControlledProps,
    Omit<
      NotificationPanelProps,
      "className" | "access" | "accessReason" | "headerAccessory"
    > {
  open: boolean;
  onClose?: (reason: OverlayCloseReason) => void;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  keepMounted?: boolean;
  destroyOnHidden?: boolean;
  portalTarget?: HTMLElement | null;
  disablePortal?: boolean;
  dialogLabel?: string;
  widthClassName?: string;
  panelClassName?: string;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
  closeLabel = "Bildirim merkezini kapat",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  keepMounted = false,
  destroyOnHidden = true,
  portalTarget,
  disablePortal = false,
  dialogLabel = "Bildirimler",
  widthClassName = "max-w-md",
  panelClassName = "",
  access = "full",
  accessReason,
  title = "Bildirimler",
  ...panelProps
}) => {
  const accessState = resolveAccessState(access);

  return (
    <OverlaySurface
      open={open}
      accessState={accessState}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      keepMounted={keepMounted}
      destroyOnHidden={destroyOnHidden}
      placement="right"
      transitionPreset="slide"
      portalTarget={portalTarget}
      disablePortal={disablePortal}
      ariaLabel={dialogLabel}
      viewportClassName="flex h-full justify-end"
      surfaceClassName={`${premiumOverlayPanelClassName} flex h-full w-full flex-col overflow-hidden bg-surface-default ${widthClassName}`.trim()}
      surfaceAppearance="premium"
    >
      <NotificationPanel
        {...panelProps}
        title={title}
        access={access}
        accessReason={accessReason}
        className={`h-full rounded-none border-0 shadow-none ${panelClassName}`.trim()}
        headerAccessory={
          <button
            type="button"
            onClick={() => onClose?.("close-button")}
            disabled={accessState.isReadonly || accessState.isDisabled}
            aria-label={closeLabel}
            title={closeLabel}
            className={premiumOverlayCloseButtonClassName}
          >
            ×
          </button>
        }
      />
    </OverlaySurface>
  );
};

NotificationDrawer.displayName = 'NotificationDrawer';

export default NotificationDrawer;
