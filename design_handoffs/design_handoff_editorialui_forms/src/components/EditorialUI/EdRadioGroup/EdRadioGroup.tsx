import {
    forwardRef,
    useId,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styles from './EdRadioGroup.module.scss';

export type EdRadioGroupOrientation = 'vertical' | 'horizontal';

type RadixRootProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>;
type RadixItemProps = ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>;

export interface EdRadioGroupProps
    extends Omit<RadixRootProps, 'asChild' | 'orientation' | 'children'> {
    /** Group label, rendered as the legend of an internal fieldset. */
    label?: ReactNode;
    /** Optional description for the group. */
    description?: ReactNode;
    /** Hint or error under the group (error replaces hint). */
    hint?: ReactNode;
    error?: ReactNode;
    /** Lay out radios vertically (default) or in a row. */
    orientation?: EdRadioGroupOrientation;
    /** Visually hide the group label but keep it accessible. */
    labelVisuallyHidden?: boolean;
    /** Radio items — must be EdRadio or EdRadio-shaped. */
    children: ReactNode;
    /** className on the outer wrapper. */
    wrapperClassName?: string;
}

export interface EdRadioProps
    extends Omit<RadixItemProps, 'asChild' | 'children'> {
    /** Item label. Required for accessibility. */
    label: ReactNode;
    /** Optional description rendered below the label. */
    description?: ReactNode;
}

/**
 * EdRadioGroup — mutually-exclusive choice from 2–5 options.
 * For 6+ options, use EdSelect/EdComboBox instead.
 *
 *   <EdRadioGroup label="Cadence" defaultValue="daily">
 *     <EdRadio value="daily"   label="Daily" />
 *     <EdRadio value="weekly"  label="Weekly" />
 *     <EdRadio value="monthly" label="Monthly" />
 *   </EdRadioGroup>
 */
export const EdRadioGroup = forwardRef<
    ElementRef<typeof RadixRadioGroup.Root>,
    EdRadioGroupProps
>(function EdRadioGroup(
    {
        label,
        description,
        hint,
        error,
        orientation = 'vertical',
        labelVisuallyHidden,
        children,
        wrapperClassName,
        className,
        id,
        ...rest
    },
    ref,
) {
    const autoId = useId();
    const groupId = id ?? `ed-rg-${autoId}`;
    const labelId = label ? `${groupId}-label` : undefined;
    const descriptionId = description ? `${groupId}-desc` : undefined;
    const messageId = error || hint ? `${groupId}-msg` : undefined;

    const ariaDescribedBy = [descriptionId, messageId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={[styles.root, wrapperClassName].filter(Boolean).join(' ')}>
            {label && (
                <span
                    id={labelId}
                    className={[styles.label, labelVisuallyHidden && styles.visuallyHidden]
                        .filter(Boolean)
                        .join(' ')}
                >
                    {label}
                </span>
            )}
            {description && (
                <span id={descriptionId} className={styles.description}>
                    {description}
                </span>
            )}
            <RadixRadioGroup.Root
                {...rest}
                ref={ref}
                id={groupId}
                aria-labelledby={labelId}
                aria-describedby={ariaDescribedBy}
                aria-invalid={error ? true : undefined}
                orientation={orientation}
                className={[
                    styles.group,
                    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                {children}
            </RadixRadioGroup.Root>
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

/**
 * EdRadio — a single radio item, used inside <EdRadioGroup>.
 * Wrapping `<label>` makes the label and description clickable.
 */
export const EdRadio = forwardRef<
    ElementRef<typeof RadixRadioGroup.Item>,
    EdRadioProps
>(function EdRadio(
    { label, description, id, disabled, className, value, ...rest },
    ref,
) {
    const autoId = useId();
    const itemId = id ?? `ed-rd-${autoId}`;
    const descriptionId = description ? `${itemId}-desc` : undefined;

    return (
        <label
            htmlFor={itemId}
            className={[styles.item, disabled && styles.itemDisabled]
                .filter(Boolean)
                .join(' ')}
        >
            <RadixRadioGroup.Item
                {...rest}
                ref={ref}
                id={itemId}
                value={value}
                disabled={disabled}
                aria-describedby={descriptionId}
                className={[styles.dot, className].filter(Boolean).join(' ')}
            >
                <RadixRadioGroup.Indicator className={styles.indicator} />
            </RadixRadioGroup.Item>
            <span className={styles.text}>
                <span className={styles.itemLabel}>{label}</span>
                {description && (
                    <span id={descriptionId} className={styles.itemDescription}>
                        {description}
                    </span>
                )}
            </span>
        </label>
    );
});
