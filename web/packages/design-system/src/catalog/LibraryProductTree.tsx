import React from 'react';
import clsx from 'clsx';
import { Badge } from '../primitives/badge';
import { Text } from '../primitives/text';

export type LibraryProductTreeBadgeTone = 'info' | 'warning' | 'muted' | 'success';

export type LibraryProductTreeItem = {
  id: string;
  label: string;
  badgeLabel?: string;
  badgeTone?: LibraryProductTreeBadgeTone;
};

export type LibraryProductTreeSubgroup = {
  id: string;
  label: string;
  items: LibraryProductTreeItem[];
};

export type LibraryProductTreeGroup = {
  id: string;
  label: string;
  badgeLabel?: string;
  subgroups: LibraryProductTreeSubgroup[];
};

export type LibraryProductTreeTrack = {
  id: string;
  label: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  badgeLabel?: string;
  accentClassName?: string;
  selectedToneClassName?: string;
  emptyStateLabel?: string;
  groups: LibraryProductTreeGroup[];
};

export type LibraryProductTreeSelection = {
  trackId: string | null;
  groupId: string | null;
  subgroupId: string | null;
  itemId: string | null;
};

export type LibraryProductTreeProps = {
  tracks: LibraryProductTreeTrack[];
  className?: string;
  selection?: Partial<LibraryProductTreeSelection>;
  defaultSelection?: Partial<LibraryProductTreeSelection>;
  onSelectionChange?: (selection: LibraryProductTreeSelection) => void;
  testIdPrefix?: string;
};

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 text-text-secondary">
    <path d="m6 3 4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 text-text-secondary">
    <path d="m3 6 5 4 5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const makeGroupKey = (trackId: string, groupId: string) => `${trackId}:${groupId}`;
const makeSubgroupKey = (trackId: string, groupId: string, subgroupId: string) => `${trackId}:${groupId}:${subgroupId}`;
const isSameSelection = (
  left: LibraryProductTreeSelection | Partial<LibraryProductTreeSelection> | null | undefined,
  right: LibraryProductTreeSelection | Partial<LibraryProductTreeSelection> | null | undefined,
) =>
  (left?.trackId ?? null) === (right?.trackId ?? null) &&
  (left?.groupId ?? null) === (right?.groupId ?? null) &&
  (left?.subgroupId ?? null) === (right?.subgroupId ?? null) &&
  (left?.itemId ?? null) === (right?.itemId ?? null);

const ensureTrackSelection = (tracks: LibraryProductTreeTrack[], fallback?: Partial<LibraryProductTreeSelection>): LibraryProductTreeSelection => {
  const track = tracks.find((entry) => entry.id === fallback?.trackId) ?? tracks[0] ?? null;
  const group = track?.groups.find((entry) => entry.id === fallback?.groupId) ?? track?.groups[0] ?? null;
  const subgroup = group?.subgroups.find((entry) => entry.id === fallback?.subgroupId) ?? group?.subgroups[0] ?? null;
  const item = subgroup?.items.find((entry) => entry.id === fallback?.itemId) ?? subgroup?.items[0] ?? null;

  return {
    trackId: track?.id ?? null,
    groupId: group?.id ?? null,
    subgroupId: subgroup?.id ?? null,
    itemId: item?.id ?? null,
  };
};

