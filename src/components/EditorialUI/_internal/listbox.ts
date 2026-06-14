// Internal — not exported from the public barrel.
//
// Shared listbox-keyboard-nav + filter + highlight utilities used by
// EdComboBox and EdAutocomplete. Keeping this private avoids accidentally
// committing to a public API for these helpers.

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type RefObject,
} from 'react';

/** Result of useListboxNav: state + handlers + helpers. */
export interface UseListboxNavResult {
    /** Index of the currently highlighted option (-1 when none). */
    highlightedIndex: number;
    /** Set the highlight explicitly (e.g. on hover). */
    setHighlightedIndex: (i: number) => void;
    /**
     * Keydown handler for the input that owns the listbox.
     * Returns true when the event was handled (caller should preventDefault).
     */
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => boolean;
    /** Id of the active option, for aria-activedescendant. */
    activeOptionId: string | undefined;
    /** Build a stable id for an option by index. */
    getOptionId: (index: number) => string;
}

export interface UseListboxNavOptions {
    /** Number of options currently visible. */
    optionCount: number;
    /** Called when the user picks the highlighted option (Enter or Tab-commit). */
    onSelect: (index: number) => void;
    /** Called when the user dismisses (Esc). */
    onDismiss?: () => void;
    /** Whether the listbox is open. When false, arrow keys open it via onOpen. */
    open: boolean;
    /** Called when the user opens the listbox via ArrowDown/ArrowUp. */
    onOpen?: () => void;
    /** Stable id prefix for options. */
    idPrefix: string;
    /** Skip these indices when navigating (disabled items). */
    isDisabled?: (index: number) => boolean;
}

/**
 * Keyboard navigation for a listbox-style menu controlled by an input.
 * Handles ArrowUp/Down with wrap, Home/End, Enter to select, Esc to dismiss.
 */
export function useListboxNav({
    optionCount,
    onSelect,
    onDismiss,
    open,
    onOpen,
    idPrefix,
    isDisabled,
}: UseListboxNavOptions): UseListboxNavResult {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // Reset highlight when the option list shrinks past it.
    useEffect(() => {
        if (highlightedIndex >= optionCount) {
            setHighlightedIndex(optionCount > 0 ? 0 : -1);
        }
    }, [optionCount, highlightedIndex]);

    // Reset highlight when the menu closes.
    useEffect(() => {
        if (!open) setHighlightedIndex(-1);
    }, [open]);

    const move = useCallback(
        (delta: number, start?: number) => {
            if (optionCount === 0) return;
            const begin = start ?? highlightedIndex;
            let next = begin;
            for (let step = 0; step < optionCount; step++) {
                next = (next + delta + optionCount) % optionCount;
                if (!isDisabled?.(next)) {
                    setHighlightedIndex(next);
                    return;
                }
            }
        },
        [highlightedIndex, isDisabled, optionCount],
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>): boolean => {
            switch (event.key) {
                case 'ArrowDown': {
                    if (!open) {
                        onOpen?.();
                        // Highlight first non-disabled item.
                        move(1, -1);
                    } else {
                        move(1);
                    }
                    return true;
                }
                case 'ArrowUp': {
                    if (!open) {
                        onOpen?.();
                        move(-1, optionCount);
                    } else {
                        move(-1);
                    }
                    return true;
                }
                case 'Home': {
                    if (!open || optionCount === 0) return false;
                    move(1, -1);
                    return true;
                }
                case 'End': {
                    if (!open || optionCount === 0) return false;
                    move(-1, optionCount);
                    return true;
                }
                case 'Enter': {
                    if (!open || highlightedIndex < 0) return false;
                    onSelect(highlightedIndex);
                    return true;
                }
                case 'Escape': {
                    if (!open) return false;
                    onDismiss?.();
                    return true;
                }
                default:
                    return false;
            }
        },
        [highlightedIndex, move, onDismiss, onOpen, onSelect, open, optionCount],
    );

    const activeOptionId =
        highlightedIndex >= 0 ? `${idPrefix}-opt-${highlightedIndex}` : undefined;

    const getOptionId = useCallback(
        (i: number) => `${idPrefix}-opt-${i}`,
        [idPrefix],
    );

    return {
        highlightedIndex,
        setHighlightedIndex,
        onKeyDown,
        activeOptionId,
        getOptionId,
    };
}

/* ---- Highlight matched substring ---- */

interface HighlightSegment {
    text: string;
    matched: boolean;
}

/**
 * Split a string into matched/unmatched segments around the query.
 * Case-insensitive, returns a single unmatched segment when query is empty.
 */
export function highlightMatch(text: string, query: string): HighlightSegment[] {
    if (!query) return [{ text, matched: false }];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const idx = lowerText.indexOf(lowerQuery);
    if (idx < 0) return [{ text, matched: false }];
    return [
        { text: text.slice(0, idx), matched: false },
        { text: text.slice(idx, idx + query.length), matched: true },
        { text: text.slice(idx + query.length), matched: false },
    ];
}

/* ---- Scroll the active option into view ---- */

export function useScrollHighlightedIntoView(
    listboxRef: RefObject<HTMLElement | null>,
    activeOptionId: string | undefined,
) {
    useEffect(() => {
        if (!activeOptionId || !listboxRef.current) return;
        const el = listboxRef.current.querySelector<HTMLElement>(
            `[id='${activeOptionId}']`,
        );
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeOptionId, listboxRef]);
}

/* ---- Simple text filter ---- */

/** Filter items by a case-insensitive substring match against the label. */
export function filterByLabel<T extends { label: string }>(
    items: T[],
    query: string,
): T[] {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q));
}

/* ---- Debounce ---- */

export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    const lastValue = useRef(value);
    useEffect(() => {
        lastValue.current = value;
        const id = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}

/* ---- Internal types echoed by EdComboBox & EdAutocomplete ---- */

/**
 * Memoize the index-set of "selected" values for fast lookup in O(1) when
 * rendering multi-select option lists.
 */
export function useSelectedSet(values: readonly string[] | undefined): Set<string> {
    return useMemo(() => new Set(values ?? []), [values]);
}
