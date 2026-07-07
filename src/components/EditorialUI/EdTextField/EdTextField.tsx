import {
    forwardRef,
    useCallback,
    useId,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    type InputHTMLAttributes,
    type ReactNode,
    type RefObject,
    type TextareaHTMLAttributes,
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
    /** Adornment slotted before the input. Decorative. Ignored when `multiline`. */
    prefix?: ReactNode;
    /** Adornment slotted after the input. Ignored when `multiline`. */
    suffix?: ReactNode;
    size?: EdTextFieldSize;
    /** Stretch the wrapper to fill its parent. */
    fullWidth?: boolean;
    /** className on the outer field wrapper (the `<div>` containing label + control + hint). */
    wrapperClassName?: string;

    /** Render a multi-line `<textarea>` instead of a single-line input. */
    multiline?: boolean;
    /** Initial / minimum visible rows in `multiline` mode. Default 3. */
    minRows?: number;
    /** Max rows before the textarea stops auto-growing and scrolls. `multiline` only. */
    maxRows?: number;
}

const sizeClass: Record<EdTextFieldSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

/**
 * EdTextField — text input bundled with its label and hint/error slots.
 * Internally manages the `id` / `htmlFor` / `aria-describedby` wiring so callers don't
 * have to. Pass `multiline` for an auto-growing `<textarea>`. For arbitrary (non-input)
 * controls use `EdFormControlLabel`.
 *
 *   <EdTextField label="Email" type="email" required />
 *   <EdTextField label="Model ID" mono value={id} readOnly />
 *   <EdTextField label="Notes" multiline minRows={3} maxRows={8} />
 */
export const EdTextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, EdTextFieldProps>(
    function EdTextField(
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
            multiline = false,
            minRows = 3,
            maxRows,
            id,
            className,
            disabled,
            readOnly,
            type,
            ...rest
        },
        ref,
    ) {
        const autoId = useId();
        const inputId = id ?? `ed-tf-${autoId}`;
        const messageId = error || hint ? `${inputId}-msg` : undefined;

        const innerRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
        useImperativeHandle(ref, () => innerRef.current as HTMLInputElement | HTMLTextAreaElement, []);

        // Auto-grow the textarea to fit its content, capped at `maxRows`.
        const autoGrow = useCallback(() => {
            const el = innerRef.current;
            if (!(el instanceof HTMLTextAreaElement)) return;
            el.style.height = 'auto';
            const cs = window.getComputedStyle(el);
            const lhRaw = parseFloat(cs.lineHeight);
            const lineHeight = Number.isFinite(lhRaw)
                ? lhRaw
                : (parseFloat(cs.fontSize) || 14) * 1.5;
            const padV = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
            const bordV =
                (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
            const maxH = maxRows ? maxRows * lineHeight + padV + bordV : Number.POSITIVE_INFINITY;
            const contentH = el.scrollHeight;
            // jsdom / pre-layout reports 0 — leave the `rows` attribute to size the box.
            if (contentH > 0) {
                el.style.height = `${Math.min(contentH, maxH)}px`;
                el.style.overflowY = contentH > maxH ? 'auto' : 'hidden';
            } else {
                el.style.height = '';
                el.style.overflowY = '';
            }
        }, [maxRows]);

        // Re-measure after every render (covers controlled value changes) and wire a
        // native `input` listener so uncontrolled typing grows the box too.
        useLayoutEffect(() => {
            if (!multiline) return;
            autoGrow();
            const el = innerRef.current;
            if (!(el instanceof HTMLTextAreaElement)) return;
            el.addEventListener('input', autoGrow);
            return () => el.removeEventListener('input', autoGrow);
        });

        const controlClasses = [
            styles.control,
            sizeClass[size],
            multiline && styles.controlMultiline,
            error && styles.controlError,
            disabled && styles.controlDisabled,
            readOnly && !disabled && styles.controlReadonly,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div
                className={[styles.root, fullWidth && styles.fullWidth, wrapperClassName]
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
                    {!multiline && prefix && (
                        <span
                            className={`${styles.adornment} ${styles.adornmentPrefix}`}
                            aria-hidden="true"
                        >
                            {prefix}
                        </span>
                    )}
                    {multiline ? (
                        <textarea
                            ref={innerRef as RefObject<HTMLTextAreaElement>}
                            id={inputId}
                            rows={minRows}
                            className={[styles.input, styles.textarea, mono && styles.inputMono, className]
                                .filter(Boolean)
                                .join(' ')}
                            disabled={disabled}
                            readOnly={readOnly}
                            aria-invalid={error ? true : undefined}
                            aria-required={required || undefined}
                            aria-describedby={messageId}
                            {...(rest as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                        />
                    ) : (
                        <input
                            ref={innerRef as RefObject<HTMLInputElement>}
                            id={inputId}
                            type={type}
                            className={[styles.input, mono && styles.inputMono, className]
                                .filter(Boolean)
                                .join(' ')}
                            disabled={disabled}
                            readOnly={readOnly}
                            aria-invalid={error ? true : undefined}
                            aria-required={required || undefined}
                            aria-describedby={messageId}
                            {...rest}
                        />
                    )}
                    {!multiline && suffix && (
                        <span className={`${styles.adornment} ${styles.adornmentSuffix}`}>
                            {suffix}
                        </span>
                    )}
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
    },
);
