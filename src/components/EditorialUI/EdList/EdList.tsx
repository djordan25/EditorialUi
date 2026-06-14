import {
    forwardRef,
    useId,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdList.module.scss';

export interface EdListItem {
    /** Stable id — also the selected value. */
    id: string;
    /** Primary label. */
    title: ReactNode;
    /** Secondary muted line below the title. */
    description?: ReactNode;
    /** Leading visual — avatar, icon, etc. */
    leading?: ReactNode;
    /** Trailing meta — shortcut hint, count. Folded into the accessible name. */
    meta?: ReactNode;
    disabled?: boolean;
    /** Optional group key — items with the same group render under one label. */
    group?: string;
}

export interface EdListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
    items: EdListItem[];
    /**
     * Selection mode:
     *  - `none` (default) — static <ul>/<li>; items are not interactive.
     *  - `single` — listbox with `role="option"` + `aria-selected`; arrow-key nav.
     */
    selectionMode?: 'none' | 'single';
    /** Selected item id (single mode). */
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    /** Map of group key → visible label. Groups render in first-seen order. */
    groupLabels?: Record<string, ReactNode>;
    /** Accessible name for the listbox. */
    ariaLabel?: string;
    /** Empty-state node when items is empty. */
    empty?: ReactNode;
    /** Render skeleton rows instead of items. */
    loading?: boolean;
    /** Number of skeleton rows when loading. Default 3. */
    loadingRows?: number;
}

/** Compose an item's accessible name from title + description + meta. */
function accessibleName(item: EdListItem): string | undefined {
    const parts = [item.title, item.description, item.meta]
        .filter((p) => typeof p === 'string') as string[];
    return parts.length ? parts.join(', ') : undefined;
}

/**
 * EdList — vertical list of selectable / scannable rows. Picker results, recent
 * items, entity selectors, command-palette results. For ≥3 columns / sorting /
 * selection-with-actions use EdDataTable; for button-triggered actions use EdMenu.
 *
 *   <EdList
 *     selectionMode="single"
 *     selectedId={owner}
 *     onSelect={setOwner}
 *     groupLabels={{ recent: 'Recent' }}
 *     items={[
 *       { id: 'mc', title: 'Marcus Chen', description: 'Validation · 14 open', leading: <Avatar/>, group: 'recent' },
 *     ]}
 *   />
 */
export const EdList = forwardRef<HTMLUListElement, EdListProps>(function EdList(
    {
        items,
        selectionMode = 'none',
        selectedId,
        onSelect,
        groupLabels = {},
        ariaLabel,
        empty,
        loading = false,
        loadingRows = 3,
        className,
        ...rest
    },
    ref,
) {
    const labelId = useId();
    const isListbox = selectionMode === 'single';

    /* ---- Group items in first-seen order ---- */
    const groups: { key: string | undefined; items: EdListItem[] }[] = [];
    for (const item of items) {
        const existing = groups.find((g) => g.key === item.group);
        if (existing) existing.items.push(item);
        else groups.push({ key: item.group, items: [item] });
    }

    if (loading) {
        return (
            <ul ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
                {Array.from({ length: loadingRows }).map((_, i) => (
                    <li key={i} className={styles.item} style={{ pointerEvents: 'none' }}>
                        <span className={styles.skeletonAvatar} />
                        <span className={styles.body}>
                            <span className={styles.skeletonLine} style={{ maxWidth: 160 }} />
                            <span className={styles.skeletonLine} style={{ maxWidth: 100, marginTop: 6 }} />
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    if (items.length === 0) {
        return (
            <ul ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
                <li className={styles.emptyRow}>{empty ?? <span className={styles.emptyText}>No matches</span>}</li>
            </ul>
        );
    }

    const renderItem = (item: EdListItem) => {
        const selected = isListbox && selectedId === item.id;
        const commonProps = {
            className: [
                styles.item,
                selected && styles.itemSelected,
                item.disabled && styles.itemDisabled,
            ]
                .filter(Boolean)
                .join(' '),
        };

        const content = (
            <>
                {item.leading && <span className={styles.leading} aria-hidden>{item.leading}</span>}
                <span className={styles.body}>
                    <span className={styles.title}>{item.title}</span>
                    {item.description && <span className={styles.description}>{item.description}</span>}
                </span>
                {item.meta && <span className={styles.meta}>{item.meta}</span>}
            </>
        );

        if (isListbox) {
            return (
                <li
                    key={item.id}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={item.disabled || undefined}
                    aria-label={accessibleName(item)}
                    tabIndex={item.disabled ? undefined : selected || (selectedId == null && groups[0].items[0].id === item.id) ? 0 : -1}
                    {...commonProps}
                    onClick={item.disabled ? undefined : () => onSelect?.(item.id)}
                    onKeyDown={
                        item.disabled
                            ? undefined
                            : (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      onSelect?.(item.id);
                                  }
                              }
                    }
                >
                    {content}
                </li>
            );
        }

        return (
            <li key={item.id} {...commonProps}>
                {content}
            </li>
        );
    };

    return (
        <ul
            ref={ref}
            role={isListbox ? 'listbox' : undefined}
            aria-label={isListbox ? ariaLabel : undefined}
            aria-labelledby={isListbox && !ariaLabel ? labelId : undefined}
            className={[styles.root, className].filter(Boolean).join(' ')}
            {...rest}
        >
            {groups.map((group, gi) => (
                <li key={group.key ?? `g-${gi}`} className={styles.groupWrap} role={isListbox ? 'group' : undefined}>
                    {group.key && groupLabels[group.key] && (
                        <span className={styles.groupLabel} id={`${labelId}-${gi}`}>
                            {groupLabels[group.key]}
                        </span>
                    )}
                    <ul className={styles.groupItems} role={isListbox ? 'presentation' : undefined}>
                        {group.items.map(renderItem)}
                    </ul>
                </li>
            ))}
        </ul>
    );
});
