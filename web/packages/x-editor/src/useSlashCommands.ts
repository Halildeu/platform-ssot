import { useState, useCallback, useMemo } from 'react';
import type { SlashCommand } from './types';

export interface UseSlashCommandsReturn {
  isOpen: boolean;
  position: { top: number; left: number };
  filteredCommands: SlashCommand[];
  selectedIndex: number;
  open: (position: { top: number; left: number }) => void;
  close: () => void;
  filter: (query: string) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  executeSelected: () => void;
}

export function useSlashCommands(commands: SlashCommand[]): UseSlashCommandsReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    const lower = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower) ||
        cmd.category?.toLowerCase().includes(lower),
    );
  }, [commands, query]);

  const open = useCallback((pos: { top: number; left: number }) => {
    setPosition(pos);
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const filter = useCallback((q: string) => {
    setQuery(q);
    setSelectedIndex(0);
  }, []);

  const selectNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
  }, [filteredCommands.length]);

  const selectPrevious = useCallback(() => {
    setSelectedIndex((prev) =>
      prev <= 0 ? Math.max(filteredCommands.length - 1, 0) : prev - 1,
    );
  }, [filteredCommands.length]);

  const executeSelected = useCallback(() => {
    const cmd = filteredCommands[selectedIndex];
    if (cmd) {
      // Caller is responsible for passing the editor ref to cmd.execute
      // This hook only manages UI state
      return cmd;
    }
    return null;
  }, [filteredCommands, selectedIndex]);

  return {
    isOpen,
    position,
    filteredCommands,
    selectedIndex,
    open,
    close,
    filter,
    selectNext,
    selectPrevious,
    executeSelected: executeSelected as unknown as () => void,
  };
}
