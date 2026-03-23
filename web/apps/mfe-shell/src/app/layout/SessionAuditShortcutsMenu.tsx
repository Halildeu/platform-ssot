import React from 'react';
import { ShieldCheck, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  buildSessionAuditShortcutTarget,
  getSessionAuditShortcutMeta,
  sessionAuditShortcutVariants,
} from './SessionAuditShortcut';

type SessionAuditShortcutsMenuProps = {
  email?: string | null;
  label: string;
};

export const SessionAuditShortcutsMenu: React.FC<SessionAuditShortcutsMenuProps> = ({
  email,
  label,
}) => {
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const normalizedEmail = typeof email === 'string' ? email.trim() : '';

  React.useEffect(() => {
    if (!open || typeof window === 'undefined') {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, [open]);

  if (!normalizedEmail) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        data-testid="session-audit-shortcuts-menu-trigger"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-border-subtle bg-surface-panel px-3 text-xs font-semibold text-text-primary shadow-xs transition hover:bg-surface-muted"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        <span className="hidden xl:inline">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open ? (
        <div
          data-testid="session-audit-shortcuts-menu"
          className="absolute right-0 z-50 mt-2 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border-subtle bg-surface-panel shadow-xl"
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
              {label}
            </div>
            <div className="mt-1 text-[11px] leading-5 text-text-secondary">
              Kullanıcı bazlı audit kısayolları tek panelde toplandı.
            </div>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto p-2" role="menu" aria-label={label}>
            {sessionAuditShortcutVariants.map((variant) => {
              const { capability, testId } = getSessionAuditShortcutMeta(variant);
              const target = buildSessionAuditShortcutTarget(normalizedEmail, variant);

              if (!target) {
                return null;
              }

              return (
                <li key={variant}>
                  <button
                    type="button"
                    role="menuitem"
                    data-testid={`session-audit-shortcuts-menu-item-${testId}`}
                    className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-surface-muted"
                    onClick={() => {
                      setOpen(false);
                      navigate(target);
                    }}
                    title={capability.shortcutTitle}
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-default text-text-secondary">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-text-primary">
                        {capability.shortcutLabel}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-5 text-text-secondary">
                        {capability.shortcutTitle}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default SessionAuditShortcutsMenu;
