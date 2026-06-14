import {
    forwardRef,
    useId,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import styles from './EdCheckbox.module.scss';

type RadixCheckboxProps = ComponentPropsWithoutRef<typeof RadixCheckbox.Root>;

export interface EdCheckboxProps
    extends Omit<RadixCheckboxProps, 'asChild' | 'children'> {
    /** Visible label. Sentence case. Pass empty string + aria-label only when wrapping in a table row. */
    label?: ReactNode;
    /** Optional secondary line below the label. */
    description?: ReactNode;
    /** Hint or error text under the row (error replaces hint when both are present). */
    hint?: ReactNode;
    error?: ReactNode;
    /** Sets `checked='indeterminate'` and aria-checked='mixed'. */
    indeterminate?: boolean;
    /** className on the outer wrapper. */
    wrapperClassName?: string;
}

/**
 * EdCheckbox — multi-select / consent / table-row toggle.
 * Wraps Radix Checkbox so keyboard, focus, and ARIA come for free.
 *
 *   <EdCheckbox label="Include superseded" />
 *   <EdCheckbox label="Select all" indeterminate checked={someChecked} />
 *   <EdCheckbox label="I accept the terms" required error="Required to continue." />
 */
export const EdCheckbox = forwardRef<
    ElementRef<typeof RadixCheckbox.Root>,
    EdCheckboxProps
>(function EdCheckbox(
    {
        label,
        description,
        hint,
        error,
        indeterminate,
        wrapperClassName,
        className,
        id,
        checked,
        disabled,
        required,
        ...rest
    },
    ref,
) {
    const autoId = useId();
    const inputId = id ?? `ed-cb-${autoId}`;
    const messageId = error || hint ? `${inputId}-msg` : undefined;
    const descriptionId = description ? `${inputId}-desc` : undefined;

    const resolvedChecked: RadixCheckboxProps['checked'] = indeterminate
        ? 'indeterminate'
        : checked;

    const describedBy = [descriptionId, messageId].filter(Boolean).join(' ') || undefined;

    return (
        <div
            className={[styles.root, wrapperClassName].filter(Boolean).join(' ')}
        >
            <label
                htmlFor={inputId}
                className={[styles.row, disabled && styles.rowDisabled].filter(Boolean).join(' ')}
            >
                <RadixCheckbox.Root
                    {...rest}
                    ref={ref}
                    id={inputId}
                    checked={resolvedChecked}
                    disabled={disabled}
                    required={required}
                    aria-describedby={describedBy}
                    aria-invalid={error ? true : undefined}
                    className={[
                        styles.box,
                        error && styles.boxError,
                        className,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    <RadixCheckbox.Indicator className={styles.indicator}>
                        {indeterminate || resolvedChecked === 'indeterminate' ? (
                            <Minus
                                className={styles.indicatorIcon}
                                aria-hidden
                                strokeWidth={3}
                            />
                        ) : (
                            <Check
                                className={styles.indicatorIcon}
                                aria-hidden
                                strokeWidth={3}
                            />
                        )}
                    </RadixCheckbox.Indicator>
                </RadixCheckbox.Root>
                {(label || description) && (
                    <span className={styles.text}>
                        {label && <span className={styles.label}>{label}</span>}
                        {description && (
                            <span id={descriptionId} className={styles.description}>
                                {description}
                            </span>
                        )}
                    </span>
                )}
            </label>
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
