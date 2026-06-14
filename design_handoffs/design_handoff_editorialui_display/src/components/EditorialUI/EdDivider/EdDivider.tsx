import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdDivider.module.scss';

export type EdDividerOrientation = 'horizontal' | 'vertical';
export type EdDividerWeight = 'default' | 'strong' | 'dashed';

export interface EdDividerProps extends Omit<HTMLAttributes<HTMLElement>, 'role'> {
    /** Default `horizontal`. */
    orientation?: EdDividerOrientation;
    /** Visual weight. */
    weight?: EdDividerWeight;
    /** Optional centered label. Horizontal only — turns the divider into a labeled rule. */
    label?: ReactNode;
    /**
     * Treat as decorative — render as `<div role="separator" aria-hidden>`.
     * Default false (renders semantic `<hr>` horizontally). Use for vertical inline
     * separators inside a metadata strip where screen readers read content sequentially.
     */
    decorative?: boolean;
}

/**
 * EdDivider — hairline rule for separating sibling regions.
 *
 *   <EdDivider />                                            ← horizontal default
 *   <EdDivider weight="strong" />
 *   <EdDivider weight="dashed" />
 *   <EdDivider orientation="vertical" decorative />
 *   <EdDivider label="2026 — Q1" />                          ← labeled
 *
 * Prefer space and headings; reach for a divider only when neither is sufficient.
 */
export const EdDivider = forwardRef<HTMLElement, EdDividerProps>(function EdDivider(
    {
        orientation = 'horizontal',
        weight = 'default',
        label,
        decorative = false,
        className,
        ...rest
    },
    ref,
) {
    const weightClass =
        weight === 'strong' ? styles.strong : weight === 'dashed' ? styles.dashed : undefined;

    // Labeled variant always renders as a div (semantic <hr> can't have children).
    if (label && orientation === 'horizontal') {
        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                role="separator"
                aria-orientation="horizontal"
                className={[styles.root, styles.horizontal, styles.labeled, weightClass, className]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                <span className={styles.labelText}>{label}</span>
            </div>
        );
    }

    // Vertical → div (no semantic vertical hr).
    if (orientation === 'vertical') {
        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                role={decorative ? undefined : 'separator'}
                aria-orientation="vertical"
                aria-hidden={decorative || undefined}
                className={[styles.root, styles.vertical, weightClass, className]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            />
        );
    }

    // Horizontal default — decorative renders as a div, semantic as <hr>.
    if (decorative) {
        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                role="separator"
                aria-orientation="horizontal"
                aria-hidden
                className={[styles.root, styles.horizontal, weightClass, className]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            />
        );
    }

    return (
        <hr
            ref={ref as React.Ref<HTMLHRElement>}
            className={[styles.root, styles.horizontal, weightClass, className]
                .filter(Boolean)
                .join(' ')}
            {...(rest as HTMLAttributes<HTMLHRElement>)}
        />
    );
});
