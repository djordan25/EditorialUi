import {
    forwardRef,
    useId,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import styles from './EdSwitch.module.scss';

type RadixSwitchProps = ComponentPropsWithoutRef<typeof RadixSwitch.Root>;

export interface EdSwitchProps
    extends Omit<RadixSwitchProps, 'asChild' | 'children'> {
    /** Visible label paired with the switch. */
    label?: ReactNode;
    /** Optional description rendered below the label. Used in settings rows. */
    description?: ReactNode;
    /**
     * Renders a "saving…" indicator next to the label and dims the track.
     * Use during optimistic-update round-trips.
     */
    loading?: boolean;
    /** Loading label override. Defaults to "saving…". */
    loadingLabel?: ReactNode;
    /**
     * Layout. `inline` (default) — switch trailing label inline, gap 8px.
     * `row` — label/description on the left, switch flush right (settings rows).
     */
    layout?: 'inline' | 'row';
    /** className on the outer wrapper. */
    wrapperClassName?: string;
}

/**
 * EdSwitch — boolean toggle for settings that take effect immediately.
 * Reads as state-of-the-world: on/off — never as a selection.
 * For multi-select inside a form, use EdCheckbox.
 *
 *   <EdSwitch label="Notifications" checked={on} onCheckedChange={setOn} />
 *   <EdSwitch layout="row" label="Email on completion"
 *             description="For graphs you own or co-own." />
 */
export const EdSwitch = forwardRef<
    ElementRef<typeof RadixSwitch.Root>,
    EdSwitchProps
>(function EdSwitch(
    {
        label,
        description,
        loading = false,
        loadingLabel = 'saving…',
        layout = 'inline',
        wrapperClassName,
        className,
        id,
        disabled,
        ...rest
    },
    ref,
) {
    const autoId = useId();
    const switchId = id ?? `ed-sw-${autoId}`;
    const descriptionId = description ? `${switchId}-desc` : undefined;

    return (
        <label
            htmlFor={switchId}
            className={[
                styles.root,
                layout === 'row' ? styles.layoutRow : styles.layoutInline,
                disabled && styles.rootDisabled,
                wrapperClassName,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {(label || description) && (
                <span className={styles.text}>
                    {label && (
                        <span className={styles.label}>
                            {label}
                            {loading && (
                                <span className={styles.loadingTag} aria-live="polite">
                                    {loadingLabel}
                                </span>
                            )}
                        </span>
                    )}
                    {description && (
                        <span id={descriptionId} className={styles.description}>
                            {description}
                        </span>
                    )}
                </span>
            )}
            <RadixSwitch.Root
                {...rest}
                ref={ref}
                id={switchId}
                disabled={disabled || loading}
                aria-describedby={descriptionId}
                className={[
                    styles.track,
                    loading && styles.trackLoading,
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
            >
                <RadixSwitch.Thumb className={styles.thumb} />
            </RadixSwitch.Root>
        </label>
    );
});
