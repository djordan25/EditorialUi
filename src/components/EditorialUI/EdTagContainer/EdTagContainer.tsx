import {
    forwardRef,
    useState,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import styles from './EdTagContainer.module.scss';

export interface EdTagContainerProps extends HTMLAttributes<HTMLDivElement> {
    /** Tag nodes — typically <EdTag> from Bundle 4. */
    children: ReactNode;
    /**
     * `wrap` (default) — flowing rows, for side panels / detail views.
     * `single-row` — one line; extras collapse into a "+N more" counter.
     */
    mode?: 'wrap' | 'single-row';
    /**
     * single-row only — show at most this many tags before collapsing.
     * Default 3. The rest fold into the overflow counter.
     */
    maxVisible?: number;
    /**
     * single-row only — render the overflow counter as a button. Receives the
     * hidden children. Omit for a non-interactive "+N more" label.
     */
    renderOverflow?: (hidden: ReactNode[], count: number) => ReactNode;
    /** Shown when there are no children. */
    empty?: ReactNode;
}

/**
 * EdTagContainer — layout primitive that lays out a collection of tags with
 * consistent gap + overflow rules. Wrap by default; single-row collapses to
 * "+N more". Don't invent a separate API per consumer — this owns the gap/overflow.
 *
 *   <EdTagContainer>
 *     <EdTag>credit-risk</EdTag><EdTag>retail</EdTag>…
 *   </EdTagContainer>
 *
 *   <EdTagContainer mode="single-row" maxVisible={3}
 *     renderOverflow={(hidden, n) => <EdTooltip …>+{n} more</EdTooltip>}>
 *     …
 *   </EdTagContainer>
 */
export const EdTagContainer = forwardRef<HTMLDivElement, EdTagContainerProps>(
    function EdTagContainer(
        { children, mode = 'wrap', maxVisible = 3, renderOverflow, empty, className, ...rest },
        ref,
    ) {
        const items = Array.isArray(children) ? children.flat() : [children];
        const realItems = items.filter((c) => c != null && c !== false);

        if (realItems.length === 0) {
            return (
                <div ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...rest}>
                    {empty ?? <span className={styles.emptyText}>No tags assigned</span>}
                </div>
            );
        }

        if (mode === 'single-row') {
            const visible = realItems.slice(0, maxVisible);
            const hidden = realItems.slice(maxVisible);
            const hiddenCount = hidden.length;
            return (
                <div
                    ref={ref}
                    className={[styles.root, styles.singleRow, className].filter(Boolean).join(' ')}
                    {...rest}
                >
                    {visible}
                    {hiddenCount > 0 &&
                        (renderOverflow ? (
                            renderOverflow(hidden as ReactNode[], hiddenCount)
                        ) : (
                            <span className={styles.overflow}>+{hiddenCount} more</span>
                        ))}
                </div>
            );
        }

        return (
            <div ref={ref} className={[styles.root, styles.wrap, className].filter(Boolean).join(' ')} {...rest}>
                {realItems}
            </div>
        );
    },
);
