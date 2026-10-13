import {
    forwardRef,
    useId,
    useState,
    type ChangeEvent,
    type ClipboardEvent,
    type FocusEvent,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdCodeInput.module.scss';

export type EdCodeInputSize = 'md' | 'lg';

export interface EdCodeInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'maxLength' | 'inputMode' | 'pattern'
    > {
    /** Visible label. Always rendered. Pass `visuallyHidden` to keep it accessible-only. */
    label: ReactNode;
    /** Number of digits. Default 6 (TOTP). */
    length?: number;
    /** Controlled value — digits only. */
    value?: string;
    /** Initial value when uncontrolled. */
    defaultValue?: string;
    /** Called with the sanitised value (digits only, at most `length`) on every change. */
    onChange?: (value: string) => void;
    /** Called once each time the value becomes `length` digits long — e.g. to auto-submit. */
    onComplete?: (value: string) => void;
    /** Hint text under the boxes. Mutually exclusive with `error`. */
    hint?: ReactNode;
    /** Error message — sets aria-invalid, colours every box and replaces the hint. */
    error?: ReactNode;
    /** Hide the label visually but keep it announced. */
    visuallyHidden?: boolean;
    size?: EdCodeInputSize;
    /** className on the outer field wrapper (label + boxes + hint). */
    wrapperClassName?: string;
}

const sizeClass: Record<EdCodeInputSize, string> = {
    md: styles.md,
    lg: styles.lg,
};

const sanitise = (raw: string, length: number) => raw.replace(/\D/g, '').slice(0, length);

/**
 * EdCodeInput — a one-time-code entry drawn as separate boxes (TOTP, email or SMS codes).
 *
 * It is ONE real `<input>` laid over the boxes, not one input per box. That is the point:
 * phone and browser autofill (`autocomplete="one-time-code"`), password managers and
 * screen readers all see a single field with a single label; paste and Backspace work
 * natively; and the value is one string. The boxes are presentation only.
 *
 *   <EdCodeInput label="Authentication code" value={code} onChange={setCode} onComplete={submit} />
 *   <EdCodeInput label="Code" size="lg" error="That code didn't match." />
 */
export const EdCodeInput = forwardRef<HTMLInputElement, EdCodeInputProps>(function EdCodeInput(
    {
        label,
        length = 6,
        value,
        defaultValue,
        onChange,
        onComplete,
        hint,
        error,
        visuallyHidden = false,
        size = 'md',
        wrapperClassName,
        id,
        className,
        disabled,
        onFocus,
        onBlur,
        onPaste,
        'aria-describedby': describedByProp,
        ...rest
    },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? `ed-code-${autoId}`;
    const messageId = error || hint ? `${inputId}-msg` : undefined;
    // The caller's own description joins the hint/error rather than replacing it.
    const describedBy = [messageId, describedByProp].filter(Boolean).join(' ') || undefined;

    const isControlled = value !== undefined;
    const [inner, setInner] = useState(() => sanitise(defaultValue ?? '', length));
    const current = sanitise(isControlled ? value : inner, length);
    const [focused, setFocused] = useState(false);

    const commit = (next: string) => {
        if (!isControlled) setInner(next);
        onChange?.(next);
        if (next.length === length && current.length !== length) onComplete?.(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        commit(sanitise(event.target.value, length));
    };

    // A whole code pasted into a part-filled field replaces it rather than being appended
    // and cut off. Shorter pastes fall through to the native insert.
    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(event);
        if (event.defaultPrevented) return;
        const pasted = sanitise(event.clipboardData.getData('text'), length);
        if (pasted.length === length) {
            event.preventDefault();
            commit(pasted);
        }
    };

    // Typing always appends: keep the caret at the end so a click on the first box
    // cannot leave it mid-string, where the boxes would no longer show where input goes.
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        const el = event.currentTarget;
        const end = el.value.length;
        el.setSelectionRange(end, end);
        onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        onBlur?.(event);
    };

    const activeIndex = Math.min(current.length, length - 1);

    return (
        <div className={[styles.root, wrapperClassName].filter(Boolean).join(' ')}>
            <label
                htmlFor={inputId}
                className={[styles.label, visuallyHidden && styles.visuallyHidden].filter(Boolean).join(' ')}
            >
                {label}
            </label>
            <div
                className={[
                    styles.boxes,
                    sizeClass[size],
                    error && styles.boxesError,
                    disabled && styles.boxesDisabled,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {Array.from({ length }, (_, i) => (
                    <span
                        key={i}
                        className={styles.box}
                        data-filled={i < current.length || undefined}
                        data-active={(focused && !disabled && i === activeIndex) || undefined}
                        aria-hidden="true"
                    >
                        {current[i] ?? ''}
                    </span>
                ))}
                <input
                    ref={ref}
                    id={inputId}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    spellCheck={false}
                    value={current}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={[styles.input, className].filter(Boolean).join(' ')}
                    {...rest}
                />
            </div>
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
});
