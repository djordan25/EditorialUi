import {
    forwardRef,
    useId,
    type InputHTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdTextField.module.scss';

export type EdTextFieldSize = 'sm' | 'md' | 'lg';

export interface EdTextFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
    /** Visible label. Always rendered. Pass `visuallyHidden` to keep it accessible-only. */
    label: ReactNode;
    /** Hint text under the control. Mutually exclusive with `error`. */
    hint?: ReactNode;
    /** Error message — sets aria-invalid and replaces the hint. */
    error?: ReactNode;
    /** Required indicator: renders the `*` on the label and sets aria-required. */
    required?: boolean;
    /** Hide the label visually but keep it announced. */
    visuallyHidden?: boolean;
    /** Monospaced input — IDs, paths, codes. */
    mono?: boolean;
    /** Adornment slotted before the input. Decorative — does not steal clicks from the input. */
    prefix?: ReactNode;
    /** Adornment slotted after the input. Pass a `<button>` for clear / action affordances. */
    suffix?: ReactNode;
    size?: EdTextFieldSize;
    /** Stretch the wrapper to fill its parent. */
    fullWidth?: boolean;
    /** className on the outer field wrapper (the `<div>` containing label + control + hint). */
    wrapperClassName?: string;
}

const sizeClass: Record<EdTextFieldSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

/**
 * EdTextField — single-line text input bundled with its label and hint/error slots.
 * Internally manages the `id` / `htmlFor` / `aria-describedby` wiring so callers don't
 * have to. For arbitrary (non-input) controls use `EdFormControlLabel`.
 *
 *   <EdTextField label="Email" type="email" required />
 *   <EdTextField label="Model ID" mono value={id} readOnly />
 *   <EdTextField label="Search" visuallyHidden prefix={<EdIcon name="Search" />} />
 */
export const EdTextField = forwardRef<HTMLInputElement, EdTextFieldProps>(function EdTextField(
    {
        label,
        hint,
        error,
        required = false,
        visuallyHidden = false,
        mono = false,
        prefix,
        suffix,
        size = 'md',
        fullWidth = false,
        wrapperClassName,
        id,
        className,
        disabled,
        readOnly,
        ...rest
    },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? `ed-tf-${autoId}`;
    const messageId = error || hint ? `${inputId}-msg` : undefined;

    const controlClasses = [
        styles.control,
        sizeClass[size],
        error && styles.controlError,
        disabled && styles.controlDisabled,
        readOnly && !disabled && styles.controlReadonly,
    ]
        .filter(Boolean)
        .join(' ');

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
                className={[
                    styles.label,
                    required && styles.labelRequired,
                    visuallyHidden && styles.visuallyHidden,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {label}
            </label>
            <div className={controlClasses}>
                {prefix && (
                    <span
                        className={`${styles.adornment} ${styles.adornmentPrefix}`}
                        aria-hidden="true"
                    >
                        {prefix}
                    </span>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={[
                        styles.input,
                        mono && styles.inputMono,
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    disabled={disabled}
                    readOnly={readOnly}
                    aria-invalid={error ? true : undefined}
                    aria-required={required || undefined}
                    aria-describedby={messageId}
                    {...rest}
                />
                {suffix && (
                    <span className={`${styles.adornment} ${styles.adornmentSuffix}`}>
                        {suffix}
                    </span>
                )}
            </div>
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
});
