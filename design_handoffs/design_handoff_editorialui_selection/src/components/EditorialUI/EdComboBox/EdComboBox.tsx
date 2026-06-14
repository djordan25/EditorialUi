import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Loader2, X } from 'lucide-react';
import {
    filterByLabel,
    highlightMatch,
    useDebouncedValue,
    useListboxNav,
    useScrollHighlightedIntoView,
} from '../_internal/listbox';
import sharedStyles from '../_internal/menu.module.scss';
import styles from './EdComboBox.module.scss';

/* eslint-disable @typescript-eslint/no-unused-vars */
// Ensures the global :global() classes in the shared stylesheet are bundled
// alongside this component when its styles are imported.
void sharedStyles;
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface EdComboBoxOption {
    value: string;
    label: string;
    /** Optional right-aligned secondary text. */
    meta?: ReactNode;
    /** Optional group key for sectioning. */
    group?: string;
    disabled?: boolean;
}

/** Async search callback. Return the filtered option list for the given query. */
export type EdComboBoxSearchFn = (query: string) => Promise<EdComboBoxOption[]>;

export interface EdComboBoxBaseProps {
    label: ReactNode;
    /** Visible options. Provide an array for sync; provide `onSearch` for async. */
    options?: EdComboBoxOption[];
    /** Async loader. When set, client-side filtering is bypassed. */
    onSearch?: EdComboBoxSearchFn;
    /** Recent / pinned items shown when the query is empty. Async mode only. */
    recents?: EdComboBoxOption[];
    /** Group label for recents. Defaults to "Recent". */
    recentsLabel?: string;

    placeholder?: string;
    searchPlaceholder?: string;
    /** Text when zero matches. Receives the current query. */
    emptyText?: (query: string) => ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    /** Debounce on search keystrokes (async only). Default 200ms. */
    debounceMs?: number;
    /** className on the outer wrapper. */
    wrapperClassName?: string;
    /** className on the trigger. */
    triggerClassName?: string;
    /** Width hint for the menu — defaults to the trigger width. */
    menuWidth?: number | string;
}

export interface EdComboBoxSingleProps extends EdComboBoxBaseProps {
    multiple?: false;
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
}

export interface EdComboBoxMultiProps extends EdComboBoxBaseProps {
    multiple: true;
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;
    /** Show a "Clear all" action row at the bottom of the menu. Default true. */
    showClearAll?: boolean;
}

export type EdComboBoxProps = EdComboBoxSingleProps | EdComboBoxMultiProps;

const NO_OPTIONS: EdComboBoxOption[] = [];

/** Internal flat row for the listbox — items + group headers, in render order. */
type Row =
    | { kind: 'item'; option: EdComboBoxOption; index: number }
    | { kind: 'group'; label: string; key: string }
    | { kind: 'separator'; key: string };

/**
 * EdComboBox — searchable single- or multi-select for known lists.
 * For free-text input with suggestions, use EdAutocomplete.
 *
 *   <EdComboBox
 *     label="Owner"
 *     options={owners}
 *     value={owner}
 *     onValueChange={setOwner}
 *   />
 *
 *   <EdComboBox
 *     multiple
 *     label="Regulations"
 *     options={regs}
 *     values={picked}
 *     onValuesChange={setPicked}
 *   />
 */
