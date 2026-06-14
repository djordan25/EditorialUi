import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Loader2, Plus } from 'lucide-react';
import {
    filterByLabel,
    highlightMatch,
    useDebouncedValue,
    useListboxNav,
    useScrollHighlightedIntoView,
} from '../_internal/listbox';
import sharedStyles from '../_internal/menu.module.scss';
import styles from './EdAutocomplete.module.scss';

/* eslint-disable @typescript-eslint/no-unused-vars */
void sharedStyles;
/* eslint-enable @typescript-eslint/no-unused-vars */

export interface EdAutocompleteOption {
    value: string;
    label: string;
    /** Optional one-line secondary text (mono, smaller) — IDs, statuses. */
    secondary?: ReactNode;
    /** Optional group key for sectioning. */
    group?: string;
    disabled?: boolean;
}

export type EdAutocompleteSearchFn = (query: string) => Promise<EdAutocompleteOption[]>;

export interface EdAutocompleteProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'value' | 'defaultValue' | 'onChange' | 'size' | 'list'
    > {
    label: ReactNode;
    /** Sync option list — filtered against the typed query. */
    options?: EdAutocompleteOption[];
    /** Async loader — bypasses client-side filter. */
    onSearch?: EdAutocompleteSearchFn;
    /** Group label for sync options without a group key. */
    suggestionsLabel?: string;

    /** Free-text value (controlled). */
    value?: string;
    /** Uncontrolled initial value. */
    defaultValue?: string;
    /** Fires on every keystroke. */
    onValueChange?: (value: string) => void;
    /** Fires when the user picks a suggestion. The input value is also set to option.label. */
    onSuggestionSelect?: (option: EdAutocompleteOption) => void;

    /** Show a "Create" action when no exact label match exists. */
    allowCreate?: boolean | ((query: string) => boolean);
    /** Label for the create action. Defaults to `Create "{query}"`. */
    createLabel?: (query: string) => ReactNode;
    /** Fires when the user picks the create action. The typed query is committed. */
    onCreate?: (query: string) => void;

    /** Minimum query length before suggestions open. Default 2. */
    minQueryLength?: number;
    /** Debounce on async search. Default 200ms. */
    debounceMs?: number;

    placeholder?: string;
    hint?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    fullWidth?: boolean;
    /** className on the outer wrapper. */
    wrapperClassName?: string;
}

type Row =
    | { kind: 'item'; option: EdAutocompleteOption; index: number }
    | { kind: 'group'; label: string; key: string };

const NO_OPTIONS: EdAutocompleteOption[] = [];

/**
 * EdAutocomplete — free-text input with suggestions.
 * The user can type anything; suggestions are hints, not constraints.
 *
 *   <EdAutocomplete
 *     label="Finding title"
 *     options={recentFindings}
 *     value={title}
 *     onValueChange={setTitle}
 *     allowCreate
 *     onCreate={(q) => createFinding(q)}
 *   />
 */
