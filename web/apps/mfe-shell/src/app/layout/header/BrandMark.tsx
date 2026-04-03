import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon } from 'lucide-react';

/**
 * BrandMark — Compact logo + app name for the header.
 * Click navigates to home. Subtle scale on hover.
 */
export const BrandMark: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="group flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
      aria-label="Platform home"
    >
      <Hexagon
        className="h-5 w-5 text-[var(--accent-primary)] transition-colors duration-150 group-hover:text-[var(--accent-primary-hover)]"
        strokeWidth={2.5}
        aria-hidden
      />
      <span className="hidden text-sm font-semibold text-text-primary md:inline">
        Platform
      </span>
    </button>
  );
};
