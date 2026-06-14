import {
    forwardRef,
    type HTMLAttributes,
    type ReactNode,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import styles from './EdCard.module.scss';

export type EdCardVariant = 'default' | 'flat' | 'ghost';

export interface EdCardProps extends HTMLAttributes<HTMLDivElement> {
    /** flat — no border (grouping only). ghost — dashed, for empty/add affordances. */
    variant?: EdCardVariant;
    /** Make the whole card a single interactive target — adds hover lift + pointer. */
    interactive?: boolean;
    /** Selected state for interactive cards (pickers, validator tiles). */
    selected?: boolean;
    /**
     * Render as the child element (Radix Slot) — use to make the card a real
     * <button> or <a> for interactive cards, instead of a div with a handler.
     */
    asChild?: boolean;
    children: ReactNode;
}

/**
 * EdCard — bordered surface for grouping related content. Dashboard tiles,
 * metadata panels, entity previews. Flat by default (no shadow) — the hairline
 * border is the affordance. NOT a replacement for tables.
 *
 *   <EdCard>
 *     <EdCardHeader eyebrow="Open findings · this period" title="87" />
 *     <EdCardBody>…</EdCardBody>
 *     <EdCardFooter>updated 11:42 UTC</EdCardFooter>
 *   </EdCard>
 *
 *   <EdCard asChild interactive selected={isActive}>
 *     <button onClick={pick}>…</button>
 *   </EdCard>
 */
export const EdCard = forwardRef<HTMLDivElement, EdCardProps>(function EdCard(
    { variant = 'default', interactive = false, selected = false, asChild = false, className, children, ...rest },
    ref,
) {
    const Comp = asChild ? Slot : 'div';
    return (
        <Comp
            ref={ref as never}
            data-selected={selected || undefined}
            className={[
                styles.root,
                variant === 'flat' && styles.flat,
                variant === 'ghost' && styles.ghost,
                interactive && styles.interactive,
                selected && styles.selected,
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {children}
        </Comp>
    );
});

/* ---- Subcomponents ---- */

export interface EdCardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Mono uppercase eyebrow above the title. */
    eyebrow?: ReactNode;
    /** Card title — rendered at `headingLevel`. */
    title?: ReactNode;
    headingLevel?: 'h2' | 'h3' | 'h4';
    /** Right-aligned adornment — a badge, chip, or icon button. */
    adornment?: ReactNode;
    children?: ReactNode;
}

export const EdCardHeader = forwardRef<HTMLDivElement, EdCardHeaderProps>(function EdCardHeader(
    { eyebrow, title, headingLevel = 'h3', adornment, className, children, ...rest },
    ref,
) {
    const Heading = headingLevel;
    return (
        <div ref={ref} className={[styles.header, className].filter(Boolean).join(' ')} {...rest}>
            <div className={styles.headerBody}>
                {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
                {title && <Heading className={styles.title}>{title}</Heading>}
                {children}
            </div>
            {adornment && <div className={styles.adornment}>{adornment}</div>}
        </div>
    );
});

export const EdCardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function EdCardBody({ className, children, ...rest }, ref) {
        return (
            <div ref={ref} className={[styles.body, className].filter(Boolean).join(' ')} {...rest}>
                {children}
            </div>
        );
    },
);

export const EdCardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    function EdCardFooter({ className, children, ...rest }, ref) {
        return (
            <div ref={ref} className={[styles.footer, className].filter(Boolean).join(' ')} {...rest}>
                {children}
            </div>
        );
    },
);
