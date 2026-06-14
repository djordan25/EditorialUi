import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdStatusBadge.module.scss';

export type EdStatusBadgeStyle = 'soft' | 'solid' | 'outline';
export type EdStatusBadgeTone =
    | 'neutral'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'brand';

export interface EdStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** Label. Single mono-uppercase token; use `·` for separators. */
    children: ReactNode;
    /** soft (default — cells) / solid (high emphasis — escalations) / outline (read-only). */
    badgeStyle?: EdStatusBadgeStyle;
    /** Tone. Pair color with label — never a bare colored dot. */
    tone?: EdStatusBadgeTone;
    /** Show a 6px leading dot. Use for states that imply motion / recent change. */
    dot?: boolean;
    /**
     * Optional override for the accessible name. Useful when the badge replaces text
     * in a row — e.g. `ariaLabel="Status: Overdue"`.
     */
    ariaLabel?: string;
}

const styleClass: Record<EdStatusBadgeStyle, string> = {
    soft: styles.styleSoft,
    solid: styles.styleSolid,
    outline: styles.styleOutline,
};

const toneClass: Record<EdStatusBadgeTone, string> = {
    neutral: styles.toneNeutral,
    info: styles.toneInfo,
    success: styles.toneSuccess,
    warning: styles.toneWarning,
    danger: styles.toneDanger,
    brand: styles.toneBrand,
};

/**
 * EdStatusBadge — compact label for status, severity, or lifecycle.
 * Mono uppercase for institutional feel. Non-interactive — if users change status,
 * render a separate menu; do NOT attach onClick to the badge.
 *
 *   <EdStatusBadge tone="warning" dot>OPEN</EdStatusBadge>
 *   <EdStatusBadge badgeStyle="solid" tone="danger">MRA</EdStatusBadge>
 *   <EdStatusBadge tone="success">CLOSED</EdStatusBadge>
 */
export const EdStatusBadge = forwardRef<HTMLSpanElement, EdStatusBadgeProps>(
    function EdStatusBadge(
        {
            children,
            badgeStyle = 'soft',
            tone = 'neutral',
            dot = false,
            ariaLabel,
            className,
            ...rest
        },
        ref,
    ) {
        return (
            <span
                ref={ref}
                aria-label={ariaLabel}
                className={[
                    styles.root,
                    styleClass[badgeStyle],
                    toneClass[tone],
                    className,
                ]
                    .filter(Boolean)
                    .join(' ')}
                {...rest}
            >
                {dot && <span className={styles.dot} aria-hidden="true" />}
                <span className={styles.label}>{children}</span>
            </span>
        );
    },
);