export const EdAutocomplete = forwardRef<HTMLInputElement, EdAutocompleteProps>(
    function EdAutocomplete(
        {
            label,
            options: sourceOptions = NO_OPTIONS,
            onSearch,
            suggestionsLabel,
            value,
            defaultValue = '',
            onValueChange,
            onSuggestionSelect,
            allowCreate = false,
            createLabel,
            onCreate,
            minQueryLength = 2,
            debounceMs = 200,
            placeholder,
            hint,
            error,
            required,
            disabled,
            fullWidth = false,
            wrapperClassName,
            id,
            className,
            onFocus,
            onBlur,
            ...rest
        },
        ref,
    ) {
        const autoId = useId();
        const idPrefix = `ed-auto-${autoId}`;
        const inputId = id ?? `${idPrefix}-input`;
        const listboxId = `${idPrefix}-listbox`;
        const messageId = error || hint ? `${idPrefix}-msg` : undefined;

        /* ---- Internal value when uncontrolled ---- */

        const [internalValue, setInternalValue] = useState(defaultValue);
        const currentValue = value !== undefined ? value : internalValue;

        const inputRef = useRef<HTMLInputElement | null>(null);
        useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
        const listboxRef = useRef<HTMLUListElement | null>(null);

        const [open, setOpen] = useState(false);

        const debouncedQuery = useDebouncedValue(currentValue, onSearch ? debounceMs : 0);

        /* ---- Async loading ---- */

        const [asyncOptions, setAsyncOptions] = useState<EdAutocompleteOption[] | undefined>(
            undefined,
        );
        const [loading, setLoading] = useState(false);
        const requestSeq = useRef(0);

        useEffect(() => {
            if (!onSearch) return;
            if (!open) return;
            if (debouncedQuery.length < minQueryLength) {
                setAsyncOptions([]);
                setLoading(false);
                return;
            }
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
        }, [debouncedQuery, onSearch, open, minQueryLength]);

        /* ---- Visible options ---- */

        const visibleOptions: EdAutocompleteOption[] = useMemo(() => {
            if (currentValue.length < minQueryLength) return [];
            if (onSearch) return asyncOptions ?? [];
            return filterByLabel(sourceOptions, currentValue);
        }, [asyncOptions, currentValue, minQueryLength, onSearch, sourceOptions]);

        /* ---- Should we show the "Create" action? ---- */

        const allowCreateNow = useMemo(() => {
            if (!allowCreate) return false;
            const enabled =
                typeof allowCreate === 'function' ? allowCreate(currentValue) : allowCreate;
            if (!enabled) return false;
            if (currentValue.trim().length === 0) return false;
            const exactMatch = visibleOptions.some(
                (o) => o.label.toLowerCase() === currentValue.toLowerCase(),
            );
            return !exactMatch;
        }, [allowCreate, currentValue, visibleOptions]);

        /* ---- Total navigable rows = options + (create row) ---- */

        const CREATE_INDEX = visibleOptions.length;
        const totalNavigable = visibleOptions.length + (allowCreateNow ? 1 : 0);

        /* ---- Build display rows w/ optional group header ---- */

        const rows: Row[] = useMemo(() => {
            const out: Row[] = [];
            const headerLabel =
                suggestionsLabel ??
                (visibleOptions.length > 0
                    ? `${visibleOptions.length} suggestion${visibleOptions.length === 1 ? '' : 's'}`
                    : undefined);

            let lastGroup: string | undefined = undefined;
            let pushedDefaultHeader = false;
            visibleOptions.forEach((opt, i) => {
                if (opt.group) {
                    if (opt.group !== lastGroup) {
                        out.push({ kind: 'group', label: opt.group, key: `grp-${opt.group}-${i}` });
                        lastGroup = opt.group;
                    }
                } else if (!pushedDefaultHeader && headerLabel) {
                    out.push({ kind: 'group', label: headerLabel, key: 'grp-default' });
                    pushedDefaultHeader = true;
                }
                out.push({ kind: 'item', option: opt, index: i });
            });
            return out;
        }, [suggestionsLabel, visibleOptions]);

        /* ---- Setters ---- */

        const setValue = useCallback(
            (next: string) => {
                if (value === undefined) setInternalValue(next);
                onValueChange?.(next);
            },
            [onValueChange, value],
        );

        const handleSelect = useCallback(
            (index: number) => {
                if (index === CREATE_INDEX && allowCreateNow) {
                    onCreate?.(currentValue.trim());
                    setOpen(false);
                    return;
                }
                const opt = visibleOptions[index];
                if (!opt || opt.disabled) return;
                setValue(opt.label);
                onSuggestionSelect?.(opt);
                setOpen(false);
            },
            [
                CREATE_INDEX,
                allowCreateNow,
                currentValue,
                onCreate,
                onSuggestionSelect,
                setValue,
                visibleOptions,
            ],
        );

        const isOptionDisabled = useCallback(
            (i: number) => {
                if (i === CREATE_INDEX) return false; // create row never disabled
                return !!visibleOptions[i]?.disabled;
            },
            [CREATE_INDEX, visibleOptions],
        );

        const {
            highlightedIndex,
            setHighlightedIndex,
            onKeyDown: navKeyDown,
            activeOptionId,
            getOptionId,
        } = useListboxNav({
            optionCount: totalNavigable,
            open,
            onOpen: () => {
                if (currentValue.length >= minQueryLength) setOpen(true);
            },
            onSelect: handleSelect,
            onDismiss: () => setOpen(false),
            idPrefix,
            isDisabled: isOptionDisabled,
        });

        useScrollHighlightedIntoView(listboxRef, activeOptionId);

        /* ---- Open/close coordination ---- */

        useEffect(() => {
            if (currentValue.length < minQueryLength) {
                setOpen(false);
            }
        }, [currentValue, minQueryLength]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            if (e.target.value.length >= minQueryLength) setOpen(true);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (currentValue.length >= minQueryLength) setOpen(true);
            onFocus?.(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            // Enter when menu is closed: native form-submit. When open with no highlight,
            // also fall through — caller's onKeyDown/Enter handler still fires.
            if (e.key === 'Enter' && open && highlightedIndex >= 0) {
                e.preventDefault();
                handleSelect(highlightedIndex);
                return;
            }
            if (navKeyDown(e)) {
                e.preventDefault();
            }
        };

        /* ---- Render ---- */

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
                    htmlFor={inputId}
                    className={[styles.label, required && styles.labelRequired]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {label}
                </label>
                <Popover.Root open={open} onOpenChange={setOpen}>
                    <Popover.Anchor asChild>
                        <div
                            className={[
                                styles.control,
                                error && styles.controlError,
                                disabled && styles.controlDisabled,
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            <input
                                {...rest}
                                ref={inputRef}
                                id={inputId}
                                type="text"
                                role="combobox"
                                aria-autocomplete="both"
                                aria-expanded={open}
                                aria-controls={listboxId}
                                aria-activedescendant={activeOptionId}
                                aria-describedby={messageId}
                                aria-invalid={error ? true : undefined}
                                aria-required={required || undefined}
                                value={currentValue}
                                placeholder={placeholder}
                                disabled={disabled}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={onBlur}
                                onKeyDown={handleKeyDown}
                                className={[styles.input, className].filter(Boolean).join(' ')}
                                autoComplete="off"
                            />
                        </div>
                    </Popover.Anchor>
                    <Popover.Portal>
                        <Popover.Content
                            align="start"
                            sideOffset={4}
                            className="edmenu"
                            onOpenAutoFocus={(e) => {
                                // Keep focus on the input — never on the menu.
                                e.preventDefault();
                            }}
                        >
                            {visibleOptions.length === 0 && !allowCreateNow ? (
                                <div className="edmenu__empty">
                                    {loading ? (
                                        <span className="edmenu__loading">
                                            <Loader2 size={14} className={styles.spinner} aria-hidden />
                                            Loading…
                                        </span>
                                    ) : (
                                        <span>No suggestions for "{currentValue}"</span>
                                    )}
                                </div>
                            ) : (
                                <ul
                                    ref={listboxRef}
                                    id={listboxId}
                                    role="listbox"
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
                                        const opt = row.option;
                                        const i = row.index;
                                        const isHighlighted = highlightedIndex === i;
                                        return (
                                            <li
                                                key={`${opt.value}-${i}`}
                                                id={getOptionId(i)}
                                                role="option"
                                                aria-selected={isHighlighted}
                                                aria-disabled={opt.disabled || undefined}
                                                className={[
                                                    'edmenu__option',
                                                    isHighlighted && 'edmenu__option--highlighted',
                                                ]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                                onMouseEnter={() => setHighlightedIndex(i)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleSelect(i)}
                                            >
                                                <span className={styles.optionContent}>
                                                    <span className={styles.optionPrimary}>
                                                        {highlightSegments(opt.label, currentValue)}
                                                    </span>
                                                    {opt.secondary && (
                                                        <span className={styles.optionSecondary}>
                                                            {opt.secondary}
                                                        </span>
                                                    )}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                            {allowCreateNow && (
                                <div
                                    id={getOptionId(CREATE_INDEX)}
                                    role="option"
                                    aria-selected={highlightedIndex === CREATE_INDEX}
                                    className={[
                                        'edmenu__action-row',
                                        highlightedIndex === CREATE_INDEX && 'edmenu__option--highlighted',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onMouseEnter={() => setHighlightedIndex(CREATE_INDEX)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleSelect(CREATE_INDEX)}
                                >
                                    <Plus size={14} strokeWidth={1.8} aria-hidden />
                                    <span>
                                        {createLabel
                                            ? createLabel(currentValue)
                                            : <>Create &ldquo;{currentValue}&rdquo;</>}
                                    </span>
                                </div>
                            )}
                            {/* Live region */}
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
                                    ? 'Loading suggestions'
                                    : visibleOptions.length > 0
                                    ? `${visibleOptions.length} suggestion${
                                          visibleOptions.length === 1 ? '' : 's'
                                      }, use arrows to browse`
                                    : ''}
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
