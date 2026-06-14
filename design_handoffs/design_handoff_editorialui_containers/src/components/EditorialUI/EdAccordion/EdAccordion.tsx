import {
    forwardRef,
    type ComponentPropsWithoutRef,
    type ElementRef,
    type ReactNode,
} from 'react';
import * as RadixAccordion from '@radix-ui/react-accordion';
import { ChevronRight } from 'lucide-react';
import styles from './EdAccordion.module.scss';

export interface EdAccordionItemData {
    /** Unique value for this item. */
    value: string;
    /** Trigger title. */
    title: ReactNode;
    /** Optional right-aligned mono meta (count, status). */
    meta?: ReactNode;
    /** Panel content. */
    content: ReactNode;
    disabled?: boolean;
}

type SingleProps = {
    type?: 'single';
    /** Allow collapsing the open item (single mode). Default true. */
    collapsible?: boolean;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};

type MultiProps = {
    type: 'multiple';
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
};

export type EdAccordionProps = {
    /** Items to render. */
    items: EdAccordionItemData[];
    className?: string;
} & (SingleProps | MultiProps);

/**
 * EdAccordion — vertically-stacked collapsible sections. Radix-backed, so it
 * gets arrow-key nav, Home/End, and roving focus for free.
 *
 * Single-open by default; pass `type="multiple"` for independent sections.
 * Keep it bounded — accordions hide content, which hurts scanning. Never hide
 * critical info; for sibling views prefer EdTabs.
 *
 *   <EdAccordion
 *     defaultValue="evidence"
 *     items={[
 *       { value: 'evidence', title: 'Closure evidence', meta: '3 documents', content: <…/> },
 *       { value: 'audit', title: 'Audit trail', meta: '14 entries', content: <…/> },
 *     ]}
 *   />
 */
export const EdAccordion = forwardRef<ElementRef<typeof RadixAccordion.Root>, EdAccordionProps>(
    function EdAccordion(props, ref) {
        const { items, className } = props;

        // Radix's Root is a discriminated union on `type`; thread the right props through.
        const rootProps =
            props.type === 'multiple'
                ? ({
                      type: 'multiple' as const,
                      value: props.value,
                      defaultValue: props.defaultValue,
                      onValueChange: props.onValueChange as ((v: string[]) => void) | undefined,
                  } satisfies ComponentPropsWithoutRef<typeof RadixAccordion.Root>)
                : ({
                      type: 'single' as const,
                      collapsible: props.collapsible ?? true,
                      value: props.value,
                      defaultValue: props.defaultValue,
                      onValueChange: props.onValueChange as ((v: string) => void) | undefined,
                  } satisfies ComponentPropsWithoutRef<typeof RadixAccordion.Root>);

        return (
            <RadixAccordion.Root
                ref={ref}
                className={[styles.root, className].filter(Boolean).join(' ')}
                {...rootProps}
            >
                {items.map((item) => (
                    <RadixAccordion.Item key={item.value} value={item.value} disabled={item.disabled} className={styles.item}>
                        <RadixAccordion.Header className={styles.header}>
                            <RadixAccordion.Trigger className={styles.trigger}>
                                <ChevronRight size={14} strokeWidth={1.8} className={styles.chev} aria-hidden />
                                <span className={styles.title}>{item.title}</span>
                                {item.meta && <span className={styles.meta}>{item.meta}</span>}
                            </RadixAccordion.Trigger>
                        </RadixAccordion.Header>
                        <RadixAccordion.Content className={styles.panel}>
                            <div className={styles.panelInner}>{item.content}</div>
                        </RadixAccordion.Content>
                    </RadixAccordion.Item>
                ))}
            </RadixAccordion.Root>
        );
    },
);
