import {
    forwardRef,
    useId,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import styles from './EdSelect.module.scss';

export type EdSelectSize = 'sm' | 'md' | 'lg';

/** Either a flat option or a group. */
export type EdSelectOption =
    | EdSelectItem
    | EdSelectGroup
    | EdSelectSeparator;

export interface EdSelectItem {
    kind?: 'item';
    /** Unique value emitted via onValueChange. */
    value: string;
    /** Visible label. */
    label: ReactNode;
    /** Optional right-aligned secondary text (e.g. team name, count). */
    meta?: ReactNode;
    disabled?: boolean;
}

export interface EdSelectGroup {
    kind: 'group';
    /** Visible section heading rendered above the items. */
    label: ReactNode;
    items: EdSelectItem[];
}

export interface EdSelectSeparator {
    kind: 'separator';
}

type RadixRootProps = ComponentPropsWithoutRef<typeof RadixSelect.Root>;

export interface EdSelectProps
    extends Omit<RadixRootProps, 'children' | 'onValueChange'> {
    /** Visible label. Always rendered. */
    label: ReactNode;
    /** Options or option groups. */
    options: EdSelectOption[];
    /** Placeholder text when no value selected. */
    placeholder?: string;
    /** Hint text under the trigger. */
    hint?: ReactNode;
    /** Error message — sets aria-invalid and replaces the hint. */
    error?: ReactNode;
    /** Required marker. */
    required?: boolean;
    /** Visually hide the label but keep it accessible. */
    visuallyHidden?: boolean;
    size?: EdSelectSize;
    /** Stretch trigger to fill its parent. */
    fullWidth?: boolean;
    /** Selection change callback. */
    onValueChange?: (value: string) => void;
    /** className on the outer wrapper. */
    wrapperClassName?: string;
    /** className on the trigger button. */
    triggerClassName?: string;
}

const sizeClass: Record<EdSelectSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

const isGroup = (o: EdSelectOption): o is EdSelectGroup => o.kind === 'group';
const isSeparator = (o: EdSelectOption): o is EdSelectSeparator => o.kind === 'separator';

/**
 * EdSelect — compact dropdown for ≤7 fixed, known options. No search.
 * For larger lists, use EdComboBox.
 *
 *   <EdSelect
 *     label="Severity"
 *     options={[
 *       { value: 'low',  label: 'Low' },
 *       { value: 'med',  label: 'Medium' },
 *       { value: 'high', label: 'High' },
 *     ]}
 *     value={severity}
 *     onValueChange={setSeverity}
 *   />
 */
export const EdSelect = forwardRef<
    ElementRef<typeof RadixSelect.Trigger>,
    EdSelectProps
>(function EdSelect(
    {
        label,
        options,
        placeholder = 'Select…',
        hint,
        error,
        required,
        visuallyHidden,
        size = 'md',
        fullWidth = false,
        wrapperClassName,
        triggerClassName,
        disabled,
        name,
        ...rootProps
    },
    ref,
) {
    const autoId = useId();
    const triggerId = `ed-select-${autoId}`;
    const messageId = error || hint ? `${triggerId}-msg` : undefined;

    const renderItem = (item: EdSelectItem) => (
        <RadixSelect.Item
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={styles.item}
        >
            <RadixSelect.ItemIndicator className={styles.itemCheck}>
                <Check size={14} strokeWidth={2.5} aria-hidden />
            </RadixSelect.ItemIndicator>
            <RadixSelect.ItemText>
                <span className={styles.itemLabel}>{item.label}</span>
            </RadixSelect.ItemText>
            {item.meta && (
                <span className={styles.itemMeta} aria-hidden>
                    {item.meta}
                </span>
            )}
        </RadixSelect.Item>
    );

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
            <RadixSelect.Root
                {...rootProps}
                disabled={disabled}
                name={name}
                onValueChange={rootProps.onValueChange}
            >
                <RadixSelect.Trigger
                    ref={ref}
                    id={triggerId}
                    aria-describedby={messageId}
                    aria-invalid={error ? true : undefined}
                    aria-required={required || undefined}
                    className={[
                        styles.trigger,
                        sizeClass[size],
                        error && styles.triggerError,
                        triggerClassName,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                >
                    <RadixSelect.Value placeholder={<span className={styles.placeholder}>{placeholder}</span>} />
                    <RadixSelect.Icon className={styles.chev} aria-hidden>
                        <ChevronDown size={14} strokeWidth={1.8} />
                    </RadixSelect.Icon>
                </RadixSelect.Trigger>
                <RadixSelect.Portal>
                    <RadixSelect.Content
                        position="popper"
                        sideOffset={4}
                        className={styles.content}
                    >
                        <RadixSelect.Viewport className={styles.viewport}>
                            {options.map((opt, i) => {
                                if (isSeparator(opt)) {
                                    return (
                                        <RadixSelect.Separator
                                            key={`sep-${i}`}
                                            className={styles.separator}
                                        />
                                    );
                                }
                                if (isGroup(opt)) {
                                    return (
                                        <RadixSelect.Group key={`grp-${i}`}>
                                            <RadixSelect.Label className={styles.groupLabel}>
                                                {opt.label}
                                            </RadixSelect.Label>
                                            {opt.items.map(renderItem)}
                                        </RadixSelect.Group>
                                    );
                                }
                                return renderItem(opt);
                            })}
                        </RadixSelect.Viewport>
                    </RadixSelect.Content>
                </RadixSelect.Portal>
            </RadixSelect.Root>
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
