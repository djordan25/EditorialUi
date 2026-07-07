import {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type KeyboardEvent,
    type ReactElement,
    type ReactNode,
    type Ref,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import {
    filterByLabel,
    highlightMatch,
    useListboxNav,
    useScrollHighlightedIntoView,
} from '../_internal/listbox';
import sharedStyles from '../_internal/menu.module.scss';
import styles from './EdInlineSelect.module.scss';

// Ensures the global :global() classes in the shared stylesheet are bundled with this component.
void sharedStyles;

export interface EdInlineSelectOption<TValue = string> {
    /** The identity value carried by this option. */
    value: TValue;
    /** The text label — shown in the field and matched against the query. */
    label: string;
    /** Optional one-line secondary text (mono, smaller) — IDs, emails, statuses. */
    secondary?: ReactNode;
    disabled?: boolean;
}

export interface EdInlineSelectRenderState {
    /** The current typed query (empty when the field just gained focus). */
    query: string;
    highlighted: boolean;
    selected: boolean;
}

export interface EdInlineSelectProps<TValue = string> {
    label: ReactNode;
    options: EdInlineSelectOption<TValue>[];
    /** The selected option, or null. Controlled. */
    value: EdInlineSelectOption<TValue> | null;
    /** Fires with the picked option, or null when the field is cleared. */
    onChange: (option: EdInlineSelectOption<TValue> | null) => void;
    /** Identity/key for an option. Defaults to `String(option.value)`. */
    getOptionValue?: (option: EdInlineSelectOption<TValue>) => string;
    /** Custom option row. Receives the live query + highlight/selected state. */
    renderOption?: (
        option: EdInlineSelectOption<TValue>,
        state: EdInlineSelectRenderState,
    ) => ReactNode;

    /** Controlled input text — lift the typed query (e.g. to drive an external title). */
    inputValue?: string;
    onInputChange?: (text: string) => void;

    /** Minimum query length before options show. Default 0 (full list on focus). */
    minQueryLength?: number;
    /** Text when zero options match. Receives the current query. */
    emptyText?: (query: string) => ReactNode;

    placeholder?: string;
    hint?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    /** `sm` is a compact ~30px shell for inline cell editing. */
    size?: 'sm' | 'md';
    id?: string;
    wrapperClassName?: string;
}

/**
 * EdInlineSelect — an inline, list-CONSTRAINED, object-value type-ahead.
 *
 * Unlike EdComboBox (a button-trigger popover) and EdAutocomplete (free text),
 * this renders a single-line input whose committed value is always one of the
 * options — or null. It carries a generic object `value`, supports a custom
 * `renderOption`, and shows the full list at 0 chars (minQueryLength default 0).
 *
 *   <EdInlineSelect
 *     label="Owner"
 *     options={users}
 *     value={owner}
 *     onChange={setOwner}
 *     getOptionValue={(u) => u.value.id}
 *     renderOption={(u) => <UserRow user={u.value} />}
 *   />
 */
function EdInlineSelectInner<TValue>(props: EdInlineSelectProps<TValue>, ref: Ref<HTMLInputElement>) {
    const {
        label,
        options,
        value,
        onChange,
        getOptionValue,
        renderOption,
        inputValue,
        onInputChange,
        minQueryLength = 0,
        emptyText,
        placeholder,
        hint,
        error,
        required,
        disabled,
        fullWidth = false,
        size = 'md',
        id,
        wrapperClassName,
    } = props;

    const getVal = useCallback(
        (o: EdInlineSelectOption<TValue>) => (getOptionValue ? getOptionValue(o) : String(o.value)),
        [getOptionValue],
    );

    const autoId = useId();
    const idPrefix = `ed-inline-${autoId}`;
    const inputId = id ?? `${idPrefix}-input`;
    const listboxId = `${idPrefix}-listbox`;
    const messageId = error || hint ? `${idPrefix}-msg` : undefined;

    const selectedKey = value ? getVal(value) : null;
    const selectedLabel = value ? value.label : '';

    const [internalText, setInternalText] = useState(selectedLabel);
    const text = inputValue !== undefined ? inputValue : internalText;
    const [open, setOpen] = useState(false);
    const [dirty, setDirty] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);
    const listboxRef = useRef<HTMLUListElement | null>(null);
    const controlRef = useRef<HTMLDivElement | null>(null);

    const setText = useCallback(
        (next: string) => {
            if (inputValue === undefined) setInternalText(next);
            onInputChange?.(next);
        },
        [inputValue, onInputChange],
    );

    // Snap the field back to the committed selection whenever idle (menu closed):
    // preserves typing while open, reverts uncommitted text / syncs external changes on close.
    useEffect(() => {
        if (!open && inputValue === undefined) setInternalText(selectedLabel);
    }, [open, inputValue, selectedLabel]);

    // Only filter by the typed text once the user has typed since focus; a freshly
    // focused field shows the full list (subject to minQueryLength).
    const query = dirty ? text : '';
    const visibleOptions = useMemo(
        () => (query.length < minQueryLength ? [] : filterByLabel(options, query)),
        [minQueryLength, options, query],
    );

    const commit = useCallback(
        (index: number) => {
            const opt = visibleOptions[index];
            if (!opt || opt.disabled) return;
            onChange(opt);
            setText(opt.label);
            setDirty(false);
            setOpen(false);
        },
        [onChange, setText, visibleOptions],
    );

    const isOptionDisabled = useCallback(
        (i: number) => !!visibleOptions[i]?.disabled,
        [visibleOptions],
    );

    const { highlightedIndex, setHighlightedIndex, onKeyDown: navKeyDown, activeOptionId, getOptionId } =
        useListboxNav({
            optionCount: visibleOptions.length,
            open,
            onOpen: () => setOpen(true),
            onSelect: commit,
            onDismiss: () => {
                setDirty(false);
                setOpen(false);
            },
            idPrefix,
            isDisabled: isOptionDisabled,
        });

    useScrollHighlightedIntoView(listboxRef, activeOptionId);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        setDirty(true);
        if (!open) setOpen(true);
    };

    const handleFocus = () => {
        setDirty(false);
        setOpen(true);
        // Select-all so the first keystroke replaces the committed label.
        inputRef.current?.select();
    };

    const handleBlur = () => {
        const cleared = dirty && text.trim() === '';
        setDirty(false);
        setOpen(false);
        if (cleared) {
            if (value !== null) onChange(null);
            setText('');
        } else {
            // Constrained: uncommitted text reverts to the current selection.
            setText(selectedLabel);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (navKeyDown(e)) e.preventDefault();
    };

    const defaultRenderOption = (
        opt: EdInlineSelectOption<TValue>,
        state: EdInlineSelectRenderState,
    ): ReactNode => (
        <span className={styles.optionContent}>
            <span className={styles.optionPrimary}>{highlightSegments(opt.label, state.query)}</span>
            {opt.secondary && <span className={styles.optionSecondary}>{opt.secondary}</span>}
        </span>
    );

    return (
        <div
            className={[styles.root, fullWidth && styles.fullWidth, wrapperClassName]
                .filter(Boolean)
                .join(' ')}
        >
            <label
                htmlFor={inputId}
                className={[styles.label, required && styles.labelRequired].filter(Boolean).join(' ')}
            >
                {label}
            </label>
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Anchor asChild>
                    <div
                        ref={controlRef}
                        className={[
                            styles.control,
                            size === 'sm' && styles.controlSm,
                            error && styles.controlError,
                            disabled && styles.controlDisabled,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    >
                        <input
                            ref={inputRef}
                            id={inputId}
                            type="text"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={open}
                            aria-controls={listboxId}
                            aria-activedescendant={activeOptionId}
                            aria-describedby={messageId}
                            aria-invalid={error ? true : undefined}
                            aria-required={required || undefined}
                            value={text}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete="off"
                            className={[styles.input, size === 'sm' && styles.inputSm]
                                .filter(Boolean)
                                .join(' ')}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </Popover.Anchor>
                <Popover.Portal>
                    <Popover.Content
                        align="start"
                        sideOffset={4}
                        className="edmenu"
                        onOpenAutoFocus={(e) => {
                            // Keep focus on the input — never move it to the menu.
                            e.preventDefault();
                        }}
                        onInteractOutside={(e) => {
                            // The input is the ANCHOR (not a trigger), so interacting with it
                            // reads as "outside" and would dismiss the just-opened popover.
                            const t = e.detail.originalEvent.target as Node | null;
                            if (t && controlRef.current?.contains(t)) e.preventDefault();
                        }}
                    >
                        {visibleOptions.length === 0 ? (
                            <div className="edmenu__empty">
                                {emptyText ? emptyText(query) : `No results${query ? ` for "${query}"` : ''}`}
                            </div>
                        ) : (
                            <ul
                                ref={listboxRef}
                                id={listboxId}
                                role="listbox"
                                aria-label={typeof label === 'string' ? label : undefined}
                                className="edmenu__listbox"
                            >
                                {visibleOptions.map((opt, i) => {
                                    const selected = selectedKey !== null && getVal(opt) === selectedKey;
                                    const highlighted = highlightedIndex === i;
                                    return (
                                        <li
                                            key={getVal(opt)}
                                            id={getOptionId(i)}
                                            role="option"
                                            aria-selected={selected}
                                            aria-disabled={opt.disabled || undefined}
                                            className={[
                                                'edmenu__option',
                                                highlighted && 'edmenu__option--highlighted',
                                                selected && 'edmenu__option--selected',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                            onMouseEnter={() => setHighlightedIndex(i)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => commit(i)}
                                        >
                                            {(renderOption ?? defaultRenderOption)(opt, {
                                                query,
                                                highlighted,
                                                selected,
                                            })}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
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
                            {`${visibleOptions.length} result${visibleOptions.length === 1 ? '' : 's'}`}
                        </span>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            {(error || hint) && (
                <p
                    id={messageId}
                    className={[styles.hint, error && styles.hintError].filter(Boolean).join(' ')}
                    role={error ? 'alert' : undefined}
                    aria-live={error ? 'polite' : undefined}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
}

/** Generic forwardRef wrapper — preserves the TValue type parameter. */
export const EdInlineSelect = forwardRef(EdInlineSelectInner) as <TValue = string>(
    props: EdInlineSelectProps<TValue> & { ref?: Ref<HTMLInputElement> },
) => ReactElement;

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
