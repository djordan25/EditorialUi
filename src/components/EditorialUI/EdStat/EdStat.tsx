import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './EdStat.module.scss';

export type EdStatTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface EdStatProps extends HTMLAttributes<HTMLDivElement> {
    /** Eyebrow label ("Runs", "Error rate"). */
    label: ReactNode;
    /** The figure, set in mono. */
    value: ReactNode;
    /** Colors the figure. Default neutral (ink). */
    tone?: EdStatTone;
}

/**
 * EdStat — one labelled figure. Lay several out with EdStatGrid, which draws the
 * hairlines between them.
 *
 *   <EdStatGrid columns={3}>
 *     <EdStat label="Runs" value="412" />
 *     <EdStat label="Error rate" value="1.20%" tone="warning" />
 *     <EdStat label="P95" value="2.84s" />
 *   </EdStatGrid>
 */
export const EdStat = forwardRef<HTMLDivElement, EdStatProps>(function EdStat(
    { label, value, tone = 'neutral', className, ...rest },
    ref,
) {
    return (
        <div ref={ref} className={[styles.stat, className].filter(Boolean).join(' ')} {...rest}>
            <div className={styles.label}>{label}</div>
            <div className={[styles.value, styles[tone]].join(' ')}>{value}</div>
        </div>
    );
});

export interface EdStatGridProps extends HTMLAttributes<HTMLDivElement> {
    /** Columns per row. Default 3. */
    columns?: number;
    children: ReactNode;
}

export const EdStatGrid = forwardRef<HTMLDivElement, EdStatGridProps>(function EdStatGrid(
    { columns = 3, className, style, children, ...rest },
    ref,
) {
    return (
        <div
            ref={ref}
            className={[styles.grid, className].filter(Boolean).join(' ')}
            style={{ ...style, '--ed-stat-columns': columns } as CSSProperties}
            {...rest}
        >
            {children}
        </div>
    );
});
