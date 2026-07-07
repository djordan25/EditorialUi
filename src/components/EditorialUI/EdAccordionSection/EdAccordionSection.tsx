import {
    forwardRef,
    type CSSProperties,
    type ElementRef,
    type ReactNode,
    type SyntheticEvent,
} from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import styles from './EdAccordionSection.module.scss';

const ITEM_VALUE = 'section';

export interface EdAccordionSectionProps {
    /** Compose an `<EdAccordionSummary>` + `<EdAccordionDetails>`. */
    children: ReactNode;
    /** Controlled expanded state. */
    expanded?: boolean;
    /** Uncontrolled initial expanded state. Default false. */
    defaultExpanded?: boolean;
    /**
     * Fires on expand/collapse with `(isExpanded, event)`. `event` is `null` — Radix's
     * value callback carries no event (adapt to a MUI `(event, isExpanded)` shape at the seam).
     */
    onExpandedChange?: (expanded: boolean, event: SyntheticEvent | null) => void;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
}

export interface EdAccordionSummaryProps {
    children: ReactNode;
    /** Override the expand indicator (rotates 180° when open). Defaults to a chevron. */
    expandIcon?: ReactNode;
    className?: string;
    /**
     * Note: the summary↔details ARIA association (`aria-controls` / `aria-labelledby`)
     * is wired automatically. Don't pass manual `id` / `aria-controls` — Radix owns the
     * panel id, so an override would dangle. (Adapters can accept them for source-compat
     * and drop them.)
     */
}

export interface EdAccordionDetailsProps {
    children?: ReactNode;
    className?: string;
}

/**
 * EdAccordionSection — a self-contained, single collapsible section with a compound
 * `EdAccordionSummary` + `EdAccordionDetails` API (MUI-Accordion-shaped). Each section
 * owns its own state, so independent sections don't need a shared parent. For a group of
 * mutually-exclusive/multi items driven by data, use EdAccordion; for a light chrome-less
 * show/hide, use EdDisclosure.
 *
 *   <EdAccordionSection defaultExpanded>
 *     <EdAccordionSummary>Closure evidence</EdAccordionSummary>
 *     <EdAccordionDetails>…</EdAccordionDetails>
 *   </EdAccordionSection>
 */
export const EdAccordionSection = forwardRef<
    ElementRef<typeof RadixAccordion.Root>,
    EdAccordionSectionProps
>(function EdAccordionSection(
    { children, expanded, defaultExpanded, onExpandedChange, disabled, className, style },
    ref,
) {
    const controlled = expanded !== undefined;
    const rootProps = {
        type: 'single' as const,
        collapsible: true,
        ...(controlled
            ? { value: expanded ? ITEM_VALUE : '' }
            : { defaultValue: defaultExpanded ? ITEM_VALUE : undefined }),
        onValueChange: onExpandedChange
            ? (v: string) => onExpandedChange(v === ITEM_VALUE, null)
            : undefined,
    };

    return (
        <RadixAccordion.Root
            ref={ref}
            className={[styles.root, className].filter(Boolean).join(' ')}
            {...rootProps}
        >
            <RadixAccordion.Item value={ITEM_VALUE} disabled={disabled} className={styles.item} style={style}>
                {children}
            </RadixAccordion.Item>
        </RadixAccordion.Root>
    );
});

/** The clickable header of an EdAccordionSection. */
export const EdAccordionSummary = forwardRef<
    ElementRef<typeof RadixAccordion.Trigger>,
    EdAccordionSummaryProps
>(function EdAccordionSummary({ children, expandIcon, className }, ref) {
    return (
        <RadixAccordion.Header className={styles.header}>
            <RadixAccordion.Trigger
                ref={ref}
                className={[styles.trigger, className].filter(Boolean).join(' ')}
            >
                <span className={styles.summaryContent}>{children}</span>
                <span className={styles.expandIcon} aria-hidden>
                    {expandIcon ?? <ChevronDown size={16} strokeWidth={1.8} />}
                </span>
            </RadixAccordion.Trigger>
        </RadixAccordion.Header>
    );
});

/** The collapsible content of an EdAccordionSection. */
export const EdAccordionDetails = forwardRef<
    ElementRef<typeof RadixAccordion.Content>,
    EdAccordionDetailsProps
>(function EdAccordionDetails({ children, className }, ref) {
    return (
        <RadixAccordion.Content
            ref={ref}
            className={[styles.content, className].filter(Boolean).join(' ')}
        >
            <div className={styles.contentInner}>{children}</div>
        </RadixAccordion.Content>
    );
});
