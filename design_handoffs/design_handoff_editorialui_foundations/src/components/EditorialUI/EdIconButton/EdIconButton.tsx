import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import styles from './EdIconButton.module.scss';

export type EdIconButtonVariant = 'default' | 'bordered' | 'filled';
export type EdIconButtonSize = 'sm' | 'md' | 'lg';

export interface EdIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** REQUIRED — describes the action for assistive tech. */
    'aria-label': string;
    /** The icon node; typically <EdIcon name="..." />. */
    icon: ReactNode;
    variant?: EdIconButtonVariant;
    size?: EdIconButtonSize;
    /**
     * For toggle behavior. When provided, button reflects the value via
     * aria-pressed and the "selected" visual state.
     */
    pressed?: boolean;
}

const variantClass: Record<EdIconButtonVariant, string> = {
    default: styles.default,
    bordered: styles.bordered,
    filled: styles.filled,
};

const sizeClass: Record<EdIconButtonSize, string> = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
};

/**
 * EdIconButton — icon-only action target.
 * `aria-label` is a required prop; the type system enforces that callers can't
 * forget it. Pair with an EdTooltip whenever the label isn't otherwise visible.
 *
 *   <EdIconButton aria-label="Search" icon={<EdIcon name="Search" />} />
 *   <EdIconButton aria-label="Pin" icon={<EdIcon name="Pin" />} pressed={isPinned} />
 */
export const EdIconButton = forwardRef<HTMLButtonElement, EdIconButtonProps>(function EdIconButton(
    {
        icon,
        variant = 'default',
        size = 'md',
        pressed,
        disabled,
        className,
        type,
        ...rest
    },
    ref,
) {
    const classes = [
        styles.root,
        variantClass[variant],
        sizeClass[size],
        pressed && styles.pressed,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            ref={ref}
            type={type ?? 'button'}
            className={classes}
            disabled={disabled}
            aria-pressed={pressed}
            {...rest}
        >
            {icon}
        </button>
    );
});
