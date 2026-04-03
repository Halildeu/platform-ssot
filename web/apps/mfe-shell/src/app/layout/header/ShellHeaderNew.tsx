import React from 'react';
import { HeaderBar, useBreakpoint } from '@mfe/design-system';
import { BrandMark } from './BrandMark';
import { MegaNavigation } from './MegaNavigation';
import { GlobalSearchTrigger } from './GlobalSearchTrigger';
import { HeaderActions } from './HeaderActions';

/* ------------------------------------------------------------------ */
/*  ShellHeaderNew — World-class header orchestrator                   */
/*                                                                     */
/*  Desktop (≥md): [Brand] [MegaNav] — [Search] — [Actions]           */
/*  Mobile  (<md): [Hamburger] [Brand] — [Actions]                    */
/*                                                                     */
/*  Design principles:                                                 */
/*  - Content-first chrome (subtle, not attention-grabbing)            */
/*  - Sub-100ms response for all interactions                          */
/*  - Functional micro-interactions (150ms transitions)                */
/*  - No emojis — all icons from lucide-react                          */
/*  - All UI from @mfe/design-system                                   */
/* ------------------------------------------------------------------ */

export const ShellHeaderNew: React.FC = () => {
  const { isBelow } = useBreakpoint();
  const isMobile = isBelow('md');

  return (
    <HeaderBar
      cssHeightVar="--shell-header-h"
      blur
      card
      cardClassName="!gap-2 !py-1.5 !px-2"
    >
      {/* Left zone — Brand + Navigation (hamburger on mobile) */}
      <div className="flex min-w-0 shrink-0 items-center gap-1">
        {isMobile && <MegaNavigation mobile />}
        <BrandMark />
        {!isMobile && (
          <>
            <div className="mx-1 h-5 w-px bg-border-subtle/40" aria-hidden />
            <MegaNavigation />
          </>
        )}
      </div>

      {/* Center zone — Global Search (hidden on mobile) */}
      {!isMobile && (
        <div className="flex flex-1 items-center justify-center px-2">
          <GlobalSearchTrigger />
        </div>
      )}

      {/* Spacer on mobile to push actions right */}
      {isMobile && <div className="flex-1" />}

      {/* Right zone — Actions */}
      <HeaderActions />
    </HeaderBar>
  );
};