export const EdComboBox = forwardRef<HTMLButtonElement, EdComboBoxProps>(
    function EdComboBox(props, ref) {
        const {
            label,
            options: sourceOptions = NO_OPTIONS,
            onSearch,
            recents,
            recentsLabel = 'Recent',
            placeholder = 'Select…',
            searchPlaceholder = 'Search…',
            emptyText,
            hint,
            error,
            required,
            disabled,
            fullWidth = false,
            debounceMs = 200,
            wrapperClassName,
            triggerClassName,
            menuWidth,
        } = props;

        const isMulti = props.multiple === true;

        const autoId = useId();
        const idPrefix = `ed-combo-${autoId}`;
        const triggerId = `${idPrefix}-trigger`;
        const messageId = error || hint ? `${idPrefix}-msg` : undefined;
        const listboxId = `${idPrefix}-listbox`;

        /* ---- Uncontrolled fallback for selection ---- */

        const [internalSingle, setInternalSingle] = useState<string | null>(
            !isMulti ? (props as EdComboBoxSingleProps).defaultValue ?? null : null,
        );
        const [internalMulti, setInternalMulti] = useState<string[]>(
            isMulti ? (props as EdComboBoxMultiProps).defaultValues ?? [] : [],
        );

        const selectedSingle = isMulti
            ? null
            : (props as EdComboBoxSingleProps).value !== undefined
            ? (props as EdComboBoxSingleProps).value ?? null
            : internalSingle;
        const selectedMulti = isMulti
            ? (props as EdComboBoxMultiProps).values ?? internalMulti
            : [];
        const selectedSet = useMemo(() => new Set(selectedMulti), [selectedMulti]);

        /* ---- Open / query state ---- */

        const [open, setOpen] = useState(false);
        const [query, setQuery] = useState('');
        const debouncedQuery = useDebouncedValue(query, onSearch ? debounceMs : 0);
        const searchInputRef = useRef<HTMLInputElement | null>(null);
        const listboxRef = useRef<HTMLUListElement | null>(null);

        /* ---- Async option loading ---- */

        const [asyncOptions, setAsyncOptions] = useState<EdComboBoxOption[] | undefined>(undefined);
        const [loading, setLoading] = useState(false);
        const requestSeq = useRef(0);

        useEffect(() => {
            if (!onSearch || !open) return;
            const seq = ++requestSeq.current;
            setLoading(true);
            let cancelled = false;
            onSearch(debouncedQuery)
                .then((result) => {
                    if (cancelled || seq !== requestSeq.current) return;
                    setAsyncOptions(result);
                })
                .catch(() => {
                    if (!cancelled && seq === requestSeq.current) setAsyncOptions([]);
                })
                .finally(() => {
                    if (!cancelled && seq === requestSeq.current) setLoading(false);
                });
            return () => {
                cancelled = true;
            };
        }, [debouncedQuery, onSearch, open]);

        /* ---- Build visible items ---- */

        const visibleOptions: EdComboBoxOption[] = useMemo(() => {
            if (onSearch) {
                if (asyncOptions === undefined) return [];
                if (!debouncedQuery.trim() && recents?.length) {
                    // Tag recents with a synthetic group so we can section them.
                    const recentTagged = recents.map((r) => ({ ...r, group: r.group ?? '__recent__' }));
                    return [...recentTagged, ...asyncOptions];
                }
                return asyncOptions;
            }
            return filterByLabel(sourceOptions, debouncedQuery);
        }, [asyncOptions, debouncedQuery, onSearch, recents, sourceOptions]);

        /* ---- Flatten into rows (with group headers) ---- */

        const rows: Row[] = useMemo(() => {
            const out: Row[] = [];
            let lastGroup: string | undefined = undefined;
            visibleOptions.forEach((opt, i) => {
                if (opt.group && opt.group !== lastGroup) {
                    if (lastGroup !== undefined) {
                        out.push({ kind: 'separator', key: `sep-${i}` });
                    }
                    const headerLabel = opt.group === '__recent__' ? recentsLabel : opt.group;
                    out.push({ kind: 'group', label: headerLabel, key: `grp-${opt.group}-${i}` });
                    lastGroup = opt.group;
                }
                out.push({ kind: 'item', option: opt, index: i });
            });
            return out;
        }, [visibleOptions, recentsLabel]);

        /* ---- Selection handlers ---- */

        const setSingle = useCallback(
            (next: string | null) => {
                if ((props as EdComboBoxSingleProps).value === undefined) {
                    setInternalSingle(next);
                }
                (props as EdComboBoxSingleProps).onValueChange?.(next);
            },
            [props],
        );

        const setMulti = useCallback(
            (next: string[]) => {
                if ((props as EdComboBoxMultiProps).values === undefined) {
                    setInternalMulti(next);
                }
                (props as EdComboBoxMultiProps).onValuesChange?.(next);
            },
            [props],
        );

        const onSelectIndex = useCallback(
            (index: number) => {
                const opt = visibleOptions[index];
                if (!opt || opt.disabled) return;
                if (isMulti) {
                    const next = selectedSet.has(opt.value)
                        ? selectedMulti.filter((v) => v !== opt.value)
                        : [...selectedMulti, opt.value];
                    setMulti(next);
                    // Keep menu open for multi.
                } else {
                    setSingle(opt.value);
                    setOpen(false);
                    setQuery('');
                }
            },
            [isMulti, selectedMulti, selectedSet, setMulti, setSingle, visibleOptions],
        );

        const onRemoveTag = useCallback(
            (value: string) => {
                if (!isMulti) return;
                setMulti(selectedMulti.filter((v) => v !== value));
            },
            [isMulti, selectedMulti, setMulti],
        );

        const clearAll = useCallback(() => {
            if (isMulti) setMulti([]);
            else setSingle(null);
        }, [isMulti, setMulti, setSingle]);

        /* ---- Keyboard nav ---- */

        const isOptionDisabled = useCallback(
            (i: number) => !!visibleOptions[i]?.disabled,
            [visibleOptions],
        );

        const {
            highlightedIndex,
            setHighlightedIndex,
            onKeyDown,
            activeOptionId,
            getOptionId,
        } = useListboxNav({
            optionCount: visibleOptions.length,
            open,
            onOpen: () => setOpen(true),
            onSelect: onSelectIndex,
            onDismiss: () => setOpen(false),
            idPrefix,
            isDisabled: isOptionDisabled,
        });

        useScrollHighlightedIntoView(listboxRef, activeOptionId);

        /* ---- Reset query when closing ---- */

        useEffect(() => {
            if (!open) {
                setQuery('');
                setAsyncOptions(undefined);
            }
        }, [open]);

        /* ---- Render ---- */

        const selectedOption =
            !isMulti && selectedSingle
                ? sourceOptions.find((o) => o.value === selectedSingle) ??
                  asyncOptions?.find((o) => o.value === selectedSingle) ??
                  recents?.find((o) => o.value === selectedSingle)
                : undefined;

        const renderTriggerContent = () => {
            if (isMulti) {
                if (selectedMulti.length === 0) {
                    return <span className="edcombo__placeholder">{placeholder}</span>;
                }
                return (
                    <>
                        {selectedMulti.map((v) => {
                            const opt =
                                sourceOptions.find((o) => o.value === v) ??
                                asyncOptions?.find((o) => o.value === v) ??
                                recents?.find((o) => o.value === v);
                            const label = opt?.label ?? v;
                            return (
                                <span key={v} className="edcombo__tag">
                                    {label}
                                    <button
                                        type="button"
                                        aria-label={`Remove ${label}`}
                                        className="edcombo__tag-remove"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveTag(v);
                                        }}
                                    >
                                        <X size={11} strokeWidth={2.5} aria-hidden />
                                    </button>
                                </span>
                            );
                        })}
                    </>
                );
            }
            if (!selectedSingle) {
                return <span className="edcombo__placeholder">{placeholder}</span>;
            }
            return <span className={styles.value}>{selectedOption?.label ?? selectedSingle}</span>;
        };

        const showClearAll =
            isMulti && (props as EdComboBoxMultiProps).showClearAll !== false && selectedMulti.length > 0;

        const renderEmpty = () => {
            if (loading) {
                return (
                    <div className="edmenu__empty">
                        <span className="edmenu__loading">
                            <Loader2 size={14} className={styles.spinner} aria-hidden />
                            Loading…
                        </span>
                    </div>
                );
            }
            const node = emptyText
                ? emptyText(debouncedQuery)
                : `No results${debouncedQuery ? ` for "${debouncedQuery}"` : ''}`;
            return <div className="edmenu__empty">{node}</div>;
        };

        return (
            <div
                className={[
                    styles.root,
                    fullWidth && styles.fullWidth,
                    wrapperClassName,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                <label
                    htmlFor={triggerId}
                    className={[styles.label, required && styles.labelRequired]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {label}
                </label>
                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Trigger asChild>
                        <button
                            ref={ref}
                            id={triggerId}
                            type="button"
                            role="combobox"
                            aria-expanded={open}
                            aria-haspopup="listbox"
                            aria-controls={listboxId}
                            aria-describedby={messageId}
                            aria-invalid={error ? true : undefined}
                            aria-required={required || undefined}
                            disabled={disabled}
                            data-disabled={disabled || undefined}
                            data-state={open ? 'open' : 'closed'}
                            className={[
                                'edcombo__trigger',
                                isMulti && 'edcombo__trigger--multi',
                                error && 'edcombo__trigger--error',
                                triggerClassName,
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            <span className={styles.triggerInner}>{renderTriggerContent()}</span>
                            <span className="edcombo__chev" aria-hidden>
                                <ChevronDown size={14} strokeWidth={1.8} />
                            </span>
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                            align="start"
                            sideOffset={4}
                            className="edmenu"
                            style={menuWidth ? { width: menuWidth } : undefined}
                            onOpenAutoFocus={(e) => {
                                e.preventDefault();
                                searchInputRef.current?.focus();
                            }}
                        >
                            <div className="edmenu__search">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="edmenu__input"
                                    placeholder={searchPlaceholder}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    aria-autocomplete="list"
                                    aria-controls={listboxId}
                                    aria-activedescendant={activeOptionId}
                                    role="combobox"
                                    aria-expanded={open}
                                    onKeyDown={(e) => {
                                        if (onKeyDown(e)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            {visibleOptions.length === 0 ? (
                                renderEmpty()
                            ) : (
                                <ul
                                    ref={listboxRef}
                                    id={listboxId}
                                    role="listbox"
                                    aria-multiselectable={isMulti}
                                    aria-label={typeof label === 'string' ? label : undefined}
                                    className="edmenu__listbox"
                                >
                                    {rows.map((row) => {
                                        if (row.kind === 'group') {
                                            return (
                                                <li
                                                    key={row.key}
                                                    role="presentation"
                                                    className="edmenu__group-label"
                                                >
                                                    {row.label}
                                                </li>
                                            );
                                        }
                                        if (row.kind === 'separator') {
                                            return (
                                                <li
                                                    key={row.key}
                                                    role="separator"
                                                    className="edmenu__separator"
                                                />
                                            );
                                        }
                                        const opt = row.option;
                                        const i = row.index;
                                        const isSelected = isMulti
                                            ? selectedSet.has(opt.value)
                                            : selectedSingle === opt.value;
                                        const isHighlighted = highlightedIndex === i;
                                        return (
                                            <li
                                                key={opt.value}
                                                id={getOptionId(i)}
                                                role="option"
                                                aria-selected={isSelected}
                                                aria-disabled={opt.disabled || undefined}
                                                className={[
                                                    'edmenu__option',
                                                    isHighlighted && 'edmenu__option--highlighted',
                                                    isSelected && 'edmenu__option--selected',
                                                ]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                                onMouseEnter={() => setHighlightedIndex(i)}
                                                onMouseDown={(e) => {
                                                    // Don't blur the search input.
                                                    e.preventDefault();
                                                }}
                                                onClick={() => onSelectIndex(i)}
                                            >
                                                <span
                                                    className={[
                                                        'edmenu__check',
                                                        !isSelected && 'edmenu__check--placeholder',
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' ')}
                                                >
                                                    <Check size={12} strokeWidth={2.5} aria-hidden />
                                                </span>
                                                <span className="edmenu__label">
                                                    {highlightSegments(opt.label, debouncedQuery)}
                                                </span>
                                                {opt.meta && (
                                                    <span className="edmenu__meta">{opt.meta}</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {showClearAll && (
                                <div
                                    role="button"
                                    tabIndex={-1}
                                    className="edmenu__action-row"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={clearAll}
                                >
                                    Clear all
                                </div>
                            )}
                            {/* Live region for screen readers */}
                            <span
                                role="status"
                                aria-live="polite"
                                style={{
                                    position: 'absolute',
                                    width: 1,
                                    height: 1,
                                    overflow: 'hidden',
                                    clip: 'rect(0 0 0 0)',
                                }}
                            >
                                {loading
                                    ? 'Loading…'
                                    : `${visibleOptions.length} result${
                                          visibleOptions.length === 1 ? '' : 's'
                                      }`}
                            </span>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
                {(error || hint) && (
                    <p
                        id={messageId}
                        className={[styles.hint, error && styles.hintError]
                            .filter(Boolean)
                            .join(' ')}
                        role={error ? 'alert' : undefined}
                        aria-live={error ? 'polite' : undefined}
                    >
                        {error || hint}
                    </p>
                )}
            </div>
        );
    },
);

function highlightSegments(text: string, query: string) {
    if (!query) return text;
    return highlightMatch(text, query).map((seg, i) =>
        seg.matched ? (
            <span key={i} className="edmenu__hi">
                {seg.text}
            </span>
        ) : (
            <span key={i}>{seg.text}</span>
        ),
    );
}
