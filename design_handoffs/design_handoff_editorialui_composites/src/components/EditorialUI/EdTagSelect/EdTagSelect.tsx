import {
    forwardRef,
    useId,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Check, X } from 'lucide-react';
import styles from './EdTagSelect.module.scss';

export interface EdTagOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface EdTagSelectProps {
    label?: ReactNode;
    /** Known options to pick from. */
    options: EdTagOption[];
    /** Controlled selected values. */
    values?: string[];
    defaultValues?: string[];
    onValuesChange?: (values: string[]) => void;

    placeholder?: string;
    hint?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;

    /**
     * Allow committing free-text values not in `options` (Enter on a novel query).
     * Lock to known values for production-critical lists.
     */
    allowCreate?: boolean;
    /** className on the wrapper. */
    wrapperClassName?: string;
}

/**
 * EdTagSelect — multi-select input that renders selected values as removable
 * tags, with a combobox dropdown. The classic "add to multiple categories" input.
 * For a compact dropdown trigger instead of inline tags use EdComboBox (multi).
 *
 *   <EdTagSelect
 *     label="Regulatory scope"
 *     options={regulations}
 *     values={picked}
 *     onValuesChange={setPicked}
 *     hint="Type to search regulations, press Enter to add."
 *   />
 */
export const EdTagSelect = forwardRef<HTMLInputElement, EdTagSelectProps>(function EdTagSelect(
    {
        label,
        options,
        values,
        defaultValues = [],
        onValuesChange,
        placeholder = 'Add…',
        hint,
        error,
        required,
        disabled,
        fullWidth = false,
        allowCreate = false,
        wrapperClassName,
    },
    ref,
) {
    const autoId = useId();
    const inputId = `ed-tagselect-${autoId}`;
    const listboxId = `${inputId}-listbox`;
    const messageId = error || hint ? `${inputId}-msg` : undefined;

    const [internal, setInternal] = useState<string[]>(defaultValues);
    const selected = values !== undefined ? values : internal;
    const selectedSet = useMemo(() => new Set(selected), [selected]);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlight, setHighlight] = useState(0);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setValues = (next: string[]) => {
        if (values === undefined) setInternal(next);
        onValuesChange?.(next);
    };

    const labelFor = (val: string) => options.find((o) => o.value === val)?.label ?? val;

    /* Filter the menu: unselected options matching the query. */
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return options.filter(
            (o) => !selectedSet.has(o.value) && (!q || o.label.toLowerCase().includes(q)),
        );
    }, [options, selectedSet, query]);

    const exactExists = useMemo(
        () => options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase()),
        [options, query],
    );
    const showCreate = allowCreate && query.trim().length > 0 && !exactExists;
    const createIndex = filtered.length; // create row sits after filtered options

    const add = (val: string) => {
        if (!selectedSet.has(val)) setValues([...selected, val]);
        setQuery('');
        setHighlight(0);
        inputRef.current?.focus();
    };
    const remove = (val: string) => {
        setValues(selected.filter((v) => v !== val));
        inputRef.current?.focus();
    };

    const navigableCount = filtered.length + (showCreate ? 1 : 0);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && query === '' && selected.length > 0) {
            remove(selected[selected.length - 1]);
            return;
        }
        if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            setOpen(true);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, navigableCount - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (showCreate && highlight === createIndex) {
                add(query.trim());
            } else if (filtered[highlight]) {
                add(filtered[highlight].value);
            } else if (showCreate) {
                add(query.trim());
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    return (
        <div
            className={[styles.root, fullWidth && styles.fullWidth, wrapperClassName].filter(Boolean).join(' ')}
        >
            {label && (
                <label htmlFor={inputId} className={[styles.label, required && styles.labelRequired].filter(Boolean).join(' ')}>
                    {label}
                </label>
            )}
            <Popover.Root open={open && !disabled} onOpenChange={setOpen}>
                <Popover.Anchor asChild>
                    <div
                        className={[
                            styles.field,
                            error && styles.fieldError,
                            disabled && styles.fieldDisabled,
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() => !disabled && inputRef.current?.focus()}
                    >
                        {selected.map((val) => (
                            <span key={val} className={styles.tag}>
                                {labelFor(val)}
                                {!disabled && (
                                    <button
                                        type="button"
                                        className={styles.tagRemove}
                                        aria-label={`Remove ${labelFor(val)}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            remove(val);
                                        }}
                                    >
                                        <X size={11} strokeWidth={2.5} aria-hidden />
                                    </button>
                                )}
                            </span>
                        ))}
                        <input
                            ref={(node) => {
                                inputRef.current = node;
                                if (typeof ref === 'function') ref(node);
                                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                            }}
                            id={inputId}
                            type="text"
                            role="combobox"
                            aria-expanded={open}
                            aria-controls={listboxId}
                            aria-autocomplete="list"
                            aria-describedby={messageId}
                            aria-invalid={error ? true : undefined}
                            aria-required={required || undefined}
                            className={styles.input}
                            placeholder={selected.length === 0 ? placeholder : ''}
                            value={query}
                            disabled={disabled}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpen(true);
                                setHighlight(0);
                            }}
                            onFocus={() => setOpen(true)}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                        />
                    </div>
                </Popover.Anchor>
                <Popover.Portal>
                    <Popover.Content
                        align="start"
                        sideOffset={4}
                        className={styles.menu}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        {filtered.length === 0 && !showCreate ? (
                            <div className={styles.empty}>
                                {query ? `No matches for "${query}"` : 'All options selected'}
                            </div>
                        ) : (
                            <ul id={listboxId} role="listbox" aria-multiselectable="true" className={styles.list}>
                                {filtered.map((opt, i) => (
                                    <li
                                        key={opt.value}
                                        role="option"
                                        aria-selected={false}
                                        className={[styles.option, highlight === i && styles.optionHighlighted]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onMouseEnter={() => setHighlight(i)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => add(opt.value)}
                                    >
                                        <span className={styles.optionCheck}>
                                            <Check size={12} strokeWidth={2.5} aria-hidden style={{ visibility: 'hidden' }} />
                                        </span>
                                        {opt.label}
                                    </li>
                                ))}
                                {showCreate && (
                                    <li
                                        role="option"
                                        aria-selected={false}
                                        className={[styles.option, styles.createOption, highlight === createIndex && styles.optionHighlighted]
                                            .filter(Boolean)
                                            .join(' ')}
                                        onMouseEnter={() => setHighlight(createIndex)}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => add(query.trim())}
                                    >
                                        Create &ldquo;{query.trim()}&rdquo;
                                    </li>
                                )}
                            </ul>
                        )}
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
            {(error || hint) && (
                <p
                    id={messageId}
                    className={[styles.hint, error && styles.hintError].filter(Boolean).join(' ')}
                    role={error ? 'alert' : undefined}
                >
                    {error || hint}
                </p>
            )}
        </div>
    );
});
