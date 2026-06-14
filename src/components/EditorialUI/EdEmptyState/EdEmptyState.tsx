import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdEmptyState.module.scss';

export type EdEmptyStateTone = 'neutral' | 'danger' | 'success';
export type EdEmptyStateHeadingLevel = 'h2' | 'h3' | 'h4';

export interface EdEmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Decorative single-glyph icon — rendered inside the dashed circle. aria-hidden. */
    icon?: ReactNode;
    /** What's missing, in plain language. Sentence case, no punctuation. */
    title: ReactNode;
    /** Why + what unblocks it. ≤ 2 sentences. */
    body?: ReactNode;
    /** 0–2 actions — primary (unblock) + secondary (side path). Usually EdButtons. */
    actions?: ReactNode;
    /** Tones the visual ring + icon. `danger` for load errors, `success` for done-no-action. */
    tone?: EdEmptyStateTone;
    /** Compact padding + smaller visual for small panels (comment threads, widgets). */
    compact?: boolean;
    /** Heading level for the title — match the surrounding document outline. Default h2. */
    headingLevel?: EdEmptyStateHeadingLevel;
}

const toneClass: Record<EdEmptyStateTone, string> = {
    neutral: styles.toneNeutral,
    danger: styles.toneDanger,
    success: styles.toneSuccess,
};

/**
 * EdEmptyState — centered title + body + actions for a region with no data.
 * Always offer a next step where one exists. Institutional tone — no mascots,
 * no "Oops!", no animated illustrations.
 *
 *   <EdEmptyState
 *     icon={<EdIcon name="Inbox" size="lg" />}
 *     title="No findings in this period"
 *     body="Findings appear here once an examination opens."
 *     actions={<EdButton size="sm">Open audit period</EdButton>}
 *   />
 */
export const EdEmptyState = forwardRef<HTMLDivElement, EdEmptyStateProps>(function EdEmptyState(
    {
        icon,
        title,
        body,
        actions,
        tone = 'neutral',
        compact = false,
        headingLevel = 'h2',
        className,
        ...rest
    },
    ref,
) {
    const Heading = headingLevel;

    return (
        <div
            ref={ref}
            className={[
                styles.root,
                compact && styles.compact,
                toneClass[tone],
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {icon && (
                <div className={styles.visual} aria-hidden="true">
                    {icon}
                </div>
            )}
            <Heading className={styles.title}>{title}</Heading>
            {body && <p className={styles.body}>{body}</p>}
            {actions && <div className={styles.actions}>{actions}</div>}
        </div>
    );
});