export const LibraryProductTree: React.FC<LibraryProductTreeProps> = ({
  tracks,
  className,
  selection: controlledSelection,
  defaultSelection,
  onSelectionChange,
  testIdPrefix,
}) => {
  const isControlled = typeof controlledSelection !== 'undefined';
  const [uncontrolledSelection, setUncontrolledSelection] = React.useState<LibraryProductTreeSelection>(() =>
    ensureTrackSelection(tracks, defaultSelection),
  );
  const lastEmittedSelectionRef = React.useRef<LibraryProductTreeSelection | null>(null);
  const selection = React.useMemo(
    () => ensureTrackSelection(tracks, isControlled ? controlledSelection : uncontrolledSelection),
    [controlledSelection, isControlled, tracks, uncontrolledSelection],
  );
  const [expandedTracks, setExpandedTracks] = React.useState<string[]>(
    selection.trackId ? [selection.trackId] : [],
  );
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(
    selection.trackId && selection.groupId ? [makeGroupKey(selection.trackId, selection.groupId)] : [],
  );
  const [expandedSubgroups, setExpandedSubgroups] = React.useState<string[]>(
    selection.trackId && selection.groupId && selection.subgroupId
      ? [makeSubgroupKey(selection.trackId, selection.groupId, selection.subgroupId)]
      : [],
  );

  React.useEffect(() => {
    if (isControlled) return;
    const next = ensureTrackSelection(tracks, uncontrolledSelection);
    if (isSameSelection(uncontrolledSelection, next)) return;
    setUncontrolledSelection(next);
  }, [isControlled, tracks, uncontrolledSelection]);

  const emitSelectionChange = React.useCallback(
    (nextSelection: LibraryProductTreeSelection) => {
      if (isSameSelection(lastEmittedSelectionRef.current, nextSelection)) return;
      lastEmittedSelectionRef.current = nextSelection;
      onSelectionChange?.(nextSelection);
    },
    [onSelectionChange],
  );

  const commitSelection = React.useCallback(
    (nextSelection: LibraryProductTreeSelection) => {
      if (!isControlled) {
        setUncontrolledSelection((current) => (isSameSelection(current, nextSelection) ? current : nextSelection));
      }
      emitSelectionChange(nextSelection);
    },
    [emitSelectionChange, isControlled],
  );

  React.useEffect(() => {
    if (isControlled) return;
    emitSelectionChange(selection);
  }, [emitSelectionChange, isControlled, selection]);

  React.useEffect(() => {
    const validTrackIds = new Set(tracks.map((track) => track.id));
    const validGroupKeys = new Set(
      tracks.flatMap((track) => track.groups.map((group) => makeGroupKey(track.id, group.id))),
    );
    const validSubgroupKeys = new Set(
      tracks.flatMap((track) =>
        track.groups.flatMap((group) =>
          group.subgroups.map((subgroup) => makeSubgroupKey(track.id, group.id, subgroup.id)),
        ),
      ),
    );

    setExpandedTracks((prev) => prev.filter((value) => validTrackIds.has(value)));
    setExpandedGroups((prev) => prev.filter((value) => validGroupKeys.has(value)));
    setExpandedSubgroups((prev) => prev.filter((value) => validSubgroupKeys.has(value)));
  }, [tracks]);

  React.useEffect(() => {
    if (!selection.trackId) return;
    setExpandedTracks((prev) => (prev.includes(selection.trackId!) ? prev : [...prev, selection.trackId!]));

    if (selection.groupId) {
      const groupKey = makeGroupKey(selection.trackId, selection.groupId);
      setExpandedGroups((prev) => {
        const next = prev.filter((value) => !value.startsWith(`${selection.trackId}:`));
        return next.includes(groupKey) ? next : [...next, groupKey];
      });
    }

    if (selection.groupId && selection.subgroupId) {
      const subgroupKey = makeSubgroupKey(selection.trackId, selection.groupId, selection.subgroupId);
      setExpandedSubgroups((prev) => [
        ...prev.filter((value) => !value.startsWith(`${selection.trackId}:${selection.groupId}:`)),
        subgroupKey,
      ]);
    }
  }, [selection.trackId, selection.groupId, selection.subgroupId]);

  const toggleTrack = (track: LibraryProductTreeTrack) => {
    const isExpanded = expandedTracks.includes(track.id);
    if (isExpanded) {
      setExpandedTracks((prev) => prev.filter((value) => value !== track.id));
      setExpandedGroups((prev) => prev.filter((value) => !value.startsWith(`${track.id}:`)));
      setExpandedSubgroups((prev) => prev.filter((value) => !value.startsWith(`${track.id}:`)));
      return;
    }

    const group = track.groups[0] ?? null;
    const subgroup = group?.subgroups[0] ?? null;
    const item = subgroup?.items[0] ?? null;
    setExpandedTracks((prev) => (prev.includes(track.id) ? prev : [...prev, track.id]));
    commitSelection({
      trackId: track.id,
      groupId: group?.id ?? null,
      subgroupId: subgroup?.id ?? null,
      itemId: item?.id ?? null,
    });
  };

  const toggleGroup = (track: LibraryProductTreeTrack, group: LibraryProductTreeGroup) => {
    const groupKey = makeGroupKey(track.id, group.id);
    const isExpanded = expandedGroups.includes(groupKey);

    if (isExpanded) {
      setExpandedGroups((prev) => prev.filter((value) => value !== groupKey));
      setExpandedSubgroups((prev) => prev.filter((value) => !value.startsWith(`${track.id}:${group.id}:`)));
      return;
    }

    const subgroup = group.subgroups[0] ?? null;
    const item = subgroup?.items[0] ?? null;
    setExpandedGroups((prev) => (prev.includes(groupKey) ? prev : [...prev, groupKey]));
    if (subgroup) {
      const subgroupKey = makeSubgroupKey(track.id, group.id, subgroup.id);
      setExpandedSubgroups((prev) => [
        ...prev.filter((value) => !value.startsWith(`${track.id}:${group.id}:`)),
        subgroupKey,
      ]);
    } else {
      setExpandedSubgroups((prev) => prev.filter((value) => !value.startsWith(`${track.id}:${group.id}:`)));
    }
    commitSelection({
      trackId: track.id,
      groupId: group.id,
      subgroupId: subgroup?.id ?? null,
      itemId: item?.id ?? null,
    });
  };

  const toggleSubgroup = (track: LibraryProductTreeTrack, group: LibraryProductTreeGroup, subgroup: LibraryProductTreeSubgroup) => {
    const subgroupKey = makeSubgroupKey(track.id, group.id, subgroup.id);
    const isExpanded = expandedSubgroups.includes(subgroupKey);

    if (isExpanded) {
      setExpandedSubgroups((prev) => prev.filter((value) => value !== subgroupKey));
      return;
    }

    setExpandedSubgroups((prev) => [
      ...prev.filter((value) => !value.startsWith(`${track.id}:${group.id}:`)),
      subgroupKey,
    ]);
    commitSelection({
      trackId: track.id,
      groupId: group.id,
      subgroupId: subgroup.id,
      itemId: subgroup.items[0]?.id ?? null,
    });
  };

  const selectItem = (
    track: LibraryProductTreeTrack,
    group: LibraryProductTreeGroup,
    subgroup: LibraryProductTreeSubgroup,
    item: LibraryProductTreeItem,
  ) => {
    setExpandedTracks((prev) => (prev.includes(track.id) ? prev : [...prev, track.id]));
    const groupKey = makeGroupKey(track.id, group.id);
    setExpandedGroups((prev) => (prev.includes(groupKey) ? prev : [...prev, groupKey]));
    const subgroupKey = makeSubgroupKey(track.id, group.id, subgroup.id);
    setExpandedSubgroups((prev) => [
      ...prev.filter((value) => !value.startsWith(`${track.id}:${group.id}:`)),
      subgroupKey,
    ]);
    commitSelection({
      trackId: track.id,
      groupId: group.id,
      subgroupId: subgroup.id,
      itemId: item.id,
    });
  };

  return (
    <div
      className={clsx('gap-3', className)}
      data-testid={testIdPrefix ? `${testIdPrefix}-tree-section` : undefined}
    >
      <div data-testid={testIdPrefix ? `${testIdPrefix}-track-section` : undefined} className="gap-3">
      {tracks.map((track) => {
        const isTrackExpanded = expandedTracks.includes(track.id);
        const isTrackSelected = selection.trackId === track.id;
        const isTrackDisabled = track.groups.length === 0;
        return (
          <div
            key={track.id}
            className={clsx(
              'overflow-hidden rounded-[24px] border transition-colors',
              isTrackSelected
                ? track.selectedToneClassName ?? 'border-action-primary/35 bg-surface-default'
                : 'border-border-subtle bg-surface-panel',
            )}
          >
            <button
              type="button"
              onClick={() => toggleTrack(track)}
              disabled={isTrackDisabled}
              aria-disabled={isTrackDisabled || undefined}
              data-testid={testIdPrefix ? `${testIdPrefix}-track-${track.id}` : undefined}
              className={clsx(
                'flex w-full items-center gap-3 px-4 py-3 text-left disabled:cursor-not-allowed disabled:opacity-60',
                isTrackSelected ? 'bg-surface-default' : 'hover:bg-surface-muted',
              )}
            >
              {isTrackExpanded ? <ChevronDown /> : <ChevronRight />}
              <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl', isTrackSelected ? 'bg-surface-panel' : 'bg-surface-canvas')}>
                {track.icon}
              </span>
              <div className="min-w-0 flex-1">
                {track.eyebrow ? (
                  <Text as="div" variant="secondary" className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    {track.eyebrow}
                  </Text>
                ) : null}
                <Text as="div" className="mt-1 text-sm font-semibold text-text-primary">
                  {track.label}
                </Text>
              </div>
              {track.badgeLabel ? <Badge variant={isTrackSelected ? 'info' : 'muted'}>{track.badgeLabel}</Badge> : null}
            </button>

            {isTrackExpanded ? (
              <div className="border-t border-border-subtle px-4 py-3">
                {isTrackDisabled ? (
                  <Text
                    variant="secondary"
                    className="block rounded-[18px] border border-dashed border-border-default bg-surface-canvas px-3 py-3 text-xs leading-6"
                    data-testid={testIdPrefix ? `${testIdPrefix}-track-empty-${track.id}` : undefined}
                  >
                    {track.emptyStateLabel ?? 'Bu filtre ve lens icin gorunur oge yok.'}
                  </Text>
                ) : (
                  <div
                    className="flex flex-col gap-2"
                    data-testid={
                      testIdPrefix && isTrackSelected ? `${testIdPrefix}-group-section` : undefined
                    }
                  >
                    {track.groups.map((group) => {
                      const groupKey = makeGroupKey(track.id, group.id);
                      const isGroupExpanded = expandedGroups.includes(groupKey);
                      const isGroupSelected = selection.trackId === track.id && selection.groupId === group.id;
                      return (
                        <div key={groupKey} className="mb-2 last:mb-0">
                          <button
                            type="button"
                            onClick={() => toggleGroup(track, group)}
                            data-testid={testIdPrefix ? `${testIdPrefix}-group-${group.id}` : undefined}
                            className={clsx(
                              'flex w-full items-center gap-3 rounded-[18px] border px-3 py-2.5 text-left transition-colors',
                              isGroupSelected
                                ? 'border-action-primary/30 bg-surface-default shadow-xs'
                                : 'border-border-subtle bg-surface-canvas hover:bg-surface-muted',
                            )}
                          >
                            {isGroupExpanded ? <ChevronDown /> : <ChevronRight />}
                            <span className={clsx('h-7 w-1.5 shrink-0 rounded-full', isGroupSelected ? track.accentClassName ?? 'bg-action-primary' : 'bg-border-default')} />
                            <span className="min-w-0 flex-1 text-sm font-semibold text-text-primary">{group.label}</span>
                            {group.badgeLabel ? <Badge variant="muted">{group.badgeLabel}</Badge> : null}
                          </button>

                          {isGroupExpanded ? (
                            <div className="flex flex-col mt-2 gap-2 rounded-[18px] border border-border-subtle bg-surface-default p-2">
                              {group.subgroups.map((subgroup) => {
                                const subgroupKey = makeSubgroupKey(track.id, group.id, subgroup.id);
                                const isSubgroupExpanded = expandedSubgroups.includes(subgroupKey);
                                return (
                                  <div key={subgroupKey} className="mb-2 last:mb-0">
                                    <button
                                      type="button"
                                      onClick={() => toggleSubgroup(track, group, subgroup)}
                                      data-testid={
                                        testIdPrefix
                                          ? `${testIdPrefix}-subgroup-${subgroup.id
                                              .trim()
                                              .toLowerCase()
                                              .replace(/[^a-z0-9]+/g, '_')
                                              .replace(/^_+|_+$/g, '')}`
                                          : undefined
                                      }
                                      className={clsx(
                                        'grid w-full grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-3 rounded-[16px] border px-3 py-2.5 text-left transition-colors',
                                        isSubgroupExpanded ? 'border-border-default bg-surface-panel' : 'border-transparent bg-transparent hover:bg-surface-muted',
                                      )}
                                    >
                                      {isSubgroupExpanded ? <ChevronDown /> : <ChevronRight />}
                                      <span className={clsx('h-6 w-1 shrink-0 rounded-full', isSubgroupExpanded ? track.accentClassName ?? 'bg-action-primary' : 'bg-border-subtle')} />
                                      <span className="min-w-0">
                                        <span className="block break-words text-xs font-semibold leading-5 text-text-secondary">
                                          {subgroup.label}
                                        </span>
                                        <span className="mt-2 block">
                                          <Badge variant="muted">{subgroup.items.length}</Badge>
                                        </span>
                                      </span>
                                    </button>

                                    {isSubgroupExpanded ? (
                                      <div className="flex flex-col mt-2 gap-1 rounded-[16px] bg-surface-canvas p-2">
                                        {subgroup.items.map((item) => {
                                          const isItemActive =
                                            selection.trackId === track.id &&
                                            selection.groupId === group.id &&
                                            selection.subgroupId === subgroup.id &&
                                            selection.itemId === item.id;
                                          return (
                                            <button
                                              key={`${subgroupKey}:${item.id}`}
                                              type="button"
                                              onClick={() => selectItem(track, group, subgroup, item)}
                                              data-testid={
                                                testIdPrefix
                                                  ? `${testIdPrefix}-item-${item.id
                                                      .trim()
                                                      .toLowerCase()
                                                      .replace(/[^a-z0-9]+/g, '_')
                                                      .replace(/^_+|_+$/g, '')}`
                                                  : undefined
                                              }
                                              className={clsx(
                                                'mb-1 grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-[16px] border px-3 py-2.5 text-left transition-colors last:mb-0',
                                                isItemActive
                                                  ? 'border-action-primary/25 bg-surface-default shadow-xs'
                                                  : 'border-transparent bg-transparent hover:bg-surface-muted',
                                              )}
                                            >
                                              <span className={clsx('h-5 w-1 shrink-0 rounded-full', isItemActive ? track.accentClassName ?? 'bg-action-primary' : 'bg-transparent')} />
                                              <span className="min-w-0">
                                                <span className="block break-words text-sm font-medium leading-6 text-text-primary">
                                                  {item.label}
                                                </span>
                                                {item.badgeLabel ? (
                                                  <span className="mt-2 block">
                                                    <Badge variant={item.badgeTone ?? 'muted'}>{item.badgeLabel}</Badge>
                                                  </span>
                                                ) : null}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default LibraryProductTree;
