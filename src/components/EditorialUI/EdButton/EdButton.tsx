import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './EdButton.module.scss';

export type EdButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type EdButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface EdButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: EdButtonVariant;
    size?: EdButtonSize;
    /** Render the spinner overlay; preserves width and disables interaction. */
    loading?: boolean;
    /** Icon before the label. */
    leadingIcon?: ReactNode;
    /** Icon after the label. */
    trailingIcon?: ReactNode;
    /** Render as the child component (Radix Slot). For wrapping <a> as a styled button etc. */
    asChild?: boolean;
    /** Stretch to fill the parent. */
    fullWidth?: boolean;
}

const variantClass: Record<EdButtonVariant, string> = {
    primary: styles.primary,
    secondary: styles.secondary,
    ghost: styles.ghost,
    danger: styles.danger,
    link: styles.link,
};

const sizeClass: Record<EdButtonSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
    xl: styles.xl,
};

/**
 * EdButton — primary action target.
 * Six variants for six intents; the variant is a semantic choice, not styling.
 *
 *   <EdButton variant="primary">Save changes</EdButton>
 *   <EdButton variant="danger" leadingIcon={<EdIcon name="Trash2" />}>Delete</EdButton>
 *   <EdButton asChild><a href="...">Linked styled button</a></EdButton>
 */
export const EdButton = forwardRef<HTMLButtonElement, EdButtonProps>(function EdButton(
    {
        variant = 'primary',
        size = 'md',
        loading = false,
        leadingIcon,
        trailingIcon,
        asChild = false,
        fullWidth = false,
        disabled,
        className,
        type,
        children,
        ...rest
    },
    ref,
) {
    const Comp = asChild ? Slot : 'button';

    const classes = [
        styles.root,
        variantClass[variant],
        sizeClass[size],
        loading && styles.loading,
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Comp
            ref={ref as never}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            aria-disabled={disabled || loading || undefined}
            // Non-asChild only — Slot forwards button-less elements like <a>
            {...(asChild ? {} : { type: type ?? 'button' })}
            {...rest}
        >
            {asChild ? (
                children
            ) : (
                <>
                    {leadingIcon && <span className={styles.icon} aria-hidden="true">{leadingIcon}</span>}
                    <span className={styles.label}>{children}</span>
                    {trailingIcon && <span className={styles.icon} aria-hidden="true">{trailingIcon}</span>}
                </>
            )}
        </Comp>
    );
});
