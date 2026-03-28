import React from "react";
import { useShellCommonI18n } from "../i18n";

/* ------------------------------------------------------------------ */
/*  UserMenuPopover — User profile dropdown menu                       */
/* ------------------------------------------------------------------ */

type UserMenuItem =
  | { key: string; label: string; icon?: React.ReactNode; disabled?: boolean }
  | { type: "divider" };

export interface UserMenuPopoverProps {
  items: UserMenuItem[];
  onClose: () => void;
  onLogout?: () => void;
}

export const UserMenuPopover: React.FC<UserMenuPopoverProps> = ({
  items,
  onClose,
  onLogout,
}) => {
  const { t } = useShellCommonI18n();
  return (
    <div
      className="absolute right-0 z-50 mt-2 min-w-[220px] rounded-xl border border-border-subtle bg-surface-panel shadow-xl p-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
        {t("shell.userMenu.title")}
      </div>
      <ul className="flex flex-col gap-1 text-sm text-text-primary">
        {items.map((item, index) => {
          if ("type" in item && item.type === "divider") {
            return (
              <li
                key={`divider-${index}`}
                className="my-1 border-t border-border-subtle"
              />
            );
          }
          const actionItem = item as { key: string; label: string; icon?: React.ReactNode; disabled?: boolean };
          const handleClick = () => {
            if (actionItem.disabled) return;
            if (actionItem.key === "logout") {
              onLogout?.();
            }
            onClose();
          };
          return (
            <li key={actionItem.key}>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-text-primary hover:bg-surface-muted disabled:text-text-subtle"
                onClick={handleClick}
                disabled={actionItem.disabled}
              >
                {actionItem.icon ? <span aria-hidden>{actionItem.icon}</span> : null}
                <span className="truncate">{actionItem.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
